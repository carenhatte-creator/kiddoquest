// ===================================
// KinderQuest Number Games Menu
// ===================================

console.log("numbers.js loaded");

function startGame(game) {

    switch (game) {

        // ===================================
        // COUNTING GAME
        // ===================================

        case "counting-game":

            window.location.href =
                "activities/counting-game.html";

            break;


        // ===================================
        // SIMPLE ADDITION
        // ===================================

        case "addition":

            window.location.href =
                "activities/number-addition.html";

            break;


        // ===================================
        // NUMBER SEQUENCE
        // ===================================

        case "sequence":

            window.location.href =
                "activities/number-sequence.html";

            break;


        // ===================================
        // PAIRING NUMBER
        // ===================================

        case "pairing":

            window.location.href =
                "activities/pairing-number.html";

            break;


        // ===================================
        // NUMBER MARKET
        // ===================================

        case "market":

            window.location.href =
                "activities/number-market.html";

            break;


        // ===================================
        // UNKNOWN GAME
        // ===================================

        default:

            alert("Game not found!");

            break;
    }

}