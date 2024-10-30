import * as THREE from 'three/build/three.module.js';

export function createProfessionalBuilding(company) {
    const building = new THREE.Group();
    
    // Modern building structure with glass effect
    const geometry = new THREE.BoxGeometry(12, 30, 12);
    const material = new THREE.MeshPhongMaterial({ 
        color: company.color || 0x2c3e50,
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

    // Create scrolling company logo
    const logoGroup = createScrollingLogo(company);
    building.add(logoGroup);
    
    building.add(structure);
    return building;
}

function createScrollingLogo(company) {
    const logoGroup = new THREE.Group();
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Test text width
    context.font = 'bold 36px Arial';
    const companyNameWidth = context.measureText(company.name).width;
    const needsScroll = companyNameWidth > 400; // threshold for scrolling

    // Create larger canvas if scrolling needed
    if (needsScroll) {
        canvas.width = 1024; // double width for scrolling
    }

    // Draw background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw company logo
    context.fillStyle = '#000000';
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(company.logo || company.name.substring(0, 2), canvas.width/4, 256);
    
    // Draw company name
    context.font = 'bold 36px Arial';
    if (needsScroll) {
        // Draw text twice for seamless scrolling
        context.fillText(company.name, canvas.width/4, 350);
        context.fillText(company.name, (canvas.width * 3)/4, 350);
    } else {
        context.fillText(company.name, canvas.width/2, 350);
    }
    
    const logoTexture = new THREE.CanvasTexture(canvas);
    const logoGeometry = new THREE.PlaneGeometry(10, 10);
    const logoMaterial = new THREE.MeshBasicMaterial({ 
        map: logoTexture,
        transparent: true
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.z = 6.1;
    logo.position.y = 10;

    if (needsScroll) {
        // Add animation
        const animate = () => {
            logoTexture.offset.x += 0.001;
            if (logoTexture.offset.x > 0.5) {
                logoTexture.offset.x = 0;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    logoGroup.add(logo);
    return logoGroup;
}

export function createDirectionalSign(companyName) {
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
    
    // Test text width
    context.font = 'bold 48px Arial';
    const textWidth = context.measureText(`→ ${companyName}`).width;
    const needsScroll = textWidth > 400; // threshold for scrolling

    // Create larger canvas if scrolling needed
    if (needsScroll) {
        canvas.width = 1024; // double width for scrolling
    }
    
    // Draw background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.fillStyle = '#000000';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    if (needsScroll) {
        // Draw text twice for seamless scrolling
        context.fillText(`→ ${companyName}`, canvas.width/4, 64);
        context.fillText(`→ ${companyName}`, (canvas.width * 3)/4, 64);
    } else {
        context.fillText(`→ ${companyName}`, canvas.width/2, 64);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const boardMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        side: THREE.DoubleSide
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 2;

    if (needsScroll) {
        // Add animation
        const animate = () => {
            texture.offset.x += 0.001;
            if (texture.offset.x > 0.5) {
                texture.offset.x = 0;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    sign.add(post);
    sign.add(board);
    return sign;
}
