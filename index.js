const express = require('express');
const path = require('path');
const http = require('http');
const checker = require('./checkerGame')
const mongoose = require('mongoose');
const User = require('./model/gameModel');
const session = require('express-session');
const passport = require('passport');
const Game = require('./model/gameModel.js');

var MongoDBStore = require('connect-mongo')(session);

const dbUrl = 'mongodb+srv://dor:mesi91lati@cluster0.rsh71.mongodb.net/checkerGame?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
app.use(express.urlencoded({ extended: true }));


const store = new MongoDBStore({
    // url: dbUrl,
    mongooseConnection: db,
    name: 'sessions',
    secret: 'mysecret',
    // touchAfter: 24 * 60 *60,
    ttl: 60 * 60
  });

store.on('error', function(error) {
    console.log("SESSION STORE ERROR", e);
});



const sessionConfig = {
    store,
    name: 'session',
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    autoRemove: 'interval', 
    autoRemoveInterval: 10,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge:  1000 * 60 * 60 
    }
}



sharedsession = require("express-socket.io-session");
io.use(sharedsession(session(sessionConfig)));
app.use(session(sessionConfig));

app.use(express.static(path.join(__dirname, 'public')));



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
const redPieceSpot = ["A2", "A4", "A6", "A8",
						"B1","B3","B5","B7",
						"C2", "C4", "C6", "C8"]
const blackPieceSpot = ["F1", "F3", "F5", "F7",
                    "G2", "G4", "G6", "G8",
                    "H1", "H3", "H5", "H7", ];

                    class Piece{
                        constructor(color){
                            this.color = color;
                            this.king = false;
                        }
                    }




io.on('connection', (socket) => {

    console.log('new connection from socket id - ', socket.id);
    
    socket.on('playerSearchGame',searchGame);
    socket.on('startGame', start);
    socket.on('disconnect', (reason) =>{
        playerDisconnect(socket, reason);
    });
});

function start(id){
    checker.initGame(io, this, id );

}

async function playerDisconnect(socket, reason){
    var game;
    game = await Game.find({ $or: [ { joinPlayer: socket.id }, {hostPlayer: socket.id}]}).exec();
    if(typeof(game) !== 'undefined' && game.length > 0){
        disconnectPlayerFromGame(socket.id, game[0]);
        
        
        // await Game.deleteOne({$or: [ { joinPlayer: socket.handshake.sessionID }, {hostPlayer: socket.handshake.sessionID}]})
    }else{
        console.log('player left');
    }
    console.log('socket disconnect reason - ', reason);

}
async function disconnectPlayerFromGame(playerID, game){
    var doc = game;
    var id = game.id;
    
    if(doc.hostPlayer === playerID){
        await Game.findByIdAndUpdate(id, {hostPlayer: undefined,  numOfPlayers: doc.numOfPlayers-1},{new:true});
        
    }else{
        await Game.findByIdAndUpdate(id, {joinPlayer: undefined, numOfPlayers: doc.numOfPlayers-1},{new:true});
    }
    console.log('player left game', doc);
}
async function searchGame (){
    console.log('player search game\n');
    var game = await findMatch(this);
    console.log('player joined game -\n ', game)
    this.join(game.id);
    this.emit('waitForOpponent', game.id);
    if(game.numOfPlayers ===2){
        // var gameBoard = {};
        // gameBoard = await fixBoard(defaultBoard); 
        console.log('start game');
        io.to(game.id).emit('findOpponent')
    }else{
        console.log('waiting for Opponent');
    }
    
}

async function findMatch(socket){
    var game;
    var emptyGame = await Game.findOne({$or: [{ joinPlayer: null }, {hostPlayer: null}] }).exec();
    console.log('searching for game', socket.id);
    
    if(emptyGame === null){
        // var newGame = new Game({'hostPlayer': socket.handshake.sessionID} )
        console.log('not found game create new room');
        var newGame = new Game({'hostPlayer': socket.id, numOfPlayers:1} )
        var newGame = await newGame.save();
        console.log('game created ', newGame.id);
        return newGame;
    }else if(typeof(emptyGame.hostPlayer) === 'undefined' || emptyGame.hostPlayer === null ){

        console.log('found empty game', emptyGame.id);
        // await Game.findByIdAndUpdate(result.id,{hostPlayer: socket.handshake.sessionID});
        game = await Game.findByIdAndUpdate(emptyGame.id, {hostPlayer: socket.id, numOfPlayers: emptyGame.numOfPlayers+1},{new:true});
        return game;
    }else if(typeof(emptyGame.joinPlayer) === 'undefined' || emptyGame.joinPlayer === null){

        // await Game.findByIdAndUpdate(result.id,{joinPlayer: socket.handshake.sessionID});
        console.log('found empty game ', emptyGame.id);
        game = await Game.findByIdAndUpdate(emptyGame.id,{joinPlayer: socket.id, numOfPlayers: emptyGame.numOfPlayers+1},{new:true});
        
        return game;
    }
    // this.join('game.id') 
    
}

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
