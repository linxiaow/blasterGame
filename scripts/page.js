////  Page-scoped globals  ////

// Counters
var rocketIdx = 1;
var asteroidIdx = 1;
var fastAsteroid = [];
var shieldIdx = 1;

/*var isKeyUp = true;*/

var curMove = 0;

// Size Constants
var MAX_ASTEROID_SIZE = 50;
var MIN_ASTEROID_SIZE = 15;
var ASTEROID_SPEED = 5;
var ROCKET_SPEED = 10;
var SHIP_SPEED = 25;
var OBJECT_REFRESH_RATE = 50;  //ms
var SCORE_UNIT = 100;  // scoring is in 100-point units

// Size vars
var maxShipPosX, maxShipPosY;

// Global Window Handles (gwh__)
var gwhGame, gwhOver, gwhStatus, gwhScore, gwhAcc, gwhLife, gwhSplash, gwhLevel, gwhShield, gwhExplode;

var introMusic, overMusic, explodeMusic, transMusic, backMusic, rocketMusic;

// Global Object Handles
var ship;
var asteroid_interval;
var level;
var rotation;
var hitNum;
var shield_exist;
var M;
var isDual;

var parameterOnUpdate = {
  //handle on update
  spawn: 1,
  isMute: true,
  life: 2,
  isShield: false
}

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
var KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32,
  L: 76
}

var STATE = {
  initial: 0,
  game_over: 1,
  running: 2
}


/*
var LEVEL = {
  first: false,
  second: false,
  third: false
}*/


////  Functional Code  ////

// Main
$(document).ready( function() {
  console.log("Ready!");
  introMusic = $('audio#intro')[0];
  overMusic =  $('audio#over')[0];
  explodeMusic = $('audio#explode')[0];
  transMusic = $('audio#transition')[0];
  backMusic = $('audio#background')[0];
  rocketMusic = $('audio#rocket')[0];
  //$('audio#intro')[0].play();
  // Set global handles (now that the page is loaded)
  gwhGame = $('.game-window');
  gwhOver = $('.game-over');
  gwhStatus = $('.status-window');
  gwhScore = $('#score-box');
  ship = $('#enterprise');  // set the global ship handle
  gwhLife = $('#health');
  //TODO: add self-designed global handles:
  gwhSplash = $('#splash');
  state = STATE.initial;
  gwhAcc = $('#acc-box');
  gwhLevel= $('#level-up');
  gwhShield = $('#shield_wear');
  gwhExplode = $('#explosion');
  level = 1;
  rotation = 0;
  hitNum = 0;
  shield_exist = false;
  M = 10;
  isDual = false;
  SHIP_SPEED = 1; //change ship speed
  //END OF TODO

  // Set global positions
  maxShipPosX = gwhGame.width() - ship.width();
  maxShipPosY = gwhGame.height() - ship.height();
  $(window).keydown(keydownRouter);
  $(window).keyup(keyupRouter);
  //$(window).keydown(moveShip);
  //$(window).keydown(fireRocket);
  //$(window).keydown(createAsteroid);
  //$('#ship-dual').hide();

  //TODO: register global listeners
  $('#set-panel').click(setPanel);
  $('#set-box').submit(updatePanel);
  $('#go-back').click(goBack);
  $('#game-start').click(gameStart);
  //ship.hide();
  //gwhOver.show();

  //END OF TODO

  //check level up
  
  // Periodically check for collisions (instead of checking every position-update)
  //console.log(parameterOnUpdate.spawn);
  setInterval(function() {
    moveShip(curMove);
    /*
    if(!isKeyUp){
      //still press
      moveShip(curMove);
    }*/
     // Remove elements if there are collisions
  }, 1);
  
  //introMusic.play();
});

function keyupRouter(e){
  //if(status === STATE.running){
  //e.preventDefault();
  //}
  curMove = 0;
  /*
  switch (e.which) {
    //case KEYS.shift:
    //case KEYS.spacebar:
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
    //case KEYS.L:
      isKeyUp = true;
      break;
    default:
      console.log("Other Keyup!");
  }*/
  
}

function keydownRouter(e) {
  //se.preventDefault();
  //console.log(status === STATE.running);
  if(state === STATE.running){
    e.preventDefault();
  }
  switch (e.which) {
    case KEYS.shift:
      if(state == STATE.running){
        createAsteroid();
      }
      break;
    case KEYS.spacebar:
      if(state == STATE.running){
        fireRocket();
      }
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      //isKeyUp = false;
      curMove = e.which;
      //moveShip(e.which);
      break;
    case KEYS.L:
      //level up
      gwhScore.html(level * 10000);
      //alertLevel();
      /*
      if(level < 3){
        //let curScore = parseInt(gwhScore.text())
        //RECHECK: initial 0
        
        LEVEL[Object.keys(LEVEL)[level]] = true;
        level++;
        const curLevel = level;
        $('#level').html(curLevel);
        gwhLevel.fadeIn(1000);
        gwhLevel.fadeOut(2000);
        //level += 1;
      }*/
      break;
    default:
      console.log("Invalid input!");
  }
}

//TODO: design functionalities:
function setPanel(e){
  //alert($(this).text());
  if($(this).html() == "Open Setting Panel"){
    $(this).html("Close Setting Panel");
    //$('#set-box').css('display', 'block');
    $('#set-box').show();
  }else{
    $(this).html("Open Setting Panel");
    //$('#set-box').css('display', 'none');
    $('#set-box').hide();
  }
}

function updatePanel(e){
  e.preventDefault();
  //TODO: updatevalue, error?
  let s = parseFloat($('#spawn').val());
  if(!s){
    // if nothing is entered, we should
    // not update current value
    s = parameterOnUpdate.spawn;
  }
  else if(s < 0.2 || s > 4){
    //alert user if it is not in the range
    alert("Averge number of spawned per second should be in the range of [0.2, 4] ");
    return false; // NOT for sure
  }

  //alert(typeof s);
  s_random = getRandom(s);
  //console.log(s_random);
  parameterOnUpdate.spawn = s_random;
  if ($('#audio').is(":checked")){
    parameterOnUpdate.isMute = true;
  }else{
    parameterOnUpdate.isMute = false;
  }
  //alert(parameterOnUpdate.isMute);
  $('#set-panel').html("Open Setting Panel");
  $(this).hide();

  if(parameterOnUpdate.isMute){
    //pause all the music
    $('audio').each(function(){
      this.pause();
      this.currentTime = 0;
    });
   /* introMusic.pause();
    console.log(introMusic.currentTime);
    //set to beginning
    introMusic.currentTime = 0;*/
  }else{
    if(state === STATE.initial){
      //if it is initial, should play immediatele
      introMusic.play();
    }else if(state === STATE.running){
      backMusic.play();
    }
  }
}

function goBack(e){
  //TODO: 
  //reinitialize ship and its position
  //reintiilize score
  //reintilize accuracy
  //?: disable click other thing?
  ship.css({'top': '530px', 'left': '122px'});
  gwhScore.html(0);
  //alert(gwhAcc.html());
  hitNum = 0;
  rocketIdx = 1;
  asteroidIdx = 1;
  shieldIdx = 1;
  level = 1;
  maxShipPosX = gwhGame.width() - ship.width();
  //reset max x
  isDual = false;
  gwhOver.hide();
  gwhSplash.show();
  ship.show();
  gwhAcc.html('0%');
  state = STATE.initial; // go to splash screen
  gwhExplode.css({'left': '4px', 'top' : '-7px', 'height': '50px'});

  //add music if not mute
  if(!parameterOnUpdate.isMute){
    introMusic.play();
  }
  //LEVEL.first = false;
  //LEVEL.second = false;
  //LEVEL.third = false;
}

function gameStart(e){
  //TODO: game start
  console.log(parameterOnUpdate.spawn);
  //mute intogame
  introMusic.pause();
  introMusic.currentTime = 0;
  if(!parameterOnUpdate.isMute){
    backMusic.play();
  }
  gwhSplash.hide();
  gwhLife.show();
  $('#health div:first').show();
  parameterOnUpdate.life = 2;
  state = STATE.running;
  asteroid_interval = 
  setInterval(function(){
    createAsteroid();
  }, 1000/parameterOnUpdate.spawn);
  

  $('#level').html(1);
  gwhLevel.fadeIn(1000);
  gwhLevel.fadeOut(2000);
  //LEVEL.first = true;

  levelCheck = setInterval(function(){
    alertLevel();
  }, 100);

  clide = setInterval(function() {
    checkCollisions();  // Remove elements if there are collisions
  }, 100);

  //smooth move
  

}

function alertLevel(){
  if((gwhScore.html() >= level * 10000) && (level < 3)){
    //alert("enter");
    //LEVEL[Object.keys(LEVEL)[level]] = true;
    //alert("here");
    if(!parameterOnUpdate.isMute){
      if(!transMusic.paused){
        transMusic.pause();
      }
      transMusic.play();
    }
    
    level++;
    const curLevel = level;
    $('#level').html(curLevel);
    gwhLevel.fadeIn(1000);
    gwhLevel.fadeOut(2000);
  }

  if(level === 3 && isDual === false){
    createDual();
  }
}

function getRandom(ave){
  //get a random number
  min = ave - ave * 0.5;
  return Math.random() * ave + min;
}

function updateAcc(){
  //everytime a hit 
  //or a rocket go out of the screen
  //update accuracy
  let accuracy = parseInt(hitNum * 100 / (rocketIdx - 1));
  //update css
  gwhAcc.html(accuracy + '%');
}

function loseLife(){
  //const curLife = parseInt(parameterOnUpdate.life);
  //console.log(parameterOnUpdate.life);
  gwhExplode.fadeIn(500);
  if(!parameterOnUpdate.isMute){
    if(!explodeMusic.paused){
      explodeMusic.pause();
      explodeMusic.currentTime = 0;
    }
    explodeMusic.play();
  }
  if(parameterOnUpdate.life <= 1){
    //gameOver
    
    gwhLife.hide();
    
    $('.rocket').remove();  // remove all rockets
    $('.asteroid').remove();  // remove all asteroids
    $('.shield').remove(); // remove all the shiled
    
    $('#shield-dual').remove();
    clearInterval(asteroid_interval);
    clearInterval(clide);
    state = STATE.game_over;
    setTimeout(function(){
      ship.hide();
      $('#ship-dual').remove();
      let score = "Your Score is: "+ gwhScore.html() + " points";
      $('#final-score').html(score);
      gwhOver.show();

      //pause all the music
      $('audio').each(function(){
        this.pause();
        this.currentTime = 0;
      });

      if(!parameterOnUpdate.isMute){
        overMusic.play();
      }
    }, 1000);
    
  }else{
    parameterOnUpdate.life -= 1;
    $('#health div:first').hide();
    $('.rocket').remove();  // remove all rockets
    $('.asteroid').remove();  // remove all asteroids
    clearInterval(asteroid_interval);
    clearInterval(clide);
    setTimeout(function(){
      asteroid_interval = setInterval(function(){
        createAsteroid();
      }, 1000/parameterOnUpdate.spawn);

      clide = setInterval(function() {
        checkCollisions();  // Remove elements if there are collisions
      }, 100);

    }, 1000);
    
    
    //setShield(false, curAsteroid);
    //setTimeout(function(){
    //}, 500);
    
    //clearInterval(asteroid_interval);
  }
  gwhExplode.fadeOut(500);
}

function setShield(isWear, item){
  //if isWear = true, wear shield
  //if isWear = false, it is clide with asteroid
  //if not wear, go to lose life
  // Need to delay for a while
  if(isWear){
    //colide with shield
    shield_exist = true;
    gwhShield.show();
    if(isDual){
      $('#shield-dual').show();
    }
  }else if(shield_exist){
    //shield destroy
    //alert("once exist");
    shield_exist = false;
    gwhShield.hide();
    if(isDual){
      $('#shield-dual').hide();
    }
  }else{
    //alert("lose life");
    loseLife();
  }
  item.remove();
  
}

function createDual(){
  ship.fadeOut(1000);
  setTimeout(function(){
    ship.css({'top' : '530px', 'left' : '92px'});
    var shipDual = "<img class='ship-avatar' id='ship-dual' src='img/fighter.png' height='50px'/> <div id='shield-dual'><img src='img/shield.png' height='65px'/> </div>"
    // Add the rocket to the screen
    ship.append(shipDual);
    //alert(ship.html());
  }, 1000);
  
  ship.fadeIn(1000);
  //update max x
  maxShipPosX = gwhGame.width() - ship.width() * 2;
  isDual = true;

  if(shield_exist){
    $('#shield-dual').show();
  }
  //change css for explosion
  gwhExplode.css({'left': '15px', 'top' : '-30px', 'height': '80px'});
}

//END OF TODO


// Check for any collisions and remove the appropriate object if needed
function checkCollisions() {
  // First, check for rocket-asteroid checkCollisions
  /* NOTE: We dont use a global handle here because we need to refresh this
   * list of elements when we make the reference.
   */
  $('.rocket').each( function() {
    var curRocket = $(this);  // define a local handle for this rocket
    $('.asteroid').each( function() {
      var curAsteroid = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curAsteroid)) {
        // If a rocket and asteroid collide, destroy both
        //explosion(curRocket,curAsteroid);
        
        curRocket.remove();
        curAsteroid.remove();

        //TODO: update hitNum
        hitNum++;
        
        //create shiled
        if(level >= 2){
          if (hitNum % M === 0){
            //alert("createShild!")
            createShield();
          }
        }
        //END
        updateAcc();
        // Score points for hitting an asteroid! Smaller asteroid --> higher score
        var points = Math.ceil(MAX_ASTEROID_SIZE-curAsteroid.width()) * SCORE_UNIT;

        if (fastAsteroid.indexOf(curAsteroid.attr('id')) > -1) {
          //faster asteroid get higher score
          points = points * 2;
        }

        // Update the visible score
        gwhScore.html(parseInt($('#score-box').html()) + points);
        
      }
    });
  });


  $('.rocket').each( function() {
    var curRocket = $(this);  // define a local handle for this rocket
    $('.shield').each( function() {
      var curShield = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curShield)) {
        // If a rocket and asteroid collide, destroy both
        curRocket.remove();
        curShield.remove();
      }
    });
  });


  // Next, check for asteroid-ship interactions
  $('.asteroid').each( function() {
    var curAsteroid = $(this);
    if (isColliding(curAsteroid, ship)) {
      // Remove all game elements
      // setShield(false, curAsteroid);
      setShield(false, curAsteroid);
    }
  });

  // Next, check for shield-ship interactions
  $('.shield').each( function() {
    var curShield = $(this);
    if (isColliding(curShield, ship)) {
      // Remove all game elements
      setShield(true, curShield);
      //curShield.remove();
    }
  });
}

// Check if two objects are colliding
function isColliding(o1, o2) {
  // Define input direction mappings for easier referencing
  o1D = { 'left': parseInt(o1.css('left')),
          'right': parseInt(o1.css('left')) + o1.width(),
          'top': parseInt(o1.css('top')),
          'bottom': parseInt(o1.css('top')) + o1.height()
        };
  o2D = { 'left': parseInt(o2.css('left')),
          'right': parseInt(o2.css('left')) + o2.width(),
          'top': parseInt(o2.css('top')),
          'bottom': parseInt(o2.css('top')) + o1.height()
        };

  // If horizontally overlapping...
  if ( (o1D.left < o2D.left && o1D.right > o2D.left) ||
       (o1D.left < o2D.right && o1D.right > o2D.right) ||
       (o1D.left < o2D.right && o1D.right > o2D.left) ) {

    if ( (o1D.top > o2D.top && o1D.top < o2D.bottom) ||
         (o1D.top < o2D.top && o1D.top > o2D.bottom) ||
         (o1D.top > o2D.top && o1D.bottom < o2D.bottom) ) {

      // Collision!
      return true;
    }
  }
  return false;
}

// Return a string corresponding to a random HEX color code
function getRandomColor() {
  // Return a random color. Note that we don't check to make sure the color does not match the background
  return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
}

// Handle asteroid creation events
function createAsteroid() {
  console.log('Spawning asteroid...');

  // NOTE: source - http://www.clipartlord.com/wp-content/uploads/2016/04/aestroid.png
  var asteroidDivStr = "<div id='a-" + asteroidIdx + "' class='asteroid'></div>"
  // Add the rocket to the screen
  gwhGame.append(asteroidDivStr);
  // Create and asteroid handle based on newest index
  var curAsteroid = $('#a-'+asteroidIdx);

  asteroidIdx++;  // update the index to maintain uniqueness next time

  // Set size of the asteroid (semi-randomized)
  var astrSize = MIN_ASTEROID_SIZE + (Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE));
  curAsteroid.css('width', astrSize+"px");
  curAsteroid.css('height', astrSize+"px");
  curAsteroid.append("<img src='img/asteroid.png' height='" + astrSize + "'/>")

  /* NOTE: This position calculation has been moved lower since verD -- this
  **       allows us to adjust position more appropriately.
  **/
  // Pick a random starting position within the game window
  var startingPosition = Math.random() * (gwhGame.width()-astrSize);  // Using 50px as the size of the asteroid (since no instance exists yet)
  
  let asteroid_speed = {
    sum_speed : ASTEROID_SPEED,
    vspeed : 0,
    hspeed : 0
  }
  // Set the instance-specific properties
  curAsteroid.css('left', startingPosition+"px");

  //TODO: make faster asteroid
    //let asteroid_ = ASTEROID_SPEED;
    //let speed = ASTEROID_SPEED;
    let isFast = false;
    if(level >= 2 && asteroidIdx % 3 == 0){
      asteroid_speed.sum_speed = ASTEROID_SPEED * 5;
      //fastAsteroid is a set of id
      isFast = true;
      fastAsteroid.push(curAsteroid.attr('id'));
    }

    //TODO: give value to vspeed and hspeed
    /*
    if(level < 3){
      asteroid_speed.vspeed = asteroid_speed.sum_speed;
      asteroid_speed.hspeed = 0;
    }else{

    }*/
  //END OF TODO 

  //TODO: make the asteroid rotate
  setInterval(function(){
    curAsteroid.css('transform', 'rotate(' + rotation + 'deg)');
    rotation += 10;
  }, 100);
  //END of TODO

  if(isFast && level === 3){
    //if is fast and in the third level, move toward the ship
    setInterval(function(){

      var ship_left = parseInt(ship.css('left')) + (parseInt(ship.width()) / 2);
      var ship_top = parseInt(ship.css('top'));
      //+ (parseInt($('#ship-primary').height()) / 2);
      if(isDual){
        
        ship_left += parseInt(ship.width()) / 4;
        //alert("yes");
        //ship_top += parseInt($('#ship-dual').height()) / 2;
      }

      let ast_top = parseInt(curAsteroid.css('top')) + astrSize;
      let ast_left = parseInt(curAsteroid.css('left')) + astrSize;
      if(ast_top > ship_top){
        //asteroid falls under the ship
        curAsteroid.css('top', parseInt(curAsteroid.css('top'))+asteroid_speed.sum_speed);
      }else{
        let distance = Math.sqrt((ship_top - ast_top) * (ship_top - ast_top) + (ship_left - ast_left) * (ship_left - ast_left));
        let sinVal = (ship_top - ast_top) / distance;
        //sinVal is always positive
        let cosVal = (ship_left - ast_left) / distance;
        //console.log(sinVal);
        //console.log(cosVal);

        asteroid_speed.hspeed = parseInt(cosVal * asteroid_speed.sum_speed);

        asteroid_speed.vspeed = parseInt(sinVal * asteroid_speed.sum_speed);

        curAsteroid.css('top', parseInt(curAsteroid.css('top'))+asteroid_speed.vspeed);

        curAsteroid.css('left', parseInt(curAsteroid.css('left'))+asteroid_speed.hspeed);
      }

      if (parseInt(curAsteroid.css('top')) > (gwhGame.height() - curAsteroid.height())) {
        curAsteroid.hide();
      }

      if (parseInt(curAsteroid.css('top')) > (gwhGame.height())) {
        curAsteroid.remove();
      }

    }, OBJECT_REFRESH_RATE);
    
  }else{
    //else, act as normal
    setInterval( function() {
      curAsteroid.css('top', parseInt(curAsteroid.css('top'))+asteroid_speed.sum_speed);
      // Check to see if the asteroid has left the game/viewing window
      if (parseInt(curAsteroid.css('top')) > (gwhGame.height() - curAsteroid.height())) {
        curAsteroid.remove();
      }
    }, OBJECT_REFRESH_RATE);
  }

  // Make the asteroids fall towards the bottom
  
}

function createShield(){
  console.log('Shield asteroid...');

  var shieldDivStr = "<div id='s-" + shieldIdx + "' class='shield'></div>"
  // Add the rocket to the screen
  gwhGame.append(shieldDivStr);
  // Create and asteroid handle based on newest index
  var curShiled = $('#s-'+shieldIdx);

  shieldIdx++;  // update the index to maintain uniqueness next time

  // Set size of the asteroid (semi-randomized)
  curShiled.append("<img src='img/shield.png'/>")

  /* NOTE: This position calculation has been moved lower since verD -- this
  **       allows us to adjust position more appropriately.
  **/
  // Pick a random starting position within the game window
  console.log(curShiled.width());
  var startingPosition = Math.random() * (gwhGame.width()-curShiled.width());  // Using 50px as the size of the asteroid (since no instance exists yet)

  // Set the instance-specific properties
  curShiled.css('left', startingPosition+"px");

  //TODO: make the asteroid rotate
  setInterval(function(){
    curShiled.css('transform', 'rotate(' + rotation + 'deg)');
    rotation += 10;
  }, 100);
  //END of TODO

  // Make the asteroids fall towards the bottom
  setInterval( function() {
    curShiled.css('top', parseInt(curShiled.css('top'))+ASTEROID_SPEED);

    // Check to see if the asteroid has left the game/viewing window
    if (parseInt(curShiled.css('top')) > (gwhGame.height() - curShiled.height())) {
      curShiled.hide();
    }

    if (parseInt(curShiled.css('top')) > (gwhGame.height())) {
      curShiled.remove();
    }

  }, OBJECT_REFRESH_RATE);
}

// Handle "fire" [rocket] events
function fireRocket() {
  console.log('Firing rocket...');

  // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png

  var rocketDivStr = "<div id='r-" + rocketIdx + "' class='rocket'><img src='img/rocket.png'/></div>";
  // Add the rocket to the screen
  gwhGame.append(rocketDivStr);
  var curRocket_1 = $('#r-'+rocketIdx);
  rocketIdx++;

  var rxPos_1 = parseInt(ship.css('left')) + ($('#ship-primary').width()/2) + 3;

  curRocket_1.css('top', ship.css('top'));
  curRocket_1.css('left', rxPos_1+"px");
  if(!parameterOnUpdate.isMute){
    rocketMusic.play();
  }
  // Create movement update handler
  setInterval( function() {
    curRocket_1.css('top', parseInt(curRocket_1.css('top'))-ROCKET_SPEED);
    // Check to see if the rocket has left the game/viewing window
    if (parseInt(curRocket_1.css('top')) < curRocket_1.height()) {
      //curRocket.hide();
      //problem: 还是有问题
      updateAcc();
      curRocket_1.remove();
    }
  }, OBJECT_REFRESH_RATE);


  if(isDual){
    rocketDivStr = "<div id='r-" + rocketIdx + "' class='rocket'><img src='img/rocket.png'/></div>";
    // Add the rocket to the screen
    gwhGame.append(rocketDivStr);
    var curRocket_2 = $('#r-'+rocketIdx);
    rocketIdx++;
  
    var rxPos_2 = parseInt(ship.css('left')) + (ship.width()/2) + ($('#ship-dual').width()/2 ) + 5;
  
    curRocket_2.css('top', ship.css('top'));
    curRocket_2.css('left', rxPos_2+"px");
  
    // Create movement update handler
    setInterval( function() {
      curRocket_2.css('top', parseInt(curRocket_2.css('top'))-ROCKET_SPEED);
      // Check to see if the rocket has left the game/viewing window
      if (parseInt(curRocket_2.css('top')) < curRocket_2.height()) {
        //curRocket.hide();
        //problem: 还是有问题
        updateAcc();
        curRocket_2.remove();
      }
    }, OBJECT_REFRESH_RATE);
    
  }
}

// Handle ship movement events
function moveShip(arrow) {
  //console.log(arrow);
  switch (arrow) {
    case KEYS.left:  // left arrow
      var newPos = parseInt(ship.css('left'))-SHIP_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      ship.css('left', newPos);
    break;
    case KEYS.right:  // right arrow
      var newPos = parseInt(ship.css('left'))+SHIP_SPEED;
      if (newPos > maxShipPosX) {
        newPos = maxShipPosX;
      }
      ship.css('left', newPos);
    break;
    case KEYS.up:  // up arrow
      var newPos = parseInt(ship.css('top'))-SHIP_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      ship.css('top', newPos);
    break;
    case KEYS.down:  // down arrow
      var newPos = parseInt(ship.css('top'))+SHIP_SPEED;
      if (newPos > maxShipPosY) {
        newPos = maxShipPosY;
      }
      ship.css('top', newPos);
    break;
  }
}
