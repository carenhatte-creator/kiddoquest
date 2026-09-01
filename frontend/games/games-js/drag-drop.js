// ==========================================================
// KINDERQUEST - DRAG & DROP LETTERS
// TOUCH + MOUSE + CLICK SUPPORT
// ==========================================================


// ==========================================================
// API
// ==========================================================

const API_BASE =
    "https://kiddoquest-backend.onrender.com/api";


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
// TOUCH DRAG VARIABLES
// ==========================================================

let touchDragging = false;

let touchDragCard = null;

let touchGhost = null;

let touchStartX = 0;

let touchStartY = 0;

let touchMoved = false;

let touchCurrentSlot = null;


// ==========================================================
// INITIAL LOADING STATE
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
// SOUND MANAGER
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
// PREVENT NATIVE DRAG NAVIGATION
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

        const target =
            event.target;


        const isLetterCard =
            target &&
            target.classList &&
            target.classList.contains(
                "letter-card"
            );


        if (!isLetterCard) {

            event.preventDefault();

        }

    },
    true
);


// ==========================================================
// DISABLE IMAGE DRAG
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

    wordImage.ondragstart =
        () => false;

}


// ==========================================================
// INITIAL ENTRY
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        runInitialLoading();

    }
);


// ==========================================================
// INITIAL LOADING
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
// START AFTER LOADING
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

        return JSON.parse(
            raw
        );

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

function getStudentName(
    student
) {

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
                (missingCount * 10) +
                10;

        }
    );


    return total;

}


// ==========================================================
// START GAME
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


    resetTouchDrag();


    maximumPossibleScore =
        calculateMaximumScore();


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


    resetTouchDrag();


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

function createWord(
    word
) {

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
// CHOOSE MISSING POSITIONS
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
// GET DISTRACTORS
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

function createLetterCard(
    letter
) {

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


    // IMPORTANT FOR TOUCH DEVICES

    card.style.touchAction =
        "none";

    card.style.webkitUserSelect =
        "none";

    card.style.userSelect =
        "none";

    card.style.webkitTouchCallout =
        "none";


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
    // DESKTOP DRAG START
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
    // DESKTOP DRAG END
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
        event => {

            if (
                touchMoved
            ) {

                touchMoved =
                    false;

                return;

            }


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


            clearSelectedLetters();


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


    // ======================================================
    // TOUCH / POINTER START
    // ======================================================

    card.addEventListener(
        "pointerdown",
        event => {

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


            if (
                event.pointerType ===
                "mouse"
            ) {

                return;

            }


            event.preventDefault();


            touchDragging =
                true;

            touchDragCard =
                card;

            touchMoved =
                false;

            touchStartX =
                event.clientX;

            touchStartY =
                event.clientY;


            try {

                card.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                console.warn(
                    "Pointer capture unavailable."
                );

            }


            clearSelectedLetters();


            card.style.outline =
                "5px solid #ffe66d";


            createTouchGhost(
                card,
                event.clientX,
                event.clientY
            );

        },
        {
            passive: false
        }
    );


    // ======================================================
    // TOUCH / POINTER MOVE
    // ======================================================

    card.addEventListener(
        "pointermove",
        event => {

            if (
                !touchDragging ||
                touchDragCard !== card
            ) {

                return;

            }


            if (
                gameOver ||
                gameFinished
            ) {

                resetTouchDrag();

                return;

            }


            event.preventDefault();


            const dx =
                event.clientX -
                touchStartX;


            const dy =
                event.clientY -
                touchStartY;


            if (
                Math.abs(dx) > 6 ||
                Math.abs(dy) > 6
            ) {

                touchMoved =
                    true;

            }


            if (touchGhost) {

                touchGhost.style.left =
                    event.clientX + "px";

                touchGhost.style.top =
                    event.clientY + "px";

            }


            const element =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            const slot =
                element
                    ? element.closest(
                        ".word-slot.blank"
                    )
                    : null;


            if (
                touchCurrentSlot &&
                touchCurrentSlot !== slot
            ) {

                touchCurrentSlot.classList.remove(
                    "drag-over"
                );

            }


            touchCurrentSlot =
                slot;


            if (touchCurrentSlot) {

                touchCurrentSlot.classList.add(
                    "drag-over"
                );

            }

        },
        {
            passive: false
        }
    );


    // ======================================================
    // TOUCH / POINTER END
    // ======================================================

    card.addEventListener(
        "pointerup",
        event => {

            if (
                !touchDragging ||
                touchDragCard !== card
            ) {

                return;

            }


            event.preventDefault();


            const element =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            const slot =
                element
                    ? element.closest(
                        ".word-slot.blank"
                    )
                    : null;


            if (slot) {

                placeLetter(
                    card,
                    slot
                );

            }


            resetTouchDrag();

        },
        {
            passive: false
        }
    );


    // ======================================================
    // TOUCH CANCEL
    // ======================================================

    card.addEventListener(
        "pointercancel",
        () => {

            resetTouchDrag();

        }
    );


    lettersContainer.appendChild(
        card
    );

}


// ==========================================================
// CREATE TOUCH GHOST
// ==========================================================

function createTouchGhost(
    card,
    x,
    y
) {

    removeTouchGhost();


    touchGhost =
        card.cloneNode(
            true
        );


    touchGhost.classList.add(
        "touch-drag-ghost"
    );


    touchGhost.classList.remove(
        "used"
    );


    touchGhost.style.position =
        "fixed";

    touchGhost.style.left =
        x + "px";

    touchGhost.style.top =
        y + "px";

    touchGhost.style.width =
        card.offsetWidth + "px";

    touchGhost.style.height =
        card.offsetHeight + "px";

    touchGhost.style.margin =
        "0";

    touchGhost.style.zIndex =
        "999999";

    touchGhost.style.pointerEvents =
        "none";

    touchGhost.style.opacity =
        "0.9";

    touchGhost.style.transform =
        "translate(-50%, -50%) scale(1.08)";

    touchGhost.style.boxShadow =
        "0 10px 25px rgba(0,0,0,.25)";


    document.body.appendChild(
        touchGhost
    );

}


// ==========================================================
// REMOVE TOUCH GHOST
// ==========================================================

function removeTouchGhost() {

    if (
        touchGhost &&
        touchGhost.parentNode
    ) {

        touchGhost.parentNode.removeChild(
            touchGhost
        );

    }


    touchGhost =
        null;

}


// ==========================================================
// RESET TOUCH DRAG
// ==========================================================

function resetTouchDrag() {

    if (touchCurrentSlot) {

        touchCurrentSlot.classList.remove(
            "drag-over"
        );

    }


    touchCurrentSlot =
        null;


    removeTouchGhost();


    if (touchDragCard) {

        touchDragCard.style.outline =
            "";

    }


    touchDragging =
        false;

    touchDragCard =
        null;

}


// ==========================================================
// CLEAR SELECTED LETTERS
// ==========================================================

function clearSelectedLetters() {

    document
        .querySelectorAll(
            ".letter-card"
        )
        .forEach(
            card => {

                card.style.outline =
                    "";

            }
        );

}


// ==========================================================
// DROP SLOT
// ==========================================================

function setupDropSlot(
    slot
) {

    // ======================================================
    // DESKTOP DRAG OVER
    // ======================================================

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


    // ======================================================
    // DESKTOP DRAG LEAVE
    // ======================================================

    slot.addEventListener(
        "dragleave",
        () => {

            slot.classList.remove(
                "drag-over"
            );

        }
    );


    // ======================================================
    // DESKTOP DROP
    // ======================================================

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


            let card =
                draggedLetter;


            if (!card) {

                const letter =
                    event.dataTransfer
                        ? event.dataTransfer.getData(
                            "text/plain"
                        )
                        : "";


                if (letter) {

                    card =
                        [
                            ...document.querySelectorAll(
                                ".letter-card"
                            )
                        ].find(
                            item =>
                                item.dataset.letter ===
                                    letter &&
                                !item.classList.contains(
                                    "used"
                                )
                        );

                }

            }


            if (!card) {

                return;

            }


            placeLetter(
                card,
                slot
            );

        }
    );


    // ======================================================
    // CLICK SLOT
    // ======================================================

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
// CORRECT LETTER
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


    resetTouchDrag();


    score += 10;


    updateScore();


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
// WRONG LETTER
// ==========================================================

function wrongLetterPlaced(
    slot
) {

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
// ==========================================================

function showGameOver() {

    if (
        gameOver ||
        gameFinished
    ) {

        return;

    }


    gameOver =
        true;


    draggedLetter =
        null;


    resetTouchDrag();


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
// ==========================================================

function finishGame() {

    if (finishShown) {

        return;

    }


    finishShown =
        true;


    gameFinished =
        true;


    gameOver =
        false;


    draggedLetter =
        null;


    resetTouchDrag();


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

                card.style.pointerEvents =
                    "none";

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
// ==========================================================

function showStarReward() {

    if (!starReward) {

        return;

    }


    playCorrectSound();


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


            hints =
                3;


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

    let stars =
        1;


    if (
        percentage >= 80
    ) {

        stars =
            3;

    }

    else if (
        percentage >= 60
    ) {

        stars =
            2;

    }


    return stars;

}


// ==========================================================
// SHOW RESULT CARD
// ==========================================================

function showResultCard(
    type
) {

    if (!resultScreen) {

        return;

    }


    if (finalScore) {

        finalScore.textContent =
            score;

    }


    let percentage =
        0;


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


    const stars =
        calculateStars(
            percentage
        );


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


    resultScreen.classList.remove(
        "hidden"
    );


    saveProgress(
        percentage,
        stars
    );

}


// ==========================================================
// PLAY AGAIN
// ==========================================================

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        () => {

            playButtonSound();


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


            gameOver =
                false;


            gameFinished =
                false;


            finishShown =
                false;


            resetTouchDrag();


            if (!checkStudent()) {

                return;

            }


            startGame();

        }
    );

}


// ==========================================================
// BACK TO ALPHABET
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


    let hearts =
        "";


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

function shuffle(
    array
) {

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


        if (
            !teacher.id ||
            !student.id
        ) {

            console.warn(
                "Progress not saved: teacher ID or student ID is missing."
            );

            return;

        }


        let numericScore =
            Number(
                percentageScore
            );


        if (
            !Number.isFinite(
                numericScore
            )
        ) {

            numericScore =
                0;

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


        let numericStars =
            Number(
                stars
            );


        if (
            !Number.isFinite(
                numericStars
            )
        ) {

            numericStars =
                0;

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


        const response =
            await fetch(
                `${API_BASE}/progress/save`,
                {

                    method:
                        "POST",

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


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


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