const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String
});

userSchema.plugin(findOrCreate);

export const User = mongoose.model('User', userSchema);
