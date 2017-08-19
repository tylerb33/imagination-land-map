"use strict";
console.log ("main.js");

//require so we can use 
let imaginationFactory = require('../javascripts/imagination-factory.js');
let Handlebars = require('hbsfy/runtime');
let attractionTemplate = require("../templates/attractionlist.hbs");
let moment =require("../lib/node_modules/moment/min/moment.min.js");
let Fuse = require("../lib/node_modules/fuse.js/dist/fuse.min.js");
let Search = require("../javascripts/searchfunctions.js");
let HBShelper = require("../javascripts/hbshelpers.js");
let Time = require("../javascripts/timemanip.js");

var attractionsWithTimes = [];
var attractionsPushedToDOM = [];


// Current Date
var today = new Date(); 
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var output = document.getElementById("currentTime");

output.innerHTML = date;


// Takes the data loaded above and populates the grid with names/descriptions, and changes background color based on colorTheme.
function populateAreas(areasData) {
	let gridBoxes = $(".grid-box-data");
	for (let i = 0; i < areasData.length; i++) {
		gridBoxes[i].innerHTML =`
		 					<h3>${areasData[i].name}</h3>
							<p>${areasData[i].description}</p>`;
		gridBoxes[i].setAttribute('style', `background-color: #${areasData[i].colorTheme}`);
	}
}
//Workhorse function. Takes in array data and populates left column.
function populatePage(factoryData, headline) {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = attractionTemplate(factoryData);
    $("#headline").html(headline);
    $("#attraction-column").append(newDiv);
    $(".card").click(function(e){
        $(".seent").addClass("hidden");
        $(e.currentTarget).find(".seent").removeClass("hidden");
        
    });
}


// Ted: Calling loadAreas function to get the areas data. 
// Promise returns and then calls populateAreas.
imaginationFactory.loadAreas()
.then(
    (dataFromFactory) => {
        populateAreas(dataFromFactory);
    },
    (reject) => {
        console.log("something went wrong");
    });


//TIME DROP DOWN
$('.dropdown-radio').find('input').change(function() {
    var mapGridChildren = $(".grid-box-data");
    mapGridChildren.removeClass("selected-border");
    var timeDropdown = $('.dropdown');
    var radioname = $(this).attr('name');
    var checked = 'input[name=' + radioname + ']:checked';
  
  //update the text
  var checkedText = $(checked).closest('.dropdown-radio').text();
  timeDropdown.find('button').text( checkedText );

  //retrieve the checked value 
  var timeValue = timeDropdown.find( checked ).val();
  var selectedTime = moment(timeValue, "hh:mm a");
  selectedTimeUmCrapTimesOrSumthin(selectedTime);
  
});

//used moments. check to see if attraction time
function selectedTimeUmCrapTimesOrSumthin(time){
    attractionsPushedToDOM = [];
    $("#attraction-column").html('');
    for (let k = 0; k < attractionsWithTimes.length; k++) {
        for( let g = 0; g < attractionsWithTimes[k].times.length; g++ ){
            if(moment(attractionsWithTimes[k].times[g], "hh:mm a").isBetween(moment(time),moment(time).add(1,"h")) === true){
                attractionsPushedToDOM.push(attractionsWithTimes[k]);
                break;
            }
        }
    } 
    populatePage(attractionsPushedToDOM, "Attractions at this time: ");   
}
//Return ID on area clicked and populate Attraction list
$('#map-grid').click(function(event){
    var mapGridChildren = $(".grid-box-data");
    mapGridChildren.removeClass("selected-border");
    var areaClicked = event.target.closest('.grid-box-data').getAttribute('id').slice(6);
    event.target.closest('.grid-box-data').classList.add("selected-border");
    imaginationFactory.loadAttractions()
        .then(
            (dataFromFactory) => {
                attractionsPushedToDOM = [];
                $("#attraction-column").html('');
                for (let i = 0; i < dataFromFactory.length; i++) {
                    if(dataFromFactory[i].area_id == areaClicked){
                        attractionsPushedToDOM.push(dataFromFactory[i]);
                    }
                }     
                populatePage(attractionsPushedToDOM, "Attractions in area: ");
            },
            (reject) => {
                console.log("something went wrong");
            });
    
});


//This is calling the loadAttractions to get data for all 131 attractions
imaginationFactory.loadAttractions()
.then(
    (dataFromFactory) => {
        Search.storeData(dataFromFactory);        
    
        attractionsPushedToDOM = [];
        $("#attraction-column").html('');
        for (let i = 0; i < dataFromFactory.length; i++) {
            if(dataFromFactory[i].times){
                attractionsWithTimes.push(dataFromFactory[i]);
            }
        }
        for (let k = 0; k < attractionsWithTimes.length; k++) {
            for( let g = 0; g < attractionsWithTimes[k].times.length; g++ ){
                if(moment(attractionsWithTimes[k].times[g], "hh:mm a").isBetween(moment(),moment().add(1,"h")) === true){
                    attractionsPushedToDOM.push(attractionsWithTimes[k]);
                    break;
                }
           }
        }     
        populatePage(attractionsPushedToDOM, "Attractions in the next hour: ");
    },
    (reject) => {
        console.log("something went wrong");
    });

//This is the search button using fuse module.
$("#search-input").keyup(function(e){
    $("#attraction-column").html('');
    let result = Search.searchFunction($(this).val());
    populatePage(result, "Attractions from search: ");
    if (e.which == 13) {
        $(this).blur();
    }
    if ($("#search-input").val() === ""){
        imaginationFactory.loadAttractions()
.then(
    (dataFromFactory) => {
        Search.storeData(dataFromFactory);        
    
        attractionsPushedToDOM = [];
        $("#attraction-column").html('');
        for (let i = 0; i < dataFromFactory.length; i++) {
            if(dataFromFactory[i].times){
                attractionsWithTimes.push(dataFromFactory[i]);
            }
        }
        for (let k = 0; k < attractionsWithTimes.length; k++) {
            for( let g = 0; g < attractionsWithTimes[k].times.length; g++ ){
                if(moment(attractionsWithTimes[k].times[g], "hh:mm a").isBetween(moment(),moment().add(1,"h")) === true){
                    attractionsPushedToDOM.push(attractionsWithTimes[k]);
                    break;
                }
           }
        }     
        populatePage(attractionsPushedToDOM, "Attractions in the next hour: ");
    },
    (reject) => {
        console.log("something went wrong");
    });
    }
});
$("#search-input").focus(function(e){
    $(this).val("");
});