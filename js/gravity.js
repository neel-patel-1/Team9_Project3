//add event listener for ball button
const gravityInit = () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
	document.querySelector('#instructions').textContent = ' ';
	
    let instr = document.createElement('p');
    instr.textContent = 'Use K and L keys to move platform - Use Mouse to move camera';
    document.querySelector('#instructions').appendChild(instr);
    //initialize camera, scene, renderer, add Orbital Controls
  
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,3);
    camera.lookAt(0,0,0);

    const scene =  new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75);
    document.getElementById("game").appendChild( renderer.domElement );
	
	let numBalls = 0;
	let balls = [];
	let veloc = [];//array of velocities for balls


	function sceneInit(){
	
		const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		scene.add( light );

		const controls = new THREE.OrbitControls( camera, renderer.domElement );
   		controls.minDistance = 3;
	}

	function addBall(xPos, yPos){
		if(numBalls < 5){
			let geometry = new THREE.SphereGeometry(0.1);
			let material = new THREE.MeshLambertMaterial( {color: 0xff0066} );
			let ball = new THREE.Mesh( geometry, material );
			scene.add( ball );
			ball.position.x = xPos;
			ball.position.y = yPos;
			numBalls ++;
			balls.push(ball);
			veloc.push([0,0,0]);
		}
	}

	function updatePositions(){
		for (let i = 0; i < numBalls; i++) {
			//f = m1, m2/r^2
			let total_force = [0,0,0];
			for(let j = 0; j < numBalls; j++){
				if(i!=j){
					let dis = [
						balls[j].position.x-balls[i].position.x,
						balls[j].position.y-balls[i].position.y,
						balls[j].position.z-balls[i].position.z
					];
					let m_dis = Math.sqrt((dis[0]*dis[0]) + (dis[1]*dis[1]) + (dis[2]*dis[2])); //square of distance

					let mag = 1/(m_dis*m_dis); //magnitude of force: 1/(distance^2)
					if(mag> 0.5){
						mag = 0.5;
					}
					let force = [mag*dis[0]/m_dis, mag*dis[1]/m_dis, mag*dis[2]/m_dis]; //normalized then multiplied by magnitude of force
					total_force[0] += force[0]*0.01;
					total_force[1] += force[1]*0.01;
					total_force[2] += force[2]*0.01;
				}
			}
			
			veloc[i][0] += total_force[0];
			veloc[i][1] += total_force[1];
			veloc[i][2] += total_force[2];

			balls[i].position.x += veloc[i][0];
			balls[i].position.y += veloc[i][1];
			balls[i].position.z += veloc[i][2];
		}
		
	}


	function animate() {
		requestAnimationFrame(animate);
		updatePositions();
		renderer.render(scene, camera);
	
		
	}
	
	sceneInit();
	animate();

	window.addEventListener('click', function(event) {
		event.preventDefault();
  		addBall(Math.random()*4-2, Math.random()*4-2)
	});

}

