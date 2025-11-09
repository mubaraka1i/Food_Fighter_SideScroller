class ObstacleTracker {
    constructor() {
        // creates an empty array of all the obtacles in a level
        this.obstacles = [];
    }

    addObstacle(obstacle) {
        // obstacle must be an ObstacleCreator object
        // obstacle is added to the end of the array
        this.obstacles.push(obstacle)
    }

    accessObstacle(index) {
        // returns -1 if index not found
        if (index > this.obstacles.length - 1) {
            return -1;
        }
        return this.obstacles[index]
    }

    getObstacles() {
        return this.obstacles;
    }

    obstacleDraw(primaryColor, secondaryColor, playerX, screenWidth) {
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];
            let x = obstacle.topLeft[0];
            let y = obstacle.topLeft[1];
            let w = obstacle.width;
            let h = obstacle.height;
            
            // Check if obstacle is visible on screen (within camera view)
            if (x + w > playerX - screenWidth/2 && x < playerX + screenWidth/2) {
                // Alternate between primary and secondary colors for visual variety
                let fillColor = i % 2 === 0 ? primaryColor : secondaryColor;
                
                push();
                noStroke();
                fill(fillColor);
                rect(x, y, w, h);
                pop();
            }
        }
    }

    clearObstacles() {
        this.obstacles = [];
    }
}