/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

const SHOW_HIDE_PASS = 'showHidePassword';
const PASSWORD = 'password';


function principal() {

	document.getElementById("login").addEventListener("click", login);
	document.getElementById(SHOW_HIDE_PASS).addEventListener('click', showHidepass)
}

function login(){
	
	//clean previous error messages
	document.getElementById("userEmail-error").innerHTML = "";
	document.getElementById("password-error").innerHTML = "";
	  
	// Read data from local storage. 
	let users = JSON.parse(localStorage.getItem("Users")) || [];

	//add proper validation
	if(!users.length>0){
		window.alert("No users are registered");
	}
	
	let userEmail = document.getElementById("userEmail").value;
	let pass = document.getElementById("password").value;
	
	if (!userEmail.length > 0 && !pass.length > 0){
		document.getElementById("userEmail-error").innerHTML = "Nickname/email is required";
		document.getElementById("password-error").innerHTML = "Password is required";
		return false;
	}
	
	if(!userEmail.length > 0){
		document.getElementById("userEmail-error").innerHTML = "Nickname/email is required";
		return false;
	}else if(!pass.length > 0){
		document.getElementById("password-error").innerHTML = "Password is required";
		return false;
	}
	
	for(let i=0; i<users.length; i++){
		if((userEmail == users[i].email) || (userEmail == users[i].nickname)){ 
			if(pass == users[i].password){
				//create user session
				localStorage.setItem("CurrentUser", JSON.stringify(users[i].nickname));
				location.href = "configurations.html";
			} else{
				document.getElementById("password-error").innerHTML = "Password incorrect";
			}
		} else{
			document.getElementById("userEmail-error").innerHTML = "Nickname/email incorrect";
		}
	}

return false;	
}

function showHidepass() {

	let type = document.getElementById(PASSWORD).type === 'password' ? 'text' : 'password';
    document.getElementById(PASSWORD).type = type;
    this.classList.toggle('fa-eye-slash')
};

window.onload = principal;