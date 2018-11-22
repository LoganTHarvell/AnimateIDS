let material = new THREE.MeshNormalMaterial();
let geometry = new THREE.IcosahedronGeometry(10);

function Node(_id) {
	this._id = _id;
	this.children = [];
	this._shape = new THREE.Mesh(geometry, material);
	this._shape.position.set(0,_id,0);
}

function Tree() {
  this.count = 0;
	this._root = null;

	this.add_node = function(_id) {
		if(this._root == null) {
			this._root = new Node(_id);
		}
		else {
			this._root.children.push(new Node(_id));
		}

    this.count++;
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

    (funtion recurse(node) {
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

}
