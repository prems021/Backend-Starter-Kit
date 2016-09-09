const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  state: String,
  description: String,
  amount: Number,
  create_time: Date
});

export const Account = mongoose.model('Account', accountSchema);
