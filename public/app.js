
"use strict"

var currentPiece = {
    piece: "",
    oldSquare: "",
    newSquare:""
        
};

var app = {

	gameBoard : {},
    gameID: "",
    myRole: "",
    mySocketId: "",
    currectRound: 0,

    init: function(){
		app.ui = document.querySelector('.userUi');
		app.startBtn = document.querySelector('#startBtn');
		app.startBtn.addEventListener('click', app.playerSearchGame) ;

	},
	playerSearchGame : function(){
		IO.socket.emit('playerSearchGame');
		console.log('sreaching for game');
	},
	playerReleasePiece : function(event) {
		event.preventDefault();
		const newSquare = event.currentTarget.id;
		currentPiece.newSquare = newSquare;
		console.log(currentPiece.oldSquare, currentPiece.newSquare);
		const valid = validateMove(currentPiece.oldSquare, 
								   currentPiece.newSquare, 
								   currentPiece.piece);

		if(valid){
			IO.socket.emit('movePiece',currentPiece.oldSquare,
						currentPiece.newSquare, app.gameBoard);
		}else{
			alert('illigal move')
		};
		const tds = document.querySelectorAll('TD');
		for (const td of tds) {
			td.removeEventListener("mouseup", app.playerReleasePiece);
		}
			
	},
	playerSelectPiece : function(event){
		event.preventDefault();
		console.log(event.currentTarget);
		
		const tds = document.querySelectorAll('TD');
		for (const td of tds) {
			if(td.innerHTML === "")
				td.addEventListener("mouseup", app.playerReleasePiece);
		}
		
		currentPiece.oldSquare = event.currentTarget.parentElement.id;
		currentPiece.piece = event.currentTarget.className;
	
	},
    renderBoard : function(newBoard){
        app.gameBoard = newBoard;
        app.ui.style.display = "none";
        console.log('in render');
        for (var spot in newBoard) {
        
            let tds = document.querySelectorAll('TD');
            if(newBoard[spot] !== ""){
                // console.log(spot);
                const td = document.querySelector('#'+spot);
                if(td.innerHTML === ""){
                    const div = document.createElement('DIV');
                    div.className = newBoard[spot].color
                    td.appendChild(div);
                    div.addEventListener("mousedown", app.playerSelectPiece);
                }
            }else{

                const td = document.querySelector('#'+spot);
                if(td.childElementCount > 0){
                    td.innerHTML = "";
                }
            }
        }
        
    }
}
var IO = {

    init: function(){
        IO.socket = io.connect();
        IO.bindEvents();
    },

    bindEvents : function(){
        IO.socket.on('waitForOpponent', IO.waitForOpponent)
        IO.socket.on('findOpponent', IO.findOpponent)
        IO.socket.on('renderBoard', app.renderBoard)

    },

    waitForOpponent : function(id){
        app.gameID = id;
        const text = document.createElement('H3');
        text.innerHTML = 'Wait for opponent';
        text.className = 'center text';
        app.ui.appendChild(text);
        const loader = document.createElement('DIV');
        loader.className = 'loader center';
        app.ui.appendChild(loader);
        app.startBtn.remove();

    },

    findOpponent : function(){
        IO.socket.emit('startGame', app.gameID);

    }


}

IO.init();
app.init();


function validateMove(oldS, newS ,turn){
    let tran = {A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8};
    let valid = false;
    let oldX = oldS[1];
    let oldY = oldS[0];
    let newX = newS[1];
    let newY = newS[0];
  
    if(app.gameBoard[newS] !== ""){
        console.log('invalid move ', newS);
        valid = false;
    }else if(parseInt(oldX) + 1 === parseInt(newX) || parseInt(oldX) - 1 === parseInt(newX)){
        if(turn === "red"){
            if(tran[oldY] + 1 === tran[newY]){
                valid = true;
            }
        }else{
            if(tran[oldY] - 1 === tran[newY]){
                valid = true;
            }
        }
    }else if(parseInt(oldX) + 2 === parseInt(newX) || parseInt(oldX) - 2 === parseInt(newX)){
        if(turn === "red"){
            if(tran[oldY] + 2 === tran[newY]){
                valid = true;
            }
        }else{
            if(tran[oldY] - 2 === tran[newY]){
                valid = true;
            }
        }
    }
    return valid;
};