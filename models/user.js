const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	// relationsip 
	createdEvents: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Event'
		}
	]
});

// Model
module.exports = mongoose.model('User', userSchema);