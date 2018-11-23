//Copyright (c) 2012, Cristhian Fernández Villalba
//All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following
// conditions are met:
// * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
//   in the documentation and/or other materials provided with the distribution.
// * Neither the name of crisfervil nor the names of its contributors may be used to endorse or promote products
//   derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
// OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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

  // Intermidiate segment
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

  // Before Layout this Node, Layout its children
  if (node.children && node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
      performLayout(node.children[i]);
    }
  }

  if (node.children && node.children.length > 0) { // If Has Children

    // My left is in the center of my children
    var childrenW = (node.children[node.children.length - 1].X + 
                      node.children[node.children.length - 1].W) - node.children[0].X;
    nodeX = (node.children[0].X + (childrenW / 2)) - (nodeW / 2);

    // Is my left over my left node?
    // Move it to the right
    if (node.LeftNode && ((node.LeftNode.X + node.LeftNode.W + nodeMarginX) > nodeX)) {
      var newX = node.LeftNode.X + node.LeftNode.W + nodeMarginX;
      var diff = newX - nodeX;
      /// Move also my children
      MoveRight(node.children, diff);
      nodeX = newX;
    }
  }
  else {
    // My left is next to my left sibling
    if (node.LeftNode)
      nodeX = node.LeftNode.X + node.LeftNode.W + nodeMarginX;
  }

  node.X = nodeX;

  // The top depends only on the level
  node.Y = -((nodeMarginY * (node.level + 1)) + (nodeH * (node.level + 1)));
  node.Y += 200;
  // Size is constant
  node.H = nodeH;
  node.W = nodeW;

  // Calculate Connector Points
  // Child: Where the lines get out from to connect this node with its children
  var pointX = nodeX;
  var pointY = node.Y;
  node.ChildrenConnectorPoint = { X: pointX, Y: pointY, Layout: "Horizontal" };
  // Parent: Where the line that connect this node with its parent end
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

  node.LeftNode = leftNode;

  if (node.children && node.children.length > 0) { // Has children
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
