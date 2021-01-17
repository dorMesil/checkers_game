
"use strict"

class  Piece{
    
    constructor(color, tile){
        this.color = color;
        this.tile = tile;
        this.king = false;

    }
}

class Board{

    constructor(){
        this.board = {
            A1: "", A2: "", A3: "", A4: "", A5: "", A6: "", A7: "", A8: "",
            B1: "", B2: "", B3: "", B4: "", B5: "", B6: "", B7: "", B8: "",  
            C1: "", C2: "", C3: "", C4: "", C5: "", C6: "", C7: "", C8: "", 
            D1: "", D2: "", D3: "", D4: "", D5: "", D6: "", D7: "", D8: "", 
            E1: "", E2: "", E3: "", E4: "", E5: "", E6: "", E7: "", E8: "", 
            F1: "", F2: "", F3: "", F4: "", F5: "", F6: "", F7: "", F8: "", 
            G1: "", G2: "", G3: "", G4: "", G5: "", G6: "", G7: "", G8: "",
            H1: "", H2: "", H3: "", H4: "", H5: "", H6: "", H7: "", H8: "" 
        };
        this.redPieces = [];
        this.blackPieces = [];

    }
    initiateGame(){
        
        const redPieceSpot = ["A2", "A4", "A6", "A8",
						"B1","B3","B5","B7",
						"C2", "C4", "C6", "C8"]
        const blackPieceSpot = ["F1", "F3", "F5", "F7",
                            "G2", "G4", "G6", "G8",
                            "H1", "H3", "H5", "H7", ];

        console.log('in initiateGame');
        for (const spot of redPieceSpot) {
            var piece = new Piece('red', spot)
            this.board[spot] = piece;
            // this.board[spot] = new Piece('red', spot);
            // app.redPieces.push(this.board[spot])
            this.redPieces.push(piece)
        }
        for (const spot of blackPieceSpot) {
            
            var piece = new Piece('black', spot)
            this.board[spot] = piece;
            // this.board[spot] = new Piece('black', spot);
            // app.blackPieces.push(this.board[spot])
            this.blackPieces.push(piece)
        }
           
        
    }
    check_diagonal_dist(currectTile, newTile){
        // console.log('check diagonal \n', this);
        
        var diagonalTiles = [];
        if((currectTile - newTile)%11 === 0 && (currectTile - newTile) < 0){
            for(var i = currectTile+11 ; i<88;  i+=11){
                diagonalTiles.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonalTiles.pop();
                    var distance = (newTile-currectTile)/11
                    var Direction = 1;
                    return {distance :distance, direction: Direction, tilesArray: diagonalTiles};
                }
            }
        }
        if((currectTile - newTile)%11 === 0 && (currectTile - newTile) > 0){
            var diagonalTiles = [];
            for(var i = currectTile-11 ; i>11;  i-=11){
                diagonalTiles.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonalTiles.pop();
                    var distance = (newTile-currectTile)/11
                    var Direction = -1;
                    return {distance :distance, direction: Direction, tilesArray: diagonalTiles};
                }
            }
        }
        if((currectTile - newTile)%9 === 0 && (currectTile - newTile) < 0){
            var diagonalTiles = [];
            for(var i = currectTile+9 ; i<88;  i+=9){
                diagonalTiles.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonalTiles.pop();
                    var distance = (newTile-currectTile)/9
                    var Direction = -1;
                    return {distance :distance, direction: Direction, tilesArray: diagonalTiles};
                }
            }
        }
        if((currectTile - newTile)%9 === 0 && (currectTile - newTile) > 0){
            var diagonalTiles = [];
            for(var i = currectTile-9;  i>11;  i-=9){
                
                diagonalTiles.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonalTiles.pop();
                    var distance = (newTile-currectTile)/9
                    var Direction = 1;
                    return {distance :distance, direction: Direction, tilesArray: diagonalTiles};
                }
            }
        }
        return false;
    }
    
    pieceOnLastLine(piece){
        if(piece.color === 'red' ){
            if(piece.tile[0] === 'H'){
                piece.king = true;
                return true
            }
        }else{
            if(piece.tile[0] === 'A'){
                piece.king = true;
                return true
            }
        }
        return false;
    }
    findPieceInPieceArray(tile){
        var index = 0;

        for(var piece of this.redPieces){
            if(piece.tile === tile){
                return {index: index, piece : piece};

            }
            index++;
        }
        var index = 0;

        for(var piece of this.blackPieces){
            if(piece.tile === tile){
                return {index: index, piece : piece};

            }
            index++;
        }
        console.log('not found piece in array')
        return false;

    }
    pieceCanJump(piece, move){
        var countOpponentPieces = 0;
        for(var tile of move.tilesArray){
            if(this.board[tile] !== ""){
                if((this.board[tile]).color === piece.color){
                    return false;
                }
                if((this.board[tile]).color !== piece.color){
                    countOpponentPieces++;
                }
                if(countOpponentPieces >= 2){
                    return false;
                }

            }
            
        }
        
        return true;
    }
    
    movePeice(piece, newTile){
        
        this.board[piece.tile] = "";
        this.board[newTile] = piece;
        var movingPiece = this.findPieceInPieceArray(piece.tile);
        // console.log(this)
        movingPiece.piece.tile = newTile;
        // console.log('moving piece ', movingPiece)

    }
    removeOppenentPIece(tilesArray){
        for(var tile of tilesArray){
            this.board[tile] = "";
            if(this.findPieceInPieceArray(tile)){
                
                var piece = this.findPieceInPieceArray(tile);
                console.log('piece -- ' , piece)
                if(piece.piece.color ==='red'){
                    this.redPieces.splice(piece.index,1);
                }else{
                    
                    this.blackPieces.splice(piece.index,1);
                }
            }
        }
    }
}   
var app = {

	gameBoard : null,
    gameID: "",
    myRule: "",
    mySocketId: "",
    turn : 'red',
    currectRound: 0,
    selectedPiece: null,

    init: function(){
        this.getDomElement();
		this.bindEvents();

    },
    bindEvents : function() {
		this.startBtn.addEventListener('click', this.playerSearchGame) ;

    },
    getDomElement : function(){
        this.ui = document.querySelector('.userUi');
        this.startBtn = document.querySelector('#startBtn');
        this.tds = document.querySelectorAll('TD');
    },
	playerSearchGame : function(){
		IO.socket.emit('playerSearchGame');
		console.log('sreaching for game');
    },
    playerMove: function(newTilePosition){
        // console.log('player logics',this);
        
        var move = this.gameBoard.check_diagonal_dist(tileToInt(this.selectedPiece.tile), tileToInt(newTilePosition));
        // console.log('move ------- ', move,'\n',this);
        if(move){
            switch (app.turn) {
                case "red":
                    if(move.distance < 0 && this.selectedPiece.king ){
                        console.log('player move red king piece!')
                        if(Math.abs(move.distance) === 1){
                            app.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                            IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                        }else if (Math.abs(move.distance) === 2 && this.gameBoard.pieceCanJump(this.selectedPiece, move)){
                            
                            this.gameBoard.movePeice(app.selectedPiece, newTilePosition)
                            this.gameBoard.removeOppenentPIece( move.tilesArray)
                            
                            console.log('piece move!!! ');
                            IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                        }else if (Math.abs(move.distance) > 2 && this.gameBoard.pieceCanJump(this.selectedPiece, move) && this.selectedPiece.king){

                        
                        this.gameBoard.movePeice(app.selectedPiece, newTilePosition)
                        
                        this.gameBoard.removeOppenentPIece(move.tilesArray)
                        
                        IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                        }

                    }else if(move.distance === 1){
                        app.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                        this.pieceOnLastLine(this.selectedPiece);
                        IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                    }else if (move.distance === 2 && this.gameBoard.pieceCanJump(this.selectedPiece, move)){
                        
                        
                        this.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                        this.pieceOnLastLine(this.selectedPiece);
                        
                        this.gameBoard.removeOppenentPIece(move.tilesArray);
                        
                        console.log('piece move!!! ');
                        IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                    }else if (move.distance > 2 && this.gameBoard.pieceCanJump(this.selectedPiece, move) && this.selectedPiece.king){

                        console.log('king piece move')
                        this.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                        this.pieceOnLastLine(this.selectedPiece);
                        
                        this.gameBoard.removeOppenentPIece( move.tilesArray);
                        
                        IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                    }
                    break;
                case "black":
                    if(move.distance > 0 && this.selectedPiece.king ){
                        console.log('player move black king piece!')
                        if(move.distance === 1){
                            app.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                            this.pieceOnLastLine(this.selectedPiece);
                            IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                        }else if (move.distance === 2 && this.gameBoard.pieceCanJump(this.selectedPiece, move)){
                            
                            this.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                            this.pieceOnLastLine(this.selectedPiece);
                            
                            this.gameBoard.removeOppenentPIece( move.tilesArray);
                            
                            console.log('piece move!!! ');
                            IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                        }else if (move.distance > 2 && this.gameBoard.pieceCanJump(this.selectedPiece, move) && this.selectedPiece.king){

                            console.log('king piece move')
                            this.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                            this.pieceOnLastLine(this.selectedPiece);
                            
                            this.gameBoard.removeOppenentPIece( move.tilesArray);
                            
                            IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                        }

                    }else if(move.distance === -1){
                        
                        this.gameBoard.movePeice(app.selectedPiece, newTilePosition);
                        this.pieceOnLastLine(this.selectedPiece);
                        // console.log(app.gameBoard);
                        IO.socket.emit('playerMove', {board : app.gameBoard, id: app.gameID});


                    }else if (move.distance === -2 && this.gameBoard.pieceCanJump(app.selectedPiece, move)){
                        this.gameBoard.movePeice(app.selectedPiece, newTilePosition)
                        this.pieceOnLastLine(this.selectedPiece);
                        
                        this.gameBoard.removeOppenentPIece( move.tilesArray)
                        console.log('piece move!!! ');
                        IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                    }else if (move.distance < -2 && this.gameBoard.pieceCanJump(this.selectedPiece, move) && this.selectedPiece.king){

                        console.log('king piece move')
                        this.gameBoard.movePeice(app.selectedPiece, newTilePosition)
                        this.pieceOnLastLine(this.selectedPiece);

                        
                        this.gameBoard.removeOppenentPIece( move.tilesArray)
                        
                        IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
                    }
                    break;
            }
        }else{
        console.log('not diagonal');
        }
    },
	playerReleasePiece : function(event) {
		event.preventDefault();
        var newTilePosition = event.currentTarget.id;
        // console.log('player release');

        if(app.myRule === app.turn && app.selectedPiece.color === app.myRule){
            // console.log('player move -- ', app)
            app.playerMove(newTilePosition)
        }else{
            console.log(' not my turn','\napp.turn ',app.turn, '\ncolor - ', app.selectedPiece.color, '\nmy Rule - ',app.myRule);
            
        }
		for (const td of app.tds) {
			td.removeEventListener("mouseup", app.playerReleasePiece);
		}
			
    },
    pieceOnLastLine(piece){
        if(this.gameBoard.pieceOnLastLine(piece)){
            this.getTileElement(piece.tile).className += 'king';
        }
    },

	playerSelectPiece : function(event){
		event.preventDefault();
		// console.log(event.currentTarget.parentElement.id);        
        var tile = event.currentTarget.parentElement.id 
        app.selectedPiece = app.gameBoard.findPieceInPieceArray(tile).piece;
        // console.log(app.selectedPiece);
        
		for (var td of app.tds) {
            if(td.innerHTML === ""){
                td.addEventListener("mouseup", app.playerReleasePiece);
            }
		}
	
    },
    toggleTurn : function(){
        this.turn = this.turn === 'red' ? 'black' : 'red';
    },
    nextTurn : function(board){
        console.log('player next turn')
        // console.log('NEXT Turn ---- ', this)
        this.gameBoard.board = board.board;
        this.gameBoard.redPieces = board.redPieces;
        this.gameBoard.blackPieces = board.blackPieces;
        this.toggleTurn();
        this.renderBoard();

    },
    getTileElement : function(tile){
        for(var td of app.tds){
            if(td.id === tile){
                return td;
            }
        }
    },
    renderBoard : function(){
        this.ui.style.display = "none";
        console.log('############### in render ####################');
       console.log(this)
        for (let tile in this.gameBoard.board) {

            var tileElement = this.getTileElement(tile);
            // console.log('get element from Dom ' ,tileElement,' for tile -- ', tile)
            if(this.gameBoard.board[tile].color === 'red' && tileElement.innerHTML === ""){
                // console.log('render red element ', tileElement)
                
                const td = document.querySelector('#'+tile);
                const div = document.createElement('DIV');
                div.className = this.gameBoard.board[tile].color;
                if(this.gameBoard.board[tile].king){
                    div.className += " king";
                }
                td.appendChild(div);  
                div.addEventListener("mousedown", this.playerSelectPiece);

            }
            if(this.gameBoard.board[tile].color === 'black' && tileElement.innerHTML ===""){
                
                // console.log('render black element ', tileElement)     
                const td = document.querySelector('#'+tile);
                const div = document.createElement('DIV');
                div.className = this.gameBoard.board[tile].color;
                if(this.gameBoard.board[tile].king){
                    div.className += " king";
                }
                td.appendChild(div);  
                div.addEventListener("mousedown", this.playerSelectPiece);

            }
            if(this.gameBoard.board[tile] === "" && tileElement.childElementCount > 0 ){
                console.log('delete element', tileElement);
                tileElement.innerHTML = "";
            }
        }
    },
    startGame : function(gameID){
        this.gameID = gameID
        this.gameBoard = new Board();
        this.gameBoard.initiateGame();
        // console.log('start new game', this);
        app.renderBoard();
    },
    isWaitForOpponent : function(playerRule){
        this.myRule = playerRule;
        const text = document.createElement('H3');
        text.innerHTML = 'Wait for opponent';
        text.className = 'center text';
        this.ui.appendChild(text);
        const loader = document.createElement('DIV');
        loader.className = 'loader center';
        this.ui.appendChild(loader);
        this.startBtn.remove();
    }
    
}
var IO = {

    init: function(){
        IO.socket = io.connect();
        IO.bindEvents();
    },

    bindEvents : function(){
        IO.socket.on('waitForOpponent', this.waitForOpponent);
        IO.socket.on('findOpponent', this.findOpponent);
        IO.socket.on('nextTurn', this.nextTurn);

    },

    findOpponent :function(data){
        app.startGame(data.gameID);
    },
    waitForOpponent : function(data){
        app.isWaitForOpponent(data.playerRule);
    },
    nextTurn : function(data){
        app.nextTurn(data.board);
        
    }

    


}

IO.init();
app.init();
function tileToInt(position){
    var tran = {A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8};
    var row = tran[position[0]]
    var col = position[1];
    return (parseInt(row +col))
    
}
function intToPieceIndex(int){
    var row = int.toString()[0]
    var col = int.toString()[1]
    var tran = {A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8};
    var count =1;
    for(var key of Object.keys(tran)){
        
    
        if(count.toString() === row){
            row = key;
            return row+col;

        }
        count++;
    }
    
}