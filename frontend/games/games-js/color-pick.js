let colorPickLoadingFinished = false;
let colorPickGameStarted = false;


// =========================================================
// LOADING BAR
// =========================================================

window.addEventListener("load", function () {

    const loader =
        document.getElementById("loadingScreen");

    const barFill =
        document.getElementById("loadingBarFill");


    // If loading elements do not exist,
    // allow the game to start immediately.

    if (!loader || !barFill) {

        colorPickLoadingFinished = true;

        document.dispatchEvent(
            new Event("colorPickLoadingFinished")
        );

        return;
    }


    let progress = 0;


    const loadingInterval =
        setInterval(function () {

            progress +=
                Math.floor(
                    Math.random() * 5
                ) + 2;


            if (progress >= 100) {

                progress = 100;

                clearInterval(
                    loadingInterval
                );


                barFill.style.width =
                    "100%";


                setTimeout(
                    function () {

                        loader.classList.add(
                            "finished"
                        );


                        setTimeout(
                            function () {

                                colorPickLoadingFinished =
                                    true;


                                document.dispatchEvent(
                                    new Event(
                                        "colorPickLoadingFinished"
                                    )
                                );

                            },
                            550
                        );

                    },
                    400
                );

            }

            else {

                barFill.style.width =
                    progress + "%";

            }

        }, 100);

});


// =========================================================
// COLOR PATH GAME
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =====================================================
        // SETTINGS
        // =====================================================

        const TOTAL_ROUNDS = 10;

        const MAX_LIVES = 3;

        const API_BASE =
            "https://kiddoquest-backend.onrender.com/api";


        // =====================================================
        // COLORS
        // =====================================================

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
                name: "blue",
                label: "Blue",
                value: "#42A5F5"
            },

            {
                name: "green",
                label: "Green",
                value: "#66BB6A"
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


        // =====================================================
        // GAME VARIABLES
        // =====================================================

        let currentRound = 1;

        let score = 0;

        let stars = 0;

        let lives = MAX_LIVES;

        let correctColor = null;

        let roundFinished = false;

        let gameFinished = false;


        // =====================================================
        // HTML ELEMENTS
        // =====================================================

        const scoreElement =
            document.getElementById("score");


        const starsElement =
            document.getElementById("stars");


        const livesElement =
            document.getElementById("lives");


        const roundBadge =
            document.getElementById("roundBadge");


        const questionText =
            document.getElementById("questionText");


        const instructionText =
            document.getElementById("instructionText");


        const targetColor =
            document.getElementById("targetColor");


        const progressBar =
            document.getElementById("progressBar");


        const pathGrid =
            document.getElementById("pathGrid");


        const feedback =
            document.getElementById("feedback");


        const nextButton =
            document.getElementById("nextButton");


        const starReward =
            document.getElementById("starReward");


        const resultScreen =
            document.getElementById("resultScreen");


        const finalScore =
            document.getElementById("finalScore");


        const finalStars =
            document.getElementById("finalStars");


        const finalStarDisplay =
            document.getElementById("finalStarDisplay");


        const playAgainButton =
            document.getElementById("playAgainButton");


        const playingStudentName =
            document.getElementById("playingStudentName");


        const finalStudentName =
            document.getElementById("finalStudentName");


        const noStudentOverlay =
            document.getElementById("noStudentOverlay");


        // =====================================================
        // REQUIRED ELEMENT CHECK
        // =====================================================

        const missingElements = [];


        if (!scoreElement) {
            missingElements.push("score");
        }

        if (!starsElement) {
            missingElements.push("stars");
        }

        if (!livesElement) {
            missingElements.push("lives");
        }

        if (!roundBadge) {
            missingElements.push("roundBadge");
        }

        if (!questionText) {
            missingElements.push("questionText");
        }

        if (!instructionText) {
            missingElements.push("instructionText");
        }

        if (!targetColor) {
            missingElements.push("targetColor");
        }

        if (!progressBar) {
            missingElements.push("progressBar");
        }

        if (!pathGrid) {
            missingElements.push("pathGrid");
        }

        if (!feedback) {
            missingElements.push("feedback");
        }

        if (!nextButton) {
            missingElements.push("nextButton");
        }

        if (!starReward) {
            missingElements.push("starReward");
        }

        if (!resultScreen) {
            missingElements.push("resultScreen");
        }

        if (!finalScore) {
            missingElements.push("finalScore");
        }

        if (!finalStars) {
            missingElements.push("finalStars");
        }

        if (!finalStarDisplay) {
            missingElements.push("finalStarDisplay");
        }

        if (!playAgainButton) {
            missingElements.push("playAgainButton");
        }

        if (!playingStudentName) {
            missingElements.push("playingStudentName");
        }


        if (missingElements.length > 0) {

            console.error(
                "Color Path: Missing required HTML elements:",
                missingElements
            );

            return;
        }


        // =====================================================
        // SOUND
        // =====================================================

        function playSound(type) {

            try {

                // New shared sound manager

                if (
                    window.soundManager &&
                    typeof window.soundManager[type] ===
                    "function"
                ) {

                    window.soundManager[type]();

                    return;
                }


                // Old sound manager

                if (
                    window.SoundManager &&
                    typeof window.SoundManager[type] ===
                    "function"
                ) {

                    window.SoundManager[type]();

                    return;
                }


                // Existing global functions

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

            }

            catch (error) {

                console.log(
                    "Color Path sound error:",
                    error
                );

            }

        }


        // =====================================================
        // BACKGROUND MUSIC
        // =====================================================

        let backgroundMusicStarted = false;


        function startBackgroundMusic() {

            if (backgroundMusicStarted) {

                return;
            }


            try {

                if (
                    window.soundManager &&
                    typeof
                    window.soundManager.startBackgroundMusic ===
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

            }

            catch (error) {

                console.log(
                    "Background music error:",
                    error
                );

            }

        }


        document.addEventListener(
            "pointerdown",
            function () {

                startBackgroundMusic();

            },
            {
                once: true
            }
        );


        // =====================================================
        // STUDENT
        // =====================================================

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


        // =====================================================
        // STUDENT NAME
        // =====================================================

        function getStudentFullName(student) {

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


            return "Student";
        }


        // =====================================================
        // DISPLAY STUDENT
        // =====================================================

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


            const name =
                getStudentFullName(
                    student
                );


            playingStudentName.textContent =
                name;


            if (finalStudentName) {

                finalStudentName.textContent =
                    name;

            }


            if (noStudentOverlay) {

                noStudentOverlay.classList.add(
                    "hidden"
                );

            }


            return true;
        }


        // =====================================================
        // SCORE
        // =====================================================

        function updateScore() {

            scoreElement.textContent =
                score;

        }


        // =====================================================
        // STARS
        // =====================================================

        function updateStars() {

            starsElement.textContent =
                stars;

        }


        // =====================================================
        // LIVES
        // =====================================================

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


        // =====================================================
        // ROUND
        // =====================================================

        function updateRound() {

            roundBadge.textContent =
                "Round " +
                currentRound +
                " / " +
                TOTAL_ROUNDS;

        }


        // =====================================================
        // PROGRESS
        // =====================================================

        function updateProgress() {

            const percentage =
                (
                    (currentRound - 1) /
                    TOTAL_ROUNDS
                ) * 100;


            progressBar.style.width =
                percentage + "%";

        }


        // =====================================================
        // CORRECT TILE COUNT
        // =====================================================

        function getCorrectTileCount() {

            if (currentRound <= 3) {

                return 5;
            }


            if (currentRound <= 6) {

                return 7;
            }


            if (currentRound <= 8) {

                return 9;
            }


            return 11;

        }


        // =====================================================
        // RANDOM COLOR
        // =====================================================

        function getRandomColor() {

            return colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        }


        // =====================================================
        // SHUFFLE
        // =====================================================

        function shuffleArray(array) {

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

        }


        // =====================================================
        // CREATE ROUND
        // =====================================================

        function createPath() {

            pathGrid.innerHTML = "";

            feedback.textContent = "";

            feedback.className =
                "feedback";


            nextButton.classList.add(
                "hidden"
            );


            roundFinished = false;


            // -------------------------------------------------
            // TARGET COLOR
            // -------------------------------------------------

            correctColor =
                getRandomColor();


            targetColor.style.backgroundColor =
                correctColor.value;


            targetColor.setAttribute(
                "aria-label",
                correctColor.label
            );


            questionText.textContent =
                "Find the matching colors!";


            instructionText.textContent =
                "Touch all the tiles that look like the color above.";


            // -------------------------------------------------
            // TILE COUNTS
            // -------------------------------------------------

            const correctCount =
                getCorrectTileCount();


            const wrongCount =
                Math.min(
                    8,
                    5 +
                    Math.floor(
                        currentRound / 2
                    )
                );


            const tileColors = [];


            // -------------------------------------------------
            // CORRECT TILES
            // -------------------------------------------------

            for (
                let i = 0;
                i < correctCount;
                i++
            ) {

                tileColors.push(
                    correctColor
                );

            }


            // -------------------------------------------------
            // WRONG TILES
            // -------------------------------------------------

            for (
                let i = 0;
                i < wrongCount;
                i++
            ) {

                let wrongColor =
                    getRandomColor();


                while (
                    wrongColor.name ===
                    correctColor.name
                ) {

                    wrongColor =
                        getRandomColor();

                }


                tileColors.push(
                    wrongColor
                );

            }


            // -------------------------------------------------
            // SHUFFLE
            // -------------------------------------------------

            shuffleArray(
                tileColors
            );


            // -------------------------------------------------
            // CREATE TILES
            // -------------------------------------------------

            tileColors.forEach(
                function (color) {

                    const tile =
                        document.createElement(
                            "button"
                        );


                    tile.type =
                        "button";


                    tile.className =
                        "path-tile";


                    tile.style.backgroundColor =
                        color.value;


                    tile.dataset.color =
                        color.name;


                    tile.setAttribute(
                        "aria-label",
                        color.label
                    );


                    tile.addEventListener(
                        "click",
                        function () {

                            handleTileClick(
                                tile,
                                color
                            );

                        }
                    );


                    pathGrid.appendChild(
                        tile
                    );

                }
            );

        }


        // =====================================================
        // TILE CLICK
        // =====================================================

        function handleTileClick(
            tile,
            color
        ) {

            if (
                roundFinished ||
                gameFinished ||
                tile.disabled
            ) {

                return;
            }


            playSound(
                "click"
            );


            // =================================================
            // CORRECT
            // =================================================

            if (
                color.name ===
                correctColor.name
            ) {

                tile.disabled = true;


                tile.classList.add(
                    "correct"
                );


                score++;


                updateScore();


                playSound(
                    "correct"
                );


                feedback.textContent =
                    "⭐ Great job!";


                feedback.className =
                    "feedback correct";


                showStarReward();


                setTimeout(
                    function () {

                        const remaining =
                            document.querySelectorAll(
                                ".path-tile[data-color='" +
                                correctColor.name +
                                "']:not(:disabled)"
                            );


                        if (
                            remaining.length === 0
                        ) {

                            finishRound();

                        }

                    },
                    300
                );


                return;
            }


            // =================================================
            // WRONG
            // =================================================

            tile.classList.add(
                "wrong"
            );


            lives--;


            updateLives();


            playSound(
                "wrong"
            );


            feedback.textContent =
                "💛 Try another color!";


            feedback.className =
                "feedback wrong";


            setTimeout(
                function () {

                    tile.classList.remove(
                        "wrong"
                    );

                },
                400
            );


            if (lives <= 0) {

                finishGame();

            }

        }


        // =====================================================
        // STAR REWARD
        // =====================================================

        function showStarReward() {

            starReward.classList.remove(
                "hidden"
            );


            const rewardStar =
                starReward.querySelector(
                    ".reward-star"
                );


            const rewardText =
                starReward.querySelector(
                    ".reward-text"
                );


            if (rewardStar) {

                rewardStar.style.animation =
                    "none";


                void rewardStar.offsetWidth;


                rewardStar.style.animation =
                    "";

            }


            if (rewardText) {

                rewardText.style.animation =
                    "none";


                void rewardText.offsetWidth;


                rewardText.style.animation =
                    "";

            }


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
                    1000
                );

        }


        // =====================================================
        // FINISH ROUND
        // =====================================================

        function finishRound() {

            if (
                roundFinished ||
                gameFinished
            ) {

                return;
            }


            roundFinished = true;


            stars++;


            updateStars();


            playSound(
                "correct"
            );


            feedback.textContent =
                "🎉 Great job! You found all the matching colors!";


            feedback.className =
                "feedback correct";


            disableTiles();


            showStarReward();


            // -------------------------------------------------
            // LAST ROUND
            // -------------------------------------------------

            if (
                currentRound >=
                TOTAL_ROUNDS
            ) {

                setTimeout(
                    function () {

                        showResult();

                    },
                    900
                );


                return;
            }


            // -------------------------------------------------
            // NEXT ROUND BUTTON
            // -------------------------------------------------

            nextButton.classList.remove(
                "hidden"
            );

        }


        // =====================================================
        // DISABLE TILES
        // =====================================================

        function disableTiles() {

            const tiles =
                document.querySelectorAll(
                    ".path-tile"
                );


            tiles.forEach(
                function (tile) {

                    tile.disabled =
                        true;

                }
            );

        }


        // =====================================================
        // NEXT ROUND
        // =====================================================

        nextButton.addEventListener(
            "click",
            function () {

                if (gameFinished) {

                    return;
                }


                playSound(
                    "click"
                );


                currentRound++;


                updateRound();

                updateProgress();


                createPath();

            }
        );


        // =====================================================
        // FINAL STARS
        // =====================================================

        function calculateFinalStars() {

            if (stars >= 9) {

                return 3;
            }


            if (stars >= 6) {

                return 2;
            }


            if (stars >= 3) {

                return 1;
            }


            return 0;

        }


        // =====================================================
        // SHOW RESULT
        // =====================================================

        async function showResult() {

            if (gameFinished) {

                return;
            }


            gameFinished = true;

            roundFinished = true;


            progressBar.style.width =
                "100%";


            finalScore.textContent =
                score;


            finalStars.textContent =
                stars + " ⭐";


            const finalStarCount =
                calculateFinalStars();


            if (finalStarCount === 3) {

                finalStarDisplay.textContent =
                    "⭐⭐⭐";

            }

            else if (finalStarCount === 2) {

                finalStarDisplay.textContent =
                    "⭐⭐";

            }

            else if (finalStarCount === 1) {

                finalStarDisplay.textContent =
                    "⭐";

            }

            else {

                finalStarDisplay.textContent =
                    "—";

            }


            const student =
                getSelectedStudent();


            if (
                finalStudentName &&
                student
            ) {

                finalStudentName.textContent =
                    getStudentFullName(
                        student
                    );

            }


            resultScreen.classList.remove(
                "hidden"
            );


            playSound(
                "finish"
            );


            // -------------------------------------------------
            // MAXIMUM SCORE
            // -------------------------------------------------

            let maximumScore = 0;


            for (
                let round = 1;
                round <= TOTAL_ROUNDS;
                round++
            ) {

                if (round <= 3) {

                    maximumScore += 5;

                }

                else if (round <= 6) {

                    maximumScore += 7;

                }

                else if (round <= 8) {

                    maximumScore += 9;

                }

                else {

                    maximumScore += 11;

                }

            }


            const percentageScore =
                Math.min(
                    100,
                    Math.round(
                        (
                            score /
                            maximumScore
                        ) * 100
                    )
                );


            await saveProgress(
                percentageScore,
                finalStarCount
            );

        }


        // =====================================================
        // GAME OVER
        // =====================================================

        function finishGame() {

            if (gameFinished) {

                return;
            }


            roundFinished = true;


            disableTiles();


            feedback.textContent =
                "💛 Good try! Let's see your score.";


            feedback.className =
                "feedback wrong";


            playSound(
                "gameOver"
            );


            setTimeout(
                function () {

                    showResult();

                },
                900
            );

        }


        // =====================================================
        // SAVE PROGRESS
        // =====================================================

        async function saveProgress(
            percentageScore,
            finalStarCount
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
                    "Progress not saved: teacher or student missing."
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
                    !teacher.id ||
                    !student.id
                ) {

                    console.log(
                        "Progress not saved: missing teacher_id or student_id."
                    );

                    return;
                }


                const response =
                    await fetch(
                        API_BASE +
                        "/progress/save",
                        {

                            method: "POST",

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
                                        "colors",

                                    activity:
                                        "color-path",

                                    score:
                                        percentageScore,

                                    stars:
                                        finalStarCount

                                })

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Progress save failed: " +
                        response.status
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "COLOR PATH PROGRESS SAVED:",
                    data
                );

            }

            catch (error) {

                console.error(
                    "Color Path progress error:",
                    error
                );

            }

        }


        // =====================================================
        // PLAY AGAIN
        // =====================================================

        playAgainButton.addEventListener(
            "click",
            function () {

                playSound(
                    "click"
                );


                currentRound = 1;

                score = 0;

                stars = 0;

                lives = MAX_LIVES;

                correctColor = null;

                roundFinished = false;

                gameFinished = false;


                resultScreen.classList.add(
                    "hidden"
                );


                starReward.classList.add(
                    "hidden"
                );


                updateScore();

                updateStars();

                updateLives();

                updateRound();

                updateProgress();


                createPath();

            }
        );


        // =====================================================
        // START GAME
        // =====================================================

        function startGame() {

            // IMPORTANT:
            // Correct variable name is colorPickGameStarted.

            if (colorPickGameStarted) {

                return;
            }


            // Wait for loading to finish.

            if (!colorPickLoadingFinished) {

                return;
            }


            // Mark game as started.

            colorPickGameStarted = true;


            const studentExists =
                displaySelectedStudent();


            if (!studentExists) {

                return;
            }


            updateScore();

            updateStars();

            updateLives();

            updateRound();

            updateProgress();


            // Start first round.

            createPath();

        }


        // =====================================================
        // WAIT FOR LOADING TO FINISH
        // =====================================================

        document.addEventListener(
            "colorPickLoadingFinished",
            function () {

                startGame();

            },
            {
                once: true
            }
        );


        // =====================================================
        // SAFETY CHECK
        // =====================================================

        if (colorPickLoadingFinished) {

            startGame();

        }

    }
);