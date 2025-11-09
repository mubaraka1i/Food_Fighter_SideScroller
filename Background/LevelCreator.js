class LevelCreator {
    constructor(start, end, powerUps, enemy1, enemy2, bossTrigger, layout, height) {
        // start and end indicate the x coordinates where the level cannot scroll any further
        this.start = start;
        this.end = end;
        this.powerUps = powerUps; // amount of power ups
        this.enemy1 = enemy1; // amount of enemy type spawn points
        this.enemy2 = enemy2; // amount of enemy type spawn points
        this.layout = layout;
        this.height = height;

        this.bossTrigger = bossTrigger;
        this.reducedEnd = this.bossTrigger; // end accounts for the boss fight
        this.powerList = this.powerUpSpawn();
        this.enemy1List = this.enemy1Spawn(this.start, this.reducedEnd, this.enemy1);
        this.enemy2List = this.enemy2Spawn(this.start, this.reducedEnd, this.enemy2);

        // starts at the first threshold for enemies and power ups
        this.enemy1Curr = 0;
        this.enemy2Curr = 0;
        this.powerCurr = 0;
    }
    
    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    getPowerUps() {
        return this.powerUps;
    }

    getEnemy1() {
        return this.enemy1;
    }

    getEnemy2() {
        return this.enemy2;
    }

    powerUpSpawn() {
        let powerList = [];
        let possSpawns = this.powerUps * 2;
        let area = this.bossTrigger - this.start;
        let frequency = Math.floor(area / possSpawns);
        let random;
        let x;
        let y;
        for (let i = 1; i <= possSpawns; i+=2) {
            random = Math.random();
            if (random < 0.5) {
                x = frequency * i;
            } else {
                x = frequency * (i + 1);
            }
            let powerUp = new PowerUpHitbox(x, this.height - 50, 25);
            powerList.push(powerUp);
        }
        return powerList;
    }

    enemy1Spawn(start, end, spawns) {
        let enemy1List = [];
        let area = end - start;
        let threshold = Math.floor(area / spawns);
        for (let i = 1; i <= spawns; i++) {
            enemy1List.push(threshold * i)
        }
        return enemy1List;
    }

    enemy2Spawn(start, end, spawns) {
        let enemy2List = [];
        let area = end - start;
        let threshold = Math.floor(area / spawns);
        for (let i = 1; i <= spawns; i++) {
            enemy2List.push([threshold * (i + 0.5), true]); // format: x coordinate, active
        }
        return enemy2List;
    }

    enemy1Reached(playerX) {
        if (playerX >= this.enemy1List[this.enemy1Curr] && this.ememy1Curr + 1 < this.enemy1List.length) {
            this.enemy1Curr++;
            return true;
        } else {
            return false;
        }
    }

    enemy2Reached(playerX) {
        if (playerX >= this.enemy2List[this.enemy2Curr] && this.ememy2Curr + 1 < this.enemy2List.length) {
            this.enemy2Curr++;
            return true;
        } else {
            return false;
        }
    }

    powerUpReached(playerX) {
        let curr = this.powerList[powerCurr];
        if (playerX >= curr[0] && this.powerCurr + 1 < this.powerList.length) {
            this.powerCurr++;
            return true;
        } else {
            return false;
        }
    }

    drawPowerUp(x, y, d) {
        stroke('white');
        fill('purple')
        circle(x, y, d);
    }
}