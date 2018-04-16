# Agnostic Rate Limiter

## What's it?

Typescript Express Rate Limiter implementation. This implementation allows you to define several things like the key to map the requests, an skip function to determine when so skip request from limiter, etc. Further on the readme you can read about the different configurations.

## Installation

`npm install --save @mgiamberardino/express-rate-limiter`

## How to use it?

ES6:
```
import { ExpressRateLimiter } from '@mgiamberardino/express-rate-limiter';
//const { ExpressRateLimiter } = require('@mgiamberardino/express-rate-limiter');

const app = express();
...
const limiter = new ExpressRateLimiter(options);
app.use(limiter);
limiter.start();
...
const app = app.listen( ... );
// If you use graceful shutdown you shuld stop limiter there.
process.on('exit', () => {
    limiter.stop();
});
...
```

## Options

Using typescript you have an interface for the optiones:
```
import { ExpressRateLimiter, ExpressLimiterOptions } from '@mgiamberardino/express-rate-limiter';

const options:ExpressLimiterOptions = {
    limiterOptions: {
        keyMapper: ...,
        requestLimit: ...,
        timeWindow:...,
    },
    rejectStatusCode: ...,
    rejectMessage: ...,
};
const limiter = ExpressRateLimiter(options);
limiter.start();
app.use(limiter);
...
```
### Limiter Options

#### Request Limit

```
limiterOptions: {
    ...
    requestLimit: 250, // The number of calls allowed for the same key previous to start blocking.
    ...
}
```
#### Key Mapper
```
limiterOptions: {
    ...
    keyMapper: (req) => req.session.user, // A function to determine an identifier for the request.
    ...
}
```
#### Time Window
```
limiterOptions: {
    ...
    timeWindow: 1000, // The time window in milliseconds in which the requests will be analyzed.
    ...
}
```
#### Skip Function
```
limiterOptions: {
    ...
    skipFunction: (req) => !req.session.user, // A function to determine if a request should be ignored by the rate limiter.
    ...
}
```

### Reject Status Code
```
... = {
    ...,
    rejectStatusCode: 429, // Status code to use when rejecting requests
    ...,
}
```

### Reject Message
```
... = {
    ...,
    rejectMessage: 'Too Many Requests', // Status code to use when rejecting requests
    ...,
}
```