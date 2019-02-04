let scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0d);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0
camera.position.y = 0;
camera.position.z = 6;
camera.lookAt(0, 0, 0)
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let ctx = new AudioContext();
let audio = document.getElementById('audio');
let audioSrc = ctx.createMediaElementSource(audio);
let analyser = ctx.createAnalyser();
audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
let frequencyData = new Uint8Array(analyser.frequencyBinCount);


let geometries = [];
let materials = []
let objs = [];
let max = 10;
let min = 0;
let distance = Math.PI * 2 / max

init();

function init() {

	for (let i = min; i < max; i += 1) {

		materials[i] = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );

		geometries[i] = new THREE.Geometry();

		for (let v = -1; v < 5.85; v += 0.1) {
			geometries[i].vertices.push(new THREE.Vector3(i % 2 === 0 ? 0.1 : -0.1, 0, v))
		}

		objs[i] = new THREE.Line(geometries[i], materials[i]);
		// objs[i].position.z = i * 0.25;
		// objs[i].rotation.z = distance * i

		scene.add(objs[i])
	}

	animate();
}


function displaceVertices(obj, dX, dY, dZ, size, magnitude, speed, ts, index) {

  for (let i = 0; i < obj.geometry.vertices.length; i++) {
    let vertice = obj.geometry.vertices[i]
    let distance = new THREE.Vector3(vertice.x, vertice.y, vertice.z).sub(new THREE.Vector3(dX, dY, dZ))

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
		  200, //dZ
			1,  //size
			frequencyData[i] * 0.0005, //magnitude
			2500, //speed: the higher the slower
			ts,
			i
		)

		// objs[i].material.color.setHex((frequencyData[i + 10] / 200) * 0xffffff);
		// objs[i].material.opacity = frequencyData[0] * 0.05;
		// objs[i].rotation.z += frequencyData[i] * 0.001;
		// objs[i].scale.y = frequencyData[i] * 0.01
		// objs[i].scale.x = frequencyData[i] * 0.01
	}

}

function animate(ts) {
	requestAnimationFrame(animate);
	render(ts);
	renderer.render(scene, camera);
}
