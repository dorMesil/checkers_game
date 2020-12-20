const express = require('express');
const path = require('path');
const http = require('http');
const checker = require('./checkerGame')
const session = require('express-session');
const mongoose = require('mongoose');
const Queue = require('./Queue.js');
const User = require('./model/userModel');

const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/web-project';

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

app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 *60,
    ttl: 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    autoRemove: 'interval', 
    autoRemoveInterval: 10,
    // cookie: {
    //     httpOnly: true,
    //     // secure: true,
    //     maxAge: 1000 * 60  
    // }
}

app.use(session(sessionConfig));
var sharedsession = require("express-socket.io-session");
io.use(sharedsession(session(sessionConfig), {
    autoSave:true
})); 
var userQueue = new Queue();


io.on('connection', (socket) => {
    console.log(socket.handshake);
    // var gameBoard = {};
    // gameBoard = fixBoard(defaultBoard);
    // console.log(socket);
    console.log('connected' );
    socket.on('playerJoinGame', playerJoin);
    // checker.initGame(io, socket);

    // socket.on('playerJoinGame', () => {
    //     console.log('player join');
    //     io.emit('waitForOpponent', gameBoard);
        // io.emit('startGame', gameBoard);
    // });
    // socket.on('movePiece', (oldSquare, newSquare, board) => {
    //     console.log(oldSquare, newSquare);
    //     gameBoard = board;
    //     if(gameBoard[oldSquare] !== "" && gameBoard[newSquare] === ""){
    //         gameBoard[newSquare] = gameBoard[oldSquare]
    //         gameBoard[oldSquare] = "";
    //     }
    //     console.log(gameBoard);
    //     io.emit('pieceMove', gameBoard)
    // });
    
});


function playerJoin (){
    console.log('player join');
    // userQueue.enqueue(this.id);
    this.join('this.id');
    console.log('user queue', userQueue.printQueue());
    this.emit('waitForOpponent');
    waitForOpponent();
}
 
async function numOfUsers(){
    // var ids = await io.allSockets();
    var ids = await io.of("/chat").allSockets();
    var size = ids.size
    console.log('check number', ids);
    return await size;
}

async function waitForOpponent(){
    // var ids = await io.allSockets();
    var size =  await numOfUsers();
    console.log(size);
    if(size >=2 ){
        console.log('in if');
        this.emit('startGame');

    };
    console.log('not found second player enter');
    var set = setTimeout(waitForOpponent, 3000);
    set;
}
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serving on port ${port}`)
})