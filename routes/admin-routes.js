const express           = require('express');
const adminRoutes       = express.Router();
const Admin             = require('../models/admin-model.js');
const Student           = require('../models/student-model.js');
const bcrypt            = require('bcrypt');
const passport          = require('passport');
const mongoose          = require('mongoose');
const ensure            = require('connect-ensure-login');
const mailgun           = require('mailgun-js')({apiKey: process.env.KEY_MAILGUN_ACTIVE, domain: process.env.MAILGUN_DOMAIN});

adminRoutes.get('/admin', (req, res, next) => {
  res.render('admin/index.ejs');
});

adminRoutes.get('/signup', (req, res, next) => {
  res.render('admin/login.ejs');
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
        res.redirect('/admin');
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
  successReturnToOrRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'You have successfully logged in.',
  passReqToCallback: true
  })
);

//-----GOOGLE OAUTH START-----
adminRoutes.get('/auth/google', passport.authenticate('google', {
  scope:                  ["https://www.googleapis.com/auth/plus.login",
                          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

adminRoutes.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect:        "/",
  failureRedirect:        "/login",
}));
//-----GOOGLE OAUTH END------

adminRoutes.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/admin');
});

adminRoutes.get('/createinvoice', ensure.ensureLoggedIn(), (req, res, next) => {
  const userInfo          = req.user;
  res.render('admin/createinvoice.ejs',{
    userInfo:               userInfo
  });
  console.log(req.user);
});

adminRoutes.post('/createinvoice', (req, res, next) => {
  const firstname         = req.body.firstname;
  const lastname          = req.body.lastname;
  const email             = req.body.email;
  const cohort            = req.body.cohort;
  const program           = req.body.program;
  const city              = req.body.city;
  const balanceDue        = req.body.balanceDue;
  studentInfo             = {
    firstname:              firstname,
    lastname:               lastname,
    email:                  email,
    cohort:                 cohort,
    program:                program,
    city:                   city,
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
    //EMail Notification on Invoice Creation
    const invoiceUrl      = '';
    const emailUpdate     = {
      from: `Robot <${process.env.EMAIL_SPAM}>`,
      to: email,
      subject: 'Invoice Created',
      text: `Good Morning, Please review your new Ironhack invoice.`
    };
    mailgun.messages().send(emailUpdate, function (error, body) {
      console.log(body);
    });
    //Redirect to the Admin Home page
    res.redirect('/admin');
  });
});

//UPDATE Student Data
adminRoutes.get('/payinvoice/:id/update', ensure.ensureLoggedIn(), (req, res, next) => {
  const id                = req.params.id;

  Student.findOne({ _id: id }, (err, item) => {
    if(err) {
      next(err);
      return;
    }
    res.render('admin/updatestudent.ejs', {
      item:               item,
    });
  });
});



//UPDATE Student POST Route is in the protected section.  Only Admins can update Student details.
adminRoutes.post('/updatestudent/:id', (req, res, next) => {
  const id                = req.params.id;
  const firstname         = req.body.firstname;
  const lastname          = req.body.lastname;
  const email             = req.body.email;
  const cohort            = req.body.cohort;
  const program           = req.body.program;
  const city              = req.body.city;
  const balanceDue        = req.body.balanceDue;
  studentInfo             = {
    firstname:              firstname,
    lastname:               lastname,
    email:                  email,
    cohort:                 cohort,
    program:                program,
    city:                   city,
    balanceDue:             balanceDue
  };

  Student.findByIdAndUpdate(id, studentInfo, (err, updates) => {
    if(err) {
      res.render('admin/createinvoice.ejs', {
        errorMessage: 'Unable to Create Student.'
      });
      return;
    }
    //EMail Notification on Invoice Updates
    const invoiceUrl      = '';
    const emailUpdate     = {
      from: `Robot <${process.env.EMAIL_SPAM}>`,
      to: email,
      subject: 'Updates Comleted',
      text: `Good Morning, Your invoice has beeen updated.`
    };
    mailgun.messages().send(emailUpdate, function (error, body) {
      console.log(body);
    });
    //POST-save and email notification redirect on UPDATES
    res.redirect('/outstandingbalance');
  });
});

adminRoutes.get('/sendemail/:id', (req, res, next) => {
  const id              = req.params.id;
  Student.findOne({ _id: id }, (err, item) => {
    if(err) {
      nextd(err);
      return;
    } else {
      if (item.email === '') {
        req.flash('message', 'User does not have a valid email address.');
        return;
      }
    }
    const studentUrl    = `${process.env.STUDENTURL}payinvoice/${item._id}`;
    let email           = item.email;
    console.log('Email ' + email);
    const emailUpdate   = {
      from: `Robot <${process.env.EMAIL_SPAM}>`,
      to: email,
      subject: 'Payment Reminder',
      text: `You have an unpaid balance on your student account.  ${studentUrl}`
    };
    mailgun.messages().send(emailUpdate, (error, body) => {
      console.log(body);
    });
    res.redirect('/outstandingbalance');
  });
});

adminRoutes.get('/outstandingbalance', (req, res, next) => {
  //Query all of the students with an open Tuition Balance and display their information on the screen
  //Include a button to send a payment reminder
  const studentMaps     = Student.find({}).exec();
  const userInfo        = req.user;
  Student.find({}, function(err, items){
        if(err){
          console.log(err);
        } else{
          res.render('admin/outstandingbalance.ejs', {
            items:       items,
            userInfo:    userInfo
          });
        }
    });
});

module.exports          = adminRoutes;
