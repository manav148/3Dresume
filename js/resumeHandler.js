import * as THREE from 'three';
import { Office } from './office.js';

export class ResumeHandler {
    constructor(world) {
        this.world = world;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const uploadInput = document.getElementById('resumeUpload');
        uploadInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        document.getElementById('fileInfo').textContent = `Processing: ${file.name}`;

        try {
            // Mock resume parsing (in real implementation, would parse PDF/DOC)
            const experiences = [
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

            // Create offices for each experience
            experiences.forEach((exp, index) => {
                const position = new THREE.Vector3(index * 15, 0, 0);
                this.world.addOffice(exp, position);
            });

            document.getElementById('fileInfo').textContent = `Loaded: ${file.name}`;
        } catch (error) {
            document.getElementById('fileInfo').textContent = `Error processing file: ${error.message}`;
        }
    }
}
