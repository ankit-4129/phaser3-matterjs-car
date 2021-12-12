/**
 * Vehicle which will move on screen.
 */

class Vehicle
{
    constructor(scene)
    {
        var wheel_shapes = scene.cache.json.get('wheel');
        var wheel_prop = {
            shape: wheel_shapes.wheel,
            restitution: 0.5,
            density: 0.01,
            collisionFilter:{mask:0xFFFFFFEF}, 
            friction: 0.5
        };
        
        var body_shapes = scene.cache.json.get('body');
        var body_prop = {
            shape:body_shapes.body,
            restitution: 0.5,
            density: 0.01,
            collisionFilter:{category:0x10}
        };
        let posX = 1000, posY = 0;
        
        this.body = scene.matter.add.image(posX + 75, posY, 'body-img', 'body', body_prop);
        this.w1 = scene.matter.add.image(posX, posY, 'wheel-img', 'wheel', wheel_prop);
        this.w2 = scene.matter.add.image(posX + 150, posY, 'wheel-img', 'wheel', wheel_prop);

        this.wheel_torque = 0.035;
        this.stiffness = 0.04;
        this.damping = 0.1;
        
        scene.matter.add.joint(this.w1, this.body, 0, this.stiffness, {
            pointB:{x:-30,y:20},
            //stiffness: 0.01,
            damping: this.damping 
        });
        scene.matter.add.joint(this.w1, this.body, 15, 1, {
            pointB:{x:-15,y:20},
            //stiffness: 0.01,
            damping: this.damping 
        });
        
        
        scene.matter.add.joint(this.w2, this.body, 0, this.stiffness, {
            pointB:{x:30,y:20},
            //stiffness: 0.01,
            damping: this.damping 
        });
        scene.matter.add.joint(this.w2, this.body, 15, 1, {
            pointB:{x:15,y:20},
            //stiffness: 0.01,
            damping: this.damping 
        });
    }

    processKey(kbd)
    {
        if (kbd.left.isDown)
        {
            //this.matter.applyForce(w1, {x:-0.02, y:0});
            this.w1.body.torque = - this.wheel_torque;
            this.w2.body.torque = - this.wheel_torque;
            this.body.body.torque = this.wheel_torque/2;
            
        }
        else if (kbd.right.isDown)
        {
            //this.matter.applyForce(w1, {x:0.02, y:0});
            this.w1.body.torque =  this.wheel_torque;
            this.w2.body.torque =  this.wheel_torque;
            this.body.body.torque = -this.wheel_torque/2;
        }
        else if (kbd.up.isDown)
        {
            //this.matter.applyForce(this.body, {x:0.02, y:0});
            this.body.body.force = {x:0, y:-0.0025};
        }


    }
    
    
}