import { World } from './world.js';
import { ResumeHandler } from './resumeHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the 3D world
        const world = new World(document.getElementById('scene-container'));
        const resumeHandler = new ResumeHandler(world);

        // Hide loading screen when world is ready
        world.onReady(() => {
            document.getElementById('loading').style.display = 'none';
        });

        // Handle window resizing
        window.addEventListener('resize', () => world.handleResize());
    } catch (error) {
        console.error('Error initializing application:', error);
        document.getElementById('loading').textContent = 'Error loading 3D World: ' + error.message;
    }
});
