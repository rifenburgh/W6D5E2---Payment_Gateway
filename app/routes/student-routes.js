const express           = require('express');
const studentRoutes     = express.Router();
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');
const keyPublishable    = process.env.PUBLISHABLE_KEY;
const stripe            = require('stripe')(process.env.SECRET_KEY);

//include the /:ID variable in routes as soon as it is available
//Static ID exists is 2nd item in MongoDB.W6D5E2.students
studentRoutes.get('/payinvoice/:id', (req, res, next) => {
  const id              = req.params.id;
  Student.findById(id, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    const balanceDue    = (item.balanceDue * 100);
    res.render('student/payinvoice.ejs',{
      item:               item,
      balanceDue:         balanceDue,
      keyPublishable:     keyPublishable
    });
  });
});

//Process successful payment and deduct from balanceDue
studentRoutes.post('/payinvoice/:id', (req, res, next) => {
  const id              = req.params.id;
  Student.findById({ id }, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    const balanceDue    = item.balanceDue;

  });

  // const token           = req.body.stripeToken;
  // console.log(token);
  balanceZero = {
    balanceDue: 0
  };
  // const Charge          = stripe.charges.connect({
  //   amount:               balanceDue,
  //   currency:             'usd',
  //   description:          'tuition payment',
  //   source:               token
  // }, function (err, charge) {
  //     console.log(charge);
  //     res.redirect('/payinvoice');
  // });

  //Does NOT check for payment before zeroing balance
  Student.findByIdAndUpdate(id, balanceZero, (err, updates) => {
  });
  res.redirect('/thankyou');
});
//UPDATE Student Data
studentRoutes.get('/payinvoice/:id/update', (req, res, next) => {
  const id              = req.params.id;

  Student.findOne({ _id: id }, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    // console.log(item);
    // console.log(typeof item);
    res.render('admin/updatestudent.ejs', {
      item:               item,
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
studentRoutes.get('/thankyou', (req, res, next) => {
  res.render('student/thankyou.ejs')
});
module.exports = studentRoutes;
