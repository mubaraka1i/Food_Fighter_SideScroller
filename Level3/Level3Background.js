class Level1Background {
  constructor() {
    this.levelWidth = 7000;
    this.img = null;
  }
  
  preload() {
    this.img = loadImage('Assets/Kitchen3.png');
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