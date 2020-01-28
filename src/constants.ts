import * as os from 'os'
import * as dotenv from 'dotenv';
dotenv.config();

// REDIS - start

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD

export const MAIN_CENEO_QUEUE = 'c_queue'

// REDIS - end

// BULL - start

export const BULL_REDIS_CONFIG = { host: REDIS_HOST, password: REDIS_PASSWORD, port: REDIS_PORT }
export const DEFAULT_BULL_JOB_ATTEMPTS = 3
export const DEFAULT_BULL_JOB_CONFIG = { attempts: DEFAULT_BULL_JOB_ATTEMPTS }

// BULL - end

// WORKERS - start

export const AVAILABLE_CPUS = os.cpus().length

// WORKERS - end