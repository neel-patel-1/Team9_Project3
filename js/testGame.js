document.querySelector('#testGame').addEventListener('click', () => {
    document.querySelector('#game').textContent = ' ';


    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,30);
    camera.lookAt(0,0,0);

    const scene =  new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("game").appendChild( renderer.domElement );

    const mouse = new THREE.Vector2();//coordinates of mouse

    
    


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

})