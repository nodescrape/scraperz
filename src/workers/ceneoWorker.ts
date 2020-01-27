import * as fs from 'fs'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import * as Queue from 'bull'
import { wait } from '../utils'
import { CeneoJob, CeneoResult } from '../types';
import { MAIN_CENEO_QUEUE, AVAILABLE_CPUS, BULL_REDIS_CONFIG } from '../constants'

const normalizePrice = price => +price.replace(',', '.')
const getRetailerPrice = (retailer, offers) => { const obj = offers.find(el => el.retailer.match(retailer)); if (obj) return obj.price; }

const saveResult = (res: CeneoResult) => {
    return fs.writeFileSync(`${res.productName.replace('/', '-')}.json`, JSON.stringify(res), 'utf8');
}

const scrape = async ({ url }: CeneoJob): Promise<CeneoResult | { error: string }> => {
    try {

        // Init puppeteer
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Go to page and ensure all offers are visible
        await page.goto(url);
        const remaining = await page.$eval('.remaining-offers-trigger', trigger => trigger.textContent)
        console.log(remaining)
        await page.$eval('.remaining-offers-trigger', trigger => trigger.click())
        // This is crap, but has to suffice for now
        await wait(500)

        // Get content
        const content = await page.content();
        const $ = cheerio.load(content);

        // Extract relevant information
        const productName = $(".product-name").eq(0).text()
        const price = normalizePrice($('span.price').eq(0).text())
        // Escape cheerio 
        const offersNoCheerio = []
        $('.product-offer').each(function () {
            const thisInContext = $(this)
            offersNoCheerio.push({ price: normalizePrice(thisInContext.attr('data-price')), retailer: thisInContext.attr('data-shopurl') })
        })
        // This could be done in the above call, but seems cleaner this way
        const prices = offersNoCheerio.map(el => el.price)
        const maxPrice = Math.max(...prices)
        const minPrice = Math.min(...prices)
        const {
            mediaexpertPrice,
            mediamarktPrice,
            euroPrice
        } = ["mediaexpert", "mediamarkt", "euro"].reduce((acc, retailer) => ({ ...acc, [`${retailer}Price`]: getRetailerPrice(retailer, offersNoCheerio) }), {})
        await browser.close()
        return {
            url,
            productName,
            price,
            euroPrice,
            mediaexpertPrice,
            mediamarktPrice,
            minPrice,
            maxPrice,
            totalOffers: offersNoCheerio.length,
            allOffers: offersNoCheerio
        }
    } catch (e) {
        console.log(e)
        return { error: e.message }
    }
}

export default async () => {
    const queue = new Queue(MAIN_CENEO_QUEUE, { redis: BULL_REDIS_CONFIG })
    queue.process(async ({ id, data }: { data: CeneoJob }) => {
        console.log(id)
        try {
            const scrapedData = await scrape(data)
            if (!scrapedData.error)
                saveResult(scrapedData)
        } catch (e) {
            console.log(e)
        }
    })
}