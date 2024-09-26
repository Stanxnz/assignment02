import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

// These are the valid choices for the menu.
const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3
};

const LANGUAGE_CHOICES = {
    ENGLISH: 'en',
    DUTCH: 'nl'
};

const NO_CHOICE = -1;

let gameboard;
let currentPlayer;
let language = DICTIONARY.en;


clearScreen();
showSplashScreen();
setTimeout(start, 2500); // This waites 2.5seconds before calling the function. i.e. we get to see the splash screen for 2.5 seconds before the menue takes over. 



//#region game functions -----------------------------

async function start() {

    do {

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
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
        print("1. " + language.PLAY_GAME);
        print("2. " + language.SETTINGS);
        print("3. " + language.EXIT_GAME);

        choice = await askQuestion(" ");

        if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
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
    // Play game..
    let outcome;
    let isDraw = true;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        let move = await getGameMoveFromtCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
        isDraw = true;
    } while (outcome == 0)

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
    let winningPlayer = (outcome > 0) ? 1 : 2;
    print(language.WINNER_IS + " " + language.PLAYER + " " + winningPlayer);
    }
    showGameBoardWithCurrentState();
    print(language.GAME_OVER);
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function evaluateGameState() {
    let sum = 0;
    let isDraw = true;

    // Check Horizontal Rows for a Win
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

    // Check Vertical Columns for a Win
    for (let col = 0; col < GAME_BOARD_SIZE; col++) {
        sum = 0;
        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }
        if (Math.abs(sum) == 3) {
            return sum; 
        }
    }

    // Check Diagonals for a Win
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
    print(language.PLAYER_TURN + " " + playerDescription)
}

function showGameBoardWithCurrentState() {
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = " ";
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += "_ ";
            }
            else if (cell > 0) {
                rowOutput += "X ";
            } else {
                rowOutput += "O ";
            }
        }

        print(rowOutput);
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


//#endregion
