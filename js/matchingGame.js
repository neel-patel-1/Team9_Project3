document.querySelector('#matchingGame').addEventListener('click', () => {
    
    const matchMaker = {
        tiles: Array(Array()),
        flipped: Array(),
        count: 0,
        add: function(newTile){
            this.flipped.push(newTile);
            count++;
            if(count === 2){
                this.flipped = Array();
                for(let i=0; i<this.flipped.length; i++){
                    this.flipped[i].object.rotation.y=0;
                }
            }
        },

    }

    const rotateAll = {
        toRotate: Array(),
        toRotateBack: Array(),
        rotate: function(){ 
            for(let i=0; i<this.toRotate.length; i++){
                if(this.toRotate[i].rotation.y < (Math.PI-.1) ){
                    this.toRotate[i].rotation.y+=.05;
                    if(this.toRotate[i].rotation.y >= (Math.PI/2)){
                        this.toRotate[i].material.color = {r:.5, b:.5, g:0};
                    }
                }   
                else{
                    this.toRotate[i].rotation.y=Math.PI;
                    this.toRotate.splice(i, 1);
                }
            }
            for(let i=0; i<this.toRotateBack.length; i++){
                if(this.toRotateBack[i].rotation.y >= 0){
                    this.toRotateBack[i].rotation.y-=.05;
                    if(this.toRotateBack[i].rotation.y <= (Math.PI/2)){
                        this.toRotateBack[i].material.color = {r:0,g:0.5137254901960784,b:0.5607843137254902};
                    }
                }   
                else{
                    this.toRotateBack[i].rotation.y=0;
                    this.toRotateBack.splice(i, 1);
                }
            }
        },
        add: function(newTile){
            this.toRotate.push(newTile);
            while(this.toRotate.length > 2){
                this.toRotateBack.push(this.toRotate[0]);
                this.toRotate.shift();
            }

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
            if(intersects.length > 0){
                for(let i=0; i<intersects.length; i++){
                    rotateAll.add(intersects[i].object);
                }
                
                //rotateAll.add(intersects[1]);
                //intersects[ 0 ].object.material.color.set( 0xff0000 );
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
                const plane1 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x00838f, side: THREE.DoubleSide} ) );
                plane1.position.x = i;
                plane1.position.y = j;
                // const plane2 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xa86298, side: THREE.DoubleSide} ) );
                // plane2.position.x = i;
                // plane2.position.y = j;
                // plane2.position.z = -.001;
                scene.add( plane1 );
                // scene.add( plane2 );
            }
        }
        function animate() {//function animating the scene        
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