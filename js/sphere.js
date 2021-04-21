//add event listener for ball button
const ballInit = () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
	document.querySelector('#instructions').textContent = ' ';
	
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
	//document.getElementById("game").appendChild(gcanvas);
	gcanvas.width = 300;
	gcanvas.height = 300;
	let ctx = gcanvas.getContext('2d');
	ctx.fillStyle='white';
	ctx.fillRect(0,0,300,300);
	ctx.fillStyle='red';
	ctx.fillRect(0,0,100,100);
	var texture = new THREE.CanvasTexture(gcanvas);


	//background canvas for 2d display
	let background = document.createElement('canvas');
    background.width = window.innerWidth;
    background.height = window.innerHeight;
    backgroundContext = background.getContext('2d');
    backgroundContext.fillRect(0, 0, background.width, background.height);
    
    var backgroundTexture = new THREE.CanvasTexture(background);
    scene.background = backgroundTexture;

	//ball location
	let ballX = 20;
	let ballY = 80;
	let v = 1; //velocity
	let sign = 1;
	let amplitude = 50;
	let offset = 0;
	let speedY = 0;
	let prevY = 0;
	let c = 5;//slope of trajectory

	let playerX = (gcanvas.width/2);//player position
	
	var canvasTex = new THREE.CanvasTexture(gcanvas);


	//draw a ball
	const geometry = new THREE.SphereGeometry(1,32,24);
	const material = new THREE.MeshBasicMaterial({map: canvasTex});
	const ball = new THREE.Mesh(geometry, material);
	
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	 controls.minDistance = 5;

	scene.add(ball);
	
	function animate() {
		canvasTex.needsUpdate = true;
		backgroundTexture.needsUpdate = true;
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

		let theta = ballX*(2*3.1415/w) + offset;
		//derivative of great circle path
			
		//change background
		backgroundContext.drawImage(gcanvas,0,0);
		
		ballY = (Math.atan(1/(c*Math.sin(theta))));
		ballY = ((ballY%Math.PI)+Math.PI)%Math.PI;
		ballY *= (h/3.1415);
		//console.log(dY);
		
		let dtoE = Math.abs(ballY-(h/2))/(h/2)+2;
		
		

		ballX += v;
		ballX = (ballX%w+w)%w;

		if(Math.abs(ballX-playerX) < 20 && Math.abs(ballY-(h/2))<10){
			c = Math.random()*4+0.25;//2/(Math.abs(ballX-playerX) + 0.1);
			offset += (Math.PI)+(0.4/c);
			//offset += (0.04/c);	
		}
	}
	animate();
	
	window.addEventListener('keydown', function(event) {
		event.preventDefault();
  		if (event.code == 'KeyK') {
  			playerX -= 5;
  		}else if(event.code == 'KeyL'){
			playerX += 5;
		}
	});
}

