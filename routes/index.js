"use strict";

const classes = require('../bin/classes.js');
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var session;

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
let games = [];

// the boards will be a Map, which is new to ES6
// This will let the board be stored with its classes and accessed by the session's uuid
router.boards = new Map();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Chesspress', games: games });
});

router.get('/board', function(req, res, next) {
    let board = router.boards.get(req.session.uuid).board;
    res.send(board);
});

router.get('/game', function(req, res, next) {
    session = req.session;
    let board = router.boards.get(session.uuid);
    res.render('game', {title: 'Chesspress', board: board })
});

router.post('/game', function(req, res, next) {
    let board = new classes.ChessBoard(newBoard);
    let game =  {name: `${req.body.name}'s game`, id: uuid.v1(), joinable: true };

    games.push(game);
    req.session.uuid = game.id;
    router.boards.set(game.id, board);

    res.send(games);
});

router.get('/games', function(req, res, next) {
    res.send(games);
});

router.post('/join', function(req, res, next) {
    req.session.uuid = req.body.id;
    console.log(req.session.uuid);
    res.send({canJoin: true});
});


module.exports = router;