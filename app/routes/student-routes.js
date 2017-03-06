const express           = require('express');
const studentRoutes     = express.Router();
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');
const keyPublishable    = process.env.PUBLISHABLE_KEY;

//include the /:ID variable in routes as soon as it is available
//Static ID exists is 2nd item in MongoDB.W6D5E2.students
studentRoutes.get('/payinvoice', (req, res, next) => {
  Student.findOne({name: '58bc4afe0bbf3f4b3c5a17e3'}, (err, items) => {
    // const email         = items.email;
  });
  res.render('student/payinvoice.ejs',{
    // items:                items
    // email:                email,
    // balanceDue:           balanceDue,
    // cohort:               cohort,
    // program:              program,
    // keyPublishable:       keyPublishable
  });
});
//Process successful payment and deduct from balanceDue
studentRoutes.post('/payinvoice/:id', (req, res, next) => {

});

module.exports = studentRoutes;
