/*Menu buttons will hide all divs except the one the user has chosen
Default div on display should be the home div */
const game3dArray = ["#torusTicTacToe", "#matchingGame", "#ball", "#grav"];
const game3dFuncs = [tictactoeinit, matchingInit, ballInit, gravityInit];
const game2dArray = ["#snake", "#swarm"];
const game2dFuncs = [snakeInit, swarmInit];

// for(let i=0; i<game3dArray.length; i++){
//     document.querySelector(game3dArray[i]).addEventListener('click', () =>{
//         document.querySelector('#home').hidden = true;
//         document.querySelector('#artdiv').hidden = true;
//         let gameEls= document.querySelector('#gamediv').children;
//         for (let i=0; i<gameEls.length; i++){
//             gameEls[i].innerHTML = '';
//         }
//         game3dFuncs[i];
//         document.querySelector('#widget-menu').hidden = true;
//         document.querySelector('#gamediv').hidden = false;
//     })
// }
// function testFunc(){
//     game2dFuncs[0];
//     document.querySelector('#widget-menu').hidden = true;
//     document.querySelector('#gamediv').hidden = false;
// }
for(let i=0; i<game3dArray.length; i++){
    document.querySelector(game3dArray[i]).addEventListener('click', () => {
        game3dFuncs[i]();
        document.querySelector('#home').hidden = true;
        document.querySelector('#artdiv').hidden = true;
        document.querySelector('#widget-menu').style.display = "none";
        document.querySelector('#gamediv').hidden = false;
    })
}
for(let i=0; i<game2dArray.length; i++){
    document.querySelector(game2dArray[i]).addEventListener('click', () => {
        game2dFuncs[i]();
        document.querySelector('#home').hidden = true;
        document.querySelector('#artdiv').hidden = true;
        document.querySelector('#widget-menu').style.display = "none";
        document.querySelector('#gamediv').hidden = false;
    })
}
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
        document.querySelector('#widget-menu').appendChild(game)
            .addEventListener('click', game3dFuncs[i]);
    }
    document.querySelector('#widget-menu').style.display = "flex";
})
document.querySelector('#select_2d').addEventListener('click', () => {
    document.querySelector('#home').hidden = true;
    document.querySelector('#artdiv').hidden = true;
    let gameEls= document.querySelector('#gamediv').children;
    for (let i=0; i<gameEls.length; i++){
        gameEls[i].innerHTML = '';
    }
    document.querySelector('#gamediv').hidden=false;
    for(let i=0; i<game2dArray.length; i++){
        let game = document.createElement('button');
        game.innerText = game2dArray[i].slice(1);
        document.querySelector('#widget-menu').appendChild(game)
                    .addEventListener('click', game2dFuncs[i]);
    }
    document.querySelector('#widget-menu').style.display = "flex";
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