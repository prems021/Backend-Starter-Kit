import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');

import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

const paypal = require('paypal-rest-sdk');

import { route } from './routes';
import { } from './models';
import { } from './controllers';

const app = express();
const db = mongoose.connection;

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connection Succeeded.'));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('stylus').middleware(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public')));

app.use(route);

const config: any = {
  "port" : 3000,
  "api" : {
    "mode" : "sandbox",
    "client_id" : "AW7PzIc4hmQ8X9KjTJ1xQHCScIP8yJxwZ2Z0tOPOG8WMZeAWWsxTGanTlPh56ceVfVyvfX20SRa5pr88",
    "client_secret" : "EOQF2A8mvTpqfDt3O8t3Aizr1jGnFKVWaSkeGWmt8D5-JHJ6ycuNoEZue9ZI5DqenizAOS_HxVgaq8LF"
  }
};

paypal.configure(config.api);

app.get('/success', (req: any, res: any) => {
  res.send('交易完成');
});

app.get('/cancel', (req: any, res: any) => {
  res.send('交易取消');
});


/*
 * 其他
 * create_with_credit_card
 * create_with_saved_credit_card
 */
app.post('/paynow', (req: any, res: any) => {
  // create_with_paypal
  let payment: any = {
    "intent": "sale",  // sale, order
    "payer": {
      "payment_method": "paypal"  // paypal, credit_card
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      // "item_list": {
      //   "items": [{
      //     "name": req.body.name,
      //     "sku": req.body.sku,
      //     "price": req.body.price,
      //     "currency": req.body.currency,
      //     "quantity": req.body.quantity
      //   }]
      // },
      "amount": {
        "total": parseInt(req.body.total),
        "currency":  req.body.currency
      },
      "description": req.body.description
    }]
  };

  paypal.payment.create(payment, (error: any, payment: any) => {
    if (error) {
      console.log(error);
    } else {
      if(payment.payer.payment_method === 'paypal') {
        console.log(payment);
        req.paymentId = payment.id;
        let redirectUrl: string;
        for(let i = 0; i < payment.links.length; i++) {
          let link = payment.links[i];
          if (link.method === 'REDIRECT') {
            redirectUrl = link.href;
          }
        }
        res.redirect(redirectUrl);
      }
    }
  });
});

app.use((req: any, res: any) => {
  res.status(404);
  res.send('Not Found!');
});

const server = app.listen(3001, 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Listening on http://localhost:${port}`);
});
