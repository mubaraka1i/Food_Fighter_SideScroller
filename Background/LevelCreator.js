class levelCreator {
    constructor(start, end, powerUps, enemy1, enemy2) {
        // start and end indicate the x coordinates where the level cannot scroll any further
        this.start = start;
        this.end = end;
        this.powerUps = powerUps; // amount of power ups
        this.enemy1 = enemy1; // amount of enemy type spawn points
        this.enemy2 = enemy2; // amount of enemy type spawn points

        this.bossTrigger = this.bossThreshold(start, end);
        this.reducedEnd = end - bossTrigger; // end accounts for the boss fight
        this.powerList = this.powerUpSpawn(start, reducedEnd, this.powerUps);
        this.enemy1List = this.enemy1(start, reducedEnd, this.enemy1);
        this.enemy2List = this.enemy2(start, reducedEnd, this.enemy2);

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

    bossThreshold(start, end) {
        let area = end - start;
        return area * 0.95;
    }
    powerUpSpawn(start, end, spawns) {
        let powerList = [];
        let possSpawns = spawns * 2;
        let area = end - start;
        let frequency = floor(area / possSpawns);
        let random;
        for (let i = 1; i <= frequency; i+=2) {
            random = random();
            if (random < 0.5) {
                powerList.push(frequency * i);
            } else {
                powerList.push(frequency * (i + 1));
            }
        }
        return powerList;
    }

    enemy1(start, end, spawns) {
        let enemy1List = [];
        let area = end - start;
        let threshold = floor(area / spawns);
        for (let i = 1; i <= spawns; i++) {
            enemy1List.push(threshold * i)
        }
        return enemy1List;
    }

    enemy1(start, end, spawns) {
        let enemy2List = [];
        let area = end - start;
        let threshold = floor(area / spawns);
        for (let i = 1; i <= spawns; i++) {
            enemy2List.push([threshold * (i + 0.5), true]); // format: x coordinate, active
        }
        return enemy2List;
    }

    enemy1Reached(playerX) {
        if (playerX >= enemy1List[this.enemy1Curr] && ememy1Curr + 1 < this.enemy1List.length) {
            enemy1Curr++;
            return true;
        } else {
            return false;
        }
    }

    enemy2Reached(playerX) {
        if (playerX >= enemy2List[this.enemy2Curr] && ememy2Curr + 1 < this.enemy2List.length) {
            enemy2Curr++;
            return true;
        } else {
            return false;
        }
    }

    powerUpReached(playerX) {
        if (playerX >= this.powerCurr && this.powerCurr + 1 < this.powerList.length) {
            this.powerCurr++;
            return true;
        } else {
            return false;
        }
    }
}