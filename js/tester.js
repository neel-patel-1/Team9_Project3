/**
     * Initialized TicTacToe game and tests different conditions related to victory
     * and player moves.
     * (1) Win Configuration #1 (X's) Horizonally
     */

let tester = () => {
    //prepare screen for displaying actions
    document.querySelector('#home').hidden = true;

    tictactoeinit(true);
}
