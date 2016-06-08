"use strict";

function ajaxGet(url) {
    return $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data){
            return data;
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

function ajaxPost(url, data) {
    return $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        success: function(data){
            return data;
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}