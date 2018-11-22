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

  this.traverseDF = function(callback) {

    (function recurse(node) {
      for (var i = 0; i < node.children.length; i++) {
      	recurse(node.children[i]);
      }

    	callback(node);
    })(this._root);

  };

  this.traverseID = function(callback) {
    let _root = this._root;
    var isDone = false;
    var maxLevel = 0;
    var x = 0;

    let recurse = function(node, level, maxLevel) {
      console.log("Node "+node._id+", children: "+node.children.length);
      for (var i = 0; !isDone && i < node.children.length; i++) {
        if (level >= maxLevel) break;
        console.log("index: "+i);
        console.log("level: "+level);
        recurse(node.children[i], level+1, maxLevel);
      }

    	if (!isDone) isDone = callback(node);
    };

    while (!isDone) {
      recurse(_root, 0, maxLevel++);
      if (x < 10) console.log(x++);
      else break;
    }
  };

  this.ids = function(_id) {
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

    this.traverseID(callback);

    if (parent) {
      console.log(_id+" was found in the tree");
    } else {
      throw new Error(_id+" not found");
    }
  };

};
