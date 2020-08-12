import * as THREE from "three";
import { fromEvent, interval } from "rxjs";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
let renderer = new THREE.WebGL1Renderer();

function setSize() {
  renderer.setSize(window.innerWidth - 5, window.innerHeight - 5);
  camera.aspect = window.innerWidth / window.innerHeight;
}

window.addEventListener("resize", setSize);

setSize();

document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(10, 10, 10);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 25;

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  cube.position.x += 0.1;
  cube.position.y += 0.1;
  // animate();
}

render();
