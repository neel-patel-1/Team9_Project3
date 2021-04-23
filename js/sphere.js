//add event listener for ball button
const ballInit = () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
    let instr = document.createElement('p');
    instr.textContent = 'Use K and L keys to move platform - Use Mouse to move camera';
    document.querySelector('#instructions').appendChild(instr);
    //initialize camera, scene, renderer, add Orbital Controls
  
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(4,0,0);
    camera.lookAt(0,0,0);

    const scene =  new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75);
    document.getElementById("game").appendChild( renderer.domElement );
	
	
	//create canvas and context
	

	//background canvas
	let background = document.createElement('canvas');
   	background.width = 300;
    	background.height = 300;
    	backgroundContext = background.getContext('2d');
    	//backgroundContext.fillRect(0, 0, background.width, background.height);
    	
	
    	var backgroundTexture = new THREE.CanvasTexture(background);
    	//scene.background = backgroundTexture;

	
	//ball location
	let ballX = 20;
	let ballY = 80;
	let v = 1; //velocity
	let sign = 1;
	let amplitude = 50;
	let offset = 0;
	let speedY = 0;
	let c = 20;//slope of trajectory
	let dtheta = 0.1;

	let playerX = (background.width/2);//player position
	


	//draw a ball
	const geometry = new THREE.SphereGeometry(1,32,24);
	const material = new THREE.MeshBasicMaterial({map: backgroundTexture});
	const ball = new THREE.Mesh(geometry, material);
	
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 5;

	scene.add(ball);
	function animate() {
		backgroundTexture.needsUpdate = true;
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
		calcPos();
		collision();
		draw();

		
	}

	function moveCamera(){
		let p = 5;//radius of sphere

		let u = ballX*(6.28/gcanvas.width);
		let v = ballY*(3.14/gcanvas.height);
		let nx = -p*Math.cos(u)*Math.sin(v);
		let ny = p*Math.cos(v);
		let nz = p*Math.sin(u)*Math.sin(v);
		camera.position.set(nx, ny, nz);
		camera.lookAt(0,0,0);
	}
	
	function collision(){
		let h = background.height;
		let w = background.width;
		if(Math.abs(ballX-playerX) < 20 && Math.abs(ballY-(h/2))<10){
			let dfC = Math.abs(ballX-playerX)/20;//distance from center of paddle	
			switch(Math.floor(dfC*3)) {
  				case 0:
					c = 10;
					offset += (Math.PI)+(0.06);
					break;
				case 1:
					c = 2;
					offset += (Math.PI)+(0.1);
					break;
				case 2:
					c = 0.3;
					offset += (Math.PI)+(0.7);
					break;
  				default:
			} 		
		}
	}

	function draw(){
		let h = background.height;
		let w = background.width;

		backgroundContext.fillStyle='gray';
		backgroundContext.fillRect(0,0,300,300);

		backgroundContext.fillStyle='white';
		
		let x = 0;
		let y = 0;
		let grid = 30;
		for(y = 0; y < grid; y ++){
			for(x = 0; x < grid; x ++){
			backgroundContext.fillRect(x*(w/grid),y*(h/grid),(w/grid)*0.9,(h/grid)*0.9);
			}
		}

		let phi = Math.PI*ballY/h;
		let ball_h = 5;
		dtheta = ball_h/(2*Math.PI);//change in theta that gives the width
		let ball_w = ball_h/calcWidth(phi, dtheta);
		backgroundContext.fillStyle = 'blue';


		//draw ball - 3 are drawn in case the paddle goes over edge of canvas
		backgroundContext.fillRect(ballX-ball_w, ballY-ball_h, ball_w*2, ball_h*2);
		backgroundContext.fillRect(ballX-ball_w-w, ballY-ball_h, ball_w*2, ball_h*2);
		backgroundContext.fillRect(ballX-ball_w+w, ballY-ball_h, ball_w*2, ball_h*2);
		ballX = (ballX%w+w)%w;
	
		//draw paddle - 3 are drawn in case the paddle goes over edge of canvas
		backgroundContext.fillRect(playerX-20, h/2, 40, 10);
		backgroundContext.fillRect(playerX-20+w, h/2, 40, 10);
		backgroundContext.fillRect(playerX-20-w, h/2, 40, 10);

		playerX = (playerX%w+w)%w;

		//change background
		backgroundContext.drawImage(background,0,0);


	}
	//approximate horizontal arc length given phi and dtheta
	function calcWidth(phi, dtheta){
		let width = Math.sin(dtheta)*Math.sin(phi);
		width = width/(Math.sin((2*Math.PI-dtheta)/2));
		return width
	}
	function calcPos(){
		let h = background.height;
		let w = background.width;
		let theta = ballX*(2*3.1415/w) + offset;	
		let phi = Math.PI*ballY/h;
		
		

		ballY = (Math.atan(1/(c*Math.sin(theta))));
		ballY = ((ballY%Math.PI)+Math.PI)%Math.PI;
		ballY *= (h/3.1415);
		
		let mag = Math.cos(theta)*c/(c*c*Math.sin(theta)*Math.sin(theta)+1);
		mag = 1 + (mag*mag);
		mag = Math.sqrt(mag);


		ballX += v/(mag*calcWidth(phi, dtheta));
	
		ballX = (ballX%w+w)%w;
		
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

