var canClose = true

closeWindow = (element,action) => {
	//console.log(element.className)
	if (!action)
		canClose = false

	if (canClose || /closeBox/.test(element.className))
	{
		if (/warningOnClose/.test(element.className))
			if (!confirm("Voulez vous vraiment fermer cette fenetre ?"))
				return
		document.location.hash = ""
	}
	else if (/userBox/.test(element.className))
		canClose = true
}

//verification of password

var taille = 0

var pseudoInput = document.getElementById("pseudoInput")
var passwordInput = document.getElementById("passwordInput")
var passwordConfirmInput = document.getElementById("passwordVerifInput")

var verificationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&éçàè=+-/°]{8,}$/

pseudoVerif = () =>{
	taille = pseudoInput.value.length
	if (taille < 2 || taille > 15)
	{
		pseudoInput.className = "invalid"
		return false
	}
	else
	{
		pseudoInput.className = ""
		return true
	}
}
passwordVerif = () => {
	if (verificationPassword.test(passwordInput.value))
		{passwordInput.className = ""
				return true}
	else
		{passwordInput.className = "invalid"
				return false}
}
passwordConfirmVerif = () =>{
	if (passwordConfirmInput.value == passwordInput.value)
		{passwordVerifInput.className = ""
				return true}
	else
		{passwordConfirmInput.className = "invalid"
				return false}
}
if (isConnected == false)
{
	pseudoInput.addEventListener("keyup",pseudoVerif)
	passwordInput.addEventListener("keyup",passwordVerif)
	passwordConfirmInput.addEventListener("keyup",passwordConfirmVerif)
}
verifyPasswordPseudo = () =>{
	return passwordConfirmVerif() && passwordVerif() && pseudoVerif()
}


//code for get url parameters
function getUrlParam(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

//get the parameters and display errors and pseudo
var urlParams = getUrlParam()

if (urlParams["pseudo"] != undefined)
{
	pseudoInput.value = urlParams["pseudo"]
	document.getElementById("userConnect").value = urlParams["pseudo"]
}


if (urlParams["err"] != undefined)
{
	var errors = urlParams["err"].split(",")
	errors.forEach((element)=>{
		if (element == "size")
			pseudoInput.className = "invalid"
		if (element == "password")
			passwordInput.className = "invalid"
		if (element == "confirm")
			passwordConfirm.className = "invalid"
		if (element == "userExist")
			alert("Le pseudo existe déjà.\nVous pouver songer a rajouter un nombre aprés celui ci.\nVous pouvez aussi écrire comme un A❤ en remplassant certaines lettres par des chifres.")
		if (element == "file")
			alert("Le fichier que vous avez essayé d'uploader n'est pas valide")
		if (element == "userConnect")
			document.getElementById("userConnect").className = "invalid"
		if (element == "passwordConnect")
			document.getElementById("passwordConnect").className = "invalid"

	})
}

//script to oreview the image of input file

var displayAvatar = ""
var loadFile = (event,id) => {
	displayAvatar = document.getElementById('display'+id)
	displayAvatar.src = URL.createObjectURL(event.target.files[0]);
};

//sort task
var cssRules = document.getElementById("dynamicRules")
var style = cssRules.sheet

var userStyle
document.getElementById("userSelect").addEventListener("change",(evt)=>{
	console.log(evt.target.value)
	if (userStyle != undefined) {
		style.deleteRule(style)
		style.deleteRule(style)
	}
	if (evt.target.value !="any")
	{
		userStyle = style.insertRule(".tasks:not(.user"+evt.target.value+"){display:none;}",style.cssRules.length)
		style.insertRule(".tasks:not(.user"+evt.target.value+")+tr{display:none}",style.cssRules.length)
	}
	else
		typeStyle = undefined
})

var typeStyle
document.getElementById("taskTypeSelect").addEventListener("change",(evt)=>{
	console.log(evt.target.value)
	if (typeStyle != undefined) {
		style.deleteRule(style)
		style.deleteRule(style)
	}
	if (evt.target.value !="any")
	{
		typeStyle = style.insertRule(".tasks:not(.type"+evt.target.value+"){display:none;}",style.cssRules.length)
		style.insertRule(".tasks:not(.type"+evt.target.value+")+tr{display:none}",style.cssRules.length)
	}
	else
		typeStyle = undefined
})

var typeState
document.getElementById("statusSelect").addEventListener("change",(evt)=>{
	console.log(evt.target.value)
	if (typeState != undefined) {
		style.deleteRule(style)
		style.deleteRule(style)
	}
	if (evt.target.value !="any")
	{
		typeState = style.insertRule(".tasks:not(.state"+evt.target.value+"){display:none;}",style.cssRules.length)
		style.insertRule(".tasks:not(.state"+evt.target.value+")+tr{display:none}",style.cssRules.length)
	}
	else
		typeState = undefined
})