function layoutTree(tree) {

  // Prepare Nodes
  addLayoutPropertiesToNode(tree._root);
  console.log(tree);

  performLayout(tree._root);

  // Draw Boxes
  positionNode(tree._root);

  // Draw Lines
  var final_lines = [].concat(drawLines(tree._root));

  return final_lines;
}

function drawLines(node) {

  var lines = [];
  if (node.children && node.children.length > 0) { // Has children
    for (var j = 0; j < node.children.length; j++) {

      lines = lines.concat(drawLineH(node.ChildrenConnectorPoint,
                            node.children[j].ParentConnectorPoint));

      // Children
      lines = lines.concat(drawLines(node.children[j]));
    }
  }

  return lines;
}

function drawLineH(startPoint, endPoint) {

  // Half path between start en end Y point
  var midY = (startPoint.Y + ((endPoint.Y - startPoint.Y) / 2));

  var lines = [];

  // Start segment
  lines.push(drawLineSegment(startPoint.X, startPoint.Y, startPoint.X, midY));

  // Intermediate segment
  // The lower value will be the starting point
  var imsStartX = startPoint.X < endPoint.X ? startPoint.X : endPoint.X;
  // The lower value will be the starting point
  var imsEndX = startPoint.X > endPoint.X ? startPoint.X : endPoint.X;
  lines.push(drawLineSegment(imsStartX, midY, imsEndX, midY));

  // End segment
  lines.push(drawLineSegment(endPoint.X, midY, endPoint.X, endPoint.Y));

  return lines;
}

function drawLineSegment(startX, startY, endX, endY) {

  var material = new THREE.LineBasicMaterial({
    color: 0x00ffff
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( startX, startY, 0 ),
    new THREE.Vector3( endX, endY, 0 ),
  );

  var line = new THREE.Line( geometry, material );

  return line;
}

function positionNode(node) {

  node._shape.position.set(node.X, node.Y, 0);

  // Draw children
  if (node.children && node.children.length > 0) { // Has Children
    for (var i = 0; i < node.children.length; i++) {
      positionNode(node.children[i]);
    }
  }
}

function performLayout(node) {

  var nodeH = 20;
  var nodeW = 20;
  var nodeMarginX = 15;
  var nodeMarginY = 20;

  var nodeX = -200; // defaultValue

  // Recursively lays out children then the current node
  if (node.children && node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
      performLayout(node.children[i]);
    }
  }

  if (node.children && node.children.length > 0) {

    var childrenW = (node.children[node.children.length - 1].X +
                      node.children[node.children.length - 1].W) - node.children[0].X;
    nodeX = (node.children[0].X + (childrenW / 2)) - (nodeW / 2);

    // Move overlapping nodes to the right
    if (node.leftNode && ((node.leftNode.X + node.leftNode.W + nodeMarginX) > nodeX)) {
      var newX = node.leftNode.X + node.leftNode.W + nodeMarginX;
      var diff = newX - nodeX;
      /// Move also my children
      MoveRight(node.children, diff);
      nodeX = newX;
    }
  }
  else {
    // positions current node to the right of its left node
    if (node.leftNode)
      nodeX = node.leftNode.X + node.leftNode.W + nodeMarginX;
  }

  node.X = nodeX;

  // Sets height based on level
  node.Y = -((nodeMarginY * (node.level + 1)) + (nodeH * (node.level + 1)));
  node.Y += 200;

  // Sets node dimensions
  node.H = nodeH;
  node.W = nodeW;

  // Calculate Connector Points
  var pointX = nodeX;
  var pointY = node.Y;
  node.ChildrenConnectorPoint = { X: pointX, Y: pointY, Layout: "Horizontal" };
  node.ParentConnectorPoint = { X: pointX, Y: pointY, Layout: "Horizontal" };
}

function MoveRight(nodes, distance) {
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].X += distance;
        if (nodes[i].ParentConnectorPoint) nodes[i].ParentConnectorPoint.X += distance;
        if (nodes[i].ChildrenConnectorPoint) nodes[i].ChildrenConnectorPoint.X += distance;
        if (nodes[i].Nodes) {
            MoveRight(nodes[i].Nodes, distance);
        }
    }
}

function addLayoutPropertiesToNode(node, leftNode, rightLimits) {

  if (leftNode == undefined) leftNode = null;
  if (rightLimits == undefined) rightLimits = new Array();

  node.leftNode = leftNode;

  if (node.children && node.children.length > 0) {

    for (var i = 0; i < node.children.length; i++) {
      var left = null;
      if (i == 0 && rightLimits[node.level] != undefined)
        left = rightLimits[node.level];
      if (i > 0)
        left = node.children[i - 1];
      if (i == (node.children.length - 1))
        rightLimits[node.level] = node.children[i];

      addLayoutPropertiesToNode(node.children[i], left, rightLimits);
    }
    
  }
}
