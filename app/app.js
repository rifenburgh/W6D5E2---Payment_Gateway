//-----------STRIPE STRIPE STRIPE---------------------
//START DEVELOPMENT (Stripe)
// const PUBLISHABLE_KEY   = 'pk_test_6pRNASCoBOKtIshFeQd4XMUh';
// const SECRET_KEY        = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
// const creditCard        = '4242 4242 4242 4242';
//END DEVELOPMENT (Stripe)
//Stripe payment variables -
//Use For PRODUCTION (Stripe)
const keyPublishable    = process.env.PUBLISHABLE_KEY;
const keySecret         = process.env.SECRET_KEY;

//-----------STRIPE STRIPE STRIPE---------------------

const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const ejs               = require('ejs');
const expressLayout     = require('express-ejs-layouts');
const dotenv            = require('dotenv');
const mongoose          = require('mongoose');
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy;
const session           = require('express-session');
const bcrypt            = require('bcrypt');
const flash             = require('connect-flash');
// const User              = require('./models/user.js');
const Student           = require('./models/student-model.js');
const Admin             = require('./models/admin-model.js');
const stripe            = require('stripe')(keySecret);
// const flash             = require('connect-flash');

// var users = require('./routes/users');


//Connect to MongoDB using Mongoose


dotenv.config();
mongoose.connect(process.env.MONGODB_URI);
const app               = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon.ico is used to display your websites image on the tab of the web browser
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express-EJS-Layout
app.use(expressLayout);
app.set('layout', 'layout/main-layout');

//Flash Notifications
app.use(flash());

//Session Processing
app.use(session({
  secret: 'this is a unique key to this application to support',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, next) => {
  Admin.findOne({ username }, (err, user) => {
    if (err) {
      next(err);
    } else if (!user) {
      next(null, false, { message: "Incorrect username" });
    } else if (!bcrypt.compareSync(password, user.encryptedPassword)) {
      next(null, false, { message: "Incorrect password" });
    } else {
      next(null, user);
    }
  });
}));
passport.use(new GoogleStrategy({
  clientID: process.env.KEY_GOOGLE_PUBLIC,
  clientSecret: process.env.KEY_GOOGLE_SECRET,
  callbackURL: process.env.HOST_ADDRESS + '/auth/google/callback'
}, (accessToken, refreshToken, profile, next) => {
  next(null, profile);
}));

passport.serializeUser((user, cb) => {
  if (user.provider) {
    cb(null, user);
  } else {
    cb(null, user._id);
  }
});

passport.deserializeUser((id, cb) => {
  if (id.provider) {
    cb(null, id);
    return;
  }

  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});



//START Routes
const index             = require('./routes/index');
const studentRoutes     = require('./routes/student-routes');
const adminRoutes       = require('./routes/admin-routes');
app.use('/', index);
app.use('/', studentRoutes);
app.use('/', adminRoutes);
// app.use('/users', users);
//END Routes

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
