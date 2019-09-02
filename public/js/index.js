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
var tips1 = document.getElementById("pseudoTooltip")
var tips2 = document.getElementById("passwordConfirmTooltip")
var tips3 = document.getElementById("passwordTooltip")
var taille = 0

var pseudoInput = document.getElementById("pseudoInput")
var passwordInput = document.getElementById("passwordInput")
var passwordConfirmInput = document.getElementById("passwordVerifInput")

var verificationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&éçàè=+-/°]{8,}$/

pseudoVerif = () =>{
	taille = pseudoInput.value.length
	if (taille < 2 || taille > 15)
	{
		tips1.style.display = "block"
		return false
	}
	else
	{
		tips1.style.display = "none"
		return true
	}
}
passwordVerif = () => {
	if (verificationPassword.test(passwordInput.value))
		{tips3.style.display = "none"
				return true}
	else
		{tips3.style.display = "block"
				return false}
}
passwordConfirmVerif = () =>{
	if (passwordConfirmInput.value == passwordInput.value)
		{tips2.style.display = "none"
				return true}
	else
		{tips2.style.display = "block"
				return false}
}
pseudoInput.addEventListener("keyup",pseudoVerif)
passwordInput.addEventListener("keyup",passwordVerif)
passwordConfirmInput.addEventListener("keyup",passwordConfirmVerif)
verifyPasswordPseudo = () =>{
	return passwordConfirmVerif() && passwordVerif() && pseudoVerif()
}