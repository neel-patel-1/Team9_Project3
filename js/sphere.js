//add event listener for ball button
document.querySelector('#ball').addEventListener('click', () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
    let instr = document.createElement('p');
    instr.textContent = 'ball';
    document.querySelector('#instructions').appendChild(instr);
    //initialize camera, scene, renderer, add Orbital Controls
  
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,5);
    camera.lookAt(0,0,0);

    const scene =  new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.getElementById("game").appendChild( renderer.domElement );
	
	
	//create canvas and context
	let gcanvas = document.createElement('canvas');
	document.getElementById("game").appendChild(gcanvas);
	gcanvas.width = 300;
	gcanvas.height = 300;
	let ctx = gcanvas.getContext('2d');
	ctx.fillStyle='white';
	ctx.fillRect(0,0,300,300);
	ctx.fillStyle='red';
	ctx.fillRect(0,0,100,100);

	//ball location
	let ballX = 0;
	let ballY = 0;
	
	var canvasTex = new THREE.CanvasTexture(gcanvas);


	//draw a box
	const geometry = new THREE.SphereGeometry(1,16,12);
	const material = new THREE.MeshBasicMaterial({map: canvasTex});
	const ball = new THREE.Mesh(geometry, material);
	
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	 controls.minDistance = 5;

	scene.add(ball);
	
	function animate() {
		canvasTex.needsUpdate = true;
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
		ctx.fillStyle='white';
		ctx.fillRect(0,0,300,300);
		ctx.fillStyle = 'red';
		ctx.fillRect(ballX, ballY, ballX+5, ballY+5);
		ballX -= 5; ballY -= 5;
		ballX = (ballX%gcanvas.width+gcanvas.width)%gcanvas.width;
		ballY = (ballY%gcanvas.height+gcanvas.height)%gcanvas.height;
		//material.map = canvasTex;
		//.rotation.y += 0.01;

		
	}
	animate();

});

