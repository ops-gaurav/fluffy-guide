import express from 'express'
var router = express.Router();
import passport from 'passport';
import pLocal from 'passport-local';
import UserSchema from '../models/UserModel';
import config from '../data/config';
import mongoose from  'mongoose';
import multer from 'multer';
import fs from 'fs';
import es6P from 'es6-promise';

const es6Promise = es6P.Promise;

var User = mongoose.model ('user', UserSchema);

var LocalStrategy = pLocal.Strategy;

// configure the storage location and filename
// after saving image on secondary storage on server, load it
// and save it in mongo db using fs.readFileSync()
// rember for remove file after persisting into the db
var storage = multer.diskStorage ({
	destination: (req, file, next) => {
		next (null, 'tempUploads/');
	},
	filename: (req, file, next) => {
		req.image = {};
		req.image.mimetype = file.mimetype;
		next (null, req.user.username+ '_avatar');
	}
});

var upload = multer({storage: storage}).single ('avatar');

// we created a startegy here. now we assign it to a route
passport.use ('LocalLoginAuthentication', new LocalStrategy ({
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
/*
UNDERSTAND THIS CONCEPT flash
*/
router.post ('/auth', passport.authenticate ('LocalLoginAuthentication', {
	failureFlash: 'Error Authenticating', 
	successFlash: 'Authenticated'}), (req, res) => {
	
    res.send ({status: 'success', message: 'authenticated'});
});

router.get ('/sessioninfo', (req, res) => {
    if (req.isAuthenticated())
        res.send ({status: 'success', data: req.user});
    else
        res.send ({status: 'error', message: 'Login first'});
});

router.get ('/logout', (req, res) => {
    req.logout();
    res.send ({status: 'success', message: 'Session destroyed'});
});

// router.put ('/image', upload.single ('avatar'), (req, res) => {

// 	// mongoose.Promise = es6Promise;
// 	// mongoose.connect (config.host, config.db);

// 	// User.findOne ({username: req.user.username}, (err, doc) => {
// 	// 	if (err) res.send ({status: 'error', message: 'Error: '+ err});
// 	// 	else if (doc) {
// 	// 		//doc.photo = fs.readFileSync ('tempUploads/'+ req.user.username+'_avatar');
// 	// 		fs.readFile ('tempUploads/'+ req.user.username +'_avatar', (data) =>{
// 	// 			doc.photo = {
// 	// 				mime: req.image.mimetype,
// 	// 				value: data
// 	// 			};
// 	// 			doc.save (). then (() => {
// 	// 				res.send ({status: 'success', message: 'saved in db'});
// 	// 			});
// 	// 		});
// 	// 		// doc.photo = {
// 	// 		// 	mime: req.image.mimetype,
// 	// 		// 	value: fs.readFile
// 	// 		// };
// 	// 	} else res.send ({status: 'error', message: 'No user'});

// 	// 	mongoose.disconnect ();
// 	// });
// 	res.end();
// });

router.get ('/image', (req, res) => {
	if (req.user) {
		mongoose.Promise = es6Promise;
		mongoose.connect (config.host, config.db);

		User.findOne ({username: req.user.username}, (err, doc) => {
			if (err) {
				res.send ({status: 'error', message: 'server error: '+ err});
				mongoose.disconnect ();
			}
			else if (doc) {
                // check if image exists in database
                if (doc.photo.mime){
                    // send the image
                    res.contentType (doc.photo.mime);
				    res.send (doc.photo.value);
                } else {
                    // send default pic otherwise
                    var image = fs.readFileSync (__dirname +'/../public/images/profile.png');
                    res.writeHead (200, {'Content-Type': 'image/png'});
                    res.end (image, 'binary');
                } 
				mongoose.disconnect ();
			} else {
				res.send ({status: 'error', message: 'No data'});
				mongoose.disconnect ();
			}
		});
	} else res.send ({status: 'error', message: 'no session'});
});
router.put ('/image', (req, res) => {
	upload (req, res, function (err) {
		if (err) res.send ({status: 'error', message: 'error uploading'});
		else {
			mongoose.Promise = es6Promise;
			mongoose.connect (config.host, config.db);

			User.findOne ({username: req.user.username}, (err, doc) => {
				if (err) { 
					res.send ({status: 'error', message: 'Error '+ err});
					mongoose.disconnect ();
				}
				else if (doc) {
					doc.photo = {
						mime: req.image.mimetype,
						value: fs.readFileSync ('tempUploads/'+ req.user.username +'_avatar')
					}

					doc.save ().then (() => {
						res.send ({status: 'success'});
						fs.unlinkSync ('tempUploads/'+ req.user.username +'_avatar');
						mongoose.disconnect ();
					});
				} else {
					res.send ({status: 'error', message: 'User not found'});
					mongoose.disconnect ();
				}
			});
		}
	});
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

router.put ('/updateInfo', (req, res) => {
    if (req.user) {
        var data = req.body;
        if (data) {
            mongoose.Promise = es6Promise;
            mongoose.connect (config.host, config.db);

            User.findOne ({username: req.user.username}, (err, doc) => {
                if (err) {
                    res.send ({status: 'error', message: 'Error: '+ err});
                    mongoose.disconnect();
                }
                else if (doc) {
                    doc.username = data.username;
                    doc.email = data.email;

                    doc.save(). then (() => {
                        req.login (doc, (err) => {
                            if (err) res.send ({status: 'error', message: 'error updating session. Relogin'});
                            else res.send ({status: 'success', message: 'Updated',username: data.username, email: data.email});
                        });
                        mongoose.disconnect ();
                    });
                }else {
                    res.send ({status: 'error', message: 'no user found'});
                    mongoose.disconnect ();
                }
            });
        } else res.send ({status:'error', message: 'No data'});
    } else res.send ({status: 'error', message: 'Login first'});
})


router.put ('/updatePassword', (req, res) => {
    if (req.user) {
        // if session exists
        var data = req.body;
        console.log (data);
        if (data.oldPass, data.newPass) {
            mongoose.Promise = es6Promise;
            mongoose.connect (config.host, config.db);

            User.findOne ({username: req.user.username, password: data.oldPass}, (err, doc) => {
                if (err) { 
                    res.send ({status: 'error', message: 'Error: '+ err});
                    mongoose.disconnect ();
                }
                else if (doc) {
                    doc.password = data.newPass;
                    doc.save().then (() => {
                        res.send ({status: 'success', message: 'Password updated.'});
                        mongoose.disconnect ();
                    });
                } else {
                    res.send ({status: 'error', message: 'Incorrect old password'});
                    mongoose.disconnect();
                }
            });

        } else res.send ({status: 'error', message: 'Require old and new password'});
    } else res.send ({status: 'error', message: 'Login first'});
});
module.exports = router;