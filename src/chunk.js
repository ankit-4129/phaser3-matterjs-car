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
        this.isLoadedFromFile = false; ///is this chunk loaded from file, if yes dont delete it
        this.coordX = param.coordX ?? 0;
        this.coordY = param.coordY ?? 0;
        this.width = param.width ??  32*100;
        this.height = param.height ?? 32*50;
        this.layer;
        this.endParam, //end param for constructing other next chunk
        this.targetCummCoord = undefined;
    }

    getLayerPropHelper()
    {
        
    }

    /**
     * special chunk
     * load chunk from tilemap
     * if a chunk is already in use this will 
     */
    loadChunkHelper(tilemap, tileset, loadedChunkLabel)
    {
        if(loadedChunkLabel !== undefined)
        {
            ///chunk already in use, so generate proceduraly
            if(tilemap.layers[tilemap.getLayerIndex(loadedChunkLabel)].tilemapLayer != undefined)
            {
                return false;
            }

            this.layer = tilemap.createLayer(loadedChunkLabel, tileset,
                this.coordX, this.coordY
            );
            let layerProp = JSON.parse(this.layer.layer.properties[0].value);
            //console.log(layerProp);
            let cummCoord = layerProp.end - (this.height/2 + this.coordY)/32;
            // console.log(cummCoord);
            this.endParam = {
                cummCoord: cummCoord*32,
                tileCount: this.layer.layer.width
            };

            this.drawChunkBorders();
            //return true on successful loading 
            return true;
        }
        //label is undefined
        return false;
    }

    drawChunkBorders()
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

    

    initChunk(tilemap, tileset, loadedChunkLabel = undefined)
    {
        Chunk.stepMap = Chunk.stepMap ?? parseTileSet(tileset);

        this.isLoadedFromFile = this.loadChunkHelper(tilemap, tileset, loadedChunkLabel);
        //if loaded success then return
        if(this.isLoadedFromFile)
            return;

        this.createNewLayerHelper(tilemap, tileset);
        
        this.drawTerrainHelper({
            w: this.width,
            x: this.coordX,
            y: this.coordY,
            h: this.height,
            targetCummCoord: this.targetCummCoord,
        });
        this.targetCummCoord = undefined;

        this.drawChunkBorders();
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

        //donot remove link from tilemap and set isLoadedfromFile = false
        if(this.isLoadedFromFile)
        {
            this.layer.destroy(false); //clean but dont remove link
            this.isLoadedFromFile = false;
        }
        else
        {
            this.layer.destroy();
        }
    }

    nextChunk(prevChunk, tilemap, tileset, loadedChunkLabel = undefined)
    {
        this.coordX = prevChunk.endCoordX() + (Chunk.debug_spacechunk ? 32*2 : 0);

        this.isLoadedFromFile = this.loadChunkHelper(tilemap, tileset, loadedChunkLabel);
        //if loaded success then return
        if(this.isLoadedFromFile)
            return;

        this.createNewLayerHelper(tilemap, tileset);
        this.drawTerrainHelper({
            w: this.width,
            x: this.coordX,
            y: this.coordY,
            h: this.height,
            cummCoord: prevChunk.endParam.cummCoord,
            targetCummCoord: this.targetCummCoord,
        });
        this.targetCummCoord = undefined;
        
        this.drawChunkBorders();
    }

}