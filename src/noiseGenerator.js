/**
 * genrate curve which will be used for generation of terrain.
 */

function interpolate(pa, pb, px)
{
    var ft = px * Math.PI,
    ft = (1 - Math.cos(ft)) * 0.5;
    return pa * (1 - ft) + pb * ft;
}



class NoiseGenerator
{
    static curve_debug = false;

    /**
     * 
     * @returns selectes a generator function and returns it
     */
    static getCurve()
    {
        return NoiseGenerator.cosineInterpolation;
        // return NoiseGenerator.sinCurve;
    }

    static sinCurve(param, tileSize)
    {
        let a = 0,
            x = 0,
            height = [],
            t = 0.025;
        
        while(x <= param.w) //x < param.w
        {
            
            a = srand.frac()*20*Math.sin(x) + 150*(Math.sin(3.14*t*x/tileSize) + Math.sin(2*t*x/tileSize) + Math.sin(10*t*x/tileSize));
            height.push(a);
            if(NoiseGenerator.curve_debug)
            {    
                graphics.fillStyle(0x0f000, 1);
                graphics.fillCircle(param.x + x, param.h/2 + a, 2);
            }
            x += tileSize;
        }
        //console.log(height);
        return height;
    }
    
    /**
     * 
     * @param {Object} param parameter for curve genration 
     * @returns array with y coordinate values of curve seprated by tilesize
     */
    static cosineInterpolation(param, tileSize)
    {
        let a0 = srand.frac(),
            b0 = 0,
            wl0 = param.wl,

            a1 = srand.frac(),
            b1 = srand.frac(),
            wl1 = param.wl*2,
            step1 = 1,

            x = param.x,
            height = []; //stores y for each point , use this to select tile

        while(true) //x < param.w
        {
            if(NoiseGenerator.curve_debug)
            {    
                graphics.fillStyle(0x0f000, 1);
                graphics.fillCircle(x, param.h + param.amp*a0, 8);
            }

            let istep = 1/(wl0/tileSize);
            for(let i=0; i<=1; i += istep)
            {
                let ip = interpolate(a0, b0, i);
                //ip += 1.5*interpolate(a1, b1, i/10 + step1/10);

                if(height.length*tileSize > param.w)
                {
                    return height;
                }
                height.push(param.amp*ip);
                if(NoiseGenerator.curve_debug)
                {
                    graphics.fillStyle(0x4d76ff, 1);
                    graphics.fillCircle(x + i*wl0,  100 + param.amp*ip, 8);
                }
                
            }

            if(step1 > 10)
            {
                a1 = b1;
                b1 = srand.frac();
                step1 = 0;
            }
            
            step1 += 1;

            x += wl0;
            a0 = b0;
            b0 = srand.frac();
        }
        
    }
 
}
