var games = [];
var source;
var template;

function refreshGames() {
    $.ajax({
        type: 'GET',
        url: '/games',
        dataType: 'json',
        success: function(data){
            games = data;
            $('#gameList').html(template({games: data}));
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

function newGame() {
    $.ajax({
        type: 'POST',
        url: '/game',
        dataType: 'json',
        success: function(data){
            games = data;
            $('#gameList').html(template({games: data}));
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

$(document).ready(function() {

    // get and compile the template source on document ready
    source   = $("#entry-template").html();
    template = Handlebars.compile(source);

    // query the board endpoint for the initial board
    $.ajax({
        type: 'GET',
        url: '/games',
        dataType: 'json',
        success: function(data){
            games = data;
            $('#gameList').html(template({games: data}));
        },
        error: function(xhr, type){
            return xhr;
        }
    });
});