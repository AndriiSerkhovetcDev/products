const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
const AWS = require('aws-sdk');

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');

const app = express();
const mongoDBUrl = 'mongodb+srv://andriiserkhovetcdev:vkyGegste8tZEhP4@products.xokp2rc.mongodb.net/Product';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// connect to MongoDB
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

// Connect to AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAVJU5PL6ZTXHZ3B4T',
    secretAccessKey: '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',
    region: 'eu-north-1'
});

app.use('/', indexRouter);
app.use('/api/products', productsRouter);
app.use('/uploads', express.static('uploads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
