class Level2Layout {

    constructor() {
        this.obstacles = new ObstacleTracker();
        this.cookieColor = '#8B4513'; // Brown
        this.counterColor = '#D2B48C'; // Tan
    }

    levelMaker(height, playerX, width) {
        // Create a series of "cookie" platforms to jump on
        // A low cookie
        this.obstacles.addObstacle(new ObstacleCreator([900, height - 50], 100, 50));
        
        // A higher cookie
        this.obstacles.addObstacle(new ObstacleCreator([1100, height - 100], 100, 50));

        // A "counter" platform
        this.obstacles.addObstacle(new ObstacleCreator([1300, height - 200], 250, 50));

        // More cookies
        this.obstacles.addObstacle(new ObstacleCreator([1600, height - 120], 80, 40));
        this.obstacles.addObstacle(new ObstacleCreator([1700, height - 180], 80, 40));
        this.obstacles.addObstacle(new ObstacleCreator([1800, height - 240], 80, 40));

        // Another big counter
        this.obstacles.addObstacle(new ObstacleCreator([2100, height - 150], 400, 50));
        
        // Fridge platform (tall)
        this.obstacles.addObstacle(new ObstacleCreator([2800, height - 350], 150, 50));
        
        // More platforms...
        this.obstacles.addObstacle(new ObstacleCreator([3200, height - 100], 200, 50));
        this.obstacles.addObstacle(new ObstacleCreator([3500, height - 200], 200, 50));
        this.obstacles.addObstacle(new ObstacleCreator([3800, height - 300], 200, 50));

        // Final counter before boss
        this.obstacles.addObstacle(new ObstacleCreator([6000, height - 200], 500, 50));


        // Draw them with cookie/counter colors
        this.obstacles.obstacleDraw(this.cookieColor, this.counterColor, playerX, width);
    }

    getObstacles() {
        return this.obstacles;
    }
}
