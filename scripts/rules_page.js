/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

function principal() {
	/*Function to add login/logout label top menu bar*/
	addLoginLogoutLabel();
	document.getElementById("href-config").addEventListener("click", hrefDisabled);
	document.getElementById("href-statistics").addEventListener("click", hrefDisabled);
}

/*Start implementation of function to add login/logout label top menu bar*/
function addLoginLogoutLabel(){
	let nickname = JSON.parse(localStorage.getItem("CurrentUser")) || [];
	//login done
	if(nickname.length > 0){
		document.getElementById("logout").innerHTML = "Logout";
	}else{
		document.getElementById("logout").innerHTML = "Login";
		document.getElementById("href-config").href = "#";	
		document.getElementById("href-statistics").href = "#";
	}

}

function hrefDisabled(){
	
	let checkStatus = document.getElementById("logout").innerHTML;
	// if status login then cannot access new game page
	if (checkStatus == "Login"){
		window.alert("To access this page, please login first.");
	}
}

window.addEventListener("load", principal);