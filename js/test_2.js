const swarmInit = () => {
    //clear child elements of game div
    document.querySelector('#game').textContent = ' ';
    document.querySelector('#instructions').textContent = ' ';
    //append instructions
    let instr = document.createElement('p');
    instr.textContent = 'Move the swarm with WASD!';
    document.querySelector('#instructions').appendChild(instr);

    const canvas = document.createElement('canvas');
    canvas.height = window.innerHeight*.65;
    canvas.width = canvas.height;

    canvas.style.position = 'absolute';
    canvas.style.margin = 'auto';
    canvas.style.left = '0';
    canvas.style.right = '0';

    document.getElementById("game").appendChild( canvas );
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    let swarm = {
        mouse : { x: 0, y: 0},
        rad : canvas.width/40,
        outerRad : canvas.width/20,
        flyArr : [[canvas.width/2, canvas.height/2]],
        draw : function (){
            ctx.fillStyle = '#000000';
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc( swarm.mouse.x * canvas.width, swarm.mouse.y * canvas.height, swarm.rad, 0, 2 * Math.PI);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
            for(let i=0; i<swarm.flyArr.length; i++){
                if(swarm.flyArr[i][0] < (swarm.mouse.x*canvas.width)){
                    swarm.flyArr[i][0]+=canvas.width/100;
                }
                else{
                    swarm.flyArr[i][0]-=canvas.width/100;
                }
                if(swarm.flyArr[i][1] < (swarm.mouse.y*canvas.height)){
                    swarm.flyArr[i][1]+=canvas.height/100;
                }
                else{
                    swarm.flyArr[i][1]-=canvas.height/100;
                }
            }
            ctx.beginPath();
            ctx.arc( swarm.flyArr[0][0], swarm.flyArr[0][1], swarm.rad/4, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
            requestAnimationFrame(swarm.draw);
        }
    }

    

    //mouse and resize helpers
    canvas.addEventListener('mousemove', e => onMouseMove(e));
    function onMouseMove( event ) {//helper function, gets mouse x and y coordinates
        var rect = canvas.getBoundingClientRect();
        swarm.mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) );
        swarm.mouse.y = ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) );
        console.log(swarm.mouse.x,swarm.mouse.y);//debugging
    }
    
    document.addEventListener('resize', onWindowResize, false);
    function onWindowResize(){
        canvas.height = window.innerHeight*.65;
        canvas.width = canvas.height;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    requestAnimationFrame(swarm.draw);
    // ctx.fillStyle = '#ff0000';
    // ctx.beginPath();
    // ctx.arc(canvas.width/2, canvas.height/2, 5, 0, 2*Math.PI);
    // ctx.fill();
}

