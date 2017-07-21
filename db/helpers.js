const mongoose = require('mongoose');
// const Card = require('./index').card;
// const Owner = require('./index').owner;
// const Game = require('./index').game;
const { card: Card, owner: Owner, game: Game } = require('./index');
// const { Card, Owner, Game } = require('./index');
// import { Card, Owner, Game } from './index.js';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/games';
mongoose.Promise = global.Promise;

console.log('MongoDB uri is', MONGODB_URI);
mongoose.connect(MONGODB_URI, { useMongoClient: true });

const findGame = (id, resolve) => {
  Game.findById(id)
  .catch(err => console.log('Error finding game:', err))
  .then(game => {
    console.log('Game found:', game);
    resolve(game);
  });
};

const findAllGames = (res) => {
  Game.find({})
  .catch(err => console.log('Error finding game:', err))
  .then(games => {
    console.log('Games found:', games);
    res.status(200).send(games);
  });
};

const createGame = (data, res) => {
  const game = new Game(data).save()
  .catch(err => console.log('Error saving game:', err))
  .then(game => {
    console.log('Game saved:', game);
    res.status(201).send({gameId: game._id, playerId: game.owners[0]._id});
  });
};

const addPlayer = (gameId, player, res) => {
  let owner = new Owner(player);
  console.log(`Player data: ${player}`);
  Game.findByIdAndUpdate(gameId, {'$push': {'owners': player} }, {'new': true})
  .catch(err => console.log('Error adding player to existing game:', err))
  .then(game => {
    let playerId = game.owners[game.owners.length - 1]._id;
    console.log(`Game ${gameId} updated to add player ${playerId}. Current players are: 
    ${game.owners}`);
    res.status(200).send({gameId: game._id, playerId: game.owners[game.owners.length - 1]});
  });
};

const dealCards = (gameId, data, res) => {
  Game.findByIdAndUpdate(gameId, {'owners': data.owners}, {'new': true})
  .catch(err => console.log('Error updating and returning game', err))
  .then(game => {
    console.log(`Game ${gameId} updated. Game data after cards have been dealt:
    ${game}`);
    res.status(200).send('Cards dealt');
  });
};

// const getHand = (gameId, playerId, res) => {
//   Game.findById(gameId, )
// };

// const drawCard = (gameId, playerId, deckId) => {
//   Game.findByIdAnd
// };

module.exports = {
  findGame: findGame, 
  findAllGames: findAllGames, 
  createGame: createGame, 
  addPlayer: addPlayer,
  dealCards: dealCards//,
  //getHand: getHand
};