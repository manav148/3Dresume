import * as THREE from 'three';

export class Physics {
    constructor() {
        this.colliders = [];
    }

    addCollider(mesh, type = 'box') {
        this.colliders.push({
            mesh: mesh,
            type: type,
            bounds: new THREE.Box3().setFromObject(mesh)
        });
    }

    checkCollision(position, radius = 0.5) {
        const playerBounds = new THREE.Sphere(position, radius);

        for (const collider of this.colliders) {
            if (collider.type === 'box') {
                if (this.sphereIntersectsBox(playerBounds, collider.bounds)) {
                    return true;
                }
            }
        }
        return false;
    }

    sphereIntersectsBox(sphere, box) {
        const closestPoint = new THREE.Vector3();
        closestPoint.copy(sphere.center).clamp(box.min, box.max);
        
        const distance = sphere.center.distanceTo(closestPoint);
        return distance < sphere.radius;
    }

    update() {
        // Update collider bounds if objects move
        this.colliders.forEach(collider => {
            collider.bounds.setFromObject(collider.mesh);
        });
    }
}
