const express           = require('express');
const studentRoutes     = express.Router();
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');

studentRoutes.get('/payinvoice', (req, res, next) => {
  res.render('student/payinvoice.ejs');
});

module.exports = studentRoutes;
