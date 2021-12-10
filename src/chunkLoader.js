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
        this.chunk = [
            new Chunk('chunk1', {width: 32*this.chunkTWidth}),
            new Chunk('chunk2', {width: 32*this.chunkTWidth})
        ];
    }
    
    setCollisonTileHelper(layer, scene)
    {
        layer.setCollisionBetween(1, 54, true, true);
        layer.setCollision(15, false, true);
        scene.matter.world.convertTilemapLayer(layer);
    }

    ///first time initiate chunk
    initChunkLoader(scene, tilemap, tileset)
    {
        this.currid = 0;
        this.chunk[0].initChunk(tilemap, tileset);
        this.chunk[1].nextChunk(this.chunk[0], tilemap, tileset);

        this.setCollisonTileHelper(this.chunk[0].layer, scene);
        this.setCollisonTileHelper(this.chunk[1].layer, scene);
    }

    ///call this in update(), handle swapping chunks with help of vehicleCoords
    processChunk(scene, tilemap, tileset, vehicleCoordX)
    {
        if(vehicleCoordX > this.chunk[this.currid].endCoordX() + this.processChunkRelaxation)
        {    
            this.chunk[this.currid].destroyChunk();
            this.chunk[this.currid].nextChunk(this.chunk[1-this.currid], tilemap, tileset);
            this.setCollisonTileHelper(this.chunk[this.currid].layer, scene);
            this.currid = 1-this.currid;
        }
    }

}