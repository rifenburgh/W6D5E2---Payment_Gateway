const express           = require('express');
const routes            = express.Router();
const User              = require('../models/user.js');
const bcrypt            = require('bcrypt');

routes.get('/', (req, res, next) => {});
routes.get('/signup', (req, res, next) => {});
routes.post('/signup', (req, res, next) => {});

//Pay Invoice
routes.get('/payinvoice/:id', (req, res, next) => {});
routes.get('/payinvoice/:id', (req, res, next) => {});

//Routes Available Post Login
//--This route requires login for all subsequent logins
routes.use((req, res, next) => {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
});

//Create invoices that will be viewed by the payee
routes.get('/createinvoice', (req, res, next) => {});
routes.post('/creatinvoice', (req, res, next) => {});

//Reporting
//General reporting of invoices paid/outstanding 
routes.get('/viewinvoice', (req, res, next) => {});
routes.get('/bymonth', (req, res, next) => {});
routes.get('/bycohort', (req, res, next) => {});
