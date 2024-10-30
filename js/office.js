import * as THREE from 'three/build/three.module.js';
import { createProfessionalBuilding } from './objects/buildings.js';

export class Office {
    constructor(experience) {
        this.experience = experience;
        this.group = new THREE.Group();
        this.createStructure();
    }

    createStructure() {
        // Create professional building with experience data
        const buildingData = {
            name: this.experience.company,
            color: this.generateCompanyColor(),
            logo: this.experience.company.substring(0, 2).toUpperCase()
        };
        
        const building = createProfessionalBuilding(buildingData);
        this.group.add(building);

        // Create experience display inside building
        this.createExperienceDisplay();
    }

    generateCompanyColor() {
        // Generate a professional color based on company name
        const hash = this.experience.company.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        // Use professional color palette
        const colors = [
            0x2c3e50, // Dark Blue
            0x34495e, // Darker Blue
            0x2980b9, // Blue
            0x3498db, // Light Blue
            0x1abc9c, // Turquoise
            0x16a085, // Dark Turquoise
            0x27ae60, // Green
            0x2ecc71  // Light Green
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }

    createExperienceDisplay() {
        // Create a floating display inside the building
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Modern, professional design
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title with modern styling
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.experience.title, canvas.width/2, 100);

        // Company & Period with subtle separator
        ctx.font = '48px Arial';
        ctx.fillStyle = '#34495e';
        ctx.fillText(`${this.experience.company}`, canvas.width/2, 180);
        ctx.font = '36px Arial';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText(this.experience.period, canvas.width/2, 240);

        // Description with bullet points and proper spacing
        ctx.font = '32px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'left';
        const lines = this.experience.description.split('\n');
        lines.forEach((line, index) => {
            // Create modern bullet points
            ctx.fillStyle = '#3498db';
            ctx.fillText('•', 80, 340 + index * 60);
            
            // Description text
            ctx.fillStyle = '#2c3e50';
            ctx.fillText(line, 120, 340 + index * 60);
        });

        // Technologies with modern styling
        ctx.fillStyle = '#2980b9';
        ctx.textAlign = 'center';
        ctx.font = 'bold 40px Arial';
        ctx.fillText('Technologies', canvas.width/2, 600);

        // Create technology badges
        const techList = this.experience.technologies;
        const badgeWidth = 200;
        const badgeHeight = 40;
        const startX = (canvas.width - (badgeWidth * Math.min(3, techList.length) + 20 * (Math.min(3, techList.length) - 1))) / 2;
        
        techList.forEach((tech, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = startX + col * (badgeWidth + 20);
            const y = 640 + row * 60;

            // Badge background
            ctx.fillStyle = '#ecf0f1';
            ctx.beginPath();
            ctx.roundRect(x, y, badgeWidth, badgeHeight, 20);
            ctx.fill();

            // Technology text
            ctx.fillStyle = '#2c3e50';
            ctx.font = '24px Arial';
            ctx.fillText(tech, x + badgeWidth/2, y + badgeHeight/2 + 8);
        });

        const texture = new THREE.CanvasTexture(canvas);
        const displayGeometry = new THREE.PlaneGeometry(8, 8);
        const displayMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.9,
            transparent: true,
            opacity: 0.9
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.set(0, 10, -3.3);
        this.group.add(display);
    }

    getGroup() {
        return this.group;
    }
}
