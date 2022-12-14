function Plane()
{
    //Simple class for setting up the plane
    const geometry = new THREE.PlaneGeometry(64, 64);
    const material = new THREE.MeshStandardMaterial({ color: 0x494949 })
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.position.z = -3;

    this.Mesh = function ()
    {
        return mesh;
    }
}