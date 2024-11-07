export function setupEventListeners(world) {
    document.addEventListener('click', () => {
        if (!world.controls.isLocked) {
            world.controls.lock();
        }
    });

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                world.moveForward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                world.moveBackward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                world.moveLeft = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                world.moveRight = true;
                break;
            case 'Space':
                if (world.canJump) {
                    world.velocity.y = 35;
                    world.canJump = false;
                }
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                world.moveForward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                world.moveBackward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                world.moveLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                world.moveRight = false;
                break;
        }
    });
}
