# AnimateIDS
This project is an interactive animation of the Iterative Deepening Search algorithm that performs a depth-limited search that increments gradually. This enables a Breadth-First like search pattern, where top nodes are searched first, while still using a Depth-First search method.

The project is written in HTML and JavaScript. It utilizes THREE.JS libraries to access WebGL and must be connected to the internet to access them.

It has been shown that Iterative Deepening method while most likely slower than one of the other mentioned traversal methods, it will perform similar to or better than their combined average case. The performance is most hindered by searching for deep nodes, where redundant calculations will increase exponentially to the branching factor of the tree.

## Running the Project
To run this project, the AnimateIDS directory must be hosted on a server, either local or external. Afterwards, either navigate to ids.html through a browser, or run it directly from the directory.

Your browser should now show a tree structure with a GUI in the top right corner. You may have to increase the window size to see the whole tree and refresh the browser. By typing a number or using the slider you can select a node using a number ID. The blue node indicates the node to be found in the search. Note that the nodes are in random order, with the root always being 0 and children always having an ID greater than their parents.

Clicking on the button "Run IDS" in the GUI then runs the IDS algorithm with a red node indicating the currently searched node as it performs the search.

### Copyright by Logan Harvell and Ian Holdeman
