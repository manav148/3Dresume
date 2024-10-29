import * as THREE from 'three';

export class Office {
    constructor(experience) {
        this.experience = experience;
        this.group = new THREE.Group();
        this.createStructure();
    }

    createStructure() {
        // Building
        const buildingGeometry = new THREE.BoxGeometry(8, 12, 8);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.7,
            metalness: 0.2
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.castShadow = true;
        building.receiveShadow = true;
        this.group.add(building);

        // Windows
        this.createWindows();

        // Door
        this.createDoor();

        // Company Sign
        this.createCompanySign();

        // Interior
        this.createInterior();
    }

    createWindows() {
        const windowGeometry = new THREE.PlaneGeometry(1.5, 2);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            metalness: 0.9,
            roughness: 0.1
        });

        // Front windows
        const windowPositions = [
            [-2, 6, 4.01], [2, 6, 4.01],  // Top row
            [-2, 3, 4.01], [2, 3, 4.01]   // Bottom row
        ];

        windowPositions.forEach(([x, y, z]) => {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(x, y, z);
            this.group.add(window);
        });
    }

    createDoor() {
        const doorGeometry = new THREE.PlaneGeometry(2, 3);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.8
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.5, 4.01);
        this.group.add(door);

        // Door handle
        const handleGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.1);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 0.8,
            roughness: 0.2
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.5, 1.5, 4.1);
        this.group.add(handle);
    }

    createCompanySign() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.experience.company, canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        const signGeometry = new THREE.PlaneGeometry(4, 1);
        const signMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.3,
            roughness: 0.7
        });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(0, 9, 4.02);
        this.group.add(sign);
    }

    createInterior() {
        // Office walls
        const wallGeometry = new THREE.BoxGeometry(7.5, 11.5, 0.2);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.9
        });

        // Back wall with experience details
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.set(0, 5.5, -3.5);
        this.group.add(backWall);

        // Create experience display
        this.createExperienceDisplay();
    }

    createExperienceDisplay() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.experience.title, canvas.width/2, 100);

        // Company & Period
        ctx.font = '36px Arial';
        ctx.fillText(`${this.experience.company} | ${this.experience.period}`, canvas.width/2, 180);

        // Description
        ctx.font = '32px Arial';
        ctx.textAlign = 'left';
        const lines = this.experience.description.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(`• ${line}`, 100, 300 + index * 50);
        });

        // Technologies
        ctx.fillStyle = '#3498db';
        ctx.textAlign = 'center';
        ctx.font = '36px Arial';
        ctx.fillText('Technologies:', canvas.width/2, 600);
        
        const techList = this.experience.technologies.join(' • ');
        ctx.fillText(techList, canvas.width/2, 660);

        const texture = new THREE.CanvasTexture(canvas);
        const displayGeometry = new THREE.PlaneGeometry(6, 6);
        const displayMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.9
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.set(0, 5.5, -3.3);
        this.group.add(display);
    }

    getGroup() {
        return this.group;
    }
}
