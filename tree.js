let material = new THREE.MeshNormalMaterial();
let geometry = new THREE.IcosahedronGeometry(10);

// Constructor for Node objects
function Node(_id) {
  this._id = _id;
  this.children = [];
  this._shape = new THREE.Mesh(geometry, material);
  this._shape.position.set(0,0,0);
};

// Constructor for Tree objects
function Tree(_id) {
  this._root = new Node(_id);

  // Adds node with given ID to a parent with the ID specified if it exists
  this.add = function(_id, to_id) {
    var child = new Node(_id),
        parent = null,
        callback = function(node) {
      	  if (node._id === to_id) {
      		  parent = node;
      	  }
        };

    this.traverseDF(callback);

    if (parent) {
    	parent.children.push(child);
    } else {
    	throw new Error('Cannot add node to a non-existent parent.');
    }
  };

  // Depth-First traversal method
  this.traverseDF = function(callback) {

    (function recurse(node) {
      for (var i = 0; i < node.children.length; i++) {
      	recurse(node.children[i]);
      }

    	callback(node);
    })(this._root);

  };

  // Iterative Deepening traversal method
  this.traverseID = function(callback) {
    let _root = this._root;
    console.log(this._root);
    var isDone = false;
    var maxLevel = 0;
    var x = 0;

    let recurse = function(node, level, maxLevel) {
      for (var i = 0; !isDone && i < node.children.length; i++) {
        if (level >= maxLevel) break;
        recurse(node.children[i], level+1, maxLevel);
      }

    	if (!isDone) isDone = callback(node);
    };

    while (!isDone) {
      recurse(_root, 0, maxLevel++);
    }
  };

  // Search function that finds a node with a specified ID
  // Search must be given a traversal method
  this.search = function(_id, traversal) {
    var parent = null,
        callback = function(node) {
          if (node._id === _id) {
            parent = node;
            return true;
          }
          else {
            return false;
          }
        };

    traversal.call(this, callback);

    if (parent) {
      console.log("Node with ID "+_id+" was found in the tree");
    } else {
      throw new Error("Node with ID "+_id+" not found");
    }
  };

};
