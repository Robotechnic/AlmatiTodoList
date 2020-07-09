const express = require("express")//initialisation d'express
const session = require("express-session")
const app = express()

const http = require("http").Server(app) //initialisation du serveur + Socket Io
const io = require("socket.io")(http)

sessionMiddleware = session({
	name:"userID",
	resave:false,
	saveUninitialized:false,
	secret:"pi=3.14159265359,or=1.61803398875,This is Almati's Todolist's secret !",
	cookie:{
		//secure:true,
		httpOnly:true,
		maxAge:604800000 //one week
	}
})

app.use(sessionMiddleware)

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ //initialisaiton de body parser
  extended: false
}))
app.use(bodyParser.json())


var escapeHTML = require("escape-html") //escape html chars
var showdown  = require('showdown') //markdown support
var converter = new showdown.Converter()

//configurer mongoose
const mongoose = require("mongoose")
//mongoose.connect("mongodb://localhost:27017/toDoList",{useNewUrlParser: true},(err) =>{
mongoose.connect("mongodb+srv://Almadmin:Alma3.141592@cluster0-gfcq6.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true},(err) =>{
	if (err)
		throw err
})

var userMongo = require("./models/User") 
var taskMongo = require("./models/Task")

const main = require("./routes/main.js")

//the port of the application
const PORT = process.env.PORT || 8080

app.use(express.static(__dirname + '/public')) //add public files 
app.set('view engine', 'ejs');//view engine configuration


app.use("/",main)

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
})

var listTypes = ["server","style","html","javascript"]
io.on("connection",(socket)=>{ //socket io
	console.log("Connection d'un nouveau client")
	
	var session = socket.request.session

	if (!session.connected){
		socket.disconnect()
	} else {
		socket.on("newTaskClient",(action)=>{ //ajout d'une action
			//console.log(action)
			console.log("tentative de création d'une nouvelle tache")
			if (listTypes.indexOf(action.type) > -1)
			{
				action.title = escapeHTML(action.title)
				//action.description = escapeHTML(action.description)
				action.description = converter.makeHtml(action.description)
				var newTask = new taskMongo({
					user: mongoose.Types.ObjectId(action.userId),
					text:action.description,
					title:action.title,
					type:escapeHTML(action.type)
				})
				newTask.save((err,task)=>{
					console.log("tache créée")
					//console.log(task)
					if (err)
						throw err
					userMongo.findById(task.user,(err,user)=>{
						if (err)
							throw err
						//console.log(user)
						console.log("envoi de la nouvelle tache")
						var data = {
							pseudo: user.pseudo,
							image:user.image,
							text:task.text,
							title:task.title,
							type:task.type,
							_id:task._id,
							state:task.state
						}
						socket.broadcast.emit("newTaskServer",data)
						socket.emit("newTaskServer",data)
					})

				})
			}
			else
			{
				socket.emit("error","type")
			}
		})
		socket.on("changeState",(action)=>{ //supression d'ue action
			console.log("Tentative changement de donnée de ",action.id)
			if (action.state>0 && action.state <4)
			{
				taskMongo.updateOne({_id:mongoose.Types.ObjectId(action.id)},{state:action.state},(err,response)=>{
					if (err)
						throw err
					console.log("Correspond:",response.n,"Changé:",response.nModified)
					if (response.nModified == 1)
					{
						console.log("state changé")
						socket.emit("changeType",{id:action.id,state:action.state})
						socket.broadcast.emit("changeType",{id:action.id,state:action.state})
					}
				})
			}
			else
			{
				console.log("state invalide")
			}
		})
	}
})


http.listen(PORT,()=>{
	console.log("Le serveur fonctionne sur 8080"); //le serveur fonctionne d'il n'y a pas eu d'erreurs
})
