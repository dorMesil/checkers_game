const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const GameSchema = new Schema({
    hostPlayer: String,
    joinPlayer: String,
    numOfPlayers: Number
    
});
// GameSchema.method.findEmptyGameSlot = async function(){
//     var game = await Game.findOne({$or: [{ joinPlayer: null }, {hostPlayer: null}] }).exec();
//     return game;
// }

module.exports = mongoose.model('Game', GameSchema);