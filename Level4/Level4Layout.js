class Level4Layout {
    constructor() {
        this.obstacles = new ObstacleTracker();
        this.primaryColor = '#AED6F1';
        this.secondaryColor = '#5D6D7E';
    }

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
