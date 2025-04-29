import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { Bucket } from './bucket';

const app = new Koa();
const router = new Router();
const bucket = new Bucket(1, 10);

app.use(bodyParser());

router.get('/bucket', (ctx) => {
  ctx.body = JSON.stringify(bucket) + '\n';
});

router.get('/consume', (ctx) => {
  bucket.consume(10);
  ctx.body = JSON.stringify(bucket) + '\n';
});

router.get('/refill', (ctx) => {
  bucket.refill();
  ctx.body = JSON.stringify(bucket) + '\n';
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening in port: ' + port);
});
