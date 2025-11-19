class Level4Layout {
    /**
     * Creates an obstacles array that can be used to add and draw obstacles.
     */
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.primaryColor = '#AED6F1';
        this.secondaryColor = '#5D6D7E';
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
            if (circleX >= obstacleX && circleX <= obstacleX + obstacleWidth) {
                return topLeft[1] - 25; 
            }
        }
        return height - 50;
    }

    /**
     * Adds all of the necessary obstacles to the obstacles array.
     * 
     * @param {number} height height of the canvas
     * @param {number} playerX x value of the player's top left corner
     * @param {number} width width of the canvas
     */
    levelMaker(height, playerX, width) {
        this.obstacles.clearObstacles();

        const groundLevel = height;

        const platformWidth = 50;
        const platformHeight = 20;

        let baseY = groundLevel - 90;  
        let x = 400;

        let stepToggle = 0;

        
        const gapPattern = [2, 4, 3, 5];
        let patternIndex = 0;
        let obstaclesPlacedInRun = 0;

        while (x < 6950) {

            
            if (obstaclesPlacedInRun >= gapPattern[patternIndex]) {
                
                x += 150; 
                
                
                obstaclesPlacedInRun = 0;
                patternIndex = (patternIndex + 1) % gapPattern.length;

                continue; 
            }

            
            let y = baseY;

            if (stepToggle === 0) {
                y = baseY - 10;
            } else if (stepToggle === 1) {
                y = baseY;
            } else if (stepToggle === 2) {
                y = baseY + 15;
            } else {
                y = baseY;
                stepToggle = -1;
            }

            stepToggle++;

            
            this.obstacles.addObstacle(
                new ObstacleCreator([x, y], platformWidth, platformHeight)
            );

            obstaclesPlacedInRun++;

            x += 150;
        }
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
