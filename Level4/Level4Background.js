class Level4Background {
  /**
   * Creates the level 4 background to be drawn and moved.
   * 
   * @param {Object} img image object drawn to the background
   * @param {number} levelWidth width in pixels of the level layout
   */
  constructor(img, levelWidth) {
    this.levelWidth = levelWidth;
    this.img = img;
  }
  
  draw(cameraX) {
    if (this.img) {
      // Calculate how many times to draw the image to cover the entire level width
      let tilesNeeded = Math.ceil(this.levelWidth / this.img.width);
      
      for (let i = 0; i < tilesNeeded; i++) {
        let xPos = i * this.img.width;
        // Only draw tiles that are visible on screen
        if (xPos + this.img.width > cameraX && xPos < cameraX + width) {
          // Draw the image full height and width
          image(this.img, xPos, 0, this.img.width, height);
          }
      }
    }
  }
}
