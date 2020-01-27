import * as Queue from 'bull'
import { MAIN_CENEO_QUEUE, BULL_REDIS_CONFIG, DEFAULT_BULL_JOB_CONFIG } from '../constants'
import { CeneoJob } from '../types'

const getCeneoJob = (url): CeneoJob => {
    return { url }
}

export default async (urls) => {
    const queue = new Queue(MAIN_CENEO_QUEUE, { redis: BULL_REDIS_CONFIG })
    const promises = urls.map(async url => queue.add(getCeneoJob(url), DEFAULT_BULL_JOB_CONFIG))
    await Promise.all(promises)
    console.log(`Ceneo Producer is done producing`)
    process.exit()
}