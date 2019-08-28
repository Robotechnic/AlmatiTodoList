var host = location.origin //on récupère le chemin de l'app (si elle est changée)
var socket = io.connect(host)


socket.on("connect",(message)=>{
	console.log('Le serveur est conecté')
})


socket.on("update",(message)=>{ //on met a jour les actions
	console.log('Les actions sont mises a jour')

})

suprimer = (id) =>{ //envoi de la supression de liste
	console.log("supression de l'élément: "+id);
	socket.emit("delAction",id)
}

ajouter = () =>{
	var actionTexte = action.value
	
	return false
}