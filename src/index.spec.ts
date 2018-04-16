import { ExpressRateLimiter, ExppressLimiterOptions } from './';
import * as http from 'http';
import * as request from 'supertest';
import * as expect from 'expect.js';

function createServer(limiter){

    return http.createServer((req, res) => {
        let mockRes:any = {
            code: 200,
            message: 'Success'
        };
        mockRes.status = code => {
            mockRes.code = code;
            return mockRes;
        };
        mockRes.send = message => mockRes.message = message;
        limiter(Object.assign({}, req, { ip: req.headers['remote-addr'] }), mockRes, () => {
            
        });
        res.statusCode = mockRes.code;
        res.end(mockRes.message);
    });
}

describe('Express Rate Limiter', () => {
    const limiter = ExpressRateLimiter({
        limiterOptions: {
            requestsLimit: 2,
            keyMapper: req => req.ip,
        }
    });
    const server = createServer(limiter);
    beforeEach(() => {
        limiter.start();
    });
    afterEach(() => {
        limiter.stop();
    });
    after(() => {
        server.close();
    });
    it('should reject the third request from same ip', () => {
        return Promise.all([1,2].map(() => request(server)
                            .get('/')
                            .set('Remote-Addr', '1.1.1.1')
                            .set('X-Forwarded-For', '1.1.1.1')
                            .expect(200)))
            .then(() => {
                console.log('Finished the first ones');
                return request(server)
                    .get('/')
                    .set('Remote-Addr', '1.1.1.1')
                    .set('X-Forwarded-For', '1.1.1.1')
                    .expect(429);
            });
    })
});