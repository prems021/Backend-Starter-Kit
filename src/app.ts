import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

import * as routes from './routes';

import { Account } from './models';
import { } from './controllers';

const app = express();
const db = mongoose.connection;

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connection Succeeded.'));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

app.use(require('stylus').middleware(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public')));

app.use('/', routes);

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use((req: any, res: any, next: any) => {
  let err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: { }
  });
});

const server = app.listen(3001, 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Listening on http://localhost:${port}`);
});
