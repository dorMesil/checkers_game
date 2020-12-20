
"use strict"

const socket = io();
var gameBoard = {};
var gameID;
 
const ui = document.querySelector('.userUi');
ui.className - 'center';
const startBtn = document.createElement('BUTTON');
startBtn.className = "btn btn-primary";
startBtn.id = 'start';
startBtn.innerHTML = 'start game';
ui.appendChild(startBtn);
startBtn.addEventListener('click', () => {
    socket.emit('playerSearchGame');
    console.log('sreaching for game');

});

socket.on('waitForOpponent',(id) => {
    gameID = id;
    const text = document.createElement('H3');
    text.innerHTML = 'Wait for opponent';
    text.className = 'center text';
    ui.appendChild(text);
    const loader = document.createElement('DIV');
    loader.className = 'loader center';
    ui.appendChild(loader);
    const btn = document.querySelector('#start');
    btn.remove();
});
socket.on('findOpponent', () =>{
    socket.emit('startGame', gameID);
})
socket.on('renderBoard', (board) =>{
    gameBoard = board;
    ui.style.display = "none";
    renderBoard(gameBoard);	
}); 
    
var currentPiece = {
    piece: "",
    oldSquare: "",
    newSquare:""
        
};
function playerSelectPiece(event){
    event.preventDefault();
    console.log(event.currentTarget);
    console.log('piece color ', event.currentTarget.className);
    event.currentTarget.style.backgroundColor = (event.currentTarget.className === 'red')? 'rgba(171, 3, 9, 0.7)' : 'rgba(0,0,0, 0.7)';
    
    const tds = document.querySelectorAll('TD');
    for (const td of tds) {
        td.addEventListener("mouseup", playerReleasePiece);
    }
    // currentPiece.piece = event.currentTarget;
    currentPiece.oldSquare = event.currentTarget.parentElement.id;
    currentPiece.piece = event.currentTarget.className;
    console.log(currentPiece.piece);

}
function playerReleasePiece(event) {
    event.preventDefault();
    const newSquare = event.currentTarget.id;
    currentPiece.newSquare = newSquare;
    console.log(currentPiece.oldSquare, currentPiece.newSquare);
    const valid = validateMove(currentPiece.oldSquare, 
                               currentPiece.newSquare, 
                               currentPiece.piece);
    console.log('valid ', valid);
    if(valid){
        console.log('game id ' ,gameID);
        socket.emit('movePiece',currentPiece.oldSquare,
                    currentPiece.newSquare, gameBoard);
    }else{
        alert('illigal move')
    };
    const tds = document.querySelectorAll('TD');
    for (const td of tds) {
        td.removeEventListener("mouseup", playerReleasePiece);
    }
        
}
function validateMove(oldS, newS ,turn){
    let tran = {A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8};
    let valid = false;
    let oldX = oldS[1];
    let oldY = oldS[0];
    let newX = newS[1];
    let newY = newS[0];

    if(gameBoard[newS] !== ""){
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

function renderBoard(board){
    console.log('in render');
    gameBoard = board;
    for (const spot in board) {
        
        let tds = document.querySelectorAll('TD');
        if(board[spot] !== ""){
            // console.log(spot);
            const td = document.querySelector('#'+spot);
            if(td.innerHTML === ""){
                const div = document.createElement('DIV');
                div.className = board[spot].color
                td.appendChild(div);
                div.addEventListener("mousedown", playerSelectPiece);
            }
        }else{

            const td = document.querySelector('#'+spot);
            if(td.childElementCount > 0){
                td.innerHTML = "";
            }
        }
    }

}