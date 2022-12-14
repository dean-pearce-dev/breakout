function PowerUp()
{
    const color = 0xdedede;
    var colors = [0xfa4124, 0x42e85b, 0xf1ee0c, 0xf17f0c];
    var opacity = 0.3;
    var isTransparent = true;
    var castsShadow = false;
    var speed = 4;
    var radius = 0.4;
    Sphere.call(this, radius, 6, 6, color, opacity, isTransparent, castsShadow);
    const mesh = this.Mesh();
    const material = this.Material();
    var yBound = 12;
    var isDespawned = false;
    var powerUpSelector;

    //Used for checking if the power-up has 'despawned' so that the Power-Up Manager can ignore it
    this.IsDespawned = function ()
    {
        return isDespawned;
    }

    //Function used by the brick object to spawn a power-up
    this.Spawn = function (xPos, yPos)
    {
        powerUpSelector = Math.floor(Math.random() * 4);
        //Checking if more than 1 ball exists (split power-up) and if so, disables the split power-up from dropping
        if (ballArray.length > 1)
            powerUpSelector = Math.floor(Math.random() * 3);
        material.color.set(colors[powerUpSelector]);
        scene.add(mesh);
        this.SetXPos(xPos);
        this.SetYPos(yPos);
    }

    //Function for moving the power-up down
    this.Move = function ()
    {
        this.DetectCollision();
        mesh.position.y -= speed * delta;
    }

    const ray = new THREE.Vector3(0, -1, 0);
    const raycaster = new THREE.Raycaster();

    //Using a modified version of the ball DetectCollision() to only detect collision with the paddle, on collision applies the power-up, on miss destroys the power-up
    this.DetectCollision = function ()
    {
        //var currentPowerUp = mesh.uuid;
        var distance = (speed + radius) * delta;
        raycaster.set(mesh.position, ray)
        var collisions = raycaster.intersectObject(paddle.Mesh());
        if (collisions.length > 0 && collisions[0].distance <= distance)
        {
            collidedObject = collisions[0].object;
            this.ApplyPowerUp();
            this.Destroy();
            return;
        }
        else if (mesh.position.y < -yBound)
        {
            this.Destroy();
            isDespawned = true;
        }
    }

    //Function using a switch to determine which power-up to apply
    this.ApplyPowerUp = function ()
    {
        switch (powerUpSelector)
        {
            case 0:
                paddle.Extend();
                break;
            case 1:
                for (var i = 0; i < ballArray.length; i++)
                {
                    ballArray[i].StickOnNextHit(true);
                }
                break;
            case 2:
                ball.SuperBall();
                break;
            case 3:
                ball.Split();
                break;
        }
        soundManager.PowerUp();
    }
}