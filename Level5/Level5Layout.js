class Level5Layout {
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.primaryColor = '#E6B0AA'; // Pinkish (icing)
        this.secondaryColor = '#AF601A'; // Brown (cake/bread)
    }

    levelMaker(height, playerX, width) {
        this.obstacles.clearObstacles();
        
        const groundLevel = height;
        const tableHeight = 100;
        const shelfHeight = 30;

        // Long starting table
        this.obstacles.addObstacle(new ObstacleCreator([500, groundLevel - tableHeight], 800, tableHeight));

        // Floating "shelf" platforms
        this.obstacles.addObstacle(new ObstacleCreator([1500, groundLevel - 200], 250, shelfHeight));
        this.obstacles.addObstacle(new ObstacleCreator([1800, groundLevel - 300], 250, shelfHeight));
        this.obstacles.addObstacle(new ObstacleCreator([2100, groundLevel - 200], 250, shelfHeight));
        
        // Another long table
        this.obstacles.addObstacle(new ObstacleCreator([2500, groundLevel - tableHeight], 1000, tableHeight));
        
        // Series of small platforms
        this.obstacles.addObstacle(new ObstacleCreator([3800, groundLevel - 150], 100, shelfHeight));
        this.obstacles.addObstacle(new ObstacleCreator([4000, groundLevel - 200], 100, shelfHeight));
        this.obstacles.addObstacle(new ObstacleCreator([4200, groundLevel - 150], 100, shelfHeight));
        
        // Final large "cake" platform before boss
        this.obstacles.addObstacle(new ObstacleCreator([7000, groundLevel - tableHeight], 500, tableHeight));
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
