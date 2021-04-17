/*Menu buttons will hide all divs except the one the user has chosen
Default div on display should be the home div */
const game3dArray = ["#torusTicTacToe", "#matchingGame"];
const game2dArray = ["#hordeGame", "#ball", "#swarm"]
document.querySelector('#select_home').addEventListener('click', () => {
    document.querySelector('#game').innerText='';
    document.querySelector('#artdiv').hidden = true;
    document.querySelector('#gamediv').hidden = true;
    document.querySelector('#home').hidden = false;
})
document.querySelector('#select_3d').addEventListener('click', () => {
    document.querySelector('#game').innerText='';
    document.querySelector('#home').hidden = true;
    document.querySelector('#artdiv').hidden = true;
    document.querySelector('#games_2d').innerText = '';
    document.querySelector('#gamediv').hidden = false;
    //
    for(let i=0; i<game3dArray.length; i++){
        let game = document.createElement('button');
        game.className='widget-menu';
        game.innerText = game3dArray[i].shift();
        document.querySelector('#games_3d').appendChild(game);
    }

    //
    //below useless
    document.querySelector('#games_3d').hidden = false;

})
document.querySelector('#select_2d').addEventListener('click', () => {
    document.querySelector('#game').innerText='';
    document.querySelector('#home').hidden = true;
    document.querySelector('#artdiv').hidden = true;
    document.querySelector('#games_3d').innerText = '';
    document.querySelector('#gamediv').hidden = false;
    //
    for(let i=0; i<game2dArray.length; i++){
        let game = document.createElement('button');
        game.className='widget-menu';
        game.innerText = game2dArray[i].shift();
        document.querySelector('#games_2d').appendChild(game);
    }
    //
    //below useless
    document.querySelector('#games_2d').hidden = false;
    
})
document.querySelector('#art').addEventListener('click', () => {
    document.querySelector('#game').innerText='';
    document.querySelector('#home').hidden = true;
    document.querySelector('#gamediv').hidden = true;
    document.querySelector('#artdiv').hidden = false;
})