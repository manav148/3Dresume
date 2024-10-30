import * as THREE from 'three/build/three.module.js';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';

export function createEnvironment(world) {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a472a,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.scene.add(ground);

    // Roads
    const roadGeometry = new THREE.PlaneGeometry(20, 1000);
    const roadTexture = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/terrain/grasslight-big.jpg');
    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 50);
    const roadMaterial = new THREE.MeshStandardMaterial({
        map: roadTexture,
        color: 0x333333,
        roughness: 0.9
    });
    const mainRoad = new THREE.Mesh(roadGeometry, roadMaterial);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.y = 0.01; // Slightly above ground to prevent z-fighting
    world.scene.add(mainRoad);

    // Cross road
    const crossRoad = new THREE.Mesh(roadGeometry, roadMaterial);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.rotation.z = Math.PI / 2;
    crossRoad.position.y = 0.01;
    world.scene.add(crossRoad);

    // Sidewalks
    const sidewalkGeometry = new THREE.PlaneGeometry(5, 1000);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({
        color: 0x999999,
        roughness: 0.8
    });

    // Add sidewalks along roads
    [-12.5, 12.5].forEach(x => {
        const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalk.rotation.x = -Math.PI / 2;
        sidewalk.position.set(x, 0.02, 0);
        world.scene.add(sidewalk);
    });

    [-12.5, 12.5].forEach(z => {
        const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalk.rotation.x = -Math.PI / 2;
        sidewalk.rotation.z = Math.PI / 2;
        sidewalk.position.set(0, 0.02, z);
        world.scene.add(sidewalk);
    });

    // Sky
    const sky = new Sky();
    sky.scale.setScalar(450000);
    world.scene.add(sky);

    // Water
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
    const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/textures/waternormals.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: world.scene.fog !== undefined
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;
    world.scene.add(water);
}
