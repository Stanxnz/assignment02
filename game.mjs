import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;
const COMPUTER_PLAYER = -1;

const MENU_CHOICES = {
    MENU_CHOICE_START_PVP: 1,
    MENU_CHOICE_START_PVC: 2,
    MENU_CHOICE_SHOW_SETTINGS: 3,
    MENU_CHOICE_EXIT_GAME: 4
};

const LANGUAGE_CHOICES = {
    ENGLISH: 'en',
    DUTCH: 'nl'
};

const NO_CHOICE = -1;

let gameboard;
let currentPlayer;
let isPvCMODE = false;
let language = DICTIONARY.en;


clearScreen();
showSplashScreen();
setTimeout(start, 2500);  

async function start() {

    do {

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_PVP) {
            isPvCMODE = false;
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_PVC){
            isPvCMODE = true;
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            await showSettings();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;

    while (isPlaying) {  
        initializeGame(); 
        isPlaying = await playGame(); 
    }
}

async function showMenu() {

    let choice = -1;  
    let validChoice = false;  

    while (!validChoice) {
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.MENU_TITLE + ANSI.RESET);
        print("1. " + language.PLAY_GAME_PVP);
        print("2. " + language.PLAY_GAME_PVC);
        print("3. " + language.SETTINGS);
        print("4. " + language.EXIT_GAME);

        choice = await askQuestion(" ");

        if ([MENU_CHOICES.MENU_CHOICE_START_PVP, MENU_CHOICES.MENU_CHOICE_START_PVC, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return choice;
}

async function showSettings(){
    let choice = NO_CHOICE;
    let validChoice = false;

    while (!validChoice){
    clearScreen();
    print(ANSI.COLOR.YELLOW + language.SETTINGS_TITLE + ANSI.RESET);
    print("1. " + language.LANGUAGE_SETTING);
    print("2. " + language.RETURN_TO_MENU);

    choice = await askQuestion(" ");

    if ([1, 2].includes(Number(choice))){
        validChoice = true;
    }
}
if (choice == 1){
    await changeLanguage();
}
}

async function changeLanguage(){
    let choice = NO_CHOICE;
    let validChoice = false;

    while (!validChoice){
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.CHOOSE_LANGUAGE + ANSI.RESET);
        print("1. English");
        print("2. Dutch (Nederlands)");

        choice = await askQuestion(" ");

        if ([1, 2].includes(Number(choice))){
            validChoice = true;
        }
    }
    if (choice == 1){
        language = DICTIONARY.en;
    } else if (choice ==2){
        language = DICTIONARY.nl;
    }

    print(language.LANGUAGE_CHANGED);
    await askQuestion(language.PRESS_ENTER_TO_CONTINUE);
}

async function playGame() {
    let outcome;
    let isDraw = true;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();

if (isPvCMODE && currentPlayer === COMPUTER_PLAYER){
    await computerMove();
} else {
    let move = await getGameMoveFromtCurrentPlayer();
    updateGameBoardState(move);
}

        outcome = evaluateGameState();
        changeCurrentPlayer();
        isDraw = true;
    } while (outcome == 0);

    showGameSummary(outcome);
    return await askWantToPlayAgain();
}

async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != language.CONFIRM) {
        playAgain = false;
    }
    return playAgain;
}

function showGameSummary(outcome) {
    clearScreen();
    if (outcome == -2) {
        print(language.DRAW_GAME);
    } else {
    let winningPlayer = (outcome > 0) ? language.PLAYER_ONE : language.PLAYER_TWO;
    print(language.WINNER_IS + " " +  winningPlayer);
    }
    showGameBoardWithCurrentState();
    print(language.GAME_OVER);
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

async function computerMove(){
    print(language.COMPUTER_TURN);
    let availableMoves = [];
    for (let row = 0; row < GAME_BOARD_SIZE; row++){
        for (let col = 0; col < GAME_BOARD_SIZE; col++){
            if (gameboard[row][col] == 0){
                availableMoves.push([row, col]);
            }
        }
    }
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    updateGameBoardState(randomMove);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
}


function evaluateGameState() {
    let sum = 0;
    let isDraw = true;

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        sum = 0;
        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
            if (gameboard[row][col] == 0) {
                isDraw = false;
            }
        }
        if (Math.abs(sum) == 3) {
            return sum; 
        }
    }

    for (let col = 0; col < GAME_BOARD_SIZE; col++) {
        sum = 0;
        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }
        if (Math.abs(sum) == 3) {
            return sum; 
        }
    }

    sum = 0;
    for (let i = 0; i < GAME_BOARD_SIZE; i++) {
        sum += gameboard[i][i];
    }
    if (Math.abs(sum) == 3) {
        return sum; 
    }

    sum = 0;
    for (let i = 0; i < GAME_BOARD_SIZE; i++) {
        sum += gameboard[i][GAME_BOARD_SIZE - 1 - i];
    }
    if (Math.abs(sum) == 3) {
        return sum; 
    }

    if (isDraw) {
        return -2; 
    }

    return 0;
}


function updateGameBoardState(move) {
    const ROW_ID = 0;
    const COLUMN_ID = 1;
    gameboard[move[ROW_ID]][move[COLUMN_ID]] = currentPlayer;
}

async function getGameMoveFromtCurrentPlayer() {
    let position = null;
    let valid = false;
    do {
        let rawInput = await askQuestion(language.PLACE_YOUR_MARK);
        position = rawInput.split(" ").map(Number);

        if (position.length == 2) {
            position[0] -= 1;
            position[1] -= 1;
        }

        if (isValidPositionOnBoard(position)) {
            valid = true;
        } else {
            print(language.INVALID_INPUT);
        }
    } while (!valid);

    return position;
}

function isValidPositionOnBoard(position) {
    if (position.length < 2) {
        return false; 
    }

    const row = (position[0]);
    const col = (position[1]);

    if (isNaN(row) || isNaN(col)) {
        return false; 
    }

    if (row < 0 || row >= GAME_BOARD_SIZE || col < 0 || col >= GAME_BOARD_SIZE) {
        return false; 
    }

    if (gameboard[row][col] !== 0) {
        return false; 
    }

    return true;
}

function showHUD() {
    let playerDescription = (PLAYER_2 == currentPlayer) ? language.PLAYER_TWO : language.PLAYER_ONE;

    if (currentPlayer == PLAYER_1){
        print(ANSI.COLOR.GREEN + language.PLAYER_TURN + " " + playerDescription + ANSI.RESET);
    } else {
        print(ANSI.COLOR.RED + language.PLAYER_TURN + " " + playerDescription + ANSI.RESET);
    }
}

function showGameBoardWithCurrentState() {
    print("\n     1   2   3"); 
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = " " + (currentRow + 1) + " "; 
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell === 0) {
                rowOutput += "   ";  
            } else if (cell > 0) {
                rowOutput += ANSI.COLOR.GREEN + " X " + ANSI.RESET; 
            } else {
                rowOutput += ANSI.COLOR.RED + " O " + ANSI.RESET; 
            }
            if (currentCol < GAME_BOARD_SIZE - 1) {
                rowOutput += "|"; 
            }
        }
        print(rowOutput);
        if (currentRow < GAME_BOARD_SIZE - 1) {
            print("   -----------"); 
        }
    }
}


function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}