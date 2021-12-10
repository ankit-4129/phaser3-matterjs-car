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
        height: screen_height
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

function preload ()
{
    this.load.image('wheel-img', '../assets/small_wheel.png');
    this.load.json('wheel', '../assets/small_wheel.json');

    this.load.image('body-img', '../assets/car_body.png');
    this.load.json('body', '../assets/car_body2.json');
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

    ///setBounds( [x] [, y] [, width] [, height] [, thickness] [, left] [, right] [, top] [, bottom])
    //this.matter.world.setBounds(0, 0, world_width, world_height);

    vehicle = new Vehicle(this);
    
    // this.cameras.main.startFollow(vehicle.body, true, 0.2, 0.2, -screen_width/8, screen_height/8);
    // this.cameras.main.setZoom(2.0);
    this.cameras.main.startFollow(vehicle.body, true, 0.2, 0.2, -screen_width/8, screen_height/8);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.roundPixels = true;
    

    map = this.make.tilemap({ key: 'tilemap'});
    tiles = map.addTilesetImage(tilesetFileName);
 
    chunkloader = new ChunkLoader();
    chunkloader.initChunkLoader(this, map, tiles);

    //let stepMap = parseTileSet(tiles);

    // chunk1 = new Chunk('chunk1', {width: 32*100});
    // chunk1.initChunk(map, tiles);
    // layer = chunk1.layer;
    
    // chunk2 = new Chunk('chunk2', {width: 32*100});
    // chunk2.nextChunk(chunk1, map, tiles);
    // //chunk2.initChunk(map, tiles);
    // let layer2 = chunk2.layer;

    // let endParam = drawTerrain(this.matter.add, stepMap, layer, map.heightInPixels, {
    //     startFrac: 0.5,
    //     w: 32*500
    // });
    
    // console.log(endParam);
    // endParam = drawTerrain(this.matter.add, stepMap, layer, map.heightInPixels, {
    //     startFrac: endParam.endTileFrac,
    //     w: 32*5,
    //     x: endParam.tileCount*32 + 32,
    //     cummCoord: endParam.cummCoord,
    //     startCurr: endParam.endCurr
    // });
    
    
    //console.log(endParam);
    
    // layer2.setCollisionBetween(1, 54, true, true);
    // layer2.setCollision(15, false, true);
    // this.matter.world.convertTilemapLayer(layer2);
    
    // layer.setCollisionBetween(1, 54, true, true);
    // layer.setCollision(15, false, true);
    // this.matter.world.convertTilemapLayer(layer);
    
    // var DKey = this.input.keyboard.addKey('D');
    // DKey.on('down', function () {
    //     chunk1.destroyChunk();
    //     chunk1.nextChunk(chunk2, map, tiles);
    //     layer = chunk1.layer;
    //     layer.setCollisionBetween(1, 54, true, true);
    //     layer.setCollision(15, false, true);
    //     // this.matter.world.convertTilemapLayer(layer);
    //     // layer = chunk1.layer;
    //     // layer.forEachTile((tile)=>{
    //     //     if(tile.physics.matterBody !== undefined)
    //     //     {
    //     //         console.log('d');
    //     //         tile.physics.matterBody.destroy();
    //     //     }
    //     // });
    //     // layer.destroy();
        
    //     // for(let i=0;i<1000;i++)
    //     // {
    //     //     var id = srand.pick([1, 2, 3, 4, 6]);
    //     //     layer.putTileAt(id, srand.integerInRange(10, 100), srand.integerInRange(10, 20));
    //     // }
    //     this.matter.world.convertTilemapLayer(layer);
    // }, this);
    
    
    
    //layer.setScrollFactor(0.5,1);
    
    /**destroy layer and create new layer with same name
     * 
        layer.forEachTile((tile)=>{
            if(tile.physics.matterBody !== undefined)
            {
                tile.physics.matterBody.destroy();
            }
        });
        layer.destroy();
        layer = map.createBlankLayer('layer1', tiles, 0, -32*3, 3000, 100);
    */
    


    this.matter.add.mouseSpring();
    
    cursors = this.input.keyboard.createCursorKeys();
}

function update()
{
    //layer.putTileAtWorldXY(srand.pick([1,2,3]), 0, 500);
    //this.matter.world.convertTilemapLayer(layer);
    vehicle.processKey(cursors);
    chunkloader.processChunk(this, map, tiles, vehicle.body.x);
    backgroundloader.updateBackground(this, vehicle.body.x);
    

    // if (cursors.left.isDown)
    // {
    //     //this.matter.applyForce(w1, {x:-0.02, y:0});
    //     w1.body.torque = - wheel_torque;
    //     w2.body.torque = - wheel_torque;
    //     body.body.torque = wheel_torque;
        
    // }
    // else if (cursors.right.isDown)
    // {
    //     //this.matter.applyForce(w1, {x:0.02, y:0});
    //     w1.body.torque =  wheel_torque;
    //     w2.body.torque =  wheel_torque;
    //     body.body.torque = -wheel_torque;
    // }
}



