import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');

import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

const paypal = require('paypal-rest-sdk');

import { route } from './routes';
import { Account } from './models';
import { } from './controllers';

const app = express();
const db = mongoose.connection;

mongoose.connect('mongodb://localhost/paypal-rest-api');
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

// PayPal 組態
paypal.configure({
  "mode" : "sandbox",
  "client_id" : "AW7PzIc4hmQ8X9KjTJ1xQHCScIP8yJxwZ2Z0tOPOG8WMZeAWWsxTGanTlPh56ceVfVyvfX20SRa5pr88",
  "client_secret" : "EOQF2A8mvTpqfDt3O8t3Aizr1jGnFKVWaSkeGWmt8D5-JHJ6ycuNoEZue9ZI5DqenizAOS_HxVgaq8LF"
});

app.post('/pay', (req: any, res: any) => {
  // 建立使用 paypal 付款
  const paymentPaypal: any = {
    "intent": "sale",  // 銷售
    "payer": {
      "payment_method": "paypal"  // paypal 付款
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "amount": {
        "total": req.body.total,  // 後續商品從模型抓取
        "currency":  req.body.currency  // 後續商品從模型抓取
      },
      "description": req.body.description  // 後續商品從模型抓取
    }]
  };

  paypal.payment.create(paymentPaypal, (error: any, paymentRes: any) => {
    if (error) { throw error; } else {
      // 如果付款方式是 paypal 才執行 (另一種付款方式是 credit_card)
      if (paymentRes.payer.payment_method === 'paypal') {
        console.log(paymentRes);
        req.paymentId = paymentRes.id;
        let redirectUrl: string;
        for(let i = 0; i < paymentRes.links.length; i++) {
          let link = paymentRes.links[i];
          // rel: 'approval_url'
          if (link.method === 'REDIRECT') {
            redirectUrl = link.href;
            res.redirect(redirectUrl);
          }
        }
      }
    }
  });
});

app.get('/success', (req: any, res: any) => {
  const payer = { payer_id: req.query.PayerID };
  paypal.payment.execute(req.query.paymentId, payer, (err: any, paymentRes: any) => {
    if (err) { throw err; } else {
      console.log(paymentRes);
      const account: any = {
        state: paymentRes.state,
        description: paymentRes.transactions[0].description,
        amount: parseInt(paymentRes.transactions[0].amount.total),
        create_time: paymentRes.create_time
      };
      Account.create(account, (err: any, accounts: any) => {
        if (err) throw err;
        res.render('success', account);
      });
    }
  });
});

app.get('/cancel', (req: any, res: any) => {
  res.send('取消');
});

app.get('/transactions', (req: any, res: any) => {
  Account.find({ }, (err: any, accounts: any) => {
    if (err) throw err;
    res.render('transactions', { accounts: accounts });
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
