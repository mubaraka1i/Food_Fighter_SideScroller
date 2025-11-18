class ObstacleCreator {
    /**
     * Creates an object of the ObstacleCreator class which sets the coordinates of the obstacle.
     * 
     * @param {Array} topLeft (x, y) number coordinates top left corner obstacle 
     * @param {number} width horizontal distance of the obstacle
     * @param {number} height vertical distance of the obstacle
     */
    constructor(topLeft, width, height) {
        this.topLeft = topLeft; // formatted as: (x, y);
        this.width = width;
        this.height = height;
    }

    /**
     * @returns {Array} (x, y) number coordinates top left corner obstacle 
     */
    getTopLeft() {
        return this.topLeft
    }
    
    /**
     * @returns {number} width horizontal distance of the obstacle
     */
    getWidth() {
        return this.width;
    }

    /**
     * @returns {number} vertical distace of the obstacle
     */
    getHeight() {
        return this.height;
    }
}