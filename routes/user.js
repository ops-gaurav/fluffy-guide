import express from 'express'
var router = express.Router();
import passport from 'passport';
import pLocal from 'passport-local';

import UserSchema from '../models/UserModel';
import config from '../data/config';
import mongoose from  'mongoose';

var User = mongoose.model ('user', UserSchema);

var LocalStrategy = pLocal.Strategy;

// we created a startegy here. now we assign it to a route
passport.use (new LocalStrategy ({
	usernameField: 'username',
	passwordField: 'password'
},function (username, password, done){
    mongoose.connect (config.host, config.db);
    User.findOne ({username: username}, (err, data) => {
        if (err) done (err);
        else if (data) 
            if (data.password == password) done (null, data);
            else done (null, false, {failureFlash: 'Incorrect Password'});
		else done (null, false, {failureFlash: 'Username error'});
        });
    mongoose.disconnect ();
}));

passport.serializeUser ((user, done) => {
    return done (null, user);
});
passport.deserializeUser ((user, done) => {
    done (null, user);
});
// failureFlash will insturct the passport to flash an error message using the message option set by the verify callback
router.post ('/auth', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: 'Invalid username or password'}), function (req, res) {
    res.redirect ('/');
    // if auth fail then passport will send 401 unauthorized error
});

router.post ('/signup', (req, res) => {
    let data = req.body;
    console.log (data);
    if (data.username && data.password && data.cPassword && data.email) {
        if (data.password == data.cPassword) {
            mongoose.connect (config.host, config.db);

            User.findOne ({username: data.username}, (err, doc) => {
                if (err) {
                    res.send ({status: 'error', message: 'some error occurred: '+ err});
                    mongoose.disconnect ();
                }
                else if (doc) {
                    res.send ({status: 'error', message: 'username already exists'});
                    mongoose.disconnect ();
                }
                else {
                    var user = new User ({
                        username: data.username,
                        email: data.email,
                        password: data.password
                    });

                    user.save ().then (() => {
                        res.send ({status: 'success', message: 'User created successfully'});
                        mongoose.disconnect ();
                    });
                }
            })
        } else {
            res.send ({status: 'error', message: 'Passwords did not match'});
        }
    } else {
        res.send ({status: 'error', message: 'All fields are required'});
    }
});

module.exports = router;