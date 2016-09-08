import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

const PayPal = require('paypal-express-checkout');

import { route } from './routes';
import { } from './models';
import { } from './controllers';

const app = express();
const db = mongoose.connection;

const API_USERNAME = 'shyamchen1994-facilitator-1_api1.gmail.com';
const API_PASSWORD = 'XKRPSZ8YQFEGBWGN';
const SIGNATURE = 'Am1RXnnyBcaD5yWEulWLUoTt4.1OAJD-jr.5wtljym9sbi6zyAzaPat-'

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connection Succeeded.'));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('stylus').middleware(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public')));

app.use(route);

let paypal = PayPal.init(
  API_USERNAME,
  API_PASSWORD,
  SIGNATURE,
  'http://localhost:3000/success',
  'http://localhost:3000/cancel',
  true
);

app.post('/pay', (req: any, res: any) => {
  // invoiceNumber, amount, description, currency, requireAddress, callback
  paypal.pay(Math.floor((Math.random() * 9000000000) + 1000000000), 400, 'Angular 2 Design Patterns and Best Practices', 'TWD', true, (err: any, url: any) => {
    if (err) { throw err; }
    res.redirect(url);
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
