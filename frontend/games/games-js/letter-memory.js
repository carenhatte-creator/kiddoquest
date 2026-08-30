// ==========================================================
// KINDERQUEST - LETTER MEMORY
// FULL UPDATED VERSION
//
// GAME:
// - 3 LEVELS
// - 5 LIVES PER LEVEL
// - NO LOADING BETWEEN LEVELS
// - USES SHARED soundManager.js
// - BACKGROUND MUSIC ENABLED
// - LARGE ANIMATED STAR REWARD
// - ONE PROGRESS RECORD PER COMPLETE GAME
//
// LEVELS:
// Easy   = 3 pairs
// Medium = 4 pairs
// Hard   = 5 pairs
//
// SAVE:
// POST /api/progress/save
//
// SAVE ONLY:
// - Game Over
// - Final Completion
// ==========================================================


// ==========================================================
// API
// ==========================================================

const API_BASE = "http://localhost:5001/api";


// ==========================================================
// GAME SETTINGS
// ==========================================================

const MAX_LIVES = 5;

const LEVELS = [
    {
        name: "Easy",
        pairs: 3
    },
    {
        name: "Medium",
        pairs: 4
    },
    {
        name: "Hard",
        pairs: 5
    }
];


// ==========================================================
// LETTER DATA
// ==========================================================

const LETTERS = [
    {
        letter: "A",
        color: "pink"
    },
    {
        letter: "B",
        color: "blue"
    },
    {
        letter: "C",
        color: "green"
    },
    {
        letter: "D",
        color: "yellow"
    },
    {
        letter: "E",
        color: "purple"
    }
];


// ==========================================================
// GAME VARIABLES
// ==========================================================

let currentLevel = 0;

let score = 0;

let stars = 0;

let lives = MAX_LIVES;

let matchedPairs = 0;

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let gameStarted = false;

let gameEnded = false;

let mismatchTimer = null;

let feedbackTimer = null;

let starRewardTimer = null;

let progressSaved = false;


// ==========================================================
// STUDENT
// ==========================================================

let selectedStudent = null;

let selectedStudentId = null;

let selectedTeacherId = null;


// ==========================================================
// DOM ELEMENTS
// ==========================================================

const memoryBoard =
    document.getElementById("memoryBoard");

const scoreText =
    document.getElementById("score");

const livesText =
    document.getElementById("lives");

const starsText =
    document.getElementById("stars");

const matchedPairsText =
    document.getElementById("matchedPairs");

const totalPairsText =
    document.getElementById("totalPairs");

const levelText =
    document.getElementById("levelText");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const feedback =
    document.getElementById("feedback");

const feedbackIcon =
    document.getElementById("feedbackIcon");

const feedbackTitle =
    document.getElementById("feedbackTitle");

const feedbackText =
    document.getElementById("feedbackText");

const nextButton =
    document.getElementById("nextButton");


// ==========================================================
// STAR REWARD
// ==========================================================

const starReward =
    document.getElementById("starReward");


// ==========================================================
// RESULT SCREEN
// ==========================================================

const resultScreen =
    document.getElementById("resultScreen");

const resultStarsDisplay =
    document.getElementById("resultStarsDisplay");

const resultEmoji =
    document.getElementById("resultEmoji");

const resultTitle =
    document.getElementById("resultTitle");

const finalScore =
    document.getElementById("finalScore");

const finalPairs =
    document.getElementById("finalPairs");

const finalStars =
    document.getElementById("finalStars");

const playAgainButton =
    document.getElementById("playAgainButton");

const resultBackButton =
    document.getElementById("resultBackButton");


// ==========================================================
// GAME OVER SCREEN
// ==========================================================

const gameOverScreen =
    document.getElementById("gameOverScreen");

const gameOverScore =
    document.getElementById("gameOverScore");

const gameOverPairs =
    document.getElementById("gameOverPairs");

const gameOverAgainButton =
    document.getElementById("gameOverAgainButton");

const gameOverBackButton =
    document.getElementById("gameOverBackButton");


// ==========================================================
// STUDENT UI
// ==========================================================

const noStudentOverlay =
    document.getElementById("noStudentOverlay");

const playingStudentName =
    document.getElementById("playingStudentName");


// ==========================================================
// SAFE JSON PARSER
// ==========================================================

function safeParse(value) {

    if (!value) {
        return null;
    }

    try {

        return JSON.parse(value);

    } catch (error) {

        return {
            name: String(value).trim()
        };

    }
}


// ==========================================================
// GET STORAGE VALUE
// ==========================================================

function getStorageValue(keys) {

    for (const key of keys) {

        const localValue =
            localStorage.getItem(key);

        if (localValue) {
            return localValue;
        }

    }

    for (const key of keys) {

        const sessionValue =
            sessionStorage.getItem(key);

        if (sessionValue) {
            return sessionValue;
        }

    }

    return null;
}


// ==========================================================
// GET STUDENT
// ==========================================================

function loadSelectedStudent() {

    selectedStudent = null;

    selectedStudentId = null;

    selectedTeacherId = null;


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


    const rawStudent =
        getStorageValue(studentKeys);


    if (rawStudent) {

        selectedStudent =
            safeParse(rawStudent);

    }


    selectedStudentId =
        getStudentId();

    selectedTeacherId =
        getTeacherId();


    updateStudentUI();


    console.log(
        "LETTER MEMORY STUDENT:",
        selectedStudent
    );

    console.log(
        "LETTER MEMORY STUDENT ID:",
        selectedStudentId
    );

    console.log(
        "LETTER MEMORY TEACHER ID:",
        selectedTeacherId
    );
}


// ==========================================================
// GET STUDENT ID
// ==========================================================

function getStudentId() {

    if (!selectedStudent) {
        return null;
    }


    if (
        typeof selectedStudent === "string"
    ) {

        return null;

    }


    const ids = [

        selectedStudent.id,
        selectedStudent.student_id,
        selectedStudent.studentId,
        selectedStudent.child_id,
        selectedStudent.childId,
        selectedStudent.pupil_id,
        selectedStudent.pupilId

    ];


    for (const id of ids) {

        if (
            id !== undefined &&
            id !== null &&
            String(id).trim() !== ""
        ) {

            return id;

        }

    }


    return null;
}


// ==========================================================
// GET TEACHER ID
// ==========================================================

function getTeacherId() {

    const teacherKeys = [

        "teacher",
        "selectedTeacher",
        "selected_teacher",
        "currentTeacher",
        "current_teacher",
        "activeTeacher",
        "active_teacher",
        "teacherData",
        "teacher_data",
        "loggedInTeacher",
        "logged_in_teacher"

    ];


    const rawTeacher =
        getStorageValue(teacherKeys);


    if (!rawTeacher) {

        const directKeys = [

            "teacher_id",
            "teacherId",
            "currentTeacherId",
            "current_teacher_id",
            "selectedTeacherId",
            "selected_teacher_id"

        ];


        const direct =
            getStorageValue(directKeys);


        if (direct) {
            return direct;
        }


        return null;
    }


    const teacher =
        safeParse(rawTeacher);


    if (
        teacher &&
        typeof teacher === "object"
    ) {

        const ids = [

            teacher.id,
            teacher.teacher_id,
            teacher.teacherId

        ];


        for (const id of ids) {

            if (
                id !== undefined &&
                id !== null &&
                String(id).trim() !== ""
            ) {

                return id;

            }

        }

    }


    return null;
}


// ==========================================================
// GET STUDENT NAME
// ==========================================================

function getStudentName() {

    if (!selectedStudent) {
        return "Student";
    }


    if (
        typeof selectedStudent === "string"
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


    const combined = [

        firstName,
        middleName,
        lastName

    ]
        .filter(function (name) {

            return (
                typeof name === "string" &&
                name.trim() !== ""
            );

        })
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();


    if (combined) {
        return combined;
    }


    const fields = [

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
        selectedStudent.complete_name,
        selectedStudent.name

    ];


    for (const name of fields) {

        if (
            typeof name === "string" &&
            name.trim() !== ""
        ) {

            return name
                .replace(/\s+/g, " ")
                .trim();

        }

    }


    return "Student";
}


// ==========================================================
// UPDATE STUDENT UI
// ==========================================================

function updateStudentUI() {

    if (playingStudentName) {

        playingStudentName.textContent =
            getStudentName();

        playingStudentName.style.display =
            "inline-block";

        playingStudentName.style.width =
            "auto";

        playingStudentName.style.whiteSpace =
            "nowrap";

    }


    if (noStudentOverlay) {

        if (selectedStudent) {

            noStudentOverlay.style.display =
                "none";

            noStudentOverlay.style.visibility =
                "hidden";

            noStudentOverlay.style.pointerEvents =
                "none";

        } else {

            noStudentOverlay.style.display =
                "flex";

            noStudentOverlay.style.visibility =
                "visible";

            noStudentOverlay.style.pointerEvents =
                "auto";

        }

    }
}


// ==========================================================
// LOAD STUDENT
// ==========================================================

loadSelectedStudent();


// ==========================================================
// SOUND MANAGER
//
// GINAGAMIT ANG EXISTING soundManager.js
//
// HTML:
// <script src="../../js/soundManager.js"></script>
// <script src="../games-js/letter-memory.js"></script>
//
// WALANG SARILING AUDIO CODE DITO.
// ==========================================================

function playClickSound() {

    if (
        window.soundManager &&
        typeof window.soundManager.playClick ===
        "function"
    ) {

        window.soundManager.playClick();

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


// ==========================================================
// BACKGROUND MUSIC
//
// GINAGAMIT ANG MUSIC MULA SA soundManager.js
// ==========================================================

function startGameMusic() {

    if (
        window.soundManager &&
        typeof window.soundManager.startBackgroundMusic ===
        "function"
    ) {

        window.soundManager.startBackgroundMusic();

    }

}


function stopGameMusic() {

    if (
        window.soundManager &&
        typeof window.soundManager.stopBackgroundMusic ===
        "function"
    ) {

        window.soundManager.stopBackgroundMusic();

    }

}


// ==========================================================
// SHUFFLE
// ==========================================================

function shuffle(array) {

    const copy = [...array];


    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;
}


// ==========================================================
// CURRENT LEVEL
// ==========================================================

function getCurrentLevel() {

    return LEVELS[currentLevel];

}


// ==========================================================
// INITIAL LOADING ONLY
// ==========================================================

window.addEventListener(
    "load",
    function () {

        const loadingScreen =
            document.getElementById(
                "loadingScreen"
            );


        const loadingBar =
            document.getElementById(
                "loadingBarFill"
            );


        if (
            !loadingScreen ||
            !loadingBar
        ) {

            startGame();

            return;

        }


        let loadingProgress = 0;


        loadingScreen.style.display =
            "flex";

        loadingScreen.style.visibility =
            "visible";

        loadingScreen.style.opacity =
            "1";

        loadingScreen.style.pointerEvents =
            "auto";


        loadingBar.style.width =
            "0%";


        const loadingTimer =
            setInterval(
                function () {

                    loadingProgress += 5;


                    if (
                        loadingProgress >= 100
                    ) {

                        loadingProgress = 100;


                        loadingBar.style.width =
                            "100%";


                        clearInterval(
                            loadingTimer
                        );


                        setTimeout(
                            function () {

                                loadingScreen.style.opacity =
                                    "0";

                                loadingScreen.style.pointerEvents =
                                    "none";


                                setTimeout(
                                    function () {

                                        loadingScreen.style.display =
                                            "none";

                                        loadingScreen.style.visibility =
                                            "hidden";


                                        startGame();

                                    },
                                    400
                                );

                            },
                            250
                        );

                    } else {

                        loadingBar.style.width =
                            loadingProgress + "%";

                    }

                },
                70
            );

    }
);


// ==========================================================
// START GAME
// ==========================================================

function startGame() {

    loadSelectedStudent();


    if (!selectedStudent) {

        stopGameMusic();


        if (noStudentOverlay) {

            noStudentOverlay.classList.add(
                "show"
            );

        }

        return;

    }


    clearAllTimers();

    hideStarReward();


    currentLevel = 0;

    score = 0;

    stars = 0;

    lives = MAX_LIVES;

    matchedPairs = 0;

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    gameStarted = true;

    gameEnded = false;

    progressSaved = false;


    closeResultScreen();

    closeGameOverScreen();

    hideFeedback();


    if (nextButton) {

        nextButton.classList.add(
            "hidden"
        );

    }


    createCards();

    updateDisplay();


    // ======================================================
    // START BACKGROUND MUSIC
    // ======================================================

    startGameMusic();

}


// ==========================================================
// CREATE CARDS
// ==========================================================

function createCards() {

    if (!memoryBoard) {
        return;
    }


    memoryBoard.innerHTML = "";


    const level =
        getCurrentLevel();


    const selectedLetters =
        LETTERS.slice(
            0,
            level.pairs
        );


    let cards = [];


    selectedLetters.forEach(
        function (item) {

            cards.push({
                letter: item.letter,
                color: item.color
            });


            cards.push({
                letter: item.letter,
                color: item.color
            });

        }
    );


    cards =
        shuffle(cards);


    cards.forEach(
        function (cardData) {

            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";

            card.className =
                "memory-card";


            card.dataset.letter =
                cardData.letter;

            card.dataset.color =
                cardData.color;


            card.innerHTML = `
                <div class="memory-inner">

                    <div class="memory-front">

                        <div class="memory-front-icon">
                            abc
                        </div>

                    </div>

                    <div class="memory-back">

                        <span class="memory-letter">
                            ${cardData.letter}
                        </span>

                    </div>

                </div>
            `;


            card.addEventListener(
                "click",
                function () {

                    handleCardClick(card);

                }
            );


            memoryBoard.appendChild(card);

        }
    );
}


// ==========================================================
// UPDATE DISPLAY
// ==========================================================

function updateDisplay() {

    const level =
        getCurrentLevel();


    if (scoreText) {

        scoreText.textContent =
            score;

    }


    if (livesText) {

        let hearts = "";


        for (
            let i = 0;
            i < MAX_LIVES;
            i++
        ) {

            hearts +=
                i < lives
                    ? "❤️"
                    : "🖤";

        }


        livesText.textContent =
            hearts;

    }


    if (starsText) {

        starsText.textContent =
            stars;

    }


    if (matchedPairsText) {

        matchedPairsText.textContent =
            matchedPairs;

    }


    if (totalPairsText) {

        totalPairsText.textContent =
            level.pairs;

    }


    if (levelText) {

        levelText.textContent =
            level.name;

    }


    const percentage =
        Math.round(
            (
                matchedPairs /
                level.pairs
            ) * 100
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (progressText) {

        progressText.textContent =
            percentage + "%";

    }

}


// ==========================================================
// SHOW STAR REWARD
// ==========================================================

function showStarReward() {

    if (!starReward) {
        return;
    }


    clearStarRewardTimer();


    starReward.classList.add(
        "hidden"
    );


    void starReward.offsetWidth;


    starReward.classList.remove(
        "hidden"
    );


    starRewardTimer =
        setTimeout(
            function () {

                hideStarReward();

            },
            1200
        );

}


// ==========================================================
// HIDE STAR REWARD
// ==========================================================

function hideStarReward() {

    if (!starReward) {
        return;
    }


    starReward.classList.add(
        "hidden"
    );

}


// ==========================================================
// SHOW FEEDBACK
// ==========================================================

function showFeedback(
    icon,
    title,
    message
) {

    if (!feedback) {
        return;
    }


    if (feedbackIcon) {

        feedbackIcon.textContent =
            icon;

    }


    if (feedbackTitle) {

        feedbackTitle.textContent =
            title;

    }


    if (feedbackText) {

        feedbackText.textContent =
            message;

    }


    feedback.classList.remove(
        "hidden"
    );


    clearFeedbackTimer();


    feedbackTimer =
        setTimeout(
            function () {

                if (!gameEnded) {

                    feedback.classList.add(
                        "hidden"
                    );

                }

            },
            1000
        );

}


// ==========================================================
// HIDE FEEDBACK
// ==========================================================

function hideFeedback() {

    if (feedback) {

        feedback.classList.add(
            "hidden"
        );

    }

}


// ==========================================================
// CARD CLICK
// ==========================================================

function handleCardClick(card) {

    if (gameEnded) {
        return;
    }


    if (!gameStarted) {
        return;
    }


    if (lockBoard) {
        return;
    }


    if (
        card.classList.contains(
            "flipped"
        )
    ) {

        return;

    }


    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    if (
        card.classList.contains(
            "disabled"
        )
    ) {

        return;

    }


    playClickSound();


    card.classList.add(
        "flipped"
    );


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    lockBoard = true;


    checkMatch();

}


// ==========================================================
// CHECK MATCH
// ==========================================================

function checkMatch() {

    if (
        !firstCard ||
        !secondCard
    ) {

        return;

    }


    const firstLetter =
        firstCard.dataset.letter;


    const secondLetter =
        secondCard.dataset.letter;


    if (
        firstLetter === secondLetter
    ) {

        handleMatch();

    } else {

        handleMismatch();

    }

}


// ==========================================================
// MATCH
// ==========================================================

function handleMatch() {

    if (gameEnded) {
        return;
    }


    firstCard.classList.add(
        "matched"
    );


    secondCard.classList.add(
        "matched"
    );


    matchedPairs += 1;

    score += 10;

    stars += 1;


    playCorrectSound();


    // LARGE ANIMATED STAR
    showStarReward();


    showFeedback(
        "🌟",
        "Great Job!",
        "You found the matching letters!"
    );


    updateDisplay();


    resetTurn();


    const level =
        getCurrentLevel();


    if (
        matchedPairs >=
        level.pairs
    ) {

        setTimeout(
            function () {

                if (!gameEnded) {

                    finishLevel();

                }

            },
            700
        );

    }

}


// ==========================================================
// MISMATCH
// ==========================================================

function handleMismatch() {

    if (gameEnded) {
        return;
    }


    lives -= 1;


    if (lives < 0) {
        lives = 0;
    }


    playWrongSound();


    showFeedback(
        "💛",
        "Try Again!",
        "Look carefully and try another pair."
    );


    updateDisplay();


    if (lives <= 0) {

        gameOver();

        return;

    }


    mismatchTimer =
        setTimeout(
            function () {

                if (gameEnded) {
                    return;
                }


                if (firstCard) {

                    firstCard.classList.remove(
                        "flipped"
                    );

                }


                if (secondCard) {

                    secondCard.classList.remove(
                        "flipped"
                    );

                }


                resetTurn();

            },
            850
        );

}


// ==========================================================
// RESET TURN
// ==========================================================

function resetTurn() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// ==========================================================
// FINISH LEVEL
// ==========================================================

function finishLevel() {

    if (gameEnded) {
        return;
    }


    if (
        currentLevel >=
        LEVELS.length - 1
    ) {

        finishGame();

        return;

    }


    currentLevel += 1;


    matchedPairs = 0;


    lives = MAX_LIVES;


    firstCard = null;

    secondCard = null;

    lockBoard = false;


    showFeedback(
        "🎉",
        "Level Complete!",
        "Ready for the next level?"
    );


    if (nextButton) {

        nextButton.classList.remove(
            "hidden"
        );

    }


    updateDisplay();

}


// ==========================================================
// NEXT LEVEL BUTTON
// ==========================================================

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function () {

            if (gameEnded) {
                return;
            }


            playButtonSound();


            nextButton.classList.add(
                "hidden"
            );


            hideFeedback();

            hideStarReward();


            // NO LOADING
            createCards();

            updateDisplay();

        }
    );

}


// ==========================================================
// GAME OVER
// ==========================================================

async function gameOver() {

    if (gameEnded) {
        return;
    }


    gameEnded = true;

    gameStarted = false;

    lockBoard = true;


    clearAllTimers();

    hideFeedback();

    hideStarReward();


    // STOP MUSIC
    stopGameMusic();


    if (nextButton) {

        nextButton.classList.add(
            "hidden"
        );

    }


    if (memoryBoard) {

        const cards =
            memoryBoard.querySelectorAll(
                ".memory-card"
            );


        cards.forEach(
            function (card) {

                card.classList.add(
                    "disabled"
                );

                card.disabled = true;

            }
        );

    }


    if (gameOverScore) {

        gameOverScore.textContent =
            score;

    }


    if (gameOverPairs) {

        gameOverPairs.textContent =
            matchedPairs;

    }


    if (gameOverScreen) {

        gameOverScreen.classList.remove(
            "hidden"
        );

        gameOverScreen.style.display =
            "flex";

        gameOverScreen.style.visibility =
            "visible";

        gameOverScreen.style.opacity =
            "1";

        gameOverScreen.style.pointerEvents =
            "auto";

        gameOverScreen.style.zIndex =
            "90000";

    }


    await saveProgress("game_over");

}


// ==========================================================
// FINISH GAME
// ==========================================================

async function finishGame() {

    if (gameEnded) {
        return;
    }


    gameEnded = true;

    gameStarted = false;

    lockBoard = true;


    clearAllTimers();

    hideFeedback();

    hideStarReward();


    // STOP MUSIC
    stopGameMusic();


    if (nextButton) {

        nextButton.classList.add(
            "hidden"
        );

    }


    if (memoryBoard) {

        const cards =
            memoryBoard.querySelectorAll(
                ".memory-card"
            );


        cards.forEach(
            function (card) {

                card.classList.add(
                    "disabled"
                );

                card.disabled = true;

            }
        );

    }


    // ======================================================
    // FINAL STARS
    // ======================================================

    let finalStarCount = 1;


    if (lives >= 4) {

        finalStarCount = 3;

    }
    else if (lives >= 2) {

        finalStarCount = 2;

    }
    else {

        finalStarCount = 1;

    }


    stars = finalStarCount;


    // ======================================================
    // RESULT DATA
    // ======================================================

    if (finalScore) {

        finalScore.textContent =
            score;

    }


    if (finalPairs) {

        finalPairs.textContent =
            LEVELS.reduce(
                function (total, level) {

                    return total + level.pairs;

                },
                0
            );

    }


    if (finalStars) {

        finalStars.textContent =
            finalStarCount;

    }


    if (resultStarsDisplay) {

        resultStarsDisplay.textContent =
            "⭐".repeat(
                finalStarCount
            );

    }


    if (
        resultEmoji &&
        resultTitle
    ) {

        if (
            finalStarCount === 3
        ) {

            resultEmoji.textContent =
                "🏆";

            resultTitle.textContent =
                "Amazing!";

        }
        else if (
            finalStarCount === 2
        ) {

            resultEmoji.textContent =
                "🌟";

            resultTitle.textContent =
                "Great Job!";

        }
        else {

            resultEmoji.textContent =
                "💛";

            resultTitle.textContent =
                "Good Try!";

        }

    }


    // ======================================================
    // SHOW RESULT
    // ======================================================

    if (resultScreen) {

        resultScreen.classList.remove(
            "hidden"
        );

        resultScreen.style.display =
            "flex";

        resultScreen.style.visibility =
            "visible";

        resultScreen.style.opacity =
            "1";

        resultScreen.style.pointerEvents =
            "auto";

        resultScreen.style.zIndex =
            "90000";

    }


    // ======================================================
    // SAVE
    // ======================================================

    await saveProgress("completed");

}


// ==========================================================
// RESTART GAME
// ==========================================================

function restartGame() {

    playButtonSound();


    closeResultScreen();

    closeGameOverScreen();


    clearAllTimers();

    hideStarReward();


    currentLevel = 0;

    score = 0;

    stars = 0;

    lives = MAX_LIVES;

    matchedPairs = 0;

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    gameEnded = false;

    gameStarted = true;

    progressSaved = false;


    hideFeedback();


    if (nextButton) {

        nextButton.classList.add(
            "hidden"
        );

    }


    // NO LOADING
    createCards();

    updateDisplay();


    // RESTART BACKGROUND MUSIC
    startGameMusic();

}


// ==========================================================
// RESULT BUTTONS
// ==========================================================

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        restartGame
    );

}


if (gameOverAgainButton) {

    gameOverAgainButton.addEventListener(
        "click",
        restartGame
    );

}


// ==========================================================
// BACK BUTTONS
// ==========================================================

if (resultBackButton) {

    resultBackButton.addEventListener(
        "click",
        function () {

            playButtonSound();

            stopGameMusic();

            window.location.href =
                "../alphabet.html";

        }
    );

}


if (gameOverBackButton) {

    gameOverBackButton.addEventListener(
        "click",
        function () {

            playButtonSound();

            stopGameMusic();

            window.location.href =
                "../alphabet.html";

        }
    );

}


if (document.getElementById("backBtn")) {

    document.getElementById("backBtn")
        .addEventListener(
            "click",
            function () {

                playButtonSound();

                stopGameMusic();

            }
        );

}


// ==========================================================
// CLOSE RESULT
// ==========================================================

function closeResultScreen() {

    if (!resultScreen) {
        return;
    }


    resultScreen.classList.add(
        "hidden"
    );


    resultScreen.style.display =
        "none";

    resultScreen.style.visibility =
        "hidden";

    resultScreen.style.opacity =
        "0";

    resultScreen.style.pointerEvents =
        "none";

}


// ==========================================================
// CLOSE GAME OVER
// ==========================================================

function closeGameOverScreen() {

    if (!gameOverScreen) {
        return;
    }


    gameOverScreen.classList.add(
        "hidden"
    );


    gameOverScreen.style.display =
        "none";

    gameOverScreen.style.visibility =
        "hidden";

    gameOverScreen.style.opacity =
        "0";

    gameOverScreen.style.pointerEvents =
        "none";

}


// ==========================================================
// CLEAR MISMATCH TIMER
// ==========================================================

function clearMismatchTimer() {

    if (mismatchTimer) {

        clearTimeout(
            mismatchTimer
        );

        mismatchTimer = null;

    }

}


// ==========================================================
// CLEAR FEEDBACK TIMER
// ==========================================================

function clearFeedbackTimer() {

    if (feedbackTimer) {

        clearTimeout(
            feedbackTimer
        );

        feedbackTimer = null;

    }

}


// ==========================================================
// CLEAR STAR REWARD TIMER
// ==========================================================

function clearStarRewardTimer() {

    if (starRewardTimer) {

        clearTimeout(
            starRewardTimer
        );

        starRewardTimer = null;

    }

}


// ==========================================================
// CLEAR ALL TIMERS
// ==========================================================

function clearAllTimers() {

    clearMismatchTimer();

    clearFeedbackTimer();

    clearStarRewardTimer();

}


// ==========================================================
// SAVE PROGRESS
// ==========================================================

async function saveProgress(finalStatus) {

    if (progressSaved) {

        console.log(
            "Letter Memory progress already saved."
        );

        return false;

    }


    if (!selectedStudent) {

        console.error(
            "Progress not saved: no selected student."
        );

        return false;

    }


    const studentId =
        getStudentId();


    if (
        studentId === null ||
        studentId === undefined ||
        String(studentId).trim() === ""
    ) {

        console.error(
            "Progress not saved: student ID is missing."
        );

        return false;

    }


    const teacherId =
        getTeacherId();


    if (
        teacherId === null ||
        teacherId === undefined ||
        String(teacherId).trim() === ""
    ) {

        console.error(
            "Progress not saved: teacher ID is missing."
        );

        return false;

    }


    let status =
        "In Progress";


    if (
        finalStatus === "completed"
    ) {

        status =
            "Completed";

    }
    else if (
        finalStatus === "game_over"
    ) {

        status =
            "Game Over";

    }


    const progressData = {

        teacher_id:
            Number(teacherId),

        student_id:
            Number(studentId),

        category:
            "Alphabet",

        activity:
            "Letter Memory",

        score:
            Number(score) || 0,

        stars:
            Number(stars) || 0

    };


    console.log(
        "=========================================="
    );

    console.log(
        "SAVING LETTER MEMORY PROGRESS"
    );

    console.log(
        "Endpoint:",
        `${API_BASE}/progress/save`
    );

    console.log(
        "Status:",
        status
    );

    console.log(
        "Data:",
        progressData
    );

    console.log(
        "=========================================="
    );


    try {

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
                        JSON.stringify(
                            progressData
                        )
                }
            );


        const responseText =
            await response.text();


        let data = {};


        try {

            data =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : {};

        } catch (error) {

            data = {
                message:
                    responseText
            };

        }


        if (!response.ok) {

            console.error(
                "LETTER MEMORY SAVE FAILED"
            );

            console.error(
                "HTTP STATUS:",
                response.status
            );

            console.error(
                "SERVER RESPONSE:",
                data
            );

            return false;

        }


        progressSaved = true;


        console.log(
            "LETTER MEMORY PROGRESS SAVED SUCCESSFULLY"
        );

        console.log(
            "SERVER RESPONSE:",
            data
        );


        return true;

    } catch (error) {

        console.error(
            "LETTER MEMORY PROGRESS CONNECTION ERROR"
        );

        console.error(
            error
        );

        return false;

    }

}