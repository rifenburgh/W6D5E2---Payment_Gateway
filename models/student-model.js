const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const studentSchema     = new Schema({
  firstname:              String,
  lastname:               String,
  email:                  String,
  cohort:                 String,
  program:                String,
  city:                   String,
  balanceDue:             Number,
  transactionHistory:     Array
});

const Student           = mongoose.model('Student', studentSchema);
module.exports          = Student;
