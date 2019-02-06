//Variables

var xpos, ypos, xvel, yvel, ball, w, h, gameBox, 
ballh, ballw, ballr, ballb,
xmin, xmax, ymin, ymax, 
upPressed, downPressed, leftPressed, rightPressed,
numEnemies, enx, eny, venx, veny, gameLoop, gameSpeed, startSpeed, spedUp, maxSpeed, enDir;

//Functions

//Initializes the variables
function init(){

	w = window.innerWidth;
	h = window.innerHeight;
	ballh = h*0.02; ballw = ballh; ballb = h*0.01; ballr = ballw;
	gameBox = document.getElementById("gameBox");
	ball = document.getElementById("ball");	
	enx=[]; eny = [];
	
	xpos=w/2; ypos=h/2; xvel=0; yvel=0; 
	xmin = 0; xmax = w-h*0.04; ymin = 0; ymax = 0.76*h;
	upPressed = 0; downPressed = 0; leftPressed = 0; rightPressed = 0;
	count = 0; numEnemies = 0; enx = []; eny = []; enDir = []; venx = 0.25; veny = 0.25;
	startSpeed = 7; gameSpeed = startSpeed; spedUp = false; maxSpeed = false; follow = true;
	
	ball.style.left = xpos + "px";
	ball.style.top = ypos + "px";
	ball.style.height = ballh + "px";
	ball.style.width = ballw + "px";
	ball.style.borderRadius = ballr + "px";
	ball.style.borderWidth = ballb + "px";
	
	gameBox.style.height = h + "px";
	gameBox.style.width = w + "px";
	
	counter = document.getElementById("counter");
	counter.innerHTML = count;
	
	//Code Start
	gameLoop = setInterval(gameClock, gameSpeed);
	generateSq();
}

//Moves ball
function moveBall(xspeed, yspeed){
	xpos = Math.min(Math.max(xpos + xspeed,xmin),xmax);
	ypos = Math.min(Math.max(ypos + yspeed,ymin),ymax);
	
	ball.style.left = xpos + "px";
	ball.style.top = ypos + "px";
}

//Sends vel to moveball
function keyPress(){
	xvel = 0;
	yvel = 0;
	if(upPressed == true) yvel = -2;	
	if(downPressed == true) yvel = 2;
	if(leftPressed == true) xvel = -2;
	if(rightPressed == true) xvel = 2;
	if(yvel != 0 && xvel != 0){
		yvel = yvel*0.71;
		xvel = xvel*0.71;
	}
	moveBall(xvel, yvel);
}

//Checks if arrow keys are pressed 
function keyDown(e)
{
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 38)
	upPressed = 1;
  if (code == 40)
	downPressed = 1;
  if (code == 37)
	leftPressed = 1;
  if (code == 39)
	rightPressed = 1;
}

//Checks if arrow keys are released
function keyUp(e)
{
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 38)
	upPressed = 0;
  if (code == 40)
	downPressed = 0;
  if (code == 37)
	leftPressed = 0;
  if (code == 39)
	rightPressed = 0;
}

//Generate Square
function generateSq(){
	sqx = Math.round(Math.random()*xmax);
	sqy = Math.round(Math.random()*ymax);
	
	square.style.left = sqx + "px";
	square.style.top = sqy + "px";
}

//Check Collision
function detectCollision(){
	if((xpos + ballw + ballb) > sqx && (xpos - ballb) < (sqx+10)) {
		if((ypos + ballh + ballb) > sqy && (ypos - ballb) < (sqy+10)){
			generateSq();
			count = count+1;
			counter.innerHTML = count;
			generateEnemy(numEnemies);
			
			// Set spedUp to false so that we can speed up again when score is a multiple of 10
			spedUp = false;
		}
	}
}

// Check for collision with enemy
function detectEnemyHit() {
	for (i=0; i < numEnemies; i++){
		if (xpos + ballw >= enx[i] && xpos <= enx[i] && ypos + ballh >= eny[i] && ypos <= eny[i])
			gameOver();
	}
}

function speedUp() {
	clearInterval(gameLoop);
	gameSpeed = startSpeed - count / 10;
	if (gameSpeed == 1)
		maxSpeed = true;
	
	// Also give enemies extra boost
	if (veny < 0.75 && venx < 0.75)
	{
		venx += 0.10;
		veny += 0.10;
	}
	
	// Let user know we are speeding up
	counter = document.getElementById("counter");
	counter.innerHTML = maxSpeed ? "MAX SPEED!" : "SPEED UP!";
	oldColor = counter.style.color;
	counter.style.color = "green";
	
	blinks = 0;
	
	// Blinks the SPEED UP! text
	function blink() {
		counter.style.display = counter.style.display === "none" ? "block" : "none";
		blinks++;
		if (blinks >= 6)
		{
			// Resume game
			clearInterval(blinker);
			counter.style.color = oldColor;
			counter.innerHTML = count;
			gameLoop = setInterval(gameClock, gameSpeed);
		}
	}
	blinker = setInterval(blink, 500);
	spedUp = true;
}

function newAI() {
	clearInterval(gameLoop);
	
	// Let user know we are entering insanity
	counter = document.getElementById("counter");
	counter.innerHTML = "INSANITY!";
	oldColor = counter.style.color;
	counter.style.color = "purple";
	
	// Change enemy AI
	follow = false;
	for (i=0; i < numEnemies; i++){
		enDir[i] = Math.round(Math.random() * 8) + 1;
	}
	
	blinks = 0;
	
	// Blinks the text
	function blink() {
		counter.style.display = counter.style.display === "none" ? "block" : "none";
		blinks++;
		if (blinks >= 6)
		{
			// Resume game
			clearInterval(blinker);
			counter.style.color = oldColor;
			counter.innerHTML = count;
			gameLoop = setInterval(gameClock, gameSpeed);
		}
	}
	blinker = setInterval(blink, 500);
	spedUp = true;
}

//Generate Enemies
function generateEnemy(num){
	numEnemies += 1;
	var div = document.createElement("div");
	div.className = "enemy";
	div.id = "enemy" + num;
	
	document.body.appendChild(div);
	
	enx[num] = Math.round(Math.random()*xmax);
	eny[num] = Math.round(Math.random()*ymax);
	
	document.getElementById("enemy" + num).style.left = enx[num] + "px";
	document.getElementById("enemy" + num).style.top = eny[num] + "px";
}

//Move Enemies
function moveEnemy(){
	for (i=0; i < numEnemies; i++){
		if (follow === true)
		{		
			centerX = xpos + ballw / 2;
			centerY = ypos + ballh / 2;
			
			if(centerX > enx[i]) enx[i] = enx[i] + venx;
			if(centerX < enx[i]) enx[i] = enx[i] - venx;
			if(centerY > eny[i]) eny[i] = eny[i] + veny;
			if(centerY < eny[i]) eny[i] = eny[i] - veny;
			
			// Add some randomness so they don't superblob as much (not really a great solution, but an easy one)
			enx[i] = enx[i] + (Math.random() * 2) - 1
			eny[i] = eny[i] + (Math.random() * 2) - 1
		}
		else
		{
			// Decide if we are changing directions
			if (Math.random() * 1000 > 999)
			{
				enDir[i] = Math.round(Math.random() * 8) + 1;
			}
			
			// Up
			if (enDir[i] === 1)
			{
				if (eny[i] - veny >= ymin)
					eny[i] -= veny;
			}
			// Up-Right
			else if (enDir[i] === 2)
			{
				if (eny[i] - veny >= ymin)
					eny[i] -= veny;
				if (enx[i] + venx <= xmax)
					enx[i] += venx;
			}
			// Right
			else if (enDir[i] === 3)
			{
				if (enx[i] + venx <= xmax)
					enx[i] += venx;
			}
			// Down-Right
			else if (enDir[i] === 4)
			{
				if (eny[i] + veny <= ymax)
					eny[i] += veny;
				if (enx[i] + venx <= xmax)
					enx[i] += venx;
			}
			// Down
			else if (enDir[i] === 5)
			{
				if (eny[i] + veny <= ymax)
					eny[i] += veny;
			}
			// Down-Left
			else if (enDir[i] === 6)
			{
				if (eny[i] + veny <= ymax)
					eny[i] += veny;
				if (enx[i] - venx >= xmin)
					enx[i] -= venx;
			}
			// Left
			else if (enDir[i] === 7)
			{
				if (enx[i] - venx >= xmin)
					enx[i] -= venx;
			}
			// Up-Left
			else if (enDir[i] === 8)
			{
				if (eny[i] - veny >= ymin)
					eny[i] -= veny;
				if (enx[i] - venx >= xmin)
					enx[i] -= venx;
			}
			// Follow
			else
			{
				centerX = xpos + ballw / 2;
				centerY = ypos + ballh / 2;
				
				if(centerX > enx[i]) enx[i] = enx[i] + venx;
				if(centerX < enx[i]) enx[i] = enx[i] - venx;
				if(centerY > eny[i]) eny[i] = eny[i] + veny;
				if(centerY < eny[i]) eny[i] = eny[i] - veny;
				
				// Add some randomness so they don't superblob as much (not really a great solution, but an easy one)
				enx[i] = enx[i] + (Math.random() * 2) - 1
				eny[i] = eny[i] + (Math.random() * 2) - 1
			}
			
			// Change dir if hitting wall
			if (enDir[i] <= 8 && (enx[i] + 1 > xmax || enx[i] - 1 < xmin || eny[i] + 1 > ymax || eny[i] - 1 < ymin))
			{
				enDir[i] = Math.round(Math.random() * 8) + 1;
			}
		}
		
		document.getElementById("enemy"+i).style.left = enx[i] + "px";
		document.getElementById("enemy"+i).style.top = eny[i] + "px";
	}
	
	
}

function gameClock(){
	keyPress();
	detectCollision();
	moveEnemy();
	detectEnemyHit();
	
	// Speed up every 10 points (until max speed)
	if (count > 0 && count % 10 === 0 && spedUp === false && maxSpeed === false)
		speedUp();
	
	// INITIATE INSANITY
	if (count == 35 && follow === true)
		newAI();
}

function gameOver() {
	clearInterval(gameLoop);
	if (count < 20)
		alert("You lost. Haha. Loser. You got the super lame score of only " + count + " points. Were you even trying?");
	else if (count < 60)
		alert("Well you gave it your best shot, but in the end you failed. There's probably a lesson to be learned there somewhere. Your score was " + count + " points, or in other words, around the same score that our test monkey got by flinging poop at the keyboard.");
	else
		alert("I guess you don't totally suck. You scored " + count + " points. Nice job.");
	
	// Restart
	for (i=0; i < numEnemies; i++){
		deleteMe = document.getElementById("enemy"+i);
		deleteMe.parentNode.removeChild(deleteMe);
	}
	init();
}