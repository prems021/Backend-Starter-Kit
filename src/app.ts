import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');

import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

const Paypal = require('paypal-adaptive');

import { route } from './routes';
import { } from './models';
import { } from './controllers';

const app = express();
const db = mongoose.connection;

const paypalSdk = new Paypal({
  userId: 'shyamchen1994-facilitator-1_api1.gmail.com',
  password: 'XKRPSZ8YQFEGBWGN',
  signature: 'Am1RXnnyBcaD5yWEulWLUoTt4.1OAJD-jr.5wtljym9sbi6zyAzaPat-',
  sandbox: true
});

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connection Succeeded.'));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));

app.use(require('stylus').middleware(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public')));

app.use(route);

app.post('/pay', (req: any, res: any) => {
  let payload: any = {
    requestEnvelope: {
      errorLanguage:  'en_US'
    },
    actionType: 'PAY',
    currencyCode: req.body.currency,
    returnUrl: 'http://localhost:3000/success',
    cancelUrl: 'http://localhost:3000/cancel',
    feesPayer: 'SENDER',
    receiverList: {
      receiver: [{
        email: 'shyamchen1994-facilitator-1@gmail.com',
        amount: req.body.total * 0.1
      }, {
        email: 'shyamchen1994-facilitator@gmail.com',
        amount: req.body.total * 0.9
      }]
    }
  };
  paypalSdk.pay(payload, (err: any, paypalRes: any) => {
    if (err) { throw err; }
    console.log(paypalRes);
    res.redirect(paypalRes.paymentApprovalUrl);
  });
});

app.get('/success', (req: any, res: any) => {
  res.send('Success');
});

app.get('/cancel', (req: any, res: any) => {
  res.send('Cancel');
});

app.use((req: any, res: any) => {
  res.status(404);
  res.send('Not Found!');
});

const server = app.listen(3001, 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Listening on http://localhost:${port}`);
});
