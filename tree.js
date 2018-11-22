// Material
let material = new THREE.MeshNormalMaterial();

// Model
let geometry = new THREE.IcosahedronGeometry(10);

function Node(_id) {
	this._id = _id;
	this.children = [];
	this._shape = new THREE.Mesh(geometry, material);
	this._shape.position.set(0,_id,0);
}

function Tree() {
	this._root = null;

	this.add_node = function(_id) {
		if(this._root == null) {
			this._root = new Node(_id);
		}
		else {
			this._root.children.push(new Node(_id));
		}
	}
}