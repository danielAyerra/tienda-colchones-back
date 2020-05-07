const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},

	pass: {
		type: String,
		required: true
	},

	isAdmin: {
		type: Boolean,
		required: true
	}

});

module.exports=mongoose.model('User', UserSchema);