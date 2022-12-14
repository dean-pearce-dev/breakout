function Spotlight()
{
    //Simple class to set up the light for the scene
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 20);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 500;
    spotLight.shadow.camera.fov = 80;

    this.Source = function ()
    {
        return spotLight;
    }
}