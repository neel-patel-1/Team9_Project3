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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById("game").appendChild( canvas );
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // const snakeGrid = {
    //     grid : [[],
    //             [],
    //             [],

    //             ]
    // }
    let game = {
        snakeStack : [[8,8]],
        l : canvas.width/17,
        w : canvas.width/17,
        x : 8*canvas.width/17,
        y : 8*canvas.width/17,
        dir: '\0',
        begun: false,
        move : function(){
            if(dir === 'd' && snakeStack[this.snakeStack.length-1][1]<16){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0]+1,
                    this.snakeStack[this.snakeStack.length-1][1]]);
                this.snakeStack.pop();
                setInterval( ()=> {
                    this.move();
                }, 200);
            }
            else if(dir === 'w'){
                this.y+=(this.l);
            }
            else if(dir === 'a'){

            }
            else if(dir === 's'){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0]+1,
                    this.snakeStack[this.snakeStack.length-1][1]]);
                this.snakeStack.pop();
                setInterval( ()=> {
                    this.move();
                }, 200);
            }
        },
        nextDir : function(newDir){
            if(newDir !== dir){
                dir = newDir;
            }
        },
        
        draw: function(){
            ctx.fillStyle = 'Red';
            for(let i=0; i< this.snakeStack.length; i++){
                ctx.fillRect(this.x,this.y,this.w,this.l);
            }
            ctx.fillRect(this.x,this.y,this.w,this.l);
        }
    }

    window.addEventListener("keydown", function(event) {
        if(!game.begun){
            game.begun = true;
            rect.moveH(1);
        }
        if(event.key === 'd' || event.key === 'w' || event.key === 'a' || event.key === 's'){
                
                game.nextDir(event.key);
        }
        // console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`);
        // if(event.key === 'd' || event.key === 'ArrowRight'){
        //     rect.moveH(1);
        // }
        // if(event.key === 'a' || event.key === 'ArrowLeft'){
        //     rect.moveH(0);
        // }
        // if(event.key === 's' || event.key === 'ArrowDown'){
        //     rect.moveV(1);
        // }
        // if(event.key === 'w' || event.key === 'ArrowUp'){
        //     rect.moveV(0);
        // }
        // rect.draw();
        
    });
    
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    rect.draw();
}

