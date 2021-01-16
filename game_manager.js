
const Game = require('./model/gameModel.js');
exports.disconnectPlayerFromGame = async function (playerID, game){
    var doc = game;
    var id = game.id;
    
    if(doc.hostPlayer === playerID){
        await Game.findByIdAndUpdate(id, {hostPlayer: undefined,  numOfPlayers: doc.numOfPlayers-1},{new:true});
        
    }else{
        await Game.findByIdAndUpdate(id, {joinPlayer: undefined, numOfPlayers: doc.numOfPlayers-1},{new:true});
    }
    console.log('player left game', doc);
}
exports.searchGame = async function(io){
    console.log('player search game\n');
    var game = await findMatch(this);
    console.log('player joined game -\n ', game)
    this.join(game.id);
    this.emit('waitForOpponent', game.id);
    if(game.numOfPlayers ===2){
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