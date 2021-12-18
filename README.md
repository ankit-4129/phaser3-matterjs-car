# phaser3-matterjs-car

A basic 1D procedurally generated terrain car game with matter physics in phaser 3.

# How does this work

## Terrain
Curve created by noise generator is approximated into tiles and tilemap is created on runtime, there are also some premade tilemaps made in Tiled which are placed in between terrain.
Dynamic tilemap supports culling.

## Chunks
Terrain is broken down into chunks and only two chunks are kept in memory, when car crosses certain amount of current chunk then previous chunk is deleted and new chunk is created.
New chunk can be procedurally generated or premade(premade chunks are loaded from file created in Tiled).

## Background
Insted of using tilesprite and scrolling them, three static images are placed side by side and scrolling factor is set.
Whenever a image goes out of camera it is repositioned on rightmost side.

## Vehicle
Every Vehicle is stored in JSON file made with Physics editor and some custom properties are also added which defines control for vehicle.
Custom properties defines torque/force/angular-velocity (and other properties suuported by matter body) and there values and map thems to a keyboard key.

