function mainFunction() {
  // Rendering
  let renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.setClearColor(0x6666BB, 1);
  document.body.appendChild(renderer.domElement);

  // Globals
  var shapes_dict = {};
  var shapes = [];
  var shape_count = null;
  var frame_count = 0;
  let current_node_mat = new THREE.MeshBasicMaterial({'color':0xff0000});
  let selected_node_mat = new THREE.MeshBasicMaterial({'color':0x0000ff});
  let regular_mat = new THREE.MeshNormalMaterial();

  var gui = new dat.GUI();

  let render = function() {
    renderer.render(scene, camera);
  };

  let fpsInterval = 1000/30;
  var then;

  let beginAnimation = function() {
    then = Date.now();
    animate();
  }

  var factor = 0.01;

  let animate = function() {
    requestAnimationFrame(animate);

    let now = Date.now();
    let elapsed = now - then;

    if (elapsed > fpsInterval) {

      frame_count += 1;

      then = now - (elapsed % fpsInterval);

      // If running, after a certain time, and not at the last (designated) node
      if(controller['running'] && frame_count >= 30 && shape_count != shapes.length) {
        if(shape_count - 1 >= 0) {
          shapes[shape_count-1].material = regular_mat;
        }
        shapes[shape_count].material = current_node_mat;
        shape_count++;
        frame_count = 0;
      }
      // When running but at the last node, reset
      else if(controller['running'] && shape_count == shapes.length) {
        controller['running'] = false;
        shapes[shape_count-1].material = selected_node_mat;
        shape_count = 0;
      }

      rotate_tree();

      render();
    }
  }

  // Resizing Window
  let resize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
  };

  window.addEventListener("resize",resize, false);

  // Scene Building
  // Camera
  let scene = new THREE.Scene();
  let aspect = window.innerWidth / window.innerHeight;

  // Loads the background texture image
  let texLoader = new THREE.TextureLoader();
  background_texture = texLoader.load("./Textures/wood.jpeg");
  scene.background = background_texture;

  // let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  let camera = new THREE.OrthographicCamera(-window.innerWidth/4, window.innerWidth/4, window.innerHeight/4, -window.innerHeight/4, 0.1, 1000);
  camera.position.z = 10;

  scene.add(camera);

  // Lighting
  let keyLight = new THREE.AmbientLight(0xffffff, 0.75);
  let dirLight = new THREE.DirectionalLight(0xc88b15, 2);
  dirLight.position.set(10, 100, 100);
  scene.add(keyLight);
  scene.add(dirLight);

  // Creates tree, root_id must be 0
  // Randomly places children in tree
  var tree = new Tree(0);
  for (var i=1; i < 32; i++) {
    tree.add(i, Math.floor(Math.random() * i));
  }

  console.log(tree);

  // Adds node shapes to scene
  tree.traverseBF(function callback(node) {
    scene.add(node._shape);
    var shape = node._shape;
    shapes_dict[node._id] = shape;
  });

  // Get list of all the lines
  var lines = [];
  lines = lines.concat(layoutTree(tree));

  // Adds lines to the scene
  var lines_len = lines.length;
  for (var i = 0; i < lines_len; i++) {
    scene.add(lines[i]);
  }

  // Controller for GUI stuff
  var controller = {'id':0, 
                    'running':false, 
                    'init':false, 
                    'prev_selected_node':null
                  };

  // Function for GUI button
  var run = {'Run IDS':function(){
    if(!controller['running'] && controller['init']) {
      shapes = tree.get_shapes(Math.floor(controller['id']), tree.traverseID);
      shape_count = 0;
      controller['running'] = true;
    }
  }};

  // Add node selection to GUI
  gui.add(controller, 'id', 0, 31).onChange(function() {
    // Only work if not running
    if(!controller['running']) {
      // Don't let them instantly click default val
      if(!controller['init']) {
        controller['init'] = true;
      }
      // Change prev node back to original material only if it exists
      if(controller['prev_selected_node'] != null) {
        shapes_dict[Math.floor(controller['prev_selected_node'])].material = regular_mat;
      }
      // Change color of selected node
      shapes_dict[Math.floor(controller['id'])].material = selected_node_mat;
      controller['prev_selected_node'] = Math.floor(controller['id']);
    }
    // If running, switch ID back to what it was when we started
    else {
      controller['id'] = controller['prev_selected_node'];
    }
  });

  // GUI button
  gui.add(run, 'Run IDS');

  // Function for rotating every node shape
  let rotate_tree = function() {
    tree.traverseBF(function callback(node) {
      node._shape.rotation.y += 0.05;
    })
  };

  // Main function call
  beginAnimation();
}
