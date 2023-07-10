const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const AWS = require('aws-sdk');
const dotenv = require('dotenv')

const port = process.env.PORT || 8080;
const indexRouter = require('./routes');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const contactsRouter = require('./routes/contacts')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
dotenv.config();

// Connect to AWS SDK
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWT_REGION
});

app.use('/api', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/contacts', contactsRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


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

app.listen(port, () => {
    console.log('Server started on port '+port);
});

module.exports = app;
