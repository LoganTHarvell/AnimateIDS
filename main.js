function mainFunction() {
  // Rendering
  let renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.setClearColor(0x6666BB, 1);
  document.body.appendChild(renderer.domElement);

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

      then = now - (elapsed % fpsInterval);

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

  // Camera Controls
  let cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.addEventListener("change",render,false);

  // Ian's Tree Code that should probably be moved later

  // Creates tree, root_id must be 0
  // Randomly places children in tree
  var tree = new Tree(0);
  for (var i=1; i < 32; i++) {
    tree.add(i, Math.floor(Math.random() * i));
  }

  console.log(tree);

  layoutTree(tree);

  // Adds node shapes to scene
  tree.traverseBF(function callback(node) {
    scene.add(node._shape);
  });

  // Function for rotating every node shape
  let rotate_tree = function() {
    tree.traverseBF(function callback(node) {
      node._shape.rotation.y += 0.05;
    })
  };

  // Main function call
  beginAnimation();
}
