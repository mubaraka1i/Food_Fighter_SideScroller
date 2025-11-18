class ObstacleTracker {
    /**
     * Creates an Obstacle Tracker object that instantiates an empty array of ObstacleCreator objects.
     */
    constructor() {
        this.obstacles = [];
    }

    /**
     * @returns {Array} list of ObstacleCreator objects
     */
    getObstacles() {
        return this.obstacles;
    }

    /**
     * Resets the list of ObstacleCreator objects.
     */
    clearObstacles() {
        this.obstacles = [];
    }

    /**
     * Adds an obstacle to the end of the obstacles array.
     * 
     * @param {ObstacleCreator} obstacle obstacle to add to the array
     */
    addObstacle(obstacle) {
        this.obstacles.push(obstacle)
    }

    /**
     * Finds the index of an obstacle in the obstacles array.
     * 
     * @param {number} index location of the obstacle in obstacles array
     * @returns {number} index or -1 if not found
     */
    accessObstacle(index) {
        if (index > this.obstacles.length - 1) {
            return -1;
        }
        return this.obstacles[index]
    }

    /**
     * Draws the obstacle using two alternating colors.
     * 
     * @param {String} primaryColor: color to start filling the obstacles with
     * @param {String} secondaryColor: alternate color to fill obstacles with
     * @param {number} playerX: x coordinate of the player's top left corner
     * @param {number} screenWidth: width of the canvas
     */
    obstacleDraw(primaryColor, secondaryColor, playerX, screenWidth) {
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];
            let obsX = obstacle.topLeft[0];
            let obsY = obstacle.topLeft[1];
            let obsW = obstacle.width;
            let obsH = obstacle.height;
            
            // Check if obstacle is visible on screen (within camera view)
            if (obsX + obsW > playerX - screenWidth / 2 && obsX < playerX + screenWidth/2) {
                // Alternate between primary and secondary colors for visual variety
                let fillColor = i % 2 === 0 ? primaryColor : secondaryColor;
                push();
                noStroke();
                fill(fillColor);
                rect(obsX, obsY, obsW, obsH);
                pop();
            }
        }
    }
}