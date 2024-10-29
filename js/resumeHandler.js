import * as THREE from 'three/build/three.module.js';
import { Office } from './office.js';

export class ResumeHandler {
    constructor(world) {
        this.world = world;
        this.experiences = [
            {
                title: "Software Engineer",
                company: "Amazon Financial Foundation Service",
                period: "Oct 2022-Present",
                description: "Designed and rebuilt financial reconciliation system\nLed team of 5 from conception to completion\nProcessed $1B in daily transactions and 5 PB of daily data",
                technologies: ["Financial Systems", "Big Data", "Leadership"]
            },
            {
                title: "Software Engineer",
                company: "AWS Managed Grafana",
                period: "Feb 2022-Oct 2022",
                description: "Implemented AWS Grafana workspace limit feature\nLed team of 10, establishing scrum practices\nIncreased sprint velocity by 2X",
                technologies: ["AWS", "Grafana", "Scrum"]
            },
            {
                title: "Software Engineer",
                company: "AWS Cloudformation",
                period: "Jan 2020-Feb 2022",
                description: "Designed and launched Modules construct\nLed team of 6 engineers\nReduced deployment time by 70% and configuration costs by 60%",
                technologies: ["AWS", "Cloud Infrastructure", "Leadership"]
            },
            {
                title: "Software Engineer",
                company: "Amazon Alexa",
                period: "May 2018-Dec 2019",
                description: "Managed high TPS backend systems for Alexa Timers\nEstablished operational best practices\nMentored team of 8, increasing productivity 4X",
                technologies: ["Backend Systems", "High TPS", "Mentoring"]
            },
            {
                title: "Software Engineer",
                company: "Amazon Business",
                period: "Jan 2016-April 2018",
                description: "Launched B2B Gateway widget, increasing adoption by 50%\nLed team of 4 to launch Request For Quotes Portal\nHandled over 1000 TPS, reducing customer costs by 25%",
                technologies: ["B2B Systems", "High TPS", "Leadership"]
            },
            {
                title: "Software Developer",
                company: "Myzamana Inc",
                period: "Oct 2012-Dec 2015",
                description: "Scaled startup from 5M to 50M monthly page views\nBuilt scalable user notification system\nLaunched in-house Redis cluster",
                technologies: ["Scalability", "Redis", "Notification Systems"]
            },
            {
                title: "Research Assistant",
                company: "Electronic Crime Investigative Technologies, ECIT FSU",
                period: "May 2010-Aug 2012",
                description: "Implemented distributed web crawler using Tor\nIncreased crawling speed by 90x\nUsed by Florida Department of Law Enforcement",
                technologies: ["Tor", "Web Crawling", "Distributed Systems"]
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
