
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
    getJumpArray(piece, newTile){
        // console.log('check diagonal \n', this);
        var currectTile = tileToInt(piece.tile);
        var newTile = tileToInt(newTile);
        var move ={ direction: "", tilesArray: []}
        var diagonal = false
        if((currectTile - newTile)%11 === 0 && (currectTile - newTile) < 0){
            
            for(var i = currectTile+11 ; i<88;  i+=11){
                move.tilesArray.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonal = true;
                    move.tilesArray.pop();
                    break;
                }
            }
        }
        if((currectTile - newTile)%11 === 0 && (currectTile - newTile) > 0){
            // var move.tilesArray = [];
            for(var i = currectTile-11 ; i>11;  i-=11){
                move.tilesArray.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonal = true;
                    move.tilesArray.pop();
                    break;
                }
            }
        }
        if((currectTile - newTile)%9 === 0 && (currectTile - newTile) < 0){
            // var diagonalTiles = [];
            for(var i = currectTile+9 ; i<88;  i+=9){
                move.tilesArray.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonal = true;
                    move.tilesArray.pop();
                    break;
                }
            }
        }
        if((currectTile - newTile)%9 === 0 && (currectTile - newTile) > 0){
            // var diagonalTiles = [];
            for(var i = currectTile-9;  i>11;  i-=9){
                
                move.tilesArray.push(intToPieceIndex(i))
                if(i === newTile){
                    diagonal = true;
                    move.tilesArray.pop();
                    break;
                }
            }
        }
        if((newTile-currectTile) > 0){
            move.direction = piece.color === 'red'? 'forward' : 'backward';
        }else{
            move.direction = piece.color === 'red'? 'backward' :'forward';
        }
        if(diagonal){
            return move;
        }else{
            return false;
        }
    }
    getPieceAndIndex(tile){
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
    pieceCanJump(piece, newTile){

        var jump = this.getJumpArray(piece, newTile);
        if(!jump){
            return;
        }
        console.log('jump object ',jump);
        var countOpponentPieces = 0;
        for(var tile of jump.tilesArray){
            if(this.board[tile] !== ""){
                if((this.board[tile]).color === piece.color){
                    return false;
                }
                if((this.board[tile]).color !== piece.color){
                    countOpponentPieces++;
                }
            }
        }
        if(countOpponentPieces >= 2 ){
            return false;
        }
        
        if(piece.king){
            return true;
        }

        if(jump.direction === 'forward' && jump.tilesArray.length === 0 ){
            return true;
        }
        if(jump.direction === 'forward' && jump.tilesArray.length === 1 && countOpponentPieces === 1 ){
            return true;
        }
        
        
        return false;
    }
    movePeice(piece, newTile){
        
        this.board[piece.tile] = "";
        this.board[newTile] = piece;
        var movingPiece = this.getPieceAndIndex(piece.tile);
        // console.log(this)
        this.removeOppenentPiece(piece, newTile);
        movingPiece.piece.tile = newTile;
        this.isKing(movingPiece.piece);
        // console.log('moving piece ', movingPiece)

    }
    removeOppenentPiece(piece, newTile){

        var jump = this.getJumpArray(piece, newTile)
        for(var tile of jump.tilesArray){
            this.board[tile] = "";
            if(this.getPieceAndIndex(tile)){
                
                var piece = this.getPieceAndIndex(tile);
                console.log('remove piece -- ' , piece)
                if(piece.piece.color ==='red'){
                    this.redPieces.splice(piece.index,1);
                }else{
                    
                    this.blackPieces.splice(piece.index,1);
                }
            }
        }
    }
    isKing(piece){
        if(piece.color === 'red' && piece.tile[0] === 'H'){
            piece.king = true;
        }
        if(piece.color === 'black' && piece.tile[0] === 'A'){
            piece.king = true;
        }

    }
}   
var app = {

	gameBoard : null,
    gameID: "",
    myRule: "",
    turn : 'red',
    selectedPiece: null,

    init: function(){
        this.getDomElement();
		this.bindEvents();

    },
    bindEvents : function() {
		this.startBtn.addEventListener('click', this.startGameButtonEvent) ;
    },
    getDomElement : function(){
        this.ui = document.querySelector('.warper');
        this.startBtn = document.querySelector('#startBtn');
        this.tds = document.querySelectorAll('TD');
        this.text = document.querySelector('.text');
        this.loader = document.querySelector('.loader');
        this.redScore = document.querySelector('.redScore');
        this.gameMassage = document.querySelector('.game-massage');
        this.blackScore = document.querySelector('.blackScore');
        this.turnflag = document.querySelector('.turnflag');
        this.turnSigh = document.querySelector('.user-turn-sign');
    },
    waitForOpponentDiaplay : function(){
        app.text.innerHTML = 'Wait for opponent';
        app.ui.appendChild(app.text);
        app.loader.style.display = 'block';
        app.text.style.display = 'block';
        app.startBtn.remove();

    },
	startGameButtonEvent : function(){
        app.waitForOpponentDiaplay();
		IO.socket.emit('playerSearchGame',(res) =>{
            app.myRule = res.role;
        });
		console.log('sreaching for game');
    },
	playerReleasePieceEvent : function(event) {
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
    playerSelectPieceEvent : function(event){
		event.preventDefault();
		console.log(event.currentTarget.parentElement.id);        
        var tile = event.currentTarget.parentElement.id 
        app.selectedPiece = app.gameBoard.getPieceAndIndex(tile).piece;
        // console.log(app.selectedPiece);
        
		for (var td of app.tds) {
            if(td.innerHTML === ""){
                td.addEventListener("mouseup", app.playerReleasePieceEvent);
            }
		}
	
    },
    getTileElement : function(tile){
        for(var td of app.tds){
            if(td.id === tile){
                return td;
            }
        }
    },
    playerMove: function(newTilePosition){
        // console.log('player logics',this);
        if(this.gameBoard.pieceCanJump(this.selectedPiece, newTilePosition)){

            this.gameBoard.movePeice(app.selectedPiece, newTilePosition)
            console.log('piece move!!! ');
            IO.socket.emit('playerMove', {board : this.gameBoard, id: this.gameID});
        }else{
        alert('iligal move');
        }
    },
    toggleTurn : function(){
        this.turn = this.turn === 'red'? 'black' :'red';
        if(this.turn ===  this.myRule){
            this.turnSigh.innerHTML = 'your turn, please play';
            this.turnflag.style.backgroundColor  = this.myRule;
        }else{
            if(this.myRule === 'red'){
                this.turnSigh.innerHTML = 'black turn, please wait';
                this.turnflag.style.backgroundColor  = 'black';

            }else{
                this.turnSigh.innerHTML = 'red turn, please wait';
                this.turnflag.style.backgroundColor  = 'red';
            }
        }
        this.redScore.innerHTML = Math.abs(this.gameBoard.blackPieces.length -12);
        this.blackScore.innerHTML =Math.abs(this.gameBoard.redPieces.length-12) ;
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
    renderBoard : function(){
        // this.ui.style.display = "none";
        console.log('############### in render ####################');
       console.log(this)
        for (let tile in this.gameBoard.board) {

            var tileElement = this.getTileElement(tile);
            if(this.gameBoard.board[tile] !== tileElement.innerHTML){
                
                
                if(this.gameBoard.board[tile] === ''){
                    tileElement.innerHTML ='';
                }else{
                    
                    tileElement.innerHTML ='';
                    const div = document.createElement('DIV');
                    div.classList.toggle(this.gameBoard.board[tile].color);
                    if(this.gameBoard.board[tile].king){
                        div.classList.toggle('king');
                    }
                    tileElement.appendChild(div);  
                    div.addEventListener("mousedown", this.playerSelectPieceEvent);
    
                }
            }
        }
    },
    startGame : function(gameID){
        this.loader.style.display='none';
        this.text.style.display='none';
        this.turnSigh.innerHTML = this.myRule ==='red'? 'your turn': 'red turn please wait';
        this.turnflag.style.backgroundColor  = 'red';
        this.gameID = gameID
        this.gameBoard = new Board();
        this.gameBoard.initiateGame();
        this.redScore.innerHTML = 0;
        this.blackScore.innerHTML =0;
        this.turn ='red';
        this.gameMassage.innerHTML = '';
        // console.log('start new game', this);
        app.renderBoard();
    },
    oppoenentDisconnected : function(){
        this.gameMassage.innerHTML = 'player left game '
        this.waitForOpponentDiaplay()
    }
    
}
var IO = {

    init: function(){
        IO.socket = io.connect();
        IO.bindEvents();
    },

    bindEvents : function(){
        IO.socket.on('findOpponent', this.findOpponent);
        IO.socket.on('nextTurn', this.nextTurn);
        IO.socket.on('oppoenentDisconnected', this.oppoenentDisconnected);

    },

    findOpponent :function(data){
        app.startGame(data.gameID);
    },
    nextTurn : function(data){
        app.nextTurn(data.board);
        
    },
    oppoenentDisconnected: function(){
        console.log('player leave');
        app.oppoenentDisconnected();
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