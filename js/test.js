//possible spin on snake??
const snakeInit = () => {
    //clear child elements of game div
    document.querySelector('#game').textContent = ' ';
    document.querySelector('#instructions').textContent = ' ';
    //append instructions
    let instr = document.createElement('p');
    instr.textContent = 'WASD to change snake\'s direction.';
    document.querySelector('#instructions').appendChild(instr);

    const canvas = document.createElement('canvas');

    canvas.height = window.innerHeight*.8;
    canvas.width = canvas.height;

    canvas.style.position = 'absolute';
    canvas.style.margin = 'auto';
    canvas.style.left = '0';
    canvas.style.right = '0';

    document.getElementById("game").appendChild( canvas );
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);
    let game = {
        snakeStack : [[8,8]],
        h: canvas.height/17,
        w : canvas.width/17,
        dir: '\0',
        begun: false,
        /*copy move code with modulo arithmetic for new pos??
        special : function(){

        }
        */
        move : function(){
            if(this.dir === 'd' && this.snakeStack[this.snakeStack.length-1][0]<16){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0]+1,
                    this.snakeStack[this.snakeStack.length-1][1]]);

                this.snakeStack.shift();
                this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 1000);
            }
            else if(this.dir === 'w' && this.snakeStack[this.snakeStack.length-1][1]>0){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0],
                    this.snakeStack[this.snakeStack.length-1][1]-1]);

                this.snakeStack.shift();
                this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 1000);
            }
            else if(this.dir === 'a' && this.snakeStack[this.snakeStack.length-1][0]>0){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0]-1,
                    this.snakeStack[this.snakeStack.length-1][1]]);

                    this.snakeStack.shift();
                    this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 1000);
            }
            else if(this.dir === 's' && this.snakeStack[this.snakeStack.length-1][1]<16){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0],
                    this.snakeStack[this.snakeStack.length-1][1]+1]);
                    this.snakeStack.shift();
                    this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 1000);
            }
        },

        nextDir : function(newDir){
            if( (newDir !== this.dir) && 
                ( (newDir === 'd' && this.dir !== 'a') ||
                (newDir === 'w' && this.dir !== 's') ||
                (newDir === 's' && this.dir !== 'w') ||
                (newDir === 'a' && this.dir !== 'd') ) ){
                this.dir = newDir;
            }
        },
        
        draw: function(){
            ctx.fillStyle='#000000';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#FF0000';
            for(let i=0; i< this.snakeStack.length; i++){
                ctx.fillRect((this.snakeStack[i][0])*this.w,(this.snakeStack[i][1])*this.h,this.w,this.h);
            }
        }
    }

    window.addEventListener("keydown", function(event) {
        if(!game.begun  && (event.key === 'd' || event.key === 'w' || event.key === 'a' || event.key === 's')){
            game.begun = true;
            game.nextDir(event.key);
            game.move()
        }
        if(event.key === 'd' || event.key === 'w' || event.key === 'a' || event.key === 's'){
                
            game.nextDir(event.key);
        }
        console.log(event.key,"\n");
    });
    
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize(){

        canvas.height = window.innerHeight*.8;
        canvas.width = canvas.height;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    game.draw();
}

