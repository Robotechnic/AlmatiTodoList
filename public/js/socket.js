var host = location.origin //on récupère le chemin de l'app (si elle est changée)
var socket = io.connect(host)


socket.on("connect",(message)=>{
	console.log('Le serveur est conecté')
})


socket.on("changeType",(message)=>{ //on met a jour les actions
	if (isConnected == true)
	{
		console.log('Le type de',message.id,'a été changé a',message.state)

		let task = document.getElementById(message.id)
		task.cells[3].className = "taskState"+String(message.state)+" tdState"
		title = task.cells[3].children[0].children[0]
		switch (message.state){
			case 0:
				title.innerText = "Fait"
			break
			case 1:
				title.innerText = "En cours"
			break
			case 2:
				title.innerText = "Fait"
			break
		}
	}
})

socket.on("newTaskServer",(task)=>{
	console.log("nouvelle tache:",task)
	/*
	pseudo,
	image,
	text,
	title,
	type,
	_id,
	state
	*/
	let tr = document.createElement("tr")
	tr.setAttribute("id",task._id)
	let tdUser = document.createElement("td")
	tdUser.className = "tdUser"
	let divUser = document.createElement("div")
	divUser.className = "tdUserDiv"
	userImage = document.createElement("img")
	userImage.className = "userImage"
	userImage.setAttribute("src","data:image/png;base64, "+task.image)
	divUser.appendChild(userImage)
	divUser.appendChild(document.createTextNode(task.pseudo))
	tdUser.appendChild(divUser)
	tr.appendChild(tdUser)
	let tdTitle = document.createElement("td")
	tdTitle.className = "tdTitle"
	let h2Title = document.createElement("h2")
	h2Title.write(task.title)
	tdTitle.appendChild(h2Title)
	tr.appendChild(tdTitle)
	let tdType = document.createElement("td")
	tdType.className = "tdType"
	let h2Type = document.createElement("h2")
	h2Type.appendChild(document.createTextNode(task.type))
	tdType.appendChild(h2Type)
	tr.appendChild(tdType)
	let tdState = document.createElement("td")
	tdState.className = "taskState"+task.state+" tdState"
	if (isConnected)
	{
		var tdStateContent = document.createElement("button")
		tdStateContent.className = "taskStateButton"
		tdStateContent.setAttribute("onclick","changeState('"+task._id+"')")
	}
	else
		var tdStateContent = document.createElement("div")
	let h2State = document.createElement("h2")
	switch (task.state){
		case 0:
			h2State.appendChild(document.createTextNode("A faire"))
		break
		case 1:
			h2State.appendChild(document.createTextNode("En cours"))
		break
		case 2:
			h2State.appendChild(document.createTextNode("Fait"))
		break
	}
	tdStateContent.appendChild(h2State)
	tdState.appendChild(tdStateContent)
	tr.appendChild(tdState)

	let trContent = document.createElement("tr")
	let tdDescription = document.createElement("td")
	tdDescription.className = "tdDescription"
	tdDescription.setAttribute("colspan","4")
	var divDescription = document.createElement("div")
	divDescription.innerHTML = task.text
	tdDescription.appendChild(divDescription)
	trContent.appendChild(tdDescription)

	let tableaux = document.getElementById("tbodyTaskContener")
	tableaux.insertBefore(trContent,tableaux.childNodes[0])
	tableaux.insertBefore(tr,tableaux.childNodes[0]);

	document.location.hash = ""
})

formAnalysis = (form) => {
	console.log(form)

	socket.emit("newTaskClient",{
		userId:userId,
		title:form.title.value,
		description:form.description.value,
		type:form.taskTypeSelect.value
	})
	return false
}

changeState = (id) =>{ //envoi de la supression de liste
	console.log("changement d'état de l'élément: "+id);
	let task = document.getElementById(id)
	let state = task.cells[3].classList[0]
	state = Number(state[state.length -1],10)
	if (state>-1 && state<2)
	{
		socket.emit("changeState",{id:id,state:state+1})
	}
}
