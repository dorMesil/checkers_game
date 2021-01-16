var io;
var hostSocket;
var gameID;
var gameBoard = {};

const defaultBoard = {
    A1: "", A2: "", A3: "", A4: "", A5: "", A6: "", A7: "", A8: "",
    B1: "", B2: "", B3: "", B4: "", B5: "", B6: "", B7: "", B8: "",  
    C1: "", C2: "", C3: "", C4: "", C5: "", C6: "", C7: "", C8: "", 
    D1: "", D2: "", D3: "", D4: "", D5: "", D6: "", D7: "", D8: "", 
    E1: "", E2: "", E3: "", E4: "", E5: "", E6: "", E7: "", E8: "", 
    F1: "", F2: "", F3: "", F4: "", F5: "", F6: "", F7: "", F8: "", 
    G1: "", G2: "", G3: "", G4: "", G5: "", G6: "", G7: "", G8: "",
    H1: "", H2: "", H3: "", H4: "", H5: "", H6: "", H7: "", H8: "",  
}
// const gameBoard = [[ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null], 
//                    [ null, null, null, null, null, null, null, null]
//                   ]
// const redPieceSpot = ["A2", "A4", "A6", "A8",
// 						"B1","B3","B5","B7",
// 						"C2", "C4", "C6", "C8"]
// const blackPieceSpot = ["F1", "F3", "F5", "F7",
//                     "G2", "G4", "G6", "G8",
//                     "H1", "H3", "H5", "H7", ];



exports.initGame = function(sio, socket, id){
    io = sio;
    hostSocket = socket;
    gameID = id;
    console.log('you are connected');
    socket.on('movePiece', movePiece);
    
    gameBoard = fixBoard(defaultBoard); 
    io.to(gameID).emit('renderBoard', gameBoard)
};


function movePiece(oldSquare, newSquare, board){
    console.log('player move piece\n',oldSquare, newSquare);
    gameBoard = board;
    if(gameBoard[oldSquare] !== "" && gameBoard[newSquare] === ""){
        gameBoard[newSquare] = gameBoard[oldSquare]
        gameBoard[oldSquare] = "";
    }
    // console.log(gameBoard);
    // console.log(gameID);
    io.to(gameID).emit('renderBoard', gameBoard)
}

// function fixBoard(startBoard){
//     console.log('in fix board');
//     for (const spot of redPieceSpot) {
//         startBoard[spot] = new Piece('red');
//     }
//     for (const spot of blackPieceSpot) {
//         startBoard[spot] = new Piece('black');
//     }
//     return JSON.parse(JSON.stringify(startBoard));
   
// }