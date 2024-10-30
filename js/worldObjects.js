import * as THREE from 'three/build/three.module.js';

export function createWorldObjects(world) {
    // Buildings with company logos
    const companies = ['Tech Corp', 'StartUp Inc', 'Innovation Labs'];
    companies.forEach((company, index) => {
        const building = createBuilding(company);
        building.position.set(index * 30 - 30, 10, -30);
        world.scene.add(building);
    });

    // Add cafes
    const cafePositions = [
        { x: 20, z: 20 },
        { x: -20, z: -20 },
        { x: -20, z: 20 }
    ];
    
    cafePositions.forEach(pos => {
        const cafe = createCafe();
        cafe.position.set(pos.x, 0, pos.z);
        world.scene.add(cafe);
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
            // Rotate car based on movement direction
            car.rotation.y = Math.atan2(Math.sin(Date.now() * 0.001), 0.1);
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

function createCafe() {
    const cafe = new THREE.Group();
    
    // Cafe building
    const buildingGeometry = new THREE.BoxGeometry(8, 6, 8);
    const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xd4a17d });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = 3;
    
    // Cafe sign
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.fillText('CAFÉ', 128, 128);
    
    const signTexture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(6, 2);
    const signMaterial = new THREE.MeshBasicMaterial({ 
        map: signTexture,
        transparent: true
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 6, 4.1);
    
    // Outdoor seating
    for (let i = 0; i < 4; i++) {
        const table = createTable();
        table.position.set(
            (i % 2) * 4 - 2,
            0,
            Math.floor(i / 2) * 4 - 6
        );
        cafe.add(table);
    }
    
    cafe.add(building);
    cafe.add(sign);
    return cafe;
}

function createTable() {
    const table = new THREE.Group();
    
    // Table top
    const topGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16);
    const topMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.8;
    
    // Table leg
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const leg = new THREE.Mesh(legGeometry, topMaterial);
    leg.position.y = 0.4;
    
    // Chairs
    for (let i = 0; i < 4; i++) {
        const chair = createChair();
        const angle = (i * Math.PI / 2);
        chair.position.set(
            Math.cos(angle) * 1.2,
            0,
            Math.sin(angle) * 1.2
        );
        chair.rotation.y = angle + Math.PI;
        table.add(chair);
    }
    
    table.add(top);
    table.add(leg);
    return table;
}

function createChair() {
    const chair = new THREE.Group();
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.4);
    const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const seat = new THREE.Mesh(seatGeometry, chairMaterial);
    seat.position.y = 0.4;
    
    // Back
    const backGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const back = new THREE.Mesh(backGeometry, chairMaterial);
    back.position.set(0, 0.6, -0.15);
    
    chair.add(seat);
    chair.add(back);
    return chair;
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
