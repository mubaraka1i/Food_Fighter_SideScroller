/**
 * Checks the collisions of player-enemy, player-minion, bullet-enemy, bullet-minion, projectile-player, and bullet-boss.
 * @returns {undefined} exit if boss health is 0 and go to next level
 */
function checkCollisions() {
  const bullets = playerShoots.getBullets();
  const playerHB = playerHitbox;

  // Loop through all enemies backwards
  for (let i = enemiesArray.length - 1; i >= 0; i--) {
    const enemy = enemiesArray[i];
    const enemyHB = enemy.getHitbox();

    // Check Player-Enemy Collision 
    if (enemy instanceof GroundEnemies) {
      if (playerHB.playerHitRect(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h)) {
        // Only take damage if shield is NOT active
        if (!player.shieldActive) {
          player.takeDamage();
          health.healthDec(10);
          gameStats.damageTaken += 10; // TRACK DAMAGE TAKEN
        }
        enemiesArray.splice(i, 1);
        gameStats.enemiesKilled++;
        continue;
      }
    } else if (enemy instanceof FlyingEnemies) {
      if (playerHB.playerHitCircle(enemyHB.x, enemyHB.y, enemyHB.r)) {
        // Only take damage if shield is NOT active
        if (!player.shieldActive) {
          player.takeDamage();
          health.healthDec(10);
          gameStats.damageTaken += 10; // TRACK DAMAGE TAKEN
        }
        enemiesArray.splice(i, 1);
        gameStats.enemiesKilled++;
        continue;
      }
    }
    
    // MINION COLLISION DETECTION
    else if (enemy instanceof CookieCrumbMinion || enemy instanceof NachoCrumbleMinion || 
             enemy instanceof SodaMinion || enemy instanceof CakeMinion) {
      // Player collision with minion
      if (playerHB.playerHitCircle(enemyHB.x, enemyHB.y, enemyHB.r || enemyHB.w/2)) {
        // Only take damage if shield is NOT active
        if (!player.shieldActive) {
          player.takeDamage();
          health.healthDec(5); // Less damage than regular enemies
          gameStats.damageTaken += 5; // TRACK DAMAGE TAKEN
        }
        enemiesArray.splice(i, 1); // Remove minion on contact
        gameStats.enemiesKilled++;
        continue;
      }
    }

    // Check Bullet-Enemy Collision 
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (!bullets[j]) continue; 
      
      const bullet = bullets[j];
      
      let hit = false;
      let isMinion = false;
      
      if (enemy instanceof GroundEnemies) {
        hit = collideRectCircle(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h, bullet.x, bullet.y, bullet.size);
      } else if (enemy instanceof FlyingEnemies) {
        hit = collideCircleCircle(enemyHB.x, enemyHB.y, enemyHB.r * 2, bullet.x, bullet.y, bullet.size);
      }
      // MINION BULLET COLLISION
      else if (enemy instanceof CookieCrumbMinion || enemy instanceof NachoCrumbleMinion || 
          enemy instanceof SodaMinion || enemy instanceof CakeMinion) {
        isMinion = true;
        hit = collideCircleCircle(
          enemyHB.x, enemyHB.y, (enemyHB.r || enemyHB.w/2) * 2,
          bullet.x, bullet.y, bullet.size
        );
        
        if (hit) {
          enemy.takeDamage(1); // Minions have takeDamage method
          bullets[j].hasHit = true; 
          bullets.splice(j, 1);
          gameStats.shotsHit++;
          gameStats.damageDone += 1;
          if (enemy.health <= 0) {
            enemiesArray.splice(i, 1);
            gameStats.enemiesKilled++;
          }
          break; 
        }
      }

      // Regular enemies (not minions) get destroyed immediately
      if (hit && !isMinion) {
        enemiesArray.splice(i, 1);
        gameStats.enemiesKilled++;
        gameStats.shotsHit++;
        gameStats.damageDone += 1;
        bullets[j].hasHit = true; 
        bullets.splice(j, 1);
        break; 
      }
    }
  }
  
  // Check BOSS Collisions 
  if (boss !== null && !boss.isSlidingIn()) {
    const bossHB = boss.getHitbox();
    // Check Player vs Boss
    if (playerHB.playerHitRect(bossHB.x, bossHB.y, bossHB.w, bossHB.h)) {
      // Only take damage if shield is NOT active
      if (!player.shieldActive) {
        player.takeDamage();
        health.healthDec(1);
        gameStats.damageTaken += 1; // TRACK DAMAGE TAKEN FROM BOSS
      }
    }

    // Check Player Bullets vs Boss
    for (let j = bullets.length - 1; j >= 0; j--) {
      const bullet = bullets[j];
      if (collideRectCircle(bossHB.x, bossHB.y, bossHB.w, bossHB.h, bullet.x, bullet.y, bullet.size)) {
        boss.takeDamage(1);
        bullets[j].hasHit = true; 
        bullets.splice(j, 1);
        gameStats.shotsHit++; // TRACK BOSS HIT
        gameStats.damageDone += 1; // TRACK BOSS DAMAGE
        
        if (boss.getHealth() <= 0) {
          bossActive = false;
          gameStats.enemiesKilled++;
          boss = null;
          goToNextLevel();
          return;
        }
      }
    }

    // Check Boss Projectiles vs Player
    const bossProjectiles = boss.getProjectiles();
    for (let k = bossProjectiles.length - 1; k >= 0; k--) {
      const projectile = bossProjectiles[k];
      const projHB = projectile.getHitbox();
      
      if (projHB && playerHB.playerHitCircle(projHB.x, projHB.y, projHB.r)) {
        // Only take damage if shield is NOT active
        if (!player.shieldActive) {
          player.takeDamage();
          health.healthDec(1);
          gameStats.damageTaken += 1; // TRACK DAMAGE FROM BOSS PROJECTILES
        }
        bossProjectiles.splice(k, 1);
      }
    }
  }
}