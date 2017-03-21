import express from 'express'
var router = express.Router();
import passport from 'passport';
import pLocal from 'passport-local';

import UserSchema from '../models/UserModel';
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

router.post ('/auth', passport.authenticate('local', {
	successRedirect:"/success",
	failureRedirect: '/failure'
}));

module.exports = router;