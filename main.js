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

      // Fluctuates time value
      if (uniforms.u_time.value%1.5 < 0.2) {
        factor = -(factor);
      }
      uniforms.u_time.value = uniforms.u_time.value + factor;

      // Rotates object
      shape.rotation.y += 0.05;

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

  // Field Loading
  let loadField = function(fieldInfo) {
    let geometry = new THREE.PlaneGeometry(fieldInfo.size.x, fieldInfo.size.y);

    let texLoader = new THREE.TextureLoader();
    texLoader.load(fieldInfo.texPath, onTexLoad);

    function onTexLoad(tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.offset.set( 0, 0 );
      tex.repeat.set( 2, 1 );

      let material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: tex,
      });

      let field = new THREE.Mesh(geometry, material);
      field.translateY(250);
      fieldInfo.object = field;

      scene.add(field);
    }
  }

  // Field Info
  let fieldInfo = {
    texPath: "./Textures/wood.jpeg",
    size: new THREE.Vector2(500, 500),
    object: undefined
  }

  // Material
  let material = new THREE.MeshNormalMaterial();

  // Model
  let geometry = new THREE.IcosahedronGeometry(10);
  let shape = new THREE.Mesh(geometry, material);
  shape.position.set(0, 0, 0);
  scene.add(shape);

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

  // Main Function Calls
  loadField(fieldInfo);

  beginAnimation();
}
