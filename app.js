//-----------STRIPE STRIPE STRIPE---------------------
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
const ensure            = require('connect-ensure-login');
const Student           = require('./models/student-model.js');
const Admin             = require('./models/admin-model.js');
const User              = require('./models/user-model.js');
// const flash             = require('connect-flash');

//Create initial instnaces and Connect to MongoDB using Mongoose
dotenv.config();
mongoose.connect(process.env.MONGODB_URI);
const app               = express();
const mailgun           = require('mailgun-js')({apiKey: process.env.KEY_MAILGUN_ACTIVE, domain: process.env.MAILGUN_DOMAIN});
const stripe            = require('stripe')(process.env.SECRET_KEY);

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

//-----------------START GOOGLE OAUTH--------------------
passport.use(new GoogleStrategy(
  {
    clientID:              process.env.KEY_GOOGLE_PUBLIC,
    clientSecret:          process.env.KEY_GOOGLE_SECRET,
    callbackURL:           process.env.KEY_GOOGLE_REDIRECT + '/auth/google/callback'
  },
  saveSocialUser
));

function saveSocialUser (accessToken, refreshToken, profile, done) {
  // See if there's a user from the provider with the given id.
  User.findOne(
    { provider: profile.provider, providerId: profile.id },
    (err, userDocument) => {
      // If there's an error or a user was retrieved, notify Passport by calling "done()".
      if (err || userDocument) {
        done(err, userDocument);
        return;
      }

      // Otherwise attempt to save a new user (no username or password).
      const names =       profile.displayName.split(' ');
      const theUser =     new User({
        firstName:        names[0],
        lastName:         names.slice(1).join(' '),
        provider:         profile.provider,
        providerId:       profile.id
      });

      theUser.save((err, userDocument) => {
        // Notify Passport about the result by calling "done()".
        done(err, userDocument);
      });
    }
  );
}

// Send logged-in user info into every view
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }
  next();
});
//-------------------END GOOGLE OAUTH---------------------

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
  res.locals.message    = err.message;
  res.locals.error      = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
