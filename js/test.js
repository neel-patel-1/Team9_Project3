//possible spin on snake??
const snakeInit = () => {
    //clear child elements of game div
    document.querySelector('#game').textContent = ' ';
    document.querySelector('#instructions').textContent = ' ';
    //append instructions
    let instr = document.createElement('p');
    instr.textContent = 'Move the Square!';
    document.querySelector('#instructions').appendChild(instr);

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById("game").appendChild( canvas );
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0,0,canvas.width, canvas.height);

    const rect = {
        l : 20,
        w : 20,
        x : canvas.width/2,
        y : canvas.width/2,
        moveV : function(dir){
            if(dir === 0){
                this.y-=(this.l);
            }
            else{
                this.y+=(this.l);
            }
        },
        moveH : function(dir){
            if(dir === 0){
                this.x-=(this.w);
            }
            else{
                this.x+=(this.w);
            }
        },
        draw: function(){
            ctx.fillStyle = 'Red';
            ctx.fillRect(this.x,this.y,this.w,this.l);
        }
    }

    window.addEventListener("keydown", function(event) {
        console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`);
        if(event.key === 'd' || event.key === 'ArrowRight'){
            rect.moveH(1);
        }
        if(event.key === 'a' || event.key === 'ArrowLeft'){
            rect.moveH(0);
        }
        if(event.key === 's' || event.key === 'ArrowDown'){
            rect.moveV(1);
        }
        if(event.key === 'w' || event.key === 'ArrowUp'){
            rect.moveV(0);
        }
        rect.draw();
        
    });
    
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    rect.draw();
}

