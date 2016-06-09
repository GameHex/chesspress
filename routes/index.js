"use strict";

const classes = require('../bin/classes.js');
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var session;

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
let boards = new Map();

module.exports.boards = boards;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Chesspress', games: games });
});

router.get('/board', function(req, res, next) {
   res.send(req.session.board);
});

router.get('/game', function(req, res, next) {
    session = req.session;
    res.render('game', {title: 'Chesspress', board: session.board })
});

router.post('/game', function(req, res, next) {
    let board = new classes.ChessBoard(newBoard);
    let game =  {name: `${req.body.name}'s game`, id: uuid.v1(), joinable: true };

    games.push(game);
    session = req.session;
    session.uuid = game.id;

    boards.set(game.id, board);

    res.send(games);
});

router.get('/games', function(req, res, next) {
    res.send(games);
});

router.pos('/join', function(req, res, next) {
    req.session.uuid = req.body.uuid;
    res.send(true);
});


module.exports = router;