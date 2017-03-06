const express           = require('express');
const studentRoutes     = express.Router();
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');
const keyPublishable    = process.env.PUBLISHABLE_KEY;

//include the /:ID variable in routes as soon as it is available
//Static ID exists is 2nd item in MongoDB.W6D5E2.students
studentRoutes.get('/payinvoice/:id', (req, res, next) => {
  const id              = req.params.id;
  Student.findById(id, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    res.render('student/payinvoice.ejs',{
      item:               item
    });
  });
});

//Process successful payment and deduct from balanceDue
studentRoutes.post('/payinvoice/:id', (req, res, next) => {

});
studentRoutes.get('/payinvoice/:id/update', (req, res, next) => {
  const id              = req.params.id;

  Student.findOne({ _id: id }, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    const firstname     = item.firstname;
    const lastname      = item.lastname;
    console.log(item);
    console.log(typeof item);
    res.render('admin/updatestudent.ejs', {
      item:               item,
      firstname:          firstname,
      lastname:           lastname,
      email:              item.email
    });
  });
});
studentRoutes.get('/payinvoice/:id/delete', (req, res, next) => {
  const id              = req.params.id;
  Student.findByIdAndRemove(id, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    res.redirect('/outstandingbalance');
  });
});
module.exports = studentRoutes;
