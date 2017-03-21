import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
	username: String,
	password: String,
	email: String
});

module.exports = UserSchema;