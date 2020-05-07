const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const ProductSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},

	pType: {
		type: String,
		required: true
	},

	prize: {
		type: Number,
		required: true
	},

	img: {
		type: String,
		required: true
	},

	description: {
		type:String,
		required: true
	},

	sold: {
		type: Number,
		required: false
	}

});

module.exports=mongoose.model('Product', ProductSchema);