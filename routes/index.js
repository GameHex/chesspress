"use strict";

const classes = require('../bin/classes.js');
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

// a visual representation of the board setup to allow for alternate starting boards
let newBoard = [
    ['R','N','B','Q','K','B','N','R'],
    ['P','P','P','P','P','P','P','P'],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    ['p','p','p','p','p','p','p','p'],
    ['r','n','b','q','k','b','n','r'] ];

// the games will be just an array
router.games = [];

// the boards will be a Map, which is new to ES6
// This will let the board be stored with its classes and accessed by the session's uuid
router.boards = new Map();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Chesspress', games: router.games });
});

/* GET retrieves most current version of board. */
router.get('/board', function(req, res, next) {
    let board = router.boards.get(req.session.uuid).board;
    res.send(board);
});

/* GET renders game page with session board. */
router.get('/game', function(req, res, next) {
    let session = req.session;
    let board = router.boards.get(session.uuid);
    let game = router.games.find(game => game.id === session.uuid);
    console.log(game);
    res.render('game', {title: game.name, board: board, playerColor: `player${session.player.color}` })
});

/* POST creates a new game. */
router.post('/game', function(req, res, next) {

    // When creating a new game, we need a new board, player, and game
    let board = new classes.ChessBoard(newBoard);
    let player = new classes.Player('white', req.body.name);
    let game =  {name: `${req.body.name}'s game`, id: uuid.v1(), joinable: true, players: {white: player}};

    router.games.push(game);
    req.session.uuid = game.id;
    req.session.player = player;
    router.boards.set(game.id, board);

    res.send(router.games);
});

/* GET retrieves list of active games on server. */
router.get('/games', function(req, res, next) {
    res.send(router.games);
});

/* POST joins a game based on uuid. */
router.post('/join', function(req, res, next) {
    req.session.uuid = req.body.id;
    console.log(req.session.uuid);

    let gameIndex = router.games.findIndex(game => game.id === req.session.uuid);
    let player = new classes.Player('black', req.body.name);

    req.session.player = player;
    router.games[gameIndex].players.black = player;
    router.games[gameIndex].joinable = false;


    res.send({canJoin: true});
});

module.exports = function(io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        io.emit('refresh game list', router.games);

        socket.on('created', function(player){
            console.log(`${player} created a game.`);
            io.emit('refresh game list', router.games);
        });

        socket.on('joined', function(player, uuid){
            console.log(`${player} joined game ${uuid}.`);
            io.emit('refresh game list', router.games);
        });
    });

    return router;
};

module.exports.router = router;