// ===================================
// LOADING BAR HANDLER
// ===================================

window.addEventListener("load", function () {

    const loader = document.getElementById("loadingScreen");
    const barFill = document.getElementById("loadingBarFill");

    if (!loader || !barFill) return;

    let progress = 0;

    const loadingInterval = setInterval(function () {

        progress += Math.floor(Math.random() * 5) + 2;

        if (progress >= 100) {

            progress = 100;

            clearInterval(loadingInterval);

            setTimeout(() => {

                loader.style.opacity = "0";

                setTimeout(() => {
                    loader.style.display = "none";
                }, 500);

            }, 400);

        }

        barFill.style.width = progress + "%";

    }, 100);

});


// ===================================
// KinderQuest - COLOR SORT
// ===================================

console.log("color-sort.js loaded");


// ===================================
// GAME SETTINGS
// ===================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";

const MAX_LIVES = 3;

const TOTAL_OBJECTS = 15;

const GAME_CATEGORY = "colors";

const GAME_ACTIVITY = "color-sort";


let score = 0;

let stars = 0;

let lives = MAX_LIVES;

let sortedObjects = 0;


// ===================================
// GAME STATE
// ===================================

let gameEnded = false;

let progressSaved = false;


// ===================================
// OBJECT DATA
// ===================================

const colorObjects = [

    {
        image: "strawberry-colored.png",
        color: "red"
    },

    {
        image: "carrot-colored.png",
        color: "orange"
    },

    {
        image: "leaf-colored.png",
        color: "green"
    },

    {
        image: "sunflower-colored.png",
        color: "yellow"
    },

    {
        image: "cucumber.png",
        color: "green"
    },

    {
        image: "chick.png",
        color: "yellow"
    },

    {
        image: "apple-colored.png",
        color: "red"
    },

    {
        image: "banana-colored.png",
        color: "yellow"
    },

    {
        image: "dolphine.png",
        color: "blue"
    },

    {
        image: "orange-colored.png",
        color: "orange"
    },

    {
        image: "frog-colored.png",
        color: "green"
    },

    {
        image: "pumpkin.png",
        color: "orange"
    },

    {
        image: "berries.png",
        color: "blue"
    },

    {
        image: "butterfly.png",
        color: "blue"
    },

    {
        image: "car.png",
        color: "red"
    }

];


// ===================================
// COLOR LIST
// ===================================

const colors = [

    "red",
    "yellow",
    "green",
    "blue",
    "orange"

];


// ===================================
// DOM ELEMENTS
// ===================================

let objectContainer;

let scoreElement;

let starsElement;

let sortedCountElement;

let livesContainer;

let progressBar;

let feedback;

let gameOverlay;

let finalScore;

let finalStars;

let playingStudentName;


// ===================================
// INITIALIZE GAME
// ===================================

document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);


function initializeGame() {

    objectContainer =
        document.getElementById("objectContainer");

    scoreElement =
        document.getElementById("score");

    starsElement =
        document.getElementById("stars");

    sortedCountElement =
        document.getElementById("sortedCount");

    livesContainer =
        document.getElementById("lives");

    progressBar =
        document.getElementById("progressBar");

    feedback =
        document.getElementById("feedback");

    gameOverlay =
        document.getElementById("gameOverlay");

    finalScore =
        document.getElementById("finalScore");

    finalStars =
        document.getElementById("finalStars");

    playingStudentName =
        document.getElementById("playingStudentName");


    if (!objectContainer) {

        console.error(
            "ERROR: #objectContainer was not found."
        );

        return;

    }


    displaySelectedStudent();

    createObjects();

    setupColorBoxes();

    updateAll();


    // ===================================
    // START BACKGROUND MUSIC
    // ===================================

    if (typeof startBackgroundMusic === "function") {

        startBackgroundMusic();

    }

}


// ===================================
// GET SELECTED STUDENT
// ===================================

function getSelectedStudent() {

    const raw =
        localStorage.getItem("selectedStudent");


    if (!raw) {

        return null;

    }


    try {

        const student =
            JSON.parse(raw);


        if (
            !student ||
            typeof student !== "object"
        ) {

            return null;

        }


        return student;

    }

    catch (error) {

        console.error(
            "Invalid selectedStudent data:",
            error
        );

        return null;

    }

}


// ===================================
// GET STUDENT ID
// ===================================

function getStudentId(student) {

    if (!student) return null;


    return (
        student.id ??
        student.student_id ??
        student.studentId ??
        null
    );

}


// ===================================
// GET TEACHER ID
// ===================================

function getTeacherId() {

    const possibleKeys = [

        "teacher",
        "currentTeacher",
        "loggedInTeacher",
        "teacherData"

    ];


    for (const key of possibleKeys) {

        const raw =
            localStorage.getItem(key);


        if (!raw) continue;


        try {

            const data =
                JSON.parse(raw);


            if (data && typeof data === "object") {

                const id =
                    data.id ??
                    data.teacher_id ??
                    data.teacherId;


                if (id !== undefined && id !== null) {

                    return id;

                }

            }

        }

        catch (error) {

            console.warn(
                "Could not read teacher data:",
                key
            );

        }

    }


    const directTeacherId =
        localStorage.getItem("teacher_id");


    if (directTeacherId) {

        return directTeacherId;

    }


    return null;

}


// ===================================
// GET STUDENT FULL NAME
// ===================================

function getStudentFullName(student) {

    if (!student) {

        return "Student";

    }


    if (
        student.first_name &&
        student.last_name
    ) {

        return (
            `${student.first_name} ${student.last_name}`
        );

    }


    if (
        student.firstName &&
        student.lastName
    ) {

        return (
            `${student.firstName} ${student.lastName}`
        );

    }


    if (student.fullname) {

        return String(student.fullname);

    }


    if (student.fullName) {

        return String(student.fullName);

    }


    if (student.name) {

        return String(student.name);

    }


    return "Student";

}


// ===================================
// DISPLAY SELECTED STUDENT
// ===================================

function displaySelectedStudent() {

    if (!playingStudentName) {

        return;

    }


    const student =
        getSelectedStudent();


    if (!student) {

        playingStudentName.textContent =
            "No student selected";

        return;

    }


    playingStudentName.textContent =
        getStudentFullName(student);

}


// ===================================
// CREATE OBJECTS
// ===================================

function createObjects() {

    objectContainer.innerHTML = "";


    colorObjects.forEach(
        (object, index) => {

            const item =
                document.createElement("div");


            item.className =
                "color-object";


            item.draggable = true;


            item.dataset.index =
                index;


            item.dataset.color =
                object.color;


            const image =
                document.createElement("img");


            image.src =
                "../../image/" +
                object.image;


            image.alt =
                object.color +
                " object";


            image.draggable = false;


            image.addEventListener(
                "error",
                function () {

                    console.error(
                        "Image not found: " +
                        image.src
                    );

                }
            );


            item.appendChild(image);


            item.addEventListener(
                "dragstart",
                handleDragStart
            );


            item.addEventListener(
                "dragend",
                handleDragEnd
            );


            objectContainer.appendChild(item);

        }
    );

}


// ===================================
// SETUP COLOR BOXES
// ===================================

function setupColorBoxes() {

    const boxes =
        document.querySelectorAll(".color-box");


    boxes.forEach(
        box => {

            box.addEventListener(
                "dragover",
                handleDragOver
            );


            box.addEventListener(
                "dragenter",
                handleDragEnter
            );


            box.addEventListener(
                "dragleave",
                handleDragLeave
            );


            box.addEventListener(
                "drop",
                handleDrop
            );

        }
    );

}


// ===================================
// DRAG START
// ===================================

function handleDragStart(event) {

    if (gameEnded) {

        event.preventDefault();

        return;

    }


    const item =
        event.currentTarget;


    if (
        item.classList.contains("sorted")
    ) {

        event.preventDefault();

        return;

    }


    event.dataTransfer.effectAllowed =
        "move";


    event.dataTransfer.setData(
        "text/plain",
        item.dataset.index
    );


    item.classList.add("dragging");


    if (typeof playClick === "function") {

        playClick();

    }

}


// ===================================
// DRAG END
// ===================================

function handleDragEnd(event) {

    event.currentTarget.classList.remove(
        "dragging"
    );

}


// ===================================
// DRAG OVER
// ===================================

function handleDragOver(event) {

    if (gameEnded) return;


    event.preventDefault();


    event.dataTransfer.dropEffect =
        "move";

}


// ===================================
// DRAG ENTER
// ===================================

function handleDragEnter(event) {

    if (gameEnded) return;


    event.preventDefault();


    const box =
        event.currentTarget;


    box.classList.add("drag-over");

}


// ===================================
// DRAG LEAVE
// ===================================

function handleDragLeave(event) {

    event.currentTarget.classList.remove(
        "drag-over"
    );

}


// ===================================
// DROP
// ===================================

function handleDrop(event) {

    event.preventDefault();


    if (gameEnded) return;


    const box =
        event.currentTarget;


    box.classList.remove(
        "drag-over"
    );


    const index =
        event.dataTransfer.getData(
            "text/plain"
        );


    if (index === "") {

        return;

    }


    const item =
        document.querySelector(
            `.color-object[data-index="${index}"]`
        );


    if (!item) {

        return;

    }


    if (
        item.classList.contains("sorted")
    ) {

        return;

    }


    const object =
        colorObjects[
            Number(index)
        ];


    if (!object) {

        return;

    }


    const targetColor =
        box.dataset.color;


    if (
        object.color === targetColor
    ) {

        handleCorrect(
            item,
            box
        );

    }

    else {

        handleWrong(item);

    }

}


// ===================================
// CORRECT ANSWER
// ===================================

function handleCorrect(item, box) {

    if (gameEnded) return;


    score += 10;

    stars += 1;

    sortedObjects += 1;


    // ===================================
    // ⭐ CORRECT SOUND
    // ===================================

    if (typeof playCorrect === "function") {

        playCorrect();

    }


    // ===================================
    // ⭐ STAR REWARD
    // ===================================

    showStarReward();


    // ===================================
    // MARK OBJECT AS SORTED
    // ===================================

    item.classList.add("sorted");

    item.draggable = false;


    item.removeEventListener(
        "dragstart",
        handleDragStart
    );


    item.removeEventListener(
        "dragend",
        handleDragEnd
    );


    // ===================================
    // MOVE OBJECT INTO BOX
    // ===================================

    box.appendChild(item);


    updateAll();


    // ===================================
    // CHECK COMPLETE
    // ===================================

    if (
        sortedObjects === TOTAL_OBJECTS
    ) {

        gameEnded = true;


        setTimeout(
            () => {

                finishGame(true);

            },
            900
        );

    }

}


// ===================================
// WRONG ANSWER
// ===================================

function handleWrong(item) {

    if (gameEnded) return;


    lives--;


    // ===================================
    // ❌ WRONG SOUND
    // ===================================

    if (typeof playWrong === "function") {

        playWrong();

    }


    item.classList.add("wrong");


    updateAll();


    setTimeout(
        () => {

            item.classList.remove("wrong");

        },
        450
    );


    // ===================================
    // GAME OVER
    // ===================================

    if (lives <= 0) {

        gameEnded = true;


        setTimeout(
            () => {

                finishGame(false);

            },
            800
        );

    }

}


// ===================================
// UPDATE EVERYTHING
// ===================================

function updateAll() {

    updateScore();

    updateStars();

    updateLives();

    updateProgress();

}


// ===================================
// UPDATE SCORE
// ===================================

function updateScore() {

    if (!scoreElement) return;


    scoreElement.textContent =
        score;

}


// ===================================
// UPDATE STARS
// ===================================

function updateStars() {

    if (!starsElement) return;


    starsElement.textContent =
        stars;

}


// ===================================
// UPDATE SORTED COUNT
// ===================================

function updateSortedCount() {

    if (!sortedCountElement) return;


    sortedCountElement.textContent =
        sortedObjects;

}


// ===================================
// UPDATE LIVES
// ===================================

function updateLives() {

    if (!livesContainer) return;


    const hearts =
        livesContainer.querySelectorAll(
            ".heart"
        );


    hearts.forEach(
        (heart, index) => {

            if (index < lives) {

                heart.classList.add("active");

            }

            else {

                heart.classList.remove("active");

            }

        }
    );

}


// ===================================
// UPDATE PROGRESS
// ===================================

function updateProgress() {

    if (!progressBar) return;


    const progress =
        (
            sortedObjects /
            TOTAL_OBJECTS
        ) * 100;


    progressBar.style.width =
        progress + "%";


    updateSortedCount();

}


// ===================================
// SHOW FEEDBACK
// ===================================

function showFeedback(message, type) {

    if (!feedback) return;


    feedback.textContent =
        message;


    feedback.className =
        "feedback show";


    feedback.classList.add(type);


    setTimeout(
        () => {

            feedback.classList.remove(
                "show"
            );

        },
        750
    );

}


// ===================================
// FINISH GAME
// ===================================
// completed = true
// kapag 15/15
//
// completed = false
// kapag naubos ang hearts
// ===================================

function finishGame(completed) {

    if (progressSaved) return;


    if (!gameOverlay) return;


    // ===================================
    // STOP GAME INPUT
    // ===================================

    gameEnded = true;


    // ===================================
    // STOP BACKGROUND MUSIC
    // ===================================

    if (typeof stopBackgroundMusic === "function") {

        stopBackgroundMusic();

    }


    // ===================================
    // SAVE PROGRESS
    // ===================================

    saveGameProgress();


    // ===================================
    // UPDATE RESULT CARD
    // ===================================

    if (completed) {

        const resultStars =
            gameOverlay.querySelector(
                ".result-stars"
            );


        const resultTitle =
            gameOverlay.querySelector(
                ".result-card h2"
            );


        const resultMessage =
            gameOverlay.querySelector(
                ".result-card p"
            );


        if (resultStars) {

            resultStars.textContent =
                stars > 0
                    ? "⭐ ⭐ ⭐"
                    : "⭐";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "Great Job! 🎉";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "You finished Color Sort!";

        }

    }

    else {

        // ===================================
        // GAME OVER CARD
        // ===================================

        const resultStars =
            gameOverlay.querySelector(
                ".result-stars"
            );


        const resultTitle =
            gameOverlay.querySelector(
                ".result-card h2"
            );


        const resultMessage =
            gameOverlay.querySelector(
                ".result-card p"
            );


        if (resultStars) {

            resultStars.textContent =
                "💔";

        }


        if (resultTitle) {

            resultTitle.textContent =
                "Game Over!";

        }


        if (resultMessage) {

            resultMessage.textContent =
                "You ran out of lives. Try again!";

        }

    }


    if (finalScore) {

        finalScore.textContent =
            score;

    }


    if (finalStars) {

        finalStars.textContent =
            stars;

    }


    // ===================================
    // CHANGE FIRST BUTTON TEXT
    // ===================================

    const buttons =
        gameOverlay.querySelectorAll(
            ".result-buttons button"
        );


    if (buttons.length > 0) {

        buttons[0].textContent =
            "🔄 Try Again";

    }


    if (buttons.length > 1) {

        buttons[1].textContent =
            "🎨 Color Games";

    }


    gameOverlay.classList.remove(
        "hidden"
    );

}


// ===================================
// SAVE GAME PROGRESS
// ===================================

async function saveGameProgress() {

    if (progressSaved) return;


    progressSaved = true;


    const student =
        getSelectedStudent();


    const studentId =
        getStudentId(student);


    const teacherId =
        getTeacherId();


    if (!studentId) {

        console.warn(
            "Progress not saved: no selected student ID."
        );

        return;

    }


    // ===================================
    // SCORE AS PERCENTAGE
    // ===================================

    const maxScore =
        TOTAL_OBJECTS * 10;


    const percentage =
        Math.round(
            (score / maxScore) * 100
        );


    // ===================================
    // LIMIT STARS
    // ===================================

    const savedStars =
        Math.min(
            stars,
            3
        );


    const progressData = {

        teacher_id: teacherId,

        student_id: studentId,

        category: GAME_CATEGORY,

        activity: GAME_ACTIVITY,

        score: percentage,

        stars: savedStars

    };


    console.log(
        "Saving Color Sort progress:",
        progressData
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


        if (!response.ok) {

            throw new Error(
                `Progress save failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Color Sort progress saved:",
            result
        );

    }

    catch (error) {

        console.error(
            "Error saving Color Sort progress:",
            error
        );

    }

}


// ===================================
// RESTART GAME
// ===================================

function restartGame() {

    if (typeof playButton === "function") {

        playButton();

    }


    window.location.reload();

}


// ===================================
// BACK TO COLOR GAMES
// ===================================

function backToColors() {

    if (typeof playButton === "function") {

        playButton();

    }


    if (typeof stopBackgroundMusic === "function") {

        stopBackgroundMusic();

    }


    window.location.href =
        "../colors.html";

}


// ===================================
// GLOBAL FUNCTIONS
// ===================================

window.restartGame =
    restartGame;


window.backToColors =
    backToColors;


// ==========================================
// ⭐ STAR REWARD
// ==========================================

function showStarReward() {

    const starReward =
        document.getElementById(
            "starReward"
        );


    if (!starReward) return;


    starReward.classList.remove(
        "hidden"
    );


    clearTimeout(
        showStarReward._t
    );


    showStarReward._t =
        setTimeout(
            () => {

                starReward.classList.add(
                    "hidden"
                );

            },
            1300
        );

}