/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

/**
 * Construtor for new users score object.
 * 
 * @param {string} user nickname.
 * @param {int} user score.
 */
 
 let users = [];
 
function UserScore(nickname, highScore8x8, highScore9x9, highScore10x10, highScoreTimer) {
  this.nickname = nickname;
  this.highScore8x8 = highScore8x8;
  this.highScore9x9 = highScore9x9;
  this.highScore10x10 = highScore10x10;
  this.highScoreTimer = highScoreTimer;
}

function principal() {
	
	/*Function to get statistics*/
	getStatistics();
	document.getElementById("gameMode").addEventListener("change", getGlobalStatistics);
}

/* Get statistics */
function getStatistics(){
	
	users = JSON.parse(localStorage.getItem("Users")) || [];
	let nickname = JSON.parse(localStorage.getItem("CurrentUser"));

	if(nickname != null && users.length > 0){
		getPersonalStatistics(nickname);
		getGlobalStatistics();
	}
}

/* Get personal statistics */
function getPersonalStatistics(nickname){
	for(let i=0; i<users.length; i++){
			if(nickname == users[i].nickname){
				document.getElementById("singlePlayer").innerHTML = nickname.italics();
				document.getElementById("nrGames").innerHTML = users[i].gamesPlayed;
				document.getElementById("timePlayed").innerHTML = users[i].timePlayed;
				document.getElementById("totalScore").innerHTML = users[i].totalScore;
				document.getElementById("highScore8x8").innerHTML = users[i].highScore8x8;
				document.getElementById("highScore9x9").innerHTML = users[i].highScore9x9;
				document.getElementById("highScore10x10").innerHTML = users[i].highScore10x10;
				document.getElementById("highScoreTimer").innerHTML = users[i].highScoreTimer;
			}
		}
}

/* Get global statistics */
function getGlobalStatistics(){

	let usersScore = [];
	for(let i=0; i<users.length; i++){
		usersScore[i] = new UserScore(users[i].nickname, users[i].highScore8x8, users[i].highScore9x9, users[i].highScore10x10, users[i].highScoreTimer);	
	}
	
	let player;
	let score;
	
	// for game Mode 8x8
	if( document.getElementById("gameMode").value == "8x8" ){
		//sort array in descending order (from highest score to lowest)
		usersScore.sort( compare8x8 );
		for(let j=0; j<usersScore.length; j++){
			player = "player"+Number(j+1);
			score = player + "score";
			document.getElementById(player).innerHTML = usersScore[j].nickname;
			document.getElementById(score).innerHTML = usersScore[j].highScore8x8;
		}
	}
	
	// for game Mode 9x9
	if( document.getElementById("gameMode").value == "9x9" ){
		//sort array in descending order (from highest score to lowest)
		usersScore.sort( compare9x9 );
		for(let j=0; j<usersScore.length; j++){
			player = "player"+Number(j+1);
			score = player + "score";
			document.getElementById(player).innerHTML = usersScore[j].nickname;
			document.getElementById(score).innerHTML = usersScore[j].highScore9x9;
		}
	}
	
	// for game Mode 10x10
	if( document.getElementById("gameMode").value == "10x10" ){
		//sort array in descending order (from highest score to lowest)
		usersScore.sort( compare10x10 );
		for(let j=0; j<usersScore.length; j++){
			player = "player"+Number(j+1);
			score = player + "score";
			document.getElementById(player).innerHTML = usersScore[j].nickname;
			document.getElementById(score).innerHTML = usersScore[j].highScore10x10;
		}
	}
	
	// for game Mode with timer
	if( document.getElementById("gameMode").value == "withTimer" ){
		//sort array in descending order (from highest score to lowest)
		usersScore.sort( compareTimer );
		for(let j=0; j<usersScore.length; j++){
			player = "player"+Number(j+1);
			score = player + "score";
			document.getElementById(player).innerHTML = usersScore[j].nickname;
			document.getElementById(score).innerHTML = usersScore[j].highScoreTimer;
		}
	}

}

/* Sort high scores array for game mode 8x8 */
function compare8x8( a, b ) {
  if ( a.highScore8x8 > b.highScore8x8 ){
    return -1;
  }
  if ( a.highScore8x8 < b.highScore8x8 ){
    return 1;
  }
  return 0;
}

/* Sort high scores array for game mode 9x9 */
function compare9x9( a, b ) {
  if ( a.highScore9x9 > b.highScore9x9 ){
    return -1;
  }
  if ( a.highScore9x9 < b.highScore9x9 ){
    return 1;
  }
  return 0;
}

/* Sort high scores array for game mode 10x10 */
function compare10x10( a, b ) {
  if ( a.highScore10x10 > b.highScore10x10 ){
    return -1;
  }
  if ( a.highScore10x10 < b.highScore10x10 ){
    return 1;
  }
  return 0;
}

/* Sort high scores array for game mode with timer */
function compareTimer( a, b ) {
  if ( a.highScoreTimer > b.highScoreTimer ){
    return -1;
  }
  if ( a.highScoreTimer < b.highScoreTimer ){
    return 1;
  }
  return 0;
}

window.addEventListener("load", principal);