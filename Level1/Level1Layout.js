class Level1Layout {
    /**
     * Creates an obstacles array that can be used to add and draw obstacles.
     */
    constructor() {
        this.obstacles = new ObstacleTracker(1);
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
        this.obstacles.addObstacle(new ObstacleCreator([907.3, height - 7.4], 28.4, 7.4));
        this.obstacles.addObstacle(new ObstacleCreator([935.7, height - 14], 28.4, 14));
        this.obstacles.addObstacle(new ObstacleCreator([964.1, height - 30], 35.7, 30));

        this.obstacles.addObstacle(new ObstacleCreator([1000, height - 43.1], 20, 43.1));
        this.obstacles.addObstacle(new ObstacleCreator([1020, height - 62], 23.1, 62));
        this.obstacles.addObstacle(new ObstacleCreator([1043.1, height - 78], 28.4, 78));
        this.obstacles.addObstacle(new ObstacleCreator([1071.5, height - 94], 35.7, 94));
        this.obstacles.addObstacle(new ObstacleCreator([1107.2, height - 110], 44.5, 110));
        this.obstacles.addObstacle(new ObstacleCreator([1151.7, height - 126], 28.4, 126));
        this.obstacles.addObstacle(new ObstacleCreator([1180.1, height - 142], 12.4, 142));
        this.obstacles.addObstacle(new ObstacleCreator([1192.5, height - 158], 12.4, 158));
        this.obstacles.addObstacle(new ObstacleCreator([1204.9, height - 174], 35.7, 174));
        this.obstacles.addObstacle(new ObstacleCreator([1240.6, height - 190], 12.4, 190));
        this.obstacles.addObstacle(new ObstacleCreator([1253, height - 206], 35.7, 206));
        this.obstacles.addObstacle(new ObstacleCreator([1288.7, height - 222], 28.4, 222));
        this.obstacles.addObstacle(new ObstacleCreator([1317.1, height - 238], 28.4, 238));
        this.obstacles.addObstacle(new ObstacleCreator([1345.5, height - 254], 28.4, 254));
        this.obstacles.addObstacle(new ObstacleCreator([1373.9, height - 270], 44.5, 270));
        this.obstacles.addObstacle(new ObstacleCreator([1418.4, height - 286], 12.4, 286));
        this.obstacles.addObstacle(new ObstacleCreator([1430.8, height - 302], 28.4, 302));
        this.obstacles.addObstacle(new ObstacleCreator([1459.2, height - 318], 28.4, 318));
        this.obstacles.addObstacle(new ObstacleCreator([1487.6, height - 334], 24.8, 334));
        this.obstacles.addObstacle(new ObstacleCreator([1512.4, height - 318], 28.4, 318));
        this.obstacles.addObstacle(new ObstacleCreator([1540.8, height - 302], 28.4, 302));
        this.obstacles.addObstacle(new ObstacleCreator([1569.2, height - 286], 12.4, 286));
        this.obstacles.addObstacle(new ObstacleCreator([1581.6, height - 270], 44.5, 270));
        this.obstacles.addObstacle(new ObstacleCreator([1626.1, height - 254], 28.4, 254));
        this.obstacles.addObstacle(new ObstacleCreator([1654.5, height - 238], 28.4, 238));
        this.obstacles.addObstacle(new ObstacleCreator([1682.9, height - 222], 28.4, 222));
        this.obstacles.addObstacle(new ObstacleCreator([1711.3, height - 206], 35.7, 206));
        this.obstacles.addObstacle(new ObstacleCreator([1747, height - 190], 12.4, 190));
        this.obstacles.addObstacle(new ObstacleCreator([1759.4, height - 174], 35.7, 174));
        this.obstacles.addObstacle(new ObstacleCreator([1795.1, height - 158], 12.4, 158));
        this.obstacles.addObstacle(new ObstacleCreator([1807.5, height - 142], 12.4, 142));
        this.obstacles.addObstacle(new ObstacleCreator([1819.9, height - 126], 28.4, 126));
        this.obstacles.addObstacle(new ObstacleCreator([1848.3, height - 110], 44.5, 110));
        this.obstacles.addObstacle(new ObstacleCreator([1892.8, height - 94], 35.7, 94));
        this.obstacles.addObstacle(new ObstacleCreator([1928.5, height - 78], 28.4, 78));
        this.obstacles.addObstacle(new ObstacleCreator([1956.9, height - 62], 23.1, 62));
        this.obstacles.addObstacle(new ObstacleCreator([1980, height - 43.1], 20, 43.1));

        this.obstacles.addObstacle(new ObstacleCreator([2000, height - 30], 35.7, 30));
        this.obstacles.addObstacle(new ObstacleCreator([2035.7, height - 14], 28.4, 14));
        this.obstacles.addObstacle(new ObstacleCreator([2064.1, height - 7.4], 28.4, 7.4));
    }

    /**
     * Draws the obstacles to the screen.
     * 
     * @param {number} playerX x coordinate of the player's top left corner
     * @param {number} width canvas width
     */
    drawObstacles(playerX, width) {
        this.obstacles.obstacleDraw("black", "gray", playerX, width);
    }

}