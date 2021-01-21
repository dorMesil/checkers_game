// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const Game = require('./model/gameModel.js');

var MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/checkers_game';

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
    mongooseConnection: db,
    name: 'sessions',
    secret: 'mysecret',
    // touchAfter: 24 * 60 *60,
    // ttl: 60 * 60 * 60
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
        maxAge:  1000 * 60 
    }
}


sharedsession = require("express-socket.io-session");
io.use(sharedsession(session(sessionConfig)));
app.use(session(sessionConfig));

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    console.log('new connection from socket id - ', socket.id);

    socket.on('playerSearchGame',searchGame);
    socket.on('playerMove', (data) =>{
        var room = 'room '+data.id;
        // console.log(data.board.board)
        io.to(room).emit('nextTurn', {board:data.board})

    });
    
    socket.on('disconnect', (reason) =>{
        playerDisconnect(socket, reason);
    });
});

async function playerDisconnect(socket, reason){
    var game;
    game = await Game.find({ $or: [ { joinPlayer: socket.id }, {hostPlayer: socket.id}]}).exec();
    if(typeof(game) !== 'undefined' && game.length > 0){
        disconnectPlayerFromGame(socket.id, game[0]);
        console.log('player leave gameeeee', game[0].id)
        io.to('room '+game[0].id).emit('oppoenentDisconnected');
        
        
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
async function searchGame (res){
    console.log('player search game\n');
    var game = await findMatch(this);
    console.log('player joined game -\n ', game)
    this.join('room ' + game.id);
    console.log('clinet joined room',this.rooms);
    var role = game.hostPlayer === this.id? 'red' : 'black';
    res({ role : role});
    if(game.numOfPlayers === 2){
        console.log('start game');
        io.to('room ' + game.id).emit('findOpponent', {gameID : game.id})
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

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
