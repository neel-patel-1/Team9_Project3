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

    canvas.height = window.innerHeight*.65;
    canvas.width = canvas.height;

    canvas.style.position = 'absolute';
    canvas.style.margin = 'auto';
    canvas.style.left = '0';
    canvas.style.right = '0';

    document.getElementById("game").appendChild( canvas );
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);
    let game = {
        // snakeStack : [[8,8]],
        snakeStack : [[6,8],[7,8],[8,8]],
        newPiece : [Math.floor(Math.random()*7), Math.floor(Math.random()*7)],
        h: canvas.height/17,
        w : canvas.width/17,
        //dir: ['\0', '\0'],
        dir: ['d', '\0'],
        begun: false,
        /*copy move code with modulo arithmetic for new pos??
        special : function(){
            //use push + shift to add new head, cut off old tail, how to add new piece??
            tail -> XXXO <-head  array: [X,X,X,O]  ,  [X,X,X,O] pu , new piece V shift:
            if(this.snakeStack[this.snakeStack.length-1][0] === new.x && this.snakeStack[this.snakeStack.length-1][1] === new.y){
            //don't remove first element of array on next move
            //gen new new piece randomly
            }
            context.beginPath();
            context.arc( i*(view.width/7)+(view.width/14), 
                + (5-j)*((view.height)/6) + (view.height/12), 
            (view.width/14) - (context.lineWidth), 0, 2 * Math.PI);
            context.fillStyle = '#' + Math.floor(cseed).toString(16);
            context.fill();
        }
        */
        genNew : function(){
            let tx = Math.floor(Math.random()*17);
            let ty = Math.floor(Math.random()*17);
            let canPlace = () =>{
                for(let i=0; i<this.snakeStack.length; i++){
                    if(tx === this.snakeStack[i][0] && ty === this.snakeStack[i][1]){
                        return false;
                    }
                }
                return true;
            }
            while (!canPlace())
            {
                tx = Math.floor(Math.random()*17);
                ty = Math.floor(Math.random()*17);
            }
            this.newPiece = [tx, ty];
        },  
        move : function(){
            if(this.dir[1] === 'd' && this.snakeStack[this.snakeStack.length-1][0]<16 
            && this.safeMove(this.snakeStack[this.snakeStack.length-1][0]+1, this.snakeStack[this.snakeStack.length-1][1])){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0]+1,
                    this.snakeStack[this.snakeStack.length-1][1]]);
                if(!(this.snakeStack[this.snakeStack.length-1][0] === this.newPiece[0]) ||
                !(this.snakeStack[this.snakeStack.length-1][1] === this.newPiece[1])){
                    this.snakeStack.shift();
                }
                else{
                    this.genNew();
                }
                this.dir[0] = this.dir[1];
                this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 250);
            }
            else if(this.dir[1] === 'w' && this.snakeStack[this.snakeStack.length-1][1]>0
            && this.safeMove(this.snakeStack[this.snakeStack.length-1][0], this.snakeStack[this.snakeStack.length-1][1]-1)){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0],
                    this.snakeStack[this.snakeStack.length-1][1]-1]);
                if(!(this.snakeStack[this.snakeStack.length-1][0] === this.newPiece[0]) ||
                    !(this.snakeStack[this.snakeStack.length-1][1] === this.newPiece[1])){
                    this.snakeStack.shift();
                }
                else{
                    this.genNew();
                }
                this.dir[0] = this.dir[1];
                this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 250);
            }
            else if(this.dir[1] === 'a' && this.snakeStack[this.snakeStack.length-1][0]>0
            && this.safeMove(this.snakeStack[this.snakeStack.length-1][0]-1, this.snakeStack[this.snakeStack.length-1][1])){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0]-1, this.snakeStack[this.snakeStack.length-1][1]]);
                if(!(this.snakeStack[this.snakeStack.length-1][0] === this.newPiece[0]) ||
                !(this.snakeStack[this.snakeStack.length-1][1] === this.newPiece[1])){
                    this.snakeStack.shift();
                }
                else{
                    this.genNew();
                }
                this.dir[0] = this.dir[1];
                this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 250);
            }
            else if(this.dir[1] === 's' && this.snakeStack[this.snakeStack.length-1][1]<16
            && this.safeMove(this.snakeStack[this.snakeStack.length-1][0], this.snakeStack[this.snakeStack.length-1][1]+1)){
                this.snakeStack.push([this.snakeStack[this.snakeStack.length-1][0], this.snakeStack[this.snakeStack.length-1][1]+1]);
                if(!(this.snakeStack[this.snakeStack.length-1][0] === this.newPiece[0]) ||
                !(this.snakeStack[this.snakeStack.length-1][1] === this.newPiece[1])){
                    this.snakeStack.shift();
                }
                else{
                    this.genNew();
                }
                this.dir[0] = this.dir[1];
                this.draw();
                setTimeout( ()=> {
                    this.move();
                }, 250);
            }
        },
        /*
        trusting the user's new direction too early, must validate user's direction is not parallel to oldDir
        dir : [old, new];
        if(old == 'd' and uChoice == 'a') we have a problem
        //when can we trust that the user has finished fucking with dir: better be done once snake is ready to move
        //once snake is ready to move, change dir[0] to dir[1] iff dir[1] is not parallel to dir[0]
        */  
        nextDir : function(newDir){
            if( (newDir !== this.dir[1]) && 
                ( (newDir === 'd' && this.dir[0] !== 'a') ||
                (newDir === 'w' && this.dir[0] !== 's') ||
                (newDir === 's' && this.dir[0] !== 'w') ||
                (newDir === 'a' && this.dir[0] !== 'd') ) ){
                this.dir[1] = newDir;
            }
        },
        
        draw: function(){
            ctx.fillStyle='#000000';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#FF0000';
            for(let i=0; i< this.snakeStack.length-1; i++){
                ctx.fillRect((this.snakeStack[i][0])*this.w,(this.snakeStack[i][1])*this.h,this.w,this.h);
            }
            ctx.fillStyle = '#0000FF';
            ctx.fillRect((this.snakeStack[this.snakeStack.length-1][0])*this.w,(this.snakeStack[this.snakeStack.length-1][1])*this.h,this.w,this.h);
            ctx.beginPath();
            ctx.arc( this.newPiece[0]*(canvas.width/17)+(this.w)/2, this.newPiece[1]*(canvas.height/17)+(this.h)/2, 
                (this.w)/3, 0, 2 * Math.PI);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
        },

        safeMove: function(x, y){
            for(let i=1; i<this.snakeStack.length; i++){
                if(x === this.snakeStack[i][0] && y === this.snakeStack[i][1]){
                    console.log(this.snakeStack[i]);
                    console.log(this.snakeStack);
                    this.draw();
                    return false;
                }
            }
            return true;
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

        canvas.height = window.innerHeight*.65;
        canvas.width = canvas.height;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    game.draw();
}

