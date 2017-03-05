const express           = require('express');
const studentRoutes     = express.Router();
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');

studentRoutes.get('/payinvoice/:id', (req, res, next) => {
  res.render('student/payinvoice.ejs',{
    email: email,
    balanceDue: balanceDue,
    cohort: cohort,
    program: program
  });
});
//Process successful payment and deduct from balanceDue 
studentRoutes.post('/payinvoice/:id', (req, res, next) => {});

module.exports = studentRoutes;
