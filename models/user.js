const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const userSchema        = new Schema({
  username:               String,
  password:               String,
  email:                  String,
  cohort:                 String,
  balanceDue:             Number,
  transactionoHistory:    Array
});

const User              = mongoose.model('User', userSchema);
module.exports          = User;
