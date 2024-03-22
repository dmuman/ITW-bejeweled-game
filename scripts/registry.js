/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

const SHOW_HIDE_PASS = 'showHidePassword';
const PASSWORD = 'password';

/**
 * Construtor for new user object.
 * 
 * @param {string} user name.
 * @param {string} user email.
 * @param {string} user nickname.
 * @param {string} user age (range).
 * @param {string} user gender.
 * @param {string} user password.
 */
function User(name, email, nickname, age, gender, password) {

  this.name = name;
  this.email = email;
  this.nickname = nickname;
  this.age = age;
  this.gender = gender;
  this.password = password;
  this.gamesPlayed = 0;
  this.timePlayed = 0;
  this.totalScore = 0;
  this.highScore8x8 = 0;
  this.highScore9x9 = 0;
  this.highScore10x10 = 0;
  this.highScoreTimer = 0;
}

function principal() {
	/*Function to validate input fields - Registry page*/
	let formElements = document.querySelector(".registry");
	for (let i=0; i<formElements.length; i ++){
		formElements[i].addEventListener("input", formValidations);
	}
	
	document.getElementById("formRegistry").addEventListener("submit", createPlayer);
	document.getElementById(SHOW_HIDE_PASS).addEventListener('click', showHidepass)
}

/*Start implementation of function to define validate input fields - Registry page*/
function formValidations(){
	//console.log(inputValidation);
	switch (this.name) {
	  case 'name':
		nameValidation(this);
		break;
	  case 'email':
		emailValidation(this);
		break;
	  case 'nickname':
		nicknameValidation(this);
		break;
	  case 'age':
		ageValidation(this);
		break;
	  case 'gender':
		genderValidation(this);
		break;
	  case 'password':
		passwordValidation(this);
		break;
	  case 'confirm-password':
		confirmPasswordValidation(this);
		break;
	}
}
/*End implementation of function to define validate input fields - Registry page*/

/*Start implementation of function to validate input name - Registry page*/
function nameValidation(param){
	if(!emptyField(param)){
			document.getElementById("name-error").innerHTML = "Name is required";
			return setInvalidBox(param);
	}
	
	let regExp = /^[a-zA-Z]+ [a-zA-Z]+$/;
	if(!regExp.test(param.value)){
		document.getElementById("name-error").innerHTML = "Wrong format";
		return setInvalidBox(param);
	}
	
	document.getElementById("name-error").innerHTML = "";
	return setValidBox(param);
}

/*Start implementation of function to validate input email - Registry page*/
function emailValidation(param){
	if(!emptyField(param)){
		document.getElementById("email-error").innerHTML = "Email is required";
		return setInvalidBox(param);
	}
	
	let emailFormat =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(!emailFormat.test(param.value)){
		document.getElementById("email-error").innerHTML = "Invalid email format";
		return setInvalidBox(param);
	}
	
	//check if email is already registered
	let users = getLocalStorage();
	if(users.length > 0){
		for (let user of users){
			if(user.email == param.value){
				document.getElementById("email-error").innerHTML = "Email already registered";
				return setInvalidBox(param);
			}
		}
	}
	
	document.getElementById("email-error").innerHTML = "";
	return setValidBox(param);
}

/*Start implementation of function to validate input nickname - Registry page*/
function nicknameValidation(param){
	if(!emptyField(param)){
		document.getElementById("nickname-error").innerHTML = "Nickname is required";
		return setInvalidBox(param);
	}
	//check if nickname is already registered
	let users = getLocalStorage();
	if(users.length > 0){
		for (let user of users){
			if(user.nickname == param.value){
				document.getElementById("nickname-error").innerHTML = "Nickname already registered";
				return setInvalidBox(param);
			}
		}
	}
	
	document.getElementById("nickname-error").innerHTML = "";
	return setValidBox(param);
}

/*Start implementation of function to validate age dropdown - Registry page*/
function ageValidation(param){
	if(!emptyField(param)){
		document.getElementById("age-error").innerHTML = "Select an age range from dropdown list";
		return setInvalidBox(param);
	}
	
	document.getElementById("age-error").innerHTML = "";
	return setValidBox(param);
}

/*Start implementation of function to validate age dropdown - Registry page*/
function genderValidation(param){
	if(!emptyField(param)){
		document.getElementById("gender-error").innerHTML = "Select a gender from dropdown list";
		return setInvalidBox(param);
	}
	
	document.getElementById("gender-error").innerHTML = "";
	return setValidBox(param);
}

/*Start implementation of function to validate password value - Registry page*/
function passwordValidation(param){
	if(!emptyField(param)){
		document.getElementById("password-error").innerHTML = "Password is required";
		return setInvalidBox(param);
	}
	
	//check if password has between 6-15 characters, has at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
	let passFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
	if(!passFormat.test(param.value)){
		document.getElementById("password-error").innerHTML = "Password must contain: ";
		let newMessage1 = document.createElement("span");
			if(param.value.length>=6 && param.value.length<=15){
				newMessage1.setAttribute("id", "spanValid");
			}else{
				newMessage1.removeAttribute("id", "spanValid");
			}
		newMessage1.innerHTML = "</br>- from 6 to 15 characters";
		document.getElementById("password-error").appendChild(newMessage1);	
		
		let newMessage2 = document.createElement("span");
		var hasDigits = /\d/;
			if(hasDigits.test(param.value)){
				newMessage2.setAttribute("id", "spanValid");
			}else{
				newMessage2.removeAttribute("id", "spanValid");
				}
		newMessage2.innerHTML = "</br>- one numeric digit";
		document.getElementById("password-error").appendChild(newMessage2);
		
		let newMessage3 = document.createElement("span");
		var hasUpperCase = /[A-Z]/;
			if(hasUpperCase.test(param.value)){
				newMessage3.setAttribute("id", "spanValid");
			}else{
				newMessage3.removeAttribute("id", "spanValid");
				}
		newMessage3.innerHTML = "</br>- one uppercase letter";
		document.getElementById("password-error").appendChild(newMessage3);
		
		let newMessage4 = document.createElement("span");
		var hasLowerCase = /[a-z]/;
			if(hasLowerCase.test(param.value)){
				newMessage4.setAttribute("id", "spanValid");
			}else{
				newMessage4.removeAttribute("id", "spanValid");
				}
		newMessage4.innerHTML = "</br>- one lowercase letter";
		document.getElementById("password-error").appendChild(newMessage4);
		
		let newMessage5 = document.createElement("span");
		var hasLowerCase = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
			if(hasLowerCase.test(param.value)){
				newMessage5.setAttribute("id", "spanValid");
			}else{
				newMessage5.removeAttribute("id", "spanValid");
				}
		newMessage5.innerHTML = "</br>- one special character";
		document.getElementById("password-error").appendChild(newMessage5);

		return setInvalidBox(param);
	}
	
	document.getElementById("password-error").innerHTML = "";
	return setValidBox(param); 
}

/*Start implementation of function to validate confirm password value - Registry page*/
function confirmPasswordValidation(param){
	if(!emptyField(param)){
		document.getElementById("confirm-password-error").innerHTML = "Confirm password is required";
		return setInvalidBox(param);
	}
	  
    if(document.getElementById("password").value != param.value){  
		document.getElementById("confirm-password-error").innerHTML = "Password mismatch";
		return setInvalidBox(param); 
    }
	
	document.getElementById("confirm-password-error").innerHTML = "";
	return setValidBox(param);  
}

/*Start implementation of function to check if fields are empty - Registry page*/
function emptyField(param){
		
	if(param.value.length == 0){
		return false;
	}else{
		return true;
	}
}

/*Start implementation of function to set box fields red color in case invalid value - Registry page*/
function setInvalidBox(param){
	param.style.border = "3px solid red";
	return false;
}

/*Start implementation of function to set box fields green color in case valid value - Registry page*/
function setValidBox(param){
	param.style.border = "3px solid green";
	return true;
}

/*Start implementation of function to get local storage values - Registry page*/
function getLocalStorage(){
	let users = [];
	return JSON.parse(localStorage.getItem("Users")) || [];
}

/*Start implementation of function to set new user into local storage - Registry page*/
function createPlayer(){
	let newUser = new User(document.getElementById("name").value, document.getElementById("email").value, 	document.getElementById("nickname").value, 
	document.getElementById("age").value, document.getElementById("gender").value, document.getElementById("password").value);
	let users = JSON.parse(localStorage.getItem("Users")) || [];
	users.push(newUser);
	localStorage.setItem("Users", JSON.stringify(users));
}

function showHidepass() {

	let type = document.getElementById(PASSWORD).type === 'password' ? 'text' : 'password';
    document.getElementById(PASSWORD).type = type;
    this.classList.toggle('fa-eye-slash')
};

window.onload = principal;