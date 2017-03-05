const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const studentSchema     = new Schema({
  username:               String,
  password:               String,
  email:                  String,
  cohort:                 String,
  program:                String,
  balanceDue:             Number,
  transactionHistory:     Array
});

const Student           = mongoose.model('Student', studentSchema);
module.exports          = Student;
