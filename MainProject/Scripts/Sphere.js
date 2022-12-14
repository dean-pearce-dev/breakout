function Sphere(x, y, z, color, opacity, transparentBool, shadowBool)
{
    //Basic Sphere class which the Ball and Power-Ups inherit from
    const geometry = new THREE.SphereGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
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
    this.Destroy = function ()
    {
        geometry.dispose();
        material.dispose();
        scene.remove(mesh);
    }
}