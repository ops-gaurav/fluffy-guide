import mongoose from 'mongoose';
import config from '../data/config';
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
	username: String,
	password: String,
	email: String
});

var User = mongoose.model ('user', UserSchema);

module.exports = UserSchema;

module.exports.findById = (id, callback) => {
	mongoose.connect (config.host, config.db);	
	User.findOne ({_id: id}, (err, doc) => {
		if (err) return {status: 'error', message: err};
		else if (doc) callback ();
		else return {status: 'error', message: 'No data'};
	});
}