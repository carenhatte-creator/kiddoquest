// ===================================
// KinderQuest Alphabet Games Menu
// ===================================

console.log("alphabet.js loaded");


function startGame(game) {

    // Play button sound
    if (typeof window.playButton === "function") {
        window.playButton();
    }


    // Give the sound a moment to play
    setTimeout(() => {

        switch (game) {


            // ===================================
            // LETTER MATCHING
            // ===================================

            case "letter-matching":

                window.location.href =
                    "activities/letter-matching.html";

                break;


            // ===================================
            // LETTER SORT
            // ===================================

            case "letter-sort":

                window.location.href =
                    "activities/letter-sort.html";

                break;


            // ===================================
            // DRAG & DROP LETTERS
            // ===================================

            case "drag-drop":

                window.location.href =
                    "activities/drag-drop.html";

                break;


            // ===================================
            // LETTER MEMORY
            // ===================================

            case "letter-memory":

                window.location.href =
                    "activities/letter-memory.html";

                break;


            // ===================================
            // GAME NOT FOUND
            // ===================================

            default:

                alert("Game not found!");

                break;

        }

    }, 200);

}