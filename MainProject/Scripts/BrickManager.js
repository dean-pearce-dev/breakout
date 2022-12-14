function BrickManager()
{
    //Function for spawning the bricks, and pushes them into an array to be used for controlling them, and adding to a secondary array for collision
    this.SpawnBricks = function()
    {
        var totalLoops = 0;
        var hitsToBreak = 1;
        var brickXSize = 3;
        var brickYSize = 0.8;
        var brickZSize = 0.8
        var totalRows = 5;
        var totalColumns = 10;
        var xOffset = 4;
        var yOffset = 1.8;
        //xStart and yStart calculations are wrong once totalRows or totalColumns change.
        //Not enough time to correct
        var xStart = ((((brickXSize + xOffset) * totalColumns) + (brickXSize / 2)) / 4);
        var yStart = (((50 / totalRows) + (brickYSize * 2)) / totalRows);
        for (var i = 0; i < totalRows; i++)
        {
            for (var j = 0; j < totalColumns; j++)
            {
                brickArray.push(new Brick(brickXSize, brickYSize, brickZSize, hitsToBreak));
                scene.add(brickArray[totalLoops].Mesh());
                brickArray[totalLoops].SetXPos(-xStart + (xOffset * j));
                brickArray[totalLoops].SetYPos(yStart + (yOffset * i));
                collidableObjects.push(brickArray[totalLoops].Mesh());
                totalLoops++;
            }
            hitsToBreak++;
        }
    }

    //Function for updating everything the BrickManager controls, such as tracking hits for each brick, and destroying bricks with no remaining hits
    this.Update = function()
    {
        for (var i = 0; i < brickArray.length; i++)
        {
            brickArray[i].TrackHits();
            if (brickArray[i].Mesh().userData.hitsToBreak <= 0)
            {
                var currentBrick = brickArray[i].Mesh().uuid;
                var collisionArrayIndex = collidableObjects.findIndex(object => object.uuid === currentBrick);
                brickArray[i].Destroy();
                brickArray.splice(i, 1);
                collidableObjects.splice(collisionArrayIndex, 1);
            }
        }
        if (brickArray == 0 && stateManager.CurrentState() == 'Game')
        {
            stateManager.SetState(5);
            soundManager.Win();
        }
    }
}