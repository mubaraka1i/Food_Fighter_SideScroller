class ObstacleCreator {
    constructor(bottomLeft, bottomRight, topRight, topLeft) {
        // each argument is an array of coordinate pairs formatted as: (x, y);
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
        this.topRight = topRight;
        this.topleft = topLeft;
    }

    getBottomLeft() {
        return this.bottomLeft;
    }

    getBottomRight() {
        return this.bottomRight;
    }
    
    getTopLeft() {
        return this.topLeft;
    }

    getTopRight() {
        return this.topRight;
    }
}