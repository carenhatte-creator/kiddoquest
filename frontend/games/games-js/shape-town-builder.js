/* =========================================================
   KINDERQUEST
   SHAPE TOWN BUILDER
   FULL UPDATED VERSION
   PROGRESS SAVE FIX
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       SETTINGS
    ====================================================== */

    const MAX_LIVES = 3;
    const POINTS_PER_PART = 10;
    const LEVEL_BONUS = 20;

    const API_BASE = "http://localhost:5001/api";
    const SAVE_URL = API_BASE + "/progress/save";


    /* =====================================================
       SHAPES
    ====================================================== */

    const SHAPES = {

        triangle: {
            name: "Triangle",
            color: "#FF6F6F"
        },

        square: {
            name: "Square",
            color: "#FFC94A"
        },

        rectangle: {
            name: "Rectangle",
            color: "#58C88A"
        },

        circle: {
            name: "Circle",
            color: "#4FC3F7"
        }

    };


    /* =====================================================
       LEVELS
    ====================================================== */

    const LEVELS = [

        {
            name: "My House",
            emoji: "HOUSE",

            parts: [

                {
                    id: "house-roof",
                    type: "triangle",
                    points: "300,65 165,170 435,170"
                },

                {
                    id: "house-body",
                    type: "square",
                    x: 190,
                    y: 170,
                    width: 220,
                    height: 170
                },

                {
                    id: "house-door",
                    type: "rectangle",
                    x: 275,
                    y: 245,
                    width: 50,
                    height: 95
                },

                {
                    id: "house-window1",
                    type: "square",
                    x: 215,
                    y: 215,
                    width: 48,
                    height: 48
                },

                {
                    id: "house-window2",
                    type: "square",
                    x: 337,
                    y: 215,
                    width: 48,
                    height: 48
                }

            ]
        },


        {
            name: "Rocket",
            emoji: "ROCKET",

            parts: [

                {
                    id: "rocket-nose",
                    type: "triangle",
                    points: "300,45 245,120 355,120"
                },

                {
                    id: "rocket-body",
                    type: "rectangle",
                    x: 245,
                    y: 120,
                    width: 110,
                    height: 175
                },

                {
                    id: "rocket-window",
                    type: "circle",
                    cx: 300,
                    cy: 175,
                    r: 28
                },

                {
                    id: "rocket-fin1",
                    type: "triangle",
                    points: "245,250 195,310 245,295"
                },

                {
                    id: "rocket-fin2",
                    type: "triangle",
                    points: "355,250 405,310 355,295"
                }

            ]
        },


        {
            name: "Robot",
            emoji: "ROBOT",

            parts: [

                {
                    id: "robot-antenna",
                    type: "triangle",
                    points: "300,45 275,85 325,85"
                },

                {
                    id: "robot-head",
                    type: "square",
                    x: 215,
                    y: 85,
                    width: 170,
                    height: 105
                },

                {
                    id: "robot-eye1",
                    type: "circle",
                    cx: 260,
                    cy: 135,
                    r: 17
                },

                {
                    id: "robot-eye2",
                    type: "circle",
                    cx: 340,
                    cy: 135,
                    r: 17
                },

                {
                    id: "robot-body",
                    type: "rectangle",
                    x: 215,
                    y: 195,
                    width: 170,
                    height: 145
                },

                {
                    id: "robot-button",
                    type: "circle",
                    cx: 300,
                    cy: 250,
                    r: 24
                }

            ]
        },


        {
            name: "Happy Tree",
            emoji: "TREE",

            parts: [

                {
                    id: "tree-top",
                    type: "circle",
                    cx: 300,
                    cy: 130,
                    r: 90
                },

                {
                    id: "tree-trunk",
                    type: "rectangle",
                    x: 265,
                    y: 205,
                    width: 70,
                    height: 140
                },

                {
                    id: "tree-fruit1",
                    type: "circle",
                    cx: 250,
                    cy: 110,
                    r: 18
                },

                {
                    id: "tree-fruit2",
                    type: "circle",
                    cx: 345,
                    cy: 125,
                    r: 18
                },

                {
                    id: "tree-fruit3",
                    type: "circle",
                    cx: 300,
                    cy: 170,
                    r: 18
                }

            ]
        }

    ];


    /* =====================================================
       GAME STATE
    ====================================================== */

    let currentLevel = 0;
    let score = 0;
    let lives = MAX_LIVES;

    let selectedShape = null;
    let completedParts = {};

    let gameFinished = false;
    let levelLocked = false;

    let mistakes = 0;

    let progressAlreadySaved = false;


    /* =====================================================
       DOM
    ====================================================== */

    const gameScreen =
        document.getElementById("gameScreen");

    const loadingScreen =
        document.getElementById("loadingScreen");

    const loadingBarFill =
        document.getElementById("loadingBarFill");

    const townSvg =
        document.getElementById("townSvg");

    const shapeChoices =
        document.getElementById("shapeChoices");

    const playerNameElement =
        document.getElementById("playerName");

    const levelNumber =
        document.getElementById("levelNumber");

    const scoreElement =
        document.getElementById("score");

    const livesElement =
        document.getElementById("lives");

    const pictureName =
        document.getElementById("pictureName");

    const pictureEmoji =
        document.getElementById("pictureEmoji");

    const instructionTitle =
        document.getElementById("instructionTitle");

    const instructionText =
        document.getElementById("instructionText");

    const feedback =
        document.getElementById("feedback");

    const starReward =
        document.getElementById("starReward");

    const levelComplete =
        document.getElementById("levelComplete");

    const levelCompleteText =
        document.getElementById("levelCompleteText");

    const nextLevelButton =
        document.getElementById("nextLevelButton");

    const gameOver =
        document.getElementById("gameOver");

    const finalTitle =
        document.getElementById("finalTitle");

    const finalMessage =
        document.getElementById("finalMessage");

    const finalPlayer =
        document.getElementById("finalPlayer");

    const finalScore =
        document.getElementById("finalScore");

    const finalStars =
        document.querySelectorAll(".final-star");

    const playAgainButton =
        document.getElementById("playAgainButton");

    const backButton =
        document.getElementById("backButton");

    const finalBackButton =
        document.getElementById("finalBackButton");


    /* =====================================================
       SOUND
    ====================================================== */

    function playButtonSound() {

        try {

            if (
                window.soundManager &&
                typeof window.soundManager.playButton === "function"
            ) {

                window.soundManager.playButton();
                return;

            }

            if (
                typeof window.playButton === "function"
            ) {

                window.playButton();

            }

        } catch (error) {

            console.warn(
                "Button sound unavailable:",
                error
            );

        }

    }


    function playCorrectSound() {

        try {

            if (
                window.soundManager &&
                typeof window.soundManager.playCorrect === "function"
            ) {

                window.soundManager.playCorrect();
                return;

            }

            if (
                typeof window.playCorrect === "function"
            ) {

                window.playCorrect();

            }

        } catch (error) {

            console.warn(
                "Correct sound unavailable:",
                error
            );

        }

    }


    function playWrongSound() {

        try {

            if (
                window.soundManager &&
                typeof window.soundManager.playWrong === "function"
            ) {

                window.soundManager.playWrong();
                return;

            }

            if (
                typeof window.playWrong === "function"
            ) {

                window.playWrong();

            }

        } catch (error) {

            console.warn(
                "Wrong sound unavailable:",
                error
            );

        }

    }


    function startGameMusic() {

        try {

            if (
                window.soundManager &&
                typeof window.soundManager.startBackgroundMusic === "function"
            ) {

                window.soundManager.startBackgroundMusic();
                return;

            }

            if (
                typeof window.startBackgroundMusic === "function"
            ) {

                window.startBackgroundMusic();

            }

        } catch (error) {

            console.warn(
                "Background music unavailable:",
                error
            );

        }

    }


    /* =====================================================
       PLAYER
    ====================================================== */

    function getSelectedStudent() {

        const raw =
            localStorage.getItem("selectedStudent");

        if (!raw) {

            console.warn(
                "Shape Town Builder: selectedStudent not found."
            );

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

        } catch (error) {

            console.error(
                "Invalid selectedStudent:",
                error
            );

            return null;

        }

    }


    function getStudentName(student) {

        if (!student) {
            return "Player";
        }

        if (
            student.first_name &&
            student.last_name
        ) {

            return (
                student.first_name +
                " " +
                student.last_name
            );

        }

        if (
            student.firstName &&
            student.lastName
        ) {

            return (
                student.firstName +
                " " +
                student.lastName
            );

        }

        if (student.fullname) {

            return String(
                student.fullname
            );

        }

        if (student.fullName) {

            return String(
                student.fullName
            );

        }

        if (student.name) {

            return String(
                student.name
            );

        }

        return "Player";

    }


    function loadPlayerName() {

        const student =
            getSelectedStudent();

        const name =
            getStudentName(student);

        if (playerNameElement) {

            playerNameElement.textContent =
                name;

        }

        if (finalPlayer) {

            finalPlayer.textContent =
                name;

        }

    }


    /* =====================================================
       SVG PART CREATION
    ====================================================== */

    function createShapeMarkup(part) {

        if (part.type === "triangle") {

            return `
                <polygon
                    points="${part.points}"
                    class="build-part"
                    data-part-id="${part.id}"
                    data-shape-type="${part.type}"
                    fill="#ffffff">
                </polygon>
            `;

        }


        if (part.type === "circle") {

            return `
                <circle
                    cx="${part.cx}"
                    cy="${part.cy}"
                    r="${part.r}"
                    class="build-part"
                    data-part-id="${part.id}"
                    data-shape-type="${part.type}"
                    fill="#ffffff">
                </circle>
            `;

        }


        return `
            <rect
                x="${part.x}"
                y="${part.y}"
                width="${part.width}"
                height="${part.height}"
                rx="6"
                class="build-part"
                data-part-id="${part.id}"
                data-shape-type="${part.type}"
                fill="#ffffff">
            </rect>
        `;

    }


    /* =====================================================
       RENDER LEVEL
    ====================================================== */

    function renderLevel() {

        const level =
            LEVELS[currentLevel];

        completedParts = {};
        selectedShape = null;
        levelLocked = false;

        pictureName.textContent =
            level.name;

        pictureEmoji.textContent =
            level.emoji;

        levelNumber.textContent =
            currentLevel + 1;

        instructionTitle.textContent =
            "Build the " +
            level.name +
            "!";

        instructionText.textContent =
            "Choose a colored shape, then click the matching white part.";

        feedback.textContent =
            "Choose a shape to begin!";

        feedback.className =
            "feedback info";


        townSvg.innerHTML = "";

        townSvg.innerHTML += `
            <rect
                x="0"
                y="345"
                width="600"
                height="85"
                fill="#DDF3D9">
            </rect>
        `;


        level.parts.forEach(function (part) {

            townSvg.innerHTML +=
                createShapeMarkup(part);

        });


        attachPartEvents();
        renderShapeChoices();

    }


    /* =====================================================
       CHOICE SHAPE
    ====================================================== */

    function createChoiceShape(type) {

        const color =
            SHAPES[type].color;


        if (type === "triangle") {

            return `
                <svg viewBox="0 0 60 60">

                    <polygon
                        points="30,5 5,55 55,55"
                        fill="${color}"
                        stroke="#40495a"
                        stroke-width="4"
                        stroke-linejoin="round">
                    </polygon>

                </svg>
            `;

        }


        if (type === "circle") {

            return `
                <svg viewBox="0 0 60 60">

                    <circle
                        cx="30"
                        cy="30"
                        r="25"
                        fill="${color}"
                        stroke="#40495a"
                        stroke-width="4">
                    </circle>

                </svg>
            `;

        }


        if (type === "rectangle") {

            return `
                <svg viewBox="0 0 60 60">

                    <rect
                        x="6"
                        y="15"
                        width="48"
                        height="30"
                        rx="5"
                        fill="${color}"
                        stroke="#40495a"
                        stroke-width="4">
                    </rect>

                </svg>
            `;

        }


        return `
            <svg viewBox="0 0 60 60">

                <rect
                    x="6"
                    y="6"
                    width="48"
                    height="48"
                    rx="6"
                    fill="${color}"
                    stroke="#40495a"
                    stroke-width="4">
                </rect>

            </svg>
        `;

    }


    /* =====================================================
       SHAPE CHOICES
    ====================================================== */

    function renderShapeChoices() {

        shapeChoices.innerHTML = "";

        const needed = [];


        LEVELS[currentLevel].parts.forEach(
            function (part) {

                if (!needed.includes(part.type)) {

                    needed.push(
                        part.type
                    );

                }

            }
        );


        Object.keys(SHAPES).forEach(
            function (type) {

                if (!needed.includes(type)) {

                    needed.push(type);

                }

            }
        );


        shuffle(needed).forEach(
            function (type) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";

                button.className =
                    "shape-choice";

                button.dataset.shape =
                    type;

                button.innerHTML = `

                    <div class="shape-visual">
                        ${createChoiceShape(type)}
                    </div>

                    <span class="shape-label">
                        ${SHAPES[type].name}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    function () {

                        selectShape(
                            type,
                            button
                        );

                    }
                );


                shapeChoices.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       SELECT SHAPE
    ====================================================== */

    function selectShape(type, button) {

        if (
            gameFinished ||
            levelLocked
        ) {

            return;

        }


        playButtonSound();


        document
            .querySelectorAll(".shape-choice")
            .forEach(
                function (item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


        button.classList.add(
            "selected"
        );


        selectedShape =
            type;


        feedback.textContent =
            "Now click the matching white part!";

        feedback.className =
            "feedback info";

    }


    /* =====================================================
       PART EVENTS
    ====================================================== */

    function attachPartEvents() {

        const parts =
            townSvg.querySelectorAll(
                ".build-part"
            );


        parts.forEach(
            function (part) {

                part.addEventListener(
                    "click",
                    function () {

                        handlePartClick(
                            part
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       PART CLICK
    ====================================================== */

    function handlePartClick(part) {

        if (
            gameFinished ||
            levelLocked
        ) {

            return;

        }


        const partId =
            part.dataset.partId;


        if (
            completedParts[partId]
        ) {

            return;

        }


        if (!selectedShape) {

            feedback.textContent =
                "Choose a colored shape first!";

            feedback.className =
                "feedback info";

            return;

        }


        const correctShape =
            part.dataset.shapeType;


        if (
            selectedShape ===
            correctShape
        ) {

            handleCorrectPart(
                part
            );

        } else {

            handleWrongPart(
                part
            );

        }

    }


    /* =====================================================
       CORRECT
    ====================================================== */

    function handleCorrectPart(part) {

        const partId =
            part.dataset.partId;

        const shapeType =
            part.dataset.shapeType;

        const shape =
            SHAPES[shapeType];


        completedParts[partId] =
            true;


        part.setAttribute(
            "fill",
            shape.color
        );


        part.style.fill =
            shape.color;


        part.classList.add(
            "correct"
        );


        part.style.pointerEvents =
            "none";


        score +=
            POINTS_PER_PART;


        updateScore();


        selectedShape =
            null;


        document
            .querySelectorAll(
                ".shape-choice"
            )
            .forEach(
                function (button) {

                    button.classList.remove(
                        "selected"
                    );

                }
            );


        feedback.textContent =
            "Great job! The shape is correct!";

        feedback.className =
            "feedback correct";


        playCorrectSound();

        showStarReward();

        checkLevelComplete();

    }


    /* =====================================================
       WRONG
    ====================================================== */

    function handleWrongPart(part) {

        mistakes++;

        lives--;


        updateLives();


        part.classList.add(
            "wrong"
        );


        setTimeout(
            function () {

                part.classList.remove(
                    "wrong"
                );

            },
            450
        );


        feedback.textContent =
            "Oops! Try another shape!";

        feedback.className =
            "feedback wrong";


        playWrongSound();


        selectedShape =
            null;


        document
            .querySelectorAll(
                ".shape-choice"
            )
            .forEach(
                function (button) {

                    button.classList.remove(
                        "selected"
                    );

                }
            );


        if (lives <= 0) {

            levelLocked =
                true;


            setTimeout(
                function () {

                    finishGame(
                        false
                    );

                },
                700
            );

        }

    }


    /* =====================================================
       CHECK LEVEL
    ====================================================== */

    function checkLevelComplete() {

        const level =
            LEVELS[currentLevel];


        const complete =
            level.parts.every(
                function (part) {

                    return (
                        completedParts[
                            part.id
                        ] === true
                    );

                }
            );


        if (!complete) {

            return;

        }


        levelLocked =
            true;


        score +=
            LEVEL_BONUS;


        updateScore();


        setTimeout(
            function () {

                if (
                    currentLevel >=
                    LEVELS.length - 1
                ) {

                    finishGame(
                        true
                    );

                } else {

                    showLevelComplete();

                }

            },
            700
        );

    }


    /* =====================================================
       LEVEL COMPLETE
    ====================================================== */

    function showLevelComplete() {

        const level =
            LEVELS[currentLevel];


        levelCompleteText.textContent =
            "You built the " +
            level.name +
            "!";


        levelComplete.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       NEXT LEVEL
    ====================================================== */

    if (nextLevelButton) {

        nextLevelButton.addEventListener(
            "click",
            function () {

                playButtonSound();


                levelComplete.classList.add(
                    "hidden"
                );


                currentLevel++;


                renderLevel();


                feedback.textContent =
                    "Choose a shape to build!";

                feedback.className =
                    "feedback info";

            }
        );

    }


    /* =====================================================
       FINISH GAME
    ====================================================== */

    function finishGame(completedAll) {

        if (gameFinished) {

            return;

        }


        gameFinished =
            true;


        selectedShape =
            null;


        if (completedAll) {

            finalTitle.textContent =
                "Amazing!";

            finalMessage.textContent =
                "You built the whole Shape Town!";

        } else {

            finalTitle.textContent =
                "Good Try!";

            finalMessage.textContent =
                "Let's build Shape Town again!";

        }


        const student =
            getSelectedStudent();


        if (finalPlayer) {

            finalPlayer.textContent =
                getStudentName(
                    student
                );

        }


        if (finalScore) {

            finalScore.textContent =
                score;

        }


        const stars =
            calculateStars(
                completedAll
            );


        finalStars.forEach(
            function (star) {

                star.classList.remove(
                    "earned"
                );

            }
        );


        finalStars.forEach(
            function (star, index) {

                if (index < stars) {

                    setTimeout(
                        function () {

                            star.classList.add(
                                "earned"
                            );

                        },
                        index * 280
                    );

                }

            }
        );


        if (gameOver) {

            gameOver.classList.remove(
                "hidden"
            );

        }


        saveProgress(
            stars,
            completedAll
        );

    }


    /* =====================================================
       CALCULATE STARS
    ====================================================== */

    function calculateStars(completedAll) {

        if (!completedAll) {

            return 1;

        }


        if (mistakes === 0) {

            return 3;

        }


        if (mistakes <= 2) {

            return 2;

        }


        return 1;

    }


    /* =====================================================
       STAR REWARD
    ====================================================== */

    function showStarReward() {

        if (!starReward) {

            return;

        }


        starReward.classList.remove(
            "hidden"
        );


        clearTimeout(
            showStarReward.timer
        );


        showStarReward.timer =
            setTimeout(
                function () {

                    starReward.classList.add(
                        "hidden"
                    );

                },
                900
            );

    }


    /* =====================================================
       SCORE
    ====================================================== */

    function updateScore() {

        if (scoreElement) {

            scoreElement.textContent =
                score;

        }

    }


    /* =====================================================
       LIVES
    ====================================================== */

    function updateLives() {

        if (!livesElement) {

            return;

        }


        const lifeElements =
            livesElement.querySelectorAll(
                ".life"
            );


        lifeElements.forEach(
            function (life, index) {

                if (index < lives) {

                    life.classList.add(
                        "active"
                    );

                    life.classList.remove(
                        "lost"
                    );

                } else {

                    life.classList.remove(
                        "active"
                    );

                    life.classList.add(
                        "lost"
                    );

                }

            }
        );

    }


    /* =====================================================
       PLAY AGAIN
    ====================================================== */

    if (playAgainButton) {

        playAgainButton.addEventListener(
            "click",
            function () {

                playButtonSound();


                currentLevel =
                    0;


                score =
                    0;


                lives =
                    MAX_LIVES;


                selectedShape =
                    null;


                completedParts =
                    {};


                gameFinished =
                    false;


                levelLocked =
                    false;


                mistakes =
                    0;


                progressAlreadySaved =
                    false;


                if (gameOver) {

                    gameOver.classList.add(
                        "hidden"
                    );

                }


                if (levelComplete) {

                    levelComplete.classList.add(
                        "hidden"
                    );

                }


                finalStars.forEach(
                    function (star) {

                        star.classList.remove(
                            "earned"
                        );

                    }
                );


                updateScore();

                updateLives();

                renderLevel();


                feedback.textContent =
                    "Choose a shape to begin!";


                feedback.className =
                    "feedback info";

            }
        );

    }


    /* =====================================================
       BACK
    ====================================================== */

    function goBack() {

        playButtonSound();


        window.location.href =
            "../shapes.html";

    }


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    if (finalBackButton) {

        finalBackButton.addEventListener(
            "click",
            goBack
        );

    }


    /* =====================================================
       GET TEACHER
    ====================================================== */

    function getTeacherData() {

        const raw =
            localStorage.getItem(
                "teacher"
            );


        if (!raw) {

            console.error(
                "Shape Town Builder: teacher is missing from localStorage."
            );

            return null;

        }


        try {

            const teacher =
                JSON.parse(
                    raw
                );


            if (
                !teacher ||
                typeof teacher !== "object"
            ) {

                return null;

            }


            return teacher;

        } catch (error) {

            console.error(
                "Shape Town Builder: invalid teacher data.",
                error
            );

            return null;

        }

    }


    /* =====================================================
       GET STUDENT
    ====================================================== */

    function getStudentData() {

        const raw =
            localStorage.getItem(
                "selectedStudent"
            );


        if (!raw) {

            console.error(
                "Shape Town Builder: selectedStudent is missing."
            );

            return null;

        }


        try {

            const student =
                JSON.parse(
                    raw
                );


            if (
                !student ||
                typeof student !== "object"
            ) {

                return null;

            }


            return student;

        } catch (error) {

            console.error(
                "Shape Town Builder: invalid selectedStudent.",
                error
            );

            return null;

        }

    }


    /* =====================================================
       SAVE LOCAL BACKUP
    ====================================================== */

    function saveLocalProgress(
        teacherId,
        studentId,
        scoreToSave,
        stars
    ) {

        try {

            const key =
                "shapeTownBuilderProgress";


            const progress = {

                teacher_id:
                    teacherId,

                student_id:
                    studentId,

                category:
                    "shapes",

                activity:
                    "shape-town-builder",

                score:
                    scoreToSave,

                stars:
                    stars,

                completed:
                    true,

                saved_at:
                    new Date().toISOString()

            };


            localStorage.setItem(
                key,
                JSON.stringify(
                    progress
                )
            );


            console.log(
                "Shape Town Builder local backup saved:",
                progress
            );


        } catch (error) {

            console.error(
                "Local progress backup failed:",
                error
            );

        }

    }


    /* =====================================================
       SAVE PROGRESS
       IMPORTANT:
       POST /api/progress/save
    ====================================================== */

    async function saveProgress(
        stars,
        completedAll
    ) {

        if (progressAlreadySaved) {

            console.log(
                "Shape Town Builder: progress already saved."
            );

            return;

        }


        progressAlreadySaved =
            true;


        console.log(
            "======================================"
        );


        console.log(
            "SHAPE TOWN BUILDER - SAVE START"
        );


        const teacher =
            getTeacherData();


        const student =
            getStudentData();


        if (!teacher) {

            console.error(
                "SAVE FAILED: teacher data not found."
            );


            progressAlreadySaved =
                false;


            return;

        }


        if (!student) {

            console.error(
                "SAVE FAILED: selected student not found."
            );


            progressAlreadySaved =
                false;


            return;

        }


        const teacherId =
            teacher.id ??
            teacher.teacher_id;


        const studentId =
            student.id ??
            student.student_id;


        console.log(
            "Teacher:",
            teacher
        );


        console.log(
            "Student:",
            student
        );


        console.log(
            "Teacher ID:",
            teacherId
        );


        console.log(
            "Student ID:",
            studentId
        );


        if (
            teacherId === undefined ||
            teacherId === null ||
            studentId === undefined ||
            studentId === null
        ) {

            console.error(
                "SAVE FAILED: teacher_id or student_id is missing."
            );


            progressAlreadySaved =
                false;


            return;

        }


        /* 
         * SCORE RULE
         *
         * 3 stars = 100
         * 2 stars = 80
         * 1 star  = 60
         */

        let percentageScore =
            60;


        if (stars === 3) {

            percentageScore =
                100;

        } else if (stars === 2) {

            percentageScore =
                80;

        } else {

            percentageScore =
                60;

        }


        saveLocalProgress(
            teacherId,
            studentId,
            percentageScore,
            stars
        );


        const payload = {

            teacher_id:
                Number(teacherId),

            student_id:
                Number(studentId),

            category:
                "shapes",

            activity:
                "shape-town-builder",

            score:
                percentageScore,

            stars:
                Number(stars)

        };


        console.log(
            "SAVE URL:",
            SAVE_URL
        );


        console.log(
            "SAVE PAYLOAD:",
            payload
        );


        try {

            const response =
                await fetch(
                    SAVE_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            console.log(
                "SAVE HTTP STATUS:",
                response.status
            );


            const responseText =
                await response.text();


            console.log(
                "SAVE SERVER RESPONSE:",
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status +
                    ": " +
                    responseText
                );

            }


            let data = null;


            try {

                data =
                    JSON.parse(
                        responseText
                    );

            } catch (parseError) {

                data =
                    responseText;

            }


            console.log(
                "======================================"
            );


            console.log(
                "SHAPE TOWN BUILDER SAVED SUCCESSFULLY"
            );


            console.log(
                data
            );


            console.log(
                "======================================"
            );


            localStorage.setItem(
                "shapeTownBuilderLastSaved",
                JSON.stringify({

                    teacher_id:
                        teacherId,

                    student_id:
                        studentId,

                    category:
                        "shapes",

                    activity:
                        "shape-town-builder",

                    score:
                        percentageScore,

                    stars:
                        stars,

                    completed:
                        completedAll,

                    saved_at:
                        new Date().toISOString()

                })
            );


        } catch (error) {

            console.error(
                "======================================"
            );


            console.error(
                "SHAPE TOWN BUILDER SAVE ERROR"
            );


            console.error(
                error
            );


            console.error(
                "URL:",
                SAVE_URL
            );


            console.error(
                "Payload:",
                payload
            );


            console.error(
                "======================================"
            );


            progressAlreadySaved =
                false;


            if (feedback) {

                feedback.textContent =
                    "Game finished! Progress backup saved.";

                feedback.className =
                    "feedback info";

            }

        }

    }


    /* =====================================================
       SHUFFLE
    ====================================================== */

    function shuffle(array) {

        const result =
            array.slice();


        for (
            let i =
                result.length - 1;

            i > 0;

            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            const temp =
                result[i];


            result[i] =
                result[j];


            result[j] =
                temp;

        }


        return result;

    }


    /* =====================================================
       LOADING
       MEDIUM SPEED
    ====================================================== */

    function runLoading() {

        return new Promise(
            function (resolve) {

                if (
                    !loadingScreen ||
                    !loadingBarFill
                ) {

                    resolve();
                    return;

                }


                let progress = 0;


                loadingBarFill.style.width =
                    "0%";


                const interval =
                    setInterval(
                        function () {

                            progress += 10;


                            if (progress >= 100) {

                                progress = 100;


                                loadingBarFill.style.width =
                                    "100%";


                                clearInterval(
                                    interval
                                );


                                setTimeout(
                                    function () {

                                        loadingScreen.classList.add(
                                            "hide"
                                        );


                                        resolve();

                                    },
                                    300
                                );


                            } else {

                                loadingBarFill.style.width =
                                    progress + "%";

                            }

                        },
                        120
                    );

            }
        );

    }


    /* =====================================================
       START GAME
    ====================================================== */

    async function startGame() {

        await runLoading();


        loadPlayerName();


        updateScore();


        updateLives();


        renderLevel();


        startGameMusic();

    }


    /* =====================================================
       START
    ====================================================== */

    if (gameScreen) {

        startGame();

    }

})();