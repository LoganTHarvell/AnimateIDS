// Constructor for Node objects
function Node(_id) {
  this._id = _id;
  this.children = [];
  var material = new THREE.MeshNormalMaterial();
  var geometry = new THREE.IcosahedronGeometry(10);
  this._shape = new THREE.Mesh(geometry, material);
  this._shape.position.set(0,0,0);

  this.level = 0;
  this.parentNode = null;
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
      child.parentNode = parent;
      child.level = parent.level+1;
    	parent.children.push(child);
    } else {
    	throw new Error('Cannot add node to a non-existent parent.');
    }
  };

  // Breadth-First traversal method
  this.traverseBF = function(callback) {
    var queue = [];

    queue.push(this._root);

    node = queue.pop();

    while(node){
      for (var i = 0, length = node.children.length; i < length; i++) {
        queue.push(node.children[i]);
      }

      callback(node);
      node = queue.pop();
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
    var isDone = false;
    var moreChildren = true;
    var maxLevel = 0;

    let recurse = function(node, level, maxLevel) {
      for (var i = 0; !isDone && i < node.children.length; i++) {
        if (level >= maxLevel) {
          moreChildren = true;
          break;
         }
        recurse(node.children[i], level+1, maxLevel);
      }

    	if (!isDone) isDone = callback(node);
    };

    while (!isDone && moreChildren) {
      recurse(_root, 0, maxLevel++);
    }
  };

  // Search function that finds a node with a specified ID
  // Search must be given a traversal method
  this.search = function(_id, traversal) {
    var shapes = [];
    var parent = null,
        callback = function(node) {
          var shape = node._shape;
          shapes.push(shape);
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
    return shapes;
  };

};
