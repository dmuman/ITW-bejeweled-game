/* Grupo: 25, Número: 36207, Nome: Nelson Sousa, PL: 22
   Grupo: 25, Número: 59348, Nome: Dmytro Umanskyi, PL: 22 */

// Avoid some easy mistakes to be made.
"use strict";

/**
 * Global variables
 */
 let timerID = null;
 let barPercentage = 0;
 let totalBarPercentage = 0;
 let matrixPieces = [];
 let boardSize;
 let dragRow, dragColumn, dropRow, dropColumn;
 let currentScore = 0;
 let gameTime = 0;
 let timer = 0;
 let arrayPieces = [];
 let update = '';
 let currentPiecesDeleted;
 let goalPieces = 0;

/**
 * Construtor for new piece object.
 * 
 * @param {string} width - image width.
 * @param {string} height - image height.
 * @param {string} src - image URL.
 * @param {number} ID - image internal ID.
 */
function Piece(width, height, src, ID) {
  this.width = width;
  this.height = height;
  this.src = src;
  this.ID = ID;
}

function principal() {	

	goalPieces = JSON.parse(localStorage.getItem("PiecesNr")) || [];
	if (goalPieces == null){
		goalPieces = 20;
	}
	document.getElementById("goalPieces").innerHTML = goalPieces;
	
	/*Function to create array with selected pieces*/
	createPiecesArray();
	
	/*Function to create board game - Game page*/
	createAndPrintBoard();

	changeBackground();
	
	// event for Reset button
	document.getElementById("hint").addEventListener("click", function(){update='X';showHint()});
	
	// event for Reset button
	document.getElementById("reset").addEventListener("click", resetGame);
	
	// event for finish game button
	document.getElementById("finish").addEventListener("click", finishGame);
	
	// events for drag and drop
	let board = document.getElementsByTagName("td");
	for(let i=0; i<board.length; i++){
		document.getElementById(board[i].id).addEventListener("dragstart", function(){setDraggableColRow(board[i].id);checkMovement(event)});
		document.getElementById(board[i].id).addEventListener("drop", function(){setDropableColRow(board[i].id);checkMovementFinish(event)});
	}

	// save events values during dragging
	const cells = document.querySelectorAll('td');
			cells.forEach(td => {
				td.addEventListener('dragenter', dragEnter)
				td.addEventListener('dragend', dragEnd);
				td.addEventListener('dragleave', dragLeave);
				td.addEventListener('dragover', dragOver);
			});
	
}

/* Create array with selected pieces */
function createPiecesArray(){
	
	let pieces = JSON.parse(localStorage.getItem("Pieces")) || [];
	
	// Crystals are shown by default
	if( pieces == null || pieces == "crystals"){
		arrayPieces.push(new Piece(5,5,'<img src="media/blue.png">',0));	
		arrayPieces.push(new Piece(5,5,'<img src="media/diamond.png">',1));
		arrayPieces.push(new Piece(5,5,'<img src="media/emerald.png">',2));
		arrayPieces.push(new Piece(5,5,'<img src="media/green.png">',3));
		arrayPieces.push(new Piece(5,5,'<img src="media/purple.png">',4));
		arrayPieces.push(new Piece(5,5,'<img src="media/red.png">',5));
		arrayPieces.push(new Piece(5,5,'<img src="media/yellow.png">',6));
	} else {
		arrayPieces.push(new Piece(5,5,'<img src="media/blue_gum.png">',0));	
		arrayPieces.push(new Piece(5,5,'<img src="media/diamond_gum.png">',1));
		arrayPieces.push(new Piece(5,5,'<img src="media/emerald_gum.png">',2));
		arrayPieces.push(new Piece(5,5,'<img src="media/green_gum.png">',3));
		arrayPieces.push(new Piece(5,5,'<img src="media/purple_gum.png">',4));
		arrayPieces.push(new Piece(5,5,'<img src="media/red_gum.png">',5));
		arrayPieces.push(new Piece(5,5,'<img src="media/yellow_gum.png">',6));
	}
	
}

/* Create array with backgrounds */
function changeBackground(){
	
	let backgrounds = JSON.parse(localStorage.getItem("Background")) || [];

	// background by default
	if(backgrounds == null || backgrounds == "crystals_theme"){
		document.body.style.backgroundImage = "url('./media/bg-02-01.png')";
        document.body.style.backgroundRepeat = "repeat";
        document.body.style.backgroundSize = "cover";
	} else if(backgrounds == "gums_theme"){
		document.body.style.backgroundImage = "url('./media/candies.png')";
        document.body.style.backgroundRepeat = "repeat";
        document.body.style.backgroundSize = "cover";
	} else {
		document.body.style.backgroundImage = "url('./media/castle.png')";
        document.body.style.backgroundRepeat = "repeat";
        document.body.style.backgroundSize = "cover";
	}
}

/* Create board game - Game page*/
function createAndPrintBoard(){
	
	//get board size from local storage saved from config. page
	boardSize = JSON.parse(localStorage.getItem("BoardSize")) || [];

	// avoid errors in case local storage not properly set
	if(!boardSize > 0){
		boardSize = 8;
	}

	generateRandomPieces();
	
	// check for rows and columns in cascade 
	recursiveCheckRowsColumns();
	currentScore = 0;
	
	printBoard();
	setTimer();
	document.getElementById("currentGoalPieces").innerHTML = 0;
	currentPiecesDeleted = 0;
}

// set/reset timer 
function setTimer(){
	// if timer is set
	timer = JSON.parse(localStorage.getItem("Timer"));
	if(timer > 0){
		document.getElementById("timeDescription").innerHTML = "Time left";
		document.getElementById("timerRunning").innerHTML = "Game will finish in ";
		document.getElementById("time").innerHTML = timer;
		timerID = setInterval(updateTime, 1000);
		setBarPercentage(timer);
	}else{
		document.getElementById("timeDescription").innerHTML = "Time";
		document.getElementById("timerRunning").innerHTML = "Game time: ";
		document.getElementById("progressBar").style.display="none";
		timerID = setInterval(updateTime, 1000);
	}
}

// Print board game 
function printBoard(){
	
	let board = document.getElementById("boardGame");
	let tr = null;
	let td = null;
	let tdID;
	
	for(var i=0; i < boardSize; i++){
		tr = document.createElement("tr");
		for (var j=0; j < boardSize; j++){
			td = document.createElement("td");
			tdID = ''+i+j;
			td.setAttribute("id", tdID);
			td.innerHTML = matrixPieces[i][j].src;
			tr.appendChild(td);
			board.appendChild(tr);
		}
	}
}

function recursiveCheckRowsColumns(){
	
	// check for initial horizontal (at least) 3 equal pieces  
	for(let row=0; row<matrixPieces.length;row++){
		let returnRowArray = [];
		returnRowArray = checkHorizontalPieces(matrixPieces[row]);
		if(returnRowArray.length>0){
			//add score 
			incrementScore(returnRowArray.length);
			remove(row,-1,returnRowArray);
			accommodate();
			generateRandomPieces();
			row = -1;
			continue;
		}
		// check for initial vertical (at least) 3 equal pieces  
		for(let col=0; col<matrixPieces[0].length;col++){
			let returnColArray = [];
			returnColArray = checkVerticalPieces(col);
			if(returnColArray.length>0){
				//add score 
				incrementScore(returnColArray.length);
				remove(-1,col,returnColArray);
				accommodate();
				generateRandomPieces();
				//check from begin after accommodate
				row = -1;
				break;
			}
		}
	}
	
}

function generateRandomPieces(){
	
	let randomNum = 0;
	let count = 0;
	
	// create matrix from start
	if(matrixPieces.length == 0){
		for(var row=0; row<boardSize; row++){
			matrixPieces[row] = [];
			for (var col=0; col< boardSize; col++){
				// generate random number 
				randomNum = Math.random();
				// multiply with difference 
				randomNum = Math.floor( randomNum * arrayPieces.length);
				// local variable with images to be printed
				matrixPieces[row][col] = arrayPieces[randomNum];
			}
		}
	} else{
	// set only random nrs. after accommodate
	let count = 1;
	let previousRandomNum = 0;
		for(var row=0; row< boardSize; row++){
			for (var col=0; col< boardSize; col++){
				if(matrixPieces[row][col] == -1){
					// generate random number 
					randomNum = Math.random();
					// multiply with difference 
					randomNum = Math.floor( randomNum * arrayPieces.length);
					if(count == 2){
						previousRandomNum = randomNum;
					}
					//avoid create 3 times the same random nr.
					if(count == 3){
						while(previousRandomNum === randomNum){
							randomNum = Math.random();
							randomNum = Math.floor( randomNum * arrayPieces.length);
						}
						count = 1;
					}
					// local variable with images to be printed
					matrixPieces[row][col] = arrayPieces[randomNum];
					count ++;
				}
			}
		}
		
	}
}

// Check if exist 3 equals pieces in vertical
function checkVerticalPieces(col){
			// get column array
			let arrayColumn = [];
			arrayColumn = getColumnPieces(col);
			let arrayResult = [];
			arrayResult = checkHorizontalPieces(arrayColumn);
			return arrayResult;
}

function getColumnPieces(col){
	let arrayColumn = [];
	
	for(let row=0; row<matrixPieces.length; row++){
		arrayColumn[row] = matrixPieces[row][col];
	}
	
	return arrayColumn;
}

// Start implementation of function to check if exist 3 equals pieces in horizontal - Game page*/
function checkHorizontalPieces(arrayPieces){
	
	let aux, aux2, toRemove;
	let array;
											
		//get 1st and 2nd piece from arrayPieces
		aux = [0, arrayPieces[0].ID];
		aux2 = [1, arrayPieces[1].ID];
		array = [];
		toRemove = 0;
		
		for(let j=2; j < arrayPieces.length; j ++){
																		
			if(aux2[1] == null){
				aux2[0] = j;
				aux2[1] = arrayPieces[j].ID;
				continue;
			}
			
			if(aux[1] == null){
				aux[0] = j;
				aux[1] = arrayPieces[j].ID;
				aux2[0] = null;
				aux2[1] = null;
				continue;
			}
				
			if(aux[1] != aux2[1]){
				aux[0] = aux2[0];
				aux[1] = aux2[1];
				aux2[0] = j;
				aux2[1] = arrayPieces[j].ID;
				continue;
			}
			
			if ( (aux[1] === aux2[1]) && (aux2[1] != arrayPieces[j].ID) && (toRemove == 0) ){
				aux[0] = j;
				aux[1] = arrayPieces[j].ID;
				aux2[0] = null;	
				aux2[1] = null;
				continue;
			}
			
			if( (aux[1] === aux2[1]) && (aux2[1] === arrayPieces[j].ID) && (toRemove == 0) ){
					toRemove = 3;
					array = [aux[0], aux2[0] ,j];
					continue;
			}
			
			if(toRemove >= 3){
				if( aux2[1] === arrayPieces[j].ID ){
					toRemove ++;
					array.push(j);
					continue;
				} else{
					aux[0] = null;
					aux[1] = null;
					aux2[0] = -1;
					aux2[1] = -1;
					toRemove = 0;
					continue;
				}
			}
			
		}
			return array;
}

function updateTime(){
	
	if( timer > 0 ) {
		document.getElementById("time").innerHTML -- ;
		totalBarPercentage = totalBarPercentage + barPercentage;
		document.getElementById("myBar").style.width = totalBarPercentage + "%";
		if(document.getElementById("time").innerHTML < 0){
			// to avoid be visible a negative value even for milliseconds
			document.getElementById("time").innerHTML = 0;
			finishGame();
		}
	}else{
		document.getElementById("time").innerHTML ++ ;
	}
	gameTime ++;
}

function remove(rowParam, colParam, toRemove){
	let row,column;

	while (toRemove.length > 0){
		// to eliminate cells from specific row - horizontal
		if(rowParam != -1){
			column = toRemove[0];
			matrixPieces[rowParam][column] = -1;
		}
		// to eliminate cells from specific column - vertical
		if(colParam != -1){
			row = toRemove[0];
			matrixPieces[row][colParam] = -1;
		}
		toRemove.shift();
	}
}

function accommodate(){
	for(let row=matrixPieces.length-1; row>0; row--){
		for(let col=0; col<matrixPieces[row].length; col++){
			// first empty piece so column needs to be accommodate
			if( matrixPieces[row][col] == -1 ){
				let arrayAux = [];
				for(let i=matrixPieces.length-1;i>=0;i--){
					if(matrixPieces[i][col] != -1){
						arrayAux.unshift(matrixPieces[i][col]);
					}
				}
				// add empty values in the begin of arrayAux
				let size = arrayAux.length;
				while(size < matrixPieces[row].length){
					arrayAux.unshift(-1);
					size ++;
				}
				// change global variable matrixPieces
				for(let j=0; j < matrixPieces.length; j++){
					matrixPieces[j][col] = arrayAux[j];
				}
			}
			continue;
		}
	}
	//printBoard();
}

function setDraggableColRow(id){
	dragRow = id.substring(0, 1);
	dragColumn = id.substring(1, 2);
	// remove hint border in case is set
	document.getElementById(id).style.border = null;
}

function setDropableColRow(id){
	dropRow = id.substring(0, 1);
	dropColumn = id.substring(1, 2);
	// remove hint border in case is set
	document.getElementById(id).style.border = null;

			// check if movement is done to above or below immediately row
			if(dropRow - dragRow == 1 || dropRow - dragRow == -1){
				// column needs to be the same to avoid diagonal moves
				if(dropColumn == dragColumn){					
					// create array with row pieces to check if exist 3 (at least) equal pieces to allow move
					let newSequence = [];
					let arrayReturn = [];
					newSequence = newSequenceCol(dropColumn);
					newSequence = swapPieces("col", newSequence);
					arrayReturn = checkHorizontalPieces(newSequence);
					// arrayReturn is filled if movement was done in the same column for vertical move
					if(arrayReturn.length>0){
						// set newSequence to internal matrixPieces
						for(let row=0; row<newSequence.length; row++){
							matrixPieces[row][dropColumn] = newSequence[row];
						}
						//add score 
						incrementScore(arrayReturn.length);
						remove(-1,dropColumn,arrayReturn);
						accommodate();
						generateRandomPieces();
					}
					// arrayReturn is empty if movement was done in the same column but for horizontal move
					else{
						// check drag piece column
						newSequence = newSequenceRow(dragRow);
						newSequence = swapPiecesCol("drag",newSequence);
						arrayReturn = checkHorizontalPieces(newSequence);
						if(arrayReturn.length>0){
							//keep drag piece
							let auxDragPiece = matrixPieces[dragRow][dragColumn];
							// set newSequence to internal matrixPieces
							for(let col=0; col<newSequence.length; col++){
								matrixPieces[dragRow][col] = newSequence[col];
							}
							//maintain drag piece in the new correct place
							matrixPieces[dropRow][dropColumn] = auxDragPiece;
							//add score 
							incrementScore(arrayReturn.length);
							remove(dragRow,-1,arrayReturn);
							accommodate();
							generateRandomPieces();
						}
						// check drop piece column
						else{
							newSequence = newSequenceRow(dropRow);
							newSequence = swapPiecesCol("drop",newSequence);
							arrayReturn = checkHorizontalPieces(newSequence);
							if(arrayReturn.length>0){
								//maintain drop piece in the new correct place
								matrixPieces[dragRow][dragColumn] = matrixPieces[dropRow][dropColumn];
								// set newSequence to internal matrixPieces
								for(let col=0; col<newSequence.length; col++){
									matrixPieces[dropRow][col] = newSequence[col];
								}
								//add score 
								incrementScore(arrayReturn.length);
								remove(dropRow,-1,arrayReturn);
								accommodate();
								generateRandomPieces();
							}
						}	
						
					}
					
				} else{
					console.log("Ilegal movement - column needs to be same");
				}
			}
				
			// check if movement is done in the same row
			if(dropRow - dragRow == 0){
				// column pieces needs to be different and immediately next
				if(dropColumn - dragColumn == -1 || dropColumn - dragColumn == 1){	
					// create array with row pieces to check if exist 3 (at least) equal pieces to allow move
					let newSequence = [];
					newSequence = newSequenceRow(dropRow);
					newSequence = swapPieces("row", newSequence);	
					let arrayReturn = [];
					arrayReturn = checkHorizontalPieces(newSequence);
					if(arrayReturn.length>0){
						// set newSequence to internal matrixPieces
						for(let col=0; col<newSequence.length; col++){
							matrixPieces[dropRow][col] = newSequence[col];
						}
						//add score 
						incrementScore(arrayReturn.length);
						remove(dragRow,-1,arrayReturn);
						accommodate();
						generateRandomPieces();
					}// arrayReturn is empty if movement was done in the same row but for vertical move
					else{
						// check drag piece row
						newSequence = newSequenceCol(dragColumn);
						newSequence = swapPiecesCol("dragCol",newSequence);
						arrayReturn = checkHorizontalPieces(newSequence);
						if(arrayReturn.length>0){
							//keep drag piece
							let auxDragPiece = matrixPieces[dragRow][dragColumn];
							// set newSequence to internal matrixPieces
							for(let row=0; row<newSequence.length; row++){
								matrixPieces[row][dragColumn] = newSequence[row];
							}
							//maintain drag piece in the new correct place
							matrixPieces[dropRow][dropColumn] = auxDragPiece;
							//add score 
							incrementScore(arrayReturn.length);
							remove(-1,dragColumn,arrayReturn);
							accommodate();
							generateRandomPieces();
						}
						// check drop piece row
						else{
							newSequence = newSequenceCol(dropColumn);
							newSequence = swapPiecesCol("dropCol",newSequence);
							arrayReturn = checkHorizontalPieces(newSequence);
							if(arrayReturn.length>0){
								//maintain drop piece in the new correct place
								matrixPieces[dragRow][dragColumn] = matrixPieces[dropRow][dropColumn];
								// set newSequence to internal matrixPieces
								for(let row=0; row<newSequence.length; row++){
									matrixPieces[row][dropColumn] = newSequence[row];
								}
								//add score 
								incrementScore(arrayReturn.length);
								remove(-1,dropColumn,arrayReturn);
								accommodate();
								generateRandomPieces();
							}
						}	
						
					}
				}else{
				console.log("Ilegal movement - column needs to be immediately before/after");
				}
			}	
			// check for rows and columns in cascade 
			recursiveCheckRowsColumns();
			rePrintBoard();
			document.getElementById("currentScore").innerHTML = currentScore;
			update = '';
			showHint();
			if(currentPiecesDeleted >= goalPieces){
				window.alert("Goal is achieved! Congratulations");
				finishGame();
			}
}

function rePrintBoard(){
	
	let tdID;
	
	for(var row=0; row < boardSize; row++){
		for (var col=0; col < boardSize; col++){
			tdID = ''+row+col;
			document.getElementById(tdID).innerHTML = matrixPieces[row][col].src;
		}
	}
		
}

function newSequenceRow(row){
	let newSequence = [];
	
	for(let col=0; col<matrixPieces[row].length; col++){
		newSequence[col] = matrixPieces[row][col];
	}	
	return newSequence;
}

function newSequenceCol(col){
	let newSequence = [];
	
	for(let row=0; row<matrixPieces.length; row++){
		newSequence[row] = matrixPieces[row][col];
	}	
	return newSequence;
}

function swapPieces(checkOperation, newSequence){
	
	let dragImage = matrixPieces[dragRow][dragColumn];
	let dropImage = matrixPieces[dropRow][dropColumn];

	if(checkOperation === "row"){
		newSequence[dragColumn] = dropImage;
		newSequence[dropColumn] = dragImage;	
	}
	
	if(checkOperation === "col"){
		newSequence[dragRow] = dropImage;
		newSequence[dropRow] = dragImage;	
	}
	
	return newSequence;
}

function swapPiecesCol(checkOperation, newSequence){
	
	let dragImage = matrixPieces[dragRow][dragColumn];
	let dropImage = matrixPieces[dropRow][dropColumn];

	if(checkOperation === "drag"){
		newSequence[dragColumn] = dropImage;
	}
	if(checkOperation === "drop"){
		newSequence[dropColumn] = dragImage;
	}
	if(checkOperation === "dragCol"){
		newSequence[dragRow] = dropImage;
	}
	if(checkOperation === "dropCol"){
		newSequence[dropRow] = dragImage;
	}

	return newSequence;
}

function incrementScore(nrPieces){
	currentScore += ( nrPieces - 3) + 1;
	currentPiecesDeleted = currentPiecesDeleted + nrPieces;
	document.getElementById("currentGoalPieces").innerHTML = currentPiecesDeleted;
}

function checkMovement(e){
	e.target.classList.add('drag-over');
	e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
    }, 0);
}

function checkMovementFinish(e){
        setTimeout(() => {
    }, 0);
}

function dragEnter(e) {
	e.preventDefault();
	e.target.classList.add('drag-enter');
}

function dragEnd(e) {
	e.preventDefault();
	e.target.classList.remove('drag-over');
}

function dragOver(e) {
	e.preventDefault();
}

function dragLeave(e) {
	e.preventDefault();
	e.target.classList.add('drag-enter');
}

function setBarPercentage(timer){
	barPercentage = 100 / timer;
}

function resetGame(){
	clearInterval(timerID);
	window.alert("Game will be reset. Statistics from this current game are now saved.");
	saveGameStatistics();
	matrixPieces = [];
	generateRandomPieces();
	recursiveCheckRowsColumns();
	rePrintBoard();
	currentScore = 0;
	gameTime = 0;
	totalBarPercentage = 0;
	document.getElementById("time").innerHTML = 0;
	document.getElementById("currentScore").innerHTML = 0;
	document.getElementById("myBar").style.width = 0 + "%";
	setTimer();
}

function finishGame(){
	
	clearInterval(timerID);
	window.alert("Game is finish. You will be redirected to statistics page.");
	saveGameStatistics();
	location.href = "statistics.html";
	return false;
}

function saveGameStatistics(){
	
	let nickname = JSON.parse(localStorage.getItem("CurrentUser")) || [];
	let users = JSON.parse(localStorage.getItem("Users")) || [];
	
	// add time played and score into player local storage
	for(let i=0; i<users.length; i++){
		
		if( nickname === users[i].nickname ){ 
			users[i].gamesPlayed ++;
			users[i].timePlayed += gameTime;
			users[i].totalScore += currentScore;
			if (boardSize == 8 && timer == 0 && currentScore > users[i].highScore8x8){
				users[i].highScore8x8 = currentScore;
			}
			if (boardSize == 9 && currentScore > users[i].highScore9x9){
				users[i].highScore9x9 = currentScore;
			}
			if (boardSize == 10 && currentScore > users[i].highScore10x10){
				users[i].highScore10x10 = currentScore;
			}
			if (boardSize == 8 && timer > 0 && currentScore > users[i].highScoreTimer){
				users[i].highScoreTimer = currentScore;
			}
		}
	}

	localStorage.setItem("Users", JSON.stringify(users));
}

// Show hint for possible move
function showHint(){
	let piece1, piece2, tdID;
	
	for(let row=0; row<matrixPieces.length; row ++){
// ******************** check horizontal for format |1|1|2|1| ****************************
		piece1 = matrixPieces[row][0];
		piece2 = matrixPieces[row][1];
		
		for(let col=3; col<matrixPieces[row].length; col ++){
			if( (piece1 == piece2) && (piece2 == matrixPieces[row][col]) ){
				tdID = ''+row+col;
				highlightCell(tdID);
				return true;
			}else{
				piece1 = piece2;
				piece2 = matrixPieces[row][col-1];
			}				
		}
		
// *********************** check horizontal for format |1|2|1|1| ***************************
		let length = matrixPieces[row].length-1;
		piece1 = matrixPieces[row][length];
		piece2 = matrixPieces[row][length-1];
		let size = length-3;
		
		for(let col=size; col>=0; col --){
			if ( (piece1 == piece2) && (piece2 == matrixPieces[row][col]) ){
				tdID = ''+row+col;
				highlightCell(tdID);
				return true;
			}else{
				piece1 = piece2;
				piece2 = matrixPieces[row][col+1];
			}
		}
	}	
	
// ***************** check horizontal for format         |1| ************************************
												  // |1|1|x|
												  //	 |1|
	for(let row=0; row<matrixPieces.length; row ++){

		piece1 = matrixPieces[row][0];
		piece2 = matrixPieces[row][1];
		for(let col=2; col<matrixPieces[row].length; col ++){
			// if row 0, check only row below	
			if(row == 0){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row+1][col]) ){
					tdID = ''+(row+1)+(col);
					highlightCell(tdID);
					return true;
				}
			}			
			// if row greater than 0 and lower than last row, check row above and below 	
			if(row > 0 && row < matrixPieces.length-1){
				// row above
				if( (piece1 == piece2) && (piece2 == matrixPieces[row-1][col]) ){
					tdID = ''+(row-1)+(col);
					highlightCell(tdID);
					return true;
				}
				// row below
				if( (piece1 == piece2) && (piece2 == matrixPieces[row+1][col]) ){
					tdID = ''+(row+1)+(col);
					highlightCell(tdID);
					return true;
				}
			}
			// if row equal than last row, check only row above 	
			if(row == matrixPieces.length-1){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row-1][col]) ){
					tdID = ''+(row-1)+(col);
					highlightCell(tdID);
					return true;
				}
			}
			piece1 = piece2;
			piece2 = matrixPieces[row][col];
		}
	}
	
// ***************** check horizontal for format     |1|             ************************************
												  // |X|1|1|
												  // |1|
	for(let row=0; row<matrixPieces.length; row ++){
		let length = matrixPieces[row].length-1;
		piece1 = matrixPieces[row][length];
		piece2 = matrixPieces[row][length-1];
		let size = length-2;
				
		for(let col=size; col>=0; col --){
			// if row 0, check only row below	
			if(row == 0){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row+1][col]) ){
					tdID = ''+(row+1)+(col);
					highlightCell(tdID);
					return true;
				}
			}			
			// if row greater than 0 and lower than last row, check row above and below 	
			if(row > 0 && row < matrixPieces.length-1){
				// row above
				if( (piece1 == piece2) && (piece2 == matrixPieces[row-1][col]) ){
					tdID = ''+(row-1)+(col);
					highlightCell(tdID);
					return true;
				}
				// row below
				if( (piece1 == piece2) && (piece2 == matrixPieces[row+1][col]) ){
					tdID = ''+(row+1)+(col);
					highlightCell(tdID);
					return true;
				}
			}
			// if row equal than last row, check only row above 	
			if(row == matrixPieces.length-1){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row-1][col]) ){
					tdID = ''+(row-1)+(col);
					highlightCell(tdID);
					return true;
				}
			}
			piece1 = piece2;
			piece2 = matrixPieces[row][col];
		}
	}
	
// ***************** check horizontal for format       |1|             ************************************
												  // |1|x|1|
												  //   |1|
	for(let row=0; row<matrixPieces.length; row ++){
				
		for(let col=1; col<matrixPieces[row].length-1; col ++){
			piece1 = matrixPieces[row][col-1];
			piece2 = matrixPieces[row][col+1];
			// if row 0, check only row below	
			if(row == 0){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row+1][col]) ){
					tdID = ''+(row+1)+(col);
					highlightCell(tdID);
					return true;
				}
			}			
			// if row greater than 0 and lower than last row, check row above and below 	
			if(row > 0 && row < matrixPieces.length-1){
				// row above
				if( (piece1 == piece2) && (piece2 == matrixPieces[row-1][col]) ){
					tdID = ''+(row-1)+(col);
					highlightCell(tdID);
					return true;
				}
				// row below
				if( (piece1 == piece2) && (piece2 == matrixPieces[row+1][col]) ){
					tdID = ''+(row+1)+(col);
					highlightCell(tdID);
					return true;
				}
			}
			// if row equal than last row, check only row above 	
			if(row == matrixPieces.length-1){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row-1][col]) ){
					tdID = ''+(row-1)+(col);
					highlightCell(tdID);
					return true;
				}
			}
		}
	}
	
	for(let col=0; col<matrixPieces.length; col ++){
// ******************** check vertical for format |1| ****************************
											  //  |1|
											  //  |2|
											  //  |1|
		piece1 = matrixPieces[0][col];
		piece2 = matrixPieces[1][col];
		
		for(let row=3; row<matrixPieces.length; row ++){
			if( (piece1 == piece2) && (piece2 == matrixPieces[row][col]) ){
				tdID = ''+row+col;
				highlightCell(tdID);
				return true;
			}else{
				piece1 = piece2;
				piece2 = matrixPieces[row-1][col];
			}				
		}
		
// *********************** check horizontal for format |1| ***************************
												  //   |2|
												  //   |1|
												  //   |1|
		let length = matrixPieces.length-1;
		piece1 = matrixPieces[length][col];
		piece2 = matrixPieces[length-1][col];
		let size = length-3;
		
		for(let row=size; row>=0; row --){
			if ( (piece1 == piece2) && (piece2 == matrixPieces[row][col]) ){
				tdID = ''+row+col;
				highlightCell(tdID);
				return true;
			}else{
				piece1 = piece2;
				piece2 = matrixPieces[row+1][col];
			}
		}
	}
	
	// ***************** check vertical for format      |1|  ************************************
												  //    |1|
												  //  |1|X|1| 
	for(let col=0; col<matrixPieces.length; col ++){

		piece1 = matrixPieces[0][col];
		piece2 = matrixPieces[1][col];
		for(let row=2; row<matrixPieces.length; row ++){
			// if column 0, check only column right side	
			if(col == 0){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col+1]) ){
					tdID = ''+(row)+(col+1);
					highlightCell(tdID);
					return true;
				}
			}			
			// if column greater than 0 and lower than last column, check column from left and right 	
			if(col > 0 && col < matrixPieces.length-1){
				// column left
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col-1]) ){
					tdID = ''+(row)+(col-1);
					highlightCell(tdID);
					return true;
				}
				// column right
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col+1]) ){
					tdID = ''+(row)+(col+1);
					highlightCell(tdID);
					return true;
				}
			}
			piece1 = piece2;
			piece2 = matrixPieces[row][col];
		}
	}
	
// ***************** check vertical for format    |1|X|1|  ************************************
											  //    |1|
											  //    |1|
	for(let col=0; col<matrixPieces.length; col ++){
		let length = matrixPieces.length-1;
		piece1 = matrixPieces[length][col];
		piece2 = matrixPieces[length-1][col];
		let size = length-2;
				
		for(let row=size; row>=0; row --){
			// if column 0, check only columng right	
			if(col == 0){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col+1]) ){
					tdID = ''+(row)+(col+1);
					highlightCell(tdID);
					return true;
				}
			}			
			// if column greater than 0 and lower than last column, check column left and right 	
			if(col > 0 && col < matrixPieces.length-1){
				// column right
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col+1]) ){
					tdID = ''+(row)+(col+1);
					highlightCell(tdID);
					return true;
				}
				// column left
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col-1]) ){
					tdID = ''+(row)+(col-1);
					highlightCell(tdID);
					return true;
				}
			}
			// if last column, check only column left 	
			if(col == matrixPieces.length-1){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col-1]) ){
					tdID = ''+(row)+(col-1);
					highlightCell(tdID);
					return true;
				}
			}
			piece1 = piece2;
			piece2 = matrixPieces[row][col];
		}
	}
	
// ***************** check vertical for format         |1|             ************************************
												  // |1|x|1|
												  //   |1|
	for(let col=0; col<matrixPieces.length; col ++){
				
		for(let row=1; row<matrixPieces.length-1; row ++){
			piece1 = matrixPieces[row-1][col];
			piece2 = matrixPieces[row+1][col];
			// if column 0, check only right column	
			if(col == 0){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col+1]) ){
					tdID = ''+(row)+(col+1);
					highlightCell(tdID);
					return true;
				}
			}			
			// if column greater than 0 and lower than last column, check left and right column 	
			if(col > 0 && col < matrixPieces.length-1){
				// right column
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col+1]) ){
					tdID = ''+(row)+(col+1);
					highlightCell(tdID);
					return true;
				}
				// left column
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col-1]) ){
					tdID = ''+(row)+(col-1);
					highlightCell(tdID);
					return true;
				}
			}
			// if last column, check only left column 	
			if(col == matrixPieces.length-1){
				if( (piece1 == piece2) && (piece2 == matrixPieces[row][col-1]) ){
					tdID = ''+(row)+(col-1);
					highlightCell(tdID);
					return true;
				}
			}
		}
	}
	
	// no more hints are available, game can be finished
	window.alert("No more movements available!");
	finishGame();
	
}

function highlightCell(id){
	if(update == 'X'){
		document.getElementById(id).style.border = "solid 5px green";
		setTimeout(function() {
		document.getElementById(id).style.border = null;}, 3000);
		return true;
	}
}

window.addEventListener("load", principal);