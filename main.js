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

  let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 275;
  // camera.position.y = 250;
  // camera.up = new THREE.Vector3(0, 1, 0);
  // camera.lookAt(new THREE.Vector3(250, 0, 0));
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

  var tree = new Tree();
  tree.add_node(25);
  tree.add_node(60);

  if(tree._root != null) {
    scene.add(tree._root._shape);

    tree._root.children.forEach(function(_node) {
      scene.add(_node._shape);
    });
  }

  console.log(tree.count);
  
  // Main function call
  beginAnimation();
}
