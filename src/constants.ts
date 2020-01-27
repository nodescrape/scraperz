import * as os from 'os'

// REDIS - start

export const REDIS_HOST = "redis-12881.c92.us-east-1-3.ec2.cloud.redislabs.com"
export const REDIS_PORT = 12881
export const REDIS_PASSWORD = 'WfMzDWWN84Zlk8PiqUHXgtoSk4UiA8N9'


export const MAIN_CENEO_QUEUE = 'c_queue'
export const MAIN_CENEO_CHANNEL = 'c_channel'

// REDIS - end

// BULL - start

export const BULL_REDIS_CONFIG = { host: REDIS_HOST, password: REDIS_PASSWORD, port: REDIS_PORT }
export const DEFAULT_BULL_JOB_ATTEMPTS = 3
export const DEFAULT_BULL_JOB_CONFIG = { attempts: DEFAULT_BULL_JOB_ATTEMPTS }

// BULL - end

// WORKERS - start

export const AVAILABLE_CPUS = os.cpus().length

// WORKERS - end