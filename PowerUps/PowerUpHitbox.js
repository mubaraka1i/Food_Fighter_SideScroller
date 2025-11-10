class PowerUpHitbox {
    constructor(x, y, r, status, effect) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.status = status;
        this.effect = effect;
    }

    getPowerX() {
        return this.x;
    }

    getPowerY() {
        return this.y;
    }

    getPowerRadius() {
        return this.r;
    }

    getEffect() {
        return this.effect;
    }

    changePowerX(newX) {
        this.x = newX;
        return newX; 
    }

    changePowerY(newY) {
        this.y = newY;
        return newY; 
    }

    changeRadius(newR) {
        this.r = newR;
        return newR; 
    }
    
    drawHitBox() {
        circle(this.getPowerX, this.getPowerY, this.getPowerRadius * 2);
    }

    activate() {

    }
}