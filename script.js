const onReady = ()=>{
	const token = localStorage.getItem("token") || prompt("Enter your revolt token")
	if (!token) {
		alert("token is not entered")
		window.location.reload()
		return
	}
	localStorage.setItem("token", token);

	const logout = document.createElement("button")

	logout.innerText = "Forget token (click if there is error in console or you want to change token)"
	logout.addEventListener("click", ()=>{
		localStorage.setItem("token", "");
		window.location.reload()
	})
	
	const loading = document.createTextNode("Loading...")
	document.body.append(logout, loading)
	
	const socket = new WebSocket("wss://app.revolt.chat/events");
	
	socket.onopen = function(event) {
	  socket.send(JSON.stringify({
	  	type: "Authenticate",
	  	token: token
	  }));
	};
	
	socket.onmessage = function(event) {
		const msg = JSON.parse(event.data)
		if (msg.type != "Ready") return
		loading.remove()
		console.log(msg)
		const blocked = msg.users
			.filter(u=>u.relationship == "BlockedOther")
		if (blocked) {
			blocked.forEach(user=>{
				const userContainer = document.createElement("div")
				const avatar = document.createElement("img")
				const textContainer = document.createElement("div")
				const displayNameContainer = document.createElement("p")
				const displayName = document.createElement("strong")
				const tag = document.createElement("a")
				const username = document.createElement("p")
				const id = document.createElement("p")

				if (user.avatar) {
					avatar.src=`https://autumn.revolt.chat/avatars/${user.avatar._id}?max_side=256`
					avatar.style.borderRadius = "100%"
					avatar.style.marginRight = "15px"
				}

				displayName.innerText = user.display_name ?? user.username

				tag.innerText = "#" + user.discriminator
				tag.style.opacity = '0.3'
				
				username.innerText = user.username
				username.style.opacity = '0.3'
				
				id.innerText = user._id
				id.style.opacity = '0.3'

				userContainer.style.display = "flex"
				
				displayNameContainer.append(displayName, tag)
				textContainer.append(displayNameContainer, username, id)
				userContainer.append(avatar, textContainer)

				document.body.append(userContainer)
			})
		} else {
			document.append(document.createTextNode("No one had blocked you"))
		}
	};
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
} else {
    onReady();
}
