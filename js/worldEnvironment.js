import * as THREE from 'three/build/three.module.js';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';

export function createEnvironment(world) {
    // Enhanced lighting for sunny atmosphere
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(100, 100, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    world.scene.add(sunLight);

    // Ambient light for better overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    world.scene.add(ambientLight);

    // Ground with brighter grass
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d5a27,  // Brighter grass color
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
    mainRoad.position.y = 0.01;
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
        color: 0xcccccc,
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

    // Brighter sky
    const sky = new Sky();
    sky.scale.setScalar(450000);
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 1;
    skyUniforms['rayleigh'].value = 0.5;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.7;
    skyUniforms['sunPosition'].value = new THREE.Vector3(100, 100, 100);
    world.scene.add(sky);

    // Bluer water
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
    const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/textures/waternormals.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(100, 100, 100),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: world.scene.fog !== undefined
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;
    world.scene.add(water);
}
