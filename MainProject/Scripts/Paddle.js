function Paddle()
{
    const purple = 0x4b0082;
    const green = 0x338540;
    var speed = 35;
    var opacity = 1;
    var isTransparent = false;
    var castsShadow = true;
    var xBound = 22.5;
    var width = 5;
    var height = 0.8;
    var depth = 0.8;
    Cuboid.call(this, width, height, depth, purple, opacity, isTransparent, castsShadow);
    const mesh = this.Mesh();
    var aimSpeed = 20;
    var aimDir = 0;
    var aimBound = 25;
    var isExtended = false;
    var stickyVisualiser = new Cuboid(width, height / 8, depth, green, opacity / 2, true, false);

    //Functions for a visualiser so the player knows when the Stick power-up is active
    this.ShowStickyVisualiser = function ()
    {
        scene.add(stickyVisualiser.Mesh());
    }

    this.HideStickyVisualiser = function ()
    {
        scene.remove(stickyVisualiser.Mesh());
    }

    //Function to get width, used within the ball object to assist calculations for determining collision point on the paddle
    this.GetWidth = function ()
    {
        if (!isExtended)
            return width;
        if (isExtended)
            return width * 1.5;
    }

    //Function for Updating everything related to modifying the paddle
    this.Update = function ()
    {
        stickyVisualiser.SetXPos(mesh.position.x);
        stickyVisualiser.SetYPos(mesh.position.y + (height / 2));
        //Getting input states
        var aIsDown = inputManager.GetAState();
        var dIsDown = inputManager.GetDState();
        var spaceIsDown = inputManager.GetSpaceState();
        var shiftIsDown = inputManager.GetShiftState();
        //Speed modifier for shift key
        if (shiftIsDown)
            speed = 15;
        else if (shiftIsDown == false)
            speed = 35;
        //Input for movement, with conditionals for a power-up to aim the ball if stuck to the paddle
        if (aIsDown)
        {
            var currentXPos = this.GetXPos();
            if (currentXPos >= -xBound && ball.IsStuckToPaddle() == false)
            {
                var targetPos = currentXPos -= (speed * delta);
                this.SetXPos(targetPos);
            }
            if (ball.IsStuckToPaddle() == true && aimDir > -aimBound)
            {
                aimDir -= aimSpeed * delta;
                ball.AimFromPaddle(aimDir);
            }
        }
        if (dIsDown)
        {
            var currentXPos = this.GetXPos();
            if (currentXPos <= xBound && ball.IsStuckToPaddle() == false)
            {
                var targetPos = currentXPos += (speed * delta);
                this.SetXPos(targetPos);
            }
            if (ball.IsStuckToPaddle() == true && aimDir < aimBound)
            {
                aimDir += aimSpeed * delta;
                ball.AimFromPaddle(aimDir);
            }
        }
        //Shoot the paddle with space, changes speed based on aim angle to simulate aiming, uses an arrow helper within the ball object to visualize aim direction
        if (spaceIsDown && ball.IsStuckToPaddle() == true)
        {
            var moveLeft = false;
            if (aimDir < 0)
                moveLeft = true;
            var shootSpeed = Math.abs((aimBound / 15) * aimDir);
            if (moveLeft)
                ball.ShootFromPaddle(shootSpeed, moveLeft)
            if (!moveLeft)
                ball.ShootFromPaddle(shootSpeed, moveLeft)
            aimDir = 0;
        }
    }

    //Function for the extend power-up, resets values after 20s
    this.Extend = function ()
    {
        isExtended = true;
        mesh.scale.x = 1.5;
        stickyVisualiser.Mesh().scale.x = 1.5;
        setTimeout(function () { mesh.scale.x = 1; stickyVisualiser.Mesh().scale.x = 1; isExtended = false; }, 20000);
    }
}