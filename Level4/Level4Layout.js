class Level4Layout {
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.primaryColor = '#AED6F1'; // Light Blue (washing machine)
        this.secondaryColor = '#5D6D7E'; // Dark Grey (counter)
    }

    levelMaker(height, playerX, width) {
        this.obstacles.clearObstacles();
        
        const groundLevel = height;
        const platformHeight = 40;
        const machineHeight = 120; // Washing machines are taller

        // Series of counters and washing machines
        this.obstacles.addObstacle(new ObstacleCreator([800, groundLevel - machineHeight], 150, machineHeight));
        this.obstacles.addObstacle(new ObstacleCreator([950, groundLevel - platformHeight], 200, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1150, groundLevel - machineHeight], 150, machineHeight));
        
        // Gap
        
        this.obstacles.addObstacle(new ObstacleCreator([1500, groundLevel - platformHeight], 300, platformHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1800, groundLevel - machineHeight], 150, machineHeight));

        // Floating "shelf" platforms
        this.obstacles.addObstacle(new ObstacleCreator([2200, groundLevel - 250], 200, 30));
        this.obstacles.addObstacle(new ObstacleCreator([2500, groundLevel - 350], 200, 30));
        this.obstacles.addObstacle(new ObstacleCreator([2800, groundLevel - 250], 200, 30));

        // More counters
        this.obstacles.addObstacle(new ObstacleCreator([3200, groundLevel - platformHeight], 500, platformHeight));
        
        // Final long platform before boss
        this.obstacles.addObstacle(new ObstacleCreator([7000, groundLevel - platformHeight], 500, platformHeight));
    }

    getObstacles() {
        return this.obstacles;
    }

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

    drawObstacles(playerX, width) {
        this.obstacles.obstacleDraw(this.primaryColor, this.secondaryColor, playerX, width);
    }
}
