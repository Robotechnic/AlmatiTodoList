const router = require("express").Router()
const passwordHash = require("password-hash")
const fs = require("fs")
var userMongo = require("../models/User")
var taskMongo = require("../models/Task")
var escapeHTML = require("escape-html") //escape html chars
const mongoose = require("mongoose")

const imageExtentions = ["jpg","gif","png"]
//main page
router.get("",(req,res)=>{
	console.log(req.session)

	taskMongo.find({}).populate('user').exec((err,task)=>{
		if (err)
			throw err
		userMongo.find({},"pseudo").exec((err,pseudo)=>{
			if (err)
				throw err
			res.render("index.ejs",{pseudo:req.session.pseudo,image:req.session.image,userId:req.session._id,task:task.reverse(),pseudos:pseudo})
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
router.post("/newUser",(req,res)=>{

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
			console.log("Nouvel Utilisateur ! Pseudo: "+body.pseudo)
			if (req.files)
			{
				var fileName = req.files.avatarSelect.name
				var ext = fileName.substring(fileName.length-3,fileName.length)
				console.log(ext,imageExtentions.indexOf(ext)) 
				if (imageExtentions.indexOf(ext) == -1)
					res.redirect("../?err=file#userAdd")
				else
				{
					
					fs.writeFile("./public/UserImages/"+body.pseudo+"."+ext, req.files.avatarSelect.data, (err)=>{
						if (err)
							throw err
						console.log('Avatar de '+body.pseudo+" sauvegardé")
					});
				}
			}
			else
			{
				fs.copyFile('./public/images/user.png', "./public/UserImages/"+body.pseudo+".png", (err) => {
				    if (err) throw err;
				    console.log('Avatar de '+body.pseudo+" sauvegardé")
				});
				ext = "png"
			}

			var newUser = new userMongo({
				pseudo:body.pseudo,
				password:passwordHash.generate(body.password),
				image:body.pseudo+"."+ext
			})
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

router.post("/changeImage",(req,res)=>{
	if (req.session.pseudo)
		if (req.files)
		{
			var fileName = req.files.avatarSelectChange.name
			var ext = fileName.substring(fileName.length-3,fileName.length)
			console.log(ext,imageExtentions.indexOf(ext))
			fs.writeFile("./public/UserImages/"+req.session.pseudo+'.'+ext, req.files.avatarSelectChange.data, (err)=>{
				if (err)
					throw err
				userMongo.updateOne({_id:mongoose.Types.ObjectId(req.session._id)},{image:req.session.pseudo+'.'+ext},(err,response)=>{
					if (err)
						throw err
					console.log('Avatar de '+req.session.pseudo+" sauvegardé")

					req.session.image = req.session.pseudo+'.'+ext
					res.redirect("../")
				})
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
		res.redirect("../")
	}
	else
		res.status(403).end()
})

module.exports = router