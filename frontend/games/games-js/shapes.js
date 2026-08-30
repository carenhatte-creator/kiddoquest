// ===================================
// KinderQuest Shape Games Menu
// ===================================

console.log("shapes.js loaded");

function startGame(game) {
    switch (game) {

        // ==============================
        // SHADOW MATCH
        // ==============================
        case "shadow-match":
            window.location.href =
                "activities/shadow-match.html";
            break;

        // ==============================
        // SHAPE HUNT
        // ==============================
        case "shape-hunt":
            window.location.href =
                "activities/shape-hunt.html";
            break;

        // ==============================
        // SHAPE PUZZLE
        // ==============================
        case "puzzle":
            window.location.href =
                "activities/shape-puzzle.html";
            break;

        // ==============================
        // SHAPE TOWN BUILDER
        // ==============================
        case "shape-town-builder":
            window.location.href =
                "activities/shape-town-builder.html";
            break;

        // ==============================
        // DEFAULT
        // ==============================
        default:
            alert("Game not found!");
            break;
    }
}