class Level5Layout {

   
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.primaryColor = '#F9E79F';
        this.secondaryColor = '#D4AC0D';
    }

    levelMaker(height, playerX, width) {
        this.obstacles.clearObstacles();

        const groundLevel = height;
        const platformHeight = 20;

       
        const makeMovingObstacle = (x, y, w, extraRange = 0) => {
            const minRange = 60;   
            const obstacle = new ObstacleCreator([x, y], w, platformHeight);

            obstacle.moving = true;
            obstacle.speed = 2;
            obstacle.direction = 1;

            // Movement bounds
            obstacle.minX = x - (minRange + extraRange);
            obstacle.maxX = x + (minRange + extraRange);

            this.obstacles.addObstacle(obstacle);
        };

       

        makeMovingObstacle( 600,  groundLevel - 90,  55,  10);
        makeMovingObstacle( 900,  groundLevel - 80,  70,  20);
        makeMovingObstacle(1200,  groundLevel - 100, 45,  15);
        makeMovingObstacle(1500,  groundLevel - 85,  75,  30);
        makeMovingObstacle(1850,  groundLevel - 95,  60,  10);
        makeMovingObstacle(2200,  groundLevel - 80,  50,  10);
        makeMovingObstacle(2550,  groundLevel - 90,  72,  20);
        makeMovingObstacle(2900,  groundLevel - 105, 40,  15);
        makeMovingObstacle(3250,  groundLevel - 88,  65,  20);
        makeMovingObstacle(3600,  groundLevel - 92,  50,  10);
        makeMovingObstacle(3950,  groundLevel - 85,  75,  30);
        makeMovingObstacle(4300,  groundLevel - 100, 55, 10);
        makeMovingObstacle(4650,  groundLevel - 90,  60, 15);
        makeMovingObstacle(5000,  groundLevel - 95,  70, 20);
        makeMovingObstacle(5350,  groundLevel - 88,  45, 10);
        makeMovingObstacle(5700,  groundLevel - 80,  65, 20);
        makeMovingObstacle(6050,  groundLevel - 100, 50, 15);
        makeMovingObstacle(6400,  groundLevel - 92,  75, 30);
    }

    updateMovement() {
        const list = this.obstacles.getObstacles();

        for (let obstacle of list) {
            if (!obstacle.moving) continue;

            
            obstacle.topLeft[0] += obstacle.speed * obstacle.direction;

            
            if (
                obstacle.topLeft[0] <= obstacle.minX ||
                obstacle.topLeft[0] + obstacle.width >= obstacle.maxX
            ) {
                obstacle.direction *= -1;
            }
        }
    }

    getObstacles() {
        return this.obstacles;
    }

    getRefHeight(circleX, height) {
        const list = this.obstacles.getObstacles();

        for (let obstacle of list) {
            const [x, y] = obstacle.topLeft;
            const w = obstacle.width;

            if (circleX >= x && circleX <= x + w) {
                return y - 25;
            }
        }
        return height - 50;
    }

    drawObstacles(playerX, width) {
        this.updateMovement();
        this.obstacles.obstacleDraw(
            this.primaryColor,
            this.secondaryColor,
            playerX,
            width
        );
    }
}
