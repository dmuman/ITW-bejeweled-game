/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

function principal() {
	/*Function to add/remove nickname to top menu bar*/
	addNicknameLabel();
	document.getElementById("logout").addEventListener("click", clearNicknameSession);
}

/*Start implementation of function to add/remove nickname to top menu bar*/
function addNicknameLabel(){
	document.getElementById("nickname").innerHTML = "";
	let nickname = JSON.parse(localStorage.getItem("CurrentUser")) || [];
	//login done
	if(nickname.length > 0){
		document.getElementById("nickname").innerHTML = "Welcome " + nickname;
	}
}

/*Start implementation of function to clear session storage*/
function clearNicknameSession(){
	localStorage.removeItem("CurrentUser");
}

window.addEventListener("load", principal);