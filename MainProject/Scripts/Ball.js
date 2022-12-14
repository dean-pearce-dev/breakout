function Ball()
{
    const white = 0xdedede;
    const gold = 0xbdac2e;
    var opacity = 1;
    var isTransparent = false;
    var castsShadow = true;
    var radius = 0.6;
    Sphere.call(this, radius, 6, 6, white, opacity, isTransparent, castsShadow);
    const mesh = this.Mesh();
    const material = this.Material();
    var ySpeed = 10;
    var xSpeed = Math.random() * (12 - 5) + 5;
    var xBound = 24.5;
    var yBound = 12;

    var randomiseXDir = Math.round(Math.random());
    var moveUp = true;
    var moveLeft = true;
    if (randomiseXDir == 1)
        moveLeft = false;

    var previousCollision;
    var currentCollision;

    var isDestroyed = false;
    var stickOnNextHit = false;
    var isStuckToPaddle = false;
    var superMode = false;
    var splitMode = true;

    var aimDir;
    var deltaCompensation;

    this.IsDestroyed = function ()
    {
        return isDestroyed;
    }

    //Function used by the paddle object to determine whether input should control movement, or aim direction
    this.IsStuckToPaddle = function ()
    {
        return isStuckToPaddle;
    }

    //Function to determine whether the stick power-up is active, so the ball will stick on the next paddle collision
    this.StickOnNextHit = function (stickBool)
    {
        stickOnNextHit = stickBool;
        if (stickBool)
        paddle.ShowStickyVisualiser();
    }

    //Function for moving the ball, contains a call to the function used to determine collision, so that collision is checked before any movement
    this.Move = function ()
    {
        this.DetectCollision();
        //Checking if there is only 1 ball with splitMode set to true, and if so, resets it to false
        //splitMode is set to true by default so that balls spawned with the Split power-up can't spawn more until there is 1 ball left
        if (ballArray.length == 1 && splitMode == true)
            splitMode = false;
        //Switch to determine which code to run dependant on whether the 'Stuck' power-up is active
        switch (isStuckToPaddle)
        {
            case false:
                //Using bound variables for the wall collision so that there's no chance of the ball exceeding the bounds
                //Setting previousCollision to null on each bound hit, so that the same brick can be hit after a wall collision
                //Using bools for determining movement which are changed depending on key presses from the InputManager
                if (moveUp)
                {
                    mesh.position.y += ySpeed * delta;
                    if (mesh.position.y > yBound)
                    {
                        soundManager.Collision();
                        moveUp = false;
                        previousCollision = null;
                        //soundManager.PlaySound1();
                    }
                }
                if (!moveUp)
                {
                    mesh.position.y -= ySpeed * delta;
                    //Bottom bounds, ball is destroyed if it reaches this point
                    if (mesh.position.y < -yBound)
                    {
                        isDestroyed = true;
                        this.Destroy();
                    }
                }
                if (moveLeft)
                {
                    mesh.position.x -= xSpeed * delta;
                    if (mesh.position.x < -xBound)
                    {
                        soundManager.Collision();
                        moveLeft = false;
                        previousCollision = null;
                    }
                }
                if (!moveLeft)
                {
                    mesh.position.x += xSpeed * delta;
                    if (mesh.position.x > xBound)
                    {
                        soundManager.Collision();
                        moveLeft = true;
                        previousCollision = null;
                    }
                }
                break;
            //If ball isStuckToPaddle, makes it match the paddle's X position
            case true:
                mesh.position.x = paddle.Mesh().position.x;
                break;
        }
    }

    //Array for raycaster directions
    //rays 0-1 = Up/Down
    //rays 2-4 = Up-Right/Right/Down-Right
    //rays 5-7 = Up-Left/Left/Down-Left
    const rays = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0.5, 0.75, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0.5, -0.75, 0),
        new THREE.Vector3(-0.5, 0.75, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-0.5, -0.75, 0)
    ];

    //Function for visualizing aim direction during the 'Stuck' power-up
    this.UpdateAimRay = function ()
    {
        aimRay.setDirection(aimDir);
        aimRay.position.copy(mesh.position);
        aimRay.position.y = mesh.position.y + radius;
    }

    var aimRay = new THREE.ArrowHelper(aimDir, mesh.position, 1.5, 0xff0000);
    const raycaster = new THREE.Raycaster();

    var collidedObject;

    //Function for collision detection, contains variables to track the previous and current collision objects, and prevents the same object cancelling out
    //the previous movement
    this.DetectCollision = function ()
    {
        deltaCompensation = delta + 0.005
        //Using the speed variables, and the ball's radius to determine whether the next move will be a collision
        var distance = ((xSpeed + ySpeed) + radius) * deltaCompensation;
        for (var i = 0; i < rays.length; i++)
        {
            //Conditional for diagonal rays to make them shorter
            if (i == 2 || i == 4 || i == 5 || i == 7)
            {
                distance = ((xSpeed + ySpeed) / 2) * deltaCompensation;
            }
            raycaster.set(mesh.position, rays[i])
            //Using the collidableObjects array, which contains each brick, and the paddle, to determine valid collisions
            var collisions = raycaster.intersectObjects(collidableObjects);
            if (collisions.length > 0 && collisions[0].distance <= distance)
            {
                soundManager.Collision();
                collidedObject = collisions[0].object;
                //Using the uuid to compare between this collision, and previous collision
                currentCollision = collisions[0].object.uuid;
                paddleId = paddle.Mesh().uuid;
                if (currentCollision != previousCollision)
                {
                    //If superMode, a power-up, is active, then ignores the brick collision in order to break everything in it's path, and returns control
                    //out of the loop in order to do so
                    if (superMode && currentCollision != paddleId)
                    {
                        collidedObject.userData.hitsToBreak = 0;
                        return;
                    }
                    if (i == 0)
                    {
                        moveUp = !moveUp;
                    }
                    if (i == 1)
                    {
                        moveUp = !moveUp;
                    }
                    if (i >= 2 && i <= 4)
                    {
                        moveLeft = !moveLeft;
                    }
                    if (i >= 5)
                    {
                        moveLeft = !moveLeft;
                    }
                    //If the collision is not a paddle, but is a brick, removes 1 hit from the bricks total hits, using .userData to set and access the property
                    if (currentCollision != paddleId)
                    {
                            collidedObject.userData.hitsToBreak--;                           
                    }
                    //Conditional for determining the speed of the ball dependant on which part of the paddle it has collided with
                    //Using the paddle width, the center of the paddle, and the center's position in the scene to calculate the bound segments
                    if (currentCollision == paddleId)
                    {
                        //Conditional for the Stick power-up, checks if the power-up is active through stickOnNextHit, and if so, on collision with the paddle,
                        //will activate the power-up and return control from the statement
                        if (stickOnNextHit)
                        {
                            this.Stick();
                            return;
                        }
                        var paddleCenter = paddle.GetWidth() / 2;
                        var paddleFifth = paddle.GetWidth() / 5;
                        var paddleCenterInScene = paddle.GetXPos();
                        var paddleLeftBound = paddleCenterInScene - paddleCenter;
                        var paddleRightBound = paddleCenterInScene + paddleCenter;
                        //Center segment
                        if (mesh.position.x > (paddleCenterInScene - paddleFifth) && mesh.position.x < (paddleCenterInScene + paddleFifth))
                        {
                            xSpeed = 8;
                        }
                        //Mid Left segment
                        if (mesh.position.x > (paddleLeftBound + paddleFifth) && mesh.position.x < (paddleCenterInScene - paddleFifth))
                        {
                            xSpeed = 12;
                            moveLeft = true;
                        }
                        //Far Left segment
                        if (mesh.position.x > paddleLeftBound && mesh.position.x < (paddleLeftBound + paddleFifth))
                        {
                            xSpeed = 15;
                            moveLeft = true;
                        }
                        //Mid Right segment
                        if (mesh.position.x < (paddleRightBound - paddleFifth) && mesh.position.x > (paddleCenterInScene + paddleFifth))
                        {
                            xSpeed = 12;
                            moveLeft = false;
                        }
                        //Far Right segment
                        if (mesh.position.x < paddleRightBound && mesh.position.x > (paddleRightBound - paddleFifth))
                        {
                            xSpeed = 15;
                            moveLeft = false;
                        }
                    }
                }
                //If a collision is detected, sets the previousCollision to it's uuid, then returns out of the loop to stop checking for collision until the next move
                previousCollision = currentCollision;
                return;
            }
            else
            {
                //Changing or resetting the ball color, dependant on the superMode power-up
                if(superMode == false)
                    material.color.set(white);
                if (superMode == true)
                    material.color.set(gold);
            }
        }
    }

    //Function for sticking the ball to the paddle on power-up activation
    this.Stick = function ()
    {
        xSpeed = 0;
        ySpeed = 0;
        mesh.position.x = paddle.Mesh().position.x;
        mesh.position.y = paddle.Mesh().position.y + (radius * 2);
        isStuckToPaddle = true;
        scene.add(aimRay);
        aimDir = new THREE.Vector3(0, yBound, 0);
        aimDir.normalize();
        this.UpdateAimRay();
        //If multiple balls exist, only allows the first one to touch the paddle to stick
        //Assigns the 'ball' variable to whichever ball sticks first, making it the main ball for other references
        if (ballArray.length > 1)
        {
            for (var i = 0; i < ballArray.length; i++)
            {
                if (ballArray[i].IsStuckToPaddle() == false)
                    ballArray[i].StickOnNextHit(false);
                else if (ballArray[i] != ball && ballArray[i].IsStuckToPaddle() == true)
                    ball = ballArray[i];
            }
        }
    }

    //Function for getting the aim direction for the aimRay, used within the paddle object to passthrough the direction
    this.AimFromPaddle = function (xDir)
    {
        aimDir = new THREE.Vector3(xDir, yBound, 0);
        aimDir.normalize();
        this.UpdateAimRay();
    }

    //Shoots the ball once called, used within the paddle object to set the speed and direction based on the aim direction
    this.ShootFromPaddle = function (x, moveBool)
    {
        moveUp = true;
        moveLeft = moveBool;
        xSpeed = x;
        ySpeed = 10;
        isStuckToPaddle = false;
        stickOnNextHit = false;
        scene.remove(aimRay);
        paddle.HideStickyVisualiser();
    }

    //Function for the super power-up, which allows the ball to ignore collisions, and break every brick on 1 hit, resets values after 10s
    this.SuperBall = function()
    {
        superMode = true;
        material.color.set(gold);
        setTimeout(function () { superMode = false; material.color.set(white); }, 10000);
    }

    //Function for the 'Split' power-up, splits the ball into 3
    this.Split = function ()
    {
        if (!splitMode)
        {
            secondBall = new Ball();
            thirdBall = new Ball();
            ballArray.push(secondBall);
            ballArray.push(thirdBall);
            secondBall.SetXPos(mesh.position.x);
            secondBall.SetYPos(mesh.position.y);
            thirdBall.SetXPos(mesh.position.x);
            thirdBall.SetYPos(mesh.position.y);
            secondBall.SetDir(true);
            thirdBall.SetDir(false);
            scene.add(secondBall.Mesh());
            scene.add(thirdBall.Mesh());
            splitMode = true;
        }
    }

    //Function for resetting the ball after restart
    this.Reset = function ()
    {
        xSpeed = Math.random() * (12 - 5) + 5;
        stickOnNextHit = false;
        isStuckToPaddle = false;
        superMode = false;
        splitMode = true;
        moveUp = true;
        moveLeft = true;
        randomiseXDir = Math.round(Math.random());
        if (randomiseXDir == 1)
            moveLeft = false;
        mesh.position.y = -5;
        mesh.position.x = 0;
    }

    this.SetDir = function (dir)
    {
        moveLeft = dir;
    }
}