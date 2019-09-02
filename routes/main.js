const router = require("express").Router()
const passwordHash = require("password-hash")

router.get("",(req,res)=>{
	res.render("index.ejs",{})
})


router.post("",(req,res)=>{
	
})







module.exports = router