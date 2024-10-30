import * as THREE from 'three/build/three.module.js';

export function createCar() {
    const car = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
    
    [-1, 1].forEach(x => {
        [-1, 1].forEach(z => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(x * 1.5, -0.5, z * 1);
            wheel.rotation.z = Math.PI / 2;
            car.add(wheel);
        });
    });
    
    car.add(body);
    return car;
}

export function createPedestrian() {
    const person = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.2, 0.8, 2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.9;
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 1.9;
    
    person.add(body);
    person.add(head);
    return person;
}

export function createDogWalker() {
    const group = new THREE.Group();
    
    // Person
    const person = createPedestrian();
    group.add(person);
    
    // Dog
    const dog = new THREE.Group();
    
    // Dog body
    const bodyGeometry = new THREE.CapsuleGeometry(0.1, 0.4, 2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0.5, 0.3, 0);
    body.rotation.z = Math.PI / 2;
    
    // Dog head
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.8, 0.3, 0);
    
    // Dog legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    [-0.1, 0.1].forEach(z => {
        [0.3, 0.7].forEach(x => {
            const leg = new THREE.Mesh(legGeometry, bodyMaterial);
            leg.position.set(x, 0.15, z);
            dog.add(leg);
        });
    });
    
    // Leash
    const leashGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 8);
    const leashMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const leash = new THREE.Mesh(leashGeometry, leashMaterial);
    leash.position.set(0, 0.3, 0);
    leash.rotation.z = Math.PI / 4;
    
    dog.add(body);
    dog.add(head);
    dog.add(leash);
    dog.position.set(1, 0, 0);
    
    group.add(dog);
    return group;
}
