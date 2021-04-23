const matchingInit = (test) => {
    //clear child elements of game div
    document.querySelector('#game').textContent = ' ';
    document.querySelector('#instructions').textContent = ' ';
    //append instructions
    let instr = document.createElement('p');
    instr.textContent = 'Flip Tiles to find matching Pairs!';
    document.querySelector('#instructions').appendChild(instr);
    
    const numTiles = 16;//must be an even square
    let scene, camera, renderer;
    const matchMaker = {
        tiles: Array(),
        count: 2,
        matches: 0,
        hasWon: false,
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
                        this.matches++;
                        if(this.matches*2 === numTiles){
                            this.hasWon = true;
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
                    this.toRotate[i].rotation.y+=.2;
                    if(this.toRotate[i].rotation.y >= (Math.PI/2)){
                        let newColor = (colorMap.idColors.findIndex( tuple =>
                            (tuple[0]=== this.toRotate[i].uuid || tuple[1]=== this.toRotate[i].uuid))+1)/31* 0xffffff;
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
                    this.toRotateBack[i].rotation.y-=.2;
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
            if(!(this.toRotate.map(x => x.uuid)).includes(newTile.uuid)
            &&!(this.toRotateBack.map(x => x.uuid)).includes(newTile.uuid)
            &&!(matchMaker.tiles.map(x => x.uuid)).includes(newTile.uuid)){
                this.toRotate.push(newTile);
            }
            while(this.toRotate.length > matchMaker.count){
                this.toRotateBack.push(this.toRotate[0]);
                this.toRotate.shift();
            }

        },
        
    }
    const colorMap = {
        idColors: Array(numTiles/matchMaker.count),
        addTile: function(uuid){
            let added = false;
            let initialPlace = parseInt(uuid.slice(-3),16)%(numTiles/matchMaker.count);
            while(!added){
                if(!this.idColors[initialPlace]){
                    this.idColors[initialPlace] = new Array();
                    this.idColors[initialPlace].push(uuid);
                    added = true;
                }
                else if(this.idColors[initialPlace].length < matchMaker.count){
                    this.idColors[initialPlace].push(uuid);
                    added = true;
                }
                else{
                    initialPlace = (initialPlace + 1)%(numTiles/matchMaker.count);
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
        for(let i=-Math.sqrt(numTiles)/4; i<Math.sqrt(numTiles)/4; i+=.5)
        {
            for(let j=-Math.sqrt(numTiles)/4; j<Math.sqrt(numTiles)/4; j+=.5)
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
            
            if (matchMaker.hasWon)
            {
                //if hasn't been altered in the past 330 millis
                winScreen.tryShow()
                //call winScreen
                
            }
            
        }
        let winScreen = {
            canSplat: true,
            splatScreen: function winScreen(){
                for(let i=-Math.sqrt(numTiles)/4; i<Math.sqrt(numTiles)/4; i+=.5){
                    for(let j=-Math.sqrt(numTiles)/4; j<Math.sqrt(numTiles)/4; j+=.5){
                        const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff, side: THREE.FrontSide} ) );
                        plane.position.x = i;
                        plane.position.y = j;
                        scene.add( plane );
                    }
                }
                setTimeout(() => {this.canSplat = true}, 330);
            },
            tryShow: function(){
                if(this.canSplat == true){
                    this.canSplat = false;
                    this.splatScreen();
                }
            },
        }
        animate();
        
    }

    init();
    
    if(test){
        /*
        Test 1: Passing two matching tiles to matchmaker will remove them from the scene.
        */
       function t1(){
            console.log("Test 1: Matching removes tile from the scene: ");
            let olen = scene.children.length;
            let i1 = scene.children.findIndex( (tile) => tile.uuid === colorMap.idColors[0][0]);
            let i2 = scene.children.findIndex( (tile) => tile.uuid === colorMap.idColors[0][1]);
            matchMaker.add(scene.children[i1]);
            matchMaker.add(scene.children[i2]);
            // console.log(colorMap.idColors[0][0], colorMap.idColors[0][1]);
            // console.log(scene.children[i1], scene.children[i2]);
            setTimeout(() => {
                if(scene.children.length === olen-2){
                    console.log("PASSED");
                }
                else{
                    console.log("FAILED");
                }
                console.log(scene.children.length);
            }, 1050);  
       }
        

        /*
        Test 2: Passing all matching tiles to matchmaker correctly will result in a win
        */
       function t2(){
            console.log("Test 2: Win Condition on all tiles matched: ");
            for(let i=0; i<numTiles/2; i++){ 
                let i1 = scene.children.findIndex( (tile) => tile.uuid === colorMap.idColors[i][0]);
                let i2 = scene.children.findIndex( (tile) => tile.uuid === colorMap.idColors[i][1]);
                matchMaker.add(scene.children[i1]);
                matchMaker.add(scene.children[i2]);
                setTimeout(() => {
                    matchMaker.add(scene.children[i1]);
                    matchMaker.add(scene.children[i2]);
                    console.log(scene.children.length);
                }, 1050);
            }
            if(scene.children.length === 0 && matchMaker.hasWon === true){
                console.log("PASSED")
            }
            function nextTime(){
                
            }
       }
        
        // console.log(colorMap.idColors);
        // console.log(i1, i2, testChild);
        
       t1();
    }

    

}