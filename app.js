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
mongoose.connect("mongodb+srv://Almadmin:Alma3.141592@cluster0-gfcq6.mongodb.net/test?retryWrites=true&w=majority",(err) =>{
	if (err)
		throw err
})

//the port of the application
const PORT = process.env.PORT || 8080

app.use(express.static(__dirname + '/public')) //ajout des fichiers public poru le css et le javascript
app.set('view engine', 'ejs');//moteur de rendu


app.get("",(req,res)=>{ //arboressence par défault de l'application
	res.render("index.ejs",{})//pour optimiser on envoie la liste via ejs on n'utilise socket io que quand la liste est update
})


io.on("connection",(socket)=>{ //socket io
	console.log("Connection d'un nouveau client")

	socket.on("newAction",(action)=>{ //ajout d'une action
		
	})
	socket.on("delAction",(action)=>{ //supression d'ue action
		
	})
})


http.listen(8081,()=>{
	console.log("Le serveur fonctionne sur 8080"); //le serveur fonctionne d'il n'y a pas eu d'erreurs
})