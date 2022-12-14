function InputManager()
{
    //Class for controlling the input using booleans to determine whether a key is held down or not
    var aIsDown = false;
    var dIsDown = false;
    var pIsDown = false;
    var spaceIsDown = false;
    var shiftIsDown = false;
    var escIsDown = false;

    //Using bools to control the input because it makes it smoother and more responsive
    //When the relevant key is pressed, the bool is set to true, which allows the paddle to move
    document.addEventListener('keydown', function (event)
    {
        currentKey = event.keyCode;
        switch (currentKey)
        {
            case 65:
                aIsDown = true;
                break;
            case 68:
                dIsDown = true;
                break;
            case 32:
                spaceIsDown = true;
                break;
            case 16:
                shiftIsDown = true;
                break;
            case 27:
                escIsDown = true;
                break;
            case 80:
                pIsDown = true;
                break;
        }
    });

    //When the key is released, the bool is set back to false to stop the movement
    document.addEventListener('keyup', function (event)
    {
        currentKey = event.keyCode;
        switch (currentKey)
        {
            case 65:
                aIsDown = false;
                break;
            case 68:
                dIsDown = false;
                break;
            case 32:
                spaceIsDown = false;
                break;
            case 16:
                shiftIsDown = false;
                break;
            case 27:
                escIsDown = false;
                break;
            case 80:
                pIsDown = false;
                break;
        }
    });

    //Getters for accessing input in other classes
    this.GetAState = function ()
    {
        return aIsDown;
    }
    this.GetDState = function ()
    {
        return dIsDown;
    }
    this.GetSpaceState = function ()
    {
        return spaceIsDown;
    }
    this.GetPState = function ()
    {
        return pIsDown;
    }
    this.GetShiftState = function ()
    {
        return shiftIsDown;
    }
    this.GetEscState = function ()
    {
        return escIsDown;
    }
}