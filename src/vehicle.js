/**
 * Vehicle which will move on screen.
 */

class Vehicle
{
    constructor(scene, key='car1')
    {
        this.car_data; //JSON data
        this.car_parts;// actual objects
        this.mainBody;
        
        this.spawnPosX = 600;
        this.spawnPosY = 1200;
        
        let posX = this.spawnPosX, posY = this.spawnPosY;

        this.car_data = scene.cache.json.get(key);

        this.car_data['image'].forEach(obj => {
            this[obj] = scene.matter.add.image(
                posX + this.car_data[obj].x, 
                posY + this.car_data[obj].y, 
                vehiclePartsKey,
                this.car_data[obj].image,
                {shape: this.car_data[obj]}
            );
            //z-index
            this[obj]['depth'] = this.car_data[obj]['depth'] ?? 0;
        });

        this.car_data['joint'].forEach(obj => {
            this[obj] = scene.matter.add.joint(
                this[this.car_data[obj].bodyA],
                this[this.car_data[obj].bodyB],
                this.car_data[obj].length,
                this.car_data[obj].stiffness,
                this.car_data[obj]                
            );
        });

        this.mainBody = this[this.car_data['mainBody']];
    }

    processKey(kbd)
    {
        let ip = this.car_data['processKey'];
        for(let key in ip) //keys = ["left", "right"][i]
        {
            for(let state in ip[key]) //state = ["isDown", "isUp"][i]
            {
                if(kbd[key][state]) //if key is in the state
                {
                    for(let part in ip[key][state]) //part = ["wheel1", "wheel2", "carbody"][i]
                    {
                        //TODO: use object.entries
                        for(let prop in ip[key][state][part]) //prop = ["torque", "force"][i]
                        {
                            this[part]['body'][prop] = ip[key][state][part][prop];
                        }
                    }
                }
                
            }
        }
    }

}