//authorization URL = http://layer3tv.adriansosa.co

var express     = require('express');
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var config      = require('./config');
var User        = require('./models/user');
var url         = require('url');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect(config.database);
app.set('superSecret', config.secret)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var alexaUrl;

app.get('/privacy', function(req, res, next){
  res.render('privacy/index');
})

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Close Sesame'});
  alexaUrl = req.url; 
});

app.post('/token', function(req,res,next){
  // User.findOne({
  //   name: req.body.name
  // }), function(err, user){
  //   if(err) throw err;

  //   if(!user){
  //     var add = new User({
  //       name: req.body.name,
  //       password: req.body.password,
  //       admin: false
  //     })
  //     add.save(function(err){
  //       if(err) throw err;

  //       //give token
  //     })
  //   } else if (user){
  //     if(user.password !== req.body.password){
  //       res.send('Authorization failed due to wrong password');
  //     }else {y
        var obj = {};
        obj.email = req.body.email;
        obj.password = req.body.password;

        var token = jwt.sign(obj, app.get('superSecret'), {
          expiresIn: '4h'
        });
       
        var state = alexaUrl.state;
        var client_id = 'alexa-skill';
      // }
  //   }
  // }
  res.redirect("https://pitangui.amazon.com/api/skill/link/M38JU6PT197KHZ&state=" + state + "&code=" + token)

});

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
