/*
game is to be played on full screen, press F to toggle fullscreen.
*/

var config = {
    type: Phaser.AUTO,
    scale:{
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        parent: 'phaser-example',
        width: screen_width,
        height: screen_height,
    },
    
    backgroundColor: '#4488aa',
    
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1
            },
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    },

    pixelArt: true
};

game = new Phaser.Game(config);

function resizeEventHandler()
{
    deviceAspectRatio = window.innerWidth/window.innerHeight;
    ///extra width is margin which will be added to width so that the aspect ratio matches
    extraWidth =  Math.round((deviceAspectRatio*logical_height) - logical_width);

    screen_width = logical_width + extraWidth;
    screen_height = logical_height;
    //console.log('resized ' + screen_width + ' ' + screen_height);
    game.scale.setGameSize(screen_width, screen_height);
}

window.addEventListener('resize', () => {
    setTimeout(resizeEventHandler, 100);
}, true);

function preload ()
{
    //multiatlas -> key, json file, image file folder
    this.load.multiatlas(vehiclePartsKey, '../assets/car/carParts.json', '../assets/car');
    //custom format for storing car
    this.load.json(vehicleKey, '../assets/car/' + vehicleKey + '.json');

    backgroundloader = new BackgroundLoader(this);
    
    chunkloader = new ChunkLoader();
    chunkloader.preLoadTileset(this);
}

function create ()
{
    graphics = this.add.graphics();
    backgroundloader.applyBackground(this);

    ///fullscreen
    var FKey = this.input.keyboard.addKey('F');
    FKey.on('down', function () {
        this.scale.toggleFullscreen();
    }, this);
    var DKey = this.input.keyboard.addKey('D');
    DKey.on('down', function () {
        console.log(game.loop.actualFps);
    }, this);

    
    vehicle = new Vehicle(this, vehicleKey);
    
    this.cameras.main.startFollow(vehicle.mainBody, true, 0.2, 0.2, -screen_width/8, screen_height/8);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.roundPixels = true;
    
    chunkloader.createTileMapSet(this);
    chunkloader.initChunkLoader(this);


    this.matter.add.mouseSpring();
    
    cursors = this.input.keyboard.createCursorKeys();
}

function update()
{
    
    vehicle.processKey(cursors);
    chunkloader.processChunk(this, vehicle.mainBody.x);
    backgroundloader.updateBackground(this, vehicle.mainBody.x);
    
}



