document.querySelector('#testGame').addEventListener('click', () => {
    
    

    const rotateAll = {
        toRotate: Array(),
        rotate: function(){ 
            for(let i=0; i<this.toRotate.length; i++){
                if(this.toRotate[i].object.rotation.y < (Math.PI-.1) ){
                    this.toRotate[i].object.rotation.y+=.1;
                    console.log(this);
                }
                else{
                    this.toRotate.splice(i, 1)
                }
            }
        },
        add: function(newTile){
            this.toRotate.push(newTile);
        },
        
    }
    function init(){
        document.querySelector('#game').textContent = ' ';
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0,0,5);
        camera.lookAt(0,0,0);
        const scene =  new THREE.Scene();

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight);
        document.getElementById("game").appendChild( renderer.domElement );

        const mouse = new THREE.Vector2();//coordinates of mouse
        const geometry = new THREE.PlaneGeometry( .4, .4);
        //const material = new THREE.MeshBasicMaterial( {color: /*0x00838f*/Math.random() * 0xffffff, side: THREE.FrontSide} );

        const raycaster = new THREE.Raycaster();//shoots rays

        renderer.domElement.addEventListener('mousedown', (event) => {
            console.log("x:",mouse.x, "y:", mouse.y);
            const intersects = raycaster.intersectObjects( scene.children );
            if(intersects[0]){
                rotateAll.add(intersects[0]);
                // intersects[ 0 ].object.rotation.y += .5;
                intersects[ 0 ].object.material.color.set( 0xff0000 );
            }
        });;
        //helper functions
        window.addEventListener( 'mousemove', onMouseMove, false );//keep ptr coordinates up to date  
        window.addEventListener('resize', onWindowResize, false);
        function onMouseMove( event ) {//helper function, gets mouse x and y coordinates
            var rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
            mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
        }
        function onWindowResize(){
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        for(let i=-2.0; i<=2.0; i+=.5)
        {
            for(let j=-2.0; j<=2.0; j+=.5)
            {
                const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x00838f + i*0xffffff*1/16, side: THREE.DoubleSide} ) );
                plane.position.x = i;
                plane.position.y = j;
                scene.add( plane );
            }
        }
        function animate() {//function animating the scene
            //if drawUpdate -> draw, setDrawUpdate false
            
            requestAnimationFrame( animate );
            raycaster.setFromCamera(mouse, camera);
            rotateAll.rotate();
            renderer.render( scene, camera );
            /*
            if (hasWon)
            {
                for(let i=-2.5; i<=2.5; i+=.5)
                {
                    for(let j=-2.5; j<=2.5; j+=.5)
                    {
                        const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff, side: THREE.FrontSide} ) );
                        plane.position.x = i;
                        plane.position.y = j;
                        scene.add( plane );
                    }
                }
            }
            */
        }
        animate();
    }

    init();
    
      

    

})