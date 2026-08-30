// ==========================================================
// KINDERQUEST - COLOR MATCH
// FULL UPDATED VERSION
//
// EXISTING MECHANICS PRESERVED
//
// FEATURES:
// - 10 QUESTIONS
// - 3 LIVES
// - SCORE
// - STAR REWARD
// - LOADING BAR
// - SHARED SOUND MANAGER
// - CLICK SOUND
// - CORRECT SOUND
// - WRONG SOUND
// - BUTTON SOUND
// - BACKGROUND MUSIC
// - FINAL STARS
// - PLAY AGAIN
// - SELECTED STUDENT
// - BACKEND PROGRESS SAVE
// - GAME OVER WHEN LIVES = 0
// - GAME OVER SAVE PROGRESS
// ==========================================================


// ==========================================================
// LOADING BAR HANDLER
// ==========================================================

window.addEventListener("load", function () {

    const loader =
        document.getElementById("loadingScreen");

    const barFill =
        document.getElementById("loadingBarFill");

    if (!loader || !barFill) {
        return;
    }

    let progress = 0;

    const loadingInterval =
        setInterval(function () {

            progress +=
                Math.floor(Math.random() * 5) + 2;

            if (progress >= 100) {

                progress = 100;

                clearInterval(loadingInterval);

                setTimeout(function () {

                    loader.style.opacity = "0";

                    setTimeout(function () {

                        loader.style.display = "none";

                    }, 500);

                }, 400);
            }

            barFill.style.width =
                progress + "%";

        }, 100);

});


// ==========================================================
// KINDERQUEST - COLOR MATCH
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ======================================================
        // GAME SETTINGS
        // ======================================================

        const TOTAL_QUESTIONS = 10;

        const MAX_LIVES = 3;

        // IMPORTANT:
        // Correct API URL
        const API_BASE = "https://kiddoquest-backend.onrender.com/api";


        // ======================================================
        // GAME DATA
        // ======================================================

        const questions = [

            {
                name: "Banana",
                image: "banana.png",
                coloredImage: "banana-colored.png",
                color: "yellow",
                colorName: "Yellow"
            },

            {
                name: "Orange",
                image: "orange.png",
                coloredImage: "orange-colored.png",
                color: "orange",
                colorName: "Orange"
            },

            {
                name: "Grapes",
                image: "grapes.png",
                coloredImage: "grapes-colored.png",
                color: "purple",
                colorName: "Purple"
            },

            {
                name: "Carrot",
                image: "carrot.png",
                coloredImage: "carrot-colored.png",
                color: "orange",
                colorName: "Orange"
            },

            {
                name: "Sunflower",
                image: "sunflower.png",
                coloredImage: "sunflower-colored.png",
                color: "yellow",
                colorName: "Yellow"
            },

            {
                name: "Strawberry",
                image: "strawberry.png",
                coloredImage: "strawberry-colored.png",
                color: "red",
                colorName: "Red"
            },

            {
                name: "Apple",
                image: "apple...png",
                coloredImage: "apple-colored.png",
                color: "red",
                colorName: "Red"
            },

            {
                name: "Frog",
                image: "frog.png",
                coloredImage: "frog-colored.png",
                color: "green",
                colorName: "Green"
            },

            {
                name: "Leaf",
                image: "leaf.png",
                coloredImage: "leaf-colored.png",
                color: "green",
                colorName: "Green"
            },

            {
                name: "Sun",
                image: "sun.png",
                coloredImage: "sun-colored.png",
                color: "yellow",
                colorName: "Yellow"
            }

        ];


        // ======================================================
        // GAME VARIABLES
        // ======================================================

        let currentQuestion = 0;

        let score = 0;

        let lives = MAX_LIVES;

        let selectedColor = null;

        let answered = false;

        let gameOver = false;


        // ======================================================
        // SOUND MANAGER
        // ======================================================

        function playClickSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playClick === "function"
            ) {

                window.soundManager.playClick();

            }

        }


        function playButtonSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playButton === "function"
            ) {

                window.soundManager.playButton();

            }

        }


        function playCorrectSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playCorrect === "function"
            ) {

                window.soundManager.playCorrect();

            }

        }


        function playWrongSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playWrong === "function"
            ) {

                window.soundManager.playWrong();

            }

        }


        function startBackgroundMusic() {

            if (
                window.soundManager &&
                typeof window.soundManager.startBackgroundMusic === "function"
            ) {

                window.soundManager.startBackgroundMusic();

            }

        }


        function stopBackgroundMusic() {

            if (
                window.soundManager &&
                typeof window.soundManager.stopBackgroundMusic === "function"
            ) {

                window.soundManager.stopBackgroundMusic();

            }

        }


        // ======================================================
        // HTML ELEMENTS
        // ======================================================

        const scoreElement =
            document.getElementById("score");

        const questionNumberElement =
            document.getElementById("questionNumber");

        const livesElement =
            document.getElementById("lives");

        const progressBar =
            document.getElementById("progressBar");

        const questionText =
            document.getElementById("questionText");

        const instructionText =
            document.getElementById("instructionText");

        const objectArea =
            document.getElementById("objectArea");

        const colorChoices =
            document.getElementById("colorChoices");

        const feedback =
            document.getElementById("feedback");

        const nextButton =
            document.getElementById("nextButton");

        const resultScreen =
            document.getElementById("resultScreen");

        const finalScore =
            document.getElementById("finalScore");

        const finalStars =
            document.getElementById("finalStars");

        const playAgainButton =
            document.getElementById("playAgainButton");

        const playingStudentName =
            document.getElementById("playingStudentName");

        const noStudentOverlay =
            document.getElementById("noStudentOverlay");

        const starReward =
            document.getElementById("starReward");


        // ======================================================
        // CHECK REQUIRED ELEMENTS
        // ======================================================

        if (
            !scoreElement ||
            !questionNumberElement ||
            !livesElement ||
            !progressBar ||
            !questionText ||
            !instructionText ||
            !objectArea ||
            !colorChoices ||
            !feedback ||
            !nextButton ||
            !resultScreen ||
            !finalScore ||
            !finalStars ||
            !playAgainButton ||
            !playingStudentName
        ) {

            console.error(
                "Color Match: Missing required HTML element."
            );

            return;

        }


        // ======================================================
        // GET SELECTED STUDENT
        // ======================================================

        function getSelectedStudent() {

            const raw =
                localStorage.getItem(
                    "selectedStudent"
                );

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


        // ======================================================
        // GET STUDENT FULL NAME
        // ======================================================

        function getStudentFullName(student) {

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


        // ======================================================
        // DISPLAY STUDENT
        // ======================================================

        function displaySelectedStudent() {

            const student =
                getSelectedStudent();

            if (!student) {

                playingStudentName.textContent =
                    "No student selected";

                if (noStudentOverlay) {

                    noStudentOverlay.classList.remove(
                        "hidden"
                    );

                }

                return false;

            }

            playingStudentName.textContent =
                getStudentFullName(student);

            if (noStudentOverlay) {

                noStudentOverlay.classList.add(
                    "hidden"
                );

            }

            console.log(
                "Color Match - Selected Student:",
                student
            );

            return true;

        }


        // ======================================================
        // COLOR DATA
        // ======================================================

        const colors = [

            {
                name: "red",
                label: "Red",
                value: "#EF5350"
            },

            {
                name: "yellow",
                label: "Yellow",
                value: "#FFD54F"
            },

            {
                name: "green",
                label: "Green",
                value: "#66BB6A"
            },

            {
                name: "blue",
                label: "Blue",
                value: "#42A5F5"
            },

            {
                name: "orange",
                label: "Orange",
                value: "#FF9800"
            },

            {
                name: "purple",
                label: "Purple",
                value: "#AB47BC"
            }

        ];


        // ======================================================
        // SHOW STAR REWARD
        // ======================================================

        function showStarReward() {

            if (!starReward) {
                return;
            }

            starReward.classList.remove(
                "hidden"
            );

            clearTimeout(
                showStarReward._timer
            );

            showStarReward._timer =
                setTimeout(function () {

                    starReward.classList.add(
                        "hidden"
                    );

                }, 1000);

        }


        // ======================================================
        // LOAD QUESTION
        // ======================================================

        function loadQuestion() {

            if (gameOver) {
                return;
            }

            answered = false;

            selectedColor = null;

            const question =
                questions[currentQuestion];

            questionNumberElement.textContent =
                `${currentQuestion + 1} / ${TOTAL_QUESTIONS}`;

            questionText.textContent =
                `What is the color of the ${question.name}?`;

            instructionText.textContent =
                "Choose a color, then click the object.";

            feedback.textContent = "";

            feedback.className =
                "feedback";

            nextButton.classList.add(
                "hidden"
            );

            const progress =
                (
                    currentQuestion /
                    TOTAL_QUESTIONS
                ) * 100;

            progressBar.style.width =
                `${progress}%`;

            createObject(question);

            createColorChoices();

            updateScore();

            updateLives();

        }


        // ======================================================
        // CREATE OBJECT
        // ======================================================

        function createObject(question) {

            objectArea.innerHTML = "";

            const objectButton =
                document.createElement("button");

            objectButton.type =
                "button";

            objectButton.className =
                "object-button";

            const image =
                document.createElement("img");

            image.src =
                `../../image/${question.image}`;

            image.alt =
                question.name;

            image.draggable =
                false;

            image.onerror =
                function () {

                    console.error(
                        "Image not found:",
                        image.src
                    );

                };

            objectButton.appendChild(
                image
            );

            objectArea.appendChild(
                objectButton
            );


            objectButton.addEventListener(
                "click",
                function () {

                    playClickSound();

                    checkAnswer(
                        objectButton,
                        image,
                        question
                    );

                }
            );

        }


        // ======================================================
        // CREATE COLOR CHOICES
        // ======================================================

        function createColorChoices() {

            colorChoices.innerHTML =
                "";

            colors.forEach(
                function (color) {

                    const button =
                        document.createElement("button");

                    button.type =
                        "button";

                    button.className =
                        "color-choice";

                    button.dataset.color =
                        color.name;

                    button.style.backgroundColor =
                        color.value;

                    button.setAttribute(
                        "aria-label",
                        color.label
                    );

                    const label =
                        document.createElement("span");

                    label.textContent =
                        color.label;

                    button.appendChild(
                        label
                    );


                    button.addEventListener(
                        "click",
                        function () {

                            playClickSound();

                            selectColor(
                                color.name,
                                button
                            );

                        }
                    );

                    colorChoices.appendChild(
                        button
                    );

                }
            );

        }


        // ======================================================
        // SELECT COLOR
        // ======================================================

        function selectColor(
            color,
            button
        ) {

            if (answered || gameOver) {
                return;
            }

            selectedColor =
                color;

            const allButtons =
                document.querySelectorAll(
                    ".color-choice"
                );

            allButtons.forEach(
                function (item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );

            button.classList.add(
                "selected"
            );

            feedback.textContent =
                "🎨 Now click the object!";

            feedback.className =
                "feedback instruction";

        }


        // ======================================================
        // CHECK ANSWER
        // ======================================================

        function checkAnswer(
            objectButton,
            image,
            question
        ) {

            if (answered || gameOver) {
                return;
            }

            if (!selectedColor) {

                playWrongSound();

                feedback.textContent =
                    "🎨 Choose a color first!";

                feedback.className =
                    "feedback warning";

                return;

            }


            // ==================================================
            // CORRECT ANSWER
            // ==================================================

            if (
                selectedColor ===
                question.color
            ) {

                answered = true;

                score++;

                playCorrectSound();

                showStarReward();

                image.src =
                    `../../image/${question.coloredImage}`;

                image.style.filter =
                    "none";

                objectButton.classList.add(
                    "correct-object"
                );

                feedback.textContent =
                    "🎉 Great job!";

                feedback.className =
                    "feedback correct";

                updateScore();

                disableColors();

                setTimeout(
                    function () {

                        showNextButton();

                    },
                    1000
                );

            }


            // ==================================================
            // WRONG ANSWER
            // ==================================================

            else {

                lives--;

                playWrongSound();

                updateLives();

                objectButton.classList.add(
                    "shake"
                );

                setTimeout(
                    function () {

                        objectButton.classList.remove(
                            "shake"
                        );

                    },
                    400
                );


                // ==================================================
                // GAME OVER
                // ==================================================

                if (lives <= 0) {

                    answered = true;

                    gameOver = true;

                    disableColors();

                    nextButton.classList.add(
                        "hidden"
                    );

                    feedback.textContent =
                        "💛 Game Over!";

                    feedback.className =
                        "feedback wrong";

                    image.src =
                        `../../image/${question.coloredImage}`;

                    progressBar.style.width =
                        (
                            (
                                currentQuestion
                            ) /
                            TOTAL_QUESTIONS
                        ) * 100 + "%";


                    // IMPORTANT:
                    // Save score immediately when
                    // all hearts are gone.

                    const gameOverStars =
                        calculateStars();

                    const gameOverPercentage =
                        Math.round(
                            (
                                score /
                                TOTAL_QUESTIONS
                            ) * 100
                        );


                    saveProgress(
                        gameOverPercentage,
                        gameOverStars
                    );


                    setTimeout(
                        function () {

                            showGameOver();

                        },
                        700
                    );

                }

            }

        }


        // ======================================================
        // DISABLE COLORS
        // ======================================================

        function disableColors() {

            const buttons =
                document.querySelectorAll(
                    ".color-choice"
                );

            buttons.forEach(
                function (button) {

                    button.disabled =
                        true;

                }
            );

        }


        // ======================================================
        // SHOW NEXT BUTTON
        // ======================================================

        function showNextButton() {

            if (gameOver) {
                return;
            }

            if (
                currentQuestion <
                TOTAL_QUESTIONS - 1
            ) {

                nextButton.textContent =
                    "Next →";

            }

            else {

                nextButton.textContent =
                    "Finish 🏆";

            }

            nextButton.classList.remove(
                "hidden"
            );

        }


        // ======================================================
        // NEXT QUESTION
        // ======================================================

        nextButton.addEventListener(
            "click",
            function () {

                if (gameOver) {
                    return;
                }

                playButtonSound();

                currentQuestion++;

                if (
                    currentQuestion >=
                    TOTAL_QUESTIONS
                ) {

                    showResult();

                    return;

                }

                loadQuestion();

            }
        );


        // ======================================================
        // UPDATE SCORE
        // ======================================================

        function updateScore() {

            scoreElement.textContent =
                score;

        }


        // ======================================================
        // UPDATE LIVES
        // ======================================================

        function updateLives() {

            let hearts = "";

            for (
                let i = 0;
                i < MAX_LIVES;
                i++
            ) {

                if (i < lives) {

                    hearts += "❤️";

                }

                else {

                    hearts += "🖤";

                }

            }

            livesElement.textContent =
                hearts;

        }


        // ======================================================
        // CALCULATE STARS
        // ======================================================

        function calculateStars() {

            if (score >= 9) {
                return 3;
            }

            if (score >= 6) {
                return 2;
            }

            return 1;

        }


        // ======================================================
        // CREATE GAME OVER SCREEN
        // ======================================================

        function createGameOverScreen() {

            let existing =
                document.getElementById(
                    "colorMatchGameOver"
                );

            if (existing) {
                return existing;
            }


            const overlay =
                document.createElement("div");

            overlay.id =
                "colorMatchGameOver";

            overlay.style.position =
                "fixed";

            overlay.style.inset =
                "0";

            overlay.style.zIndex =
                "99999";

            overlay.style.display =
                "flex";

            overlay.style.alignItems =
                "center";

            overlay.style.justifyContent =
                "center";

            overlay.style.padding =
                "20px";

            overlay.style.background =
                "rgba(0, 0, 0, 0.55)";


            const card =
                document.createElement("div");

            card.style.width =
                "min(440px, 92vw)";

            card.style.background =
                "#ffffff";

            card.style.borderRadius =
                "28px";

            card.style.padding =
                "32px 24px";

            card.style.textAlign =
                "center";

            card.style.boxShadow =
                "0 15px 40px rgba(0,0,0,0.25)";

            card.style.fontFamily =
                '"Fredoka", sans-serif';


            const icon =
                document.createElement("div");

            icon.textContent =
                "💔";

            icon.style.fontSize =
                "64px";

            icon.style.marginBottom =
                "8px";


            const title =
                document.createElement("h2");

            title.textContent =
                "Game Over!";

            title.style.margin =
                "0 0 8px";

            title.style.fontSize =
                "36px";

            title.style.fontWeight =
                "700";

            title.style.color =
                "#1b3640";


            const message =
                document.createElement("p");

            message.textContent =
                "You ran out of hearts. Try again!";

            message.style.margin =
                "0 0 18px";

            message.style.fontSize =
                "20px";

            message.style.color =
                "#555";


            const scoreText =
                document.createElement("div");

            scoreText.id =
                "gameOverScore";

            scoreText.style.fontSize =
                "24px";

            scoreText.style.fontWeight =
                "700";

            scoreText.style.marginBottom =
                "22px";

            scoreText.style.color =
                "#1b3640";


            const tryAgain =
                document.createElement("button");

            tryAgain.type =
                "button";

            tryAgain.textContent =
                "🔄 Try Again";

            tryAgain.style.display =
                "block";

            tryAgain.style.width =
                "100%";

            tryAgain.style.padding =
                "14px 20px";

            tryAgain.style.marginBottom =
                "12px";

            tryAgain.style.border =
                "none";

            tryAgain.style.borderRadius =
                "16px";

            tryAgain.style.background =
                "#42A5F5";

            tryAgain.style.color =
                "#ffffff";

            tryAgain.style.fontFamily =
                '"Fredoka", sans-serif';

            tryAgain.style.fontSize =
                "20px";

            tryAgain.style.fontWeight =
                "700";

            tryAgain.style.cursor =
                "pointer";


            const back =
                document.createElement("button");

            back.type =
                "button";

            back.textContent =
                "🎨 Back";

            back.style.display =
                "block";

            back.style.width =
                "100%";

            back.style.padding =
                "14px 20px";

            back.style.border =
                "none";

            back.style.borderRadius =
                "16px";

            back.style.background =
                "#eeeeee";

            back.style.color =
                "#1b3640";

            back.style.fontFamily =
                '"Fredoka", sans-serif';

            back.style.fontSize =
                "20px";

            back.style.fontWeight =
                "700";

            back.style.cursor =
                "pointer";


            tryAgain.addEventListener(
                "click",
                function () {

                    playButtonSound();

                    overlay.remove();

                    currentQuestion = 0;

                    score = 0;

                    lives = MAX_LIVES;

                    selectedColor = null;

                    answered = false;

                    gameOver = false;

                    resultScreen.classList.add(
                        "hidden"
                    );

                    if (starReward) {

                        starReward.classList.add(
                            "hidden"
                        );

                    }

                    displaySelectedStudent();

                    updateScore();

                    updateLives();

                    startBackgroundMusic();

                    loadQuestion();

                }
            );


            back.addEventListener(
                "click",
                function () {

                    playButtonSound();

                    stopBackgroundMusic();

                    window.location.href =
                        "../colors.html";

                }
            );


            card.appendChild(icon);

            card.appendChild(title);

            card.appendChild(message);

            card.appendChild(scoreText);

            card.appendChild(tryAgain);

            card.appendChild(back);

            overlay.appendChild(card);

            document.body.appendChild(overlay);

            return overlay;

        }


        // ======================================================
        // SHOW GAME OVER
        // ======================================================

        function showGameOver() {

            const overlay =
                createGameOverScreen();

            const scoreDisplay =
                overlay.querySelector(
                    "#gameOverScore"
                );

            if (scoreDisplay) {

                scoreDisplay.textContent =
                    `Score: ${score} / ${TOTAL_QUESTIONS}`;

            }

            stopBackgroundMusic();

        }


        // ======================================================
        // SHOW RESULT
        // ======================================================

        async function showResult() {

            if (gameOver) {
                return;
            }

            progressBar.style.width =
                "100%";

            stopBackgroundMusic();

            finalScore.textContent =
                `${score} / ${TOTAL_QUESTIONS}`;

            const stars =
                calculateStars();

            finalStars.textContent =
                "⭐".repeat(stars);

            resultScreen.classList.remove(
                "hidden"
            );

            const percentageScore =
                Math.round(
                    (
                        score /
                        TOTAL_QUESTIONS
                    ) * 100
                );

            console.log(
                "COLOR MATCH FINAL SCORE:",
                score,
                "/",
                TOTAL_QUESTIONS
            );

            console.log(
                "COLOR MATCH PERCENTAGE:",
                percentageScore
            );

            console.log(
                "COLOR MATCH STARS:",
                stars
            );

            await saveProgress(
                percentageScore,
                stars
            );

        }


        // ======================================================
        // SAVE PROGRESS
        // ======================================================

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


            // ==================================================
            // CHECK LOCAL STORAGE
            // ==================================================

            if (
                !teacherData ||
                !studentData
            ) {

                console.error(
                    "COLOR MATCH: Progress NOT saved because teacher or student is missing."
                );

                return false;

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


                // ==================================================
                // CHECK IDS
                // ==================================================

                if (
                    !teacher.id ||
                    !student.id
                ) {

                    console.error(
                        "COLOR MATCH: Progress NOT saved because teacher.id or student.id is missing."
                    );

                    console.log(
                        "Teacher:",
                        teacher
                    );

                    console.log(
                        "Student:",
                        student
                    );

                    return false;

                }


                // ==================================================
                // FINAL VALUES
                // ==================================================

                const finalScoreValue =
                    Number(
                        percentageScore
                    );

                const finalStarsValue =
                    Number(
                        stars
                    );


                console.log(
                    "======================================"
                );

                console.log(
                    "COLOR MATCH - SAVING PROGRESS"
                );

                console.log(
                    "Teacher ID:",
                    teacher.id
                );

                console.log(
                    "Student ID:",
                    student.id
                );

                console.log(
                    "Score:",
                    finalScoreValue
                );

                console.log(
                    "Stars:",
                    finalStarsValue
                );

                console.log(
                    "======================================"
                );


                // ==================================================
                // SEND TO BACKEND
                // ==================================================

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
                                JSON.stringify({

                                    teacher_id:
                                        Number(
                                            teacher.id
                                        ),

                                    student_id:
                                        Number(
                                            student.id
                                        ),

                                    category:
                                        "colors",

                                    activity:
                                        "color-match",

                                    score:
                                        finalScoreValue,

                                    stars:
                                        finalStarsValue

                                })

                        }
                    );


                // ==================================================
                // READ RESPONSE
                // ==================================================

                let data = null;

                try {

                    data =
                        await response.json();

                }

                catch (jsonError) {

                    console.error(
                        "COLOR MATCH: Invalid server response.",
                        jsonError
                    );

                }


                console.log(
                    "COLOR MATCH SAVE RESPONSE:",
                    data
                );


                // ==================================================
                // CHECK RESPONSE
                // ==================================================

                if (!response.ok) {

                    console.error(
                        "COLOR MATCH PROGRESS SAVE FAILED:",
                        data
                    );

                    return false;

                }


                console.log(
                    "✅ COLOR MATCH PROGRESS SAVED SUCCESSFULLY!"
                );

                console.log(
                    "Saved Score:",
                    finalScoreValue
                );

                console.log(
                    "Saved Stars:",
                    finalStarsValue
                );

                return true;

            }

            catch (error) {

                console.error(
                    "❌ COLOR MATCH PROGRESS ERROR:",
                    error
                );

                return false;

            }

        }


        // ======================================================
        // PLAY AGAIN
        // ======================================================

        playAgainButton.addEventListener(
            "click",
            function () {

                playButtonSound();

                currentQuestion = 0;

                score = 0;

                lives = MAX_LIVES;

                selectedColor = null;

                answered = false;

                gameOver = false;

                resultScreen.classList.add(
                    "hidden"
                );

                if (starReward) {

                    starReward.classList.add(
                        "hidden"
                    );

                }

                displaySelectedStudent();

                startBackgroundMusic();

                loadQuestion();

            }
        );


        // ======================================================
        // BACK BUTTON SOUND
        // ======================================================

        const backButton =
            document.querySelector(
                ".back-btn"
            );

        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    playButtonSound();

                    stopBackgroundMusic();

                }
            );

        }


        // ======================================================
        // START GAME
        // ======================================================

        const studentExists =
            displaySelectedStudent();

        if (studentExists) {

            startBackgroundMusic();

            loadQuestion();

        }

    }
);


// ==========================================================
// BACK TO COLORS
// ==========================================================

window.goBackToColors =
    function () {

        window.location.href =
            "../colors.html";

    };