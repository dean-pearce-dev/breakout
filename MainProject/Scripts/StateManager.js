function StateManager()
{
    //Class for controlling the game state
    const gameState = Object.freeze({ "Menu": "Menu", "Game": "Game", "Pause": "Pause", "GameOver": "GameOver", "Win": "Win" });
    var currentState = gameState.Menu;

    //Function for setting the state with a number parameter
    this.SetState = function (state)
    {
        switch (state)
        {
            case 1:
                currentState = gameState.Menu;
                spriteManager.Update();
                break;
            case 2:
                currentState = gameState.Game;
                spriteManager.Update();
                break;
            case 3:
                currentState = gameState.Pause;
                spriteManager.Update();
                break;
            case 4:
                currentState = gameState.GameOver;
                spriteManager.Update();
                break;
            case 5:
                currentState = gameState.Win;
                spriteManager.Update();
                break;
        }
    }

    this.CurrentState = function ()
    {
        return currentState;
    }

    //Function for keeping track of current game state, includes update for spriteManager so that sprites are displayed at the correct time
    this.Update = function ()
    {
        var spaceIsDown = inputManager.GetSpaceState();
        var escIsDown = inputManager.GetEscState();
        var pIsDown = inputManager.GetPState();
        switch (currentState)
        {
            case 'Menu':
                if (spaceIsDown)
                {
                    currentState = gameState.Game;
                    soundManager.StopMusic();
                    Reset();
                }
                break;
            case 'Game':
                if (pIsDown)
                    currentState = gameState.Pause;
                break;
            case 'Pause':
                if (escIsDown)
                {
                    currentState = gameState.Menu;
                    soundManager.Music();
                }
                if (spaceIsDown)
                    currentState = gameState.Game;
                break;
            case 'GameOver':
                if (escIsDown)
                {
                    currentState = gameState.Menu;
                    soundManager.Music();
                }
                if (spaceIsDown)
                {
                    currentState = gameState.Game;
                    Reset();
                }
                break;
            case 'Win':
                if (escIsDown)
                {
                    currentState = gameState.Menu;
                    soundManager.Music();
                }
                if (spaceIsDown)
                {
                    currentState = gameState.Game;
                    Reset();
                }
                break;
        }
        spriteManager.Update();
    }
}