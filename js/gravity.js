//add event listener for ball button
const gravityInit = () => {
    //clear child elements of game div
	

    document.querySelector('#game').textContent = ' ';
	document.querySelector('#instructions').textContent = ' ';
	
    let instr = document.createElement('p');
    instr.textContent = 'Press A to add a ball, use slider to change gravity strength';
    document.querySelector('#instructions').appendChild(instr);
	
    let slider1 = document.createElement("input");
    slider1.setAttribute("type", "range");
    document.getElementById("game").appendChild(slider1);
	
	let testButton = document.createElement("input");
	testButton.setAttribute("type", "button");
	testButton.setAttribute("value", "One-click Test");
	document.getElementById("game").appendChild(testButton);
	
	
    //initialize camera, scene, renderer, add Orbital Controls
  
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,3);
    camera.lookAt(0,0,0);

    const scene =  new THREE.Scene();

 	let renderer;
	let light;
	let controls;
	
	let grav_mag = 0.01;
	let air_resist = 0.95;
	
	let radius = 0.3;		

	let numBalls = 0;
	let balls = [];
	let veloc = [];//array of velocities for balls

	


	function sceneInit(){
		renderer = new THREE.WebGLRenderer();
    		renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75);
    		document.getElementById("game").appendChild( renderer.domElement );

		light = new THREE.HemisphereLight( 0xffffff, 0x130820, 1 );
		scene.add( light );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
   		controls.minDistance = 3;
	}

	function addBall(){
		if(numBalls < 5){
			let geometry = new THREE.SphereGeometry(radius);
			let material = new THREE.MeshLambertMaterial( {color: 0xff0066} );
			let ball = new THREE.Mesh( geometry, material );
			scene.add( ball );
			ball.position.x = Math.random()*10-5;
			ball.position.y = Math.random()*10-5;
			ball.position.z = Math.random()*10-5;
			numBalls ++;
			balls.push(ball);
			veloc.push([Math.random()*0.1-0.05,Math.random()*0.1-0.05,Math.random()*0.1-0.05]);
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
		let total_force = [];
		for (let i = 0; i < numBalls; i++) {
			total_force.push([0,0,0]);
			let collision = -1;
			for(let j = 0; j < numBalls; j++){
				if(i!=j){
					let dis = subtractPositions(balls[j].position, balls[i].position);
					let m_dis = getMagnitude(dis);

					let mag = 1/(m_dis); //magnitude of force: 1/(distance^2)
					if(mag> 0.5){
						mag = 0.5;
					}
					let force = [mag*dis[0]/m_dis, mag*dis[1]/m_dis, mag*dis[2]/m_dis]; //normalized then multiplied by magnitude of force
					total_force[i][0] += force[0]*grav_mag;
					total_force[i][1] += force[1]*grav_mag;
					total_force[i][2] += force[2]*grav_mag;
					
					//check for collisions
					if(m_dis < radius*2){ 
						collision = j;
					}
				}
			}
			
			
			if(collision>=0){
				let dis = subtractPositions(balls[collision].position, balls[i].position);
				let mag_force = getMagnitude(total_force);
				let norm = scalar(0.2/getMagnitude(dis), dis);
				
				total_force[i][0] -= norm[0];
				total_force[i][1] -= norm[1];
				total_force[i][2] -= norm[2];
				
			}
			updateVel(i, total_force[i]);
		}
		for (let i = 0; i < numBalls; i++) {
			updatePos(i);
		}
		
	}

	function updateVel(i, total_force){
		veloc[i][0] += total_force[0];	//assume mass is 1, so treat force as acceleration
		veloc[i][1] += total_force[1];
		veloc[i][2] += total_force[2];
		
		veloc[i] = scalar(air_resist, veloc[i]);
	}
	function updatePos(i){
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



	//TEST FUNCTIONS
	testButton.onclick = function() {
  		 console.log("RUNNING TESTS");
		//test getmagnitude
		//test subtractpositions
		//test subtractvectors
		//test dot product
		//test scalar

		//clear scene
		scene.remove.apply(scene, scene.children);
		
		console.log("addBall() Tests --");
		console.log("numBalls increases after one addBall() call - ");
		addBall();
		test(numBalls==1);

		console.log("numBalls does not increase after 5 addBall()s have been called - ");
		addBall();
		addBall();
		addBall();
		addBall();
		let temp_num_balls = numBalls;
		addBall();
		test(numBalls==temp_num_balls);

		console.log("getMagnitude(vector) Tests -- ");
		console.log("returns 0 when [0,0,0] is passed - ");
		test(getMagnitude([0,0,0])==0);
		
		console.log("returns 1 when [1,0,0] is passed - ");
		test(getMagnitude([1,0,0])==1);
		console.log("returns 1 when [0,1,0] is passed - ");
		test(getMagnitude([0,1,0])==1);
		console.log("returns 1 when [0,0,1] is passed - ");
		test(getMagnitude([0,0,1])==1);
		
		

		console.log("subtractPositions() Tests -- ");
		console.log("returns 0 when passed the same position object twice - ");
		let pos1 = {x: 2, y: 3, z: 3};
		let result = subtractPositions(pos1, pos1);
		test(result[0] == 0 && result[1] == 0 && result[2] == 0);
	
		console.log("subtractVectors() Tests -- ");
		console.log("returns 0 when passed the same vector twice - ");
		let v = [2, 3, 4];
		result = subtractVectors(v,v);
		test(result[0] == 0 && result[1] == 0 && result[2] == 0);


		console.log("dotProduct() Tests -- ");
		console.log("returns 0 when passed [0,0,1] and [0,1,0] - ");
		test(dot([0,0,1], [0,1,0])==0);
		console.log("returns 1 when passed [0,0,1] and [0,0,1] - ");
		test(dot([0,0,1], [0,0,1])==1);

	
		console.log("scalar() Tests -- ");
		console.log("returns [0,0,0] when passed 0 and [5,5,5] - ");
		result = scalar(0, [5,5,5]);
		test(result[0] == 0 && result[1] == 0 && result[2] == 0);
		
		console.log("returns [5,5,5] when passed 1 and [5,5,5]");
		result = scalar(1, [5,5,5]);
		test(result[0] == 5 && result[1] == 5 && result[2] == 5);
		
		
		window.location.reload()
	} 
	
	function test(condition){
		if(condition){
			console.log("PASSED");
		}else{
			console.log("FAILED");
		}
	}
	
}

