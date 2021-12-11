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
            debug: true
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
    this.load.image('wheel-img', '../assets/small_wheel.png');
    this.load.json('wheel', '../assets/small_wheel.json');

    this.load.image('body-img', '../assets/car_body_1.png');
    this.load.json('body', '../assets/car_body.json');
    //tilesetFileName = 'land16x16';
    // this.load.image(tilesetFileName, 'assets/land16x16.png');
    // this.load.tilemapTiledJSON('tilemap', 'assets/land_tilemap16x16.json');

    tilesetFileName = 'land_ext';
    this.load.image(tilesetFileName, '../assets/land_ext.png');
    this.load.tilemapTiledJSON('tilemap', '../assets/land_tilemap_ext.json');

    backgroundloader = new BackgroundLoader(this);
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

    ///setBounds( [x] [, y] [, width] [, height] [, thickness] [, left] [, right] [, top] [, bottom])
    

    vehicle = new Vehicle(this);
    
    this.cameras.main.startFollow(vehicle.body, true, 0.2, 0.2, -screen_width/8, screen_height/8);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.roundPixels = true;
    

    map = this.make.tilemap({ key: 'tilemap'});
    tiles = map.addTilesetImage(tilesetFileName);
 
    chunkloader = new ChunkLoader();
    chunkloader.initChunkLoader(this, map, tiles);


    this.matter.add.mouseSpring();
    
    cursors = this.input.keyboard.createCursorKeys();
}

function update()
{
    
    vehicle.processKey(cursors);
    chunkloader.processChunk(this, map, tiles, vehicle.body.x);
    backgroundloader.updateBackground(this, vehicle.body.x);
    
}



