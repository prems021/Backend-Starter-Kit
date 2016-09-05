const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const account = new Schema({
  username: String,
  password: String
});

account.plugin(passportLocalMongoose);

export const Account = mongoose.model('accounts', account);
