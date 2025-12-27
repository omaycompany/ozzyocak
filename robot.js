// 8-bit Terminal Robot - ASCII style pixel-by-pixel assembly
class PixelRobot {
    constructor() {
        this.container = null;
        this.robot = null;
        this.pixels = [];
        this.init();
    }

    init() {
        // Create container with terminal style
        this.container = document.createElement('div');
        this.container.id = 'robot-container';

        // Terminal frame
        this.container.innerHTML = `
            <div class="terminal-frame">
                <div class="terminal-header">
                    <span class="terminal-dot"></span>
                    <span class="terminal-dot"></span>
                    <span class="terminal-dot"></span>
                    <span class="terminal-title">robot.exe</span>
                </div>
                <div class="terminal-body">
                    <div class="terminal-text" id="terminal-output"></div>
                    <div class="robot-grid" id="robot-grid"></div>
                </div>
            </div>
            <div class="crack-overlay">
                <div class="crack crack-1"></div>
                <div class="crack crack-2"></div>
                <div class="crack crack-3"></div>
                <div class="crack crack-4"></div>
                <div class="crack crack-5"></div>
                <div class="crack crack-6"></div>
                <div class="crack crack-7"></div>
                <div class="crack crack-8"></div>
                <div class="crack crack-9"></div>
                <div class="crack crack-10"></div>
                <div class="impact-ring"></div>
            </div>
        `;
        document.body.appendChild(this.container);

        this.terminalOutput = this.container.querySelector('#terminal-output');
        this.robotGrid = this.container.querySelector('#robot-grid');
        this.crackOverlay = this.container.querySelector('.crack-overlay');

        // 16x20 pixel robot grid (0 = empty, 1 = dark, 2 = medium, 3 = light)
        this.robotPattern = [
            [0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0],  // antenna top
            [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0],  // antenna
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],  // antenna stem
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],  // antenna stem
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // head top
            [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],  // head
            [0, 0, 0, 1, 2, 3, 3, 2, 2, 3, 3, 2, 1, 0, 0, 0],  // eyes row
            [0, 0, 0, 1, 2, 1, 1, 2, 2, 1, 1, 2, 1, 0, 0, 0],  // pupils
            [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],  // face
            [0, 0, 0, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0],  // mouth
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // head bottom
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],  // neck
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],  // shoulder
            [0, 0, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],  // arms + body
            [0, 0, 1, 2, 2, 1, 2, 3, 3, 2, 1, 2, 2, 1, 0, 0],  // arms + core
            [0, 0, 1, 2, 2, 1, 2, 3, 3, 2, 1, 2, 2, 1, 0, 0],  // arms + core
            [0, 0, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],  // arms + body
            [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0],  // hands + waist
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],  // hip
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0],  // legs top
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0],  // legs
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0],  // legs
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // feet
        ];

        // Create grid
        this.createGrid();

        // Start sequence
        setTimeout(() => this.startSequence(), 800);
    }

    createGrid() {
        this.robotGrid.innerHTML = '';
        for (let y = 0; y < this.robotPattern.length; y++) {
            for (let x = 0; x < this.robotPattern[y].length; x++) {
                const pixel = document.createElement('div');
                pixel.className = 'pixel';
                pixel.dataset.x = x;
                pixel.dataset.y = y;
                pixel.dataset.value = this.robotPattern[y][x];
                this.robotGrid.appendChild(pixel);
                if (this.robotPattern[y][x] > 0) {
                    this.pixels.push({ el: pixel, x, y, value: this.robotPattern[y][x] });
                }
            }
        }
    }

    async typeText(text, speed = 50) {
        for (let char of text) {
            this.terminalOutput.textContent += char;
            await this.sleep(speed);
        }
        this.terminalOutput.textContent += '\n';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startSequence() {
        // Terminal boot sequence
        await this.typeText('> INITIALIZING ROBOT.EXE...', 30);
        await this.sleep(400);
        await this.typeText('> LOADING COMPONENTS...', 30);
        await this.sleep(300);
        await this.typeText('> BUILDING PIXEL MATRIX...', 30);
        await this.sleep(500);
        await this.typeText('', 0);

        // Build robot pixel by pixel
        await this.buildRobot();
    }

    async buildRobot() {
        // Sort pixels for assembly order (top to bottom, random within rows)
        const sortedPixels = [...this.pixels].sort((a, b) => {
            if (a.y !== b.y) return a.y - b.y;
            return Math.random() - 0.5;
        });

        let lastY = -1;
        let rowCount = 0;

        for (let i = 0; i < sortedPixels.length; i++) {
            const pixel = sortedPixels[i];

            // New row - add some terminal output
            if (pixel.y !== lastY) {
                lastY = pixel.y;
                rowCount++;
                if (rowCount % 4 === 0) {
                    this.terminalOutput.textContent += `> ROW ${pixel.y.toString().padStart(2, '0')} `;
                    await this.sleep(100);
                }
            }

            // Activate pixel with animation
            pixel.el.classList.add('active', `shade-${pixel.value}`);
            pixel.el.classList.add('building');

            // Vary the speed - faster as we go
            const baseDelay = Math.max(30, 80 - (i * 0.3));
            await this.sleep(baseDelay);

            pixel.el.classList.remove('building');

            // Terminal dots for progress
            if (i % 8 === 0 && rowCount % 4 === 0) {
                this.terminalOutput.textContent += '█';
            }
        }

        await this.sleep(300);
        await this.typeText('', 0);
        await this.typeText('> BUILD COMPLETE', 40);
        await this.sleep(400);
        await this.typeText('> ACTIVATING ROBOT...', 40);
        await this.sleep(600);

        this.activateRobot();
    }

    async activateRobot() {
        // Power up eyes
        this.robotGrid.classList.add('powered');
        await this.typeText('> POWER: ONLINE', 50);
        await this.sleep(400);

        // Blink test
        await this.typeText('> RUNNING DIAGNOSTICS...', 40);
        this.robotGrid.classList.add('blink');
        await this.sleep(200);
        this.robotGrid.classList.remove('blink');
        await this.sleep(300);
        this.robotGrid.classList.add('blink');
        await this.sleep(150);
        this.robotGrid.classList.remove('blink');
        await this.sleep(500);

        await this.typeText('> STATUS: OPERATIONAL', 40);
        await this.sleep(600);
        await this.typeText('> INITIATING PUNCH.EXE...', 40);
        await this.sleep(800);
        await this.typeText('> WARNING: SCREEN DAMAGE IMMINENT', 30);
        await this.sleep(500);

        this.prepareToBreak();
    }

    async prepareToBreak() {
        // Wind up
        this.container.querySelector('.terminal-frame').classList.add('wind-up');
        await this.sleep(1500);

        // PUNCH
        this.container.querySelector('.terminal-frame').classList.remove('wind-up');
        this.container.querySelector('.terminal-frame').classList.add('punch');

        await this.sleep(150);
        this.breakScreen();
    }

    async breakScreen() {
        // Flash
        this.container.classList.add('flash');
        await this.sleep(80);
        this.container.classList.remove('flash');

        // First impact
        this.crackOverlay.classList.add('cracked');
        document.body.classList.add('screen-shake');

        // Glitch effect
        this.robotGrid.classList.add('glitch');

        await this.sleep(150);
        document.body.classList.remove('screen-shake');

        // Second impact wave
        await this.sleep(200);
        this.crackOverlay.classList.add('cracked-more');
        document.body.classList.add('screen-shake-strong');
        this.container.classList.add('flash');
        await this.sleep(50);
        this.container.classList.remove('flash');

        await this.sleep(300);
        document.body.classList.remove('screen-shake-strong');
        this.robotGrid.classList.remove('glitch');

        // Third wave
        await this.sleep(200);
        this.crackOverlay.classList.add('shattered');
        document.body.classList.add('screen-shake');
        await this.sleep(200);
        document.body.classList.remove('screen-shake');

        // Robot settles
        await this.sleep(300);
        this.container.querySelector('.terminal-frame').classList.remove('punch');
        this.container.querySelector('.terminal-frame').classList.add('settle');

        // Terminal message
        await this.sleep(500);
        this.terminalOutput.textContent = '';
        await this.typeText('> PUNCH.EXE COMPLETE', 30);
        await this.typeText('> DAMAGE: CRITICAL', 30);
        await this.typeText('> :) JOKE COMPLETED', 100);

        // Fade out
        await this.sleep(5000);
        this.crackOverlay.classList.add('fade-out');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new PixelRobot();
});
