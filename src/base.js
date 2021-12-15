/**
 * All global variables and Initiate functions.
 * this is the first file to get executed.
 */



/*
I developed this game on My Machine, but it has to work on other's as well :) 
so resize is handled by keeping height constant and filling blank space with width
*/
const logical_width = 1536;
const logical_height = 864;


var deviceAspectRatio = window.innerWidth/window.innerHeight;
///extra width is margin which will be added to width so that the aspect ratio matches
var extraWidth =  Math.round((deviceAspectRatio*logical_height) - logical_width);

var screen_width = logical_width + extraWidth;
var screen_height = logical_height;

//console.log('window size init ' + screen_width + ' ' + screen_height);

const world_width = 10*screen_width;
const world_height = 2*screen_height;

var game;

var srand = new Phaser.Math.RandomDataGenerator();
var graphics;
var vehicle;
var vehicleKey = 'car2';
var chunkloader;
var cursors;
var backgroundloader;
var vehiclePartsKey = 'carParts';
var currentScene; //current scene properties
