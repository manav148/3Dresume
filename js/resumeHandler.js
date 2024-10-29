import * as THREE from 'three';
import { Office } from './office.js';

export class ResumeHandler {
    constructor(world) {
        this.world = world;
        this.experiences = [
            {
                title: "Senior Software Engineer",
                company: "Tech Innovations Inc",
                period: "2020-Present",
                description: "Led development of cloud infrastructure\nManaged team of 5 engineers\nImplemented CI/CD pipeline",
                technologies: ["AWS", "Kubernetes", "Python", "React"]
            },
            {
                title: "Full Stack Developer",
                company: "Digital Solutions Ltd",
                period: "2018-2020",
                description: "Developed e-commerce platform\nOptimized database performance\nImplemented payment gateway",
                technologies: ["Node.js", "MongoDB", "React", "Docker"]
            },
            {
                title: "Software Developer",
                company: "StartUp Ventures",
                period: "2016-2018",
                description: "Built mobile applications\nImplemented RESTful APIs\nManaged client relationships",
                technologies: ["React Native", "Express.js", "PostgreSQL"]
            }
        ];
        this.setupUI();
        this.renderExperiences();
        this.updateWorld();
    }

    setupUI() {
        const addButton = document.getElementById('addExperience');
        const updateButton = document.getElementById('updateWorld');
        
        addButton.addEventListener('click', () => this.addExperience());
        updateButton.addEventListener('click', () => this.updateWorld());
    }

    createExperienceElement(experience, index) {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <label class="field-label">Title</label>
            <input type="text" class="title" value="${experience.title || ''}" placeholder="Job Title">
            
            <label class="field-label">Company</label>
            <input type="text" class="company" value="${experience.company || ''}" placeholder="Company Name">
            
            <label class="field-label">Period</label>
            <input type="text" class="period" value="${experience.period || ''}" placeholder="e.g., 2020-Present">
            
            <label class="field-label">Description</label>
            <textarea class="description" placeholder="Job Description">${experience.description || ''}</textarea>
            
            <label class="field-label">Technologies (comma-separated)</label>
            <input type="text" class="technologies" value="${experience.technologies.join(', ')}" placeholder="e.g., React, Node.js, AWS">
            
            <button class="btn delete" onclick="this.closest('.experience-item').remove()">Delete</button>
        `;

        return div;
    }

    renderExperiences() {
        const container = document.getElementById('experiences-list');
        container.innerHTML = '';
        this.experiences.forEach((exp, index) => {
            container.appendChild(this.createExperienceElement(exp, index));
        });
    }

    addExperience() {
        const newExperience = {
            title: "",
            company: "",
            period: "",
            description: "",
            technologies: []
        };
        
        const container = document.getElementById('experiences-list');
        container.appendChild(this.createExperienceElement(newExperience, this.experiences.length));
    }

    gatherExperiences() {
        const items = document.querySelectorAll('.experience-item');
        return Array.from(items).map(item => ({
            title: item.querySelector('.title').value,
            company: item.querySelector('.company').value,
            period: item.querySelector('.period').value,
            description: item.querySelector('.description').value,
            technologies: item.querySelector('.technologies').value
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech.length > 0)
        }));
    }

    updateWorld() {
        // Clear existing offices
        this.world.clearOffices();
        
        // Get current experiences from the form
        const experiences = this.gatherExperiences();
        
        // Create new offices for each experience
        experiences.forEach((exp, index) => {
            const position = new THREE.Vector3(index * 15, 0, 0);
            this.world.addOffice(exp, position);
        });
    }
}
