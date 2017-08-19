"use strict";
console.log ("search");
let Fuse = require("../lib/node_modules/fuse.js/dist/fuse.min.js");

//fuse.js 

let attractionsArray = [];
let Search = {};


//settings for the search
var options = {
    tokenize: true,
    shouldSort: true,
    threshold: 0.0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 4,
    keys: ["name"]
};

//gets called on page load -- passes in all objects
Search.storeData = function (array) {
    attractionsArray = array;
};

Search.searchFunction = function(value) {
    //have to do this for the fuse js search
    var fusejs = new Fuse(attractionsArray, options);
    var result = fusejs.search(value);
    //(below)nothing is highlighted
    $(".grid-box-data").removeClass("selected-border");
    //looping through the array of results -- grabbing IDs to display borders     
    for(let i = 0; i < result.length; i++){
        $(`#grid--${result[i].area_id}`).addClass("selected-border");
    }
    return result;
};

module.exports = Search;