"use strict";

let Handlebars = require('hbsfy/runtime');
let imaginationFactory = require('../javascripts/imagination-factory.js');


//Two helpers from handlebars template
// need line 9 b/c we needed to load types immediately
imaginationFactory.loadTypes();

Handlebars.registerHelper("findAreaName", (value) => {
    let allAreas = imaginationFactory.getAreaArray();
    let theArea = "";
    for (let i = 0; i < allAreas.length; i++) {
        if (value === allAreas[i].id) {
            theArea = allAreas[i].name;
        }
    }
    return theArea;
});


Handlebars.registerHelper("findType", (value) => {
    let allTypes = imaginationFactory.getAllTypes();
    let theType = "";
    for (let i = 0; i < allTypes.length; i++) {
        if (value === allTypes[i].id) {
            theType = allTypes[i].name;
        }
    }
    return theType;
});
