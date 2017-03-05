const express           = require('express');
const adminRoutes       = express.Router();
const Admin             = require('../models/admin-model.js');
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');
const passport          = require('passport');

adminRoutes.get('/admin', (req, res, next) => {
  res.render('admin/index.ejs');
});
adminRoutes.get('/signup', (req, res, next) => {
  res.render('admin/signup.ejs');
});

adminRoutes.post('/signup', (req, res, next) => {
  const username          = req.body.username;
  const password          = req.body.password;
  Admin.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('admin/signup.ejs', {message: 'This username already exists.'});
      return;
    }
    const salt          = bcrypt.genSaltSync(10);
    const hashPassword  = bcrypt.hashSync(password, salt);
    const newUser       = User({
      username:           username,
      encryptedPassword:  hashPassword
    });
    newAdmin.save((err) => {
      if(err) {
        res.render('admin/signup.ejs', {message: 'There was an error.' });
      } else {
        req.flash('success', 'You have successfully registered.');
        res.redirect('/login');
      }
    });
  });
});
adminRoutes.get('/login', (req, res, next) => {
  res.render('admin/login.ejs', {
    // errorMessage: req.flash('error', 'Ther was an issue.');
  });
});
adminRoutes.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'You have successfully logged in.',
  passReqToCallback: true
  })
);
adminRoutes.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/admin');
});
adminRoutes.get('/createinvoice', (req, res, next) => {
  res.render('admin/createinvoice.ejs');
});
adminRoutes.post('/createinvoice', (req, res, next) => {
  const username          = req.body.username;
  const password          = req.body.password;
  const email             = req.body.email;
  const cohort            = req.body.cohort;
  const program           = req.body.program;
  const balanceDue        = req.body.balanceDue;
  studentInfo             = {
    username:               username,
    password:               password,
    email:                  email,
    cohort:                 cohort,
    program:                program,
    balanceDue:             balanceDue
  };
  const newStudent        = new Student(studentInfo);
  newStudent.save((err) => {
    if(err) {
      res.render('admin/createinvoice.ejs', {
        errorMessage: 'Unable to Create Student.'
      });
      return;
    }
    res.redirect('/admin');
  });
});

module.exports          = adminRoutes;
