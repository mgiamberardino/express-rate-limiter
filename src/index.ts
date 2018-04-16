import { RateLimiter, RateLimiterOptions } from '@mgiamberardino/rate-limiter';
import { Request } from 'express';

export interface ExppressLimiterOptions {
    limiterOptions?: RateLimiterOptions;
    rejectStatusCode?: number;
    rejectMessage?: String;
}

const defaultOptions:ExppressLimiterOptions = {
    rejectStatusCode: 429,
    rejectMessage: 'Too many requests',
    limiterOptions: {
        keyMapper: (req:Request) => req.ip
    }
}

export function ExpressRateLimiter (options?:ExppressLimiterOptions) {

    const config = Object.assign({}, defaultOptions, options)
    const limiter = new RateLimiter(config.limiterOptions);
    function middleware(req, res, next) {
        if (limiter.isValid(req)) {
            return next();
        }
        res.status(config.rejectStatusCode)
           .send(config.rejectMessage);
    }

    return Object.assign(middleware, { start: limiter.start.bind(limiter), stop: limiter.stop.bind(limiter)});
}