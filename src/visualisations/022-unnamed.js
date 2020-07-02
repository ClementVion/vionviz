import * as THREE from 'three';

let reqId = undefined;

let analyser = undefined;
let frequencyData = undefined;

let scene = undefined;
let camera = undefined;
let renderer = undefined;

let geometries = [];
let materials = []
let objs = [];
let max = 10;
let min = 0;
let distance = (Math.PI * 2) / max;
let zInc = 0.012;
let cameraDir = 'towards';

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0b0d);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0
  camera.position.y = 0;
  camera.position.z = 6;
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

export function init(analyserToClone, frequencyDataToClone) {

  initThree();

  analyser = analyserToClone;
  frequencyData = frequencyDataToClone;

	for (let i = min; i < max; i += 1) {

		materials[i] = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );

		geometries[i] = new THREE.Geometry();

		for (let v = 0.2; v < 7; v += 0.001) {
			geometries[i].vertices.push(new THREE.Vector3(v, 0, v))
		}

		objs[i] = new THREE.Line(geometries[i], materials[i]);
		objs[i].position.x = Math.random() * 0.05 - 0.025;
		objs[i].position.y = Math.random() * 0.05 - 0.025;
		objs[i].rotation.z = distance * i;

		scene.add(objs[i])
	}

	reqId = requestAnimationFrame(animate);

}

function displaceVertices(obj, dX, dY, dZ, size, magnitude, speed, ts, index) {

  for (let i = 0; i < obj.geometry.vertices.length; i++) {
    let vertice = obj.geometry.vertices[i]
    let distance = new THREE.Vector3(vertice.x, vertice.y, vertice.z).sub(new THREE.Vector3(dX, dY, dZ))

    // vertice.x = Math.sin(distance.length() / size + (ts * index/speed)) * magnitude
    vertice.y = Math.sin(distance.length() / size + (ts * index/speed)) * magnitude
  }

  obj.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = min; i < max; i += 1) {

		displaceVertices(
			objs[i],
			0, //dX
		  0, //dY
		  0, //dZ
			frequencyData[Math.floor(Math.random() * frequencyData.length)] * 0.0005,  //size
			// frequencyData[100] * 0.0005,  //size
			frequencyData[0] * 0.0005, //magnitude
			500, //speed: the higher the slower
			ts,
			i
		)

		// objs[i].material.color.setHex((frequencyData[i + 10] / 200) * 0xffffff);
		objs[i].material.opacity = frequencyData[0] * 0.05;
		objs[i].rotation.z += frequencyData[10] * 0.0001;
		// objs[i].scale.z = frequencyData[i] * 0.01
		// objs[i].scale.x = frequencyData[i] * 0.004

		if (cameraDir === 'towards') {
			camera.position.z -= frequencyData[0] * 0.000001;
			if (camera.position.z <= 1) cameraDir = 'backwards';
		} else {
			camera.position.z += frequencyData[0] * 0.000001;
			if (camera.position.z >= 6) cameraDir = 'towards';
		}

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