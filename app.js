// require( 'babel-register' )({ preset: [ 'react' ] });
var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var app = express();
var site = require('./client/site.js');

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(session({
    secret: 'mcdonalds summer drink days',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1800000,
        secure: false
    }
}));

global.navigator = {userAgent: 'all'}; // fix client/server checksum error for material-ui


app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'pug');

// favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


console.log( site );
const server = app.listen(site.default.port, '0.0.0.0', () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log("Listening at http://%s:%s", host, port);
});

module.exports = app;
