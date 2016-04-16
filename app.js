//express所需
var express = require('express');
var path = require('path');
// parser
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');


// 网站图标
var favicon = require('serve-favicon');
//日志
var logger = require('morgan');
// 文件操作
var fs = require('fs');
/* 配置 */
var settings = require('./models/db/settings')
// 模板引擎
var partials = require('express-partials');
/* 路由 */
var routes = require('./routes/index');
// admin
var admin = require('./routes/admin');
//validate/
var validate=require("./routes/validate")
// User
var user = require('./routes/user');
//// Shop
//var shop = require('./routes/shop');
//// validate
//var validate = require('./routes/validate');
// api
var api = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//log and parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: settings.session_secret,
    resave: false,
    saveUninitialized: true
}));
//静态目录
app.use(express.static(path.join(__dirname, 'public')));

//指定路由
app.use('/', validate);

app.use(function (req, res, next) {
    // for user
    res.locals.logined = req.session.logined;
    res.locals.userInfo = req.session.user;
    // for Administrator
    res.locals.adminlogined = req.session.adminlogined;
    res.locals.adminUserInfo = req.session.adminUserInfo;
    // for domain
    res.locals.curDomain = req.headers.host;

    next();
});

app.use('/admin', admin);
app.use('/api', api);
app.use('/user', user);
app.use('/', routes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
