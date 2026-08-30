// ===============================================
// KinderQuest - Letter Window
// Click the correct letter window
// ===============================================

const API_BASE =
    "http://localhost:5001/api";


const TOTAL_QUESTIONS = 10;

const MAX_LIVES = 3;

const WINDOW_COUNT = 6;


// ===============================================
// LETTERS
// ===============================================

const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("");


let currentQuestion = 0;

let score = 0;

let lives = MAX_LIVES;

let correctLetter = "";

let acceptingAnswer = false;

let selectedStudent = null;


// ===============================================
// HTML ELEMENTS
// ===============================================

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


const loadingBarFill =
    document.getElementById(
        "loadingBarFill"
    );


const scoreEl =
    document.getElementById(
        "score"
    );


const livesEl =
    document.getElementById(
        "lives"
    );


const questionNumberEl =
    document.getElementById(
        "questionNumber"
    );


const questionText =
    document.getElementById(
        "questionText"
    );


const windowsContainer =
    document.getElementById(
        "windowsContainer"
    );


const feedback =
    document.getElementById(
        "feedback"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const soundButton =
    document.getElementById(
        "soundButton"
    );


const resultScreen =
    document.getElementById(
        "resultScreen"
    );


const finalScore =
    document.getElementById(
        "finalScore"
    );


const finalStars =
    document.getElementById(
        "finalStars"
    );


const resultMessage =
    document.getElementById(
        "resultMessage"
    );


const playAgainButton =
    document.getElementById(
        "playAgainButton"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const playingStudentName =
    document.getElementById(
        "playingStudentName"
    );


const noStudentOverlay =
    document.getElementById(
        "noStudentOverlay"
    );


const studentBackButton =
    document.getElementById(
        "studentBackButton"
    );


// ===============================================
// LOADING SCREEN
// IMPORTANT:
// ONLY RUNS WHEN THE PAGE FIRST OPENS.
// NEVER RUNS AFTER FINISH.
// ===============================================

window.addEventListener(
    "load",
    () => {

        let progress = 0;


        const timer =
            setInterval(
                () => {

                    progress +=
                        Math.floor(
                            Math.random() * 8
                        ) + 5;


                    if (progress >= 100) {

                        progress = 100;

                        clearInterval(timer);


                        if (loadingBarFill) {

                            loadingBarFill.style.width =
                                "100%";

                        }


                        setTimeout(
                            () => {

                                if (
                                    loadingScreen
                                ) {

                                    loadingScreen.classList.add(
                                        "finished"
                                    );

                                }

                            },
                            250
                        );

                    }


                    if (loadingBarFill) {

                        loadingBarFill.style.width =
                            progress + "%";

                    }

                },
                80
            );

    }
);


// ===============================================
// STUDENT
// ===============================================

function getStudent() {

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

    catch {

        return null;

    }

}


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
        student.fullname ||
        "Student"
    );

}


function checkStudent() {

    selectedStudent =
        getStudent();


    if (!selectedStudent) {

        if (playingStudentName) {

            playingStudentName.textContent =
                "No student selected";

        }


        if (noStudentOverlay) {

            noStudentOverlay.classList.remove(
                "hidden"
            );

        }


        return false;

    }


    if (playingStudentName) {

        playingStudentName.textContent =
            getStudentName(
                selectedStudent
            );

    }


    return true;

}


// ===============================================
// START GAME
// ===============================================

function startGame() {

    currentQuestion = 0;

    score = 0;

    lives = MAX_LIVES;

    acceptingAnswer = false;


    if (resultScreen) {

        resultScreen.classList.add(
            "hidden"
        );

    }


    updateScore();

    updateLives();


    loadQuestion();

}


// ===============================================
// LOAD QUESTION
// ===============================================

function loadQuestion() {

    if (
        currentQuestion >=
        TOTAL_QUESTIONS
    ) {

        showResult();

        return;

    }


    acceptingAnswer = true;


    const randomIndex =
        Math.floor(
            Math.random() *
            alphabet.length
        );


    correctLetter =
        alphabet[randomIndex];


    questionNumberEl.textContent =
        currentQuestion + 1;


    questionText.textContent =
        `Find the letter ${correctLetter}!`;


    feedback.textContent =
        "";


    feedback.className =
        "feedback";


    progressBar.style.width =
        `${
            (currentQuestion /
                TOTAL_QUESTIONS) *
            100
        }%`;


    createWindows();

}


// ===============================================
// CREATE WINDOWS
// ===============================================

function createWindows() {

    windowsContainer.innerHTML =
        "";


    const letters =
        generateChoices(
            correctLetter
        );


    shuffle(letters);


    letters.forEach(
        letter => {

            const window =
                document.createElement(
                    "button"
                );


            window.type =
                "button";


            window.className =
                "letter-window";


            window.dataset.letter =
                letter;


            const letterElement =
                document.createElement(
                    "div"
                );


            letterElement.className =
                "window-letter";


            letterElement.textContent =
                letter;


            window.appendChild(
                letterElement
            );


            window.addEventListener(
                "click",
                () => {

                    handleWindowClick(
                        window
                    );

                }
            );


            windowsContainer.appendChild(
                window
            );

        }
    );

}


// ===============================================
// GENERATE CHOICES
// ===============================================

function generateChoices(
    answer
) {

    const choices =
        [answer];


    while (
        choices.length <
        WINDOW_COUNT
    ) {

        const randomLetter =
            alphabet[
                Math.floor(
                    Math.random() *
                    alphabet.length
                )
            ];


        if (
            !choices.includes(
                randomLetter
            )
        ) {

            choices.push(
                randomLetter
            );

        }

    }


    return choices;

}


// ===============================================
// WINDOW CLICK
// ===============================================

function handleWindowClick(
    selectedWindow
) {

    if (!acceptingAnswer) {

        return;

    }


    const selectedLetter =
        selectedWindow.dataset.letter;


    if (
        selectedLetter ===
        correctLetter
    ) {

        handleCorrect(
            selectedWindow
        );

    }

    else {

        handleWrong(
            selectedWindow
        );

    }

}


// ===============================================
// CORRECT
// ===============================================

function handleCorrect(
    selectedWindow
) {

    acceptingAnswer = false;


    selectedWindow.classList.add(
        "correct"
    );


    score += 10;


    updateScore();


    feedback.textContent =
        `⭐ Great job! You found ${correctLetter}!`;


    feedback.className =
        "feedback correct";


    speakLetter(
        correctLetter
    );


    setTimeout(
        () => {

            currentQuestion++;


            if (
                currentQuestion >=
                TOTAL_QUESTIONS
            ) {

                showResult();

                return;

            }


            loadQuestion();

        },
        900
    );

}


// ===============================================
// WRONG
// ===============================================

function handleWrong(
    selectedWindow
) {

    if (!acceptingAnswer) {

        return;

    }


    lives--;


    updateLives();


    selectedWindow.classList.add(
        "wrong"
    );


    feedback.textContent =
        "❌ Try again!";


    feedback.className =
        "feedback wrong";


    setTimeout(
        () => {

            selectedWindow.classList.remove(
                "wrong"
            );

        },
        400
    );


    // ==========================================
    // IMPORTANT:
    // WHEN HEARTS REACH ZERO,
    // THE GAME STOPS.
    // ==========================================

    if (lives <= 0) {

        acceptingAnswer = false;


        disableWindows();


        feedback.textContent =
            `💛 The correct letter is ${correctLetter}.`;


        revealCorrectWindow();


        setTimeout(
            () => {

                showResult(
                    true
                );

            },
            1000
        );

    }

}


// ===============================================
// DISABLE WINDOWS
// ===============================================

function disableWindows() {

    document
        .querySelectorAll(
            ".letter-window"
        )
        .forEach(
            windowElement => {

                windowElement.classList.add(
                    "disabled"
                );

            }
        );

}


// ===============================================
// REVEAL CORRECT WINDOW
// ===============================================

function revealCorrectWindow() {

    const windows =
        document.querySelectorAll(
            ".letter-window"
        );


    windows.forEach(
        windowElement => {

            if (
                windowElement.dataset.letter ===
                correctLetter
            ) {

                windowElement.classList.add(
                    "correct"
                );

            }

        }
    );

}


// ===============================================
// SPEAK LETTER
// ===============================================

function speakLetter(
    letter
) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            letter
        );


    speech.rate =
        0.8;

    speech.pitch =
        1.1;


    window.speechSynthesis.speak(
        speech
    );

}


// ===============================================
// SOUND BUTTON
// ===============================================

if (soundButton) {

    soundButton.addEventListener(
        "click",
        () => {

            if (correctLetter) {

                speakLetter(
                    correctLetter
                );

            }

        }
    );

}


// ===============================================
// RESULT
// IMPORTANT:
// THIS SCREEN NEVER AUTOMATICALLY CLOSES.
// NO LOAD.
// NO NEXT QUESTION.
// USER MUST CHOOSE A BUTTON.
// ===============================================

async function showResult(
    outOfLives = false
) {

    acceptingAnswer = false;


    progressBar.style.width =
        "100%";


    finalScore.textContent =
        score;


    const maximumScore =
        TOTAL_QUESTIONS * 10;


    const percentage =
        Math.round(
            (
                score /
                maximumScore
            ) * 100
        );


    if (score >= 80) {

        finalStars.textContent =
            "⭐⭐⭐";

    }

    else if (score >= 50) {

        finalStars.textContent =
            "⭐⭐";

    }

    else {

        finalStars.textContent =
            "⭐";

    }


    if (outOfLives) {

        resultMessage.textContent =
            "You used all your lives. Keep practicing!";

    }

    else {

        resultMessage.textContent =
            "You completed all the letters!";

    }


    // ==========================================
    // SHOW RESULT CARD
    // ==========================================

    resultScreen.classList.remove(
        "hidden"
    );


    // ==========================================
    // SAVE ONLY
    // DOES NOT RELOAD PAGE
    // DOES NOT HIDE CARD
    // ==========================================

    await saveProgress(
        Math.min(
            100,
            percentage
        )
    );

}


// ===============================================
// UPDATE SCORE
// ===============================================

function updateScore() {

    if (scoreEl) {

        scoreEl.textContent =
            score;

    }

}


// ===============================================
// UPDATE LIVES
// ===============================================

function updateLives() {

    let hearts =
        "";


    for (
        let i = 0;
        i < MAX_LIVES;
        i++
    ) {

        hearts +=
            i < lives
                ? "❤️ "
                : "🖤 ";

    }


    if (livesEl) {

        livesEl.textContent =
            hearts.trim();

    }

}


// ===============================================
// SHUFFLE
// ===============================================

function shuffle(
    array
) {

    for (
        let i =
            array.length - 1;

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
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array;

}


// ===============================================
// SAVE PROGRESS
// ===============================================

async function saveProgress(
    percentageScore
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
                                "alphabet",

                            activity:
                                "letter-window",

                            score:
                                percentageScore

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "LETTER WINDOW PROGRESS:",
            data
        );

    }

    catch (error) {

        console.error(
            "Progress save error:",
            error
        );

    }

}


// ===============================================
// PLAY AGAIN
// ===============================================

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        () => {

            resultScreen.classList.add(
                "hidden"
            );


            startGame();

        }
    );

}


// ===============================================
// BACK TO ALPHABET
// ===============================================

if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "../alphabet.html";

        }
    );

}


// ===============================================
// NO STUDENT
// ===============================================

if (studentBackButton) {

    studentBackButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "../../students.html";

        }
    );

}


// ===============================================
// START
// ===============================================

if (checkStudent()) {

    startGame();

}
