class Level3Layout {
    /**
     * Creates an obstacles array that can be used to add and draw obstacles.
     */
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.primaryColor = '#ffffffff'; 
        this.secondaryColor = '#f15151ff'; 
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
            // Proper collision detection
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
        
        // Starting platform
        this.obstacles.addObstacle(new ObstacleCreator([800, groundLevel - platformHeight], 200, platformHeight));
        
        // First gap with safety platform below
        this.obstacles.addObstacle(new ObstacleCreator([1100, groundLevel - 110], 150, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1050, groundLevel - 60], 100, platformHeight)); // Safety platform
        
        // Gradual upward progression with overlapping platforms
        this.obstacles.addObstacle(new ObstacleCreator([1300, groundLevel - 160], 200, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1250, groundLevel - 110], 100, platformHeight)); // Step-up platform
        
        // Wide rest area
        this.obstacles.addObstacle(new ObstacleCreator([1600, groundLevel - 210], 300, platformHeight));
        
        // Ascending section with safety nets
        this.obstacles.addObstacle(new ObstacleCreator([2000, groundLevel - 130], 120, 40));
        this.obstacles.addObstacle(new ObstacleCreator([1950, groundLevel - 90], 80, 40)); // Step platform
        
        this.obstacles.addObstacle(new ObstacleCreator([2150, groundLevel - 190], 120, 40));
        this.obstacles.addObstacle(new ObstacleCreator([2100, groundLevel - 150], 80, 40)); // Step platform
        
        this.obstacles.addObstacle(new ObstacleCreator([2300, groundLevel - 250], 120, 40));
        this.obstacles.addObstacle(new ObstacleCreator([2250, groundLevel - 210], 80, 40)); // Step platform
        
        // Safety platform below section
        this.obstacles.addObstacle(new ObstacleCreator([1900, groundLevel - 70], 600, 30));
        
        // Big recovery platforms
        this.obstacles.addObstacle(new ObstacleCreator([2600, groundLevel - 160], 400, platformHeight));
        
        this.obstacles.addObstacle(new ObstacleCreator([3100, groundLevel - 260], 400, platformHeight));
        
        this.obstacles.addObstacle(new ObstacleCreator([3600, groundLevel - 210], 400, platformHeight));
        
        this.obstacles.addObstacle(new ObstacleCreator([4100, groundLevel - 160], 400, platformHeight));
        
        
        
        // Final approach - wide connected platforms
        this.obstacles.addObstacle(new ObstacleCreator([5100, groundLevel - 110], 400, platformHeight));
        
        this.obstacles.addObstacle(new ObstacleCreator([5600, groundLevel - 160], 400, platformHeight));
    }

    /**
     * Draws the obstacles to the screen.
     * 
     * @param {number} playerX x coordinate of the player's top left corner
     * @param {number} width canvas width
     */
    drawObstacles(playerX, width) {
        this.obstacles.obstacleDraw(this.primaryColor, this.secondaryColor, playerX, width);
    }
}