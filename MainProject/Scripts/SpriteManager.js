function SpriteManager()
{
    //Loading Sprites
    const gameOverMap = new THREE.TextureLoader().load('Sprites/gameover.png');
    const gameOverMat = new THREE.SpriteMaterial({ map: gameOverMap });
    const gameOver = new THREE.Sprite(gameOverMat);

    const pauseMap = new THREE.TextureLoader().load('Sprites/pause.png');
    const pauseMat = new THREE.SpriteMaterial({ map: pauseMap });
    const pause = new THREE.Sprite(pauseMat);

    const menuMap = new THREE.TextureLoader().load('Sprites/menu.png');
    const menuMat = new THREE.SpriteMaterial({ map: menuMap });
    const menu = new THREE.Sprite(menuMat);

    const winMap = new THREE.TextureLoader().load('Sprites/win.png');
    const winMat = new THREE.SpriteMaterial({ map: winMap });
    const win = new THREE.Sprite(winMat);


    //Setting sprite positions
    gameOver.scale.set(0.75, 0.75, 1);
    gameOver.position.set(0, 0, 14);
    pause.scale.set(0.75, 0.75, 1);
    pause.position.set(0, 0, 14);
    menu.scale.set(2, 1, 1);
    menu.position.set(0, 0, 14.5);
    win.scale.set(0.75, 0.75, 1);
    win.position.set(0, 0, 14);

    //Function to clear the sprites before adding the relevant sprite
    this.RemoveAllFromScene = function ()
    {
        scene.remove(gameOver);
        scene.remove(pause);
        scene.remove(menu);
        scene.remove(win);
    }

    //Simple update to switch between sprites dependant on game state
    this.Update = function ()
    {
        switch (stateManager.CurrentState())
        {
            case 'Menu':
                this.RemoveAllFromScene();
                scene.add(menu);
                break;
            case 'Game':
                this.RemoveAllFromScene();
                break;
            case 'Pause':
                this.RemoveAllFromScene();
                scene.add(pause);
                break;
            case 'GameOver':
                this.RemoveAllFromScene();
                scene.add(gameOver);
                break;
            case 'Win':
                this.RemoveAllFromScene();
                scene.add(win);
                break;
        }
    }
}