class Level3Layout {
    constructor() {
        this.obstacles = new ObstacleTracker();
        //these are filler colors pick whatever u want bebo
        this.color1 = '#FFD700'; // Gold
        this.color2 = '#FF6347'; // Tomato
    }

    levelMaker(height, playerX, width) {
        // Add placeholder obstacles for level 3
        this.obstacles.addObstacle(new ObstacleCreator([1000, height - 100], 200, 50));
        this.obstacles.addObstacle(new ObstacleCreator([1300, height - 200], 200, 50));
        this.obstacles.addObstacle(new ObstacleCreator([1600, height - 100], 200, 50));
        
        //this.obstacles.obstacleDraw(this.color1, this.color2, playerX, width);
    }

    getObstacles() {
        return this.obstacles;
    }

    drawObstacles(playerX, width) {
        //put in the colors from the constructor
        this.obstacles.obstacleDraw(this.color1, this.color2, playerX, width);
    }
}