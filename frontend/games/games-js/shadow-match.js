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
// PC / LAPTOP + MOBILE / TABLET
// ===================================

let activeDragPiece = null;
let activePointerId = null;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerMoved = false;


// ===================================
// DESKTOP HTML5 DRAG + MOBILE POINTER DRAG
// ===================================

function addDragEvents(piece) {

    // Prevent touch scrolling while a shape is being dragged.
    piece.style.touchAction = "none";
    piece.style.userSelect = "none";
    piece.style.webkitUserSelect = "none";
    piece.style.webkitTouchCallout = "none";


    // ---------------------------------
    // DESKTOP HTML5 DRAG START
    // ---------------------------------

    piece.addEventListener(
        "dragstart",
        event => {

            // Touch/pen pointer dragging should use
            // the Pointer Events system.
            if (
                activeDragPiece === piece &&
                activePointerId !== null
            ) {

                event.preventDefault();
                return;

            }


            if (
                gameLocked ||
                piece.classList.contains("used")
            ) {

                event.preventDefault();
                return;

            }


            piece.classList.add("dragging");


            if (event.dataTransfer) {

                event.dataTransfer.effectAllowed = "move";

                event.dataTransfer.setData(
                    "shape",
                    piece.dataset.shape
                );

            }


            if (
                window.soundManager &&
                typeof window.soundManager.playClick ===
                    "function"
            ) {

                window.soundManager.playClick();

            }

        }
    );


    // ---------------------------------
    // DESKTOP HTML5 DRAG END
    // ---------------------------------

    piece.addEventListener(
        "dragend",
        () => {

            piece.classList.remove("dragging");


            document.querySelectorAll(
                ".shadow-slot"
            ).forEach(slot => {

                slot.classList.remove("hover");

            });

        }
    );


    // =================================
    // MOBILE / TABLET POINTER DOWN
    // =================================

    piece.addEventListener(
        "pointerdown",
        event => {

            if (
                gameLocked ||
                piece.classList.contains("used")
            ) {

                return;

            }


            // For a mouse, keep the original HTML5
            // drag-and-drop behavior on PC/laptop.
            if (
                event.pointerType === "mouse"
            ) {

                return;

            }


            activeDragPiece = piece;
            activePointerId = event.pointerId;

            pointerStartX = event.clientX;
            pointerStartY = event.clientY;

            pointerMoved = false;


            try {

                piece.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                // Some older browsers may not support
                // pointer capture. The drag can still continue.

            }


            event.preventDefault();

        }
    );


    // =================================
    // MOBILE / TABLET POINTER MOVE
    // =================================

    piece.addEventListener(
        "pointermove",
        event => {

            if (
                activeDragPiece !== piece ||
                activePointerId !== event.pointerId ||
                gameLocked
            ) {

                return;

            }


            const dx =
                event.clientX -
                pointerStartX;

            const dy =
                event.clientY -
                pointerStartY;


            if (
                Math.abs(dx) > 5 ||
                Math.abs(dy) > 5
            ) {

                pointerMoved = true;

            }


            if (!pointerMoved) {

                return;

            }


            event.preventDefault();


            piece.classList.add(
                "dragging"
            );


            const elementUnderFinger =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            const slot =
                elementUnderFinger
                    ? elementUnderFinger.closest(
                        ".shadow-slot"
                    )
                    : null;


            document.querySelectorAll(
                ".shadow-slot"
            ).forEach(currentSlot => {

                currentSlot.classList.remove(
                    "hover"
                );

            });


            if (
                slot &&
                !slot.classList.contains("correct") &&
                !gameLocked
            ) {

                slot.classList.add(
                    "hover"
                );

            }

        }
    );


    // =================================
    // MOBILE / TABLET POINTER UP
    // =================================

    piece.addEventListener(
        "pointerup",
        event => {

            if (
                activeDragPiece !== piece ||
                activePointerId !== event.pointerId
            ) {

                return;

            }


            event.preventDefault();


            const wasDragged =
                pointerMoved;


            const dropX =
                event.clientX;

            const dropY =
                event.clientY;


            const elementUnderFinger =
                document.elementFromPoint(
                    dropX,
                    dropY
                );


            const slot =
                elementUnderFinger
                    ? elementUnderFinger.closest(
                        ".shadow-slot"
                    )
                    : null;


            piece.classList.remove(
                "dragging"
            );


            document.querySelectorAll(
                ".shadow-slot"
            ).forEach(currentSlot => {

                currentSlot.classList.remove(
                    "hover"
                );

            });


            try {

                piece.releasePointerCapture?.(
                    event.pointerId
                );

            }

            catch (error) {

                // Ignore unsupported pointer capture release.

            }


            activeDragPiece = null;
            activePointerId = null;
            pointerMoved = false;


            // A simple tap should not count as a drop.
            if (!wasDragged) {

                return;

            }


            if (
                gameLocked ||
                piece.classList.contains("used")
            ) {

                return;

            }


            if (
                !slot ||
                slot.classList.contains("correct")
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
    );


    // =================================
    // MOBILE / TABLET POINTER CANCEL
    // =================================

    piece.addEventListener(
        "pointercancel",
        event => {

            if (
                activeDragPiece !== piece ||
                activePointerId !== event.pointerId
            ) {

                return;

            }


            piece.classList.remove(
                "dragging"
            );


            document.querySelectorAll(
                ".shadow-slot"
            ).forEach(slot => {

                slot.classList.remove(
                    "hover"
                );

            });


            try {

                piece.releasePointerCapture?.(
                    event.pointerId
                );

            }

            catch (error) {}


            activeDragPiece = null;
            activePointerId = null;
            pointerMoved = false;

        }
    );

}


// ===================================
// DROP EVENTS
// DESKTOP HTML5 DROP
// ===================================

function addDropEvents(slot) {

    // A slot itself should not start a browser gesture.
    slot.style.touchAction = "none";


    // ---------------------------------
    // DESKTOP DRAG OVER
    // ---------------------------------

    slot.addEventListener(
        "dragover",
        event => {

            event.preventDefault();


            if (
                !slot.classList.contains("correct") &&
                !gameLocked
            ) {

                slot.classList.add(
                    "hover"
                );

            }


            if (event.dataTransfer) {

                event.dataTransfer.dropEffect =
                    "move";

            }

        }
    );


    // ---------------------------------
    // DESKTOP DRAG LEAVE
    // ---------------------------------

    slot.addEventListener(
        "dragleave",
        () => {

            slot.classList.remove(
                "hover"
            );

        }
    );


    // ---------------------------------
    // DESKTOP DROP
    // ---------------------------------

    slot.addEventListener(
        "drop",
        event => {

            event.preventDefault();


            slot.classList.remove(
                "hover"
            );


            if (gameLocked) {

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
                event.dataTransfer
                    ? event.dataTransfer.getData(
                        "shape"
                    )
                    : "";


            const targetShape =
                slot.dataset.shape;


            if (!draggedShape) {

                return;

            }
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
    );

}


// ===================================
// GLOBAL POINTER CLEANUP
// ===================================

document.addEventListener(
    "pointerup",
    event => {

        if (
            activeDragPiece &&
            activePointerId === event.pointerId
        ) {

            activeDragPiece.classList.remove(
                "dragging"
            );


            document.querySelectorAll(
                ".shadow-slot"
            ).forEach(slot => {

                slot.classList.remove(
                    "hover"
                );

            });


            activeDragPiece = null;
            activePointerId = null;
            pointerMoved = false;

        }

    }
);


document.addEventListener(
    "pointercancel",
    event => {

        if (
            activeDragPiece &&
            activePointerId === event.pointerId
        ) {

            activeDragPiece.classList.remove(
                "dragging"
            );


            document.querySelectorAll(
                ".shadow-slot"
            ).forEach(slot => {

                slot.classList.remove(
                    "hover"
                );

            });


            activeDragPiece = null;
            activePointerId = null;
            pointerMoved = false;

        }

    }
);


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

    popup.textContent =
        "🎉 Great Job!";


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


    showStarReward(slot);

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

    try {

        const teacherRaw =
            localStorage.getItem("teacher");

        const studentRaw =
            localStorage.getItem("selectedStudent");


        if (!teacherRaw || !studentRaw) {

            console.warn(
                "Teacher or student information is missing."
            );

            return;

        }


        const teacher =
            JSON.parse(teacherRaw);

        const student =
            JSON.parse(studentRaw);


        if (
            !teacher ||
            !teacher.id ||
            !student ||
            !student.id
        ) {

            console.warn(
                "Invalid teacher or student information."
            );

            return;

        }


        // ---------------------------------
        // CALCULATE PERCENTAGE
        // ---------------------------------

        const maxScore =
            95;


        const percentageScore =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        (score / maxScore) * 100
                    )
                )
            );


        // ---------------------------------
        // CALCULATE STARS
        // ---------------------------------

        let finalStarCount = 1;


        if (
            percentageScore >= 90
        ) {

            finalStarCount = 3;

        }

        else if (
            percentageScore >= 70
        ) {

            finalStarCount = 2;

        }


        // ---------------------------------
        // SAVE TO BACKEND
        // ---------------------------------

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
                            "shapes",

                        activity:
                            "shadow-match",

                        score:
                            percentageScore,

                        stars:
                            finalStarCount

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Shadow Match progress saved:",
            result
        );

    }

    catch (error) {

        console.error(
            "Failed to save Shadow Match progress:",
            error
        );

    }

}


// ===================================
// BACK BUTTON
// ===================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "../shapes.html";

        }
    );

}


// ===================================
// RESTART BUTTON
// ===================================

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        () => {

            if (
                window.soundManager &&
                typeof window.soundManager.playClick ===
                    "function"
            ) {

                window.soundManager.playClick();

            }


            startGame();

        }
    );

}


// ===================================
// PLAY AGAIN BUTTON
// ===================================

if (playAgainBtn) {

    playAgainBtn.addEventListener(
        "click",
        () => {

            if (
                window.soundManager &&
                typeof window.soundManager.playClick ===
                    "function"
            ) {

                window.soundManager.playClick();

            }


            startGame();

        }
    );

}


// ===================================
// FINISH / BACK BUTTON
// ===================================

if (finishBackBtn) {

    finishBackBtn.addEventListener(
        "click",
        () => {

            if (
                window.soundManager &&
                typeof window.soundManager.playClick ===
                    "function"
            ) {

                window.soundManager.playClick();

            }


            window.location.href =
                "../shapes.html";

        }
    );

}


// ===================================
// HINT BUTTON
// ===================================

if (hintBtn) {

    hintBtn.addEventListener(
        "click",
        () => {

            useHint();

        }
    );

}
// ===================================
// LOADING SCREEN
// ===================================

function runLoading() {

    return new Promise(function (resolve) {

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

                    progress += 5;


                    if (
                        progress >= 100
                    ) {

                        progress = 100;


                        loadingBarFill.style.width =
                            "100%";


                        clearInterval(
                            interval
                        );


                        setTimeout(
                            function () {

                                loadingScreen.classList.add(
                                    "hidden"
                                );


                                loadingScreen.style.opacity =
                                    "0";


                                loadingScreen.style.visibility =
                                    "hidden";


                                loadingScreen.style.pointerEvents =
                                    "none";


                                loadingScreen.style.display =
                                    "none";


                                resolve();

                            },
                            300
                        );


                        return;

                    }


                    loadingBarFill.style.width =
                        progress + "%";

                },
                30
            );

    });

}


// ===================================
// INITIALIZE GAME
// ===================================

async function initializeGame() {

    try {

        showStudentName();

        updateDisplay();


        await runLoading();


        startGame();

    }

    catch (error) {

        console.error(
            "Shadow Match initialization error:",
            error
        );


        if (loadingScreen) {

            loadingScreen.classList.add(
                "hidden"
            );


            loadingScreen.style.opacity =
                "0";


            loadingScreen.style.visibility =
                "hidden";


            loadingScreen.style.pointerEvents =
                "none";


            loadingScreen.style.display =
                "none";

        }

    }

}


// ===================================
// BOOT SHADOW MATCH
// ===================================

function bootShadowMatch() {

    if (loadingScreen) {

        loadingScreen.style.display =
            "flex";


        loadingScreen.style.opacity =
            "1";


        loadingScreen.style.visibility =
            "visible";


        loadingScreen.style.pointerEvents =
            "auto";


        loadingScreen.classList.remove(
            "hidden"
        );

    }


    initializeGame();

}


// ===================================
// START AFTER DOM LOAD
// ===================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootShadowMatch
    );

}

else {

    bootShadowMatch();
}