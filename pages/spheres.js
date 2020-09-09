import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats.js";
const OrbitControls = require("three-orbit-controls")(THREE);

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 150, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  var controls = new OrbitControls(camera, renderer.domElement);
  const gui = new dat.GUI({ name: "XXX" });

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  const objects = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereBufferGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  // Solar System
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  // Sun
  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  // Earth
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });

  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthOrbit);

  // Moon
  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;

  const moonMaterial = new THREE.MeshPhongMaterial({ emissive: 0x222222 });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);

  moonMesh.scale.set(0.5, 0.5, 0.5);
  earthOrbit.add(moonOrbit);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  class AxisGridHelper {
    constructor(node, units = 10) {
      const axes = new THREE.AxesHelper();
      axes.material.depthTest = false;
      axes.renderOrder = 2; // после сетки
      node.add(axes);

      const grid = new THREE.GridHelper(units, units);
      grid.material.depthTest = false;
      grid.renderOrder = 1;
      node.add(grid);

      this.grid = grid;
      this.axes = axes;
      this.visible = false;
    }
    get visible() {
      return this._visible;
    }
    set visible(v) {
      this._visible = v;
      this.grid.visible = v;
      this.axes.visible = v;
    }
  }

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  makeAxisGrid(solarSystem, "solarSystem", 26);
  makeAxisGrid(sunMesh, "sunMesh");
  makeAxisGrid(earthOrbit, "earthOrbit");
  makeAxisGrid(earthMesh, "earthMesh");
  makeAxisGrid(moonMesh, "moonMesh");

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    stats.begin();
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // objects.forEach((node) => {
    //   const axes = new THREE.AxesHelper();
    //   axes.material.depthTest = false;
    //   axes.renderOrder = 1;
    //   node.add(axes);
    // });

    objects.forEach((item) => {
      item.rotation.y = time;
    });

    renderer.render(scene, camera);

    stats.end();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
