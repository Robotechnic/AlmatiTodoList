const express = require("express")//initialisation d'express
const app = express()

const http = require("http").Server(app) //initialisation du serveur + Socket Io
const io = require("socket.io")(http)

const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ //initialisaiton de body parser
  extended: true
}));

//configurer mongoose
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://Almadmin:Alma3.141592@cluster0-gfcq6.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true},(err) =>{
	if (err)
		throw err
})

//the port of the application
const PORT = process.env.PORT || 8080

app.use(express.static(__dirname + '/public')) //add public files 
app.set('view engine', 'ejs');//view engine configuration


app.get("",(req,res)=>{
	res.render("index.ejs",{})
})


io.on("connection",(socket)=>{ //socket io
	console.log("Connection d'un nouveau client")

	socket.on("newAction",(action)=>{ //ajout d'une action
		
	})
	socket.on("delAction",(action)=>{ //supression d'ue action
		
	})
})


http.listen(PORT,()=>{
	console.log("Le serveur fonctionne sur 8080"); //le serveur fonctionne d'il n'y a pas eu d'erreurs
})