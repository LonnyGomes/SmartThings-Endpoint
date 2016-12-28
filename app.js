//A port of example here: http://docs.smartthings.com/en/latest/smartapp-web-services-developers-guide/tutorial-part2.html
var express = require('express');
var path = require('path');
var config = require('./config.json');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var util = require('util');

var app = express();

//configure passport oauth2 middleware
var passport = require('passport');
var SmartThingsStrategy = require('passport-smartthings').Strategy;

passport.use(new SmartThingsStrategy({
    graphApiURL: 'https://graph-na02-useast1.api.smartthings.com',
    //authorizationURL: config.authorize_url,
    //tokenURL: config.token_url,
    clientID: config.client_id,
    clientSecret: config.client_secret,
    callbackURL: config.callback_url
  }/*,
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);

    cb();
  }*/
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'sessions_secret_val',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/api/authorize',
  passport.authenticate('smartthings', { scope: ['app'] })
);

app.get('/api/authorize/callback',
  passport.authenticate('smartthings', { scope: ['app'] }),
    function (req, res) {
      console.log(util.inspect(req.session.passport.user, {showHidden: false, depth: null}));

      res.redirect('/');
    }
  );

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
