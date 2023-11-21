const ROWS = 8;
const COLS = 8;

var BOARD = null;

var TURN = null;

var GAME_ENDED = null;

// ----- GAME OBJECTS -----
const WHITE_TILE = 0;
const BLACK_TILE = 1;
const WHITE_PLAYER = 2;
const BLACK_PLAYER = 3;

// ----- AUDIO -----
var winAudio = new Audio("../../Media/winAudio.mp3");
var redTurn = new Audio("../../Media/redTurn.mp3");
var blackTurn = new Audio("../../Media/blackTurn.mp3");


// ----- BEGGINING OF THE GAME -----
/**
 * Initializes the game board.
 */
function initBoard() {
    BOARD = [
        [WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER],
        [BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE],
        [WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER, WHITE_TILE, BLACK_PLAYER],

        [BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE],
        [WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE],

        [WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE],
        [WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER],
        [WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE, WHITE_PLAYER, WHITE_TILE]
    ];
}


/**
 * Makes the cells with a players on them clickable for some functions to run.
 */
function enableClickOnPlayers() {
    if (!GAME_ENDED) {
        for (var currentRow = 0; currentRow < ROWS; currentRow++) {
            for (var currentCol = 0; currentCol < COLS; currentCol++) {
                if (BOARD[currentRow][currentCol] == WHITE_PLAYER) {
                    document.getElementById(currentRow + '.' + currentCol).setAttribute("onclick", "initBrightness(this); changeBrightness(this); initMoveableCells(); handleWhiteMovement(this);");
                }
                else if (BOARD[currentRow][currentCol] == BLACK_PLAYER) {
                    document.getElementById(currentRow + '.' + currentCol).setAttribute("onclick", "initBrightness(this); changeBrightness(this); initMoveableCells(); handleBlackMovement(this);");
                }
                else {
                    document.getElementById(currentRow + '.' + currentCol).removeAttribute("onclick");
                }
            }
        }
    }
}


/**
 * Builds the board (<table>) in the HTML page and sets an id for each cell together with some classes (id form: <row>.<column>).
 */
function buildBoard() {
    var table = document.getElementById("Board");
    table.style.visibility = "visible";
    table.innerHTML = '';

    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        var row = table.insertRow(currentRow);

        for (var currentCol = 0; currentCol < COLS; currentCol++) {
            var cell = row.insertCell(currentCol);

            cell.setAttribute("id", currentRow + '.' + currentCol);

            cell.className = "cell";
            cell.classList.add("brightCell");
        }
    }
}


/**
 * Sets a background color (by assigning a class) for each cell in the HTML board.
 */
function boardBackground() {
    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {
            if ((currentRow + currentCol) % 2 == 0) {
                document.getElementById(currentRow + '.' + currentCol).classList.add("whiteTile");
            }
            else {
                document.getElementById(currentRow + '.' + currentCol).classList.add("blackTile");
            }
        }
    }
}


/**
 * Initializes all dark cells' brightness by removing the class "darkCell" and adding the class "brightCell".
 */
function initBrightness() {
    var darkCells = document.querySelectorAll(".darkCell");

    for (var i = 0; i < darkCells.length; i++) {
        darkCells[i].classList.remove("darkCell");
        darkCells[i].classList.add("brightCell");
    }
}


/**
 * Gets an HTML element and changes its brightness. Dark ---> Bright | Bright ---> Dark.
 * @param {HTMLElement} cell - The HTML element to change brightness.
 */
function changeBrightness(cell) {
    cell.classList.toggle("darkCell");
    cell.classList.toggle("brightCell");
}


/**
 * Initializes all moveable cells by removing the class "moveableCell" and adding the class "brightCell"
 */
function initMoveableCells() {
    var moveableCells = document.querySelectorAll(".moveableCell");

    for (var i = 0; i < moveableCells.length; i++) {
        moveableCells[i].classList.remove("moveableCell");
        moveableCells[i].classList.add("brightCell");

        moveableCells[i].removeAttribute("onclick");
    }

    enableClickOnPlayers();
}


// ----- GAME FUNCTIONS -----
/**
 * Draws the players on the HTML board according to "BOARD".
 */
function drawPlayers() {

    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {

            var cell = document.getElementById(currentRow + '.' + currentCol);

            if (BOARD[currentRow][currentCol] == WHITE_PLAYER) {
                document.getElementById(currentRow + '.' + currentCol).classList.add("whitePlayer");
            }
            else if (BOARD[currentRow][currentCol] == BLACK_PLAYER) {
                document.getElementById(currentRow + '.' + currentCol).classList.add("blackPlayer");
            }
            else if (cell.classList.contains("whitePlayer")) {
                document.getElementById(currentRow + '.' + currentCol).classList.remove("whitePlayer");
            }
            else if (cell.classList.contains("blackPlayer")) {
                document.getElementById(currentRow + '.' + currentCol).classList.remove("blackPlayer");
            }
        }
    }

    enableClickOnPlayers();
    checkWin();
}


/**
 * Moves a player from one cell to another on the "BOARD", redraws the players on the board, and changes the turn.
 * @param {string} idCell1 - The ID of the cell from which the player is moving.
 * @param {string} idCell2 - The ID of the cell to which the player is moving.
 */
function movePlayer(idCell1, idCell2) {
    var [row1, col1] = idCell1.split('.');
    var [row2, col2] = idCell2.split('.');

    BOARD[row2][col2] = BOARD[row1][col1];
    BOARD[row1][col1] = BLACK_TILE;

    drawPlayers();

    changeTurn();
}


/**
 * Moves a player from one cell to another on the "BOARD" and removes the eaten player from the board.
 * @param {string} idCell1 - The ID of the cell from which the player is moving.
 * @param {string} idCell2 - The ID of the cell to which the player is moving.
 */
function eatPlayer(idCell1, idCell2) {

    /**
     * Calculates the ID of the cell containing the eaten player based on the given cells IDs.
     * @param {string} idCell1 - The ID of the cell from which the player is moving.
     * @param {string} idCell2 - The ID of the cell to which the player is moving.
     * @returns {number[]}     - An array containing the row and column values of the cell containing the eaten player.
     */
    function calcEeatenPlayerId(idCell1, idCell2) {
        var [row1, col1] = idCell1.split('.');
        var [row2, col2] = idCell2.split('.');

        var eatenPlayerRow = (parseInt(row1) + parseInt(row2)) / 2;
        var eatenPlayerCol = (parseInt(col1) + parseInt(col2)) / 2;

        return [eatenPlayerRow, eatenPlayerCol];
    }

    var [eatenPlayerRow, eatenPlayerCol] = calcEeatenPlayerId(idCell1, idCell2);

    BOARD[eatenPlayerRow][eatenPlayerCol] = BLACK_TILE;
}


/**
 * Handles the movement of the white player based on the pressed cell on the game board.
 * @param {HTMLElement} pressedCell - The pressed cell representing the white player.
 */
function handleWhiteMovement(pressedCell) {
    if (TURN == WHITE_PLAYER) {
        var [pressedCellRow, pressedCellCol] = pressedCell.id.split('.');

        // Getting the cells to which the player at "pressedCell" can possibly move to
        var leftCellId = (parseInt(pressedCellRow) - 1) + '.' + (parseInt(pressedCellCol) - 1);
        var rightCellId = (parseInt(pressedCellRow) - 1) + '.' + (parseInt(pressedCellCol) + 1);

        var leftCell = document.getElementById(leftCellId);
        var rightCell = document.getElementById(rightCellId);
        // ------------------------------------------------------------------ 

        // Regular move (LEFT)
        if ((leftCell != null) && (!leftCell.classList.contains("whitePlayer")) && (!leftCell.classList.contains("blackPlayer"))) {
            leftCell.classList.remove("brightCell");
            leftCell.classList.add("moveableCell");
            leftCell.setAttribute("onclick", "initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + leftCell.id + "');");
        }

        // Eating Section (LEFT)
        else if ((leftCell != null) && (leftCell.classList.contains("blackPlayer"))) {
            var leftLeftCellId = (parseInt(pressedCellRow) - 2) + '.' + (parseInt(pressedCellCol) - 2);
            var leftLeftCell = document.getElementById(leftLeftCellId);

            if ((leftLeftCell != null) && (!leftLeftCell.classList.contains("whitePlayer")) && (!leftLeftCell.classList.contains("blackPlayer"))) {
                leftLeftCell.classList.remove("brightCell");
                leftLeftCell.classList.add("moveableCell");
                leftLeftCell.setAttribute("onclick", "eatPlayer('" + pressedCell.id + "', '" + leftLeftCell.id + "'); initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + leftLeftCell.id + "');");
            }
        }



        // Regular move (RIGHT)
        if ((rightCell != null) && (!rightCell.classList.contains("whitePlayer")) && (!rightCell.classList.contains("blackPlayer"))) {
            rightCell.classList.remove("brightCell");
            rightCell.classList.add("moveableCell");
            rightCell.setAttribute("onclick", "initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + rightCell.id + "'); ");
        }

        // Eating Section (RIGHT)
        else if ((rightCell != null) && (rightCell.classList.contains("blackPlayer"))) {
            var rightRightCellId = (parseInt(pressedCellRow) - 2) + '.' + (parseInt(pressedCellCol) + 2);
            var rightRightCell = document.getElementById(rightRightCellId);

            if ((rightRightCell != null) && (!rightRightCell.classList.contains("whitePlayer")) && (!rightRightCell.classList.contains("blackPlayer"))) {
                rightRightCell.classList.remove("brightCell");
                rightRightCell.classList.add("moveableCell");
                rightRightCell.setAttribute("onclick", "eatPlayer('" + pressedCell.id + "', '" + rightRightCell.id + "'); initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + rightRightCell.id + "');");
            }
        }
    }
}


/**
 * Handles the movement of the black player based on the pressed cell on the game board.
 * @param {HTMLElement} pressedCell - The pressed cell representing the black player.
 */
function handleBlackMovement(pressedCell) {
    if (TURN == BLACK_PLAYER) {
        var [pressedCellRow, pressedCellCol] = pressedCell.id.split('.');

        // Getting the cells to which the player at "pressedCell" can possibly move to
        var leftCellId = (parseInt(pressedCellRow) + 1) + '.' + (parseInt(pressedCellCol) - 1);
        var rightCellId = (parseInt(pressedCellRow) + 1) + '.' + (parseInt(pressedCellCol) + 1);

        var leftCell = document.getElementById(leftCellId);
        var rightCell = document.getElementById(rightCellId);
        // ------------------------------------------------------------------ 

        // Regular move (LEFT)
        if ((leftCell != null) && (!leftCell.classList.contains("whitePlayer")) && (!leftCell.classList.contains("blackPlayer"))) {
            leftCell.classList.remove("brightCell");
            leftCell.classList.add("moveableCell");
            leftCell.setAttribute("onclick", "initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + leftCell.id + "');");
        }

        // Eating Section (LEFT)
        else if ((leftCell != null) && leftCell.classList.contains("whitePlayer")) {
            var leftLeftCellId = (parseInt(pressedCellRow) + 2) + '.' + (parseInt(pressedCellCol) - 2);
            var leftLeftCell = document.getElementById(leftLeftCellId);

            if ((leftLeftCell != null) && (!leftLeftCell.classList.contains("whitePlayer")) && (!leftLeftCell.classList.contains("blackPlayer"))) {
                leftLeftCell.classList.remove("brightCell");
                leftLeftCell.classList.add("moveableCell");
                leftLeftCell.setAttribute("onclick", "eatPlayer('" + pressedCell.id + "', '" + leftLeftCell.id + "'); initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + leftLeftCell.id + "');");
            }
        }



        // Regular move (RIGHT)
        if ((rightCell != null) && (!rightCell.classList.contains("whitePlayer")) && (!rightCell.classList.contains("blackPlayer"))) {
            rightCell.classList.remove("brightCell");
            rightCell.classList.add("moveableCell");
            rightCell.setAttribute("onclick", "initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + rightCell.id + "');");
        }

        // Eating Section (RIGHT)
        else if ((rightCell != null) && (rightCell.classList.contains("whitePlayer"))) {
            var rightRightCellId = (parseInt(pressedCellRow) + 2) + '.' + (parseInt(pressedCellCol) + 2);
            var rightRightCell = document.getElementById(rightRightCellId);

            if ((rightRightCell != null) && (!rightRightCell.classList.contains("whitePlayer")) && (!rightRightCell.classList.contains("blackPlayer"))) {
                rightRightCell.classList.remove("brightCell");
                rightRightCell.classList.add("moveableCell");
                rightRightCell.setAttribute("onclick", "eatPlayer('" + pressedCell.id + "', '" + rightRightCell.id + "'); initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + rightRightCell.id + "'); ");
            }
        }
    }
}


/**
 * Changes the turn from the current player to the opposite player.
 */
function changeTurn() {
    if (TURN == WHITE_PLAYER) {
        TURN = BLACK_PLAYER;
        if (GAME_ENDED == false) {
            blackTurn.play();
        }
    }
    else if (TURN == BLACK_PLAYER) {
        TURN = WHITE_PLAYER;
        if (GAME_ENDED == false) {
            redTurn.play();
        }
    }
}


// ----- WIN SECTION -----
/**
 * Checks if a player has won the game by reaching the opposite end of the board. if a player won - disables click events on the board.
 */
function checkWin() {
    if (BOARD[0].includes(WHITE_PLAYER)) {
        GAME_ENDED = true;

        winAudio.play();

        disableClicks();
        darkenBoard();
        addPlayAgainButton();
    }

    if (BOARD[ROWS - 1].includes(BLACK_PLAYER)) {
        GAME_ENDED = true;

        winAudio.play();

        disableClicks();
        darkenBoard();
        addPlayAgainButton();
    }
}


/**
 *  Disables click events for every cell on the board.
 */
function disableClicks() {
    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {
            document.getElementById(currentRow + '.' + currentCol).removeAttribute("onclick");
        }
    }
}


/**
 * the cells in the board dark.
 */
function darkenBoard() {
    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {
            document.getElementById(currentRow + '.' + currentCol).classList.remove("brightCell");
            document.getElementById(currentRow + '.' + currentCol).classList.add("darkCell");
        }
    }
}


/**
 * Makes the PLAY AGAIN button hidden
 */
function hideButton() {
    document.getElementById("playAgainButton").style.visibility = "hidden";
}


/**
 * Makes the PLAY AGAIN button visible
 */
function addPlayAgainButton() {
    document.getElementById("playAgainButton").style.visibility = "visible";
}


// ----- START BUTTON -----
/**
 * Removes the START button from the HTML page.
 */
function removeStartButton() {
    document.getElementById("start").remove();
}


/**
 * Makes the start button visible
 */
function start() {
    document.getElementById("start").style.visibility = "visible";
}


// ----- Main -----
/**
 * Initializes things and starts the game.
 */
function game() {
    GAME_ENDED = false;
    TURN = WHITE_PLAYER;

    redTurn.play();

    initBoard();
    buildBoard();
    boardBackground();
    drawPlayers();
}
