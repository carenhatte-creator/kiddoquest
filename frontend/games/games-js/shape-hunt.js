// ==========================================================
// KinderQuest - SHAPE HUNT
// FULL CORRECTED VERSION
// Loading + Game + Progress Save
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================================
    // SETTINGS
    // ======================================================

    const MAX_LIVES = 3;
    const POINTS_PER_OBJECT = 10;
    const TOTAL_QUESTIONS = 9;

    const IMAGE_PATH = "../../image/";

    // IMPORTANT:
    // Do NOT put Markdown brackets here.
    const PROGRESS_API = "http://localhost:5001/api/progress/save";


    // ======================================================
    // ELEMENTS
    // ======================================================

    const objectArea = document.getElementById("objectArea");
    const scoreElement = document.getElementById("score");
    const livesElement = document.getElementById("lives");
    const levelElement = document.getElementById("level");

    const questionNumberElement =
        document.getElementById("questionNumber");

    const totalQuestionsElement =
        document.getElementById("totalQuestions");

    const shapeNameElement =
        document.getElementById("shapeName");

    const shapeIcon =
        document.getElementById("shapeIcon");

    const playingStudentName =
        document.getElementById("playingStudentName");

    const feedback =
        document.getElementById("feedback");

    const feedbackIcon =
        document.getElementById("feedbackIcon");

    const feedbackText =
        document.getElementById("feedbackText");

    const resultScreen =
        document.getElementById("resultScreen");

    const resultPlayer =
        document.getElementById("resultPlayer");

    const finalScore =
        document.getElementById("finalScore");

    const finalStars =
        document.getElementById("finalStars");

    const resultMessage =
        document.getElementById("resultMessage");

    const playAgainButton =
        document.getElementById("playAgainButton");

    const backButton =
        document.getElementById("backButton");

    const resultBackButton =
        document.getElementById("resultBackButton");

    const starAnimationLayer =
        document.getElementById("starAnimationLayer");


    // ======================================================
    // LOADING ELEMENTS
    // SAME STYLE ACROSS ALL KINDERQUEST GAMES
    // ======================================================

    const loadingScreen =
        document.getElementById("loadingScreen");

    const loadingBarFill =
        document.getElementById("loadingBarFill");


    // ======================================================
    // GAME OBJECTS
    // ======================================================

    const objects = {

        ball: {
            name: "Ball",
            image: IMAGE_PATH + "ball.png",
            shape: "circle"
        },

        balloon: {
            name: "Balloon",
            image: IMAGE_PATH + "balloon.png",
            shape: "circle"
        },

        clock: {
            name: "Clock",
            image: IMAGE_PATH + "clock.png",
            shape: "circle"
        },

        apple: {
            name: "Apple",
            image: IMAGE_PATH + "apple-colored.png",
            shape: "circle"
        },

        box: {
            name: "Box",
            image: IMAGE_PATH + "box.png",
            shape: "square"
        },

        wells: {
            name: "Dice",
            image: IMAGE_PATH + "dice.png",
            shape: "square"
        },

        window: {
            name: "Window",
            image: IMAGE_PATH + "window.png",
            shape: "square"
        },

        gift: {
            name: "Gift",
            image: IMAGE_PATH + "gift-box.png",
            shape: "square"
        },

        book: {
            name: "Book",
            image: IMAGE_PATH + "book.png",
            shape: "rectangle"
        },

        table: {
            name: "Table",
            image: IMAGE_PATH + "table.png",
            shape: "rectangle"
        },

        door: {
            name: "Door",
            image: IMAGE_PATH + "door.png",
            shape: "rectangle"
        },

        tv: {
            name: "TV",
            image: IMAGE_PATH + "tv.png",
            shape: "rectangle"
        },

        pizza: {
            name: "Pizza",
            image: IMAGE_PATH + "pizza.png",
            shape: "triangle"
        },

        flag: {
            name: "Flag",
            image: IMAGE_PATH + "flag.png",
            shape: "triangle"
        }

    };


    // ======================================================
    // QUESTIONS
    // ======================================================

    const questions = [

        {
            level: 1,
            shape: "circle",
            name: "CIRCLE",
            items: [
                "ball",
                "book",
                "balloon",
                "box",
                "clock",
                "window",
                "apple",
                "gift",
                "table",
                "door"
            ]
        },

        {
            level: 1,
            shape: "square",
            name: "SQUARE",
            items: [
                "box",
                "ball",
                "wells",
                "book",
                "window",
                "balloon",
                "gift",
                "clock",
                "door",
                "apple"
            ]
        },

        {
            level: 1,
            shape: "rectangle",
            name: "RECTANGLE",
            items: [
                "book",
                "balloon",
                "table",
                "box",
                "door",
                "ball",
                "tv",
                "window",
                "apple",
                "gift"
            ]
        },

        {
            level: 2,
            shape: "circle",
            name: "CIRCLE",
            items: [
                "clock",
                "book",
                "apple",
                "pizza",
                "balloon",
                "door",
                "ball",
                "table",
                "gift",
                "window"
            ]
        },

        {
            level: 2,
            shape: "square",
            name: "SQUARE",
            items: [
                "window",
                "pizza",
                "box",
                "ball",
                "wells",
                "table",
                "gift",
                "apple",
                "door",
                "balloon"
            ]
        },

        {
            level: 2,
            shape: "rectangle",
            name: "RECTANGLE",
            items: [
                "table",
                "ball",
                "book",
                "flag",
                "door",
                "balloon",
                "tv",
                "box",
                "clock",
                "gift"
            ]
        },

        {
            level: 3,
            shape: "triangle",
            name: "TRIANGLE",
            items: [
                "pizza",
                "ball",
                "flag",
                "book",
                "balloon",
                "box",
                "clock",
                "window",
                "apple",
                "door"
            ]
        },

        {
            level: 3,
            shape: "circle",
            name: "CIRCLE",
            items: [
                "apple",
                "flag",
                "balloon",
                "table",
                "clock",
                "pizza",
                "ball",
                "book",
                "gift",
                "door"
            ]
        },

        {
            level: 3,
            shape: "square",
            name: "SQUARE",
            items: [
                "gift",
                "pizza",
                "box",
                "apple",
                "wells",
                "balloon",
                "window",
                "book",
                "door",
                "clock"
            ]
        }

    ];


    // ======================================================
    // GAME VARIABLES
    // ======================================================

    let currentQuestion = 0;
    let score = 0;
    let lives = MAX_LIVES;

    let foundObjects = 0;
    let totalCorrectObjects = 0;

    let locked = false;
    let musicStarted = false;
    let progressSaved = false;


    // ======================================================
    // SOUND
    // ======================================================

    function playSound(type) {

        try {

            if (!window.soundManager) {
                return;
            }

            if (
                type === "click" &&
                typeof window.soundManager.playClick === "function"
            ) {
                window.soundManager.playClick();
                return;
            }

            if (
                type === "button" &&
                typeof window.soundManager.playButton === "function"
            ) {
                window.soundManager.playButton();
                return;
            }

            if (
                type === "correct" &&
                typeof window.soundManager.playCorrect === "function"
            ) {
                window.soundManager.playCorrect();
                return;
            }

            if (
                type === "wrong" &&
                typeof window.soundManager.playWrong === "function"
            ) {
                window.soundManager.playWrong();
                return;
            }

        } catch (error) {

            console.error(
                "Shape Hunt sound error:",
                error
            );

        }

    }


    // ======================================================
    // BACKGROUND MUSIC
    // ======================================================

    function startGameBackgroundMusic() {

        try {

            if (
                window.soundManager &&
                typeof window.soundManager.startBackgroundMusic ===
                "function"
            ) {

                window.soundManager.startBackgroundMusic();

                musicStarted = true;
            }

        } catch (error) {

            console.error(
                "Shape Hunt music error:",
                error
            );

        }

    }


    function stopGameBackgroundMusic() {

        try {

            if (
                window.soundManager &&
                typeof window.soundManager.stopBackgroundMusic ===
                "function"
            ) {

                window.soundManager.stopBackgroundMusic();

                musicStarted = false;
            }

        } catch (error) {

            console.error(
                "Shape Hunt stop music error:",
                error
            );

        }

    }


    function activateAudio() {

        if (!musicStarted) {
            startGameBackgroundMusic();
        }

    }


    // ======================================================
    // GET STUDENT
    // ======================================================

    function getStudent() {

        const possibleKeys = [
            "selectedStudent",
            "currentStudent",
            "playingStudent"
        ];

        for (let i = 0; i < possibleKeys.length; i++) {

            const raw =
                localStorage.getItem(possibleKeys[i]);

            if (!raw) {
                continue;
            }

            try {

                const student = JSON.parse(raw);

                if (student) {
                    return student;
                }

            } catch (error) {

                console.error(
                    "Student data error:",
                    error
                );

            }

        }

        return null;
    }


    // ======================================================
    // STUDENT NAME
    // ======================================================

    function getStudentName() {

        const student = getStudent();

        if (!student) {
            return "Student";
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

        if (student.fullName) {
            return student.fullName;
        }

        if (student.name) {
            return student.name;
        }

        return "Student";
    }


    // ======================================================
    // STUDENT ID
    // ======================================================

    function getStudentId() {

        const student = getStudent();

        if (!student) {
            return null;
        }

        return (
            student.id ??
            student.student_id ??
            student.studentId ??
            student.studentID ??
            null
        );
    }


    // ======================================================
    // GET TEACHER
    // ======================================================

    function getTeacher() {

        try {

            const raw =
                localStorage.getItem("teacher");

            if (!raw) {
                return null;
            }

            return JSON.parse(raw);

        } catch (error) {

            console.error(
                "Teacher data error:",
                error
            );

            return null;
        }

    }


    // ======================================================
    // TEACHER ID
    // ======================================================

    function getTeacherId() {

        const teacher = getTeacher();

        if (!teacher) {
            return null;
        }

        return (
            teacher.id ??
            teacher.teacher_id ??
            teacher.teacherId ??
            teacher.teacherID ??
            null
        );
    }


    // ======================================================
    // DISPLAY STUDENT
    // ======================================================

    function displayStudentName() {

        const name = getStudentName();

        if (playingStudentName) {
            playingStudentName.textContent = name;
        }

        if (resultPlayer) {
            resultPlayer.textContent = name;
        }

    }


    // ======================================================
    // UPDATE STATUS
    // ======================================================

    function updateStatus() {

        if (scoreElement) {
            scoreElement.textContent = score;
        }

        if (livesElement) {

            livesElement.textContent =
                "❤️".repeat(Math.max(0, lives)) +
                "🤍".repeat(
                    Math.max(0, MAX_LIVES - lives)
                );

        }

        if (
            levelElement &&
            questions[currentQuestion]
        ) {

            levelElement.textContent =
                questions[currentQuestion].level;

        }

        if (questionNumberElement) {

            questionNumberElement.textContent =
                Math.min(
                    currentQuestion + 1,
                    TOTAL_QUESTIONS
                );

        }

        if (totalQuestionsElement) {
            totalQuestionsElement.textContent =
                TOTAL_QUESTIONS;
        }

    }


    // ======================================================
    // TARGET SHAPE
    // ======================================================

    function updateTargetShape(question) {

        if (shapeNameElement) {
            shapeNameElement.textContent =
                question.name;
        }

        if (!shapeIcon) {
            return;
        }

        shapeIcon.className = "";

        shapeIcon.classList.add(
            "target-" + question.shape
        );

    }


    // ======================================================
    // OBJECT POSITIONS
    // ======================================================

    const positions = [

        { left: 8, top: 18 },
        { left: 21, top: 43 },
        { left: 35, top: 20 },
        { left: 49, top: 48 },
        { left: 63, top: 20 },
        { left: 77, top: 45 },
        { left: 91, top: 18 },
        { left: 14, top: 72 },
        { left: 34, top: 70 },
        { left: 54, top: 72 }

    ];


    // ======================================================
    // LOAD QUESTION
    // ======================================================

    function loadQuestion() {

        if (currentQuestion >= TOTAL_QUESTIONS) {
            finishGame();
            return;
        }

        locked = false;
        foundObjects = 0;

        const question =
            questions[currentQuestion];

        if (!question) {
            return;
        }

        if (objectArea) {
            objectArea.innerHTML = "";
        }

        updateStatus();
        updateTargetShape(question);

        totalCorrectObjects =
            question.items.filter(function (key) {

                return (
                    objects[key] &&
                    objects[key].shape === question.shape
                );

            }).length;


        question.items.forEach(function (key, index) {

            createObject(
                key,
                positions[index % positions.length],
                question
            );

        });

    }


    // ======================================================
    // CREATE OBJECT
    // ======================================================

    function createObject(
        objectKey,
        position,
        question
    ) {

        const data = objects[objectKey];

        if (!data || !objectArea) {
            return;
        }

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "hunt-object";

        button.style.left =
            position.left + "%";

        button.style.top =
            position.top + "%";

        button.setAttribute(
            "aria-label",
            data.name
        );


        const img =
            document.createElement("img");

        img.src = data.image;
        img.alt = data.name;
        img.draggable = false;

        img.onerror = function () {

            console.error(
                "SHAPE HUNT IMAGE NOT FOUND:",
                data.image
            );

        };


        button.appendChild(img);


        button.addEventListener(
            "click",
            function () {

                if (locked) {
                    return;
                }

                if (
                    button.classList.contains("found")
                ) {
                    return;
                }

                activateAudio();

                playSound("click");


                if (
                    data.shape === question.shape
                ) {

                    correctObject(
                        button,
                        data
                    );

                } else {

                    wrongObject(
                        button,
                        question
                    );

                }

            }
        );


        objectArea.appendChild(button);

    }


    // ======================================================
    // CORRECT OBJECT
    // ======================================================

    function correctObject(
        button,
        data
    ) {

        button.classList.add("found");

        foundObjects++;

        score += POINTS_PER_OBJECT;

        updateStatus();

        playSound("correct");

        createStarAnimation(button);

        showFeedback(
            "⭐",
            "Great! You found the " +
            data.name +
            "!"
        );


        if (
            foundObjects >=
            totalCorrectObjects
        ) {

            locked = true;

            setTimeout(function () {

                createLevelStars();

            }, 200);


            setTimeout(function () {

                hideFeedback();

                currentQuestion++;

                if (
                    currentQuestion >=
                    TOTAL_QUESTIONS
                ) {

                    finishGame();

                } else {

                    loadQuestion();

                }

            }, 1400);

        }

    }


    // ======================================================
    // WRONG OBJECT
    // ======================================================

    function wrongObject(
        button,
        question
    ) {

        lives--;

        updateStatus();

        button.classList.add("wrong");

        playSound("wrong");

        showFeedback(
            "❌",
            "Try again! Find the " +
            question.name
        );


        setTimeout(function () {

            button.classList.remove("wrong");

            hideFeedback();

        }, 700);


        if (lives <= 0) {

            locked = true;

            setTimeout(function () {

                finishGame();

            }, 600);

        }

    }


    // ======================================================
    // STAR ANIMATION
    // ======================================================

    function createStarAnimation(button) {

        if (!starAnimationLayer) {
            return;
        }

        const rect =
            button.getBoundingClientRect();

        const star =
            document.createElement("div");

        star.className = "flying-star";

        star.textContent = "⭐";

        star.style.left =
            (
                rect.left +
                rect.width / 2
            ) + "px";

        star.style.top =
            (
                rect.top +
                rect.height / 2
            ) + "px";


        starAnimationLayer.appendChild(star);


        setTimeout(function () {

            star.remove();

        }, 900);

    }


    // ======================================================
    // LEVEL STAR ANIMATION
    // ======================================================

    function createLevelStars() {

        if (!starAnimationLayer) {
            return;
        }

        const stars = [

            {
                x: "-180px",
                y: "-100px"
            },

            {
                x: "-90px",
                y: "-170px"
            },

            {
                x: "0px",
                y: "-200px"
            },

            {
                x: "90px",
                y: "-170px"
            },

            {
                x: "180px",
                y: "-100px"
            }

        ];


        stars.forEach(function (item, index) {

            const star =
                document.createElement("div");

            star.className = "flying-star";

            star.textContent = "⭐";

            star.style.left = "50%";
            star.style.top = "55%";

            star.style.setProperty(
                "--x",
                item.x
            );

            star.style.setProperty(
                "--y",
                item.y
            );

            star.style.animationDelay =
                (index * 0.08) + "s";


            starAnimationLayer.appendChild(star);


            setTimeout(function () {

                star.remove();

            }, 1200);

        });

    }


    // ======================================================
    // FEEDBACK
    // ======================================================

    function showFeedback(
        icon,
        message
    ) {

        if (!feedback) {
            return;
        }

        if (feedbackIcon) {
            feedbackIcon.textContent = icon;
        }

        if (feedbackText) {
            feedbackText.textContent = message;
        }

        feedback.classList.add("show");

    }


    function hideFeedback() {

        if (!feedback) {
            return;
        }

        feedback.classList.remove("show");

    }


    // ======================================================
    // STAR CALCULATION
    // ======================================================

    function calculateStars() {

        if (score >= 180) {
            return 3;
        }

        if (score >= 100) {
            return 2;
        }

        if (score > 0) {
            return 1;
        }

        return 0;

    }


    // ======================================================
    // TOTAL POSSIBLE SCORE
    // ======================================================

    function calculateTotalPossibleScore() {

        let total = 0;

        questions.forEach(function (question) {

            const correctCount =
                question.items.filter(function (key) {

                    return (
                        objects[key] &&
                        objects[key].shape ===
                        question.shape
                    );

                }).length;

            total +=
                correctCount *
                POINTS_PER_OBJECT;

        });

        return total;

    }


    // ======================================================
    // PROGRESS PERCENT
    // ======================================================

    function calculateProgressPercent() {

        const totalPossibleScore =
            calculateTotalPossibleScore();

        if (totalPossibleScore <= 0) {
            return 0;
        }

        const percentage =
            (score / totalPossibleScore) * 100;

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(percentage)
            )
        );

    }


    // ======================================================
    // PROGRESS STATUS
    // ======================================================

    function getProgressStatus(progressPercent) {

        if (
            currentQuestion >=
            TOTAL_QUESTIONS
        ) {

            return "Completed";

        }

        if (progressPercent >= 50) {
            return "In Progress";
        }

        if (progressPercent > 0) {
            return "Needs Practice";
        }

        return "Not Started";

    }


    // ======================================================
    // SAVE LOCAL PROGRESS
    // ======================================================

    function saveLocalProgress(progress) {

        try {

            localStorage.setItem(
                "shapeHuntProgress",
                JSON.stringify(progress)
            );

            localStorage.setItem(
                "kq_shape_hunt_progress",
                JSON.stringify(progress)
            );

            return true;

        } catch (error) {

            console.error(
                "Shape Hunt local save error:",
                error
            );

            return false;

        }

    }


    // ======================================================
    // SAVE PROGRESS
    // ======================================================

    async function saveProgress() {

        const student =
            getStudent();

        const teacher =
            getTeacher();

        const studentId =
            getStudentId();

        const teacherId =
            getTeacherId();

        const playerName =
            getStudentName();

        const stars =
            calculateStars();

        const progressPercent =
            calculateProgressPercent();

        const status =
            getProgressStatus(progressPercent);


        // Determine last played level safely
        let savedLevel = 1;

        if (currentQuestion > 0) {

            const lastIndex =
                Math.min(
                    currentQuestion - 1,
                    TOTAL_QUESTIONS - 1
                );

            savedLevel =
                questions[lastIndex]?.level || 1;

        }


        if (currentQuestion >= TOTAL_QUESTIONS) {
            savedLevel = 3;
        }


        // ==================================================
        // PROGRESS OBJECT
        // ==================================================

        const progress = {

            teacher_id: teacherId,

            student_id: studentId,

            category: "shapes",

            activity: "Shape Hunt",

            game: "shape-hunt",

            game_name: "Shape Hunt",

            // Percentage used by Progress page
            score: progressPercent,

            // Original game score
            raw_score: score,

            stars: stars,

            status: status,

            player: playerName,

            student_name: playerName,

            level: savedLevel,

            date: new Date().toISOString(),

            created_at: new Date().toISOString()

        };


        console.log(
            "Shape Hunt progress:",
            progress
        );


        // ==================================================
        // ALWAYS SAVE LOCAL BACKUP FIRST
        // ==================================================

        saveLocalProgress(progress);


        // ==================================================
        // CHECK IDS
        // ==================================================

        if (!studentId) {

            console.error(
                "Shape Hunt: Student ID not found.",
                student
            );

            return false;

        }


        if (!teacherId) {

            console.error(
                "Shape Hunt: Teacher ID not found.",
                teacher
            );

            return false;

        }


        // ==================================================
        // BACKEND SAVE
        // ==================================================

        try {

            const response =
                await fetch(
                    PROGRESS_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(progress)
                    }
                );


            const responseText =
                await response.text();


            let result = null;


            if (responseText) {

                try {

                    result =
                        JSON.parse(responseText);

                } catch (error) {

                    console.warn(
                        "Backend returned non-JSON:",
                        responseText
                    );

                }

            }


            if (!response.ok) {

                console.error(
                    "Shape Hunt progress save failed:",
                    response.status,
                    responseText
                );

                return false;

            }


            progressSaved = true;


            console.log(
                "Shape Hunt progress saved successfully:",
                result
            );


            return true;

        } catch (error) {

            console.error(
                "Shape Hunt backend connection error:",
                error
            );

            /*
             * LocalStorage already contains the progress.
             * Therefore the result screen can still appear.
             */

            return false;

        }

    }


    // ======================================================
    // FINISH GAME
    // ======================================================

    async function finishGame() {

        if (progressSaved) {

            /*
             * Prevent duplicate save when finishGame()
             * is accidentally triggered twice.
             */

        }

        locked = true;

        hideFeedback();

        stopGameBackgroundMusic();


        const stars =
            calculateStars();


        // ==================================================
        // FINAL SCORE
        // ==================================================

        if (finalScore) {

            finalScore.textContent =
                score;

        }


        // ==================================================
        // PLAYER NAME
        // ==================================================

        if (resultPlayer) {

            resultPlayer.textContent =
                getStudentName();

        }


        // ==================================================
        // FINAL STARS
        // ==================================================

        if (finalStars) {

            if (stars === 3) {

                finalStars.textContent =
                    "⭐⭐⭐";

            } else if (stars === 2) {

                finalStars.textContent =
                    "⭐⭐☆";

            } else if (stars === 1) {

                finalStars.textContent =
                    "⭐☆☆";

            } else {

                finalStars.textContent =
                    "☆☆☆";

            }

        }


        // ==================================================
        // RESULT MESSAGE
        // ==================================================

        if (resultMessage) {

            if (stars === 3) {

                resultMessage.textContent =
                    "Amazing! You are a Shape Hunter!";

            } else if (stars === 2) {

                resultMessage.textContent =
                    "Great job! Keep practicing!";

            } else if (stars === 1) {

                resultMessage.textContent =
                    "Good try! Keep learning!";

            } else {

                resultMessage.textContent =
                    "Keep trying! You can do it!";

            }

        }


        // ==================================================
        // SAVE BEFORE RESULT SCREEN
        // ==================================================

        await saveProgress();


        // ==================================================
        // SHOW RESULT
        // ==================================================

        if (resultScreen) {

            resultScreen.style.display = "flex";

        }


        // ==================================================
        // FINISH SOUND
        // ==================================================

        if (stars > 0) {

            playSound("correct");

        } else {

            playSound("wrong");

        }

    }


    // ======================================================
    // PLAY AGAIN
    // ======================================================

    if (playAgainButton) {

        playAgainButton.addEventListener(
            "click",
            function () {

                playSound("button");

                if (resultScreen) {
                    resultScreen.style.display = "none";
                }

                currentQuestion = 0;
                score = 0;
                lives = MAX_LIVES;

                foundObjects = 0;
                totalCorrectObjects = 0;

                locked = false;
                progressSaved = false;

                displayStudentName();

                updateStatus();

                loadQuestion();

                startGameBackgroundMusic();

            }
        );

    }


    // ======================================================
    // BACK
    // ======================================================

    function goBack() {

        playSound("button");

        stopGameBackgroundMusic();

        window.location.href =
            "../shapes.html";

    }


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    if (resultBackButton) {

        resultBackButton.addEventListener(
            "click",
            goBack
        );

    }


    // ======================================================
    // FIRST USER INTERACTION
    // ======================================================

    document.addEventListener(
        "pointerdown",
        function firstShapeHuntInteraction() {

            startGameBackgroundMusic();

        },
        {
            once: true
        }
    );


    // ======================================================
    // INITIAL LOADING
    // SAME STYLE ACROSS ALL KINDERQUEST GAMES
    // ======================================================

    function startAfterLoading() {

        displayStudentName();

        updateStatus();

        loadQuestion();

    }


    function runInitialLoading() {

        if (
            !loadingScreen ||
            !loadingBarFill
        ) {

            startAfterLoading();

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


                                startAfterLoading();

                            },
                            250
                        );

                    }

                },
                70
            );

    }


    // ======================================================
    // INITIALIZE
    // ======================================================

    runInitialLoading();

});