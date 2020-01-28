
import * as express from 'express'
import * as Arena from 'bull-arena'
import { MAIN_CENEO_QUEUE, BULL_REDIS_CONFIG } from './constants'

export const arena = () => {
    const router = express.Router();

    const arena_obj = Arena({
        queues: [
            {
                name: MAIN_CENEO_QUEUE,
                hostId: "Redis Labs",
                redis: BULL_REDIS_CONFIG
            },

        ]
    });
    router.use('/', arena_obj);
}