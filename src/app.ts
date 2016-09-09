import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');

import * as bodyParser from 'body-parser';
const cookieParser = require('cookie-parser');
import * as logger from 'morgan';

const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(logger('dev'));

app.use(require('stylus').middleware(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(route);

passport
  .use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    return cb(null, profile);
  }));

passport.serializeUser((user: any, cb: any) => {
  cb(null, user);
});

passport.deserializeUser((obj: any, cb: any) => {
  cb(null, obj);
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    // res.render('profile', { user: req.user });
  });

app.use((req: any, res: any) => {
  res.status(404);
  res.send('Not Found!');
});

const server = app.listen(3001, 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Listening on http://localhost:${port}`);
});
