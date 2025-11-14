class ObstacleCreator {
    /**
     * Creates an object of the ObstacleCreator class which sets the coordinates of the obstacle.
     * @param {[number]} topLeft: top left corner coordinates of the obstacle 
     * @param {number} width: horizontal distance of the obstacle
     * @param {number} height: vertical distance of the obstacle
     */
    constructor(topLeft, width, height) {
        this.topLeft = topLeft; // formatted as: (x, y);
        this.width = width;
        this.height = height;
    }

    getTopLeft() {
        return this.topLeft
    }
    
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}