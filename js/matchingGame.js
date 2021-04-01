document.querySelector('#matchingGame').addEventListener('click', () => {
    
    let scene, camera, renderer;
    const matchMaker = {
        tiles: Array(),
        count: 2,
        colorComp: {r:0,g:0,b:0},
        checkPair: function(){
            setTimeout( () => {
                this.colorComp = this.tiles[0].material.color;
                if(this.tiles.every((tile) => tile.material.color.r === this.colorComp.r 
                                    && tile.material.color.g === this.colorComp.g 
                                    && tile.material.color.b === this.colorComp.b))
                {
                    for(let i=0; i<this.count; i++){
                        this.tiles[i].material.color = {r:.5, b:0, g:.1};
                    }
                    setTimeout( () =>{
                        for(let i=0; i<this.count; i++){
                            // this.tiles[0].geometry.dispose();
                            // this.tiles[0].object.dispose();
                            scene.remove(this.tiles[0]);
                            this.tiles.shift();
                        }
                    }, 300)
                    
                }
                else{
                    for(let i=0; i<this.count; i++){
                        rotateAll.toRotateBack.push(this.tiles[0]);
                        this.tiles.shift();
                    }
                }
                
            }, 700)
        },
        add: function(newTile){
            if(!(this.tiles.map(tile => tile.uuid)).includes(newTile.uuid) && this.tiles.length < this.count){
                this.tiles.push(newTile);
                if(this.tiles.length === this.count){
                    this.checkPair();
                }
                return true;
            }
            else{
                return false;
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
                        let newColor = colorMap.idColors.findIndex( tuple =>
                            (tuple[0]=== this.toRotate[i].uuid || tuple[1]=== this.toRotate[i].uuid))/31* 0xffffff /** (colorMap.idColors.findIndex( (tuple) =>
                        {return (tuple[0]=== this.toRotate[i].uuid || tuple[1]=== this.toRotate[i].uuid)}));/*+ (0x0000ff * colorMap.idColors.findIndex( (tuple) =>
                            {return (tuple[0]=== this.toRotate[i].uuid || tuple[1]=== this.toRotate[i].uuid)}))*/;
                        console.log(colorMap.idColors.findIndex( tuple =>
                        (tuple[0]=== this.toRotate[i].uuid || tuple[1]=== this.toRotate[i].uuid))*0x0000ff);
                        this.toRotate[i].material.color.set(newColor);
                    }
                }   
                else{
                    this.toRotate[i].rotation.y=Math.PI;
                    if(!matchMaker.add(this.toRotate[i])){
                        this.toRotateBack.push(this.toRotate[i]);
                    }
                    this.toRotate.splice(i, 1);
                }
            }
            for(let i=0; i<this.toRotateBack.length; i++){
                if(this.toRotateBack[i].rotation.y >= 0){
                    this.toRotateBack[i].rotation.y-=.05;
                    if(this.toRotateBack[i].rotation.y < (Math.PI/2)){
                        this.toRotateBack[i].material.color.set(0x00838f);
                    }
                }   
                else{
                    this.toRotateBack[i].rotation.y=0;
                    this.toRotateBack.splice(i, 1);
                }
            }
        },
        add: function(newTile){
            if(!(this.toRotate.map(x => x.uuid)).includes(newTile.uuid)){
                this.toRotate.push(newTile);
            }
            while(this.toRotate.length > matchMaker.count){
                this.toRotateBack.push(this.toRotate[0]);
                this.toRotate.shift();
            }

        },
        
    }
    const colorMap = {
        idColors: Array(64/matchMaker.count),
        // initColors: function(){
        //     for(let i=0; i<64/matchMaker.count; i++){
        //         this.idColors[i]=Array(matchMaker.count);
        //     }
        // },
        addTile: function(uuid){
            let added = false;
            let initialPlace = parseInt(uuid.slice(-3),16)%(64/matchMaker.count);
            while(!added){
                if(!this.idColors[initialPlace]){
                    this.idColors[initialPlace] = new Array();
                    this.idColors[initialPlace].push(uuid);
                    added = true;
                }
                else if(this.idColors[initialPlace].length < 2){
                    this.idColors[initialPlace].push(uuid);
                    added = true;
                }
                else{
                    initialPlace = (initialPlace + 1)%(64/matchMaker.count);
                }
            }
        }
    }
    function init(){
        document.querySelector('#game').textContent = ' ';
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0,0,5);
        camera.lookAt(0,0,0);
        scene =  new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
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

        //generate tiles and color array
        //colorMap.initColors();
        for(let i=-2.0; i<2.0; i+=.5)
        {
            for(let j=-2.0; j<2.0; j+=.5)
            {
                const plane1 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x00838f, side: THREE.DoubleSide} ) );
                plane1.position.x = i;
                plane1.position.y = j;
                scene.add( plane1 );
                colorMap.addTile(plane1.uuid);
                
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