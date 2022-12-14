function Brick(x, y, z, hitsToBreak)
{
    //Color array, 0 = Red, 1 = Orange, 2 = Yellow, 3 = Cyan, 4 = Green
    const colors = [0xfa4124, 0xf17f0c, 0xf1ee0c, 0x03c9bd, 0x42e85b];
    const cyan = 0x03c9bd;
    var opacity = 1;
    var isTransparent = false;
    var castsShadow = true;
    Cuboid.call(this, x, y, z, cyan, opacity, isTransparent, castsShadow);
    const mesh = this.Mesh();
    const material = this.Material();
    const geometry = this.Geometry();
    mesh.userData.hitsToBreak = hitsToBreak;

    //Function for tracking hitsToBreak, and changing the color dependant on how many hits are left using an array with color values
    //Called by the BrickManager object
    this.TrackHits = function ()
    {
        var hitsToBreak = mesh.userData.hitsToBreak - 1;
        material.color.set(colors[hitsToBreak]);
    }

    //Function for destroying and removing the brick, called when a brick's hitsToBreak property reaches 0
    //Also determines whether the brick should spawn a power-up
    this.Destroy = function ()
    {
        var powerUpChance = Math.floor(Math.random() * 7);
        if (powerUpChance < 1)
        {
            const powerUp = new PowerUp();
            powerUp.Spawn(mesh.position.x, mesh.position.y);
            powerUpArray.push(powerUp);
            scene.add(powerUp.Mesh());
        }
        geometry.dispose();
        material.dispose();
        scene.remove(mesh);
        soundManager.BrickBreak();
    }

    //Function for destroying on reset without spawning a power-up
    this.ResetDestroy = function ()
    {
        geometry.dispose();
        material.dispose();
        scene.remove(mesh);
    }
}