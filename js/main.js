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

        // Add reset position button handler
        document.getElementById('resetPosition').addEventListener('click', () => {
            world.resetPosition();
        });

        // Add sidebar toggle functionality
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleSidebar');
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Handle window resizing
        window.addEventListener('resize', () => world.handleResize());
    } catch (error) {
        console.error('Error initializing application:', error);
        document.getElementById('loading').textContent = 'Error loading 3D World: ' + error.message;
    }
});
