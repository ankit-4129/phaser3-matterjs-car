/**
 * creates a blank layer and uses terrainGenerator.js to create chunk
 */

function parseTileSet(tileset)
{
    //parses tileset and creates a map with key = string and value = uniqueID
    let map = {};
    for(let i=1;i<=tileset.total; i++)
    {
        let prop = JSON.stringify(tileset.getTileProperties(i));
        if(prop !== undefined)
        {
            prop = JSON.parse(prop);
            if(prop['step'] !== undefined)
            {
                //console.log(prop['step']);
                map[prop['step']] = i;
            }
            
        }
        
    }

    //console.log(map);
    return map;
}
  
 

class Chunk
{
    static debug = false; //chunk border
    static debug_spacechunk = false;

    static stepMap = undefined;
    static tileSize = 32;

    constructor(label, param = {})
    {
        this.label = label;
        this.coordX = param.coordX ?? 0;
        this.coordY = param.coordY ?? 0;
        this.width = param.width ??  32*100;
        this.height = param.height ?? 32*50;
        this.layer;
        this.endParam; //end param for constructing other next chunk
    }

    debugHelper()
    {
        if(Chunk.debug)
        {
            graphics.lineStyle(1, 0xFF00FF, 1.0);
            graphics.strokeRectShape(
                new Phaser.Geom.Rectangle(
                    this.coordX, this.coordY,
                    this.width, this.height
                )
            );
        }
    }

    createNewLayerHelper(tilemap, tileset)
    {
        this.layer = tilemap.createBlankLayer(this.label, tileset, 
            this.coordX, this.coordY, 
            this.width/Chunk.tileSize, this.height/Chunk.tileSize
        );
    }

    drawTerrainHelper(option)
    {
        this.endParam = drawTerrain(Chunk.stepMap, this.layer, option);
    }

    initChunk(tilemap, tileset)
    {
        Chunk.stepMap = Chunk.stepMap ?? parseTileSet(tileset);

        this.createNewLayerHelper(tilemap, tileset);
        
        this.drawTerrainHelper({
            w: this.width,
            x: this.coordX,
            y: this.coordY,
            h: this.height,
        });

        this.debugHelper();
    }

    endCoordX()
    {
        return this.coordX + Chunk.tileSize*this.endParam.tileCount;
    }

    destroyChunk()
    {
        this.layer.forEachTile((tile)=>{
            if(tile.physics.matterBody !== undefined)
            {
                tile.physics.matterBody.destroy();
            }
        });
        this.layer.destroy();
    }

    nextChunk(prevChunk, tilemap, tileset)
    {
        this.coordX = prevChunk.endCoordX() + (Chunk.debug_spacechunk ? 32*2 : 0);

        this.createNewLayerHelper(tilemap, tileset);
        this.drawTerrainHelper({
            w: this.width,
            x: this.coordX,
            y: this.coordY,
            h: this.height,
            cummCoord: prevChunk.endParam.cummCoord,
            startCurr: prevChunk.endParam.endCurr,
        });
        
        this.debugHelper();
    }

}