//add event listener for ball button
const gravityInit = () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
	document.querySelector('#instructions').textContent = ' ';
	
    let instr = document.createElement('p');
    instr.textContent = 'Press A to add a ball';
    document.querySelector('#instructions').appendChild(instr);
	
    let slider1 = document.createElement("input");
    slider1.setAttribute("type", "range");
    document.getElementById("game").appendChild(slider1);
	
    let slider2 = document.createElement("input");
    slider2.setAttribute("type", "range");
    document.getElementById("game").appendChild(slider2);
	
    //initialize camera, scene, renderer, add Orbital Controls
  
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,3);
    camera.lookAt(0,0,0);

    const scene =  new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75);
    document.getElementById("game").appendChild( renderer.domElement );
	
	let grav_mag = 0.01;
	let air_resist = 0.95;
	
	let radius = 0.3;		

	let numBalls = 0;
	let balls = [];
	let veloc = [];//array of velocities for balls

	const geometry = new THREE.SphereGeometry(radius);
	const material = new THREE.MeshLambertMaterial( {color: 0xf20066} );
	const ball = new THREE.Mesh( geometry, material );
	scene.add( ball );
	balls.push(ball);
	numBalls ++;
	veloc.push([0,0,0]);
	


	function sceneInit(){
	
		const light = new THREE.HemisphereLight( 0x0fffbb, 0xf80820, 1 );
		scene.add( light );

		const controls = new THREE.OrbitControls( camera, renderer.domElement );
   		controls.minDistance = 3;
	}

	function addBall(){
		if(numBalls < 5){
			let geometry = new THREE.SphereGeometry(radius);
			let material = new THREE.MeshLambertMaterial( {color: 0xff0066} );
			let ball = new THREE.Mesh( geometry, material );
			scene.add( ball );
			ball.position.x = Math.random()*6-3;
			ball.position.y = Math.random()*6-3;
			ball.position.z = Math.random()*6-3;
			numBalls ++;
			balls.push(ball);
			veloc.push([0,0,0]);//[Math.random()*0.1-0.05,Math.random()*0.1-0.05,Math.random()*0.1-0.05]);
		}
	}
	
	function getMagnitude(vector){
		let magnitude = Math.sqrt((vector[0]*vector[0]) + (vector[1]*vector[1]) + (vector[2]*vector[2]));
		return magnitude;
	}

	function subtractPositions(pos1, pos2){ //positions of meshes have to be treated differently from arrays
		let dis = [
			pos1.x - pos2.x,
			pos1.y - pos2.y,
			pos1.z - pos2.z
		];
		return dis;
	}
	
	function subtractVectors(v1, v2){

		let dis = [
			v1[0]-v2[0],
			v1[0]-v2[0],
			v1[0]-v2[0]
		];
		return dis;
	}

	function getReflectVector(dif, incoming){//normal vector and incoming velocity vector
		//project incoming vector onto normal vector, update normal to new size
		//subtract incoming from normal
		//add the difference to normal
		let new_vel = [0,0,0];
		let normal = project(incoming, dif);
		let dis_to_normal = subtractVectors(normal, incoming);
		new_vel[0] = [
			dis_to_normal[0]+normal[0],
			dis_to_normal[1]+normal[1],
			dis_to_normal[2]+normal[2],
		];
		return new_vel;//returns new velocity vector
		
	}
	
	function dot(vec1, vec2){
		let dot = (vec1[0]*vec2[0]) + (vec1[1]*vec2[1]) + (vec1[2]*vec2[2]);
		return dot;
	}

	function scalar(scalar, vec){
		let product = [scalar*vec[0], scalar*vec[1], scalar*vec[2]];
		return product;
	}

	function project(vec1, vec2){//vec2 is the target
		//proju(v) = v/|v| * (u*v)/|v|
		let magvec2 = getMagnitude(vec2);
		if(magvec2 < 0.01){
			magvec2 = 0.01;
		}
		let new_mag = dot(vec1, vec2)/(magvec2*magvec2);
		let proj = scalar(new_mag, vec2);
		return proj;
	}


	
	function updatePositions(){
		for (let i = 0; i < numBalls; i++) {
			let total_force = [0,0,0];
			let collision = -1;
			for(let j = 0; j < numBalls; j++){
				if(i!=j){
					let dis = subtractPositions(balls[j].position, balls[i].position);
					let m_dis = getMagnitude(dis); //square of distance

					let mag = 1;///(m_dis); //magnitude of force: 1/(distance^2)
					if(mag> 0.5){
						mag = 0.5;
					}
					let force = [mag*dis[0]/m_dis, mag*dis[1]/m_dis, mag*dis[2]/m_dis]; //normalized then multiplied by magnitude of force
					total_force[0] += force[0]*grav_mag;
					total_force[1] += force[1]*grav_mag;
					total_force[2] += force[2]*grav_mag;
					
					//check for collisions
					if(m_dis < radius*2){ 
						collision = j;
					}
				}
			}
			
			if(i!=0){ //don't update position of first ball
				if(collision>=0){

					let dis = subtractPositions(balls[collision].position, balls[i].position);
					let mag_force = getMagnitude(total_force);
					let norm = scalar(0.05/getMagnitude(dis), dis);
					
					total_force[0] -= norm[0];
					total_force[1] -= norm[1];
					total_force[2] -= norm[2];
					
					let mag_force2 = getMagnitude(total_force);
					
					total_force = scalar(mag_force/mag_force2, total_force);
				}
				updateVelPos(i, total_force);

			}
		}
		
	}

	function updateVelPos(i, total_force){
		veloc[i][0] += total_force[0];	//assume mass is 1, so treat force as acceleration
		veloc[i][1] += total_force[1];
		veloc[i][2] += total_force[2];
		
		veloc[i] = scalar(air_resist, veloc[i]);

		balls[i].position.x += veloc[i][0];
		balls[i].position.y += veloc[i][1];
		balls[i].position.z += veloc[i][2];
	}
	function animate() {
		requestAnimationFrame(animate);
		updatePositions();
		renderer.render(scene, camera);
	
		
	}
	
	sceneInit();
	animate();

	window.addEventListener('keydown', function(event) {
		event.preventDefault();
  		if (event.code == 'KeyA') {
  			addBall();
  		}
	});
	slider1.oninput = function() {
  		 console.log(this.value);
		 grav_mag = this.value/800;
	} 
	
	slider2.oninput = function() {
  		 console.log(this.value);
		 air_resist = 1-this.value/800;
	} 

}

