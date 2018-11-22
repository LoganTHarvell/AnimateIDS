// Material
let material = new THREE.MeshNormalMaterial();

// Model
let geometry = new THREE.IcosahedronGeometry(10);

function Node(_id) {
	this._id = _id;
	this.children = [];
	this._shape = new THREE.Mesh(geometry, material);
	this._shape.position.set(0,0,0);
}

function Tree() {
	this._root = null;

	this.add_node = function(_id) {
		if(this._root == null) {
			this._root = new Node(_id);
		}
		else {
			this.add_child(new Node(_id));
		}
	}

	this.add_child = function(_node) {
		// If root doesn't have a child, give it one
		if(this._root.children.length == 0) {
			this._root.children.push(_node);
			return;
		}

		// The node to receive the miracle of birth
		lucky_node = this._root;

		// Will we go down a level and make this lucky node a grand-node?
		let go_down = (Math.random() >= 0.4);

		while(go_down) {
			// If we go down a level and there are children,
			// pick one to become the next lucky node
			if(lucky_node.children.length > 0) {
				index = get_random_index(lucky_node.children.length);
				lucky_node = lucky_node.children[index];
				// Check if we're going down again
				go_down = (Math.random() >= 0.4);
			}
			// Otherwise, stick to this node
			else {
				go_down = false;
			}
		}

		// Boom you have a child
		lucky_node.children.push(_node);
	}
}

function get_random_index(len) {
	return Math.floor(Math.random() * (len));
}