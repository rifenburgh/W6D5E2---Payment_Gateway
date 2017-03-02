const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const ejs               = require('ejs');
const expressLayout     = require('express-ejs-layouts');
const mongoose          = require('mongoose');
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const session           = require('express-session');
const bcrypt            = require('bcrypt');
const User              = require('./models/user.js');
const stripe            = require('stripe');

const index             = require('./routes/index');
// var users = require('./routes/users');

//Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost/W6D5E2');


const app               = express();

//Stripe payment variables
const keyPublishable    = process.env.PUBLISHABLE_KEY;
const keySecret         = process.env.SECRET_KEY;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon.ico is used to display your websites image on the tab of the web browser
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayout);

app.use('/', index);
// app.use('/users', users);

app.set('layout', 'layout/main-layout');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
