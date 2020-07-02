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
let max = 100;
let min = 0;
let distance = (Math.PI * 2) / max;
let zInc = 0.012;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0
  camera.position.y = 0;
  camera.position.z = 8;
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
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

		const minV = parseInt(Math.random() * 4 - 8);
		const maxV = parseInt(Math.random() * 16 - 8);


		for (let v = minV; v < maxV; v += 0.001) {
			geometries[i].vertices.push(new THREE.Vector3(v, 0, 0))
		}

		// const y = i % 2 === 0 ? i * -0.1  : i * 0.1;
		const y = Math.random() * 10 - 5;

		objs[i] = new THREE.Line(geometries[i], materials[i]);
		// objs[i].position.x = Math.random() * 16 - 8;
		// objs[i].position.y = Math.random() * 8 - 4;
		objs[i].position.y = y;
		// objs[i].position.z = distance * i;
		// objs[i].rotation.z = Math.PI * 0.75;

		scene.add(objs[i])
	}

	reqId = requestAnimationFrame(animate);

}

function displaceVertices(obj, dX, dY, dZ, size, magnitude, speed, ts, index) {

  for (let i = 0; i < obj.geometry.vertices.length; i++) {
    let vertice = obj.geometry.vertices[i]
    let distance = new THREE.Vector3(vertice.x, vertice.y, vertice.z).sub(new THREE.Vector3(dX, dY, dZ))

    vertice.x = Math.sin(distance.length() / size + (ts * index/speed)) * magnitude
  }

  obj.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = min; i < max; i += 1) {

		// displaceVertices(
		// 	objs[i],
		// 	1, //dX
		//   1, //dY
		//   1, //dZ
		// 	0.1,  //size
		// 	frequencyData[i] * 0.005, //magnitude
		// 	2500, //speed: the higher the slower
		// 	ts,
		// 	i
		// )

		// objs[i].material.color.setHex((frequencyData[i] / 200) * 0xffffff);
		objs[i].material.opacity = frequencyData[i + 50] * 0.01;
		// objs[i].rotation.z += frequencyData[i + 10] * 0.0001;
		// objs[i].scale.x = frequencyData[i + 50] * 0.001
		// objs[i].scale.y = frequencyData[i + 50] * 0.001
		// objs[i].scale.z = frequencyData[i + 50] * 0.001
		// objs[i].scale.z = frequencyData[i] * 0.01
		
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