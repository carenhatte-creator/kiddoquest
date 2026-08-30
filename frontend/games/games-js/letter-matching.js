// =========================================================
// KINDERQUEST - LETTER MATCHING
// FULL UPDATED VERSION
//
// FLOW:
//
// ENTER GAME
//      ↓
// INITIAL LOADING ONLY
//      ↓
// LEVEL 1
//      ↓
// LEVEL 2 → ... → LEVEL 10
//      ↓
// FINISH CARD STAYS
//      ↓
// PLAY AGAIN → LEVEL 1 DIRECTLY
//
// GAME OVER:
//      ↓
// GAME OVER CARD STAYS
//      ↓
// TRY AGAIN → LEVEL 1 DIRECTLY
//
// SOUND:
// - Shared Sound Manager
// - Background music
// - Correct answer sound
// - Wrong answer sound
// - Button sound
// - Game Over / Finish sound if available
//
// IMPORTANT:
// NO LOADING AFTER INITIAL LOADING
// NO PAGE RELOAD WHEN PLAY AGAIN / TRY AGAIN
// SCORE + STARS + MATCHES ARE SAVED
// =========================================================


// =========================================================
// API
// =========================================================

const API_BASE = "http://localhost:5001/api";


// =========================================================
// GAME SETTINGS
// =========================================================

const MAX_LIVES = 3;

const questions = [

    {
        question: "A",
        answer: "a",
        color: "#EF6687",
        choices: ["a", "d", "g", "x"]
    },

    {
        question: "B",
        answer: "b",
        color: "#55AEE0",
        choices: ["m", "b", "k", "q"]
    },

    {
        question: "C",
        answer: "c",
        color: "#72BF78",
        choices: ["z", "c", "p", "h"]
    },

    {
        question: "D",
        answer: "d",
        color: "#E7B53C",
        choices: ["d", "a", "y", "t"]
    },

    {
        question: "E",
        answer: "e",
        color: "#A36DCC",
        choices: ["r", "e", "v", "j"]
    },

    {
        question: "F",
        answer: "f",
        color: "#E9855F",
        choices: ["n", "f", "u", "o"]
    },

    {
        question: "G",
        answer: "g",
        color: "#5BB49F",
        choices: ["g", "r", "b", "x"]
    },

    {
        question: "H",
        answer: "h",
        color: "#D86D9A",
        choices: ["p", "h", "l", "s"]
    },

    {
        question: "I",
        answer: "i",
        color: "#6C8FE3",
        choices: ["w", "i", "t", "n"]
    },

    {
        question: "J",
        answer: "j",
        color: "#F08A5D",
        choices: ["j", "q", "f", "v"]
    }

];

const TOTAL_QUESTIONS = questions.length;


// =========================================================
// STUDENT
// =========================================================

let selectedStudent = null;

try {

    const rawStudent =
        localStorage.getItem("selectedStudent");

    if (rawStudent) {

        selectedStudent =
            JSON.parse(rawStudent);

    }

} catch (error) {

    console.error(
        "Unable to read selectedStudent:",
        error
    );

}


// =========================================================
// TEACHER
// =========================================================

let teacher = null;

try {

    const rawTeacher =
        localStorage.getItem("teacher");

    if (rawTeacher) {

        teacher =
            JSON.parse(rawTeacher);

    }

} catch (error) {

    console.error(
        "Unable to read teacher:",
        error
    );

}


// =========================================================
// GET TEACHER ID
// =========================================================

function getTeacherId() {

    if (!teacher) {

        return null;

    }

    return (
        teacher.id ||
        teacher.teacher_id ||
        teacher._id ||
        null
    );

}


// =========================================================
// GET STUDENT ID
// =========================================================

function getStudentId() {

    if (!selectedStudent) {

        return null;

    }

    return (
        selectedStudent.id ||
        selectedStudent.student_id ||
        selectedStudent._id ||
        null
    );

}


// =========================================================
// DOM ELEMENTS
// =========================================================

const loadingScreen =
    document.getElementById("loadingScreen");

const loadingBar =
    document.getElementById("loadingBarFill");

const loadingText =
    document.getElementById("loadingText");

const noStudentOverlay =
    document.getElementById("noStudentOverlay");

const playingStudentName =
    document.getElementById("playingStudentName");

const questionLetter =
    document.getElementById("questionLetter");

const targetShadow =
    document.getElementById("targetShadow");

const result =
    document.getElementById("result");

const scoreText =
    document.getElementById("score");

const livesText =
    document.getElementById("lives");

const starsText =
    document.getElementById("stars");

const questionNumberText =
    document.getElementById("questionNumber");

const progressBar =
    document.getElementById("progressBar");

const nextBtn =
    document.getElementById("nextBtn");

const starReward =
    document.getElementById("starReward");


// =========================================================
// GAME OVER ELEMENTS
// =========================================================

const gameOverScreen =
    document.getElementById("gameOverScreen");

const gameOverScore =
    document.getElementById("gameOverScore");

const gameOverPairs =
    document.getElementById("gameOverMatches");

const gameOverStars =
    document.getElementById("gameOverStars");

const gameOverAgainButton =
    document.getElementById("gameOverAgainButton");

const gameOverBackButton =
    document.getElementById("gameOverBackButton");


// =========================================================
// FINISH ELEMENTS
// =========================================================

const resultScreen =
    document.getElementById("resultScreen");

const resultStarsDisplay =
    document.getElementById("resultStarsDisplay");

const resultEmoji =
    document.getElementById("resultEmoji");

const resultTitle =
    document.getElementById("resultTitle");

const finishMessage =
    document.getElementById("finishMessage");

const finalScore =
    document.getElementById("finalScore");

const finalPairs =
    document.getElementById("finalPairs");

const finalStars =
    document.getElementById("finalStars");

const perfectStars =
    document.getElementById("perfectStars");

const finishSubMessage =
    document.getElementById("finishSubMessage");

const playAgainButton =
    document.getElementById("playAgainButton");

const resultBackButton =
    document.getElementById("resultBackButton");


// =========================================================
// CHOICE BUTTONS
// =========================================================

const buttons = [

    document.getElementById("choice1"),

    document.getElementById("choice2"),

    document.getElementById("choice3"),

    document.getElementById("choice4")

];


// =========================================================
// GAME VARIABLES
// =========================================================

let currentQuestion = 0;

let score = 0;

let correctAnswers = 0;

let stars = 0;

let lives = MAX_LIVES;

let answerLocked = false;

let gameFinished = false;

let initialLoadingFinished = false;


// =========================================================
// BACKGROUND MUSIC STATE
// =========================================================

let backgroundMusicStarted = false;


// =========================================================
// STUDENT DISPLAY
// =========================================================

function setupStudent() {

    if (!selectedStudent) {

        if (noStudentOverlay) {

            noStudentOverlay.classList.add("show");

        }

        return;

    }


    const firstName =
        selectedStudent.first_name ||
        selectedStudent.firstName ||
        "";

    const lastName =
        selectedStudent.last_name ||
        selectedStudent.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();


    if (
        playingStudentName &&
        fullName
    ) {

        playingStudentName.textContent =
            fullName;

    }

}


// =========================================================
// SOUND MANAGER
// =========================================================
//
// Uses the shared soundManager.js.
//
// soundManager.js must be loaded BEFORE this file:
//
// <script src="../../js/utils/soundManager.js"></script>
// <script src="../games-js/letter-matching.js"></script>
// =========================================================

function playSound(type) {

    try {

        // -----------------------------------------
        // SHARED SOUND MANAGER
        // -----------------------------------------

        if (
            window.soundManager &&
            typeof window.soundManager[type] ===
                "function"
        ) {

            window.soundManager[type]();

            return;

        }


        // -----------------------------------------
        // OLD SOUND MANAGER SUPPORT
        // -----------------------------------------

        if (
            window.SoundManager &&
            typeof window.SoundManager[type] ===
                "function"
        ) {

            window.SoundManager[type]();

            return;

        }


        // -----------------------------------------
        // FLAT GLOBAL FUNCTIONS
        // -----------------------------------------

        const soundFunctions = {

            click: "playButton",

            correct: "playCorrect",

            wrong: "playWrong",

            gameOver: "playGameOver",

            finish: "playFinish"

        };


        const functionName =
            soundFunctions[type];


        if (
            functionName &&
            typeof window[functionName] ===
                "function"
        ) {

            window[functionName]();

        }

    } catch (error) {

        console.log(
            "Sound error:",
            error
        );

    }

}


// =========================================================
// START BACKGROUND MUSIC
// =========================================================
//
// Background music is handled by soundManager.js.
//
// The game only tells Sound Manager to start it.
// Settings such as:
// - Music ON/OFF
// - Volume
//
// are handled by soundManager.js.
// =========================================================

function startGameBackgroundMusic() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.startBackgroundMusic ===
                "function"
        ) {

            window.soundManager.startBackgroundMusic();

            backgroundMusicStarted = true;

            return;

        }


        if (
            typeof window.startBackgroundMusic ===
                "function"
        ) {

            window.startBackgroundMusic();

            backgroundMusicStarted = true;

        }

    } catch (error) {

        console.log(
            "Background music error:",
            error
        );

    }

}


// =========================================================
// FIRST USER INTERACTION
// =========================================================
//
// Some browsers block automatic audio playback.
// This makes sure the music starts when the pupil
// first interacts with the page.
// =========================================================

function activateBackgroundMusic() {

    if (backgroundMusicStarted) {

        return;

    }

    startGameBackgroundMusic();

}


// =========================================================
// USER INTERACTION LISTENERS
// =========================================================
//
// Does NOT reload the page.
// Does NOT show loading.
// Only activates background music.
// =========================================================

document.addEventListener(
    "pointerdown",
    activateBackgroundMusic,
    {
        once: true
    }
);


// =========================================================
// CALCULATE STARS
//
// 0 - 3 correct = 0 stars
// 4 - 6 correct = 1 star
// 7 - 9 correct = 2 stars
// 10 correct    = 3 stars
// =========================================================

function calculateStars(matches) {

    const value =
        Number(matches) || 0;


    if (value >= 10) {

        return 3;

    }


    if (value >= 7) {

        return 2;

    }


    if (value >= 4) {

        return 1;

    }


    return 0;

}


// =========================================================
// UPDATE DISPLAY
// =========================================================

function updateDisplay() {

    if (scoreText) {

        scoreText.textContent =
            score;

    }


    if (livesText) {

        const fullHearts =
            "❤️".repeat(
                Math.max(0, lives)
            );

        const emptyHearts =
            "♡".repeat(
                Math.max(
                    0,
                    MAX_LIVES - lives
                )
            );

        livesText.textContent =
            fullHearts + emptyHearts;

    }


    if (starsText) {

        starsText.textContent =
            stars;

    }


    if (questionNumberText) {

        const level =
            Math.min(
                currentQuestion + 1,
                TOTAL_QUESTIONS
            );

        questionNumberText.textContent =
            `${level} / ${TOTAL_QUESTIONS}`;

    }


    if (progressBar) {

        let progress =
            (
                currentQuestion /
                TOTAL_QUESTIONS
            ) * 100;


        if (
            currentQuestion >=
            TOTAL_QUESTIONS
        ) {

            progress = 100;

        }


        progressBar.style.width =
            `${progress}%`;

    }

}


// =========================================================
// HIDE FINISH CARDS
// =========================================================

function hideFinishScreens() {

    if (gameOverScreen) {

        gameOverScreen.classList.remove(
            "visible"
        );

        gameOverScreen.style.display =
            "none";

    }


    if (resultScreen) {

        resultScreen.classList.remove(
            "visible"
        );

        resultScreen.style.display =
            "none";

    }

}


// =========================================================
// HIDE INITIAL LOADING
//
// NEVER CALLED TO SHOW LOADING AGAIN.
// =========================================================

function hideInitialLoading() {

    if (!loadingScreen) {

        return;

    }


    loadingScreen.style.opacity =
        "0";

    loadingScreen.style.pointerEvents =
        "none";

    loadingScreen.style.display =
        "none";

}


// =========================================================
// SHOW FINISH CARD
// =========================================================

function showFinishScreen(screen) {

    if (!screen) {

        console.error(
            "Finish screen element is missing."
        );

        return;

    }


    // Make sure loading cannot cover the card.

    hideInitialLoading();


    screen.classList.add(
        "visible"
    );

    screen.style.display =
        "flex";

    screen.style.opacity =
        "1";

    screen.style.visibility =
        "visible";

    screen.style.pointerEvents =
        "auto";

}


// =========================================================
// RESET GAME
//
// NO LOADING
// =========================================================

function resetGame() {

    currentQuestion = 0;

    score = 0;

    correctAnswers = 0;

    stars = 0;

    lives = MAX_LIVES;

    answerLocked = false;

    gameFinished = false;


    // Loading must remain hidden.

    hideInitialLoading();

    hideFinishScreens();


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    if (starReward) {

        starReward.classList.remove(
            "show"
        );

    }


    if (result) {

        result.textContent =
            "";

        result.className =
            "result";

    }


    if (targetShadow) {

        targetShadow.classList.remove(
            "reveal"
        );

        targetShadow.style.removeProperty(
            "--target-color"
        );

    }


    updateDisplay();

}


// =========================================================
// LOAD QUESTION
// =========================================================

function loadQuestion() {

    // Never load after finish.

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


    answerLocked = false;


    const current =
        questions[currentQuestion];


    // -----------------------------------------
    // QUESTION
    // -----------------------------------------

    if (questionLetter) {

        questionLetter.textContent =
            current.question;

    }


    // -----------------------------------------
    // TARGET
    // -----------------------------------------

    if (targetShadow) {

        targetShadow.classList.remove(
            "reveal"
        );

        targetShadow.style.removeProperty(
            "--target-color"
        );

        targetShadow.textContent =
            current.answer;

    }


    // -----------------------------------------
    // RESULT
    // -----------------------------------------

    if (result) {

        result.textContent =
            "";

        result.className =
            "result";

    }


    // -----------------------------------------
    // STAR REWARD
    // -----------------------------------------

    if (starReward) {

        starReward.classList.remove(
            "show"
        );

    }


    // -----------------------------------------
    // CHOICES
    // -----------------------------------------

    buttons.forEach(
        (button, index) => {

            if (!button) {

                return;

            }


            const letter =
                button.querySelector(
                    ".choice-letter"
                );


            if (!letter) {

                return;

            }


            letter.textContent =
                current.choices[index];


            button.classList.remove(
                "correct",
                "wrong"
            );


            button.disabled =
                false;


            button.onclick =
                () => {

                    checkAnswer(
                        button,
                        current.answer,
                        current.color
                    );

                };

        }
    );


    // -----------------------------------------
    // NEXT BUTTON
    // -----------------------------------------

    if (nextBtn) {

        nextBtn.style.display =
            "none";


        nextBtn.textContent =
            currentQuestion ===
            TOTAL_QUESTIONS - 1
                ? "Finish Game ✓"
                : "Next Level →";

    }


    updateDisplay();

}


// =========================================================
// REVEAL CORRECT LETTER
// =========================================================

function revealCorrectLetter(
    button,
    color
) {

    if (!button) {

        return;

    }


    const letter =
        button.querySelector(
            ".choice-letter"
        );


    if (!letter) {

        return;

    }


    letter.style.setProperty(
        "--choice-color",
        color
    );


    if (targetShadow) {

        targetShadow.style.setProperty(
            "--target-color",
            color
        );


        targetShadow.classList.add(
            "reveal"
        );

    }

}


// =========================================================
// STAR REWARD
// =========================================================

function showStarReward() {

    if (!starReward) {

        return;

    }


    starReward.classList.remove(
        "show"
    );


    void starReward.offsetWidth;


    starReward.classList.add(
        "show"
    );


    setTimeout(
        () => {

            if (!gameFinished) {

                starReward.classList.remove(
                    "show"
                );

            }

        },
        1150
    );

}


// =========================================================
// CHECK ANSWER
// =========================================================

function checkAnswer(
    button,
    correctAnswer,
    color
) {

    if (
        answerLocked ||
        gameFinished
    ) {

        return;

    }


    answerLocked = true;


    // Button sound

    playSound("click");


    buttons.forEach(
        choiceButton => {

            if (choiceButton) {

                choiceButton.disabled =
                    true;

            }

        }
    );


    const letterElement =
        button.querySelector(
            ".choice-letter"
        );


    if (!letterElement) {

        answerLocked = false;

        return;

    }


    const selectedLetter =
        letterElement.textContent;


    // =====================================================
    // CORRECT
    // =====================================================

    if (
        selectedLetter ===
        correctAnswer
    ) {

        button.classList.add(
            "correct"
        );


        revealCorrectLetter(
            button,
            color
        );


        score += 10;

        correctAnswers += 1;


        stars =
            calculateStars(
                correctAnswers
            );


        updateDisplay();


        // Correct answer sound

        playSound("correct");


        // Visual star reward

        showStarReward();


        if (nextBtn) {

            nextBtn.style.display =
                "block";

        }


        return;

    }


    // =====================================================
    // WRONG
    // =====================================================

    button.classList.add(
        "wrong"
    );


    lives -= 1;


    updateDisplay();


    // Wrong answer sound

    playSound("wrong");


    // -----------------------------------------
    // SHOW CORRECT ANSWER
    // -----------------------------------------

    buttons.forEach(
        choiceButton => {

            if (!choiceButton) {

                return;

            }


            const letter =
                choiceButton.querySelector(
                    ".choice-letter"
                );


            if (
                letter &&
                letter.textContent ===
                correctAnswer
            ) {

                choiceButton.classList.add(
                    "correct"
                );


                revealCorrectLetter(
                    choiceButton,
                    color
                );

            }

        }
    );


    // =====================================================
    // GAME OVER
    // =====================================================

    if (lives <= 0) {

        showGameOver();

        return;

    }


    // =====================================================
    // SAME LEVEL
    // =====================================================

    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    setTimeout(
        () => {

            if (gameFinished) {

                return;

            }


            answerLocked = false;


            buttons.forEach(
                choiceButton => {

                    if (!choiceButton) {

                        return;

                    }


                    choiceButton.disabled =
                        false;


                    choiceButton.classList.remove(
                        "wrong",
                        "correct"
                    );

                }
            );


            if (targetShadow) {

                targetShadow.classList.remove(
                    "reveal"
                );

                targetShadow.style.removeProperty(
                    "--target-color"
                );

            }

        },
        700
    );

}


// =========================================================
// NEXT LEVEL
//
// NO LOADING
// =========================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            if (gameFinished) {

                return;

            }


            playSound("click");


            currentQuestion += 1;


            // Level 10 completed.

            if (
                currentQuestion >=
                TOTAL_QUESTIONS
            ) {

                finishGame();

                return;

            }


            loadQuestion();

        }
    );

}


// =========================================================
// SHOW GAME OVER
//
// CARD STAYS.
// NO LOADING.
// NO REDIRECT.
// =========================================================

function showGameOver() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;

    answerLocked = true;


    buttons.forEach(
        button => {

            if (button) {

                button.disabled =
                    true;

            }

        }
    );


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    if (starReward) {

        starReward.classList.remove(
            "show"
        );

    }


    stars =
        calculateStars(
            correctAnswers
        );


    // -----------------------------------------
    // GAME OVER DATA
    // -----------------------------------------

    if (gameOverScore) {

        gameOverScore.textContent =
            score;

    }


    if (gameOverPairs) {

        gameOverPairs.textContent =
            correctAnswers;

    }


    if (gameOverStars) {

        gameOverStars.textContent =
            stars;

    }


    // Game over sound if Sound Manager provides it.

    playSound("gameOver");


    // Show card first.

    showFinishScreen(
        gameOverScreen
    );


    // Save without hiding card.

    saveProgress();

}


// =========================================================
// FINISH GAME
//
// CARD STAYS.
// NO LOADING.
// NO REDIRECT.
// =========================================================

function finishGame() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;

    answerLocked = true;


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    buttons.forEach(
        button => {

            if (button) {

                button.disabled =
                    true;

            }

        }
    );


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    if (starReward) {

        starReward.classList.remove(
            "show"
        );

    }


    // -----------------------------------------
    // FINAL STARS
    // -----------------------------------------

    stars =
        calculateStars(
            correctAnswers
        );


    // -----------------------------------------
    // FINAL DATA
    // -----------------------------------------

    if (finalScore) {

        finalScore.textContent =
            score;

    }


    if (finalPairs) {

        finalPairs.textContent =
            correctAnswers;

    }


    if (finalStars) {

        finalStars.textContent =
            stars;

    }


    // -----------------------------------------
    // STAR DISPLAY
    // -----------------------------------------

    if (resultStarsDisplay) {

        if (stars === 3) {

            resultStarsDisplay.textContent =
                "⭐⭐⭐";

        } else if (stars === 2) {

            resultStarsDisplay.textContent =
                "⭐⭐";

        } else if (stars === 1) {

            resultStarsDisplay.textContent =
                "⭐";

        } else {

            resultStarsDisplay.textContent =
                "";

        }

    }


    // -----------------------------------------
    // MESSAGE
    // -----------------------------------------

    if (
        correctAnswers ===
        TOTAL_QUESTIONS
    ) {

        if (resultEmoji) {

            resultEmoji.textContent =
                "🏆";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "Perfect!";

        }


        if (finishMessage) {

            finishMessage.textContent =
                "You completed all 10 levels!";

        }


        if (perfectStars) {

            perfectStars.style.display =
                "block";

        }

    } else {

        if (resultEmoji) {

            resultEmoji.textContent =
                "🌟";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "Great Job!";

        }


        if (finishMessage) {

            finishMessage.textContent =
                "You completed Letter Matching!";

        }


        if (perfectStars) {

            perfectStars.style.display =
                "none";

        }

    }


    if (finishSubMessage) {

        finishSubMessage.textContent =
            "Keep practicing your letters!";

    }


    // Finish sound

    playSound("finish");


    // Show finish card.

    showFinishScreen(
        resultScreen
    );


    // Save without changing screen.

    saveProgress();

}


// =========================================================
// SAVE PROGRESS
//
// Backend expects:
//
// teacher_id
// student_id
// category
// activity
// score
// stars
// =========================================================

async function saveProgress() {

    const teacherId =
        getTeacherId();

    const studentId =
        getStudentId();


    // -----------------------------------------
    // CHECK TEACHER
    // -----------------------------------------

    if (!teacherId) {

        console.error(
            "PROGRESS SAVE STOPPED: teacher ID is missing.",
            teacher
        );

        return;

    }


    // -----------------------------------------
    // CHECK STUDENT
    // -----------------------------------------

    if (!studentId) {

        console.error(
            "PROGRESS SAVE STOPPED: student ID is missing.",
            selectedStudent
        );

        return;

    }


    // -----------------------------------------
    // CALCULATE FINAL VALUES
    // -----------------------------------------

    const percentage =
        Math.round(
            (
                correctAnswers /
                TOTAL_QUESTIONS
            ) * 100
        );


    const finalStarsValue =
        calculateStars(
            correctAnswers
        );


    stars =
        finalStarsValue;


    // -----------------------------------------
    // REQUEST DATA
    // -----------------------------------------

    const requestBody = {

        teacher_id:
            teacherId,

        student_id:
            studentId,

        category:
            "alphabet",

        activity:
            "letter-matching",

        score:
            percentage,

        stars:
            finalStarsValue

    };


    console.log(
        "LETTER MATCHING SAVE REQUEST:",
        requestBody
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
                            requestBody
                        )

                }
            );


        const data =
            await response.json();


        console.log(
            "LETTER MATCHING SAVE RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                `HTTP ${response.status}`
            );

        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Progress was not saved."
            );

        }


        console.log(
            "✅ Letter Matching progress saved successfully."
        );


    } catch (error) {

        // Do NOT hide finish card.
        // Do NOT reload page.

        console.error(
            "❌ Letter Matching progress save failed:",
            error
        );

    }

}


// =========================================================
// RESTART GAME
//
// NO PAGE RELOAD
// NO LOADING
// DIRECT LEVEL 1
// =========================================================

function restartGame() {

    playSound("click");


    // Keep initial loading finished.

    initialLoadingFinished = true;


    hideInitialLoading();


    // Make sure music continues.

    startGameBackgroundMusic();


    resetGame();


    // Direct Level 1.

    loadQuestion();

}


// =========================================================
// PLAY AGAIN
//
// FINISH CARD → LEVEL 1
// NO LOADING
// =========================================================

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            restartGame();

        }
    );

}


// =========================================================
// GAME OVER TRY AGAIN
//
// GAME OVER CARD → LEVEL 1
// NO LOADING
// =========================================================

if (gameOverAgainButton) {

    gameOverAgainButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            restartGame();

        }
    );

}


// =========================================================
// BACK TO ALPHABET
// =========================================================

function goBackToAlphabet(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    playSound("click");


    // Stop music before leaving this game.

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.stopBackgroundMusic ===
                "function"
        ) {

            window.soundManager.stopBackgroundMusic();

        } else if (
            typeof window.stopBackgroundMusic ===
                "function"
        ) {

            window.stopBackgroundMusic();

        }

    } catch (error) {

        console.log(
            "Unable to stop background music:",
            error
        );

    }


    window.location.href =
        "../alphabet.html";

}


// =========================================================
// FINISH BACK
// =========================================================

if (resultBackButton) {

    resultBackButton.addEventListener(
        "click",
        goBackToAlphabet
    );

}


// =========================================================
// GAME OVER BACK
// =========================================================

if (gameOverBackButton) {

    gameOverBackButton.addEventListener(
        "click",
        goBackToAlphabet
    );

}


// =========================================================
// INITIAL LOADING
//
// THIS IS THE ONLY LOADING FUNCTION.
//
// It runs ONLY when entering the page.
//
// Play Again / Try Again NEVER call this.
// =========================================================

function runInitialLoading() {

    // Already completed?

    if (initialLoadingFinished) {

        startGame();

        return;

    }


    // No loading elements?
    // Start directly.

    if (!loadingScreen || !loadingBar) {

        initialLoadingFinished = true;

        startGame();

        return;

    }


    let progress = 0;


    loadingScreen.style.display =
        "flex";

    loadingScreen.style.opacity =
        "1";

    loadingScreen.style.visibility =
        "visible";

    loadingScreen.style.pointerEvents =
        "auto";


    loadingBar.style.width =
        "0%";


    if (loadingText) {

        loadingText.textContent =
            "Loading Letter Matching...";

    }


    const loadingTimer =
        setInterval(
            () => {

                progress += 10;


                if (progress >= 100) {

                    progress = 100;


                    clearInterval(
                        loadingTimer
                    );


                    loadingBar.style.width =
                        "100%";


                    if (loadingText) {

                        loadingText.textContent =
                            "Ready!";

                    }


                    setTimeout(
                        () => {

                            // Mark loading finished
                            // BEFORE starting game.

                            initialLoadingFinished =
                                true;


                            hideInitialLoading();


                            startGame();

                        },
                        250
                    );


                    return;

                }


                loadingBar.style.width =
                    `${progress}%`;

            },
            70
        );

}


// =========================================================
// START GAME
//
// ONLY INITIAL START.
//
// DOES NOT SHOW LOADING.
// =========================================================

function startGame() {

    // IMPORTANT:
    // Never show loading here.

    hideInitialLoading();


    // =====================================================
    // START BACKGROUND MUSIC
    // =====================================================
    //
    // Sound Manager checks whether Music is enabled.
    // Browser autoplay restrictions are handled by
    // the first user interaction listener above.
    // =====================================================

    startGameBackgroundMusic();


    if (!selectedStudent) {

        if (noStudentOverlay) {

            noStudentOverlay.classList.add(
                "show"
            );

        }

        return;

    }


    gameFinished = false;

    currentQuestion = 0;

    score = 0;

    stars = 0;

    correctAnswers = 0;

    lives = MAX_LIVES;

    answerLocked = false;


    hideFinishScreens();


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    if (starReward) {

        starReward.classList.remove(
            "show"
        );

    }


    updateDisplay();

    loadQuestion();

}


// =========================================================
// INITIALIZE
// =========================================================

function initializeLetterMatching() {

    setupStudent();


    // -----------------------------------------------------
    // If no selected student,
    // don't start gameplay.
    // -----------------------------------------------------

    if (!selectedStudent) {

        hideInitialLoading();

        return;

    }


    // -----------------------------------------------------
    // ONLY HERE DO WE START INITIAL LOADING.
    // -----------------------------------------------------

    runInitialLoading();

}


// =========================================================
// DOM READY
// =========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeLetterMatching
    );

} else {

    initializeLetterMatching();

}