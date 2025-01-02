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

// All the lights
const highIntensityLight = new THREE.DirectionalLight(0xffffff, 1);
highIntensityLight.position.set(10, 20, 15);
scene.add(highIntensityLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

// All the helpers for the lights
const highIntensityLightHelper = new THREE.DirectionalLightHelper(
    highIntensityLight,
    5
);
scene.add(highIntensityLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5
);
scene.add(directionalLightHelper);

// const ambientLightHelper = new THREE.AmbientLightHelper(ambientLight, 5);
// scene.add(ambientLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
scene.add(pointLightHelper);

// load texture

let textureLoader = new THREE.TextureLoader();
let color = textureLoader.load("./text/color.jpg");
let roughness = textureLoader.load("./text/roughness.jpg");
let normal = textureLoader.load("./text/normal_opengl.png");
let height = textureLoader.load("./text/height.png");

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
