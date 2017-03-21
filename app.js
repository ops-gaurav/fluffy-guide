import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import passport from 'passport';
import pLocal from 'passport-local';
import sassMiddleware from 'node-sass-middleware';
import index from './routes/index';

import UserSchema from './models/UserModel';
import mongoose from  'mongoose';

var User = mongoose.model ('user', UserSchema);

var LocalStrategy = pLocal.Strategy;

passport.use (new LocalStrategy (function (username, password, done){
  User.findOne ({username: username}, (err, data) => {
    if (err) return done (err);
    else if (data) 
      if (data.password == password)
        return done (null, data);
      else return done (null, false, {message: 'Incorrect Password'});
    else return done (null, false, {message: 'Username error'})
  });
}));

const app = express();
const debug = Debug('desc-task:app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

export default app;
