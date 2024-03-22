/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

/*  GLOBAL VARIABLES  */
/** Global variable to define default board game size */
let boardSize = 8;
let pieces = 20;

function principal() {
	//Set board game size default with value 8
	setBoardGameSize(boardSize, pieces);
	
	//Set timer, background and pieces with default values
	localStorage.setItem("Timer", JSON.stringify(0));
	localStorage.setItem("Pieces", JSON.stringify("crystals"));
	localStorage.setItem("Crystals", JSON.stringify("crystals_theme"))
	
	/* Event to change difficulty description */
	document.getElementById("grid").addEventListener("change", changeDiffDescription);
	
		
	/* Event to set game mode with/without timer */
	document.getElementById("setTimer").addEventListener("change", selectTimer);
	
	/* Event to set game pieces */
	document.getElementById("selectPieces").addEventListener("change", selectPieces);

	/* Event to set background */
	document.getElementById("selectBackground").addEventListener("change", selectBackground);
	
	/* Click to start single game */
	document.getElementById("startGame").addEventListener("click", startGame);
}

/* Change difficulty description */
function changeDiffDescription() {
	let x = document.getElementById("grid").value;
	switch (x) {
	  case 'easy':
		document.getElementById("funcDiff").innerHTML = "* Easy - grid with 8 columns x 8 rows and 20 pieces to be deleted";
		boardSize = 8;
		pieces = 20;
		setBoardGameSize(boardSize, pieces);
		break;
	  case 'medium':
		document.getElementById("funcDiff").innerHTML = "* Medium - grid with 9 columns x 9 rows and 25 pieces to be deleted";
		boardSize = 9;
		pieces = 25;
		document.getElementById("setTimer").value = "withoutTimer";
		selectTimer();
		setBoardGameSize(boardSize, pieces);
		break;
	  case 'hard':
		document.getElementById("funcDiff").innerHTML = "* Hard - grid with 10 columns x 10 rows and 30 pieces to be deleted";
		boardSize = 10;
		pieces = 30;
		document.getElementById("setTimer").value = "withoutTimer";
		selectTimer();
		setBoardGameSize(boardSize, pieces);
		break;
	}
}

/* Set board size into local storage */
function setBoardGameSize(boardSize, pieces){
	localStorage.setItem("BoardSize", JSON.stringify(boardSize));
	localStorage.setItem("PiecesNr", JSON.stringify(pieces));
}

/* Select timer method */
function selectTimer(){
	if( document.getElementById("setTimer").value == "withTimer" ){
		document.getElementById("funcTimer").innerHTML = "* Game will end automatically after 1 minute. By selecting game mode with timer, the board will be set to default size 8x8";
		document.getElementById("grid").value = "easy";
		changeDiffDescription();
		setBoardGameSize(8,20);
		localStorage.setItem("Timer", JSON.stringify(60));
	}else{
		document.getElementById("funcTimer").innerHTML = "";
		localStorage.setItem("Timer", JSON.stringify(0));
	}
}

/* Select game pieces */
function selectPieces(){

	let pieces = document.getElementById("selectPieces").value;
	localStorage.setItem("Pieces", JSON.stringify(pieces));
	
}

/* Select background */
function selectBackground(){

	let backgrounds = document.getElementById("selectBackground").value;
	localStorage.setItem("Background", JSON.stringify(backgrounds));
}

/* Start single game */
function startGame(){
	location.href = "single_game.html";
}

window.addEventListener("load", principal);