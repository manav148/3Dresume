import * as THREE from 'three/build/three.module.js';

export function createWorldObjects(world) {
    // Buildings with company logos
    const companies = ['Tech Corp', 'StartUp Inc', 'Innovation Labs'];
    companies.forEach((company, index) => {
        const building = createBuilding(company);
        building.position.set(index * 30 - 30, 10, -30);
        world.scene.add(building);
    });

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

    // Add birds
    const birds = [];
    for (let i = 0; i < 10; i++) {
        const bird = createBird();
        bird.position.set(
            Math.random() * 100 - 50,
            20 + Math.random() * 10,
            Math.random() * 100 - 50
        );
        birds.push(bird);
        world.scene.add(bird);
    }

    // Animate objects
    function animate() {
        // Animate birds
        birds.forEach(bird => {
            bird.position.x += Math.sin(Date.now() * 0.001) * 0.1;
            bird.position.y += Math.cos(Date.now() * 0.001) * 0.05;
        });

        // Animate cars
        cars.forEach(car => {
            car.position.x += Math.sin(Date.now() * 0.001) * 0.1;
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function createBuilding(companyName) {
    const building = new THREE.Group();
    
    // Building structure
    const geometry = new THREE.BoxGeometry(10, 20, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const structure = new THREE.Mesh(geometry, material);
    
    // Company logo
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.fillText(companyName, 128, 128);
    
    const logoTexture = new THREE.CanvasTexture(canvas);
    const logoGeometry = new THREE.PlaneGeometry(8, 4);
    const logoMaterial = new THREE.MeshBasicMaterial({ 
        map: logoTexture,
        transparent: true
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.z = 5.1;
    logo.position.y = 5;
    
    building.add(structure);
    building.add(logo);
    return building;
}

function createTree() {
    const tree = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4d2926 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    // Leaves
    const leavesGeometry = new THREE.ConeGeometry(2, 4, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x0c5c03 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 3;
    
    tree.add(trunk);
    tree.add(leaves);
    return tree;
}

function createCar() {
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

function createBird() {
    const bird = new THREE.Group();
    
    // Bird body
    const bodyGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    
    // Wings
    const wingGeometry = new THREE.PlaneGeometry(1, 0.3);
    const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x606060, side: THREE.DoubleSide });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0.3, -0.2);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0, 0.3, 0.2);
    
    bird.add(body);
    bird.add(leftWing);
    bird.add(rightWing);
    return bird;
}
