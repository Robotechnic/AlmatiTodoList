const mongoose = require("mongoose")

var shemaUser = new mongoose.Schema({
	pseudo:String,
	password:String,
	image:String,
})

var User = mongoose.model("User",shemaUser)

module.exports = User