import * as THREE from 'three/build/three.module.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Physics } from './physics.js';
import { Office } from './office.js';
import { createEnvironment } from './worldEnvironment.js';
import { createWorldObjects } from './worldObjects.js';
import { setupEventListeners } from './worldControls.js';
import { handleAnimation } from './worldAnimation.js';

export class World {
    constructor(container) {
        this.container = container;
        this.offices = [];
        this.currentOffice = null;
        
        this.initScene();
        this.initLights();
        this.initControls();
        createEnvironment(this);
        createWorldObjects(this);
        setupEventListeners(this);
        this.physics = new Physics();

        // Add some default offices
        const defaultExperiences = [
            {
                title: "Senior Software Engineer",
                company: "Tech Corp",
                period: "2020-Present",
                description: "Full stack development\nTeam leadership\nArchitecture design",
                technologies: ["React", "Node.js", "AWS"]
            },
            {
                title: "Software Developer",
                company: "StartUp Inc",
                period: "2018-2020",
                description: "Frontend development\nAPI design\nPerformance optimization",
                technologies: ["Vue.js", "Python", "Docker"]
            }
        ];

        defaultExperiences.forEach((exp, index) => {
            const position = new THREE.Vector3(index * 15 - 7.5, 0, 0);
            this.addOffice(exp, position);
        });

        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 1.6, 15); // Moved back further
        this.scene.background = new THREE.Color(0x87CEEB);
    }

    initLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(-10, 10, 0);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);
    }

    initControls() {
        this.controls = new PointerLockControls(this.camera, document.body);
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;
        this.velocity = new THREE.Vector3();
    }

    resetPosition() {
        this.camera.position.set(0, 1.6, 15);
        this.controls.getObject().rotation.set(0, 0, 0);
        this.velocity.set(0, 0, 0);
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        handleAnimation(this);
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onReady(callback) {
        callback();
    }

    addOffice(experience, position) {
        const office = new Office(experience);
        office.getGroup().position.copy(position);
        this.scene.add(office.getGroup());
        this.offices.push(office);
    }

    clearOffices() {
        this.offices.forEach(office => {
            this.scene.remove(office.getGroup());
        });
        this.offices = [];
    }
}
