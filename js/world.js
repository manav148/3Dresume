import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';
import { Physics } from './physics.js';
import { Office } from './office.js';

export class World {
    constructor(container) {
        this.container = container;
        this.offices = [];
        this.currentOffice = null;
        
        this.initScene();
        this.initLights();
        this.initControls();
        this.createEnvironment();
        this.setupEventListeners();
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
        
        this.camera.position.set(0, 1.6, 5);
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

    createEnvironment() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a472a,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Sky
        const sky = new Sky();
        sky.scale.setScalar(450000);
        this.scene.add(sky);

        // Water
        const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
        const water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined
        });
        water.rotation.x = -Math.PI / 2;
        water.position.y = -5;
        this.scene.add(water);
    }

    setupEventListeners() {
        document.addEventListener('click', () => {
            if (!this.controls.isLocked) {
                this.controls.lock();
            }
        });

        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'Space':
                    if (this.canJump) {
                        this.velocity.y = 150; // Further reduced jump velocity
                        this.canJump = false;
                    }
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        });
    }

    resetPosition() {
        // Reset camera position to the center
        this.camera.position.set(0, 1.6, 5);
        // Reset camera rotation to look forward
        this.controls.getObject().rotation.set(0, 0, 0);
        // Reset velocity
        this.velocity.set(0, 0, 0);
        // Reset movement flags
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls.isLocked) {
            const delta = 0.1;

            this.velocity.x = 0;
            this.velocity.z = 0;
            this.velocity.y -= 9.8 * 100.0 * delta; // Gravity remains the same

            // Further reduced movement speeds (from 200.0 to 100.0)
            if (this.moveForward) this.velocity.z = -50.0 * delta;
            if (this.moveBackward) this.velocity.z = 50.0 * delta;
            if (this.moveLeft) this.velocity.x = -50.0 * delta;
            if (this.moveRight) this.velocity.x = 50.0 * delta;

            this.controls.moveRight(this.velocity.x * delta);
            this.controls.moveForward(-this.velocity.z * delta);

            this.camera.position.y += this.velocity.y * delta;

            if (this.camera.position.y < 1.6) {
                this.velocity.y = 0;
                this.camera.position.y = 1.6;
                this.canJump = true;
            }
        }

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
        // Remove each office from the scene and clear the array
        this.offices.forEach(office => {
            this.scene.remove(office.getGroup());
        });
        this.offices = [];
    }
}
