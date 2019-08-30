var canClose = true

closeWindow = (element,action) => {
	console.log(element.className)
	if (!action)
		canClose = false

	if (canClose || element.className == "closeBox")
		document.location.hash = ""
	else if (element.className == "userBox")
		canClose = true
}