// ==========================================================
// KINDERQUEST - SIMPLE ADDITION
// FULL UPDATED VERSION
//
// FEATURES:
// - 10 QUESTIONS
// - IMAGE-BASED QUESTIONS
// - 3 LIVES
// - ❤️❤️❤️ LIFE DISPLAY
// - SCORE
// - LIVE STAR REWARD
// - SHARED SOUND MANAGER
// - CORRECT SOUND
// - WRONG SOUND
// - BUTTON SOUND
// - BACKGROUND MUSIC
// - FINAL STARS
// - PLAY AGAIN
// - BACK
// - SELECTED STUDENT
// - BACKEND PROGRESS SAVE
// - NO PAGE RELOAD
//
// LOADING:
// - INITIAL LOADING ONLY
// - SAME STYLE ACROSS ALL KINDERQUEST GAMES
// - PROGRESS BAR FILLS BASED ON A SHORT LOAD SEQUENCE
// - "Loading Simple Addition..."
// - NO LOADING BETWEEN QUESTIONS
// - NO LOADING ON PLAY AGAIN
// ==========================================================


// ==========================================================
// API
// ==========================================================

const API_BASE =
    "http://localhost:5001/api";


// ==========================================================
// SETTINGS
// ==========================================================

const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;


// ==========================================================
// IMAGE PATH
// ==========================================================

const IMAGE_BASE_PATH =
    "../../image/";


// ==========================================================
// OBJECT IMAGES
// ==========================================================

const OBJECT_IMAGES = [

    "carrot-colored.png",
    "pumpkin.png",
    "apple-colored.png",
    "umbrella.png",
    "watch.png",
    "balloon.png",
    "orange-colored.png",
    "egg (1).png",
    "chicken.png",
    "duck.png"

];


// ==========================================================
// SELECTED STUDENT
// ==========================================================

let selectedStudent = null;


// ==========================================================
// GET SELECTED STUDENT
// ==========================================================

function getSelectedStudent() {

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
            "Selected student error:",
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
        "Student"
    );

}


// ==========================================================
// DOM ELEMENTS
// ==========================================================

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


const loadingBarFill =
    document.getElementById(
        "loadingBarFill"
    );


const noStudentOverlay =
    document.getElementById(
        "noStudentOverlay"
    );


const playingStudentName =
    document.getElementById(
        "playingStudentName"
    );


const groupA =
    document.getElementById(
        "groupA"
    );


const groupB =
    document.getElementById(
        "groupB"
    );


const result =
    document.getElementById(
        "result"
    );


const scoreText =
    document.getElementById(
        "score"
    );


const livesText =
    document.getElementById(
        "lives"
    );


const questionNumberText =
    document.getElementById(
        "questionNumber"
    );


const progressBar =
    document.getElementById(
        "progressFill"
    );


const progressText =
    document.getElementById(
        "progressText"
    );


const nextBtn =
    document.getElementById(
        "nextBtn"
    );


const choicesContainer =
    document.getElementById(
        "choices"
    );


const finishScreen =
    document.getElementById(
        "finishScreen"
    );


const finishEmoji =
    document.getElementById(
        "finishEmoji"
    );


const finishTitle =
    document.getElementById(
        "finishTitle"
    );


const finishMessage =
    document.getElementById(
        "finishMessage"
    );


const finalScoreText =
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


const buttons = [

    document.getElementById(
        "choice1"
    ),

    document.getElementById(
        "choice2"
    ),

    document.getElementById(
        "choice3"
    ),

    document.getElementById(
        "choice4"
    )

];


// ==========================================================
// GAME VARIABLES
// ==========================================================

let questions = [];

let currentQuestion = 0;

let score = 0;

let correctAnswers = 0;

let lives = MAX_LIVES;

let earnedStars = 0;

let answerLocked = false;

let gameFinished = false;

let gameOverState = false;


// ==========================================================
// SOUND MANAGER
// ==========================================================

function playGameButtonSound() {

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


function playGameClickSound() {

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


function playGameCorrectSound() {

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


function playGameWrongSound() {

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


// ==========================================================
// IMAGE HELPER
// ==========================================================

function createObjectImage(imageName) {

    const img =
        document.createElement(
            "img"
        );


    img.src =
        IMAGE_BASE_PATH +
        imageName;


    img.alt =
        "Counting object";


    img.className =
        "addition-object-image";


    img.draggable =
        false;


    img.onerror =
        function () {

            console.error(
                "Image could not be loaded:",
                IMAGE_BASE_PATH +
                imageName
            );


            this.style.display =
                "none";

        };


    return img;

}


// ==========================================================
// CREATE OBJECT GROUP
// ==========================================================

function renderObjectGroup(
    container,
    imageName,
    quantity
) {

    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const group =
        document.createElement(
            "div"
        );


    group.className =
        "image-object-group";


    for (
        let i = 0;
        i < quantity;
        i++
    ) {

        const img =
            createObjectImage(
                imageName
            );


        group.appendChild(
            img
        );

    }


    container.appendChild(
        group
    );

}


// ==========================================================
// LIVE STAR REWARD
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
            ".question-box"
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
            rect.top -
            15
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
        ] = [
            array[j],
            array[i]
        ];

    }


    return array;

}


// ==========================================================
// CREATE ANSWER CHOICES
// ==========================================================

function createChoices(correctSum) {

    const choicesSet =
        new Set();


    choicesSet.add(
        correctSum
    );


    while (
        choicesSet.size < 4
    ) {

        const offset =
            Math.floor(
                Math.random() * 7
            ) - 3;


        let distractor =
            correctSum +
            offset;


        if (
            distractor < 2
        ) {

            distractor = 2;

        }


        if (
            distractor > 12
        ) {

            distractor = 12;

        }


        if (
            distractor !== correctSum
        ) {

            choicesSet.add(
                distractor
            );

        }

    }


    return shuffle(
        Array.from(
            choicesSet
        )
    );

}


// ==========================================================
// GENERATE QUESTIONS
// ==========================================================

function generateQuestions() {

    const generated = [];


    for (
        let i = 0;
        i < TOTAL_QUESTIONS;
        i++
    ) {

        const addendA =
            Math.floor(
                Math.random() * 4
            ) + 1;


        const addendB =
            Math.floor(
                Math.random() * 4
            ) + 1;


        const correctSum =
            addendA +
            addendB;


        const imageName =
            OBJECT_IMAGES[
                i %
                OBJECT_IMAGES.length
            ];


        const choices =
            createChoices(
                correctSum
            );


        generated.push({

            addendA:
                addendA,

            addendB:
                addendB,

            answer:
                correctSum,

            image:
                imageName,

            choices:
                choices

        });

    }


    return generated;

}


// ==========================================================
// START GAME
// ==========================================================

function startGame() {

    selectedStudent =
        getSelectedStudent();


    if (!selectedStudent) {

        if (noStudentOverlay) {

            noStudentOverlay.classList.add(
                "show"
            );

        }

        return;

    }


    if (noStudentOverlay) {

        noStudentOverlay.classList.remove(
            "show"
        );

    }


    if (playingStudentName) {

        playingStudentName.textContent =
            getStudentName(
                selectedStudent
            );

    }


    questions =
        generateQuestions();


    currentQuestion =
        0;


    score =
        0;


    correctAnswers =
        0;


    lives =
        MAX_LIVES;


    earnedStars =
        0;


    answerLocked =
        false;


    gameFinished =
        false;


    gameOverState =
        false;


    if (finishScreen) {

        finishScreen.style.display =
            "none";

    }


    if (choicesContainer) {

        choicesContainer.style.display =
            "grid";

    }


    updateScore();

    updateLives();

    updateProgress();

    startGameMusic();

    loadQuestion();

}


// ==========================================================
// LOAD QUESTION
// ==========================================================

function loadQuestion() {

    if (
        gameFinished ||
        gameOverState
    ) {

        return;

    }


    if (
        currentQuestion >=
        questions.length
    ) {

        finishGame();

        return;

    }


    answerLocked =
        false;


    const q =
        questions[
            currentQuestion
        ];


    // ======================================
    // IMAGE QUESTIONS
    // ======================================

    renderObjectGroup(
        groupA,
        q.image,
        q.addendA
    );


    renderObjectGroup(
        groupB,
        q.image,
        q.addendB
    );


    // ======================================
    // RESULT
    // ======================================

    if (result) {

        result.textContent =
            "";


        result.className =
            "result";

    }


    // ======================================
    // QUESTION NUMBER
    // ======================================

    if (questionNumberText) {

        questionNumberText.textContent =
            `${currentQuestion + 1} / ${questions.length}`;

    }


    // ======================================
    // PROGRESS
    // ======================================

    updateProgress();


    // ======================================
    // NEXT BUTTON
    // ======================================

    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    // ======================================
    // ANSWER BUTTONS
    // ======================================

    buttons.forEach(
        (button, index) => {

            if (!button) {

                return;

            }


            button.textContent =
                q.choices[index];


            button.disabled =
                false;


            button.classList.remove(
                "correct"
            );


            button.classList.remove(
                "wrong"
            );


            button.onclick =
                () => {

                    playGameClickSound();


                    checkAnswer(
                        button,
                        q.answer
                    );

                };

        }
    );

}


// ==========================================================
// CHECK ANSWER
// ==========================================================

function checkAnswer(
    button,
    correctAnswer
) {

    if (
        answerLocked ||
        gameFinished ||
        gameOverState
    ) {

        return;

    }


    answerLocked =
        true;


    buttons.forEach(
        btn => {

            if (btn) {

                btn.disabled =
                    true;

            }

        }
    );


    const chosen =
        parseInt(
            button.textContent,
            10
        );


    // ======================================
    // CORRECT
    // ======================================

    if (
        chosen === correctAnswer
    ) {

        button.classList.add(
            "correct"
        );


        score +=
            10;


        correctAnswers++;


        earnedStars++;


        playGameCorrectSound();


        showStarReward();


        if (result) {

            result.textContent =
                "🎉 Correct! Great job!";


            result.className =
                "result correct";

        }


        updateScore();


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


        playGameWrongSound();


        updateLives();


        // Highlight correct answer

        buttons.forEach(
            btn => {

                if (!btn) {

                    return;

                }


                if (
                    parseInt(
                        btn.textContent,
                        10
                    ) === correctAnswer
                ) {

                    btn.classList.add(
                        "correct"
                    );

                }

            }
        );


        // ==================================
        // GAME OVER
        // ==================================

        if (lives <= 0) {

            lives =
                0;


            updateLives();


            setTimeout(
                () => {

                    showGameOver();

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


// ==========================================================
// NEXT BUTTON
// NO LOADING
// ==========================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            if (
                gameFinished ||
                gameOverState
            ) {

                return;

            }


            playGameButtonSound();


            currentQuestion++;


            loadQuestion();

        }
    );

}


// ==========================================================
// CALCULATE FINAL STARS
// ==========================================================

function calculateStars(
    percentage
) {

    if (
        percentage >= 80
    ) {

        return 3;

    }


    if (
        percentage >= 60
    ) {

        return 2;

    }


    if (
        percentage > 0
    ) {

        return 1;

    }


    return 0;

}


// ==========================================================
// DISPLAY FINAL STARS
// ==========================================================

function displayStars(
    stars
) {

    if (!finalStars) {

        return;

    }


    if (
        stars >= 3
    ) {

        finalStars.textContent =
            "★★★";

    }

    else if (
        stars === 2
    ) {

        finalStars.textContent =
            "★★";

    }

    else if (
        stars === 1
    ) {

        finalStars.textContent =
            "★";

    }

    else {

        finalStars.textContent =
            "—";

    }

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


    gameOverState =
        false;


    answerLocked =
        true;


    stopGameMusic();


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    if (progressText) {

        progressText.textContent =
            `${questions.length} / ${questions.length}`;

    }


    const percentageScore =
        Math.round(
            (
                correctAnswers /
                questions.length
            ) *
            100
        );


    const stars =
        calculateStars(
            percentageScore
        );


    showFinishCard(
        false,
        stars
    );


    saveProgress(
        percentageScore,
        stars
    );

}


// ==========================================================
// GAME OVER
// ==========================================================

function showGameOver() {

    if (
        gameOverState ||
        gameFinished
    ) {

        return;

    }


    gameOverState =
        true;


    answerLocked =
        true;


    stopGameMusic();


    const percentageScore =
        Math.round(
            (
                correctAnswers /
                questions.length
            ) *
            100
        );


    const stars =
        calculateStars(
            percentageScore
        );


    showFinishCard(
        true,
        stars
    );


    saveProgress(
        percentageScore,
        stars
    );

}


// ==========================================================
// SHOW FINISH CARD
// ==========================================================

function showFinishCard(
    isGameOver,
    stars
) {

    if (!finishScreen) {

        return;

    }


    if (finalScoreText) {

        finalScoreText.textContent =
            score;

    }


    displayStars(
        stars
    );


    if (isGameOver) {

        if (finishEmoji) {

            finishEmoji.textContent =
                "💪";

        }


        if (finishTitle) {

            finishTitle.textContent =
                "Game Over";

        }


        if (finishMessage) {

            finishMessage.textContent =
                "Keep practicing and try again!";

        }

    }

    else {

        if (finishEmoji) {

            finishEmoji.textContent =
                "🎉";

        }


        if (finishTitle) {

            finishTitle.textContent =
                "Congratulations!";

        }


        if (finishMessage) {

            finishMessage.textContent =
                "You completed the Simple Addition game!";

        }

    }


    if (choicesContainer) {

        choicesContainer.style.display =
            "none";

    }


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    finishScreen.style.display =
        "flex";

}


// ==========================================================
// PLAY AGAIN
// NO LOADING
// ==========================================================

if (playAgainBtn) {

    playAgainBtn.addEventListener(
        "click",
        () => {

            playGameButtonSound();


            if (finishScreen) {

                finishScreen.style.display =
                    "none";

            }


            if (choicesContainer) {

                choicesContainer.style.display =
                    "grid";

            }


            startGame();

        }
    );

}


// ==========================================================
// UPDATE SCORE
// ==========================================================

function updateScore() {

    if (scoreText) {

        scoreText.textContent =
            score;

    }

}


// ==========================================================
// UPDATE LIVES
// ==========================================================

function updateLives() {

    if (!livesText) {

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
                ? "❤️"
                : "♡";

    }


    livesText.textContent =
        hearts;

}


// ==========================================================
// UPDATE PROGRESS
// ==========================================================

function updateProgress() {

    if (progressBar) {

        const progress =
            (
                currentQuestion /
                TOTAL_QUESTIONS
            ) *
            100;


        progressBar.style.width =
            Math.min(
                progress,
                100
            ) +
            "%";

    }


    if (progressText) {

        progressText.textContent =
            `${currentQuestion} / ${TOTAL_QUESTIONS}`;

    }

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

        console.log(
            "Progress not saved: missing teacher or student."
        );

        return;

    }


    let teacher;

    let student;


    try {

        teacher =
            JSON.parse(
                teacherData
            );


        student =
            JSON.parse(
                studentData
            );

    }

    catch (error) {

        console.error(
            "Progress data error:",
            error
        );

        return;

    }


    if (
        !teacher ||
        !teacher.id ||
        !student ||
        !student.id
    ) {

        console.log(
            "Progress not saved: missing IDs."
        );

        return;

    }


    try {

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
                                "addition",

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
            "ADDITION PROGRESS SAVED:",
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


// ==========================================================
// BUTTON SOUND - BACK
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const backButton =
            document.querySelector(
                ".back-btn"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    playGameButtonSound();

                    stopGameMusic();

                }
            );

        }

    }
);


// ==========================================================
// INITIAL LOADING
//
// SAME STYLE ACROSS ALL KINDERQUEST GAMES:
// dark navy pill progress bar, filling with an
// animated yellow bar, "Loading Simple Addition..."
//
// INITIAL ENTRY ONLY
// NO LOADING BETWEEN QUESTIONS
// NO LOADING ON PLAY AGAIN
// ==========================================================

function runInitialLoading() {

    if (!loadingScreen || !loadingBarFill) {

        startGame();

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


                            startGame();

                        },
                        250
                    );

                }

            },
            70
        );

}


// ==========================================================
// DOM READY
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        selectedStudent =
            getSelectedStudent();


        // If no student, don't keep
        // the loading screen blocking
        // the student selection overlay.

        if (!selectedStudent) {

            if (loadingScreen) {

                loadingScreen.classList.add(
                    "hide"
                );

            }


            startGame();

            return;

        }


        runInitialLoading();

    }
);