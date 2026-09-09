// ===================================
// KinderQuest
// Shadow Match Game
// ===================================


// ===================================
// GAME SETTINGS
// ===================================

const SHAPES = [
    "circle",
    "square",
    "triangle",
    "rectangle",
    "star",
    "oval",
    "diamond",
    "pentagon"
];


const COLORS = [
    "#ef4444",
    "#ff9f24",
    "#ffd43b",
    "#58b63b",
    "#398ddd",
    "#8b58c8",
    "#ed55a2",
    "#4db7b2"
];


const MAX_LIVES = 3;
const MAX_HINTS = 3;

const API_BASE = "https://kiddoquest-backend.onrender.com/api";


let score = 0;
let lives = MAX_LIVES;
let hints = MAX_HINTS;
let matched = 0;

let gameLocked = false;


// ===================================
// TOUCH DRAG STATE
// (for phones/tablets — native HTML5
// drag events don't work reliably on
// touch, so this is a manual fallback)
// ===================================

let touchDragging = false;
let touchDragPiece = null;
let touchGhost = null;
let touchCurrentSlot = null;


// ===================================
// ELEMENTS
// ===================================

const loadingScreen =
    document.getElementById("loadingScreen");

const loadingBarFill =
    document.getElementById("loadingBarFill");

const shadowContainer =
    document.getElementById("shadowContainer");

const shapeContainer =
    document.getElementById("shapeContainer");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const hintCount =
    document.getElementById("hintCount");

const winModal =
    document.getElementById("winModal");

const finalScore =
    document.getElementById("finalScore");

const studentNameDisplay =
    document.getElementById("studentName");

const backBtn =
    document.getElementById("backBtn");

const restartBtn =
    document.getElementById("restartBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const finishBackBtn =
    document.getElementById("finishBackBtn");

const hintBtn =
    document.getElementById("hintBtn");


// ===================================
// STUDENT NAME
// ===================================

function getSelectedStudent() {

    const keys = [
        "selectedStudent",
        "currentStudent"
    ];

    for (const key of keys) {

        try {

            const raw =
                localStorage.getItem(key) ||
                sessionStorage.getItem(key);

            if (!raw) {
                continue;
            }

            const student =
                JSON.parse(raw);

            if (!student) {
                continue;
            }


            if (
                student.first_name &&
                student.last_name
            ) {

                return `${student.first_name} ${student.last_name}`;

            }


            if (
                student.firstName &&
                student.lastName
            ) {

                return `${student.firstName} ${student.lastName}`;

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

        }

        catch (error) {

            console.warn(
                "Unable to read student:",
                error
            );

        }

    }


    try {

        if (
            window.KQGamesState &&
            window.KQGamesState.currentStudent
        ) {

            const student =
                window.KQGamesState.currentStudent;

            if (student.name) {

                return String(
                    student.name
                );

            }

        }

    }

    catch (error) {}


    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlName =
        params.get("student");

    if (urlName) {

        return urlName;

    }


    return "Player";

}


function showStudentName() {

    if (!studentNameDisplay) {
        return;
    }

    studentNameDisplay.textContent =
        getSelectedStudent();

}


// ===================================
// SHUFFLE
// ===================================

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];

    }

    return result;

}


// ===================================
// CREATE SHAPE
// ===================================

function createShape(
    type,
    color = "#222"
) {

    const shape =
        document.createElement("span");

    shape.className =
        `shape ${type}`;

    shape.style.background =
        color;

    return shape;

}


// ===================================
// UPDATE DISPLAY
// ===================================

function updateDisplay() {

    scoreDisplay.textContent =
        score;

    livesDisplay.textContent =
        lives;

    hintCount.textContent =
        hints;

}


// ===================================
// START GAME
// ===================================

function startGame() {

    score = 0;

    lives = MAX_LIVES;

    hints = MAX_HINTS;

    matched = 0;

    gameLocked = false;


    winModal.classList.add(
        "hidden"
    );


    shadowContainer.innerHTML =
        "";

    shapeContainer.innerHTML =
        "";


    updateDisplay();

    createShadows();

    createShapes();


    // =================================
    // SHARED SOUND MANAGER
    // =================================

    if (
        window.soundManager &&
        typeof window.soundManager.startBackgroundMusic ===
            "function"
    ) {

        window.soundManager.startBackgroundMusic();

    }

}


// ===================================
// CREATE SHADOWS
// ===================================

function createShadows() {

    const shuffledShapes =
        shuffle(SHAPES);


    shuffledShapes.forEach(
        shapeType => {

            const slot =
                document.createElement(
                    "div"
                );

            slot.className =
                "shadow-slot";

            slot.dataset.shape =
                shapeType;


            const shadow =
                createShape(
                    shapeType,
                    "#222"
                );


            shadow.classList.add(
                "shadow-shape"
            );


            slot.appendChild(
                shadow
            );


            addDropEvents(slot);


            shadowContainer.appendChild(
                slot
            );

        }
    );

}


// ===================================
// CREATE DRAGGABLE SHAPES
// ===================================

function createShapes() {

    const shuffledShapes =
        shuffle(SHAPES);


    shuffledShapes.forEach(
        (shapeType, index) => {

            const piece =
                document.createElement(
                    "div"
                );

            piece.className =
                "shape-piece";

            piece.dataset.shape =
                shapeType;

            piece.draggable =
                true;


            const shape =
                createShape(
                    shapeType,
                    COLORS[index]
                );


            piece.appendChild(
                shape
            );


            addDragEvents(piece);


            shapeContainer.appendChild(
                piece
            );

        }
    );

}


// ===================================
// DRAG EVENTS
// ===================================

function addDragEvents(piece) {

    // ===============================
    // DESKTOP (MOUSE) — NATIVE DRAG
    // ===============================

    piece.addEventListener(
        "dragstart",
        event => {

            if (gameLocked) {

                event.preventDefault();

                return;

            }


            piece.classList.add(
                "dragging"
            );


            event.dataTransfer.setData(
                "shape",
                piece.dataset.shape
            );


            if (
                window.soundManager &&
                typeof window.soundManager.playClick ===
                    "function"
            ) {

                window.soundManager.playClick();

            }

        }
    );


    piece.addEventListener(
        "dragend",
        () => {

            piece.classList.remove(
                "dragging"
            );

        }
    );


    // ===============================
    // TOUCH / PEN — MANUAL DRAG
    // ===============================

    piece.style.touchAction =
        "none";


    piece.addEventListener(
        "pointerdown",
        event => {

            // Let native drag handle
            // real mouse input.

            if (
                event.pointerType ===
                "mouse"
            ) {

                return;

            }


            if (gameLocked) {
                return;
            }


            if (
                piece.classList.contains(
                    "used"
                )
            ) {

                return;

            }


            event.preventDefault();


            touchDragging =
                true;

            touchDragPiece =
                piece;


            try {

                piece.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                console.warn(
                    "Pointer capture unavailable."
                );

            }


            piece.classList.add(
                "dragging"
            );


            if (
                window.soundManager &&
                typeof window.soundManager.playClick ===
                    "function"
            ) {

                window.soundManager.playClick();

            }


            createTouchGhost(
                piece,
                event.clientX,
                event.clientY
            );

        },
        {
            passive: false
        }
    );


    piece.addEventListener(
        "pointermove",
        event => {

            if (
                !touchDragging ||
                touchDragPiece !== piece
            ) {

                return;

            }


            event.preventDefault();


            if (touchGhost) {

                touchGhost.style.left =
                    event.clientX + "px";

                touchGhost.style.top =
                    event.clientY + "px";

            }


            const element =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            const slot =
                element
                    ? element.closest(
                        ".shadow-slot"
                    )
                    : null;


            if (
                touchCurrentSlot &&
                touchCurrentSlot !== slot
            ) {

                touchCurrentSlot.classList.remove(
                    "hover"
                );

            }


            touchCurrentSlot =
                slot;


            if (
                touchCurrentSlot &&
                !touchCurrentSlot.classList.contains(
                    "correct"
                ) &&
                !gameLocked
            ) {

                touchCurrentSlot.classList.add(
                    "hover"
                );

            }

        },
        {
            passive: false
        }
    );


    piece.addEventListener(
        "pointerup",
        event => {

            if (
                !touchDragging ||
                touchDragPiece !== piece
            ) {

                return;

            }


            event.preventDefault();


            const element =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            const slot =
                element
                    ? element.closest(
                        ".shadow-slot"
                    )
                    : null;


            resetTouchDrag();


            attemptDrop(
                piece,
                slot
            );

        },
        {
            passive: false
        }
    );


    piece.addEventListener(
        "pointercancel",
        () => {

            resetTouchDrag();

        }
    );

}


// ===================================
// TOUCH GHOST
// (visual copy that follows the finger)
// ===================================

function createTouchGhost(
    piece,
    x,
    y
) {

    removeTouchGhost();


    touchGhost =
        piece.cloneNode(
            true
        );


    touchGhost.classList.add(
        "touch-drag-ghost"
    );


    touchGhost.classList.remove(
        "used"
    );


    touchGhost.style.position =
        "fixed";

    touchGhost.style.left =
        x + "px";

    touchGhost.style.top =
        y + "px";

    touchGhost.style.width =
        piece.offsetWidth + "px";

    touchGhost.style.height =
        piece.offsetHeight + "px";

    touchGhost.style.margin =
        "0";

    touchGhost.style.zIndex =
        "999999";

    touchGhost.style.pointerEvents =
        "none";

    touchGhost.style.opacity =
        "0.9";

    touchGhost.style.transform =
        "translate(-50%, -50%) scale(1.08)";

    touchGhost.style.boxShadow =
        "0 10px 25px rgba(0,0,0,.25)";


    document.body.appendChild(
        touchGhost
    );

}


function removeTouchGhost() {

    if (
        touchGhost &&
        touchGhost.parentNode
    ) {

        touchGhost.parentNode.removeChild(
            touchGhost
        );

    }


    touchGhost =
        null;

}


function resetTouchDrag() {

    if (touchCurrentSlot) {

        touchCurrentSlot.classList.remove(
            "hover"
        );

    }


    touchCurrentSlot =
        null;


    removeTouchGhost();


    if (touchDragPiece) {

        touchDragPiece.classList.remove(
            "dragging"
        );

    }


    touchDragging =
        false;

    touchDragPiece =
        null;

}


// ===================================
// ATTEMPT DROP
// (shared by native drop AND touch
// release, so both paths behave
// identically)
// ===================================

function attemptDrop(
    piece,
    slot
) {

    if (gameLocked) {
        return;
    }


    if (!slot) {
        return;
    }


    if (
        slot.classList.contains(
            "correct"
        )
    ) {

        return;

    }


    const draggedShape =
        piece.dataset.shape;


    const targetShape =
        slot.dataset.shape;


    if (
        draggedShape ===
        targetShape
    ) {

        correctMatch(
            slot,
            draggedShape
        );

    }

    else {

        wrongMatch(slot);

    }

}


// ===================================
// DROP EVENTS
// ===================================

function addDropEvents(slot) {

    slot.addEventListener(
        "dragover",
        event => {

            event.preventDefault();


            if (
                !slot.classList.contains(
                    "correct"
                ) &&
                !gameLocked
            ) {

                slot.classList.add(
                    "hover"
                );

            }

        }
    );


    slot.addEventListener(
        "dragleave",
        () => {

            slot.classList.remove(
                "hover"
            );

        }
    );


    slot.addEventListener(
        "drop",
        event => {

            event.preventDefault();


            slot.classList.remove(
                "hover"
            );


            const draggedShape =
                event.dataTransfer.getData(
                    "shape"
                );


            const piece =
                document.querySelector(
                    `.shape-piece[data-shape="${draggedShape}"]:not(.used)`
                );


            if (!piece) {
                return;
            }


            attemptDrop(
                piece,
                slot
            );

        }
    );

}


// ===================================
// STAR REWARD
// ===================================

function showStarReward(slot) {

    const star =
        document.createElement(
            "span"
        );

    star.className =
        "star-reward";

    star.textContent =
        "⭐";


    slot.appendChild(
        star
    );


    star.addEventListener(
        "animationend",
        () => {

            star.remove();

        }
    );

}


// ===================================
// GREAT JOB
// ===================================

function showGreatJobPopup() {

    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "great-job-popup";


    const star =
        document.createElement(
            "span"
        );

    star.className =
        "popup-star";

    star.textContent =
        "⭐";


    const text =
        document.createElement(
            "span"
        );

    text.className =
        "popup-text";

    text.textContent =
        "Great Job!";


    popup.appendChild(
        star
    );

    popup.appendChild(
        text
    );


    document.body.appendChild(
        popup
    );


    popup.addEventListener(
        "animationend",
        () => {

            popup.remove();

        }
    );

}


// ===================================
// CORRECT MATCH
// ===================================

function correctMatch(
    slot,
    shapeType
) {

    slot.classList.add(
        "correct"
    );


    const piece =
        document.querySelector(
            `.shape-piece[data-shape="${shapeType}"]:not(.used)`
        );


    if (piece) {

        piece.classList.add(
            "used"
        );

    }


    const oldShape =
        slot.querySelector(
            ".shape"
        );


    if (oldShape) {

        oldShape.remove();

    }


    const colorIndex =
        SHAPES.indexOf(
            shapeType
        );


    const newShape =
        createShape(
            shapeType,
            COLORS[colorIndex]
        );


    slot.appendChild(
        newShape
    );


    matched++;

    score += 10;


    updateDisplay();


    // =================================
    // CORRECT SOUND
    // =================================

    if (
        window.soundManager &&
        typeof window.soundManager.playCorrect ===
            "function"
    ) {

        window.soundManager.playCorrect();

    }


    showGreatJobPopup();


    // =================================
    // ALL MATCHED
    // =================================

    if (
        matched ===
        SHAPES.length
    ) {

        setTimeout(
            finishGame,
            700
        );

    }

}


// ===================================
// WRONG MATCH
//
// SIGN: RED BORDER + SHAKE ON THE SLOT
// THAT WAS DROPPED ON — NO X, NO TEXT.
// BUILT ENTIRELY IN JS (INLINE STYLE +
// WEB ANIMATIONS API) SO IT DOESN'T
// DEPEND ON A SEPARATE CSS FILE.
// ===================================

function wrongMatch(slot) {

    lives--;

    updateDisplay();


    // =================================
    // WRONG SOUND
    // =================================

    if (
        window.soundManager &&
        typeof window.soundManager.playWrong ===
            "function"
    ) {

        window.soundManager.playWrong();

    }


    if (slot) {

        const previousBorderColor =
            slot.style.borderColor;

        const previousBoxShadow =
            slot.style.boxShadow;


        slot.style.borderColor =
            "#e35d5d";

        slot.style.boxShadow =
            "0 0 0 3px rgba(227, 93, 93, 0.35)";


        slot.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-8px)" },
                { transform: "translateX(8px)" },
                { transform: "translateX(-5px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 350,
                iterations: 1
            }
        );


        setTimeout(
            () => {

                slot.style.borderColor =
                    previousBorderColor;

                slot.style.boxShadow =
                    previousBoxShadow;

            },
            400
        );

    }


    if (lives <= 0) {

        gameLocked = true;


        setTimeout(
            finishGame,
            500
        );

    }

}


// ===================================
// HINT
// ===================================

function useHint() {

    if (
        hints <= 0 ||
        gameLocked
    ) {

        return;

    }


    const availablePiece =
        document.querySelector(
            ".shape-piece:not(.used)"
        );


    if (!availablePiece) {
        return;
    }


    hints--;


    if (
        window.soundManager &&
        typeof window.soundManager.playClick ===
            "function"
    ) {

        window.soundManager.playClick();

    }


    availablePiece.animate(
        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.25)"
            },

            {
                transform:
                    "scale(1)"
            }
        ],
        {
            duration: 800,
            iterations: 2
        }
    );


    updateDisplay();

}


// ===================================
// FINISH GAME
// ===================================

async function finishGame() {

    if (gameLocked === false) {

        gameLocked = true;

    }


    // Bonus points for remaining lives.
    score += lives * 5;


    finalScore.textContent =
        score;


    winModal.classList.remove(
        "hidden"
    );


    if (
        window.soundManager &&
        typeof window.soundManager.playCorrect ===
            "function"
    ) {

        window.soundManager.playCorrect();

    }


    if (
        window.soundManager &&
        typeof window.soundManager.stopBackgroundMusic ===
            "function"
    ) {

        window.soundManager.stopBackgroundMusic();

    }


    await saveProgress();

}


// ===================================
// SAVE PROGRESS
// ===================================

async function saveProgress() {

    const teacherRaw =
        localStorage.getItem(
            "teacher"
        );


    const studentRaw =
        localStorage.getItem(
            "selectedStudent"
        );


    if (
        !teacherRaw ||
        !studentRaw
    ) {

        console.log(
            "Shadow Match: progress not saved. Teacher or student missing."
        );

        return;

    }


    try {

        const teacher =
            JSON.parse(
                teacherRaw
            );


        const student =
            JSON.parse(
                studentRaw
            );


        if (
            !teacher ||
            !teacher.id ||
            !student ||
            !student.id
        ) {

            console.log(
                "Shadow Match: missing teacher_id or student_id."
            );

            return;

        }


        // =================================
        // SCORE
        // Maximum normal score:
        // 8 matches x 10 = 80
        // plus maximum life bonus = 15
        // =================================

        const percentageScore =
            Math.min(
                100,
                Math.round(
                    (
                        score /
                        95
                    ) * 100
                )
            );


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
                                teacher.id,

                            student_id:
                                student.id,

                            category:
                                "shapes",

                            activity:
                                "shadow-match",

                            score:
                                percentageScore,

                            stars:
                                Math.min(
                                    3,
                                    Math.max(
                                        1,
                                        Math.ceil(
                                            percentageScore /
                                            34
                                        )
                                    )
                                )

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Progress save failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "SHADOW MATCH PROGRESS SAVED:",
            data
        );

    }

    catch (error) {

        console.error(
            "Shadow Match progress error:",
            error
        );

    }

}


// ===================================
// BUTTON SOUND
// ===================================

function buttonSound() {

    if (
        window.soundManager &&
        typeof window.soundManager.playButton ===
            "function"
    ) {

        window.soundManager.playButton();

    }

}


// ===================================
// RESTART
// ===================================

restartBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        startGame();

    }
);


// ===================================
// PLAY AGAIN
// ===================================

playAgainBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        startGame();

    }
);


// ===================================
// HINT
// ===================================

hintBtn.addEventListener(
    "click",
    () => {

        useHint();

    }
);


// ===================================
// BACK BUTTON - HEADER
// ===================================

backBtn.addEventListener(
    "click",
    () => {

        buttonSound();


        if (
            window.soundManager &&
            typeof window.soundManager.stopBackgroundMusic ===
                "function"
        ) {

            window.soundManager.stopBackgroundMusic();

        }


        window.location.href =
            "../shapes.html";

    }
);


// ===================================
// BACK BUTTON - FINISH
// ===================================

finishBackBtn.addEventListener(
    "click",
    () => {

        buttonSound();


        if (
            window.soundManager &&
            typeof window.soundManager.stopBackgroundMusic ===
                "function"
        ) {

            window.soundManager.stopBackgroundMusic();

        }


        window.location.href =
            "../shapes.html";

    }
);


// ===================================
// INITIAL LOADING
// SAME STYLE ACROSS ALL KINDERQUEST GAMES
// ===================================

function runInitialLoading() {

    if (
        !loadingScreen ||
        !loadingBarFill
    ) {

        showStudentName();

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


                            showStudentName();

                            startGame();

                        },
                        250
                    );

                }

            },
            70
        );

}


// ===================================
// START
// ===================================

runInitialLoading();