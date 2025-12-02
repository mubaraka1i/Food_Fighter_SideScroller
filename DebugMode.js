class DebugMode {
    /**
     * Creates a object of the DebugMode class.
     */
    constructor() {
        this.active = false;
        this.keySequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
        this.currentSequence = [];
        this.debugText = "DEBUG MODE";
        
        // Debug toggles
        this.bossSpawnEnabled = true;
        this.flyingEnemiesEnabled = true;
        this.groundEnemiesEnabled = true;
        
        // Spawn control flags
        this.canSpawnBoss = true;
        this.canSpawnFlying = true;
        this.canSpawnGround = true;
        
        // Level jump flag
        this.canJumpLevels = true;
    }
    
    /**
     * Checks for debug mode activation sequence
     */
    checkSequence(key) {
        if (!this.active) {
            this.currentSequence.push(key);
            
            // Keep only the last 8 keys
            if (this.currentSequence.length > 8) {
                this.currentSequence.shift();
            }
            
            // Check if sequence matches
            if (this.currentSequence.length === 8) {
                let match = true;
                for (let i = 0; i < 8; i++) {
                    if (this.currentSequence[i] !== this.keySequence[i]) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    this.toggle();
                    this.currentSequence = []; // Reset sequence
                }
            }
        } else {
            // If already in debug mode, check for deactivation
            this.currentSequence.push(key);
            
            if (this.currentSequence.length > 8) {
                this.currentSequence.shift();
            }
            
            // Check if sequence matches for deactivation
            if (this.currentSequence.length === 8) {
                let match = true;
                for (let i = 0; i < 8; i++) {
                    if (this.currentSequence[i] !== this.keySequence[i]) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    this.toggle();
                    this.currentSequence = [];
                }
            }
        }
    }
    
    /**
     * Toggles debug mode on/off
     */
    toggle() {
        this.active = !this.active;
        console.log(`Debug mode ${this.active ? 'activated' : 'deactivated'}`);
        
        if (!this.active) {
            // Reset all toggles when exiting debug mode
            this.canSpawnBoss = true;
            this.canSpawnFlying = true;
            this.canSpawnGround = true;
            this.canJumpLevels = false;
        } else {
            this.canJumpLevels = true;
        }
    }
    
    /**
     * Handles debug mode key commands
     */
    handleKey(key) {
        if (!this.active) return;
        
        switch(key) {
            case 'b':
                this.canSpawnBoss = !this.canSpawnBoss;
                break;
            case 'f':
                this.canSpawnFlying = !this.canSpawnFlying;
                break;
            case 'g':
                this.canSpawnGround = !this.canSpawnGround;
                break;
            case '1':
                if (this.canJumpLevels && playInitiated) {
                    loadLevel(1);
                }
                break;
            case '2':
                if (this.canJumpLevels && playInitiated) {
                    loadLevel(2);
                }
                break;
            case '3':
                if (this.canJumpLevels && playInitiated) {
                    loadLevel(3);
                }
                break;
            case '4':
                if (this.canJumpLevels && playInitiated) {
                    loadLevel(4);
                }
                break;
            case '5':
                if (this.canJumpLevels && playInitiated) {
                    loadLevel(5);
                }
                break;
        }
    }
    
    /**
     * Draws debug mode information
     */
    draw() {
        if (this.active) {
            push();
            // Draw red debug text at top
            fill(255, 0, 0);
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER);
            text(this.debugText, width / 2, 30);
            
            // Draw debug status
            textSize(16);
            textAlign(LEFT);
            
            let yPos = 200;
            text(`Boss Spawning: ${this.canSpawnBoss ? 'ON' : 'OFF'}`, 20, yPos);
            yPos += 25;
            text(`Flying Enemies: ${this.canSpawnFlying ? 'ON' : 'OFF'}`, 20, yPos);
            yPos += 25;
            text(`Ground Enemies: ${this.canSpawnGround ? 'ON' : 'OFF'}`, 20, yPos);
            yPos += 25;
            text(`Level Jump: ${this.canJumpLevels ? 'ENABLED' : 'DISABLED'}`, 20, yPos);
            yPos += 25;
            text(`Current Level: ${currentLevel}`, 20, yPos);
            yPos += 25;
            text(`Player Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 20, yPos);
            
            pop();
        }
    }
    
    /**
     * Checks if enemies should spawn based on debug settings
     */
    shouldSpawnEnemies() {
        return this.active ? false : true; // If debug mode is active, no enemies spawn automatically
    }
    
    /**
     * Checks if specific enemy type should spawn
     */
    canSpawnEnemy(type) {
        if (!this.active) return true;
        
        switch(type) {
            case 'boss':
                return this.canSpawnBoss;
            case 'flying':
                return this.canSpawnFlying;
            case 'ground':
                return this.canSpawnGround;
            default:
                return false;
        }
    }
}