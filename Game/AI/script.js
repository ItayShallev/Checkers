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

// ----- SCORING FACTORS -----
const ROW_SCORE = 10;
const EATING_SCORE = 20
const ALMOST_WINNING_SCORE = 1500;
const WINNING_SCORE = 2000;

// ----- AUDIO -----
var winAudio = new Audio("../../Media/winAudio.mp3");


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
 * Makes the cells with players on them clickable for some functions to run.
 */
function enableClickOnPlayers() {
    if (!GAME_ENDED) {
        for (var currentRow = 0; currentRow < ROWS; currentRow++) {
            for (var currentCol = 0; currentCol < COLS; currentCol++) {
                if (BOARD[currentRow][currentCol] == WHITE_PLAYER) {
                    document.getElementById(currentRow + '.' + currentCol).setAttribute("onclick", "initBrightness(this); changeBrightness(this); initMoveableCells(); handleWhiteMovement(this);");
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

            // Removing the player from the previous cell - goes here only if a player havn't been added in this iteration
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

        // Calculating the ID of the eaten player
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

        // MOVING LEFT
        if ((leftCell != null) && (!leftCell.classList.contains("whitePlayer")) && (!leftCell.classList.contains("blackPlayer"))) {
            leftCell.classList.remove("brightCell");
            leftCell.classList.add("moveableCell");
            leftCell.setAttribute("onclick", "initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + leftCell.id + "');");
        }

        // EATING LEFT
        else if ((leftCell != null) && (leftCell.classList.contains("blackPlayer"))) {
            var leftLeftCellId = (parseInt(pressedCellRow) - 2) + '.' + (parseInt(pressedCellCol) - 2);
            var leftLeftCell = document.getElementById(leftLeftCellId);

            if ((leftLeftCell != null) && (!leftLeftCell.classList.contains("whitePlayer")) && (!leftLeftCell.classList.contains("blackPlayer"))) {
                leftLeftCell.classList.remove("brightCell");
                leftLeftCell.classList.add("moveableCell");
                leftLeftCell.setAttribute("onclick", "eatPlayer('" + pressedCell.id + "', '" + leftLeftCell.id + "'); initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + leftLeftCell.id + "');");
            }
        }


        // MOVING RIGHT
        if ((rightCell != null) && (!rightCell.classList.contains("whitePlayer")) && (!rightCell.classList.contains("blackPlayer"))) {
            rightCell.classList.remove("brightCell");
            rightCell.classList.add("moveableCell");
            rightCell.setAttribute("onclick", "initMoveableCells(); initBrightness(); movePlayer('" + pressedCell.id + "', '" + rightCell.id + "'); ");
        }

        // EATING RIGHT
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


// ---------- AI MOVEMENT ----------

/**
 * Calculates the score of the board based on the amount of players on the board.
 * @param {number[][]} board - The board to calculate the score for.
 * @returns {number}         - The score of the board.
 */
function calcScoreByAmount(board) {
    var score = 0;

    for (var currentRow; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {

            if (board[currentRow][currentCol] == BLACK_PLAYER) {
                score += 1;
            }

            else if (board[currentRow][currentCol] == WHITE_PLAYER) {
                score -= 1;
            }
        }
    }

    console.log(("BY AMOUNT: " + score));

    return score;
}

/**
 * Calculates the score of the board based on the rows of the players on the board.
 * @param {number[][]} board - The board to calculate the score for.
 * @returns {number}         - The score of the board.
 */
function calcScoreByRow(board) {
    var score = 0;

    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {

            if (board[currentRow][currentCol] == BLACK_PLAYER) {
                score += (currentRow + 1) * ROW_SCORE;
            }

            else if (board[currentRow][currentCol] == WHITE_PLAYER) {
                score -= (COLS - currentRow) * ROW_SCORE;
            }
        }
    }

    console.log("BY ROW: " + score);

    return score;
}

/**
 * Checks if the given row and column are in the board.
 * @param {number} row - The row to check.
 * @param {number} col - The column to check.
 * @returns {boolean}  - True if the row and column are in the board, false otherwise.
 */
function checkIndex(row, col) {
    return (row >= 0) && (row < ROWS) && (col >= 0) && (col < COLS);
}


/** 
 * Checks if the player at the given row and column can eat a player.
 * @param {number[][]} board - The board to check.
 * @param {number} row       - The row of the player to check.
 * @param {number} col       - The column of the player to check.
 * @returns {boolean}        - True if the player can eat a player, false otherwise.
 */
function canEat(board, row, col) {

    // CHECK BLACK PLAYER EATING OPTIONS
    if (board[row][col] == BLACK_PLAYER) {

        // CHECK EATING LEFT
        if ((checkIndex(row + 1, col - 1)) && board[row + 1][col - 1] == WHITE_PLAYER) {
            if ((checkIndex(row + 2, col - 2)) && board[row + 2][col - 2] == BLACK_TILE) {
                return true;
            }
        }

        // CHECK EATING RIGHT
        if ((checkIndex(row + 1, col + 1)) && board[row + 1][col + 1] == WHITE_PLAYER) {
            if ((checkIndex(row + 2, col + 2)) && board[row + 2][col + 2] == BLACK_TILE) {
                return true;
            }
        }
    }

    // CHECK WHITE PLAYER EATING OPTIONS
    if (board[row][col] == WHITE_PLAYER) {

        // CHECK EATING LEFT
        if ((checkIndex(row - 1, col - 1)) && board[row - 1][col - 1] == BLACK_PLAYER) {
            if ((checkIndex(row - 2, col - 2)) && board[row - 2][col - 2] == BLACK_TILE) {
                return true;
            }
        }

        // CHECK EATING RIGHT
        if ((checkIndex(row - 1, col + 1)) && board[row - 1][col + 1] == BLACK_PLAYER) {
            if ((checkIndex(row - 2, col + 2)) && board[row - 2][col + 2] == BLACK_TILE) {
                return true;
            }
        }
    }

    return false;
}


function calcScoreByEating(board) {
    var score = 0;

    for (var currentRow = 0; currentRow < ROWS; currentRow++) {
        for (var currentCol = 0; currentCol < COLS; currentCol++) {
            if ((board[currentRow][currentCol] == WHITE_PLAYER) && (canEat(board, currentRow, currentCol))) {
                score -= EATING_SCORE;
            }

            else if ((board[currentRow][currentCol] == BLACK_PLAYER) && (canEat(board, currentRow, currentCol))) {
                score += EATING_SCORE;
            }
        }
    }

    console.log("BY EATING: " + score);

    return score;
}


function calcScoreByWinning() {
    var score = 0;

    for (var col = 0; col < COLS; col++) {
        if (BOARD[6][col] == BLACK_PLAYER) {
            score += ALMOST_WINNING_SCORE;
        }
        if (BOARD[7][col] == BLACK_PLAYER) {
            score += WINNING_SCORE;
        }
    }

    //for (var col = 0; col < COLS; col++) {
    //    if (BOARD[1][col] == WHITE_PLAYER) {
    //        score -= ALMOST_WINNING_SCORE;
    //    }
    //    if (BOARD[0][col] == WHITE_PLAYER) {
    //        score -= WINNING_SCORE;
    //    }
    //}

    return score;
}


function evaluateBoard(board) {
    return calcScoreByAmount(board) + calcScoreByRow(board) + calcScoreByEating(board) + calcScoreByWinning();
}


function returnPossibleMoves() {

    var movesCount = 0;

    var possibleMoves = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
                         [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
                         [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
                         [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
                        ];

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {

            // CHECK IF CAN MOVE RIGHT
            if ((BOARD[row][col] == BLACK_PLAYER) && (checkIndex(row + 1, col + 1)) && (BOARD[row + 1][col + 1] == BLACK_TILE)) {
                possibleMoves[movesCount][0] = row; possibleMoves[movesCount][1] = col;
                possibleMoves[movesCount][2] = row + 1; possibleMoves[movesCount][3] = col + 1;

                movesCount++;
            }

            // CHECK IF CAN MOVE LEFT
            if ((BOARD[row][col] == BLACK_PLAYER) && (checkIndex(row + 1, col - 1)) && (BOARD[row + 1][col - 1] == BLACK_TILE)) {
                possibleMoves[movesCount][0] = row; possibleMoves[movesCount][1] = col;
                possibleMoves[movesCount][2] = row + 1; possibleMoves[movesCount][3] = col - 1;

                movesCount++;
            }


            // CHECK EATING RIGHT
            if ((BOARD[row][col] == BLACK_PLAYER) && (checkIndex(row + 1, col + 1)) && (BOARD[row + 1][col + 1] == WHITE_PLAYER)) {
                if ((checkIndex(row + 2, col + 2)) && BOARD[row + 2][col + 2] == BLACK_TILE) {
                    possibleMoves[movesCount][0] = row; possibleMoves[movesCount][1] = col;
                    possibleMoves[movesCount][2] = row + 2; possibleMoves[movesCount][3] = col + 2;

                    movesCount++;
                }
            }

            // CHECK EATING LEFT
            if ((BOARD[row][col] == BLACK_PLAYER) && (BOARD[row + 1][col - 1] == WHITE_PLAYER)) {
                if ((checkIndex(row + 2, col - 2)) && BOARD[row + 2][col - 2] == BLACK_TILE) {
                    possibleMoves[movesCount][0] = row; possibleMoves[movesCount][1] = col;
                    possibleMoves[movesCount][2] = row + 2; possibleMoves[movesCount][3] = col - 2;

                    movesCount++;
                }
            }
        }
    }

    return possibleMoves;
}


function simulation(possibleMoves) {
    var boardCopy = null;
    var currentBoardScore = 0;

    var bestMoveScore = 0;
    var bestMoveIndex = 0;

    for (var move = 0; move < 10; move++) {
        if (possibleMoves[move][0] == possibleMoves[move][2]) {      // CHECKING IF GOT TO UNINITIALIZED MOVE {0, 0, 0, 0}
            break;
        }

        // COPYING THE ORIGINAL BOARD
        boardCopy = JSON.parse(JSON.stringify(BOARD));

        if (Math.abs(possibleMoves[move][2] - possibleMoves[move][0]) == 2) {       // IF EATING MOVE...
            var eatRow = (possibleMoves[move][0] + possibleMoves[move][2]) / 2;
            var eatCol = (possibleMoves[move][1] + possibleMoves[move][3]) / 2;

            // PERFORMING EATING MOVE ON THE BOARD COPY
            boardCopy[possibleMoves[move][0]][possibleMoves[move][1]] = BLACK_TILE;
            boardCopy[eatRow][eatCol] = BLACK_TILE;
            boardCopy[possibleMoves[move][2]][possibleMoves[move][3]] = BLACK_PLAYER;
        }
        else {                                                      // IF NORMAL MOVE
            // MOVING NORAMLLY
            boardCopy[possibleMoves[move][0]][possibleMoves[move][1]] = BLACK_TILE;
            boardCopy[possibleMoves[move][2]][possibleMoves[move][3]] = BLACK_PLAYER;
        }


        currentBoardScore = evaluateBoard(boardCopy);       // CALCULATING THE SCORE FOR THE CURRENT BOARD

        if (currentBoardScore > bestMoveScore) {
            console.log("%c" + currentBoardScore + " is bigger than " + bestMoveScore, 'background-color: red');
            bestMoveScore = currentBoardScore;
            bestMoveIndex = move;
        }

        console.log("SCORE FOR MOVE FROM [" + possibleMoves[move][0] + ", " + possibleMoves[move][1] + "]" +
            " TO [" + possibleMoves[move][2] + ", " + possibleMoves[move][3] + "]: " + currentBoardScore);
        console.log("---------------------------------------------");
    }

    console.log("%c\nBEST MOVE IS FROM [" + possibleMoves[bestMoveIndex][0] + ", " + possibleMoves[bestMoveIndex][1] + "]" +
        " TO [" + possibleMoves[bestMoveIndex][2] + ", " + possibleMoves[bestMoveIndex][3] + "]\n\n", 'background-color: yellow');

    return [possibleMoves[bestMoveIndex][0], possibleMoves[bestMoveIndex][1], possibleMoves[bestMoveIndex][2], possibleMoves[bestMoveIndex][3]]
}

// ---------- BLACK AI MOVEMENT ----------


/**
 * Changes the turn from the current player to the opposite player.
 */
function changeTurn() {
    if (TURN == WHITE_PLAYER) {
        TURN = BLACK_PLAYER;
        setTimeout(() => {
            if (GAME_ENDED == false) {

                var moves = returnPossibleMoves();

                var bestMove = simulation(moves);

                if ((bestMove[2] - bestMove[0]) == 1) {        // If regular Move
                    BOARD[bestMove[0]][bestMove[1]] = BLACK_TILE;
                    BOARD[bestMove[2]][bestMove[3]] = BLACK_PLAYER;
                }

                else if ((bestMove[2] - bestMove[0]) == 2) {       // If eat move
                    BOARD[bestMove[0]][bestMove[1]] = BLACK_TILE;

                    eatPlayer(bestMove[0] + "." + bestMove[1], bestMove[2] + "." + bestMove[3]);

                    BOARD[bestMove[2]][bestMove[3]] = BLACK_PLAYER;
                }

                drawPlayers();

                changeTurn();
            }
        }, 200);

    }
    else if (TURN == BLACK_PLAYER) {
        TURN = WHITE_PLAYER;
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

    initBoard();
    buildBoard();
    boardBackground();
    drawPlayers();
}
