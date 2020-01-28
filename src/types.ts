import { Job } from 'bull'

export interface ScrapingResult {
    url: string
}

export type CeneoJob = Job<{
    url: string
}>

export interface CeneoOffer {
    retailer: string,
    price: number
}

export type CeneoResult = ScrapingResult & {
    productName: string,
    price: number,
    totalOffers: number,
    minPrice: number,
    maxPrice: number,
    mediamarktPrice?: number,
    mediaexpertPrice?: number,
    euroPrice?: number,
    allOffers: CeneoOffer[]
}