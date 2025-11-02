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

    draw(strokeColor = 'black', fillColor = 'gray') {
        stroke(strokeColor);
        fill(fillColor);
        for (let obstacle of this.obstacles) {
            let x = obstacle.topLeft()[0];
            let y = obstacle.topLeft()[1];
            let w = obstacle.width;
            let h = obstacle.height;
            rect(x, y, w, h);
        }
    }
}