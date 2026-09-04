// ===================================
// KinderQuest Color Games Menu
// ===================================

console.log("colors.js loaded");


function startGame(game) {

    switch (game) {


        // ===================================
        // COLOR MATCH
        // ===================================

        case "matching":

            window.location.href =
                "activities/color-match.html";

            break;


        // ===================================
        // COLOR SORT
        // ===================================

        case "sort":

            window.location.href =
                "activities/color-sort.html";

            break;


        // ===================================
        // COLOR MEMORY
        // ===================================

        case "memory":

            window.location.href =
                "activities/color-memory.html";

            break;


        // ===================================
        // COLOR Pick
        // ===================================

        case "pick":

            window.location.href =
                "activities/color-pick.html";

            break;


        // ===================================
        // GAME NOT FOUND
        // ===================================

        default:

            alert("Game not found!");

            break;

    }

}