let material = new THREE.MeshNormalMaterial();
let geometry = new THREE.IcosahedronGeometry(10);

function Node(_id) {
	this._id = _id;
	this.children = [];
	this._shape = new THREE.Mesh(geometry, material);
	this._shape.position.set(0,0,0);
};

function Tree(_id) {
  this.count = 1;
	this._root = new Node(_id);

	this.add_node = function(_id) {
		if(this._root == null) {
			this._root = new Node(_id);
		}
		else {
			this.add_child(new Node(_id));
		}
		this.count++;
	};

	this.add_child = function(_node) {
		// If root doesn't have a child, give it one
		if(this._root.children.length == 0) {
			this._root.children.push(_node);
			return;
		};

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
	};

	this.add = function(_id, to_id, traversal) {
    var child = new Node(_id),
        parent = null,
        callback = function(node) {
        	if (node._id === to_id) {
        		parent = node;
        	}
        };

    this.contains(callback, traversal);

    if (parent) {
    	parent.children.push(child);
    	child.parent = parent;
    } else {
    	throw new Error('Cannot add node to a non-existent parent.');
    }
	};

	this.traverseDF = function(callback) {

		(function recurse(node) {
			for (var i = 0; i < node.children.length; i++) {
		    	recurse(node.children[i]);
			}

		  	callback(node);
		})(this._root);

	};

	this.traverseBF = function(callback) {
		var queue = new Queue();

		queue.enqueue(this._root);

		node = queue.dequeue();

		while(node) {
		  for (var i = 0; i < node.children.length; i++) {
		    queue.enqueue(node.children[i]);
		  }

		  callback(node);
		  node = queue.dequeue();
		}
	};

	this.contains = function(callback, traversal) {
		traversal.call(this, callback);
	};
};

function get_random_index(len) {
	return Math.floor(Math.random() * (len));
};
