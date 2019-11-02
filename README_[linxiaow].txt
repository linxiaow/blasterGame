DIV BLASTER v1.0
----------------

This code is the basis for a simple 'asteroid blaster' game. It has the
following functionality:
- 2D ship movement
- "Fire-able rockets" that can destroy asteroids they collide with
- Asteroids that can be "spawned" based on user input, and fall vertically
- Score tracking
 -- Single-session scoring (clears on refresh)
 -- Score per asteroid is inversely proportional to size (smaller==harder==more points)


========  CONTROLS  ========

Arrow-Keys: move ship
Spacebar: fire rocket
Shift: spawn one additional asteroid

Functionality in the spec:
- Accuracy
- setPanel to open control pannel
- updatePanel to update parameter to a global value. check if the input is valid
- "trap door" which is KEY.L
- add state to record the state

Level 1:
-getRandom to return a random number
-gameStart to setAsteroid interval
-add asteroid rotation in createAstoroid()
-implement updateAcc to update rate whenever a hit or rocket out of the screen

Level 2:
-Add createShield functionality
-Add setShield to add/delete health
-Add fastAsteroid to record fast asteroid
-Add alert level to remind user of current level

Level 3:
- in createAsteroid, a fast asteroid aims at the spaceship
- add dual ship when enter level 3. fade in fade out

