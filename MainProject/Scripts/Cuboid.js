function Cuboid(x, y, z, color, opacity, transparentBool, shadowBool)
{
    //Basic Cuboid class which the paddle and bricks inherit from
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshPhongMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    material.color.set(color);
    material.transparent = transparentBool;
    material.opacity = opacity;
    mesh.castShadow = shadowBool;

    this.Mesh = function ()
    {
        return mesh;
    }
    this.Material = function ()
    {
        return material;
    }
    this.Geometry = function ()
    {
        return geometry;
    }
    this.GetXPos = function ()
    {
        return mesh.position.x;
    }
    this.GetYPos = function ()
    {
        return mesh.position.y;
    }
    this.GetZPos = function ()
    {
        return mesh.position.z;
    }
    this.SetXPos = function (nextPos)
    {
        mesh.position.x = nextPos;
    }
    this.SetYPos = function (nextPos)
    {
        mesh.position.y = nextPos;
    }
    this.SetZPos = function (nextPos)
    {
        mesh.position.z = nextPos;
    }
    this.SetDimensions = function (x, y, z)
    {
        mesh.scale.set(x, y, z);
    }
}