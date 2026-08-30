// ==========================================================
// KINDERQUEST - COUNTING GAME
// FULL UPDATED VERSION
//
// INITIAL LOADING ONLY
// SAME STYLE ACROSS ALL KINDERQUEST GAMES
//
// NO LOADING BETWEEN QUESTIONS
// NO LOADING ON NEXT
// NO LOADING ON FINISH
// PLAY AGAIN RESTARTS DIRECTLY
// ==========================================================


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
// IMAGE PATH
// ==========================================================

const IMAGE_BASE_PATH = "../../image/";


// ==========================================================
// COUNTING OBJECT IMAGES
// ==========================================================

const OBJECT_IMAGES = [

    {
        name: "Carrot",
        file: "carrot-colored.png"
    },

    {
        name: "Pumpkin",
        file: "pumpkin.png"
    },

    {
        name: "Apple",
        file: "apple-colored.png"
    },

    {
        name: "Umbrella",
        file: "umbrella.png"
    },

    {
        name: "Watch",
        file: "watch.png"
    },

    {
        name: "Balloon",
        file: "balloon.png"
    },

    {
        name: "Orange",
        file: "orange-colored.png"
    },

    {
        name: "Egg",
        file: "egg (1).png"
    },

    {
        name: "Chicken",
        file: "chicken.png"
    },

    {
        name: "Duck",
        file: "duck.png"
    }

];


// ==========================================================
// SELECTED STUDENT
// ==========================================================

let selectedStudent = null;


function getSelectedStudent() {

    const raw =
        localStorage.getItem("selectedStudent");

    if (!raw) {
        return null;
    }

    try {

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "Selected student error:",
            error
        );

        return null;

    }

}


// ==========================================================
// STUDENT NAME
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
// LOADING ELEMENTS
// ==========================================================

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


const loadingBarFill =
    document.getElementById(
        "loadingBarFill"
    );


// ==========================================================
// INITIAL LOADING ONLY
// SAME STYLE ACROSS ALL KINDERQUEST GAMES
// ==========================================================

function showGameLoading() {

    if (
        !loadingScreen ||
        !loadingBarFill
    ) {

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

                            hideGameLoading();

                        },
                        250
                    );

                }

            },
            70
        );

}


// ==========================================================
// HIDE INITIAL LOADING
// ==========================================================

function hideGameLoading() {

    if (loadingScreen) {

        loadingScreen.classList.add(
            "hide"
        );

    }


    startGame();

}


// ==========================================================
// DOM ELEMENTS
// ==========================================================

const noStudentOverlay =
    document.getElementById(
        "noStudentOverlay"
    );


const playingStudentName =
    document.getElementById(
        "playingStudentName"
    );


const objectArea =
    document.getElementById(
        "objectArea"
    );


const countMessage =
    document.getElementById(
        "countMessage"
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


const choicesContainer =
    document.getElementById(
        "choices"
    );


const nextBtn =
    document.getElementById(
        "nextBtn"
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


const finalScoreText =
    document.getElementById(
        "finalScore"
    );


const finalStars =
    document.getElementById(
        "finalStars"
    );


const finishMessage =
    document.getElementById(
        "finishMessage"
    );


const playAgainBtn =
    document.getElementById(
        "playAgainBtn"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


const goStudentsBtn =
    document.getElementById(
        "goStudentsBtn"
    );


const finishBackLink =
    document.getElementById(
        "finishBackLink"
    );


const buttons = [

    document.getElementById("choice1"),

    document.getElementById("choice2"),

    document.getElementById("choice3"),

    document.getElementById("choice4")

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

function playGameClick() {

    try {

        if (
            window.soundManager &&
            typeof window.soundManager.playClick ===
            "function"
        ) {

            window.soundManager.playClick();

        }

    } catch (error) {

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

    } catch (error) {

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

    } catch (error) {

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

    } catch (error) {

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

    } catch (error) {

        console.log(
            "Music start error:",
            error
        );

    }

}


// ==========================================================
// PRELOAD IMAGES
// ==========================================================

function preloadImages() {

    OBJECT_IMAGES.forEach(
        (object) => {

            const image =
                new Image();

            image.src =
                getImageUrl(
                    object.file
                );

        }
    );

}


// ==========================================================
// IMAGE URL
// ==========================================================

function getImageUrl(fileName) {

    return (
        IMAGE_BASE_PATH +
        encodeURIComponent(fileName)
    );

}


// ==========================================================
// CREATE OBJECT IMAGE
// ==========================================================

function createObjectImage(
    object,
    index
) {

    const image =
        document.createElement("img");


    image.className =
        "count-object";


    image.alt =
        object.name;


    image.title =
        object.name;


    image.draggable =
        false;


    image.src =
        getImageUrl(
            object.file
        );


    image.dataset.index =
        index;


    image.addEventListener(
        "error",
        () => {

            console.error(
                "IMAGE NOT FOUND:",
                image.src
            );

            image.classList.add(
                "image-error"
            );

        }
    );


    image.addEventListener(
        "load",
        () => {

            image.classList.remove(
                "image-error"
            );

        }
    );


    return image;

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
// RANDOM INTEGER
// ==========================================================

function randomInt(
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
    correctAnswer
) {

    const choices =
        new Set();


    choices.add(
        correctAnswer
    );


    while (
        choices.size < 4
    ) {

        let wrongAnswer;


        const direction =
            Math.random() < 0.5
                ? -1
                : 1;


        wrongAnswer =
            correctAnswer +
            direction *
            randomInt(1, 4);


        if (
            wrongAnswer < 1
        ) {

            wrongAnswer =
                correctAnswer +
                randomInt(1, 4);

        }


        if (
            wrongAnswer !== correctAnswer &&
            wrongAnswer >= 1 &&
            wrongAnswer <= 12
        ) {

            choices.add(
                wrongAnswer
            );

        }

    }


    return shuffle(
        Array.from(choices)
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

        const object =
            OBJECT_IMAGES[i];


        let count;


        if (i < 3) {

            count =
                randomInt(2, 5);

        }

        else if (i < 7) {

            count =
                randomInt(3, 7);

        }

        else {

            count =
                randomInt(4, 10);

        }


        generated.push({

            object: object,

            count: count,

            choices:
                createChoices(count),

            answer: count

        });

    }


    return generated;

}


// ==========================================================
// UPDATE SCORE
// ==========================================================

function updateScore() {

    if (!scoreText) {

        return;

    }


    scoreText.textContent =
        score;

}


// ==========================================================
// UPDATE LIVES
// ==========================================================

function updateLives() {

    if (!livesText) {

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

    const completed =
        currentQuestion;


    const percentage =
        Math.round(
            (
                completed /
                TOTAL_QUESTIONS
            ) *
            100
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (progressText) {

        progressText.textContent =
            percentage + "%";

    }


    if (questionNumberText) {

        questionNumberText.textContent =
            `${Math.min(
                currentQuestion + 1,
                TOTAL_QUESTIONS
            )} / ${TOTAL_QUESTIONS}`;

    }

}


// ==========================================================
// RENDER OBJECTS
// ==========================================================

function renderObjects(
    question
) {

    if (!objectArea) {

        return;

    }


    objectArea.innerHTML =
        "";


    for (
        let i = 0;
        i < question.count;
        i++
    ) {

        const image =
            createObjectImage(
                question.object,
                i
            );


        objectArea.appendChild(
            image
        );

    }

}


// ==========================================================
// LIVE STAR REWARD
// ==========================================================

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
        objectArea ||
        document.body;


    const rect =
        target.getBoundingClientRect();


    star.style.left =
        (
            rect.left +
            rect.width / 2 -
            60
        ) + "px";


    star.style.top =
        (
            rect.top -
            10
        ) + "px";


    requestAnimationFrame(
        () => {

            star.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            star.remove();

        },
        1000
    );

}


// ==========================================================
// RESET CHOICE BUTTONS
// ==========================================================

function resetChoiceButtons() {

    buttons.forEach(
        (button) => {

            if (!button) {

                return;

            }


            button.disabled =
                false;


            button.classList.remove(
                "correct"
            );


            button.classList.remove(
                "wrong"
            );


            button.textContent =
                "";

        }
    );

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


    const question =
        questions[
            currentQuestion
        ];


    renderObjects(
        question
    );


    resetChoiceButtons();


    if (result) {

        result.textContent =
            "";

        result.className =
            "result";

    }


    if (countMessage) {

        countMessage.textContent =
            "Count carefully! 👀";

        countMessage.className =
            "count-message";

    }


    if (questionNumberText) {

        questionNumberText.textContent =
            `${currentQuestion + 1} / ${TOTAL_QUESTIONS}`;

    }


    const progress =
        Math.round(
            (
                currentQuestion /
                TOTAL_QUESTIONS
            ) *
            100
        );


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    if (progressText) {

        progressText.textContent =
            progress + "%";

    }


    if (nextBtn) {

        nextBtn.style.display =
            "none";

    }


    buttons.forEach(
        (button, index) => {

            if (!button) {

                return;

            }


            button.textContent =
                question.choices[index];


            button.disabled =
                false;


            button.onclick =
                () => {

                    checkAnswer(
                        button,
                        question.answer
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


    playGameClick();


    buttons.forEach(
        (btn) => {

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


    // ======================================================
    // CORRECT
    // ======================================================

    if (
        chosen === correctAnswer
    ) {

        button.classList.add(
            "correct"
        );


        score +=
            POINTS_PER_CORRECT;


        correctAnswers++;


        earnedStars++;


        playGameCorrect();


        showStarReward();


        if (result) {

            result.textContent =
                "🎉 Correct! Great job!";

            result.className =
                "result correct";

        }


        if (countMessage) {

            countMessage.textContent =
                `⭐ You counted ${correctAnswer} correctly!`;

            countMessage.className =
                "count-message correct";

        }


        updateScore();


        if (nextBtn) {

            nextBtn.style.display =
                "block";

        }

    }


    // ======================================================
    // WRONG
    // ======================================================

    else {

        button.classList.add(
            "wrong"
        );


        lives--;


        if (lives < 0) {

            lives = 0;

        }


        playGameWrong();


        updateLives();


        if (countMessage) {

            countMessage.textContent =
                `The correct answer is ${correctAnswer}.`;

            countMessage.className =
                "count-message wrong";

        }


        buttons.forEach(
            (btn) => {

                if (!btn) {

                    return;

                }


                const value =
                    parseInt(
                        btn.textContent,
                        10
                    );


                if (
                    value === correctAnswer
                ) {

                    btn.classList.add(
                        "correct"
                    );

                }

            }
        );


        if (
            lives <= 0
        ) {

            setTimeout(
                () => {

                    showGameOver();

                },
                750
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


            playGameButton();


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


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    if (progressText) {

        progressText.textContent =
            "100%";

    }


    const percentageScore =
        Math.round(
            (
                correctAnswers /
                TOTAL_QUESTIONS
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


    const percentageScore =
        Math.round(
            (
                correctAnswers /
                TOTAL_QUESTIONS
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
                "Keep practicing! You can do it!";

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
                "Great counting! You did a wonderful job!";

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
// DIRECT RESET
// ==========================================================

if (playAgainBtn) {

    playAgainBtn.addEventListener(
        "click",
        () => {

            playGameButton();


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
// BACK BUTTON SOUND
// ==========================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            playGameButton();

        }
    );

}


// ==========================================================
// STUDENTS BUTTON SOUND
// ==========================================================

if (goStudentsBtn) {

    goStudentsBtn.addEventListener(
        "click",
        () => {

            playGameButton();

        }
    );

}


// ==========================================================
// FINISH BACK SOUND
// ==========================================================

if (finishBackLink) {

    finishBackLink.addEventListener(
        "click",
        () => {

            playGameButton();

        }
    );

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
            "Counting progress not saved: missing teacher or student."
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
            "Counting progress data error:",
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
            "Counting progress not saved: missing IDs."
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
                                "counting-game",

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
            "COUNTING PROGRESS SAVED:",
            data
        );


        if (!response.ok) {

            console.error(
                "Counting progress save failed:",
                data
            );

        }

    }

    catch (error) {

        console.error(
            "Counting progress save error:",
            error
        );

    }

}


// ==========================================================
// START GAME
//
// IMPORTANT:
// NO LOADING HERE
// ==========================================================

function startGame() {

    selectedStudent =
        getSelectedStudent();


    // ======================================================
    // NO STUDENT
    // ======================================================

    if (!selectedStudent) {

        if (noStudentOverlay) {

            noStudentOverlay.classList.add(
                "show"
            );

        }

        return;

    }


    // ======================================================
    // STUDENT FOUND
    // ======================================================

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


    // ======================================================
    // RESET GAME
    // ======================================================

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

    loadQuestion();


    // ======================================================
    // BACKGROUND MUSIC
    // ======================================================

    startGameMusic();

}


// ==========================================================
// INITIALIZE
//
// LOADING HAPPENS HERE ONLY.
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        preloadImages();

        showGameLoading();

    }
);