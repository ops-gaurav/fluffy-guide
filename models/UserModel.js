import mongoose from 'mongoose';
import config from '../data/config';
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
	username: {type: String, required:true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	photo: {
		mime: String,
		value: Buffer
	}
});

var User = mongoose.model ('user', UserSchema);

module.exports = UserSchema;