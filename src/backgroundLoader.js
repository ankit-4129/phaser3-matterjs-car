/**
 * loades background files and apply them on scene
 */


/**
 * maxQueueSize is the amount of images any given layer can have,
 * while scrolling new images will not be added,
 * whenever a new image is needed the left most image will be repositioned to right
 */
class BackgroundLoader
{ 
    static maxQueueSize = 3;

    /**
     * call constructor in preload() of scene
     * @param {string} folderLoc location of floder in which all layers are present
     * @param {Array<Object>} param paramaeters for file name, and scroll factor 
     */
    constructor(scene, folderLoc='./assets/game_background_1/layers', param = [
        {
            scrollFx: 0.0,
            fileName: 'sky.png',
            offsetX: 0,
            offsetY: 0,
        },
        {
            scrollFx: 0.25,
            fileName: 'rocks_1.png',
            offsetX: 0,
            offsetY: 100,
        },
        {
            scrollFx: 0.30,
            fileName: 'clouds_1.png',
            offsetX: 0,
            offsetY: 0,
        },
        {
            scrollFx: 0.30,
            fileName: 'rocks_2.png',
            offsetX: 0,
            offsetY: 200,
        },
        {
            scrollFx: 0.40,
            fileName: 'clouds_3.png',
            offsetX: 0,
            offsetY: 0,
        },
        {
            scrollFx: 0.50,
            fileName: 'clouds_4.png',
            offsetX: 0,
            offsetY: 0,
        },
    ])
    {
        ///load all files
        this.layers = [];
        param.forEach((layer, idx) => {
            layer.key = layer.fileName.split('.')[0];
            layer.zIndex = -9999 + idx;
            scene.load.image(layer.key, folderLoc + '/' + layer.fileName);
            this.layers.push(layer);
        });

    }

    applyBackground(scene)
    {
        let h = scene.scale.height; ///height is const throught the game
        this.layers.forEach((layer, idx) =>{

            this.layers[idx].queue = []; ///queue
            this.layers[idx].prevFrameCount = BackgroundLoader.maxQueueSize;
            this.layers[idx].lastImageIdx = 0; ///left most image index
            let Iw = scene.textures.get(layer.key).getSourceImage().width;
            for(let i=0; i<BackgroundLoader.maxQueueSize; i++)
            {
                let image = scene.add.image(i*Iw + layer.offsetX,h + layer.offsetY, layer.key)
                //.setDisplaySize(w, h) //needed
                .setOrigin(0, 1)
                .setScrollFactor(layer.scrollFx)
                .setDepth(layer.zIndex);

                this.layers[idx].queue.push(image);
            }

        });

    }

    /**
     * call this function in update loop of scene,
     * rePositions outofbound Images and apply background images based on scroll factor
     * @param {*} scene scene
     * @param {*} cameraCoordX x coords of camera in world
     */
    updateBackground(scene, cameraCoordX)
    {
        let w = scene.scale.width;
        //let h = scene.scale.height;

        this.layers.forEach((layer, idx) =>{
            let Iw = scene.textures.get(layer.key).getSourceImage().width;
            let count = 1 + Math.ceil((scene.scale.width + cameraCoordX - layer.offsetX)/Iw)*layer.scrollFx;
            let i = this.layers[idx].prevFrameCount;
            if(i < count)
            {
                ///new image is needed
                this.layers[idx].queue[layer.lastImageIdx].x = i*Iw; ///assign new pos to last image
                this.layers[idx].lastImageIdx += 1; ///increment last image
                this.layers[idx].lastImageIdx %= BackgroundLoader.maxQueueSize; ///acts like circular buffer
                
                this.layers[idx].prevFrameCount += 1;
            }

        });
    }

}
