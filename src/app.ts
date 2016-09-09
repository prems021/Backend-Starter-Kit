import { join } from 'path';

import * as express from 'express';
const mongoose = require('mongoose');

import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

import { route } from './routes';
import { User } from './models';
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

app.use(logger('dev'));

app.use(require('stylus').middleware(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public')));

app.use(route);

passport
  .use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://www.example.com/auth/google/callback'
  },
  (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    User.findOrCreate({ googleId: profile.id }, (err: any, user: any) => {
      return cb(err, user);
    });
  }
));

app.use((req: any, res: any) => {
  res.status(404);
  res.send('Not Found!');
});

const server = app.listen(3001, 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Listening on http://localhost:${port}`);
});
