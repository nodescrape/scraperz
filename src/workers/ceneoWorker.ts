import * as fs from 'fs'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import * as Queue from 'bull'
import { wait } from '../utils'
import { CeneoJob, CeneoResult, CeneoOffer } from '../types';
import { MAIN_CENEO_QUEUE, AVAILABLE_CPUS, BULL_REDIS_CONFIG } from '../constants'

// TODO: Maybe this should be in constants?
const RELAVANT_RETAILERS = ["mediaexpert", "mediamarkt", "euro"]

const expandOffers = async (page) => {
    const remaining = await page.$eval('.remaining-offers-trigger', trigger => trigger.textContent)
    console.log(remaining)
    await page.$eval('.remaining-offers-trigger', trigger => trigger.click())
    // This is crap, but has to suffice for now
    await wait(500)
}
const normalizePrice = (price: string): number => +price.replace(',', '.')
const getRetailerPrice = (retailer: string, offers: CeneoOffer[]): number | void => { const obj = offers.find(el => el.retailer.match(retailer)); if (obj) return obj.price; }
const getRelevantRetailersPrices = (offers: CeneoOffer[]): Object => RELAVANT_RETAILERS.reduce((acc, retailer) => ({ ...acc, [`${retailer}Price`]: getRetailerPrice(retailer, offers) }), {})
const getProductName = ($): string => $(".product-name").eq(0).text()
const getProductPrice = ($): number => normalizePrice($('span.price').eq(0).text())
const getOffers = ($): CeneoOffer[] => {
    const scrapedOffersNoCheerio = []
    $('.product-offer').each(function () {
        const thisInContext = $(this)
        scrapedOffersNoCheerio.push({ price: normalizePrice(thisInContext.attr('data-price')), retailer: thisInContext.attr('data-shopurl') })
    })
    return scrapedOffersNoCheerio
}


const saveResult = (res: CeneoResult): void => {
    fs.writeFileSync(`${res.productName.replace('/', '-')}.json`, JSON.stringify(res), 'utf8');
}

const scrape = async ({ data: { url } }: CeneoJob): Promise<CeneoResult | { error: string }> => {
    try {

        // Init puppeteer
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Go to page and ensure all offers are visible
        await page.goto(url);
        await expandOffers(page)

        // Get content
        const content = await page.content();
        const $ = cheerio.load(content);

        // Extract relevant information
        const productName = getProductName($)
        const price = getProductPrice($)
        const offers = getOffers($)
        const prices = offers.map(el => el.price)
        const maxPrice = Math.max(...prices)
        const minPrice = Math.min(...prices)
        const relevantRetailerPrices = getRelevantRetailersPrices(offers)

        // Finalize
        await browser.close()
        return {
            url,
            productName,
            price,
            minPrice,
            maxPrice,
            totalOffers: offers.length,
            allOffers: offers,
            ...relevantRetailerPrices,
        }
    } catch (e) {
        console.log("Error during scraping:", e)
        return { error: e.message }
    }
}

export default async () => {
    const queue = new Queue(MAIN_CENEO_QUEUE, { redis: BULL_REDIS_CONFIG })
    queue.process(async (job: CeneoJob) => {
        console.log(`Executing job: ${job.id}`)
        try {
            const scrapedData = await scrape(job)
            if (!scrapedData.error)
                saveResult(scrapedData)
        } catch (e) {
            console.log("Error during job processing:", e)
        }
        console.log(`Done executing job: ${job.id}`)
    })
}