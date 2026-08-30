// ==========================================================
// KINDERQUEST - LETTER SORT
// FULL UPDATED VERSION
// DESKTOP + TABLET + ANDROID TOUCH DRAG
// ==========================================================
//
// SOUND FLOW:
//
// GAME START
//      ↓
// 🎵 BACKGROUND MUSIC
//      ↓
// SORT LETTERS
//      ↓
// CORRECT LETTER = NO SOUND
// WRONG LETTER   = NO SOUND
//      ↓
// ALL 5 LETTERS CORRECT
//      ↓
// TRAIN MOVES
//      ↓
// ⭐ +1 STAR
//      ↓
// 🔊 playCorrect() ONLY HERE
//      ↓
// REWARD CARD
//
// MOBILE:
// - Tap letter → tap slot
// - Touch drag → slot
// - Desktop drag → slot
//
// IMPORTANT:
// - NO SOUND PER CORRECT LETTER
// - NO WRONG SOUND
// - NO CLICK SOUND
// - playCorrect() ONLY WHEN STAR IS REWARDED
// - BACKGROUND MUSIC USES soundManager.js
// - NO LOADING BETWEEN LEVELS
// - NO LOADING ON PLAY AGAIN
// - RESULT CARD STAYS
// - GAME OVER CARD STAYS
// - SELECTED STUDENT IS USED
// - LOCAL PROGRESS IS SAVED
// - BACKEND PROGRESS IS SAVED
// ==========================================================


// ==========================================================
// API
// ==========================================================

const API_BASE =
    "https://kiddoquest-backend.onrender.com/api";


// ==========================================================
// GAME SETTINGS
// ==========================================================

const TOTAL_LEVELS = 5;
const LETTERS_PER_LEVEL = 5;
const MAX_LIVES = 3;
const MAX_HINTS = 3;


// ==========================================================
// LEVEL DATA
// ==========================================================

const LEVEL_DATA = [

    {
        level: 1,
        letters: ["A", "B", "C", "D", "E"]
    },

    {
        level: 2,
        letters: ["F", "G", "H", "I", "J"]
    },

    {
        level: 3,
        letters: ["K", "L", "M", "N", "O"]
    },

    {
        level: 4,
        letters: ["P", "Q", "R", "S", "T"]
    },

    {
        level: 5,
        letters: ["U", "V", "W", "X", "Y"]
    }

];


// ==========================================================
// GAME VARIABLES
// ==========================================================

let currentLevel = 1;

let score = 0;

let stars = 0;

let lives = MAX_LIVES;

let hints = MAX_HINTS;

let correctCount = 0;

let currentLetters = [];

let placedLetters = [];

let selectedLetter = null;

let gameActive = false;

let rewardOpen = false;

let gameOver = false;

let gameComplete = false;

let trainMoving = false;


// ==========================================================
// STUDENT
// ==========================================================

let selectedStudent = null;

let hasSelectedStudent = false;


// ==========================================================
// BACKEND SAVE CONTROL
// ==========================================================

let backendSaveFinished = false;

let backendSaveInProgress = false;


// ==========================================================
// DOM
// ==========================================================

let loadingScreen;
let loadingBarFill;

let scoreElement;
let starsElement;
let livesElement;
let levelElement;

let lettersContainer;
let letterSlots;

let levelRewardModal;
let rewardLevelTitle;
let rewardStarText;
let nextLevelBtn;

let hintBtn;
let hintCount;
let restartBtn;

let gameOverModal;
let gameOverLevel;
let gameOverScore;
let gameOverStars;
let gameOverAgainBtn;
let gameOverBackBtn;

let completeModal;
let finalStarsDisplay;
let finalScore;
let finalStars;
let playAgainBtn;
let backBtn;

let noStudentOverlay;
let playingStudentName;

let topBackButton;

let truck;


// ==========================================================
// BACKGROUND MUSIC CONTROL
// ==========================================================

let backgroundMusicStarted = false;


// ==========================================================
// MOBILE TOUCH DRAG VARIABLES
// ==========================================================

let touchDragCard = null;

let touchDragLetter = null;

let touchDragClone = null;

let touchDragActive = false;

let touchDragStarted = false;

let touchStartX = 0;

let touchStartY = 0;

let touchCurrentX = 0;

let touchCurrentY = 0;

let touchDragThreshold = 8;

let touchDragPointerId = null;

let touchDragTargetSlot = null;


// ==========================================================
// DOM READY
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeDOM();

        initializeButtons();

        initializeSlots();

        loadSelectedStudent();

        runInitialLoading();

    }
);


// ==========================================================
// INITIALIZE DOM
// ==========================================================

function initializeDOM() {

    loadingScreen =
        document.getElementById("loadingScreen");

    loadingBarFill =
        document.getElementById("loadingBarFill");


    scoreElement =
        document.getElementById("score");

    starsElement =
        document.getElementById("stars");

    livesElement =
        document.getElementById("lives");

    levelElement =
        document.getElementById("level");


    lettersContainer =
        document.getElementById("lettersContainer");

    letterSlots =
        document.querySelectorAll(".letter-slot");


    levelRewardModal =
        document.getElementById("levelRewardModal");

    rewardLevelTitle =
        document.getElementById("rewardLevelTitle");

    rewardStarText =
        document.getElementById("rewardStarText");

    nextLevelBtn =
        document.getElementById("nextLevelBtn");


    hintBtn =
        document.getElementById("hintBtn");

    hintCount =
        document.getElementById("hintCount");

    restartBtn =
        document.getElementById("restartBtn");


    gameOverModal =
        document.getElementById("gameOverModal");

    gameOverLevel =
        document.getElementById("gameOverLevel");

    gameOverScore =
        document.getElementById("gameOverScore");

    gameOverStars =
        document.getElementById("gameOverStars");

    gameOverAgainBtn =
        document.getElementById("gameOverAgainBtn");

    gameOverBackBtn =
        document.getElementById("gameOverBackButton");


    if (!gameOverBackBtn) {

        gameOverBackBtn =
            document.getElementById("gameOverBackBtn");

    }


    completeModal =
        document.getElementById("completeModal");

    finalStarsDisplay =
        document.getElementById("finalStarsDisplay");

    finalScore =
        document.getElementById("finalScore");

    finalStars =
        document.getElementById("finalStars");

    playAgainBtn =
        document.getElementById("playAgainBtn");

    backBtn =
        document.getElementById("backBtn");


    noStudentOverlay =
        document.getElementById("noStudentOverlay");

    playingStudentName =
        document.getElementById("playingStudentName");


    topBackButton =
        document.getElementById("topBackButton");


    truck =
        document.getElementById("truck");

}


// ==========================================================
// START BACKGROUND MUSIC
// ==========================================================

function startGameBackgroundMusic() {

    if (
        typeof window.startBackgroundMusic !==
        "function"
    ) {

        console.warn(
            "Letter Sort: startBackgroundMusic was not found in soundManager.js"
        );

        return;

    }


    try {

        window.startBackgroundMusic();

        backgroundMusicStarted = true;

    }

    catch (error) {

        console.warn(
            "Letter Sort: Could not start background music.",
            error
        );

    }

}


// ==========================================================
// ENSURE BACKGROUND MUSIC
// ==========================================================

function ensureBackgroundMusic() {

    if (backgroundMusicStarted) {
        return;
    }

    startGameBackgroundMusic();

}


// ==========================================================
// LOAD SELECTED STUDENT
// ==========================================================

function loadSelectedStudent() {

    selectedStudent = null;

    hasSelectedStudent = false;


    const studentKeys = [

        "selectedStudent",
        "selected_student",

        "currentStudent",
        "current_student",

        "activeStudent",
        "active_student",

        "student",

        "selectedChild",
        "selected_child",

        "currentChild",
        "current_child"

    ];


    // ======================================================
    // LOCAL STORAGE
    // ======================================================

    for (const key of studentKeys) {

        const value =
            localStorage.getItem(key);

        if (!value) {
            continue;
        }


        const student =
            parseStudentValue(value);


        if (student) {

            selectedStudent =
                student;

            hasSelectedStudent =
                true;

            break;

        }

    }


    // ======================================================
    // SESSION STORAGE
    // ======================================================

    if (!hasSelectedStudent) {

        for (const key of studentKeys) {

            const value =
                sessionStorage.getItem(key);

            if (!value) {
                continue;
            }


            const student =
                parseStudentValue(value);


            if (student) {

                selectedStudent =
                    student;

                hasSelectedStudent =
                    true;

                break;

            }

        }

    }


    updateStudentUI();

}


// ==========================================================
// PARSE STUDENT
// ==========================================================

function parseStudentValue(value) {

    if (!value) {
        return null;
    }


    try {

        const parsed =
            JSON.parse(value);


        if (
            parsed === null ||
            parsed === undefined
        ) {

            return null;

        }


        if (
            typeof parsed === "string"
        ) {

            return parsed.trim()
                ? {
                    name: parsed.trim()
                }
                : null;

        }


        if (
            typeof parsed === "object"
        ) {

            return parsed;

        }

    }

    catch (error) {

        const text =
            String(value).trim();


        if (text !== "") {

            return {
                name: text
            };

        }

    }


    return null;

}


// ==========================================================
// UPDATE STUDENT UI
// ==========================================================

function updateStudentUI() {

    if (!playingStudentName) {
        return;
    }


    if (hasSelectedStudent) {

        playingStudentName.textContent =
            getStudentName();


        if (noStudentOverlay) {

            noStudentOverlay.style.display =
                "none";

            noStudentOverlay.style.visibility =
                "hidden";

            noStudentOverlay.style.pointerEvents =
                "none";

        }

    }

    else {

        playingStudentName.textContent =
            "Student";


        if (noStudentOverlay) {

            noStudentOverlay.style.display =
                "flex";

            noStudentOverlay.style.visibility =
                "visible";

            noStudentOverlay.style.pointerEvents =
                "auto";

        }

    }


    playingStudentName.style.display =
        "inline-block";

    playingStudentName.style.width =
        "auto";

    playingStudentName.style.textAlign =
        "left";

    playingStudentName.style.whiteSpace =
        "nowrap";

}


// ==========================================================
// GET FULL STUDENT NAME
// ==========================================================

function getStudentName() {

    if (!selectedStudent) {
        return "Student";
    }


    if (
        typeof selectedStudent ===
        "string"
    ) {

        return (
            selectedStudent.trim() ||
            "Student"
        );

    }


    const firstName =
        selectedStudent.firstName ||
        selectedStudent.first_name ||
        selectedStudent.givenName ||
        selectedStudent.given_name ||
        "";


    const middleName =
        selectedStudent.middleName ||
        selectedStudent.middle_name ||
        selectedStudent.middleInitial ||
        selectedStudent.middle_initial ||
        "";


    const lastName =
        selectedStudent.lastName ||
        selectedStudent.last_name ||
        selectedStudent.surname ||
        selectedStudent.familyName ||
        selectedStudent.family_name ||
        "";


    const combinedName = [

        firstName,
        middleName,
        lastName

    ]
        .filter(
            function (name) {

                return (
                    typeof name ===
                        "string" &&
                    name.trim() !== ""
                );

            }
        )
        .join(" ")
        .replace(
            /\s+/g,
            " "
        )
        .trim();


    if (combinedName !== "") {
        return combinedName;
    }


    const fullNameFields = [

        selectedStudent.fullName,
        selectedStudent.full_name,

        selectedStudent.studentName,
        selectedStudent.student_name,

        selectedStudent.displayName,
        selectedStudent.display_name,

        selectedStudent.childName,
        selectedStudent.child_name,

        selectedStudent.pupilName,
        selectedStudent.pupil_name,

        selectedStudent.completeName,
        selectedStudent.complete_name

    ];


    for (const name of fullNameFields) {

        if (
            typeof name === "string" &&
            name.trim() !== ""
        ) {

            return name
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();

        }

    }


    if (
        typeof selectedStudent.name ===
            "string" &&
        selectedStudent.name.trim() !== ""
    ) {

        return selectedStudent.name
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    return "Student";

}


// ==========================================================
// GET STUDENT ID
// ==========================================================

function getStudentId() {

    if (!selectedStudent) {
        return null;
    }


    if (
        typeof selectedStudent ===
        "string"
    ) {

        return null;

    }


    return (
        selectedStudent.id ||
        selectedStudent.student_id ||
        selectedStudent.studentId ||
        selectedStudent.user_id ||
        selectedStudent.userId ||
        null
    );

}


// ==========================================================
// GET TEACHER
// ==========================================================

function getTeacherData() {

    const teacherData =
        localStorage.getItem("teacher");


    if (!teacherData) {
        return null;
    }


    try {

        return JSON.parse(
            teacherData
        );

    }

    catch (error) {

        console.error(
            "Invalid teacher data:",
            error
        );

        return null;

    }

}


// ==========================================================
// GET TEACHER ID
// ==========================================================

function getTeacherId() {

    const teacher =
        getTeacherData();


    if (!teacher) {
        return null;
    }


    return (
        teacher.id ||
        teacher.teacher_id ||
        teacher.teacherId ||
        null
    );

}


// ==========================================================
// INITIAL LOADING
// ==========================================================

function runInitialLoading() {

    if (!hasSelectedStudent) {

        hideLoading();

        startGame();

        return;

    }


    if (!loadingScreen) {

        startGame();

        return;

    }


    loadingScreen.style.display =
        "flex";

    loadingScreen.style.visibility =
        "visible";

    loadingScreen.style.opacity =
        "1";

    loadingScreen.style.pointerEvents =
        "auto";


    if (loadingBarFill) {

        loadingBarFill.style.width =
            "0%";

    }


    let progress = 0;


    const loadingInterval =
        setInterval(
            function () {

                progress +=
                    Math.floor(
                        Math.random() * 8
                    ) + 5;


                if (progress >= 100) {

                    progress = 100;


                    if (loadingBarFill) {

                        loadingBarFill.style.width =
                            "100%";

                    }


                    clearInterval(
                        loadingInterval
                    );


                    setTimeout(
                        function () {

                            hideLoading();

                            startGame();

                        },
                        300
                    );

                }

                else {

                    if (loadingBarFill) {

                        loadingBarFill.style.width =
                            progress + "%";

                    }

                }

            },
            100
        );

}


// ==========================================================
// HIDE LOADING
// ==========================================================

function hideLoading() {

    if (!loadingScreen) {
        return;
    }


    loadingScreen.style.opacity =
        "0";

    loadingScreen.style.pointerEvents =
        "none";

    loadingScreen.style.visibility =
        "hidden";

    loadingScreen.style.display =
        "none";

}


// ==========================================================
// BUTTONS
// ==========================================================

function initializeButtons() {

    if (nextLevelBtn) {

        nextLevelBtn.addEventListener(
            "click",
            function () {

                ensureBackgroundMusic();

                goToNextLevel();

            }
        );

    }


    if (hintBtn) {

        hintBtn.addEventListener(
            "click",
            function () {

                ensureBackgroundMusic();

                useHint();

            }
        );

    }


    if (restartBtn) {

        restartBtn.addEventListener(
            "click",
            function () {

                ensureBackgroundMusic();

                restartGame();

            }
        );

    }


    if (gameOverAgainBtn) {

        gameOverAgainBtn.addEventListener(
            "click",
            function () {

                ensureBackgroundMusic();

                closeGameOver();

                restartGame();

            }
        );

    }


    if (gameOverBackBtn) {

        gameOverBackBtn.addEventListener(
            "click",
            goBackToAlphabet
        );

    }


    if (playAgainBtn) {

        playAgainBtn.addEventListener(
            "click",
            function () {

                ensureBackgroundMusic();

                closeComplete();

                restartGame();

            }
        );

    }


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            goBackToAlphabet
        );

    }


    if (topBackButton) {

        topBackButton.addEventListener(
            "click",
            function (event) {

                if (
                    gameOver ||
                    gameComplete ||
                    rewardOpen
                ) {

                    event.preventDefault();

                    return;

                }


                goBackToAlphabet();

            }
        );

    }

}


// ==========================================================
// FIRST USER INTERACTION
// ==========================================================

document.addEventListener(
    "pointerdown",
    function () {

        ensureBackgroundMusic();

    },
    {
        once: true,
        passive: true
    }
);


// ==========================================================
// INITIALIZE SLOTS
// ==========================================================

function initializeSlots() {

    if (!letterSlots) {
        return;
    }


    letterSlots.forEach(
        function (slot) {

            slot.addEventListener(
                "dragover",
                function (event) {

                    if (!canInteract()) {
                        return;
                    }


                    event.preventDefault();

                    slot.classList.add(
                        "drag-over"
                    );

                }
            );


            slot.addEventListener(
                "dragleave",
                function () {

                    slot.classList.remove(
                        "drag-over"
                    );

                }
            );


            slot.addEventListener(
                "drop",
                function (event) {

                    if (!canInteract()) {
                        return;
                    }


                    event.preventDefault();

                    slot.classList.remove(
                        "drag-over"
                    );


                    ensureBackgroundMusic();


                    const letter =
                        event.dataTransfer
                            ? event.dataTransfer.getData(
                                "text/plain"
                            )
                            : "";


                    if (!letter) {
                        return;
                    }


                    placeLetterInSlot(
                        letter,
                        slot
                    );

                }
            );


            slot.addEventListener(
                "click",
                function () {

                    if (!canInteract()) {
                        return;
                    }


                    ensureBackgroundMusic();


                    if (!selectedLetter) {
                        return;
                    }


                    placeLetterInSlot(
                        selectedLetter,
                        slot
                    );

                }
            );

        }
    );

}


// ==========================================================
// START GAME
// ==========================================================

function startGame() {

    clearAllGameState();


    gameOver = false;

    gameComplete = false;

    gameActive = true;

    rewardOpen = false;

    trainMoving = false;


    backendSaveFinished = false;

    backendSaveInProgress = false;


    currentLevel = 1;

    score = 0;

    stars = 0;

    lives = MAX_LIVES;

    hints = MAX_HINTS;


    closeGameOver();

    closeComplete();

    closeReward();


    resetTrain();


    updateAllUI();


    // ======================================================
    // BACKGROUND MUSIC
    // ======================================================

    startGameBackgroundMusic();


    loadLevel(1);

}


// ==========================================================
// CLEAR STATE
// ==========================================================

function clearAllGameState() {

    correctCount = 0;

    selectedLetter = null;

    currentLetters = [];

    placedLetters = [];

    clearTouchDrag();

}


// ==========================================================
// LOAD LEVEL
// ==========================================================

function loadLevel(levelNumber) {

    if (
        gameOver ||
        gameComplete
    ) {

        return;

    }


    if (
        levelNumber < 1 ||
        levelNumber > TOTAL_LEVELS
    ) {

        return;

    }


    currentLevel =
        levelNumber;

    correctCount =
        0;

    selectedLetter =
        null;

    rewardOpen =
        false;

    gameActive =
        true;

    trainMoving =
        false;


    closeReward();


    const levelData =
        LEVEL_DATA[
            currentLevel - 1
        ];


    currentLetters = [
        ...levelData.letters
    ];


    placedLetters =
        new Array(
            LETTERS_PER_LEVEL
        ).fill(null);


    resetTrain();

    updateAllUI();

    createLetterCards();

    resetSlots();

}


// ==========================================================
// RESET TRAIN
// ==========================================================

function resetTrain() {

    trainMoving = false;


    if (!truck) {

        truck =
            document.getElementById(
                "truck"
            );

    }


    if (!truck) {
        return;
    }


    truck.style.transition =
        "none";

    truck.style.left =
        "4%";


    void truck.offsetWidth;


    truck.style.transition =
        "left 1.2s ease";

}


// ==========================================================
// CREATE LETTER CARDS
// ==========================================================

function createLetterCards() {

    if (!lettersContainer) {
        return;
    }


    lettersContainer.innerHTML =
        "";


    const shuffled =
        shuffleArray([
            ...currentLetters
        ]);


    shuffled.forEach(
        function (letter) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "letter-card";

            card.textContent =
                letter;

            card.dataset.letter =
                letter;

            card.draggable =
                true;


            card.setAttribute(
                "role",
                "button"
            );

            card.setAttribute(
                "tabindex",
                "0"
            );


            // ==================================================
            // DESKTOP DRAG
            // ==================================================

            card.addEventListener(
                "dragstart",
                function (event) {

                    if (!canInteract()) {

                        event.preventDefault();

                        return;

                    }


                    ensureBackgroundMusic();


                    selectedLetter =
                        letter;


                    event.dataTransfer.setData(
                        "text/plain",
                        letter
                    );


                    event.dataTransfer.effectAllowed =
                        "move";


                    card.classList.add(
                        "dragging"
                    );

                }
            );


            card.addEventListener(
                "dragend",
                function () {

                    card.classList.remove(
                        "dragging"
                    );

                }
            );


            // ==================================================
            // CLICK / TAP
            // ==================================================

            card.addEventListener(
                "click",
                function () {

                    if (!canInteract()) {
                        return;
                    }


                    ensureBackgroundMusic();


                    selectLetter(
                        card,
                        letter
                    );

                }
            );


            // ==================================================
            // KEYBOARD
            // ==================================================

            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();


                        if (!canInteract()) {
                            return;
                        }


                        ensureBackgroundMusic();


                        selectLetter(
                            card,
                            letter
                        );

                    }

                }
            );


            // ==================================================
            // MOBILE / TABLET TOUCH DRAG
            // ==================================================

            initializeTouchDrag(card, letter);


            lettersContainer.appendChild(
                card
            );

        }
    );

}


// ==========================================================
// SELECT LETTER
// ==========================================================
//
// NO SOUND HERE.
// ==========================================================

function selectLetter(
    card,
    letter
) {

    if (!canInteract()) {
        return;
    }


    document
        .querySelectorAll(
            ".letter-card.selected"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "selected"
                );

            }
        );


    card.classList.add(
        "selected"
    );


    selectedLetter =
        letter;

}


// ==========================================================
// MOBILE / TABLET TOUCH DRAG
// ==========================================================

function initializeTouchDrag(
    card,
    letter
) {

    if (!card) {
        return;
    }


    card.addEventListener(
        "pointerdown",
        function (event) {

            if (!canInteract()) {
                return;
            }


            if (
                event.pointerType !== "touch" &&
                event.pointerType !== "pen"
            ) {

                return;

            }


            ensureBackgroundMusic();


            touchDragCard =
                card;

            touchDragLetter =
                letter;

            touchDragPointerId =
                event.pointerId;

            touchStartX =
                event.clientX;

            touchStartY =
                event.clientY;

            touchCurrentX =
                event.clientX;

            touchCurrentY =
                event.clientY;

            touchDragStarted =
                false;

            touchDragActive =
                true;

            touchDragTargetSlot =
                null;


            selectedLetter =
                letter;


            card.classList.add(
                "touch-pressed"
            );


            try {

                card.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                // Ignore if pointer capture is unavailable.

            }


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    card.addEventListener(
        "pointermove",
        function (event) {

            if (!touchDragActive) {
                return;
            }


            if (
                event.pointerId !==
                touchDragPointerId
            ) {

                return;

            }


            touchCurrentX =
                event.clientX;

            touchCurrentY =
                event.clientY;


            const distance =
                Math.sqrt(
                    Math.pow(
                        touchCurrentX -
                        touchStartX,
                        2
                    ) +
                    Math.pow(
                        touchCurrentY -
                        touchStartY,
                        2
                    )
                );


            if (
                !touchDragStarted &&
                distance >= touchDragThreshold
            ) {

                touchDragStarted =
                    true;

                createTouchDragClone();

            }


            if (touchDragStarted) {

                moveTouchDragClone(
                    touchCurrentX,
                    touchCurrentY
                );


                updateTouchDragTarget(
                    touchCurrentX,
                    touchCurrentY
                );

            }


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    card.addEventListener(
        "pointerup",
        function (event) {

            if (!touchDragActive) {
                return;
            }


            if (
                event.pointerId !==
                touchDragPointerId
            ) {

                return;

            }


            touchCurrentX =
                event.clientX;

            touchCurrentY =
                event.clientY;


            if (touchDragStarted) {

                const target =
                    getSlotAtPoint(
                        touchCurrentX,
                        touchCurrentY
                    );


                if (
                    target &&
                    canInteract()
                ) {

                    placeLetterInSlot(
                        touchDragLetter,
                        target
                    );

                }

            }

            else {

                selectLetter(
                    card,
                    letter
                );

            }


            clearTouchDrag();


            try {

                card.releasePointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                // Ignore.

            }


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    card.addEventListener(
        "pointercancel",
        function () {

            clearTouchDrag();

        },
        {
            passive: false
        }
    );

}


// ==========================================================
// CREATE TOUCH DRAG CLONE
// ==========================================================

function createTouchDragClone() {

    if (
        !touchDragCard ||
        !touchDragLetter
    ) {

        return;

    }


    touchDragCard.classList.add(
        "touch-dragging"
    );


    touchDragClone =
        touchDragCard.cloneNode(true);


    touchDragClone.classList.remove(
        "selected"
    );


    touchDragClone.classList.remove(
        "touch-pressed"
    );


    touchDragClone.classList.add(
        "touch-drag-clone"
    );


    touchDragClone.style.position =
        "fixed";

    touchDragClone.style.left =
        "0px";

    touchDragClone.style.top =
        "0px";

    touchDragClone.style.margin =
        "0";

    touchDragClone.style.pointerEvents =
        "none";

    touchDragClone.style.zIndex =
        "999999";


    const rect =
        touchDragCard.getBoundingClientRect();


    touchDragClone.style.width =
        rect.width + "px";

    touchDragClone.style.height =
        rect.height + "px";


    document.body.appendChild(
        touchDragClone
    );


    moveTouchDragClone(
        touchCurrentX,
        touchCurrentY
    );

}


// ==========================================================
// MOVE TOUCH DRAG CLONE
// ==========================================================

function moveTouchDragClone(
    x,
    y
) {

    if (!touchDragClone) {
        return;
    }


    const width =
        touchDragClone.offsetWidth || 80;

    const height =
        touchDragClone.offsetHeight || 80;


    touchDragClone.style.left =
        (x - width / 2) + "px";

    touchDragClone.style.top =
        (y - height / 2) + "px";

}


// ==========================================================
// GET SLOT AT POINT
// ==========================================================

function getSlotAtPoint(
    x,
    y
) {

    const elements =
        document.elementsFromPoint
            ? document.elementsFromPoint(
                x,
                y
            )
            : [];


    for (
        const element of elements
    ) {

        if (
            element &&
            element.classList &&
            element.classList.contains(
                "letter-slot"
            )
        ) {

            return element;

        }

    }


    return null;

}


// ==========================================================
// UPDATE TOUCH DRAG TARGET
// ==========================================================

function updateTouchDragTarget(
    x,
    y
) {

    const target =
        getSlotAtPoint(
            x,
            y
        );


    if (
        touchDragTargetSlot &&
        touchDragTargetSlot !== target
    ) {

        touchDragTargetSlot.classList.remove(
            "drag-over"
        );

    }


    touchDragTargetSlot =
        target;


    if (target) {

        if (
            target.dataset.position !==
            undefined &&
            placedLetters[
                Number(
                    target.dataset.position
                )
            ] !== null
        ) {

            target.classList.remove(
                "drag-over"
            );

            return;

        }


        target.classList.add(
            "drag-over"
        );

    }

}


// ==========================================================
// CLEAR TOUCH DRAG
// ==========================================================

function clearTouchDrag() {

    if (touchDragCard) {

        touchDragCard.classList.remove(
            "touch-pressed"
        );

        touchDragCard.classList.remove(
            "touch-dragging"
        );

    }


    if (touchDragTargetSlot) {

        touchDragTargetSlot.classList.remove(
            "drag-over"
        );

    }


    if (touchDragClone) {

        touchDragClone.remove();

    }


    touchDragCard = null;

    touchDragLetter = null;

    touchDragClone = null;

    touchDragActive = false;

    touchDragStarted = false;

    touchDragPointerId = null;

    touchDragTargetSlot = null;

}


// ==========================================================
// PLACE LETTER IN SLOT
// ==========================================================

function placeLetterInSlot(
    letter,
    slot
) {

    if (!canInteract()) {
        return;
    }


    if (!letter || !slot) {
        return;
    }


    const position =
        Number(
            slot.dataset.position
        );


    if (
        Number.isNaN(position) ||
        position < 0 ||
        position >= LETTERS_PER_LEVEL
    ) {

        return;

    }


    if (
        placedLetters[position] !==
        null
    ) {

        return;

    }


    const correctLetter =
        currentLetters[position];


    if (
        letter ===
        correctLetter
    ) {

        handleCorrectAnswer(
            letter,
            slot,
            position
        );

    }

    else {

        handleWrongAnswer(
            slot
        );

    }

}


// ==========================================================
// CORRECT LETTER
// ==========================================================
//
// NO SOUND HERE.
// ==========================================================

function handleCorrectAnswer(
    letter,
    slot,
    position
) {

    if (!canInteract()) {
        return;
    }


    placedLetters[position] =
        letter;


    correctCount++;

    score += 10;


    slot.innerHTML =
        "";


    const placed =
        document.createElement(
            "span"
        );


    placed.className =
        "placed-letter";


    placed.textContent =
        letter;


    slot.appendChild(
        placed
    );


    slot.classList.add(
        "correct"
    );


    slot.classList.remove(
        "wrong",
        "drag-over"
    );


    removeLetterCard(
        letter
    );


    selectedLetter =
        null;


    updateAllUI();


    // ======================================================
    // NO CORRECT SOUND
    // ======================================================

    saveLocalProgress();


    // ======================================================
    // ALL LETTERS CORRECT
    // ======================================================

    if (
        correctCount ===
        LETTERS_PER_LEVEL
    ) {

        gameActive =
            false;


        setTimeout(
            function () {

                moveTrainToFinish();

            },
            450
        );

    }

}


// ==========================================================
// WRONG LETTER
// ==========================================================
//
// NO SOUND.
// ==========================================================

function handleWrongAnswer(slot) {

    if (!canInteract()) {
        return;
    }


    lives--;


    if (lives < 0) {
        lives = 0;
    }


    updateLives();


    slot.classList.add(
        "wrong"
    );


    setTimeout(
        function () {

            slot.classList.remove(
                "wrong"
            );

        },
        400
    );


    // ======================================================
    // NO WRONG SOUND
    // ======================================================

    saveLocalProgress();


    if (lives <= 0) {

        lives = 0;

        updateLives();

        showGameOver();

    }

}


// ==========================================================
// REMOVE LETTER CARD
// ==========================================================

function removeLetterCard(letter) {

    if (!lettersContainer) {
        return;
    }


    lettersContainer
        .querySelectorAll(
            ".letter-card"
        )
        .forEach(
            function (card) {

                if (
                    card.dataset.letter ===
                    letter
                ) {

                    card.remove();

                }

            }
        );

}


// ==========================================================
// TRAIN MOVEMENT
// ==========================================================

function moveTrainToFinish() {

    if (
        gameOver ||
        gameComplete ||
        trainMoving
    ) {

        return;

    }


    trainMoving = true;

    gameActive = false;

    selectedLetter = null;


    if (!truck) {

        truck =
            document.getElementById(
                "truck"
            );

    }


    if (!truck) {

        trainMoving = false;

        completeLevel();

        return;

    }


    truck.style.left =
        "calc(100% - 185px)";


    setTimeout(
        function () {

            if (
                gameOver ||
                gameComplete
            ) {

                return;

            }


            trainMoving = false;

            completeLevel();

        },
        1250
    );

}


// ==========================================================
// COMPLETE LEVEL
// ==========================================================
//
// ONLY PLACE WHERE playCorrect() IS USED.
// ==========================================================

function completeLevel() {

    if (
        gameOver ||
        gameComplete ||
        rewardOpen
    ) {

        return;

    }


    gameActive = false;

    rewardOpen = true;


    // ======================================================
    // +1 STAR
    // ======================================================

    stars++;


    if (stars > TOTAL_LEVELS) {

        stars =
            TOTAL_LEVELS;

    }


    updateStars();


    // ======================================================
    // STAR REWARD SOUND
    // ======================================================

    if (
        typeof window.playCorrect ===
        "function"
    ) {

        window.playCorrect();

    }

    else {

        console.warn(
            "Letter Sort: playCorrect function was not found in soundManager.js"
        );

    }


    saveLocalProgress();

    showReward();

}


// ==========================================================
// SHOW REWARD
// ==========================================================

function showReward() {

    if (!levelRewardModal) {
        return;
    }


    if (rewardLevelTitle) {

        rewardLevelTitle.textContent =
            "Level " +
            currentLevel +
            " Complete!";

    }


    if (rewardStarText) {

        rewardStarText.textContent =
            "+1 STAR";

    }


    if (nextLevelBtn) {

        nextLevelBtn.textContent =
            currentLevel === TOTAL_LEVELS
                ? "Finish →"
                : "Next Level →";

    }


    levelRewardModal.classList.add(
        "hidden"
    );


    void levelRewardModal.offsetWidth;


    levelRewardModal.classList.remove(
        "hidden"
    );


    levelRewardModal.style.display =
        "flex";

    levelRewardModal.style.visibility =
        "visible";

    levelRewardModal.style.opacity =
        "1";

    levelRewardModal.style.pointerEvents =
        "auto";

}


// ==========================================================
// CLOSE REWARD
// ==========================================================

function closeReward() {

    if (!levelRewardModal) {
        return;
    }


    levelRewardModal.classList.add(
        "hidden"
    );


    levelRewardModal.style.display =
        "none";

    levelRewardModal.style.visibility =
        "hidden";

    levelRewardModal.style.opacity =
        "0";

    levelRewardModal.style.pointerEvents =
        "none";


    rewardOpen =
        false;

}


// ==========================================================
// NEXT LEVEL
// ==========================================================

function goToNextLevel() {

    if (
        gameOver ||
        gameComplete ||
        !rewardOpen
    ) {

        return;

    }


    closeReward();


    if (
        currentLevel >=
        TOTAL_LEVELS
    ) {

        showComplete();

        return;

    }


    currentLevel++;


    // ======================================================
    // NO LOADING
    // ======================================================

    loadLevel(
        currentLevel
    );

}


// ==========================================================
// GAME OVER
// ==========================================================

function showGameOver() {

    gameOver = true;

    gameComplete = false;

    gameActive = false;

    rewardOpen = false;

    trainMoving = false;

    selectedLetter = null;


    clearTouchDrag();

    closeReward();


    if (gameOverLevel) {

        gameOverLevel.textContent =
            currentLevel;

    }


    if (gameOverScore) {

        gameOverScore.textContent =
            score;

    }


    if (gameOverStars) {

        gameOverStars.textContent =
            stars;

    }


    if (lettersContainer) {

        lettersContainer
            .querySelectorAll(
                ".letter-card"
            )
            .forEach(
                function (card) {

                    card.draggable =
                        false;


                    card.classList.remove(
                        "selected",
                        "dragging",
                        "touch-dragging"
                    );

                }
            );

    }


    saveLocalProgress();

    saveProgressToBackend();


    if (gameOverModal) {

        gameOverModal.classList.remove(
            "hidden"
        );


        gameOverModal.style.display =
            "flex";

        gameOverModal.style.visibility =
            "visible";

        gameOverModal.style.opacity =
            "1";

        gameOverModal.style.pointerEvents =
            "auto";

        gameOverModal.style.zIndex =
            "90000";

    }

}


// ==========================================================
// CLOSE GAME OVER
// ==========================================================

function closeGameOver() {

    if (!gameOverModal) {
        return;
    }


    gameOverModal.classList.add(
        "hidden"
    );


    gameOverModal.style.display =
        "none";

    gameOverModal.style.visibility =
        "hidden";

    gameOverModal.style.opacity =
        "0";

    gameOverModal.style.pointerEvents =
        "none";

}


// ==========================================================
// COMPLETE GAME
// ==========================================================

function showComplete() {

    gameOver = false;

    gameComplete = true;

    gameActive = false;

    rewardOpen = false;

    trainMoving = false;

    selectedLetter = null;


    clearTouchDrag();

    closeReward();


    if (finalScore) {

        finalScore.textContent =
            score;

    }


    if (finalStars) {

        finalStars.textContent =
            stars;

    }


    if (finalStarsDisplay) {

        const safeStars =
            Math.max(
                0,
                Math.min(
                    stars,
                    TOTAL_LEVELS
                )
            );


        finalStarsDisplay.textContent =
            "⭐".repeat(
                safeStars
            );

    }


    if (completeModal) {

        completeModal.classList.remove(
            "hidden"
        );


        completeModal.style.display =
            "flex";

        completeModal.style.visibility =
            "visible";

        completeModal.style.opacity =
            "1";

        completeModal.style.pointerEvents =
            "auto";

        completeModal.style.zIndex =
            "90000";

    }


    // ======================================================
    // NO playCorrect() HERE.
    // ======================================================

    saveLocalProgress();

    saveProgressToBackend();

}


// ==========================================================
// CLOSE COMPLETE
// ==========================================================

function closeComplete() {

    if (!completeModal) {
        return;
    }


    completeModal.classList.add(
        "hidden"
    );


    completeModal.style.display =
        "none";

    completeModal.style.visibility =
        "hidden";

    completeModal.style.opacity =
        "0";

    completeModal.style.pointerEvents =
        "none";

}


// ==========================================================
// RESTART
// ==========================================================
//
// NO LOADING
// NO PAGE RELOAD
// ==========================================================

function restartGame() {

    clearTouchDrag();

    closeReward();

    closeGameOver();

    closeComplete();


    gameOver = false;

    gameComplete = false;

    gameActive = true;

    rewardOpen = false;

    trainMoving = false;


    backendSaveFinished = false;

    backendSaveInProgress = false;


    currentLevel = 1;

    score = 0;

    stars = 0;

    lives = MAX_LIVES;

    hints = MAX_HINTS;


    correctCount = 0;

    selectedLetter = null;


    resetTrain();

    updateAllUI();


    // ======================================================
    // KEEP BACKGROUND MUSIC
    // ======================================================

    ensureBackgroundMusic();


    loadLevel(1);

}


// ==========================================================
// HINT
// ==========================================================

function useHint() {

    if (!canInteract()) {
        return;
    }


    if (hints <= 0) {
        return;
    }


    const position =
        getNextEmptyPosition();


    if (position === -1) {
        return;
    }


    const correctLetter =
        currentLetters[position];


    const slot =
        document.querySelector(
            '.letter-slot[data-position="' +
            position +
            '"]'
        );


    hints--;

    updateHints();


    if (slot) {

        slot.classList.add(
            "hint-highlight"
        );


        setTimeout(
            function () {

                slot.classList.remove(
                    "hint-highlight"
                );

            },
            1200
        );

    }


    if (lettersContainer) {

        const card =
            lettersContainer.querySelector(
                '[data-letter="' +
                correctLetter +
                '"]'
            );


        if (card) {

            card.classList.add(
                "hint-letter"
            );


            setTimeout(
                function () {

                    card.classList.remove(
                        "hint-letter"
                    );

                },
                1200
            );

        }

    }


    saveLocalProgress();

}


// ==========================================================
// NEXT EMPTY POSITION
// ==========================================================

function getNextEmptyPosition() {

    for (
        let i = 0;
        i < placedLetters.length;
        i++
    ) {

        if (
            placedLetters[i] ===
            null
        ) {

            return i;

        }

    }


    return -1;

}


// ==========================================================
// RESET SLOTS
// ==========================================================

function resetSlots() {

    if (!letterSlots) {
        return;
    }


    letterSlots.forEach(
        function (slot, index) {

            slot.innerHTML =
                '<span class="slot-number">' +
                (index + 1) +
                "</span>";


            slot.classList.remove(
                "correct",
                "wrong",
                "drag-over",
                "hint-highlight"
            );

        }
    );

}


// ==========================================================
// CAN INTERACT
// ==========================================================

function canInteract() {

    return (

        gameActive === true &&

        gameOver === false &&

        gameComplete === false &&

        rewardOpen === false &&

        trainMoving === false &&

        lives > 0

    );

}


// ==========================================================
// UPDATE ALL UI
// ==========================================================

function updateAllUI() {

    updateScore();

    updateStars();

    updateLives();

    updateLevel();

    updateHints();

    updateStudentUI();

}


// ==========================================================
// SCORE
// ==========================================================

function updateScore() {

    if (scoreElement) {

        scoreElement.textContent =
            score;

    }

}


// ==========================================================
// STARS
// ==========================================================

function updateStars() {

    if (starsElement) {

        starsElement.textContent =
            stars;

    }

}


// ==========================================================
// LIVES
// ==========================================================

function updateLives() {

    if (!livesElement) {
        return;
    }


    let output =
        "";


    for (
        let i = 0;
        i < MAX_LIVES;
        i++
    ) {

        output +=
            i < lives
                ? "❤️"
                : "🖤";


        if (
            i <
            MAX_LIVES - 1
        ) {

            output +=
                " ";

        }

    }


    livesElement.textContent =
        output;

}


// ==========================================================
// LEVEL
// ==========================================================

function updateLevel() {

    if (levelElement) {

        levelElement.textContent =
            currentLevel;

    }

}


// ==========================================================
// HINTS
// ==========================================================

function updateHints() {

    if (hintCount) {

        hintCount.textContent =
            hints;

    }


    if (hintBtn) {

        hintBtn.disabled =
            hints <= 0;

    }

}


// ==========================================================
// BACK
// ==========================================================

function goBackToAlphabet() {

    window.location.href =
        "../alphabet.html";

}


// ==========================================================
// SHUFFLE
// ==========================================================

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        const temp =
            array[i];


        array[i] =
            array[j];


        array[j] =
            temp;

    }


    return array;

}


// ==========================================================
// SAVE LOCAL PROGRESS
// ==========================================================

function saveLocalProgress() {

    const teacherId =
        getTeacherId();

    const studentId =
        getStudentId();


    const localProgress = {

        game:
            "letter-sort",

        gameName:
            "Letter Sort",

        category:
            "Alphabet",

        activity:
            "Letter Sort",

        teacherId:
            teacherId,

        studentId:
            studentId,

        studentName:
            getStudentName(),

        level:
            currentLevel,

        score:
            score,

        stars:
            stars,

        lives:
            lives,

        hints:
            hints,

        completed:
            gameComplete,

        gameOver:
            gameOver,

        totalLevels:
            TOTAL_LEVELS,

        lettersPerLevel:
            LETTERS_PER_LEVEL,

        updatedAt:
            new Date().toISOString()

    };


    try {

        localStorage.setItem(
            "letterSortProgress",
            JSON.stringify(
                localProgress
            )
        );


        if (studentId !== null) {

            localStorage.setItem(
                "letterSortProgress_" +
                studentId,
                JSON.stringify(
                    localProgress
                )
            );

        }

    }

    catch (error) {

        console.error(
            "Letter Sort local progress error:",
            error
        );

    }

}


// ==========================================================
// SAVE PROGRESS TO BACKEND
// ==========================================================

async function saveProgressToBackend() {

    if (
        backendSaveFinished ||
        backendSaveInProgress
    ) {

        return;

    }


    backendSaveInProgress =
        true;


    const teacher =
        getTeacherData();


    if (!teacher) {

        console.error(
            "LETTER SORT: Progress not saved. Teacher data is missing."
        );


        backendSaveInProgress =
            false;


        return;

    }


    let student =
        selectedStudent;


    if (!student) {

        const studentData =
            localStorage.getItem(
                "selectedStudent"
            );


        if (studentData) {

            try {

                student =
                    JSON.parse(
                        studentData
                    );

            }

            catch (error) {

                console.error(
                    "LETTER SORT: Invalid selectedStudent data.",
                    error
                );

            }

        }

    }


    if (!student) {

        console.error(
            "LETTER SORT: Progress not saved. Student is missing."
        );


        backendSaveInProgress =
            false;


        return;

    }


    const teacherId =
        teacher.id ||
        teacher.teacher_id ||
        teacher.teacherId;


    const studentId =
        student.id ||
        student.student_id ||
        student.studentId;


    if (!teacherId) {

        console.error(
            "LETTER SORT: teacher_id is missing.",
            teacher
        );


        backendSaveInProgress =
            false;


        return;

    }


    if (!studentId) {

        console.error(
            "LETTER SORT: student_id is missing.",
            student
        );


        backendSaveInProgress =
            false;


        return;

    }


    const maximumScore =
        TOTAL_LEVELS *
        LETTERS_PER_LEVEL *
        10;


    let percentageScore =
        Math.round(
            (
                score /
                maximumScore
            ) *
            100
        );


    percentageScore =
        Math.max(
            0,
            Math.min(
                100,
                percentageScore
            )
        );


    let backendStars =
        Number(stars) || 0;


    backendStars =
        Math.max(
            0,
            Math.min(
                3,
                Math.round(
                    backendStars
                )
            )
        );


    const payload = {

        teacher_id:
            teacherId,

        student_id:
            studentId,

        category:
            "Alphabet",

        activity:
            "Letter Sort",

        score:
            percentageScore,

        stars:
            backendStars

    };


    console.log(
        "================================================"
    );

    console.log(
        "LETTER SORT - SAVING PROGRESS"
    );

    console.log(
        "Teacher ID:",
        teacherId
    );

    console.log(
        "Student ID:",
        studentId
    );

    console.log(
        "Score:",
        score
    );

    console.log(
        "Percentage:",
        percentageScore
    );

    console.log(
        "Stars:",
        backendStars
    );

    console.log(
        "Payload:",
        payload
    );

    console.log(
        "================================================"
    );


    try {

        const response =
            await fetch(
                API_BASE +
                "/progress/save",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        let data =
            null;


        try {

            data =
                await response.json();

        }

        catch (jsonError) {

            console.error(
                "LETTER SORT: Could not read backend response.",
                jsonError
            );

        }


        if (!response.ok) {

            console.error(
                "================================================"
            );

            console.error(
                "LETTER SORT PROGRESS SAVE FAILED"
            );

            console.error(
                "HTTP STATUS:",
                response.status
            );

            console.error(
                "SERVER RESPONSE:",
                data
            );

            console.error(
                "================================================"
            );


            backendSaveInProgress =
                false;


            return;

        }


        backendSaveFinished =
            true;


        backendSaveInProgress =
            false;


        console.log(
            "================================================"
        );

        console.log(
            "LETTER SORT PROGRESS SAVED SUCCESSFULLY"
        );

        console.log(
            data
        );

        console.log(
            "================================================"
        );

    }

    catch (error) {

        backendSaveInProgress =
            false;


        console.error(
            "================================================"
        );

        console.error(
            "LETTER SORT BACKEND SAVE ERROR"
        );

        console.error(
            error
        );

        console.error(
            "LOCAL PROGRESS IS STILL SAVED."
        );

        console.error(
            "================================================"
        );

    }

}


// ==========================================================
// RESULT CARD PROTECTION
// ==========================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            gameOver &&
            gameOverModal &&
            event.target ===
                gameOverModal
        ) {

            event.preventDefault();

            event.stopPropagation();

        }


        if (
            gameComplete &&
            completeModal &&
            event.target ===
                completeModal
        ) {

            event.preventDefault();

            event.stopPropagation();

        }


        if (
            rewardOpen &&
            levelRewardModal &&
            event.target ===
                levelRewardModal
        ) {

            event.preventDefault();

            event.stopPropagation();

        }

    },
    true
);


// ==========================================================
// ESCAPE DOES NOT CLOSE RESULT
// ==========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            (
                gameOver ||
                gameComplete ||
                rewardOpen
            ) &&
            event.key ===
                "Escape"
        ) {

            event.preventDefault();

        }

    }
);


// ==========================================================
// PREVENT MOBILE PAGE SCROLL WHILE TOUCH DRAGGING
// ==========================================================

document.addEventListener(
    "touchmove",
    function (event) {

        if (
            touchDragActive &&
            touchDragStarted
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);