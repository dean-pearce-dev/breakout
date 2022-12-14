function PowerUpManager()
{
    //Simple class to allow the power-ups to be controlled as a group
    this.Update = function()
    {
        if (powerUpArray.length > 0)
        {
            for (var i = 0; i < powerUpArray.length; i++)
            {
                if (powerUpArray[i].IsDespawned() == false)
                {
                    powerUpArray[i].Move();
                }
            }
        }
    }
}