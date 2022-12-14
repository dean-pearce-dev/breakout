function SoundManager()
{
	//Class for loading sounds to use
	const listener = new THREE.AudioListener();
	const collision = new THREE.Audio(listener);
	const brickBreak = new THREE.Audio(listener);
	const gameOver = new THREE.Audio(listener);
	const powerUp = new THREE.Audio(listener);
	const win = new THREE.Audio(listener);
	const music = new THREE.Audio(listener);
	const audioLoader = new THREE.AudioLoader();

	//Music provided royalty free from www.bensound.com
	audioLoader.load('Sounds/bensound-highoctane.ogg', function (buffer)
	{
		music.setBuffer(buffer);
		music.setLoop(true);
		music.setVolume(0.5);
	});

	audioLoader.load('Sounds/collision.ogg', function (buffer)
	{
		collision.setBuffer(buffer);
		collision.setLoop(false);
		collision.setVolume(2);
	});

	audioLoader.load('Sounds/break.ogg', function (buffer)
	{
		brickBreak.setBuffer(buffer);
		brickBreak.setLoop(false);
		brickBreak.setVolume(2);
	});

	audioLoader.load('Sounds/fail.ogg', function (buffer)
	{
		gameOver.setBuffer(buffer);
		gameOver.setLoop(false);
		gameOver.setVolume(2);
	});

	audioLoader.load('Sounds/power-up.ogg', function (buffer)
	{
		powerUp.setBuffer(buffer);
		powerUp.setLoop(false);
		powerUp.setVolume(2);
	});

	audioLoader.load('Sounds/win.ogg', function (buffer)
	{
		win.setBuffer(buffer);
		win.setLoop(false);
		win.setVolume(2);
	});


	this.Listener = function ()
	{
		return listener;
	}

	//Functions for playing various sounds
    this.Collision = function ()
	{
		if (collision.isPlaying)
			collision.stop();
		collision.play();
	}

	this.BrickBreak = function ()
	{
		if (brickBreak.isPlaying)
			brickBreak.stop();
		brickBreak.play();
	}

	this.GameOver = function ()
	{
		if (gameOver.isPlaying)
			gameOver.stop();
		gameOver.play();
	}

	this.PowerUp = function ()
	{
		if (powerUp.isPlaying)
			powerUp.stop();
		powerUp.play();
	}

	this.Win = function ()
	{
		if (win.isPlaying)
			win.stop();
		win.play();
	}

	this.Music = function ()
	{
		music.play();
	}

	this.StopMusic = function ()
	{
		music.stop();
	}
}