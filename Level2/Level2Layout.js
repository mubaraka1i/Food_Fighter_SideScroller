class Level2Layout {

    /**
     * 
     */
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.cookieColor = '#8B4513'; // Brown for cookies
        this.counterColor = '#D2B48C'; // Tan for counters
        this.applianceColor = '#A9A9A9'; // Gray for appliances
    }

    /**
     * 
     * @param {Int} height 
     * @param {Int} playerX 
     * @param {Int} width 
     */
    levelMaker(height, playerX, width) {
        // Clear any existing obstacles first
        this.obstacles.clearObstacles();
        
        const groundLevel = height;
        const platformHeight = 50;
        
        
        this.obstacles.addObstacle(new ObstacleCreator([800, groundLevel - platformHeight], 200, platformHeight));
        
        // First small gap with safety platform below
        this.obstacles.addObstacle(new ObstacleCreator([1100, groundLevel - 100], 150, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1050, groundLevel - 50], 100, platformHeight)); // Safety platform
        
        // Gradual upward progression with overlapping platforms
        this.obstacles.addObstacle(new ObstacleCreator([1300, groundLevel - 150], 200, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1250, groundLevel - 100], 100, platformHeight)); // Step-up platform
        
        // Counter area with wide platforms
        this.obstacles.addObstacle(new ObstacleCreator([1600, groundLevel - 200], 300, platformHeight));
        
        // Cookie platforms with safety nets - overlapping pattern
        this.obstacles.addObstacle(new ObstacleCreator([2000, groundLevel - 120], 120, 40));
        this.obstacles.addObstacle(new ObstacleCreator([1950, groundLevel - 80], 80, 40)); // Step platform
        this.obstacles.addObstacle(new ObstacleCreator([2150, groundLevel - 180], 120, 40));
        this.obstacles.addObstacle(new ObstacleCreator([2100, groundLevel - 140], 80, 40)); // Step platform
        this.obstacles.addObstacle(new ObstacleCreator([2300, groundLevel - 240], 120, 40));
        this.obstacles.addObstacle(new ObstacleCreator([2250, groundLevel - 200], 80, 40)); // Step platform
        
        // Safety platform below cookie section in case player falls
        this.obstacles.addObstacle(new ObstacleCreator([1900, groundLevel - 60], 600, 30));
        
        // Big counter area for recovery
        this.obstacles.addObstacle(new ObstacleCreator([2600, groundLevel - 150], 400, platformHeight));
        
        this.obstacles.addObstacle(new ObstacleCreator([3100, groundLevel - 250], 400, platformHeight)); // Extended width
        this.obstacles.addObstacle(new ObstacleCreator([3600, groundLevel - 200], 400, platformHeight)); // Extended width
        this.obstacles.addObstacle(new ObstacleCreator([4100, groundLevel - 150], 400, platformHeight)); // Extended width
        this.obstacles.addObstacle(new ObstacleCreator([4600, groundLevel - 100], 400, platformHeight)); // Extended width
        
        // Final approach to boss - wide connected platforms
        this.obstacles.addObstacle(new ObstacleCreator([5100, groundLevel - 100], 400, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([5600, groundLevel - 150], 400, platformHeight));
        

    }

    /**
     * 
     * @returns 
     */
    getObstacles() {
        return this.obstacles;
    }

    /**
     * 
     * @param {Int} circleX 
     * @param {*} height 
     * @returns 
     */
    getRefHeight(circleX, height) {
        let obstacleList = this.obstacles.getObstacles();
        for (let obstacle of obstacleList) {
            let topLeft = obstacle.getTopLeft();
            let obstacleX = topLeft[0];
            let obstacleWidth = obstacle.getWidth();
            // Check if circleX is within the obstacle's horizontal range
            if (circleX >= obstacleX && circleX <= obstacleX + obstacleWidth) {
                return topLeft[1] - 25; // Place powerup on top of obstacle
            }
        }
        return height - 50; // Default to ground level
    }

    /**
     * 
     * @param {*} playerX 
     * @param {*} width 
     */
    drawObstacles(playerX, width) {
        this.obstacles.obstacleDraw(this.cookieColor, this.counterColor, playerX, width);
    }
}