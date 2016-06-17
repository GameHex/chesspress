var board = [];
var clicked = '';
var clickedPos = {};
var moves = [];
var game = {};
var source;
var template;
var socket = io();

function showValidMoves(data) {
    if (moves.length > 0) {
        moves.forEach(function(space) {
            $('#' + space).removeClass('validMove');
        })
    }

    data.forEach(function(space) {
        $('#' + space).addClass('validMove');
    });

    moves = data;
}

function initBoard() {
    // get and compile the template source on document ready
    source   = $("#entry-template").html();
    template = Handlebars.compile(source);

    // query the board endpoint for the initial board
    $.ajax({
        type: 'GET',
        url: '/board',
        dataType: 'json',
        success: function(data){
            board = data;
            game = data.game;
            $('#chessTable').html(template({board: data.board}));
            socket.emit('joined', data.game.players[data.player].name, data.game.id);
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

$(document).ready(function() {
    initBoard();
});


function selectSpace(id, x, y, isEmpty) {

    // we know to move a piece if there are valid moves and it's an empty space
    if (moves.length > 0 && isEmpty) {
        var dat = {from: clickedPos, to: {x: x, y: y}};

        $.ajax({
            type: 'POST',
            url: '/moves/move',
            data: dat,
            dataType: 'json',
            success: function(data){
                if (data.board) {
                    moves = [];
                    $('#chessTable').html(template({board: data.board}));
                    socket.emit('moved');
                } else if (data.moves) {
                    showValidMoves(data.moves);
                }
            },
            error: function(xhr, type){
                return xhr;
            }
        });
    }

    // get a list of valid moves to show if a non-empty square is clicked
    if (!isEmpty) {
        if (clicked !== '') {
            $('#' + clicked).removeClass('selected');
        }

        $('#' + id).addClass('selected');
        clicked = id;
        clickedPos = {x: x, y: y};

        $.ajax({
            type: 'POST',
            url: '/moves',
            data: {x: x, y: y},
            dataType: 'json',
            success: function(data){
                showValidMoves(data);
                $('#' + id).removeClass('validMove');
            },
            error: function(xhr, type){
                return xhr;
            }
        });
    }
}

socket.on('refresh board', function(data){
    $('#chessTable').html(template({board: data}));
    game = data.game;
});