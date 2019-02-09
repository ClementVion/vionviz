import * as THREE from 'three';

let reqId = undefined;

let analyser = undefined;
let frequencyData = undefined;

let scene = undefined;
let camera = undefined;
let renderer = undefined;

let geometries = [];
let materials = []
let lines = [];
let max = 6

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0b0d);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

export function init(analyserToClone, frequencyDataToClone) {

  initThree();

  analyser = analyserToClone;
  frequencyData = frequencyDataToClone;

	for (let i = 0; i < max; i += 1) {

		materials[i] = new THREE.LineBasicMaterial({color: 0xffffff})

		geometries[i] = new THREE.Geometry();
		for (let v = -3; v < 3; v += 0.1) {
			geometries[i].vertices.push(new THREE.Vector3(v, 0, 0));
		}

		lines[i] = new THREE.Line(geometries[i], materials[i]);

		scene.add(lines[i])
	}

	reqId = requestAnimationFrame(animate);

}

function displaceVertices(line, dX, dY, size, magnitude, speed, ts) {

  for (let i = 0; i < line.geometry.vertices.length; i++) {
    let vertice = line.geometry.vertices[i]
    let distance = new THREE.Vector2(vertice.x, vertice.y).sub(new THREE.Vector2(dX, dY))

    vertice.y = Math.sin(distance.length() / size + (ts/speed)) * magnitude
  }

  line.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = 0; i < max; i += 1) {

		for (let v = 0; v < lines[i].geometry.vertices.length; v += 1) {

			// lines[i].geometry.vertices[v].z = frequencyData[i] / 100
			displaceVertices(
				lines[i],
				0, //dX
				frequencyData[i] / 400, //dY
				frequencyData[i] / 250,  //size
				frequencyData[i] / 100, //magnitude
				1000, //speed
				ts)

		}

		// lines[i].geometry.verticesNeedUpdate = true

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