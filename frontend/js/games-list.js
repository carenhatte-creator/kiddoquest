// ===================================
// KinderQuest Master Games List
// ===================================
//
// Ito yung "master list" ng lahat ng minigames sa app.
// Kapag nagdagdag ka ng bagong minigame, dito mo lang idagdag
// dito sa tamang category array — automatic na mag-uupdate
// yung "Total Mini Games" count sa Dashboard.
//
// "built: true"  = tapos na / may gumaganang laro
// "built: false" = wala pang gumaganang laro (placeholder pa lang)

const GAMES_LIST = {

    alphabet: [

        { id: "letter-matching", name: "Letter Matching", built: true },
        { id: "letter-sort", name: "Letter Sort", built: false },
        { id: "drag-drop", name: "Drag and Drop", built: true },
        { id: "letter-memory", name: "Letter Memory", built: true }

    ],

    numbers: [

        { id: "counting-game", name: "Counting Game", built: true },
        { id: "pairing-number", name: "Pairing Numbers", built: false },
        { id: "addition", name: "Simple Addition", built: true },
        { id: "number-sequence", name: "Number Sequence", built: false }

    ],

    colors: [

        { id: "color-match", name: "Color Matching", built: false },
        { id: "color-sort", name: "Color Sort", built: false },
        { id: "color-memory", name: "Color Memory", built: false },
        { id: "color-pick", name: "Color Pick", built: false }

    ],

    shapes: [

        { id: "matching", name: "Shadow Match", built: false },
        { id: "shape-hunt", name: "Shape Hunt", built: false },
        { id: "puzzle", name: "Shape Puzzle", built: false },
        { id: "shape-town-builder", name: "Shape Town Builder", built: false }

    ]

};


// ===================================
// HELPER: GET TOTAL GAMES COUNT
// ===================================

function getTotalGamesCount() {

    let total = 0;

    for (const category in GAMES_LIST) {

        total += GAMES_LIST[category].length;

    }

    return total;

}


// ===================================
// HELPER: GET TOTAL BUILT (WORKING) GAMES COUNT
// ===================================

function getBuiltGamesCount() {

    let total = 0;

    for (const category in GAMES_LIST) {

        total += GAMES_LIST[category].filter(

            game => game.built

        ).length;

    }

    return total;

}


// ===================================
// PARA MAGAMIT SA IBANG JS FILES
// ===================================

window.GAMES_LIST = GAMES_LIST;

window.getTotalGamesCount =
    getTotalGamesCount;

window.getBuiltGamesCount =
    getBuiltGamesCount;