import * as THREE from 'three';

let reqId = undefined;

let analyserClone = undefined;
let frequencyDataClone = undefined;

let scene = undefined;
let camera = undefined;
let renderer = undefined;

let geometries = [];
let materials = []
let objs = [];
let max = 100;
let min = 0;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0b0d);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5);
  camera.position.x = 0
  camera.position.y = 0;
  camera.position.z = 6;
  camera.lookAt(0, 0, 0)
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

export function init(analyser, frequencyData) {

  initThree();

  analyserClone = analyser;
  frequencyDataClone = frequencyData;

	for (let i = min; i < max; i += 1) {

		materials[i] = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );

		geometries[i] = new THREE.Geometry();

		for (let v = -2; v < 12; v += 0.1) {
			geometries[i].vertices.push(new THREE.Vector3(0.2, 0, v))
		}

		objs[i] = new THREE.Line(geometries[i], materials[i]);
		scene.add(objs[i])
	}

	reqId = requestAnimationFrame(animate);

}

function displaceVertices(obj, dX, dY, dZ, size, magnitude, speed, ts) {

  for (let i = 0; i < obj.geometry.vertices.length; i++) {
    let vertice = obj.geometry.vertices[i]
    let distance = new THREE.Vector3(vertice.x, vertice.y, vertice.z).sub(new THREE.Vector3(dX, dY, dZ))

    vertice.y = Math.sin(distance.length() / size + (ts/speed)) * magnitude
  }

  obj.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyserClone.getByteFrequencyData(frequencyDataClone);

	for (let i = min; i < max; i += 1) {

		displaceVertices(
			objs[i],
			0, //dX
		  0, //dY
		  200, //dZ
			1,  //size
			frequencyDataClone[i] * 0.0075, //magnitude
			1000, //speed
			ts
		)

		objs[i].rotation.z += frequencyDataClone[i] * 0.0001
	}

}

function animate(ts) {
	reqId = requestAnimationFrame(animate);
	render(ts);
	renderer.render(scene, camera);
}

export function stop() {
  cancelAnimationFrame(reqId);
}