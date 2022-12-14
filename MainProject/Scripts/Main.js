const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0xbe92ed);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const plane = new Plane();
const spotLight = new Spotlight();
const stateManager = new StateManager();
const spriteManager = new SpriteManager();
const inputManager = new InputManager();
const soundManager = new SoundManager();
const brickManager = new BrickManager();
const powerUpManager = new PowerUpManager();
const paddle = new Paddle();
let ball;
var ballArray = new Array();
var brickArray = new Array();
var powerUpArray = new Array();
var collidableObjects = new Array();
var clock = new THREE.Clock();
var delta = 0;

stateManager.SetState(1);
scene.add(plane.Mesh());
scene.add(spotLight.Source());
scene.add(paddle.Mesh());
camera.add(soundManager.Listener());
camera.position.z = 15;

//Function for moving the ball (or balls in the case of the Split power-up) using an array,
//and contains code to check if the ball has been destroyed and whether it needs to be removed from the array
function MoveBalls()
{
    if (ballArray.length == 0)
    {
        stateManager.SetState(4);
        soundManager.GameOver();
    }
    for (var i = 0; i < ballArray.length; i++)
    {
        if (ballArray[i].IsDestroyed())
        {
            if (ballArray[i] == ball)
            {
                ball = ballArray[i + 1];
            }
            ballArray.splice(i, 1);
            return;
        }
        ballArray[i].Move();
    }
}

//Function for resetting variables so the game can restart smoothly
function Reset()
{
    for (var i = 0; i < powerUpArray.length; i++)
    {
        powerUpArray[i].Destroy();
    }
    for (var i = 0; i < brickArray.length; i++)
    {
        brickArray[i].ResetDestroy();
    }
    brickArray = [];
    collidableObjects = [];
    powerUpArray = [];
    paddle.SetXPos(0);
    paddle.SetYPos(-10);
    collidableObjects.push(paddle.Mesh());
    if (ballArray.length == 0)
    {
        ballArray = [];
        ball = new Ball();
        ballArray.push(ball);
        scene.add(ball.Mesh());
    }
    ball.Reset();
    brickManager.SpawnBricks();
}

//Music doesn't play on first call, possibly because it doesn't load in time
//Out of time to fix it
soundManager.Music();

Reset();
function update()
{
    delta = clock.getDelta();
    stateManager.Update();
    if (stateManager.CurrentState() == 'Game')
    {
        paddle.Update();
        MoveBalls();
        powerUpManager.Update();
        brickManager.Update();
    }
}

function animate()
{
    requestAnimationFrame(animate);
    update();
	renderer.render(scene, camera);
}

animate();
