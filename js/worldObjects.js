import * as THREE from 'three/build/three.module.js';

export function createWorldObjects(world) {
    // Professional buildings with company logos
    const companies = [
        { name: 'Tech Corp', color: 0x2c3e50, logo: 'TC' },
        { name: 'StartUp Inc', color: 0x34495e, logo: 'SI' },
        { name: 'Innovation Labs', color: 0x2980b9, logo: 'IL' }
    ];

    companies.forEach((company, index) => {
        const building = createProfessionalBuilding(company);
        building.position.set(index * 30 - 30, 10, -30);
        world.scene.add(building);

        // Add direction signs pointing to buildings
        const sign = createDirectionalSign(company.name);
        sign.position.set(index * 30 - 30, 0, 0);
        world.scene.add(sign);
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

function createProfessionalBuilding(company) {
    const building = new THREE.Group();
    
    // Modern building structure with glass effect
    const geometry = new THREE.BoxGeometry(12, 30, 12);
    const material = new THREE.MeshPhongMaterial({ 
        color: company.color,
        shininess: 100,
        specular: 0x333333,
        reflectivity: 1
    });
    const structure = new THREE.Mesh(geometry, material);
    
    // Windows
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6,
        shininess: 100,
        opacity: 0.5,
        transparent: true
    });

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 4; x++) {
            const windowGeom = new THREE.PlaneGeometry(1, 2);
            const windowPane = new THREE.Mesh(windowGeom, windowMaterial);
            windowPane.position.set(-4 + x * 2.5, -10 + y * 4, 6.01);
            building.add(windowPane);
            
            // Add windows to other sides
            const windowPane2 = windowPane.clone();
            windowPane2.position.z = -6.01;
            windowPane2.rotation.y = Math.PI;
            building.add(windowPane2);
            
            const windowPane3 = windowPane.clone();
            windowPane3.position.x = 6.01;
            windowPane3.position.z = -4 + x * 2.5;
            windowPane3.rotation.y = Math.PI / 2;
            building.add(windowPane3);
            
            const windowPane4 = windowPane.clone();
            windowPane4.position.x = -6.01;
            windowPane4.position.z = -4 + x * 2.5;
            windowPane4.rotation.y = -Math.PI / 2;
            building.add(windowPane4);
        }
    }

    // Company logo (larger and more prominent)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 512, 512);
    
    // Draw company logo
    context.fillStyle = '#000000';
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(company.logo, 256, 256);
    
    // Draw company name
    context.font = 'bold 36px Arial';
    context.fillText(company.name, 256, 350);
    
    const logoTexture = new THREE.CanvasTexture(canvas);
    const logoGeometry = new THREE.PlaneGeometry(10, 10);
    const logoMaterial = new THREE.MeshBasicMaterial({ 
        map: logoTexture,
        transparent: true
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.z = 6.1;
    logo.position.y = 10;
    
    building.add(structure);
    building.add(logo);
    return building;
}

function createDirectionalSign(companyName) {
    const sign = new THREE.Group();
    
    // Sign post
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x4a4a4a });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = 1.5;
    
    // Sign board
    const boardGeometry = new THREE.PlaneGeometry(4, 1);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // Draw arrow and text
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = '#000000';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`→ ${companyName}`, 256, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const boardMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        side: THREE.DoubleSide
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 2;
    
    sign.add(post);
    sign.add(board);
    return sign;
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

function createPedestrian() {
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

function createDogWalker() {
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
