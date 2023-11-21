PLAYER_ONE_NAME = "Player 1";
PLAYER_TWO_NAME = "PC";


/**
 * This function is called when the user clicks on the "Play" button.
 */
function hidePlayersOptions() {
    var players_options = document.getElementById("players-options");
    players_options.style.display = "none";
}


/**
 * Checks if the names that the user entered are valid.
 */
function checkValidNames() {
    var player1_input_box = document.getElementById("player1_input_box").value;
    var player2_input_box = document.getElementById("player2_input_box").value;

    if (player1_input_box == "" || player2_input_box == "") {
        alert("Please enter valid names");
    }
    else if (player1_input_box == player2_input_box) {
        alert("Please enter different names");
    }
    else {
        if (player2_input_box == "PC") {
            window.location.href = "../Game/AI/game.html";
        }
        else {
            window.location.href = "../Game/regular/game.html";
        }
    }
}


/**
 * Loads the names form and the submit button.
 * @param {int} numOfPlayers 
 */
function loadNamesForm(numOfPlayers) {
    var player1_input_box = document.createElement("input");
    var player2_input_box = document.createElement("input");

    player1_input_box.className = "input-box";
    player2_input_box.className = "input-box";

    player1_input_box.setAttribute("id", "player1_input_box");
    player2_input_box.setAttribute("id", "player2_input_box");

    player1_input_box.setAttribute("placeholder", "Player 1");
    player2_input_box.setAttribute("placeholder", "Player 2");

    // Adding the input boxes according to the number of players the user chose
    if (numOfPlayers == 1) {
        document.getElementById("pre-game-preparations").appendChild(player1_input_box);
        
        player2_input_box.value = "PC";
        player2_input_box.setAttribute("readonly", "readonly");
        document.getElementById("pre-game-preparations").appendChild(player2_input_box);
    }
    if (numOfPlayers == 2) {
        document.getElementById("pre-game-preparations").appendChild(player1_input_box);
        document.getElementById("pre-game-preparations").appendChild(player2_input_box);
    }
    
    // Adding a new line
    var new_line = document.createElement("br");
    document.getElementById("pre-game-preparations").appendChild(new_line);

    // Adding a submit button
    var submit_button = document.createElement("button");

    submit_button.className = "submit-button";
    submit_button.setAttribute("onclick", "checkValidNames()");

    document.getElementById("pre-game-preparations").appendChild(submit_button);
}
