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
L: Manually create Asteroid

Functionality in the spec:
- General Requirement:
1: Accuracy: by changing #gwhAcc# varible by function #updateAcc()#
2: Setting panel: register callback function #setPanal()# in status windows (gwhStatus)
3: UPDTATE key: register a onSubmit callback #updatePanel(e)# to update parameter to variable #parameterOn  Update#. preventDefault to prevent refresh. check if the input is valid.
4: "trap door" which is KEY.L. Use a setInterval(line 291) to check level up. #alertLevel()# to update level
5: add #state# varible to record the state
6: game over: add Game over display in HTML. default set to non-display. show in function #loseLife# when there is no more life.
7.audio:
    7.1: Sounds are defaulted to be muted
    7.2: transition source: https://freesound.org/people/soneproject/sounds/346425/
    7.3: background source: https://freesound.org/people/joshuaempyre/sounds/251461/
    in HTML, add audio tag
8.score: level up too quick, in line 553, I give a proportion of 0.3

Level 1:
-getRandom to return a random number
-gameStart to setAsteroid interval
-add asteroid rotation in createAstoroid()
-implement updateAcc to update rate whenever a hit or rocket out of the screen
-add explosion effect in lose life
-change the starting point at line 677 for not being too left
-change the starting point in line 686

Level 2:
-Add createShield functionality
-Add setShield to add/delete health
-Add fastAsteroid to record fast asteroid
-Add alert level to remind user of current level

Level 3:
- in createAsteroid, a fast asteroid aims at the spaceship
- add dual ship when enter level 3. fade in fade out
- use a setInterval to smoothen the movement

Addition:
1. add health property. Show heart in the right top corner to indicates 2 points of health. Picture source: https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d

2. 