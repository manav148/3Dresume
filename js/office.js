import * as THREE from 'three/build/three.module.js';
import { createProfessionalBuilding } from './objects/buildings.js';

export class Office {
    constructor(experience) {
        this.experience = experience;
        this.group = new THREE.Group();
        this.scrollOffset = 0;
        this.needsScroll = false;
        this.createStructure();
        this.animate();
    }

    createStructure() {
        const buildingData = {
            name: this.experience.company,
            color: this.generateCompanyColor(),
            logo: this.experience.company.substring(0, 2).toUpperCase()
        };
        
        const building = createProfessionalBuilding(buildingData);
        this.group.add(building);
        this.createExperienceDisplay();
    }

    generateCompanyColor() {
        const hash = this.experience.company.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        const colors = [
            0x2c3e50, 0x34495e, 0x2980b9, 0x3498db,
            0x1abc9c, 0x16a085, 0x27ae60, 0x2ecc71
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }

    createExperienceDisplay() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Store canvas and context for animation
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Create the display mesh
        const texture = new THREE.CanvasTexture(canvas);
        const displayGeometry = new THREE.PlaneGeometry(8, 8);
        const displayMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.9,
            transparent: true,
            opacity: 0.9
        });
        this.display = new THREE.Mesh(displayGeometry, displayMaterial);
        this.display.position.set(0, 4, -3.3);
        this.group.add(this.display);

        // Initial render
        this.renderContent();
    }

    renderContent() {
        const ctx = this.ctx;
        const canvas = this.canvas;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        const titleX = canvas.width/2 + this.scrollOffset;
        ctx.fillText(this.experience.title, titleX, 100);

        // Company & Period
        ctx.font = '48px Arial';
        ctx.fillStyle = '#34495e';
        const companyX = canvas.width/2 + this.scrollOffset;
        ctx.fillText(this.experience.company, companyX, 180);
        
        ctx.font = '36px Arial';
        ctx.fillStyle = '#7f8c8d';
        const periodX = canvas.width/2 + this.scrollOffset;
        ctx.fillText(this.experience.period, periodX, 240);

        // Description
        ctx.font = '32px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'left';
        const lines = this.experience.description.split('\n');
        lines.forEach((line, index) => {
            const lineX = 120 + this.scrollOffset;
            ctx.fillStyle = '#3498db';
            ctx.fillText('•', 80 + this.scrollOffset, 340 + index * 60);
            
            ctx.fillStyle = '#2c3e50';
            ctx.fillText(line, lineX, 340 + index * 60);

            // Check if text needs scrolling
            const textWidth = ctx.measureText(line).width;
            if (textWidth > canvas.width - 240) { // 240 is padding
                this.needsScroll = true;
            }
        });

        // Technologies
        ctx.fillStyle = '#2980b9';
        ctx.textAlign = 'center';
        ctx.font = 'bold 40px Arial';
        const techTitleX = canvas.width/2 + this.scrollOffset;
        ctx.fillText('Technologies', techTitleX, 600);

        // Technology badges
        const techList = this.experience.technologies;
        const badgeWidth = 200;
        const badgeHeight = 40;
        const startX = (canvas.width - (badgeWidth * Math.min(3, techList.length) + 20 * (Math.min(3, techList.length) - 1))) / 2;
        
        techList.forEach((tech, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = startX + col * (badgeWidth + 20) + this.scrollOffset;
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

            // Check if badges need scrolling
            const totalWidth = startX + (techList.length * (badgeWidth + 20));
            if (totalWidth > canvas.width) {
                this.needsScroll = true;
            }
        });

        // Update texture
        this.display.material.map.needsUpdate = true;
    }

    animate() {
        if (this.needsScroll) {
            // Calculate scroll amount
            this.scrollOffset -= 0.5;
            
            // Reset scroll when content has fully scrolled
            if (Math.abs(this.scrollOffset) > this.canvas.width) {
                this.scrollOffset = 0;
            }
            
            // Render updated content
            this.renderContent();
        }
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }

    getGroup() {
        return this.group;
    }
}
