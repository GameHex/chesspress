"use strict";

const classes = require('../bin/classes.js');
var express = require('express');
var router = express.Router();
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

let board = new classes.ChessBoard(newBoard);

/* GET home page. */
router.get('/', function(req, res, next) {
    session = req.session;
    session.board = board.getBoard();
    console.log("board is", board.getBoard());
    res.render('index', { title: 'Chesspress', board: session.board });
});

router.get('/board', function(req, res, next) {
   res.send(req.session.board);
});


module.exports = router;