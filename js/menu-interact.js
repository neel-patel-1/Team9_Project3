/*Menu buttons will hide all divs except the one the user has chosen
Default div on display should be the home div */
const game3dArray = ["#torusTicTacToe", "#matchingGame", "#ball"];
const game3dFuncs = [tictactoeinit, matchingInit, ballInit];
const game2dArray = ["#snake", "#swarm"];
const game2dFuncs = [snakeInit, swarmInit];

document.querySelector('#select_home').addEventListener('click', () => {
    let gameEls= document.querySelector('#gamediv').children;
    for (let i=0; i<gameEls.length; i++){
        gameEls[i].innerHTML = '';
    }
    document.querySelector('#artdiv').hidden = true;//hiding all divs besides home
    document.querySelector('#gamediv').hidden = true;
    document.querySelector('#home').hidden = false;
})
document.querySelector('#select_3d').addEventListener('click', () => {
    document.querySelector('#home').hidden = true;
    document.querySelector('#artdiv').hidden = true;
    let gameEls= document.querySelector('#gamediv').children;
    for (let i=0; i<gameEls.length; i++){
        gameEls[i].innerHTML = '';
    }
    document.querySelector('#gamediv').hidden=false;
    for(let i=0; i<game3dArray.length; i++){
        let game = document.createElement('button');
        game.innerText = game3dArray[i].slice(1);
        document.querySelector('.widget-menu').appendChild(game)
            .addEventListener('click', game3dFuncs[i]);
    }

    //
    //below useless
})
document.querySelector('#select_2d').addEventListener('click', () => {
    document.querySelector('#home').hidden = true;
    document.querySelector('#artdiv').hidden = true;
    let gameEls= document.querySelector('#gamediv').children;
    for (let i=0; i<gameEls.length; i++){
        gameEls[i].innerHTML = '';
    }
    document.querySelector('#gamediv').hidden=false;
    //
    for(let i=0; i<game2dArray.length; i++){
        let game = document.createElement('button');
        //game.className='widget-menu';
        game.innerText = game2dArray[i].slice(1);
        document.querySelector('.widget-menu').appendChild(game)
                    .addEventListener('click', game2dFuncs[i]);
    }
    //
    
})
document.querySelector('#art').addEventListener('click', () => {
    let gameEls= document.querySelector('#gamediv').children;
    for (let i=0; i<gameEls.length; i++){
        gameEls[i].innerHTML = '';
    }
    document.querySelector('#home').hidden = true;
    document.querySelector('#gamediv').hidden = true;
    document.querySelector('#artdiv').hidden = false;
})