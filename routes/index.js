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

let games = [];
let boards = [];

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
    let game = {name: `${req.body.name}'s game`, id: uuid.v1()};
    games.push(game);
    session = req.session;
    session.board = board.getBoard();
    res.send(games)
});

router.get('/games', function(req, res, next) {
    res.send(games);
});


module.exports = router;