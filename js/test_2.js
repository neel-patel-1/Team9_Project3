document.querySelector('#swarm').addEventListener('click', () => {
    //clear child elements of game div
    document.querySelector('#game').textContent = ' ';
    document.querySelector('#instructions').textContent = ' ';
    //append instructions
    let instr = document.createElement('p');
    instr.textContent = 'Move the swarm with WASD!';
    document.querySelector('#instructions').appendChild(instr);

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById("game").appendChild( canvas );
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);

    //want a swarm with multiple specks
    //each speck will be drawn towards "swarm center"
    //tokens within swarm center radius add to swarm
    //radius of effects inc w num specks
    let moveSpeed = ((canvas.width+canvas.height)/2)/5;
    function Swarm(){
        this.rangePerSpeck = 1;
        this.speckArr = Array();
        this.center = [canvas.width/2,canvas.height/2];
        this.numSpecks = 0;
        this.radius = this.numSpecks*this.rangePerSpeck;

        //test func for drawing circle
        this.showPlayer = () => {
            ctx.beginPath();
            ctx.arc(this.center[0], this.center[1], this.radius, 0, 2*Math.PI);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
            requestAnimationFrame(this.showPlayer);
        }
        this.move = (dir) =>{
            if(dir === 'w'){
                this.center[1]-=(moveSpeed);
            }
            else if(dir === 'a'){
                this.center[0]-=(moveSpeed);
            }
            else if(dir === 's'){
                this.center[1]+=moveSpeed;
            }
            else if(dir === 'd'){
                this.center[0]+=moveSpeed;
            }

        }
        this.drawSpecks = function(){
            for(let i=0; i<this.numSpecks; i++){
                this.speckArr[i].show();
            }
        }
        this.addSpeck = function(num){
            this.numSpecks+=num;
            this.speckArr.push(new Speck(center[0] + Math.random()*this.radius, center[1] + Math.random()*this.radius));
        }
    }
    function Speck(x, y){
        this.x = x;
        this.y = y;
        this.chase = function(toChase, chaseSpeed){//array w xpos @ toChase[0] ypos @ toChase[1]
            //dynamically change speck positions
        }
        this.show = function(){
            ctx.arc(center[0], center[1], radius, 0, 2*Math.PI);
            ctx.fill();
        }
    }
    
    const playerSwarm = new Swarm();
    window.addEventListener("keydown", function(event) {
        console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`);
        playerSwarm.move(event.key);
        
    });
    
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    playerSwarm.showPlayer();
})

