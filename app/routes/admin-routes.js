const express           = require('express');
const adminRoutes       = express.Router();
const Admin             = require('../models/admin-model.js');
const bcrypt            = require('bcrypt');

adminRoutes.get('/admin', (req, res, next) => {
  res.render('admin/index.ejs');
});
adminRoutes.get('/signup', (req, res, next) => {
  res.render('admin/signup.ejs');
});

adminRoutes.post('/signup', (req, res, next) => {
  let username          = req.body.username;
  let password          = req.body.password;
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
  res.render('admin/login.ejs');
});

module.exports          = adminRoutes;
