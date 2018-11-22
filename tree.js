let material = new THREE.MeshNormalMaterial();
let geometry = new THREE.IcosahedronGeometry(10);

function Node(_id) {
  this._id = _id;
  this.children = [];
  this._shape = new THREE.Mesh(geometry, material);
  this._shape.position.set(0,0,0);
};

function Tree(_id) {
  this._root = new Node(_id);

  this.add_node = function(_id) {
    if(this._root == null) {
      this._root = new Node(_id);
    }
    else {
      this.add_child(new Node(_id));
    }
  };

  this.add = function(_id, to_id) {
    var child = new Node(_id),
      parent = null,
      callback = function(node) {
      	if (node._id === to_id) {
      		parent = node;
      	}
      };

    this.contains(callback);

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

  this.contains = function(callback) {
    this.traverseDF(callback);
  };
};
