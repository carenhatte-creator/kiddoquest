// ==========================================================
// KinderQuest - PAIRING NUMBER
// FULL UPDATED VERSION
//
// FEATURES:
// - 10 QUESTIONS
// - 3 LIVES
// - ❤️ HEARTS
// - SCORE
// - STARS
// - CORRECT SOUND
// - WRONG SOUND
// - CLICK SOUND
// - BUTTON SOUND
// - BACKGROUND MUSIC
// - PLAY AGAIN
// - FINISH RESULT
// - SELECTED STUDENT
// - BACKEND PROGRESS SAVE
// - NO PAGE RELOAD
//
// LOADING:
// - INITIAL LOADING ONLY
// - SAME STYLE ACROSS ALL KINDERQUEST GAMES
// ==========================================================

console.log("pairing-number.js loaded");


// ==========================================================
// API
// ==========================================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";


// ==========================================================
// SETTINGS
// ==========================================================

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;
const POINTS_PER_CORRECT = 10;


// ==========================================================
// GAME VARIABLES
// ==========================================================

let questionNumber = 1;
let score = 0;
let stars = 0;
let lives = MAX_LIVES;

let currentAnswer = 1;

let locked = false;
let gameFinished = false;


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


const targetNumber =
    document.getElementById(
        "targetNumber"
    );


const numberChoices =
    document.getElementById(
        "numberChoices"
    );


const questionDisplay =
    document.getElementById(
        "questionNumber"
    );


const scoreDisplay =
    document.getElementById(
        "score"
    );


const starDisplay =
    document.getElementById(
        "starCount"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const feedback =
    document.getElementById(
        "feedback"
    );


const livesContainer =
    document.getElementById(
        "lives"
    );


const gameOverlay =
    document.getElementById(
        "gameOverlay"
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


const playAgainBtn =
    document.getElementById(
        "playAgainBtn"
    );


const playerNameDisplay =
    document.getElementById(
        "playerName"
    );


const teacherImage =
    document.getElementById(
        "teacherImage"
    );


// ==========================================================
// SOUND MANAGER
// ==========================================================

function playGameClick() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.playClick ===
                "function"
        ) {

            window.soundManager.playClick();

        }

    }

    catch (error) {

        console.log(
            "Click sound error:",
            error
        );

    }

}


function playGameButton() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.playButton ===
                "function"
        ) {

            window.soundManager.playButton();

        }

    }

    catch (error) {

        console.log(
            "Button sound error:",
            error
        );

    }

}


function playGameCorrect() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.playCorrect ===
                "function"
        ) {

            window.soundManager.playCorrect();

        }

    }

    catch (error) {

        console.log(
            "Correct sound error:",
            error
        );

    }

}


function playGameWrong() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.playWrong ===
                "function"
        ) {

            window.soundManager.playWrong();

        }

    }

    catch (error) {

        console.log(
            "Wrong sound error:",
            error
        );

    }

}


function startGameMusic() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.startBackgroundMusic ===
                "function"
        ) {

            window.soundManager.startBackgroundMusic();

        }

    }

    catch (error) {

        console.log(
            "Background music error:",
            error
        );

    }

}


// ==========================================================
// CHECK TEACHER IMAGE
// ==========================================================

if (teacherImage) {

    teacherImage.addEventListener(
        "load",
        function () {

            console.log(
                "Teacher image loaded successfully."
            );

        }
    );


    teacherImage.addEventListener(
        "error",
        function () {

            console.error(
                "Teacher image could not be loaded."
            );


            console.error(
                "Expected path: ../../image/teacher.png"
            );

        }
    );

}


// ==========================================================
// LOAD PLAYER NAME
// ==========================================================

function loadPlayerName() {

    const selectedStudent =
        localStorage.getItem(
            "selectedStudent"
        );


    if (!selectedStudent) {

        if (playerNameDisplay) {

            playerNameDisplay.textContent =
                "Player";

        }

        return;

    }


    try {

        const student =
            JSON.parse(
                selectedStudent
            );


        const firstName =
            student.first_name ||
            student.firstName ||
            "";


        const lastName =
            student.last_name ||
            student.lastName ||
            "";


        const fullName =
            `${firstName} ${lastName}`.trim();


        if (playerNameDisplay) {

            if (fullName) {

                playerNameDisplay.textContent =
                    fullName;

            }

            else {

                playerNameDisplay.textContent =
                    "Player";

            }

        }

    }

    catch (error) {

        console.log(
            "Unable to load player name:",
            error
        );


        if (playerNameDisplay) {

            playerNameDisplay.textContent =
                "Player";

        }

    }

}


// ==========================================================
// RANDOM NUMBER
// ==========================================================

function randomNumber(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


// ==========================================================
// CREATE CHOICES
// ==========================================================

function createChoices(
    correctNumber
) {

    const choices =
        new Set();


    choices.add(
        correctNumber
    );


    while (
        choices.size < 4
    ) {

        choices.add(
            randomNumber(
                1,
                10
            )
        );

    }


    return Array.from(
        choices
    ).sort(
        function () {

            return Math.random() - 0.5;

        }
    );

}


// ==========================================================
// LOAD QUESTION
// ==========================================================

function loadQuestion() {

    if (gameFinished) {

        return;

    }


    locked = false;


    if (feedback) {

        feedback.className =
            "feedback";

        feedback.textContent =
            "";

    }


    // ======================================================
    // TARGET NUMBER
    // ======================================================

    currentAnswer =
        randomNumber(
            1,
            10
        );


    if (targetNumber) {

        targetNumber.textContent =
            currentAnswer;

    }


    // ======================================================
    // QUESTION NUMBER
    // ======================================================

    if (questionDisplay) {

        questionDisplay.textContent =
            questionNumber;

    }


    // ======================================================
    // SCORE
    // ======================================================

    if (scoreDisplay) {

        scoreDisplay.textContent =
            score;

    }


    // ======================================================
    // STARS
    // ======================================================

    if (starDisplay) {

        starDisplay.textContent =
            stars;

    }


    // ======================================================
    // PROGRESS
    // ======================================================

    const progress =
        (
            (questionNumber - 1) /
            TOTAL_QUESTIONS
        ) * 100;


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    // ======================================================
    // CLEAR CHOICES
    // ======================================================

    if (numberChoices) {

        numberChoices.innerHTML =
            "";

    }


    // ======================================================
    // CREATE CHOICES
    // ======================================================

    const choices =
        createChoices(
            currentAnswer
        );


    choices.forEach(
        function (number) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "number-choice";


            button.textContent =
                number;


            button.addEventListener(
                "click",
                function () {

                    checkAnswer(
                        button,
                        number
                    );

                }
            );


            if (numberChoices) {

                numberChoices.appendChild(
                    button
                );

            }

        }
    );


    updateLives();

}


// ==========================================================
// LIVE STAR REWARD
//
// PLAIN FLOATING STAR — NO CARD.
// USED ON CORRECT ANSWERS INSTEAD OF THE
// WHITE .feedback POPUP CARD.
// ==========================================================

function showStarReward() {

    const star =
        document.createElement(
            "div"
        );


    star.className =
        "live-star-reward";


    star.textContent =
        "⭐ +1 Star";


    document.body.appendChild(
        star
    );


    const target =
        document.querySelector(
            ".board-area"
        ) ||
        document.body;


    const rect =
        target.getBoundingClientRect();


    star.style.left =
        (
            rect.left +
            rect.width / 2
        ) +
        "px";


    star.style.top =
        (
            rect.top +
            rect.height / 2
        ) +
        "px";


    requestAnimationFrame(
        function () {

            star.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        function () {

            if (star.parentNode) {

                star.remove();

            }

        },
        1000
    );

}


// ==========================================================
// CHECK ANSWER
// ==========================================================

function checkAnswer(
    button,
    selectedNumber
) {

    if (
        locked ||
        gameFinished
    ) {

        return;

    }


    // ======================================================
    // CLICK SOUND
    // ======================================================

    playGameClick();


    // ======================================================
    // CORRECT
    // ======================================================

    if (
        selectedNumber ===
        currentAnswer
    ) {

        locked = true;


        button.classList.add(
            "correct"
        );


        score +=
            POINTS_PER_CORRECT;


        stars +=
            1;


        if (scoreDisplay) {

            scoreDisplay.textContent =
                score;

        }


        if (starDisplay) {

            starDisplay.textContent =
                stars;

        }


        // CORRECT SOUND

        playGameCorrect();


        // STAR ANIMATION (NO CARD)

        showStarReward();


        setTimeout(
            function () {

                if (gameFinished) {

                    return;

                }


                if (
                    questionNumber >=
                    TOTAL_QUESTIONS
                ) {

                    finishGame();

                }

                else {

                    questionNumber++;

                    loadQuestion();

                }

            },
            900
        );

    }


    // ======================================================
    // WRONG
    // ======================================================

    else {

        button.classList.add(
            "wrong"
        );


        lives--;


        updateLives();


        // WRONG SOUND

        playGameWrong();


        // SHOW CORRECT ANSWER

        const allButtons =
            numberChoices
                ? numberChoices.querySelectorAll(
                    ".number-choice"
                )
                : [];


        allButtons.forEach(
            function (btn) {

                if (
                    Number(
                        btn.textContent
                    ) ===
                    Number(
                        currentAnswer
                    )
                ) {

                    btn.classList.add(
                        "correct"
                    );

                }

            }
        );


        // ==================================================
        // GAME OVER
        // ==================================================

        if (
            lives <= 0
        ) {

            locked = true;


            setTimeout(
                function () {

                    finishGame();

                },
                900
            );

        }

    }

}


// ==========================================================
// UPDATE LIVES
//
// Uses ❤️ instead of ♥
// ==========================================================

function updateLives() {

    if (!livesContainer) {

        return;

    }


    const hearts =
        livesContainer.querySelectorAll(
            ".heart"
        );


    hearts.forEach(
        function (heart, index) {

            if (index < lives) {

                heart.classList.add(
                    "active"
                );


                heart.textContent =
                    "❤️";

            }

            else {

                heart.classList.remove(
                    "active"
                );


                heart.textContent =
                    "🖤";

            }

        }
    );

}


// ==========================================================
// FEEDBACK
// ==========================================================

function showFeedback(
    message,
    correct
) {

    if (!feedback) {

        return;

    }


    feedback.textContent =
        message;


    if (correct) {

        feedback.className =
            "feedback show correct-feedback";

    }

    else {

        feedback.className =
            "feedback show wrong-feedback";

    }


    setTimeout(
        function () {

            if (
                feedback &&
                !gameFinished
            ) {

                feedback.className =
                    "feedback";

            }

        },
        750
    );

}


// ==========================================================
// CALCULATE FINAL STARS
// ==========================================================

function calculateFinalStars() {

    if (score >= 80) {

        return 3;

    }


    if (score >= 60) {

        return 2;

    }


    if (score > 0) {

        return 1;

    }


    return 0;

}


// ==========================================================
// DISPLAY RESULT STARS
// ==========================================================

function displayResultStars(
    finalStarCount
) {

    const resultStars =
        document.querySelectorAll(
            ".result-stars span"
        );


    resultStars.forEach(
        function (star, index) {

            if (
                index <
                finalStarCount
            ) {

                star.textContent =
                    "⭐";

            }

            else {

                star.textContent =
                    "☆";

            }

        }
    );

}


// ==========================================================
// FINISH GAME
// ==========================================================

function finishGame() {

    if (gameFinished) {

        return;

    }


    gameFinished =
        true;


    locked =
        true;


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    const finalStarCount =
        calculateFinalStars();


    if (finalScore) {

        finalScore.textContent =
            score;

    }


    if (finalStars) {

        finalStars.textContent =
            finalStarCount;

    }


    displayResultStars(
        finalStarCount
    );


    // ======================================================
    // RESULT MESSAGE
    // ======================================================

    if (score >= 80) {

        if (resultTitle) {

            resultTitle.textContent =
                "Amazing! ⭐";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "You are great at matching numbers!";

        }

    }

    else if (score >= 50) {

        if (resultTitle) {

            resultTitle.textContent =
                "Great Job!";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "You did a wonderful job!";

        }

    }

    else {

        if (resultTitle) {

            resultTitle.textContent =
                "Good Try!";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "Keep practicing your numbers!";

        }

    }


    // ======================================================
    // SHOW RESULT
    // ======================================================

    if (gameOverlay) {

        gameOverlay.classList.remove(
            "hidden"
        );

    }


    // ======================================================
    // SAVE PROGRESS
    // ======================================================

    saveProgress();

}


// ==========================================================
// SAVE PROGRESS
// ==========================================================

async function saveProgress() {

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

        console.log(
            "Teacher or student not selected."
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
                                "numbers",

                            activity:
                                "pairing-number",

                            score:
                                score,

                            stars:
                                stars

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "PAIRING NUMBER PROGRESS:",
            data
        );


        if (!response.ok) {

            console.error(
                "Pairing Number progress save failed:",
                data
            );

        }

    }

    catch (error) {

        console.log(
            "Progress save error:",
            error
        );

    }

}


// ==========================================================
// RESTART GAME
// ==========================================================

function restartGame() {

    // BUTTON SOUND

    playGameButton();


    questionNumber =
        1;


    score =
        0;


    stars =
        0;


    lives =
        MAX_LIVES;


    currentAnswer =
        1;


    locked =
        false;


    gameFinished =
        false;


    if (gameOverlay) {

        gameOverlay.classList.add(
            "hidden"
        );

    }


    if (scoreDisplay) {

        scoreDisplay.textContent =
            "0";

    }


    if (starDisplay) {

        starDisplay.textContent =
            "0";

    }


    updateLives();


    loadQuestion();


    // Continue background music

    startGameMusic();

}


// ==========================================================
// PLAY AGAIN BUTTON
// ==========================================================

if (playAgainBtn) {

    playAgainBtn.addEventListener(
        "click",
        function () {

            restartGame();

        }
    );

}


// ==========================================================
// BACK BUTTON
//
// May gumana pa rin ang HTML href.
// Naglalagay lang tayo ng sound.
// ==========================================================

const backButton =
    document.querySelector(
        ".back-btn"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            playGameButton();

        }
    );

}


// ==========================================================
// NUMBER GAMES / MENU BUTTON SOUND
// ==========================================================

const menuButton =
    document.querySelector(
        ".menu-btn"
    );


if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            playGameButton();

        }
    );

}


// ==========================================================
// AFTER INITIAL LOADING
// ==========================================================

function startGameAfterLoading() {

    loadPlayerName();

    updateLives();

    loadQuestion();

    startGameMusic();

}


// ==========================================================
// INITIAL LOADING
// SAME STYLE ACROSS ALL KINDERQUEST GAMES
// ==========================================================

function runInitialLoading() {

    if (
        !loadingScreen ||
        !loadingBarFill
    ) {

        startGameAfterLoading();

        return;

    }


    loadingScreen.classList.remove(
        "hide"
    );


    loadingBarFill.style.width =
        "0%";


    let progress = 0;


    const loadingTimer =
        setInterval(
            function () {

                progress += 5;


                loadingBarFill.style.width =
                    progress + "%";


                if (progress >= 100) {

                    clearInterval(
                        loadingTimer
                    );


                    setTimeout(
                        function () {

                            loadingScreen.classList.add(
                                "hide"
                            );


                            startGameAfterLoading();

                        },
                        250
                    );

                }

            },
            70
        );

}


// ==========================================================
// INITIALIZE
// ==========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        runInitialLoading
    );

}

else {

    runInitialLoading();

}