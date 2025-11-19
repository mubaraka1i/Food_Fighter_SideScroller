class PowerUpHitbox {
    /**
     * Creates a hitbox for a power up.
     * 
     * @param {number} x center x coordinate of the hitbox
     * @param {number} y center y coordinate of the hitbox
     * @param {number} r radius of the hitbox
     * @param {boolean} status true if active, false if not (UNUSED)
     * @param {number} effect 1-4, dictates effect of the power up
     */
    constructor(x, y, r, status, effect) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.status = status;
        this.effect = effect;
    }

    /**
     * @returns {number} center coordinate x
     */
    getPowerX() {
        return this.x;
    }

    /**
     * @returns {number} center coordinate y
     */
    getPowerY() {
        return this.y;
    }

    /**
     * @returns {number} radius of powerup
     */
    getPowerRadius() {
        return this.r;
    }

    /**
     * 
     * @returns {number} 1 (speed), 2 (health), 3 (protection), or 4 (damage)
     */
    getEffect() {
        return this.effect;
    }

    /**
     * Changes the center x value of the power up hitbox.
     * @param {number} newX new x value to set the coordinate to
     * @returns {number} newX
     */
    changePowerX(newX) {
        this.x = newX;
        return newX; 
    }

    /**
     * Changes the center y value of the power up hitbox.
     * @param {number} newY new y value to set the coordinate to
     * @returns {number} newY
     */
    changePowerY(newY) {
        this.y = newY;
        return newY; 
    }

    /**
    * Changes the radius value of the power up hitbox.
    * @param {number} newR new radius value to set the coordinate to
    * @returns {number} newR
    */
    changeRadius(newR) {
        this.r = newR;
        return newR; 
    }
    
    /**
     * Draws the power up to the screen.
     */
    drawHitBox() {
        // Calling the methods instead
        circle(this.getPowerX(), this.getPowerY(), this.getPowerRadius() * 2);
    }

    /**
     * Checks if a power up has collided with a player hitbox.
     * 
     * @param {ChefHitbox} playerHitbox object to check collision with the power up
     * @returns {boolean} true if hit, false if not
     */
    checkCollision(playerHitbox) {
        return playerHitbox.playerHitCircle(this.x, this.y, this.r);
    }

    /**
     * NOT YET IMPLEMENTED
     */
    activate() {
    }
}