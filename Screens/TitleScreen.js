class TitleScreen {
  constructor(type) { // type 0 or 1 - gameStart or gameOver
    this.type = type;
    if (this.type == 1) {
      this.visible = false;
    } else {
      this.visible = true;
    }
    this.curFrame = 0;
  }
  
  screenDraw(screen) {
    if (!this.visible) return; // do nothing if hidden

    this.curFrame = floor(frameCount / 10) % 2;
    let frameW = screen.width / 2;
    let frameH = screen.height;
    let curX = this.curFrame * frameW;
    let curY = 0;
    image(screen, 0, 0, width, height, curX, curY, frameW, frameH); 
  }
  
  screenRemove() {
    this.visible = false;
  }
}