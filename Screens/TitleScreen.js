class TitleScreen {
  /**
   * Creates a title screen to be drawn to the screen if game not started.
   * 
   * @param {number} type 0, 1, or 2 - gameStart, gameOver, or tutorial
   */
  constructor(type) {
    this.type = type;
    if (this.type == 1) {
      this.visible = false;
    } else {
      this.visible = true;
    }
    this.curFrame = 0;
  }
  
  /**
   * Draws the title image to the screen.
   * @param {Image} screen image object that gets drawn on the screen
   * @returns {undefined} early exit if not visisble
   */
  screenDraw(screen) {
    if (!this.visible) return;
    
    if (this.type == 2) {
      // Just display normally (one frame) for tutorial
      image(screen, 0, 0, width, height);
    } else {
      this.curFrame = floor(frameCount / 10) % 2;
      let frameW = screen.width / 2;
      let frameH = screen.height;
      let curX = this.curFrame * frameW;
      let curY = 0;
      image(screen, 0, 0, width, height, curX, curY, frameW, frameH);
    }
  }
  
  /**
   * Sets the screen's visibility to false.
   */
  screenRemove() {
    this.visible = false;
  }
}