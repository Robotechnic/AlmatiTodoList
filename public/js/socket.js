var host = location.origin //on récupère le chemin de l'app (si elle est changée)
var socket = io.connect(host)


socket.on("connect",(message)=>{
	console.log('Le serveur est conecté')
})


socket.on("changeType",(message)=>{ //on met a jour les actions
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
	h2Title.innerHTML = task.title
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

	if (isConnected == true && (task.public || task.userId == userId))
	{
		var tdStateContent = document.createElement("button")
		tdStateContent.className = "taskStateButton"
		tdStateContent.setAttribute("onclick","changeState('"+task._id+"')")
		tdStateContent.classList.add("taskStateButton")
	}
	else
		var tdStateContent = document.createElement("div")
	tdStateContent.classList.add("taskStateContener")
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

	var tdPublic = document.createElement("td")
	tdPublic.className = "tdPublic"

	var public = task.public ? "Oui" : "Non"
	
	if (isConnected == true && task.userId == userId){
		var tdPublicCheckboxGroup = document.createElement("div")
		tdPublic.appendChild(tdPublicCheckboxGroup)
		tdPublicCheckboxGroup.className = "checkboxGroup"

		var tdPublicCheckboxGroupLabel = document.createElement("label")
		tdPublicCheckboxGroupLabel.appendChild(document.createTextNode(public))
		tdPublicCheckboxGroupLabel.id="labelSetPublicState."+task._id
		tdPublicCheckboxGroupLabel.For="setPublicStateCheckbox."+task._id

		var tdPublicCheckboxGroupCheckBox = document.createElement("input")
		tdPublicCheckboxGroupCheckBox.id = "setPublicStateCheckbox."+task._id
		tdPublicCheckboxGroupCheckBox.className = "setPublicStateCheckbox"
		tdPublicCheckboxGroupCheckBox.type = "checkbox"
		tdPublicCheckboxGroupCheckBox.name = "setPublicState"
		if (task.public)
			tdPublicCheckboxGroupCheckBox.checked = "true"

		tdPublicCheckboxGroup.appendChild(tdPublicCheckboxGroupCheckBox)
		tdPublicCheckboxGroup.appendChild(tdPublicCheckboxGroupLabel)
	} else {
		var tdPublicContener = document.createElement("div")
		tdPublicContener.id = "labelSetPublicState."+task._id
		tdPublicContener.appendChild(document.createTextNode(public))
	}
	tr.appendChild(tdPublic)

	let trContent = document.createElement("tr")
	let tdDescription = document.createElement("td")
	tdDescription.className = "tdDescription"
	tdDescription.setAttribute("colspan","5")
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

	socket.emit("newTaskClient",{
		userId:form.pourSelect.value,
		title:form.title.value,
		description:form.description.value,
		type:form.taskTypeSelect.value,
		public:form.public.checked
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

document.querySelectorAll(".setPublicStateCheckbox").forEach((element)=>{
	element.addEventListener("input",(event)=>{
		var id = element.id.split(".")[1]
		var sender = event.target
		if (sender.checked)
			document.getElementById("labelSetPublicState."+id).innerText = "Oui"
		else
			document.getElementById("labelSetPublicState."+id).innerText = "Non"

		socket.emit("changePublicState",{
			public:sender.checked,
			id:id
		})
	})
})

socket.on("newPublicState",(newState)=>{
	console.log(newState)
	if (newState.public){
		document.getElementById("labelSetPublicState."+newState.id).innerText = "Oui"
		var tdStateContent = document.createElement("button")
		tdStateContent.classList.add("taskStateButton")
		tdStateContent.setAttribute("onclick","changeState('"+newState.id+"')")
	} else {
		document.getElementById("labelSetPublicState."+newState.id).innerText = "Non"
		var tdStateContent = document.createElement("div")
	}

	if (newState.userId != userId){
		tdStateContent.classList.add("taskStateContener")
		var tr = document.getElementById(newState.id)
		var holdContener = tr.querySelector(".taskStateContener")
		console.log(holdContener.childNodes)
		tdStateContent.appendChild(holdContener.querySelector("h2"))
		tr.querySelector(".tdState").appendChild(tdStateContent)
		holdContener.remove()
	}
})