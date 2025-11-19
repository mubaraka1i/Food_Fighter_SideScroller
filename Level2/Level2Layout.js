class Level2Layout {
    /**
     * Creates an obstacles array that can be used to add and draw obstacles.
     */
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.cookieColor = '#8B4513'; // Brown for cookies
        this.counterColor = '#D2B48C'; // Tan for counters
        this.applianceColor = '#A9A9A9'; // Gray for appliances
    }

    /**
     * @returns {ObstacleTracker} collection of obstacles in a level
     */
    getObstacles() {
        return this.obstacles;
    }

    /**
     * Gets the y value of an object if it collides with an obstacle in the ObstacleTracker.
     * 
     * @param {number} circleX x value of the circle an obstacle collides with
     * @param {number} height canvas height
     * @returns {number} new y value of an object
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
     * Adds all of the necessary obstacles to the obstacles array.
     * 
     * @param {number} height height of the canvas
     * @param {number} playerX x value of the player's top left corner
     * @param {number} width width of the canvas
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
     * Draws the obstacles to the screen.
     * 
     * @param {number} playerX x coordinate of the player's top left corner
     * @param {number} width canvas width
     */
    drawObstacles(playerX, width) {
        this.obstacles.obstacleDraw(this.cookieColor, this.counterColor, playerX, width);
    }
}