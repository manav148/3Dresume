export function handleAnimation(world) {
    if (world.controls.isLocked) {
        const delta = 0.1;

        world.velocity.x = 0;
        world.velocity.z = 0;
        world.velocity.y -= 9.8 * 20.0 * delta;

        if (world.moveForward) world.velocity.z = -50.0 * delta;
        if (world.moveBackward) world.velocity.z = 50.0 * delta;
        if (world.moveLeft) world.velocity.x = -50.0 * delta;
        if (world.moveRight) world.velocity.x = 50.0 * delta;

        world.controls.moveRight(world.velocity.x * delta);
        world.controls.moveForward(-world.velocity.z * delta);

        world.camera.position.y += world.velocity.y * delta;

        if (world.camera.position.y < 1.6) {
            world.velocity.y = 0;
            world.camera.position.y = 1.6;
            world.canJump = true;
        }
    }
}
