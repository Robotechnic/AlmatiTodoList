const mongoose = require("mongoose")

var shemaTask = new mongoose.Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	text:String,
	title:String,
	type:String,
	public:{
		type:Boolean,
		default:true
	},
	state:{
		type:Number,
		default:0
	}
})


var task = mongoose.model("Task",shemaTask)

module.exports = task