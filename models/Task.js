const mongoose = require("mongoose")

var shemaTask = new mongoose.Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	text:String,
	type:String,
})

var task = mongoose.model("Task",shemaTask)

module.exports = task