let colorMemoryLoadingFinished = false;

let colorMemoryLoadingPromise = new Promise(function (resolve) {

    window.addEventListener("load", function () {

        const loader =
            document.getElementById("loadingScreen");

        const barFill =
            document.getElementById("loadingBarFill");

        if (!loader || !barFill) {

            colorMemoryLoadingFinished = true;

            resolve();

            return;
        }

        let progress = 0;

        barFill.style.width = "0%";

        const loadingInterval =
            setInterval(function () {

                progress +=
                    Math.floor(Math.random() * 5) + 2;

                if (progress >= 100) {

                    progress = 100;

                    barFill.style.width =
                        "100%";

                    clearInterval(
                        loadingInterval
                    );

                    setTimeout(function () {

                        loader.style.opacity = "0";

                        setTimeout(function () {

                            loader.style.display =
                                "none";

                            colorMemoryLoadingFinished =
                                true;

                            resolve();

                        }, 500);

                    }, 400);

                } else {

                    barFill.style.width =
                        progress + "%";

                }

            }, 100);

    });

});


// =========================================================
// COLOR MEMORY
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

        let lives = MAX_LIVES;

        let sequence = [];

        let playerSequence = [];

        let acceptingInput = false;

        let roundBusy = false;


        // =====================================================
        // HTML ELEMENTS
        // =====================================================

        const scoreElement =
            document.getElementById("score");

        const questionNumberElement =
            document.getElementById(
                "questionNumber"
            );

        const livesElement =
            document.getElementById("lives");

        const progressBar =
            document.getElementById("progressBar");

        const progressText =
            document.getElementById("progressText");

        const questionText =
            document.getElementById("questionText");

        const instructionText =
            document.getElementById(
                "instructionText"
            );

        const phaseBadge =
            document.getElementById("phaseBadge");

        const memoryArea =
            document.getElementById("memoryArea");

        const playerSection =
            document.getElementById(
                "playerSection"
            );

        const colorChoices =
            document.getElementById(
                "colorChoices"
            );

        const feedback =
            document.getElementById("feedback");

        const nextButton =
            document.getElementById("nextButton");

        const resultScreen =
            document.getElementById(
                "resultScreen"
            );

        const finalScore =
            document.getElementById("finalScore");

        const finalStars =
            document.getElementById("finalStars");

        const playAgainButton =
            document.getElementById(
                "playAgainButton"
            );

        const playingStudentName =
            document.getElementById(
                "playingStudentName"
            );

        const finalStudentName =
            document.getElementById(
                "finalStudentName"
            );

        const noStudentOverlay =
            document.getElementById(
                "noStudentOverlay"
            );


        // =====================================================
        // CHECK REQUIRED ELEMENTS
        // =====================================================

        if (
            !scoreElement ||
            !questionNumberElement ||
            !livesElement ||
            !progressBar ||
            !questionText ||
            !instructionText ||
            !phaseBadge ||
            !memoryArea ||
            !playerSection ||
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
                "Color Memory: Missing required HTML element."
            );

            return;
        }


        // =====================================================
        // SOUND HELPERS
        // =====================================================

        function playGameButtonSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playButton ===
                "function"
            ) {

                window.soundManager.playButton();

                return;
            }

            if (
                typeof window.playButton ===
                "function"
            ) {

                window.playButton();

            }

        }


        function playCorrectSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playCorrect ===
                "function"
            ) {

                window.soundManager.playCorrect();

                return;
            }

            if (
                typeof window.playCorrect ===
                "function"
            ) {

                window.playCorrect();

            }

        }


        function playWrongSound() {

            if (
                window.soundManager &&
                typeof window.soundManager.playWrong ===
                "function"
            ) {

                window.soundManager.playWrong();

                return;
            }

            if (
                typeof window.playWrong ===
                "function"
            ) {

                window.playWrong();

            }

        }


        function startGameMusic() {

            if (
                window.soundManager &&
                typeof window.soundManager.startBackgroundMusic ===
                "function"
            ) {

                window.soundManager.startBackgroundMusic();

                return;
            }

            if (
                typeof window.startBackgroundMusic ===
                "function"
            ) {

                window.startBackgroundMusic();

            }

        }


        // =====================================================
        // BACK TO COLORS
        // =====================================================

        const backButton =
            document.getElementById(
                "backToColorsButton"
            );

        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    playGameButtonSound();

                    window.location.href =
                        "../colors.html";

                }
            );

        }


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

            } catch (error) {

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
                getStudentFullName(student);

            playingStudentName.textContent =
                name;

            if (finalStudentName) {

                finalStudentName.textContent =
                    name;

            }

            return true;

        }


        // =====================================================
        // SEQUENCE LENGTH
        // =====================================================

        function getSequenceLength() {

            if (currentRound <= 3) {

                return 2;

            }

            if (currentRound <= 6) {

                return 3;

            }

            if (currentRound <= 8) {

                return 4;

            }

            return 5;

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
        // CREATE SEQUENCE
        // =====================================================

        function createSequence() {

            sequence = [];

            const length =
                getSequenceLength();

            for (
                let i = 0;
                i < length;
                i++
            ) {

                sequence.push(
                    getRandomColor()
                );

            }

        }


        // =====================================================
        // SCORE
        // =====================================================

        function updateScore() {

            scoreElement.textContent =
                score;

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

                } else {

                    hearts += "🖤";

                }

            }

            livesElement.textContent =
                hearts;

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

            if (progressText) {

                progressText.textContent =
                    Math.round(
                        percentage
                    ) + "%";

            }

        }


        // =====================================================
        // ROUND
        // =====================================================

        function updateRound() {

            questionNumberElement.textContent =
                currentRound +
                " / " +
                TOTAL_ROUNDS;

        }


        // =====================================================
        // MEMORY CARDS
        // =====================================================

        function createMemoryCards(
            hideColors = false
        ) {

            memoryArea.innerHTML = "";

            sequence.forEach(
                function (color) {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "memory-card";

                    card.style.backgroundColor =
                        color.value;

                    if (hideColors) {

                        card.classList.add(
                            "hidden-card"
                        );

                    }

                    memoryArea.appendChild(
                        card
                    );

                }
            );

        }


        // =====================================================
        // COLOR BUTTONS
        // =====================================================

        function createColorButtons() {

            colorChoices.innerHTML = "";

            colors.forEach(
                function (color) {

                    const button =
                        document.createElement(
                            "button"
                        );

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

                    button.addEventListener(
                        "click",
                        function () {

                            handleColorClick(
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


        // =====================================================
        // DISABLE BUTTONS
        // =====================================================

        function disableColorButtons() {

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


        // =====================================================
        // ENABLE BUTTONS
        // =====================================================

        function enableColorButtons() {

            const buttons =
                document.querySelectorAll(
                    ".color-choice"
                );

            buttons.forEach(
                function (button) {

                    button.disabled =
                        false;

                }
            );

        }


        // =====================================================
        // SHOW SEQUENCE
        // =====================================================

        async function showSequence() {

            acceptingInput =
                false;

            roundBusy =
                true;

            playerSection.classList.add(
                "hidden"
            );

            nextButton.classList.add(
                "hidden"
            );

            phaseBadge.textContent =
                "👀 Watch Carefully!";

            questionText.textContent =
                "Remember the colors!";

            instructionText.textContent =
                "Watch the color sequence carefully.";

            feedback.textContent =
                "";

            feedback.className =
                "feedback";

            createMemoryCards(
                false
            );

            createColorButtons();

            disableColorButtons();

            await wait(600);

            await wait(
                1000 +
                sequence.length * 450
            );

            hideSequence();

        }


        // =====================================================
        // HIDE SEQUENCE
        // =====================================================

        function hideSequence() {

            createMemoryCards(
                true
            );

            phaseBadge.textContent =
                "🎨 Your Turn!";

            questionText.textContent =
                "Can you remember them?";

            instructionText.textContent =
                "Tap the colors in the same order.";

            feedback.textContent =
                "";

            feedback.className =
                "feedback";

            playerSequence =
                [];

            acceptingInput =
                true;

            roundBusy =
                false;

            playerSection.classList.remove(
                "hidden"
            );

            enableColorButtons();

        }


        // =====================================================
        // COLOR CLICK
        // =====================================================

        function handleColorClick(
            colorName,
            button
        ) {

            if (
                !acceptingInput ||
                roundBusy
            ) {

                return;

            }

            button.classList.add(
                "selected"
            );

            setTimeout(
                function () {

                    button.classList.remove(
                        "selected"
                    );

                },
                180
            );

            playerSequence.push(
                colorName
            );

            const currentIndex =
                playerSequence.length - 1;

            if (
                colorName !==
                sequence[currentIndex].name
            ) {

                handleWrongAnswer();

                return;

            }

            if (
                playerSequence.length ===
                sequence.length
            ) {

                handleCorrectAnswer();

                return;

            }

            feedback.textContent =
                "Great! " +
                playerSequence.length +
                " of " +
                sequence.length;

            feedback.className =
                "feedback instruction";

        }


        // =====================================================
        // CORRECT ANSWER
        // =====================================================

        function handleCorrectAnswer() {

            acceptingInput =
                false;

            roundBusy =
                true;

            score++;

            updateScore();

            feedback.textContent =
                "🎉 Great job!";

            feedback.className =
                "feedback correct";

            playCorrectSound();

            showStarReward();

            showCorrectSequence();

            disableColorButtons();

            if (
                currentRound >=
                TOTAL_ROUNDS
            ) {

                setTimeout(
                    function () {

                        showResult();

                    },
                    1100
                );

                return;

            }

            nextButton.textContent =
                "Next →";

            nextButton.classList.remove(
                "hidden"
            );

        }


        // =====================================================
        // WRONG ANSWER
        // =====================================================

        function handleWrongAnswer() {

            acceptingInput =
                false;

            roundBusy =
                true;

            lives--;

            updateLives();

            feedback.textContent =
                "💛 Good try! Let's try again!";

            feedback.className =
                "feedback wrong";

            playWrongSound();

            showCorrectSequence();

            disableColorButtons();

            if (lives <= 0) {

                setTimeout(
                    function () {

                        showResult();

                    },
                    1200
                );

                return;

            }

            nextButton.textContent =
                "Try Again →";

            nextButton.classList.remove(
                "hidden"
            );

        }


        // =====================================================
        // SHOW CORRECT SEQUENCE
        // =====================================================

        function showCorrectSequence() {

            memoryArea.innerHTML =
                "";

            sequence.forEach(
                function (color) {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "memory-card";

                    card.style.backgroundColor =
                        color.value;

                    memoryArea.appendChild(
                        card
                    );

                }
            );

        }


        // =====================================================
        // NEXT BUTTON
        // =====================================================

        nextButton.addEventListener(
            "click",
            function () {

                playGameButtonSound();

                if (
                    currentRound >=
                    TOTAL_ROUNDS
                ) {

                    showResult();

                    return;

                }

                if (
                    playerSequence.length !==
                    sequence.length &&
                    lives > 0
                ) {

                    nextButton.classList.add(
                        "hidden"
                    );

                    nextButton.textContent =
                        "Next →";

                    showSequence();

                    return;

                }

                currentRound++;

                nextButton.classList.add(
                    "hidden"
                );

                nextButton.textContent =
                    "Next →";

                updateRound();

                updateProgress();

                createSequence();

                showSequence();

            }
        );


        // =====================================================
        // CALCULATE STARS
        // =====================================================

        function calculateStars() {

            if (score >= 9) {

                return 3;

            }

            if (score >= 6) {

                return 2;

            }

            return 1;

        }


        // =====================================================
        // STAR TEXT
        // =====================================================

        function getStarText(
            starCount
        ) {

            if (starCount >= 3) {

                return "⭐⭐⭐";

            }

            if (starCount >= 2) {

                return "⭐⭐";

            }

            return "⭐";

        }


        // =====================================================
        // RESULT
        // =====================================================

        async function showResult() {

            acceptingInput =
                false;

            roundBusy =
                true;

            progressBar.style.width =
                "100%";

            if (progressText) {

                progressText.textContent =
                    "100%";

            }

            finalScore.textContent =
                score +
                " / " +
                TOTAL_ROUNDS;

            const stars =
                calculateStars();

            finalStars.textContent =
                getStarText(stars);

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

            const percentageScore =
                Math.round(
                    (
                        score /
                        TOTAL_ROUNDS
                    ) * 100
                );

            await saveProgress(
                percentageScore,
                stars
            );

        }


        // =====================================================
        // SAVE PROGRESS
        // =====================================================

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

                            body: JSON.stringify({

                                teacher_id:
                                    teacher.id,

                                student_id:
                                    student.id,

                                category:
                                    "colors",

                                activity:
                                    "color-memory",

                                score:
                                    percentageScore,

                                stars:
                                    stars

                            })

                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        "Progress save failed: HTTP " +
                        response.status
                    );

                }

                const data =
                    await response.json();

                console.log(
                    "COLOR MEMORY PROGRESS SAVED:",
                    data
                );

                console.log(
                    "COLOR MEMORY STARS SAVED:",
                    stars
                );

            } catch (error) {

                console.error(
                    "Color Memory progress error:",
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

                playGameButtonSound();

                currentRound =
                    1;

                score =
                    0;

                lives =
                    MAX_LIVES;

                sequence =
                    [];

                playerSequence =
                    [];

                acceptingInput =
                    false;

                roundBusy =
                    false;

                resultScreen.classList.add(
                    "hidden"
                );

                nextButton.classList.add(
                    "hidden"
                );

                nextButton.textContent =
                    "Next →";

                feedback.textContent =
                    "";

                feedback.className =
                    "feedback";

                displaySelectedStudent();

                updateScore();

                updateLives();

                updateRound();

                updateProgress();

                createSequence();

                showSequence();

            }
        );


        // =====================================================
        // WAIT
        // =====================================================

        function wait(milliseconds) {

            return new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        milliseconds
                    );

                }
            );

        }


        // =====================================================
        // START GAME AFTER LOADING
        // =====================================================

        async function startGameAfterLoading() {

            const studentExists =
                displaySelectedStudent();

            if (!studentExists) {

                return;

            }

            await colorMemoryLoadingPromise;

            await wait(150);

            updateScore();

            updateLives();

            updateRound();

            updateProgress();

            createSequence();

            startGameMusic();

            showSequence();

        }


        // =====================================================
        // START
        // =====================================================

        startGameAfterLoading();

    }
);


// =========================================================
// STAR REWARD
// =========================================================

function showStarReward() {

    const starReward =
        document.getElementById(
            "starReward"
        );

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
        setTimeout(
            function () {

                starReward.classList.add(
                    "hidden"
                );

            },
            1300
        );

}


// =========================================================
// BACK TO COLORS
// =========================================================

window.goBackToColors =
    function () {

        window.location.href =
            "../colors.html";

    };