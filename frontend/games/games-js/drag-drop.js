// ==========================================================
// API
// ==========================================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";


// ==========================================================
// SETTINGS
// ==========================================================

const TOTAL_QUESTIONS = 10;

const MAX_LIVES = 3;


// ==========================================================
// WORDS
// ==========================================================

const words = [

    {
        word: "APPLE",
        image: "apple-colored.png"
    },

    {
        word: "BALL",
        image: "ball.png"
    },

    {
        word: "CAT",
        image: "cat.png"
    },

    {
        word: "DOG",
        image: "dog.png"
    },

    {
        word: "FISH",
        image: "fish.png"
    },

    {
        word: "HAT",
        image: "hat.png"
    },

    {
        word: "SUN",
        image: "sun-colored.png"
    },

    {
        word: "BOOK",
        image: "book.png"
    },

    {
        word: "FROG",
        image: "frog-colored.png"
    },

    {
        word: "GRAPE",
        image: "grapes-colored.png"
    }

];


// ==========================================================
// GAME VARIABLES
// ==========================================================

let currentQuestion = 0;

let score = 0;

let lives = MAX_LIVES;

let hints = 3;

let missingPositions = [];

let placedCount = 0;

let draggedLetter = null;

let selectedStudent = null;

let gameOver = false;

let gameFinished = false;

let finishShown = false;

let maximumPossibleScore = 0;


// ==========================================================
// INITIAL LOADING STATE
//
// ONLY INITIAL PAGE ENTRY USES LOADING.
// ==========================================================

let initialLoadingDone = false;


// ==========================================================
// ELEMENTS
// ==========================================================

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );

const loadingBarFill =
    document.getElementById(
        "loadingBarFill"
    );

const scoreEl =
    document.getElementById(
        "score"
    );

const livesEl =
    document.getElementById(
        "lives"
    );

const questionNumberEl =
    document.getElementById(
        "questionNumber"
    );

const wordImage =
    document.getElementById(
        "wordImage"
    );

const wordContainer =
    document.getElementById(
        "wordContainer"
    );

const lettersContainer =
    document.getElementById(
        "lettersContainer"
    );

const feedback =
    document.getElementById(
        "feedback"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const hintBtn =
    document.getElementById(
        "hintBtn"
    );

const hintCount =
    document.getElementById(
        "hintCount"
    );

const restartBtn =
    document.getElementById(
        "restartBtn"
    );

const playingStudentName =
    document.getElementById(
        "playingStudentName"
    );

const starReward =
    document.getElementById(
        "starReward"
    );

const resultScreen =
    document.getElementById(
        "resultScreen"
    );

const resultTrophy =
    document.getElementById(
        "resultTrophy"
    );

const resultTitle =
    document.getElementById(
        "resultTitle"
    );

const resultMessage =
    document.getElementById(
        "resultMessage"
    );

const finalScore =
    document.getElementById(
        "finalScore"
    );

const finalStars =
    document.getElementById(
        "finalStars"
    );

const playAgainButton =
    document.getElementById(
        "playAgainButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const noStudentOverlay =
    document.getElementById(
        "noStudentOverlay"
    );

const studentBackButton =
    document.getElementById(
        "studentBackButton"
    );


// ==========================================================
// SOUND MANAGER HELPERS
//
// Sound Manager is already loaded BEFORE this JS.
// These helpers prevent errors if soundManager is unavailable.
// ==========================================================

function playCorrectSound() {

    if (
        window.soundManager &&
        typeof window.soundManager.playCorrect ===
            "function"
    ) {

        window.soundManager.playCorrect();

    }

}


function playWrongSound() {

    if (
        window.soundManager &&
        typeof window.soundManager.playWrong ===
            "function"
    ) {

        window.soundManager.playWrong();

    }

}


function playButtonSound() {

    if (
        window.soundManager &&
        typeof window.soundManager.playButton ===
            "function"
    ) {

        window.soundManager.playButton();

    }

}


function startGameMusic() {

    if (
        window.soundManager &&
        typeof window.soundManager.startBackgroundMusic ===
            "function"
    ) {

        window.soundManager.startBackgroundMusic();

    }

}


// ==========================================================
// GLOBAL DRAG & DROP GUARD
//
// Prevent native browser navigation/reload when a letter
// is dropped outside a valid drop zone.
// ==========================================================

document.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

    },
    true
);


document.addEventListener(
    "dragenter",
    event => {

        event.preventDefault();

    },
    true
);


document.addEventListener(
    "drop",
    event => {

        event.preventDefault();

    },
    true
);


window.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

    },
    true
);


window.addEventListener(
    "drop",
    event => {

        event.preventDefault();

    },
    true
);


// ==========================================================
// BLOCK UNINTENDED NATIVE DRAG
// ==========================================================

document.addEventListener(
    "dragstart",
    event => {

        const isLetterCard =
            event.target &&
            event.target.classList &&
            event.target.classList.contains(
                "letter-card"
            );


        if (!isLetterCard) {

            event.preventDefault();

        }

    },
    true
);


// ==========================================================
// DISABLE NATIVE IMAGE DRAG
// ==========================================================

if (wordImage) {

    wordImage.setAttribute(
        "draggable",
        "false"
    );

    wordImage.style.userSelect =
        "none";

    wordImage.style.webkitUserDrag =
        "none";

}


// ==========================================================
// INITIAL ENTRY
//
// ONLY THIS AREA CAN START LOADING.
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        runInitialLoading();

    }
);


// ==========================================================
// INITIAL LOADING ONLY
// ==========================================================

function runInitialLoading() {

    if (initialLoadingDone) {

        return;

    }

    initialLoadingDone = true;


    if (!loadingScreen) {

        startAfterInitialLoad();

        return;

    }


    loadingScreen.style.display =
        "flex";

    loadingScreen.style.opacity =
        "1";

    loadingScreen.style.visibility =
        "visible";

    loadingScreen.style.pointerEvents =
        "auto";


    if (loadingBarFill) {

        loadingBarFill.style.width =
            "0%";

    }


    let progress = 0;


    const loadingTimer =
        setInterval(
            () => {

                progress += 5;


                if (loadingBarFill) {

                    loadingBarFill.style.width =
                        progress + "%";

                }


                if (progress >= 100) {

                    clearInterval(
                        loadingTimer
                    );


                    setTimeout(
                        () => {

                            removeInitialLoading();

                        },
                        250
                    );

                }

            },
            70
        );

}


// ==========================================================
// REMOVE INITIAL LOADING
// ==========================================================

function removeInitialLoading() {

    if (!loadingScreen) {

        startAfterInitialLoad();

        return;

    }


    loadingScreen.classList.add(
        "removing"
    );


    setTimeout(
        () => {

            if (
                loadingScreen &&
                loadingScreen.parentNode
            ) {

                loadingScreen.parentNode.removeChild(
                    loadingScreen
                );

            }


            startAfterInitialLoad();

        },
        350
    );

}


// ==========================================================
// START AFTER INITIAL LOADING
// ==========================================================

function startAfterInitialLoad() {

    if (!checkStudent()) {

        return;

    }


    startGame();

}


// ==========================================================
// GET STUDENT
// ==========================================================

function getStudent() {

    const raw =
        localStorage.getItem(
            "selectedStudent"
        );


    if (!raw) {

        return null;

    }


    try {

        return JSON.parse(raw);

    }

    catch (error) {

        console.error(
            "Student data error:",
            error
        );

        return null;

    }

}


// ==========================================================
// GET STUDENT NAME
// ==========================================================

function getStudentName(student) {

    if (!student) {

        return "Student";

    }


    if (
        student.first_name ||
        student.last_name
    ) {

        return (
            `${student.first_name || ""} ` +
            `${student.last_name || ""}`
        ).trim();

    }


    if (
        student.firstName ||
        student.lastName
    ) {

        return (
            `${student.firstName || ""} ` +
            `${student.lastName || ""}`
        ).trim();

    }


    return (
        student.name ||
        student.fullName ||
        student.fullname ||
        "Student"
    );

}


// ==========================================================
// CHECK STUDENT
// ==========================================================

function checkStudent() {

    selectedStudent =
        getStudent();


    if (!selectedStudent) {

        if (playingStudentName) {

            playingStudentName.textContent =
                "No student selected";

        }


        if (noStudentOverlay) {

            noStudentOverlay.classList.remove(
                "hidden"
            );

        }

        return false;

    }


    if (noStudentOverlay) {

        noStudentOverlay.classList.add(
            "hidden"
        );

    }


    if (playingStudentName) {

        playingStudentName.textContent =
            getStudentName(
                selectedStudent
            );

    }


    return true;

}


// ==========================================================
// MAXIMUM SCORE
// ==========================================================

function calculateMaximumScore() {

    let total = 0;


    words.forEach(
        item => {

            const missingCount =
                item.word.length >= 5
                    ? 2
                    : 1;


            total +=
                (missingCount * 10) + 10;

        }
    );


    return total;

}


// ==========================================================
// START GAME
//
// NO LOADING.
// ==========================================================

function startGame() {

    gameOver = false;

    gameFinished = false;

    finishShown = false;


    currentQuestion = 0;

    score = 0;

    lives = MAX_LIVES;

    hints = 3;

    placedCount = 0;

    draggedLetter = null;


    maximumPossibleScore =
        calculateMaximumScore();


    // ======================================================
    // START BACKGROUND MUSIC
    //
    // Sound Manager ang bahala kung naka-enable ang music.
    // ======================================================

    startGameMusic();


    if (resultScreen) {

        resultScreen.classList.add(
            "hidden"
        );

    }


    if (starReward) {

        starReward.classList.add(
            "hidden"
        );

    }


    if (hintBtn) {

        hintBtn.disabled =
            false;

    }


    if (restartBtn) {

        restartBtn.disabled =
            false;

    }


    updateScore();

    updateLives();

    updateHint();


    loadQuestion();

}


// ==========================================================
// LOAD QUESTION
// ==========================================================

function loadQuestion() {

    if (gameOver) {

        return;

    }


    if (gameFinished) {

        return;

    }


    if (
        currentQuestion >=
        TOTAL_QUESTIONS
    ) {

        finishGame();

        return;

    }


    const item =
        words[currentQuestion];


    placedCount = 0;

    draggedLetter = null;


    if (questionNumberEl) {

        questionNumberEl.textContent =
            currentQuestion + 1;

    }


    if (progressBar) {

        progressBar.style.width =
            (
                currentQuestion /
                TOTAL_QUESTIONS *
                100
            ) + "%";

    }


    if (feedback) {

        feedback.textContent =
            "";

        feedback.className =
            "feedback";

    }


    if (wordImage) {

        wordImage.src =
            `../../image/${item.image}`;

        wordImage.alt =
            item.word;

        wordImage.classList.remove(
            "correct-picture"
        );

    }


    createWord(
        item.word
    );

}


// ==========================================================
// CREATE WORD
// ==========================================================

function createWord(word) {

    if (
        !wordContainer ||
        !lettersContainer
    ) {

        return;

    }


    wordContainer.innerHTML =
        "";

    lettersContainer.innerHTML =
        "";


    const missingCount =
        word.length >= 5
            ? 2
            : 1;


    missingPositions =
        chooseMissingPositions(
            word.length,
            missingCount
        );


    const missingLetters = [];


    for (
        let i = 0;
        i < word.length;
        i++
    ) {

        const slot =
            document.createElement(
                "div"
            );


        slot.className =
            "word-slot";


        if (
            missingPositions.includes(i)
        ) {

            slot.classList.add(
                "blank"
            );


            slot.dataset.position =
                i;


            setupDropSlot(
                slot
            );


            missingLetters.push(
                word[i]
            );

        }

        else {

            slot.textContent =
                word[i];

        }


        wordContainer.appendChild(
            slot
        );

    }


    const choices =
        [...missingLetters];


    choices.push(
        ...getDistractors(
            word,
            missingLetters
        )
    );


    shuffle(
        choices
    );


    choices.forEach(
        letter => {

            createLetterCard(
                letter
            );

        }
    );

}


// ==========================================================
// MISSING POSITIONS
// ==========================================================

function chooseMissingPositions(
    length,
    count
) {

    const positions = [];


    while (
        positions.length <
        Math.min(
            count,
            length
        )
    ) {

        const position =
            Math.floor(
                Math.random() *
                length
            );


        if (
            !positions.includes(
                position
            )
        ) {

            positions.push(
                position
            );

        }

    }


    return positions.sort(
        (a, b) =>
            a - b
    );

}


// ==========================================================
// DISTRACTORS
// ==========================================================

function getDistractors(
    word,
    missingLetters
) {

    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    const result = [];


    while (
        result.length < 2
    ) {

        const letter =
            alphabet[
                Math.floor(
                    Math.random() *
                    alphabet.length
                )
            ];


        if (
            !word.includes(letter) &&
            !missingLetters.includes(letter) &&
            !result.includes(letter)
        ) {

            result.push(
                letter
            );

        }

    }


    return result;

}


// ==========================================================
// CREATE LETTER CARD
// ==========================================================

function createLetterCard(letter) {

    if (!lettersContainer) {

        return;

    }


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "letter-card";


    card.textContent =
        letter;


    card.draggable =
        true;


    card.dataset.letter =
        letter;


    const colors = [
        "#e53935",
        "#1976d2",
        "#43a047",
        "#f39c12",
        "#8e44ad"
    ];


    card.style.color =
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];


    // ======================================================
    // DRAG START
    // ======================================================

    card.addEventListener(
        "dragstart",
        event => {

            if (
                gameOver ||
                gameFinished
            ) {

                event.preventDefault();

                return;

            }


            if (
                card.classList.contains(
                    "used"
                )
            ) {

                event.preventDefault();

                return;

            }


            draggedLetter =
                card;


            event.dataTransfer.effectAllowed =
                "move";


            event.dataTransfer.setData(
                "text/plain",
                card.dataset.letter
            );

        }
    );


    // ======================================================
    // DRAG END
    // ======================================================

    card.addEventListener(
        "dragend",
        () => {

            draggedLetter =
                null;

        }
    );


    // ======================================================
    // CLICK SUPPORT
    // ======================================================

    card.addEventListener(
        "click",
        () => {

            if (
                gameOver ||
                gameFinished
            ) {

                return;

            }


            if (
                card.classList.contains(
                    "used"
                )
            ) {

                return;

            }


            document
                .querySelectorAll(
                    ".letter-card"
                )
                .forEach(
                    item => {

                        item.style.outline =
                            "";

                    }
                );


            card.style.outline =
                "5px solid #ffe66d";


            draggedLetter =
                card;


            if (feedback) {

                feedback.textContent =
                    "👆 Now click a blank!";

                feedback.className =
                    "feedback warning";

            }

        }
    );


    lettersContainer.appendChild(
        card
    );

}


// ==========================================================
// DROP SLOT
// ==========================================================

function setupDropSlot(slot) {

    slot.addEventListener(
        "dragover",
        event => {

            if (
                gameOver ||
                gameFinished
            ) {

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
        () => {

            slot.classList.remove(
                "drag-over"
            );

        }
    );


    slot.addEventListener(
        "drop",
        event => {

            event.preventDefault();


            if (
                gameOver ||
                gameFinished
            ) {

                return;

            }


            slot.classList.remove(
                "drag-over"
            );


            if (!draggedLetter) {

                return;

            }


            placeLetter(
                draggedLetter,
                slot
            );

        }
    );


    slot.addEventListener(
        "click",
        () => {

            if (
                gameOver ||
                gameFinished
            ) {

                return;

            }


            if (!draggedLetter) {

                return;

            }


            placeLetter(
                draggedLetter,
                slot
            );

        }
    );

}


// ==========================================================
// PLACE LETTER
// ==========================================================

function placeLetter(
    card,
    slot
) {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    if (!card || !slot) {

        return;

    }


    if (
        slot.classList.contains(
            "correct"
        )
    ) {

        return;

    }


    const word =
        words[currentQuestion].word;


    const position =
        Number(
            slot.dataset.position
        );


    const correctLetter =
        word[position];


    const selectedLetter =
        card.dataset.letter;


    if (
        selectedLetter ===
        correctLetter
    ) {

        correctLetterPlaced(
            card,
            slot,
            selectedLetter
        );

    }

    else {

        wrongLetterPlaced(
            slot
        );

    }

}


// ==========================================================
// CORRECT
// ==========================================================

function correctLetterPlaced(
    card,
    slot,
    letter
) {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    placedCount++;


    slot.textContent =
        letter;


    slot.classList.remove(
        "blank"
    );


    slot.classList.add(
        "correct"
    );


    card.classList.add(
        "used"
    );


    card.style.outline =
        "";


    draggedLetter =
        null;


    score += 10;


    updateScore();


    // ======================================================
    // CORRECT SOUND
    // ======================================================

    playCorrectSound();


    if (feedback) {

        feedback.textContent =
            "⭐ Correct!";

        feedback.className =
            "feedback correct";

    }


    if (
        placedCount ===
        missingPositions.length
    ) {

        wordCompleted();

    }

}


// ==========================================================
// WRONG
// ==========================================================

function wrongLetterPlaced(slot) {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    lives--;


    updateLives();


    slot.classList.add(
        "wrong"
    );


    // ======================================================
    // WRONG SOUND
    // ======================================================

    playWrongSound();


    setTimeout(
        () => {

            if (slot) {

                slot.classList.remove(
                    "wrong"
                );

            }

        },
        400
    );


    // ======================================================
    // GAME OVER
    // ======================================================

    if (lives <= 0) {

        lives = 0;


        updateLives();


        setTimeout(
            () => {

                showGameOver();

            },
            400
        );

    }

}


// ==========================================================
// WORD COMPLETED
// ==========================================================

function wordCompleted() {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    score += 10;


    updateScore();


    if (wordImage) {

        wordImage.classList.add(
            "correct-picture"
        );

    }


    // ======================================================
    // STAR REWARD
    //
    // USE EXISTING CORRECT SOUND.
    // ======================================================

    showStarReward();


    setTimeout(
        () => {

            if (
                gameOver ||
                gameFinished
            ) {

                return;

            }


            if (wordImage) {

                wordImage.classList.remove(
                    "correct-picture"
                );

            }


            nextQuestion();

        },
        1100
    );

}


// ==========================================================
// GAME OVER
//
// NO LOADING.
// NO RESET.
// NO PAGE RELOAD.
// CARD STAYS.
// ==========================================================

function showGameOver() {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    gameOver = true;


    draggedLetter =
        null;


    disableGame();


    if (starReward) {

        starReward.classList.add(
            "hidden"
        );

    }


    showResultCard(
        "gameover"
    );

}


// ==========================================================
// FINISH GAME
//
// NO LOADING.
// CARD STAYS.
// ==========================================================

function finishGame() {

    if (finishShown) {

        return;

    }


    finishShown = true;


    gameFinished = true;


    gameOver = false;


    draggedLetter =
        null;


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    disableGame();


    if (starReward) {

        starReward.classList.add(
            "hidden"
        );

    }


    showResultCard(
        "finish"
    );

}


// ==========================================================
// DISABLE GAME
// ==========================================================

function disableGame() {

    document
        .querySelectorAll(
            ".letter-card"
        )
        .forEach(
            card => {

                card.draggable =
                    false;

            }
        );


    document
        .querySelectorAll(
            ".word-slot"
        )
        .forEach(
            slot => {

                slot.style.pointerEvents =
                    "none";

            }
        );


    if (hintBtn) {

        hintBtn.disabled =
            true;

    }


    if (restartBtn) {

        restartBtn.disabled =
            true;

    }

}


// ==========================================================
// NEXT QUESTION
// ==========================================================

function nextQuestion() {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    currentQuestion++;


    if (
        currentQuestion >=
        TOTAL_QUESTIONS
    ) {

        finishGame();

        return;

    }


    loadQuestion();

}


// ==========================================================
// STAR REWARD
//
// CORRECT SOUND IS PLAYED HERE.
// ==========================================================

function showStarReward() {

    if (!starReward) {

        return;

    }


    // ======================================================
    // STAR REWARD SOUND
    //
    // Same sound manager correct sound.
    // ======================================================

    playCorrectSound();


    // ======================================================
    // SHOW STAR
    // ======================================================

    starReward.classList.remove(
        "hidden"
    );


    starReward.style.animation =
        "none";


    void starReward.offsetWidth;


    starReward.style.animation =
        "";


    setTimeout(
        () => {

            if (
                !gameOver &&
                !gameFinished
            ) {

                starReward.classList.add(
                    "hidden"
                );

            }

        },
        950
    );

}


// ==========================================================
// HINT
// ==========================================================

if (hintBtn) {

    hintBtn.addEventListener(
        "click",
        () => {

            if (
                gameOver ||
                gameFinished
            ) {

                return;

            }


            if (hints <= 0) {

                return;

            }


            const emptySlots =
                [
                    ...document.querySelectorAll(
                        ".word-slot.blank"
                    )
                ];


            if (
                emptySlots.length === 0
            ) {

                return;

            }


            const position =
                Number(
                    emptySlots[0]
                        .dataset.position
                );


            const correctLetter =
                words[
                    currentQuestion
                ].word[position];


            const card =
                [
                    ...document.querySelectorAll(
                        ".letter-card"
                    )
                ].find(
                    item =>
                        item.dataset.letter ===
                            correctLetter &&
                        !item.classList.contains(
                            "used"
                        )
                );


            if (!card) {

                return;

            }


            hints--;


            updateHint();


            // ==================================================
            // BUTTON SOUND
            // ==================================================

            playButtonSound();


            card.classList.add(
                "hint"
            );


            setTimeout(
                () => {

                    card.classList.remove(
                        "hint"
                    );

                },
                1800
            );

        }
    );

}


// ==========================================================
// RESTART BUTTON
//
// MANUAL RESTART WHILE PLAYING.
// NO LOADING.
// ==========================================================

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        () => {

            if (
                gameOver ||
                gameFinished
            ) {

                return;

            }


            playButtonSound();


            lives =
                MAX_LIVES;


            hints = 3;


            updateLives();


            updateHint();


            loadQuestion();

        }
    );

}


// ==========================================================
// CALCULATE STARS
// ==========================================================

function calculateStars(
    percentage
) {

    let stars = 1;


    if (percentage >= 80) {

        stars = 3;

    }

    else if (percentage >= 60) {

        stars = 2;

    }


    return stars;

}


// ==========================================================
// SHOW RESULT CARD
//
// NO LOADING.
// NO RELOAD.
// CARD STAYS.
// ==========================================================

function showResultCard(type) {

    if (!resultScreen) {

        return;

    }


    // ======================================================
    // SCORE
    // ======================================================

    if (finalScore) {

        finalScore.textContent =
            score;

    }


    // ======================================================
    // PERCENTAGE
    // ======================================================

    let percentage = 0;


    if (
        maximumPossibleScore > 0
    ) {

        percentage =
            Math.round(
                (
                    score /
                    maximumPossibleScore
                ) * 100
            );

    }


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    // ======================================================
    // STARS
    // ======================================================

    const stars =
        calculateStars(
            percentage
        );


    // ======================================================
    // GAME OVER
    // ======================================================

    if (
        type === "gameover"
    ) {

        if (resultTrophy) {

            resultTrophy.textContent =
                "💛";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "Game Over!";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "You ran out of lives.";

        }

    }


    // ======================================================
    // FINISH
    // ======================================================

    else {

        if (resultTrophy) {

            resultTrophy.textContent =
                "🏆";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "Great Job!";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "You completed all the words!";

        }

    }


    // ======================================================
    // STARS DISPLAY
    // ======================================================

    if (finalStars) {

        if (stars === 3) {

            finalStars.textContent =
                "⭐⭐⭐";

        }

        else if (stars === 2) {

            finalStars.textContent =
                "⭐⭐";

        }

        else {

            finalStars.textContent =
                "⭐";

        }

    }


    // ======================================================
    // SHOW RESULT CARD
    //
    // STAYS VISIBLE.
    // ======================================================

    resultScreen.classList.remove(
        "hidden"
    );


    // ======================================================
    // SAVE PROGRESS
    // ======================================================

    saveProgress(
        percentage,
        stars
    );

}


// ==========================================================
// PLAY AGAIN
//
// NO LOADING.
// DIRECT RESET.
// ==========================================================

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        () => {

            playButtonSound();


            // ------------------------------------------------
            // HIDE RESULT CARD
            // ------------------------------------------------

            if (resultScreen) {

                resultScreen.classList.add(
                    "hidden"
                );

            }


            // ------------------------------------------------
            // HIDE STAR REWARD
            // ------------------------------------------------

            if (starReward) {

                starReward.classList.add(
                    "hidden"
                );

            }


            // ------------------------------------------------
            // RESET FLAGS
            // ------------------------------------------------

            gameOver = false;

            gameFinished = false;

            finishShown = false;


            // ------------------------------------------------
            // CHECK STUDENT
            // ------------------------------------------------

            if (!checkStudent()) {

                return;

            }


            // ------------------------------------------------
            // DIRECT START
            //
            // NO LOADING.
            // ------------------------------------------------

            startGame();

        }
    );

}


// ==========================================================
// BACK TO ALPHABET
//
// NO LOADING.
// ==========================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            playButtonSound();


            window.location.href =
                "../alphabet.html";

        }
    );

}


// ==========================================================
// NO STUDENT
// ==========================================================

if (studentBackButton) {

    studentBackButton.addEventListener(
        "click",
        () => {

            playButtonSound();


            window.location.href =
                "../../students.html";

        }
    );

}


// ==========================================================
// UPDATE SCORE
// ==========================================================

function updateScore() {

    if (scoreEl) {

        scoreEl.textContent =
            score;

    }

}


// ==========================================================
// UPDATE LIVES
// ==========================================================

function updateLives() {

    if (!livesEl) {

        return;

    }


    let hearts = "";


    for (
        let i = 0;
        i < MAX_LIVES;
        i++
    ) {

        hearts +=
            i < lives
                ? "❤️ "
                : "🖤 ";

    }


    livesEl.textContent =
        hearts.trim();

}


// ==========================================================
// UPDATE HINT
// ==========================================================

function updateHint() {

    if (hintCount) {

        hintCount.textContent =
            hints;

    }

}


// ==========================================================
// SHUFFLE
// ==========================================================

function shuffle(array) {

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


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array;

}


// ==========================================================
// SAVE PROGRESS
//
// SAVES:
//
// - TEACHER ID
// - STUDENT ID
// - CATEGORY
// - ACTIVITY
// - SCORE
// - STARS
//
// NO LOADING.
// NO RELOAD.
// ==========================================================

async function saveProgress(
    percentageScore,
    stars
) {

    const teacherData =
        localStorage.getItem(
            "teacher"
        );


    const studentData =
        localStorage.getItem(
            "selectedStudent"
        );


    // ======================================================
    // CHECK LOCAL STORAGE
    // ======================================================

    if (
        !teacherData ||
        !studentData
    ) {

        console.warn(
            "Progress not saved: teacher or student data is missing."
        );

        return;

    }


    try {

        const teacher =
            JSON.parse(
                teacherData
            );


        const student =
            JSON.parse(
                studentData
            );


        // ==================================================
        // CHECK IDS
        // ==================================================

        if (
            !teacher.id ||
            !student.id
        ) {

            console.warn(
                "Progress not saved: teacher ID or student ID is missing."
            );

            return;

        }


        // ==================================================
        // VALIDATE SCORE
        // ==================================================

        let numericScore =
            Number(
                percentageScore
            );


        if (
            !Number.isFinite(
                numericScore
            )
        ) {

            numericScore = 0;

        }


        numericScore =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        numericScore
                    )
                )
            );


        // ==================================================
        // VALIDATE STARS
        // ==================================================

        let numericStars =
            Number(
                stars
            );


        if (
            !Number.isFinite(
                numericStars
            )
        ) {

            numericStars = 0;

        }


        numericStars =
            Math.max(
                0,
                Math.min(
                    3,
                    Math.round(
                        numericStars
                    )
                )
            );


        // ==================================================
        // REQUEST
        // ==================================================

        const response =
            await fetch(
                `${API_BASE}/progress/save`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            teacher_id:
                                teacher.id,

                            student_id:
                                student.id,

                            category:
                                "alphabet",

                            activity:
                                "drag-drop-letters",

                            score:
                                numericScore,

                            stars:
                                numericStars

                        })

                }
            );


        // ==================================================
        // CHECK HTTP STATUS
        // ==================================================

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        // ==================================================
        // LOG SAVED DATA
        // ==================================================

        console.log(
            "=========================================="
        );

        console.log(
            "DRAG & DROP LETTERS PROGRESS SAVED"
        );

        console.log(
            "Student:",
            student.id
        );

        console.log(
            "Score:",
            numericScore
        );

        console.log(
            "Stars:",
            numericStars
        );

        console.log(
            "Response:",
            data
        );

        console.log(
            "=========================================="
        );

    }

    catch (error) {

        console.error(
            "DRAG & DROP LETTERS PROGRESS SAVE ERROR:",
            error
        );

    }

}