import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as lil from "lil-gui";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 5;

const canvas = document.querySelector("canvas");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

let ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

let directional = new THREE.DirectionalLight(0xffffff, 3);
directional.position.set(2, 2, 2);
scene.add(directional);

const helper = new THREE.DirectionalLightHelper(directional, 2);
scene.add(helper);

let point = new THREE.PointLight(0xffffff, 1, 10, 2);
point.position.set(0.3, -1.3, 1);
scene.add(point);

const pointHelper = new THREE.PointLightHelper(point, 0.2);
scene.add(pointHelper);

// load texture
let textureLoader = new THREE.TextureLoader();
let color = textureLoader.load("./text/color.jpg");
let roughness = textureLoader.load("./text/roughness.jpg");
let normal = textureLoader.load("./text/normal_opengl.png");
// let height = textureLoader.load("./text/height.png");

const geometry = new THREE.BoxGeometry(3, 1.8, 2);
const material = new THREE.MeshStandardMaterial({
    map: color,
    roughnessMap: roughness,
    normalMap: normal,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

window.addEventListener("resize", onWindowResize, false);

// LIL-GUI for the material and mesh
const gui = new lil.GUI();

const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "metalness", 0, 1).name("Metalness");
materialFolder.add(material, "roughness", 0, 1).name("Roughness");
materialFolder.addColor(material, "color").name("Color");
materialFolder.open();

const meshFolder = gui.addFolder("Mesh");
meshFolder.add(cube.scale, "x", 0.1, 5).name("Scale X");
meshFolder.add(cube.scale, "y", 0.1, 5).name("Scale Y");
meshFolder.add(cube.scale, "z", 0.1, 5).name("Scale Z");
meshFolder.add(cube.position, "x", -10, 10).name("Position X");
meshFolder.add(cube.position, "y", -10, 10).name("Position Y");
meshFolder.add(cube.position, "z", -10, 10).name("Position Z");
meshFolder.open();

const lightFolder = gui.addFolder("Lights");

// Ambient Light controls
const ambientFolder = lightFolder.addFolder("Ambient Light");
ambientFolder.add(ambient, "intensity", 0, 2).name("Intensity");

// Directional Light controls
const directionalFolder = lightFolder.addFolder("Directional Light");
directionalFolder.add(directional, "intensity", 0, 5).name("Intensity");
directionalFolder.add(directional.position, "x", -10, 10).name("Position X");
directionalFolder.add(directional.position, "y", -10, 10).name("Position Y");
directionalFolder.add(directional.position, "z", -10, 10).name("Position Z");
directionalFolder.open();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true; // we can also use this to rotate the camera without defining the rotation for x and y axis in animate function.
controls.dampingFactor = 0.05;

function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    controls.update();

    renderer.render(scene, camera);
}

animate();
