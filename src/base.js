/**
 * All global variables and Initiate functions.
 * this is the first file to get executed.
 */



/*
I developed this game on My Machine, but it has to work on other's as well :) 
I dont know a good way to scale game,
I want to keep size of vehicle and terrain almost same on all screen sizes,
background should scale with screen size, or else clouds will not be visible
*/
//const logical_height = 864; 


var screen_width = 1536;
const screen_height = 864;


const deviceAspectRatio = window.screen.width/window.screen.height;
///extra width is margin which will be added to width so that the aspect ratio matches
const extraWidth =  Math.round((deviceAspectRatio*screen_height) - screen_width);

screen_width += extraWidth;

//console.log('extraWidth ' + extraWidth);


//const game_scale = screen_height/logical_height;
//console.log(game_scale);

const world_width = 10*screen_width;
const world_height = 2*screen_height;

var game;

var srand = new Phaser.Math.RandomDataGenerator('10000');
var graphics;
var vehicle;
var tilesetFileName;
var chunkloader, map, tiles;
var cursors;
var backgroundloader;



