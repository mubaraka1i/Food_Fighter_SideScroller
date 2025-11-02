class ObstacleCreator {
    constructor(topLeft, width, height) {
        // each argument is an array of coordinate pairs formatted as: (x, y);
        this.topLeft = topLeft; //was assigning to itself
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