import * as THREE from 'three/build/three.module.js';
import { createProfessionalBuilding, createDirectionalSign } from './objects/buildings.js';
import { createTree } from './objects/environment.js';
import { createCar, createPedestrian, createDogWalker } from './objects/characters.js';

export function createWorldObjects(world) {
    // Add trees
    for (let i = 0; i < 20; i++) {
        const tree = createTree();
        tree.position.set(
            Math.random() * 100 - 50,
            0,
            Math.random() * 100 - 50
        );
        world.scene.add(tree);
    }

    // Add cars
    const cars = [];
    for (let i = 0; i < 5; i++) {
        const car = createCar();
        car.position.set(
            Math.random() * 80 - 40,
            0.5,
            Math.random() * 80 - 40
        );
        cars.push(car);
        world.scene.add(car);
    }

    // Add pedestrians and dog walkers
    const pedestrians = [];
    for (let i = 0; i < 15; i++) {
        const pedestrian = i < 5 ? createDogWalker() : createPedestrian();
        pedestrian.position.set(
            Math.random() * 80 - 40,
            0,
            Math.random() * 80 - 40
        );
        pedestrians.push(pedestrian);
        world.scene.add(pedestrian);
    }

    // Animate objects
    function animate() {
        // Animate pedestrians
        pedestrians.forEach(pedestrian => {
            pedestrian.position.x += Math.sin(Date.now() * 0.001 + pedestrian.position.z) * 0.05;
            pedestrian.position.z += Math.cos(Date.now() * 0.001 + pedestrian.position.x) * 0.05;
            
            // Rotate to face walking direction
            const angle = Math.atan2(
                Math.cos(Date.now() * 0.001 + pedestrian.position.x),
                Math.sin(Date.now() * 0.001 + pedestrian.position.z)
            );
            pedestrian.rotation.y = angle;
        });

        // Animate cars
        cars.forEach(car => {
            car.position.x += Math.sin(Date.now() * 0.001) * 0.1;
            car.rotation.y = Math.atan2(Math.sin(Date.now() * 0.001), 0.1);
        });

        requestAnimationFrame(animate);
    }
    animate();
}
