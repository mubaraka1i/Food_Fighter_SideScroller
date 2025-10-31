class Level1Background {
    constructor(){

        this.img = null;
        this.loaded = false;
    }

    preload(){

        this.img = loadImage('Assets/Kitchen1.png'); // Loading in the Kitchen background

    }

    draw(cameraX){

        if (!this.img) // Checking if image loaded in
            return;


        let scaleX = width / 1600 // How wide the image is (stretching hortizontally)
        let scaleY = height / 912 // How tall the image is (at max dont adjust)


        let bgX = -cameraX % 3200; //Where background should start

        if (bgX>0) bgX-=3200; // Camera starting off at left side of screen

        for (let i = 0; i < 5; i++) { // draws 3 copies of the kitchen sprite (back to back horizontally)
        let screenX = bgX + (i * 3200 * scaleX); // Moving through kitchen bg placing each copy next to other
        image(this.img, screenX, 0, 3200 * scaleX, 912 * scaleY); // Draws kitchen at certain spots

        }
    }
}