// ==========================================
// KINDERQUEST - NUMBER SEQUENCE
// FULL UPDATED VERSION
// ==========================================
//
// 10 QUESTIONS
// 3 LIVES
// INITIAL LOADING ONLY
// SAME LOADING STYLE ACROSS ALL KINDERQUEST GAMES
// NO LOADING BETWEEN QUESTIONS
// NO LOADING ON PLAY AGAIN
// LIVE STAR REWARD ANIMATION ON CORRECT
// SELECTED STUDENT
// SOUND MANAGER
// BACKEND PROGRESS SAVE
// ==========================================


console.log("number-sequence.js loaded");


// ==========================================
// API
// ==========================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";


// ==========================================
// SETTINGS
// ==========================================

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;
const POINTS_PER_CORRECT = 10;


// ==========================================
// QUESTIONS
// ==========================================

const questions = [

    {
        sequence: [1, 2, 3, null, 5],
        answer: 4,
        choices: [4, 2, 3]
    },

    {
        sequence: [2, 3, 4, null, 6],
        answer: 5,
        choices: [5, 7, 4]
    },

    {
        sequence: [3, 4, 5, null, 7],
        answer: 6,
        choices: [8, 6, 5]
    },

    {
        sequence: [4, 5, 6, null, 8],
        answer: 7,
        choices: [6, 9, 7]
    },

    {
        sequence: [5, 6, 7, null, 9],
        answer: 8,
        choices: [8, 6, 10]
    },

    {
        sequence: [6, 7, 8, null, 10],
        answer: 9,
        choices: [7, 9, 11]
    },

    {
        sequence: [7, 8, 9, null, 11],
        answer: 10,
        choices: [10, 8, 12]
    },

    {
        sequence: [8, 9, 10, null, 12],
        answer: 11,
        choices: [9, 11, 13]
    },

    {
        sequence: [9, 10, 11, null, 13],
        answer: 12,
        choices: [12, 10, 14]
    },

    {
        sequence: [10, 11, 12, null, 14],
        answer: 13,
        choices: [11, 13, 15]
    }

];


// ==========================================
// GAME VARIABLES
// ==========================================

let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let lives = MAX_LIVES;
let answered = false;
let gameEnded = false;
let gameOverState = false;


// ==========================================
// ELEMENTS
// ==========================================

const loadingScreen =
    document.getElementById("loadingScreen");

const loadingBarFill =
    document.getElementById("loadingBarFill");

const playerName =
    document.getElementById("playerName");

const questionNumber =
    document.getElementById("questionNumber");

const scoreElement =
    document.getElementById("score");

const progressBar =
    document.getElementById("progressBar");

const numberPath =
    document.getElementById("numberPath");

const choices =
    document.getElementById("choices");

const feedback =
    document.getElementById("feedback");

const nextBtn =
    document.getElementById("nextBtn");

const resultScreen =
    document.getElementById("resultScreen");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const finalScore =
    document.getElementById("finalScore");

const finalStars =
    document.getElementById("finalStars");


// ==========================================
// SOUND FUNCTIONS
// ==========================================

function playClickSound() {

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


function playButtonSound() {

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


function playCorrectSound() {

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


function playWrongSound() {

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
            "Music start error:",
            error
        );

    }

}


function stopGameMusic() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.stopBackgroundMusic ===
            "function"
        ) {

            window.soundManager.stopBackgroundMusic();

        }

    }

    catch (error) {

        console.log(
            "Music stop error:",
            error
        );

    }

}


// ==========================================
// PLAYER NAME
// ==========================================

function loadPlayerName() {

    if (!playerName) {
        return;
    }


    const raw =
        localStorage.getItem(
            "selectedStudent"
        );


    if (!raw) {

        playerName.textContent =
            "Player";

        return;

    }


    try {

        const student =
            JSON.parse(raw);


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


        if (fullName) {

            playerName.textContent =
                fullName;

        }

        else {

            playerName.textContent =
                student.name ||
                student.fullName ||
                "Player";

        }

    }

    catch (error) {

        console.error(
            "Player name error:",
            error
        );

        playerName.textContent =
            "Player";

    }

}


// ==========================================
// INITIAL LOADING
// SAME STYLE ACROSS ALL KINDERQUEST GAMES
// ==========================================

function showInitialLoading() {

    if (
        !loadingScreen ||
        !loadingBarFill
    ) {

        initializeAfterLoading();

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
            () => {

                progress += 5;


                loadingBarFill.style.width =
                    progress + "%";


                if (progress >= 100) {

                    clearInterval(
                        loadingTimer
                    );


                    setTimeout(
                        () => {

                            loadingScreen.classList.add(
                                "hide"
                            );


                            initializeAfterLoading();

                        },
                        250
                    );

                }

            },
            70
        );

}


// ==========================================
// UPDATE HEARTS
// ==========================================

function updateHearts() {

    const hearts = [

        document.getElementById("heart1"),
        document.getElementById("heart2"),
        document.getElementById("heart3")

    ];


    hearts.forEach(
        (heart, index) => {

            if (!heart) {
                return;
            }


            if (index < lives) {

                heart.textContent =
                    "❤️";

            }

            else {

                heart.textContent =
                    "♡";

            }

        }
    );

}


// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    if (gameEnded) {
        return;
    }


    if (
        currentQuestion >=
        questions.length
    ) {

        finishGame();

        return;

    }


    answered = false;


    const game =
        questions[currentQuestion];


    if (questionNumber) {

        questionNumber.textContent =
            currentQuestion + 1;

    }


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    if (feedback) {

        feedback.textContent =
            "";

        feedback.className =
            "feedback";

    }


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    // ======================================
    // NUMBER PATH
    // ======================================

    if (numberPath) {

        numberPath.innerHTML =
            "";


        game.sequence.forEach(
            (number, index) => {

                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "number-box";


                if (number === null) {

                    box.classList.add(
                        "missing"
                    );

                    box.textContent =
                        "?";

                }

                else {

                    box.textContent =
                        number;

                }


                numberPath.appendChild(
                    box
                );


                if (
                    index <
                    game.sequence.length - 1
                ) {

                    const line =
                        document.createElement(
                            "div"
                        );


                    line.className =
                        "sequence-line";


                    numberPath.appendChild(
                        line
                    );

                }

            }
        );

    }


    // ======================================
    // CHOICES
    // ======================================

    if (choices) {

        choices.innerHTML =
            "";


        const shuffledChoices =
            [...game.choices].sort(
                () =>
                    Math.random() - 0.5
            );


        shuffledChoices.forEach(
            (choice) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "choice-btn";


                button.textContent =
                    choice;


                button.addEventListener(
                    "click",
                    () => {

                        checkAnswer(
                            button,
                            choice,
                            game.answer
                        );

                    }
                );


                choices.appendChild(
                    button
                );

            }
        );

    }


    // ======================================
    // PROGRESS
    // ======================================

    const progress =
        (
            currentQuestion /
            TOTAL_QUESTIONS
        ) * 100;


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    updateHearts();

}


// ==========================================
// LIVE STAR REWARD
// ==========================================

function showStarReward() {

    const star =
        document.createElement("div");


    star.className =
        "live-star-reward";


    star.textContent =
        "⭐ +1 Star";


    document.body.appendChild(
        star
    );


    const target =
        document.querySelector(
            ".game-area"
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
            20
        ) +
        "px";


    requestAnimationFrame(
        () => {

            star.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            if (star.parentNode) {

                star.remove();

            }

        },
        1000
    );

}


// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(
    button,
    selectedAnswer,
    correctAnswer
) {

    if (
        answered ||
        gameEnded
    ) {

        return;

    }


    answered = true;


    playClickSound();


    const allButtons =
        document.querySelectorAll(
            ".choice-btn"
        );


    allButtons.forEach(
        (btn) => {

            btn.disabled =
                true;

        }
    );


    // ======================================
    // CORRECT
    // ======================================

    if (
        Number(selectedAnswer) ===
        Number(correctAnswer)
    ) {

        button.classList.add(
            "correct"
        );


        feedback.textContent =
            "⭐ Correct! Great job!";


        feedback.classList.add(
            "correct"
        );


        score +=
            POINTS_PER_CORRECT;


        correctAnswers++;


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        playCorrectSound();


        showStarReward();


        if (nextBtn) {

            nextBtn.style.display =
                "block";

        }

    }


    // ======================================
    // WRONG
    // ======================================

    else {

        button.classList.add(
            "wrong"
        );


        lives--;


        if (lives < 0) {

            lives = 0;

        }


        updateHearts();


        playWrongSound();


        allButtons.forEach(
            (btn) => {

                if (
                    Number(btn.textContent) ===
                    Number(correctAnswer)
                ) {

                    btn.classList.add(
                        "correct"
                    );

                }

            }
        );


        if (lives <= 0) {

            setTimeout(
                () => {

                    gameOver();

                },
                700
            );

            return;

        }


        if (nextBtn) {

            nextBtn.style.display =
                "block";

        }

    }

}


// ==========================================
// NEXT BUTTON
// NO LOADING
// ==========================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            if (gameEnded) {
                return;
            }


            playButtonSound();


            currentQuestion++;


            loadQuestion();

        }
    );

}


// ==========================================
// CALCULATE STARS
// ==========================================

function calculateStars(
    percentage
) {

    if (percentage >= 80) {

        return 3;

    }


    if (percentage >= 60) {

        return 2;

    }


    if (percentage > 0) {

        return 1;

    }


    return 0;

}


// ==========================================
// DISPLAY STATIC STARS
// NO ANIMATION
// ==========================================

function displayStars(
    stars
) {

    if (!finalStars) {
        return;
    }


    if (stars >= 3) {

        finalStars.textContent =
            "★★★";

    }

    else if (stars === 2) {

        finalStars.textContent =
            "★★";

    }

    else if (stars === 1) {

        finalStars.textContent =
            "★";

    }

    else {

        finalStars.textContent =
            "—";

    }

}


// ==========================================
// FINISH GAME
// ==========================================

function finishGame() {

    if (gameEnded) {
        return;
    }


    gameEnded = true;


    const percentageScore =
        Math.round(
            (
                correctAnswers /
                TOTAL_QUESTIONS
            ) * 100
        );


    const stars =
        calculateStars(
            percentageScore
        );


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    if (finalScore) {

        finalScore.textContent =
            `${percentageScore}%`;

    }


    displayStars(stars);


    if (resultIcon) {

        resultIcon.textContent =
            "🏆";

    }


    if (resultTitle) {

        resultTitle.textContent =
            "Great Job!";

    }


    if (resultMessage) {

        resultMessage.textContent =
            "You completed the Number Sequence game!";

    }


    if (resultScreen) {

        resultScreen.style.display =
            "flex";

    }


    saveProgress(
        percentageScore,
        stars
    );

}


// ==========================================
// GAME OVER
// ==========================================

function gameOver() {

    if (gameEnded) {
        return;
    }


    gameEnded = true;


    gameOverState = true;


    const percentageScore =
        Math.round(
            (
                correctAnswers /
                TOTAL_QUESTIONS
            ) * 100
        );


    const stars =
        calculateStars(
            percentageScore
        );


    if (finalScore) {

        finalScore.textContent =
            `${percentageScore}%`;

    }


    displayStars(stars);


    if (resultIcon) {

        resultIcon.textContent =
            "💪";

    }


    if (resultTitle) {

        resultTitle.textContent =
            "Good Try!";

    }


    if (resultMessage) {

        resultMessage.textContent =
            "Keep practicing and try again!";

    }


    if (resultScreen) {

        resultScreen.style.display =
            "flex";

    }


    saveProgress(
        percentageScore,
        stars
    );

}


// ==========================================
// SAVE PROGRESS
// ==========================================

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


        if (
            !teacher ||
            !teacher.id ||
            !student ||
            !student.id
        ) {

            console.log(
                "Missing teacher or student ID."
            );

            return;

        }


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
                                "number-sequence",

                            score:
                                Number(
                                    percentageScore
                                ),

                            stars:
                                Number(
                                    stars
                                )

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "NUMBER SEQUENCE PROGRESS:",
            data
        );


        if (!response.ok) {

            console.error(
                "Progress save failed:",
                data
            );

        }

    }

    catch (error) {

        console.error(
            "Progress save error:",
            error
        );

    }

}


// ==========================================
// RESTART GAME
// NO LOADING
// ==========================================

function restartGame() {

    playButtonSound();


    currentQuestion = 0;


    score = 0;


    correctAnswers = 0;


    lives = MAX_LIVES;


    answered = false;


    gameEnded = false;


    gameOverState = false;


    if (resultScreen) {

        resultScreen.style.display =
            "none";

    }


    if (scoreElement) {

        scoreElement.textContent =
            "0";

    }


    if (progressBar) {

        progressBar.style.width =
            "0%";

    }


    updateHearts();


    loadQuestion();

}


// ==========================================
// BACK TO GAMES
// ==========================================

function goBack() {

    playButtonSound();


    stopGameMusic();


    window.location.href =
        "../numbers.html";

}


// ==========================================
// AFTER INITIAL LOADING
// ==========================================

function initializeAfterLoading() {

    loadPlayerName();


    currentQuestion = 0;


    score = 0;


    correctAnswers = 0;


    lives = MAX_LIVES;


    answered = false;


    gameEnded = false;


    gameOverState = false;


    updateHearts();


    startGameMusic();


    loadQuestion();

}


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showInitialLoading();

    }
);