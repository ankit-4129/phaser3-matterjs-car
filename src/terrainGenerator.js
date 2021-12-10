/**
 * contains function for genrating terrain from cosine interpolation.
 */


function interpolate(pa, pb, px)
{
    var ft = px * Math.PI,
    ft = (1 - Math.cos(ft)) * 0.5;
    return pa * (1 - ft) + pb * ft;
}

/**
 * checks if tiles is going out of bounds and corrects it by,
 * overriding slope approx,
 * upperBound and lowerBound should not be tight bounds, 
 * some margine will allow to put random tiles
 * 
 * @param {Number} cummCoord - cummulative Y-offset of current terrain
 * @param {Number} idx - approx index, approx[idx] is the current selected slope
 * @param {Array<Number>} approx - predifined slopes for tileset, must be sorted in ascending order
 */
function boundTerrainHelper(cummCoord, idx, approx, upperBound, lowerBound)
{
    let p = approx[idx];
    if(cummCoord + p <= -upperBound)
    {
        //we are up, so go down
        ///anything which is above p
        //return Math.max(...approx);
        let smoothidx = Math.max(Math.min(approx.length-1, idx+1) , Math.min(approx.length-1, idx+2));
        return approx[smoothidx];
    }
    if(cummCoord + p >= lowerBound)
    {
        //we are down , so go up
        //return Math.min(...approx);
        let smoothidx = Math.min(Math.max(0, idx-1) , Math.max(0, idx-2));
        return approx[smoothidx];
    }
    /// random terrain modifier
    // if(srand.frac() < 0.1)
    //     p = srand.pick(approx);
    return p;
}

function drawTerrain(stepMap, layer, param)
{
    var debug = false; //log on console
    var curve_debug = false; //render curve
    var bound_debug = false; //render bound lines
    
    
    var tileSize = 32;
    param = {
        x: param.x ?? 0, //x coord to start on screen
        h: param.h ?? 500, //chunk height (height of layer)
        w: param.w ?? 2000, //chunk max width
        y: param.y ?? 500/2, //y coord to start on screen
        amp: param.amp ?? 300, //amplitude
        wl: param.wl ?? tileSize*10, //wavelength
        startFrac: param.startFrac ?? srand.frac(), //starting tile
        cummCoord: param.cummCoord ?? 0, //cummulative 'p'
        startCurr: param.startCurr ?? 0, //start curr 'curr'
        upperBound: param.upperBound ?? tileSize*10, // how many tiles above can terrain go,
        lowerBound: param.lowerBound ?? tileSize*10, //how many tiles below can terrain go
    };

    param.amp *= 5; //amplitude randomizer
    param.wl *= 1; //wavelength randomizer

    //return this paramaeters for creating next continuouse chunk
    let endParam = {
        endTileFrac : 0, //return this value [0, 1] which defines end tile position
        endCurr: 0, // 'curr'
        cummCoord : 0, // 'p',
        tileCount: 0, //total tiles placed in this function call, Note: total tiles => absolute width of chunk in tile coords
    };

    let a = param.startFrac,
        b = 0,
        x = param.x, 
        height = []; //stores y for each point , use this to select tile
    let limitFlag = true;

    while(limitFlag) //x < param.w
    {
        if(curve_debug)
        {    
            graphics.fillStyle(0x0f000, 1);
            graphics.fillCircle(x, param.h + param.amp*a, 8);
        }

        let istep = 1/(param.wl/tileSize);
        for(let i=0; i<=1; i += istep)
        {
            let ip = interpolate(a, b, i);
            endParam.endTileFrac = ip;
            if(height.length*tileSize > param.w)
            {
                limitFlag = false;
                break;
            }
            height.push(param.h + param.amp*ip);
            if(curve_debug)
            {
                graphics.fillStyle(0x4d76ff, 1);
                graphics.fillCircle(x + i*param.wl, param.h + param.amp*ip, 1);
            }
            
        }
        x += param.wl;
        a = b;
        b = srand.frac();
    }

    var mag = [0];
    //approx p to nearest slope
    for(let i=1, p, minyidx, approx = [-32, -16, 0, 16, 32], cummCoord = param.cummCoord; i<height.length; i++)
    {
        p = height[i] - height[i-1];
        minyidx = 0;
        approx.forEach((d, i) => {
            if(Math.abs(p-d) < Math.abs(p-approx[minyidx]))
                minyidx = i;
        });
        p = boundTerrainHelper(cummCoord, minyidx, approx, param.upperBound, param.lowerBound);
        cummCoord += p;
        mag.push(p);
    }

    if(debug)
        console.log(mag);
    
    let p = param.cummCoord ?? 0, curr = param.startCurr ?? 0;
    let yCoordOffset = param.y + param.h/2;
    
    for(let i=1;i<mag.length; i++)
    {
        //genration rule for this tileset
        {
            //console.log('p '+p);
            let hp = curr%tileSize;
            let hps = hp + mag[i];
            if(hps < 0)
            {
                hp += tileSize;
                hps += tileSize;
            }
            else if(hps > tileSize)
            {
                hps -= tileSize;
                hp -= tileSize;
            }
            
            curr = hps;

            let sign = 0;
            if(mag[i]!=0)
            {
                sign = mag[i] < 0 ? -1 : 1;
            }
            let ystep = Math.floor((mag[i]+p - sign)/tileSize);
            let key = hp + '_' + hps;

            let xCoord = param.x + tileSize*(i-1),
                yCoord = yCoordOffset + ystep*tileSize,
                yTileCount = param.h/tileSize;
            
            let tileCoord = layer.worldToTileXY(xCoord, yCoord);
            let xTCoord = tileCoord.x,
                yTCoord = tileCoord.y;
            
            if(key == '48_16')
            {
                layer.putTileAt(stepMap[key+'_1'], xTCoord, yTCoord + 1);
                layer.putTileAt(stepMap[key+'_2'], xTCoord, yTCoord);
            }
            else if(key == '-16_16')
            {
                layer.putTileAt(stepMap[key+'_1'], xTCoord, yTCoord - 1);
                layer.putTileAt(stepMap[key+'_2'], xTCoord, yTCoord);

                layer.putTileAt(15, xTCoord, yTCoord + 1);
            }
            else if(key == '32_0' || key == '32_16')
            {
                layer.putTileAt(stepMap[key], xTCoord, yTCoord);
                layer.putTileAt(stepMap['32_x'], xTCoord, yTCoord + 1);
            }
            else if(key == '0_32' || key == '16_32')
            {
                layer.putTileAt(stepMap[key], xTCoord, yTCoord);
                layer.putTileAt(stepMap['x_32'], xTCoord, yTCoord + 1);
            }
            else
            {
                layer.putTileAt(stepMap[key], xTCoord, yTCoord);
                layer.putTileAt(15, xTCoord, yTCoord + 1);
            }
            
            //this fill tile should not have matter body this is just for filling void with tiles
            layer.fill(15, xTCoord, yTCoord+2, 1, yTileCount - yTCoord - 3);

            if(debug)
            {
                let undFlag = (stepMap[key] === undefined);
                console.log(i + ' ' + mag[i] + ' ' + key + ' ' + undFlag);
            }
        }
        p += mag[i];
        
        if(curve_debug)
        {
            graphics.fillStyle(0xff6340, 1);
            graphics.fillCircle(param.x + tileSize*i, 640 + p, 2);
        }
    }

    if(bound_debug)
    {
        ///base line
        graphics.lineStyle(5, 0x03fc90, 1.0);
        graphics.strokeLineShape(
            new Phaser.Geom.Line(
                param.x, param.y + param.h/2,
                param.x + param.w, param.y + param.h/2
            )
        ).setDepth(99);
        ///upperbound
        graphics.lineStyle(5, 0xff3d4a, 1.0);
        graphics.strokeLineShape(
            new Phaser.Geom.Line(
                param.x, param.y + param.h/2 - param.upperBound,
                param.x + param.w, param.y + param.h/2 - param.upperBound
            )
        ).setDepth(99);
        ///lower bound
        graphics.lineStyle(5, 0xff3d4a, 1.0);
        graphics.strokeLineShape(
            new Phaser.Geom.Line(
                param.x, param.y + param.h/2 + param.lowerBound,
                param.x + param.w, param.y + param.h/2 + param.lowerBound
            )
        ).setDepth(99);
    }

    endParam.endCurr = curr;
    endParam.cummCoord = p;
    endParam.tileCount = mag.length - 1;

    //endParam can be used to create next chunk
    return endParam;
}