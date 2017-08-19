"use strict";

console.log ("imagination factory");

let Attractory = {};

let areasLoaded = [];
let typesLoaded = [];

// (same as below -- getter)
//Exposes types loaded to other modules
Attractory.getAllTypes = () => {
	return typesLoaded;
};

//Making area data available (this is a getter)
//Exposes types loaded to other modules
Attractory.getAreaArray = () => {
	return areasLoaded;
};

//Tyler: Load the specific areas from firebase -- loads info need getter
Attractory.loadAreas = () => {
	return new Promise ( function (resolve, reject) {
		let dataLoader = new XMLHttpRequest();
		dataLoader.open("GET", "https://imagine-nation-data.firebaseio.com/areas.json");
		dataLoader.send();
		dataLoader.addEventListener("load", function () {
			let data = JSON.parse(this.responseText);
			areasLoaded = data;
			resolve(data);
		});
	});
};


//Tyler: Load the specific attractions from firebase- loads info need getter
Attractory.loadAttractions = () => {
	return new Promise ( function (resolve, reject) {
		let attractionDataLoader = new XMLHttpRequest();
		attractionDataLoader.open("GET", "https://imagine-nation-data.firebaseio.com/attractions.json");
		attractionDataLoader.send();
		attractionDataLoader.addEventListener("load", function () {
			let data = JSON.parse(this.responseText);
			resolve(data);
		});
	});
};

//Tyler: Load the specific types from firebase -- this loads the information and you need a getter

Attractory.loadTypes = () => {
	return new Promise ( function (resolve, reject) {
		let dataLoader = new XMLHttpRequest();
		dataLoader.open("GET", "https://imagine-nation-data.firebaseio.com/attraction_types.json");
		dataLoader.send();
		dataLoader.addEventListener("load", function () {
			let data = JSON.parse(this.responseText);
			typesLoaded = data;
			resolve(data);
		});
	});
};

module.exports = Attractory;