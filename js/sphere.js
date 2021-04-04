//add event listener for ball button
document.querySelector('#ball').addEventListener('click', () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
    let instr = document.createElement('p');
    instr.textContent = 'ball';
    document.querySelector('#instructions').appendChild(instr);
    //initialize camera, scene, renderer, add Orbital Controls
  
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(4,0,0);
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
	let ballX = 20;
	let ballY = 80;
	let v = 2; //velocity
	let sign = 1;
	let amplitude = 50;
	let offset = 0;

	let playerX = (gcanvas.width/2);//player position
	
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
		draw();

		
	}


	function draw(){
		let h = gcanvas.height;
		let w = gcanvas.width;

		ctx.fillStyle='gray';
		ctx.fillRect(0,0,300,300);

		ctx.fillStyle='white';
		
		let x = 0;
		let y = 0;
		let grid = 30;
		for(y = 0; y < grid; y ++){
			for(x = 0; x < grid; x ++){
			ctx.fillRect(x*(w/grid),y*(h/grid),(w/grid)*0.9,(h/grid)*0.9);
			}
		}
		
		ctx.fillStyle = 'blue';
		ctx.fillRect(ballX, ballY, 10, 10);
		
		ctx.fillRect(playerX-20, h/2, 40, 10);

		
			
		ballX += v; 

		if(Math.abs(ballX-playerX)<20 && Math.abs(ballY-(h/2))<10){
			sign *= -1;
			amplitude = Math.random()*30+40;
			offset -= (w/4);
		}
		
		//set y coordinate
		ballY = sign*amplitude*Math.sin(ballX*(6.48/w)+offset)+(h/2);

		
		ballX = (ballX%w+w)%w;
	}
	animate();
	
	window.addEventListener('keydown', function(event) {
		event.preventDefault();
  		if (event.code == 'KeyK') {
  			playerX -= 10;
  		}else if(event.code == 'KeyL'){
			playerX += 10;
		}
	});
});

