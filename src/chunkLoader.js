/**
 * create two chunks and swap them, when vehicle camera goes out of screen
 */

class ChunkLoader
{

    constructor()
    {
        this.currid = -1;
        this.chunkTWidth = 100; //chunk width in tiles
        this.processChunkRelaxation = (this.chunkTWidth*32)/4; //dont destroy chunk immideatly, let car cross
        this.loadedChunkLabel = []; //chunk label loaded from file
        this.upcomingChunk = undefined;//stores randomly selected chunk label from loaded chunk
        this.upcomingChunkCooldown = false;//two special chunk cannot be adjacent, due to continuity constraint
        this.chunkParam = {
            height: 32*50,
            width: 32*this.chunkTWidth,
            coordY: 0,
        };
        this.chunk = [
            new Chunk('chunk1', this.chunkParam),
            new Chunk('chunk2', this.chunkParam)
        ];//acts like a circular buffer with two chunks

        this.startingChunk; //stores detatil of spawn Chunk, this chunk is only used once at starting

        this.tilesetName;
        this.tilemapName;

        this.tilemap;
        this.tileset;
    }

    /**
     * preload chunk from file
     */
    preLoadTileset(scene, tilesetFile = 'land_ext.png', tilemapFile = 'land_tilemap_ext.json', path = './assets')
    {
        this.tilesetName = tilesetFile.split('.')[0];
        scene.load.image(this.tilesetName, path + '/' + tilesetFile);
                
        this.tilemapName = tilemapFile.split('.')[0];
        scene.load.tilemapTiledJSON(this.tilemapName, path + '/' + tilemapFile);
    }

    /**
     * call in scene.create(), will create tileMap and tileSet
     */
    createTileMapSet(scene)
    {
        this.tilemap = scene.make.tilemap({ key: this.tilemapName });
        this.tileset = this.tilemap.addTilesetImage(this.tilesetName);

        //iterate over all layers in this tilemap and push to loadedChunkLabel
        this.tilemap.layers.forEach(layer => {
            //console.log(layer);
            let layerProp = JSON.parse(layer.properties[0].value);
            //console.log(layerProp);
            let startCummCoord = layerProp.start - (this.chunkParam.height/2 + this.chunkParam.coordY)/32;
            let endCummCoord = layerProp.end - (this.chunkParam.height/2 + this.chunkParam.coordY)/32;
            //console.log(cummCoord);
            let chunkInfo = {
                key: layer.name,
                startCummCoord: startCummCoord*32,
                endCummCoord: endCummCoord*32,
                weight: layerProp.weight,
            };

            if(layerProp.weight == 0)
            {
                this.startingChunk = chunkInfo;
            }
            else
            {
                this.loadedChunkLabel.push(chunkInfo);
            }
        });
        //console.log(this.loadedChunkLabel);
    }

    /**
     * sets physic world bounds and also main camera bounds
     * @param {Phaser.Game} scene 
     * @param {Chunk} leftChunk 
     * @param {Chunk} rightChunk 
     */
    setWorldBorderHelper(scene, leftChunk, rightChunk)
    {
        let bounds = [
            leftChunk.coordX, 
            leftChunk.coordY - leftChunk.height, 
            rightChunk.endCoordX(), 
            rightChunk.coordY + 2*rightChunk.height
        ];
        scene.matter.world.setBounds(...bounds);
        scene.cameras.main.setBounds(...bounds);
    }
    
    setCollisonTileHelper(layer, scene)
    {
        layer.setCollisionBetween(1, 54, true, false);
        layer.setCollision(15, false, false);
        scene.matter.world.convertTilemapLayer(layer);
    }

    ///first time initiate chunk
    initChunkLoader(scene)
    {
        this.currid = 0;
        this.chunk[0].initChunk(this.tilemap, this.tileset, this.startingChunk.key);
        
        this.chunk[1].nextChunk(this.chunk[0], this.tilemap, this.tileset);

        this.setCollisonTileHelper(this.chunk[0].layer, scene);
        this.setCollisonTileHelper(this.chunk[1].layer, scene);

        this.setWorldBorderHelper(scene, this.chunk[0], this.chunk[1]);
    }

    ///call this in update(), handle swapping chunks with help of vehicleCoords
    processChunk(scene, vehicleCoordX)
    {
        if(vehicleCoordX > this.chunk[this.currid].endCoordX() + this.processChunkRelaxation)
        {    
            this.chunk[this.currid].destroyChunk(); //left most chunk
            
            ///do srand process to find if next to next chunk is special chunk
            let upcomingChunk = undefined; //by default undefined
            if(this.upcomingChunkCooldown && srand.frac() > 0.4)
            {
                //next to next is special chunk
                upcomingChunk = srand.pick(this.loadedChunkLabel);
                //console.log(upcomingChunk);
                //next chunk will end at start coord of next to next chunk
                this.chunk[this.currid].targetCummCoord = upcomingChunk.startCummCoord;
            }
            this.upcomingChunkCooldown = !this.upcomingChunkCooldown;
            //next chunk generation
            this.chunk[this.currid].nextChunk(this.chunk[1-this.currid], 
                this.tilemap, this.tileset, 
                (this.upcomingChunk !== undefined ? this.upcomingChunk.key : undefined),
            ); //put left chunk on right most side
            
            //next chunk will be special chunk
            this.upcomingChunk = upcomingChunk;
            
            this.setCollisonTileHelper(this.chunk[this.currid].layer, scene);

            this.currid = 1-this.currid; //change chunk index
            
            this.setWorldBorderHelper(scene, this.chunk[this.currid], this.chunk[1-this.currid]);
        
        }
    }

}