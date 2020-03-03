const router = require("express").Router()
const passwordHash = require("password-hash")
const fs = require("fs")
var userMongo = require("../models/User")
var taskMongo = require("../models/Task")
var escapeHTML = require("escape-html") //escape html chars
const mongoose = require("mongoose")

const multer = require('multer')
var upload = multer(); //multer to get user's Avatar

//main page
router.get("",(req,res)=>{
	console.log(req.session.cookie)
	console.log(req.session.pseudo)
	console.log(req.session._id)

	taskMongo.find({}).populate('user').sort({'_id': -1}).exec((err,task)=>{
		if (err)
			throw err
		userMongo.find({},"pseudo").exec((err,pseudo)=>{
			if (err)
				throw err
			res.render("index.ejs",{pseudo:req.session.pseudo,image:req.session.image,userId:req.session._id,task:task,pseudos:pseudo})
		})
		
	})
})

//main page post (for login)
router.post("",(req,res)=>{
	var body = req.body
	//console.log(body)
	userMongo.findOne({"pseudo":body.pseudo},(err,user)=>{
		if (err)
			throw err
		if (user == null)
			res.redirect("../?err=userConnect#userLogIn")
		else if (passwordHash.verify(body.password,user.password))
		{
			req.session.pseudo = user.pseudo
			req.session.image = user.image
			req.session._id = String(user._id)
			req.session.save((err)=>{
				if (err)
					throw err
			})
			/*console.log("data:")
			console.log(String(user._id))
			console.log(req.session._id)*/
			res.redirect("./")
		}
		else
			res.redirect("../?err=passwordConnect&pseudo="+body.pseudo+"#userLogIn")
	})
})

//create a new user
var verificationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&éçàè=+-/°]{8,}$/
router.post("/newUser",upload.single('avatarSelect'),(req,res)=>{

	var body = req.body
	//console.log(body)

	var err = ""
	var redirect = false
	//verify the informations
	body.pseudo = escapeHTML(body.pseudo)
	var taille = body.pseudo.length
	if (taille < 2 || taille > 15)
	{
		err += "size,"
		redirect = true
	}
	if (!verificationPassword.test(body.password))
	{
		err += "password,"
		redirect = true
	}
	if (body.password != body.passwordConfirm)
	{
		err += "confirm,"
		redirect = true
	}
	if (redirect)
		res.redirect("../?err="+err+"&pseudo="+body.pseudo+"#userAdd")

	userMongo.findOne({pseudo:body.pseudo},(err,user)=>{
		if (err)
			throw err
		if (user == null)
		{
			if (req.file)
			{
				var base64 = req.file.buffer.toString('base64')
			}
			else
			{
				var bitmap = fs.readFileSync("./public/images/user.png");
			    var base64 = Buffer.from(bitmap).toString('base64');
			}
			var newUser = new userMongo({
				pseudo:body.pseudo,
				password:passwordHash.generate(body.password),
				image:base64
			})
			console.log("Nouvel Utilisateur ! Pseudo: "+body.pseudo)
			newUser.save((err)=>{
				if (err)
					throw err
			})
			res.redirect("../")
		}
		else
			res.redirect("../?err=userExist&pseudo="+body.pseudo+"#userAdd")
	})

})

//user's parameters

router.post("/changeImage",upload.single('avatarSelectChange'),(req,res)=>{
	if (req.session.pseudo)
		if (req.file)
		{
			var base64 = req.file.buffer.toString('base64')
			userMongo.updateOne({_id:mongoose.Types.ObjectId(req.session._id)},{image:base64},(err,response)=>{
				if (err)
					throw err
				console.log('Avatar de '+req.session.pseudo+" sauvegardé")

				req.session.image = base64
				res.redirect("../")
			})
		}
	else
		res.status(403).end()
})

router.post("/logout",(req,res)=>{
	if (req.session.pseudo)
	{
		req.session.destroy((err) =>{
			if (err)
				throw err
		})
		console.log(req.get('host'))
		res.redirect(req.get('host'))
	}
	else
		res.status(403).end()
})

module.exports = router