class Level1Background {
  /**
   * Creates the level 1 background to be drawn and moved.
   * 
   * @param {Object} img image object drawn to the background
   * @param {number} levelWidth width in pixels of the level layout
   */
  constructor(img, levelWidth) {
    this.levelWidth = levelWidth;
    this.img = img;
  }
  
  /**
   * Draws the background to the screen.
   * 
   * @param {number} cameraX player.currentX() - width / 2
   */
  draw(cameraX) {
    if (this.img) {
      let tilesNeeded = Math.ceil(this.levelWidth / this.img.width);
      
      for (let i = 0; i < tilesNeeded; i++) {
        let xPos = i * this.img.width;
        if (xPos + this.img.width > cameraX && xPos < cameraX + width) {
          image(this.img, xPos, 0, this.img.width, height);
        }
      }
    }
  }
}