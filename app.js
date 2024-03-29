var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment');

var flash = require('connect-flash');


//login web mysql
//var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
//end login

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use('/javascripts', express.static(__dirname + '/public/javascripts/'));
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets/'));

//login web mysql
app.use(session({
	secret: 'secret',
	resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }//for flash
}));

//for flash
app.use(cookieParser('secretString'));
//app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//end login

app.use((req, res, next) => {
  //console.log("LOGGED: "+moment().format('LLLL')+" locate: "+moment.locale())
  //res.locals.message = req.flash();//for flash
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next()
})

require("./routes/contact")(app);
require("./routes/showitem")(app);
require("./routes/taglist")(app);
require("./routes/search")(app);
require("./routes/event1")(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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



let port = 5555;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

module.exports = app;
