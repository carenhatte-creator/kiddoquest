// =========================================================
// KINDERQUEST - SHAPE PUZZLE
// REAL MISSING LARGE PIECE
// Shapes: Circle, Square, Triangle, Rectangle, Oval,
//         Hexagon, Diamond, Star, Pentagon
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // SETTINGS
    // =====================================================

    const MAX_LIVES = 3;
    const POINTS_PER_PUZZLE = 10;
    const TOTAL_QUESTIONS = 10;

    const PROGRESS_API =
        "http://localhost:5001/api/progress";


    // =====================================================
    // ELEMENTS
    // =====================================================

    const loadingScreen =
        document.getElementById("loadingScreen");

    const loadingBarFill =
        document.getElementById("loadingBarFill");

// loadingPercent removed — not part of the standardized loading screen anymore

    const scoreElement =
        document.getElementById("score");

    const livesElement =
        document.getElementById("lives");

    const levelElement =
        document.getElementById("level");

    const questionNumberElement =
        document.getElementById("questionNumber");

    const totalQuestionsElement =
        document.getElementById("totalQuestions");

    const playingStudentName =
        document.getElementById("playingStudentName");

    const puzzleArea =
        document.getElementById("puzzleArea");

    const choices =
        document.getElementById("choices");

    const instruction =
        document.getElementById("instruction");

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


    // =====================================================
    // GAME VARIABLES
    // =====================================================

    let currentQuestion = 0;
    let score = 0;
    let lives = MAX_LIVES;
    let locked = false;
    let progressSaved = false;

    let currentPuzzle = null;


    // =====================================================
    // SHAPES
    // =====================================================

    const shapeLibrary = [

        {
            type: "circle",
            name: "Circle",
            title: "Complete the Circle!",
            color: "#55b9f3",
            stroke: "#348fca",
            kind: "ellipse",
            cx: 350,
            cy: 190,
            rx: 125,
            ry: 125
        },

        {
            type: "square",
            name: "Square",
            title: "Complete the Square!",
            color: "#ff6f91",
            stroke: "#d94e72",
            kind: "polygon",
            points: [
                [245, 75],
                [455, 75],
                [455, 285],
                [245, 285]
            ]
        },

        {
            type: "triangle",
            name: "Triangle",
            title: "Complete the Triangle!",
            color: "#59c878",
            stroke: "#329653",
            kind: "polygon",
            points: [
                [350, 55],
                [500, 300],
                [200, 300]
            ]
        },

        {
            type: "rectangle",
            name: "Rectangle",
            title: "Complete the Rectangle!",
            color: "#ffb84d",
            stroke: "#d98a1e",
            kind: "polygon",
            points: [
                [180, 105],
                [520, 105],
                [520, 275],
                [180, 275]
            ]
        },

        {
            type: "oval",
            name: "Oval",
            title: "Complete the Oval!",
            color: "#a66cf2",
            stroke: "#7045c9",
            kind: "ellipse",
            cx: 350,
            cy: 190,
            rx: 155,
            ry: 105
        },

        {
            type: "hexagon",
            name: "Hexagon",
            title: "Complete the Hexagon!",
            color: "#ffd34e",
            stroke: "#d9a900",
            kind: "polygon",
            points: [
                [350, 55],
                [485, 130],
                [485, 270],
                [350, 345],
                [215, 270],
                [215, 130]
            ]
        },

        {
            type: "diamond",
            name: "Diamond",
            title: "Complete the Diamond!",
            color: "#ff8a65",
            stroke: "#d95c38",
            kind: "polygon",
            points: [
                [350, 45],
                [495, 195],
                [350, 345],
                [205, 195]
            ]
        },

        {
            type: "star",
            name: "Star",
            title: "Complete the Star!",
            color: "#ffc928",
            stroke: "#e0a500",
            kind: "polygon",
            points: [
                [350, 40],
                [390, 145],
                [505, 145],
                [412, 210],
                [448, 325],
                [350, 255],
                [252, 325],
                [288, 210],
                [195, 145],
                [310, 145]
            ]
        },

        {
            type: "pentagon",
            name: "Pentagon",
            title: "Complete the Pentagon!",
            color: "#55c7f4",
            stroke: "#348fca",
            kind: "polygon",
            points: [
                [350, 50],
                [495, 155],
                [440, 320],
                [260, 320],
                [205, 155]
            ]
        }

    ];


    // =====================================================
    // SOUND
    // =====================================================

    function playSound(type) {

        try {

            if (!window.soundManager) {
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

            if (
                type === "button" &&
                typeof window.soundManager.playButton === "function"
            ) {
                window.soundManager.playButton();
                return;
            }

        } catch (error) {

            console.error(
                "Shape Puzzle sound error:",
                error
            );

        }

    }


    // =====================================================
    // STUDENT
    // =====================================================

    function getStudent() {

        const keys = [
            "selectedStudent",
            "currentStudent",
            "playingStudent"
        ];

        for (const key of keys) {

            const raw =
                localStorage.getItem(key);

            if (!raw) {
                continue;
            }

            try {

                const student =
                    JSON.parse(raw);

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


    function getStudentName() {

        const student =
            getStudent();

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

        return (
            student.fullName ||
            student.name ||
            "Student"
        );
    }


    function getStudentId() {

        const student =
            getStudent();

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


    // =====================================================
    // TEACHER
    // =====================================================

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


    function getTeacherId() {

        const teacher =
            getTeacher();

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


    // =====================================================
    // DISPLAY STUDENT
    // =====================================================

    function displayStudentName() {

        const name =
            getStudentName();

        if (playingStudentName) {
            playingStudentName.textContent = name;
        }

        if (resultPlayer) {
            resultPlayer.textContent = name;
        }

    }


    // =====================================================
    // STATUS
    // =====================================================

    function updateStatus() {

        if (scoreElement) {
            scoreElement.textContent = score;
        }

        if (livesElement) {

            livesElement.textContent =
                "❤️".repeat(
                    Math.max(0, lives)
                ) +
                "🤍".repeat(
                    Math.max(
                        0,
                        MAX_LIVES - lives
                    )
                );

        }

        if (levelElement) {

            const level =
                Math.min(
                    3,
                    Math.floor(
                        currentQuestion / 3
                    ) + 1
                );

            levelElement.textContent =
                level;
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


    // =====================================================
    // BACKGROUND
    // =====================================================

    function sceneBackground() {

        return `

            <circle
                cx="70"
                cy="65"
                r="25"
                fill="#ffffff"
                opacity=".85"
            />

            <circle
                cx="95"
                cy="60"
                r="34"
                fill="#ffffff"
                opacity=".85"
            />

            <circle
                cx="125"
                cy="68"
                r="25"
                fill="#ffffff"
                opacity=".85"
            />

            <circle
                cx="600"
                cy="62"
                r="32"
                fill="#ffffff"
                opacity=".8"
            />

            <circle
                cx="625"
                cy="68"
                r="28"
                fill="#ffffff"
                opacity=".8"
            />

            <rect
                x="0"
                y="275"
                width="700"
                height="115"
                fill="#92d77a"
            />

            <path
                d="M0 290 Q170 245 340 290 T700 280 V390 H0Z"
                fill="#79c96b"
                opacity=".8"
            />

        `;

    }


    // =====================================================
    // SVG WRAPPER
    // =====================================================

    function svgWrap(content) {

        return `
            <svg
                class="puzzle-svg"
                viewBox="0 0 700 390"
                xmlns="http://www.w3.org/2000/svg"
            >
                ${content}
            </svg>
        `;

    }


    // =====================================================
    // RANDOM SPLIT
    // IMPORTANT:
    // 42% - 58% ONLY
    // So the missing piece is always large enough.
    // =====================================================

    function randomSplit() {

        return (
            0.42 +
            Math.random() * 0.16
        );

    }


    // =====================================================
    // RANDOM SIDE
    // =====================================================

    function randomSide() {

        return Math.random() < 0.5
            ? "left"
            : "right";

    }


    // =====================================================
    // RANDOM DIRECTION
    // =====================================================

    function randomDirection() {

        return Math.random() < 0.5
            ? "vertical"
            : "horizontal";

    }


    // =====================================================
    // POLYGON CLIPPING
    // =====================================================

    function clipPolygon(points, axis, value, keepLess) {

        const result = [];

        if (!points.length) {
            return result;
        }

        function inside(point) {

            if (axis === "x") {

                return keepLess
                    ? point[0] <= value
                    : point[0] >= value;

            }

            return keepLess
                ? point[1] <= value
                : point[1] >= value;

        }


        function intersection(a, b) {

            if (axis === "x") {

                const dx =
                    b[0] - a[0];

                if (Math.abs(dx) < 0.0001) {
                    return [value, a[1]];
                }

                const t =
                    (value - a[0]) / dx;

                return [
                    value,
                    a[1] +
                    (b[1] - a[1]) * t
                ];

            }

            const dy =
                b[1] - a[1];

            if (Math.abs(dy) < 0.0001) {
                return [a[0], value];
            }

            const t =
                (value - a[1]) / dy;

            return [
                a[0] +
                (b[0] - a[0]) * t,
                value
            ];

        }


        for (
            let i = 0;
            i < points.length;
            i++
        ) {

            const current =
                points[i];

            const previous =
                points[
                    (i - 1 + points.length) %
                    points.length
                ];

            const currentInside =
                inside(current);

            const previousInside =
                inside(previous);


            if (
                currentInside &&
                previousInside
            ) {

                result.push(current);

            } else if (
                previousInside &&
                !currentInside
            ) {

                result.push(
                    intersection(
                        previous,
                        current
                    )
                );

            } else if (
                !previousInside &&
                currentInside
            ) {

                result.push(
                    intersection(
                        previous,
                        current
                    )
                );

                result.push(current);

            }

        }


        return result;

    }


    // =====================================================
    // POINTS STRING
    // =====================================================

    function pointsString(points) {

        return points
            .map(
                p =>
                    `${p[0].toFixed(2)},${p[1].toFixed(2)}`
            )
            .join(" ");

    }


    // =====================================================
    // ELLIPSE SPLIT PATH
    // =====================================================

    function ellipsePieces(shape, split) {

        const {
            cx,
            cy,
            rx,
            ry
        } = shape;


        const xCut =
            cx +
            rx *
            (split - 0.5) *
            2;


        const ratio =
            Math.max(
                -0.999,
                Math.min(
                    0.999,
                    (xCut - cx) / rx
                )
            );


        const theta =
            Math.acos(ratio);


        const topX =
            xCut;

        const topY =
            cy -
            ry *
            Math.sqrt(
                1 -
                ratio * ratio
            );


        const bottomX =
            xCut;

        const bottomY =
            cy +
            ry *
            Math.sqrt(
                1 -
                ratio * ratio
            );


        const rightPath = `
            M ${topX} ${topY}
            A ${rx} ${ry} 0 0 1 ${bottomX} ${bottomY}
            L ${topX} ${topY}
            Z
        `;


        const leftPath = `
            M ${topX} ${topY}
            A ${rx} ${ry} 0 1 0 ${bottomX} ${bottomY}
            L ${topX} ${topY}
            Z
        `;


        return {

            left: leftPath,

            right: rightPath,

            cutX: xCut,

            theta: theta

        };

    }


    // =====================================================
    // GET PIECES
    // =====================================================

    function getPieces(shape) {

        const split =
            randomSplit();


        // -----------------------------------------------
        // CIRCLE / OVAL
        // -----------------------------------------------

        if (shape.kind === "ellipse") {

            const ellipse =
                ellipsePieces(
                    shape,
                    split
                );


            const missingSide =
                randomSide();


            return {

                type: shape.type,

                shape: shape,

                split: split,

                orientation: "vertical",

                missingSide: missingSide,

                missingPath:
                    missingSide === "left"
                        ? ellipse.left
                        : ellipse.right,

                remainingPath:
                    missingSide === "left"
                        ? ellipse.right
                        : ellipse.left

            };

        }


        // -----------------------------------------------
        // POLYGON
        // -----------------------------------------------

        const direction =
            randomDirection();


        const side =
            randomSide();


        const axis =
            direction === "vertical"
                ? "x"
                : "y";


        const xs =
            shape.points.map(
                p => p[0]
            );

        const ys =
            shape.points.map(
                p => p[1]
            );


        const min =
            axis === "x"
                ? Math.min(...xs)
                : Math.min(...ys);


        const max =
            axis === "x"
                ? Math.max(...xs)
                : Math.max(...ys);


        const cut =
            min +
            (max - min) *
            split;


        const less =
            clipPolygon(
                shape.points,
                axis,
                cut,
                true
            );


        const greater =
            clipPolygon(
                shape.points,
                axis,
                cut,
                false
            );


        const missing =
            side === "left"
                ? less
                : greater;


        const remaining =
            side === "left"
                ? greater
                : less;


        return {

            type: shape.type,

            shape: shape,

            split: split,

            orientation: direction,

            missingSide: side,

            cut: cut,

            missingPoints: missing,

            remainingPoints: remaining

        };

    }


    // =====================================================
    // CREATE PUZZLE
    // =====================================================

    function createPuzzle() {

        const shape =
            shapeLibrary[
                currentQuestion %
                shapeLibrary.length
            ];


        return {

            ...shape,

            pieces:
                getPieces(shape)

        };

    }


    // =====================================================
    // POLYGON ELEMENT
    // =====================================================

    function polygonElement(
        points,
        shape,
        extraClass = ""
    ) {

        return `
            <polygon
                ${extraClass ? `class="${extraClass}"` : ""}
                points="${pointsString(points)}"
                fill="${shape.color}"
                stroke="${shape.stroke}"
                stroke-width="7"
                stroke-linejoin="round"
            />
        `;

    }


    // =====================================================
    // MISSING OUTLINE
    // =====================================================

    function polygonMissingOutline(
        points
    ) {

        return `
            <polygon
                class="missing-area"
                points="${pointsString(points)}"
            />
        `;

    }


    // =====================================================
    // RENDER POLYGON PUZZLE
    // =====================================================

    function renderPolygonPuzzle(
        puzzle,
        completed
    ) {

        const shape =
            puzzle;

        const pieces =
            puzzle.pieces;


        let object = "";


        if (completed) {

            object +=
                polygonElement(
                    shape.points,
                    shape,
                    "scene-object"
                );

        } else {

            object +=
                polygonElement(
                    pieces.remainingPoints,
                    shape,
                    "scene-object"
                );


            object +=
                polygonMissingOutline(
                    pieces.missingPoints
                );

        }


        return svgWrap(
            sceneBackground() +
            `<g>${object}</g>`
        );

    }


    // =====================================================
    // RENDER ELLIPSE PUZZLE
    // =====================================================

    function renderEllipsePuzzle(
        puzzle,
        completed
    ) {

        const shape =
            puzzle;

        const pieces =
            puzzle.pieces;


        let object = "";


        if (completed) {

            object += `
                <ellipse
                    class="scene-object"
                    cx="${shape.cx}"
                    cy="${shape.cy}"
                    rx="${shape.rx}"
                    ry="${shape.ry}"
                    fill="${shape.color}"
                    stroke="${shape.stroke}"
                    stroke-width="7"
                />
            `;

        } else {

            object += `
                <path
                    class="scene-object"
                    d="${pieces.remainingPath}"
                    fill="${shape.color}"
                    stroke="${shape.stroke}"
                    stroke-width="7"
                />
            `;


            object += `
                <path
                    class="missing-area"
                    d="${pieces.missingPath}"
                />
            `;

        }


        return svgWrap(
            sceneBackground() +
            `<g>${object}</g>`
        );

    }


    // =====================================================
    // RENDER PUZZLE
    // =====================================================

    function renderPuzzle(
        puzzle,
        completed = false
    ) {

        if (!puzzle) {
            return "";
        }


        if (
            puzzle.kind ===
            "ellipse"
        ) {

            return renderEllipsePuzzle(
                puzzle,
                completed
            );

        }


        return renderPolygonPuzzle(
            puzzle,
            completed
        );

    }


    // =====================================================
    // GET BOUNDING BOX
    // =====================================================

    function getPointsBounds(points) {

        const xs =
            points.map(
                p => p[0]
            );

        const ys =
            points.map(
                p => p[1]
            );


        return {

            minX: Math.min(...xs),

            maxX: Math.max(...xs),

            minY: Math.min(...ys),

            maxY: Math.max(...ys)

        };

    }


    // =====================================================
    // NORMALIZE POLYGON FOR CHOICE
    // =====================================================

    function normalizePoints(points) {

        const bounds =
            getPointsBounds(points);


        const width =
            bounds.maxX -
            bounds.minX;


        const height =
            bounds.maxY -
            bounds.minY;


        const padding = 7;


        const targetWidth =
            82;


        const targetHeight =
            66;


        const scale =
            Math.min(
                targetWidth / Math.max(width, 1),
                targetHeight / Math.max(height, 1)
            );


        return points
            .map(
                p => [

                    50 +
                    (p[0] -
                        (bounds.minX +
                        bounds.maxX) / 2) *
                    scale,

                    40 +
                    (p[1] -
                        (bounds.minY +
                        bounds.maxY) / 2) *
                    scale

                ]
            );

    }


    // =====================================================
    // CHOICE SVG FOR CURRENT PUZZLE
    // =====================================================

    function choiceSvg(
        puzzle
    ) {

        const shape =
            puzzle;

        const pieces =
            puzzle.pieces;


        // -----------------------------------------------
        // ELLIPSE PIECE
        // -----------------------------------------------

        if (
            shape.kind ===
            "ellipse"
        ) {

            const viewBox =
                `190 45 320 290`;


            return `
                <svg
                    class="choice-svg"
                    viewBox="${viewBox}"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >

                    <path
                        d="${pieces.missingPath}"
                        fill="${shape.color}"
                        stroke="${shape.stroke}"
                        stroke-width="7"
                    />

                </svg>
            `;

        }


        // -----------------------------------------------
        // POLYGON PIECE
        // -----------------------------------------------

        const normalized =
            normalizePoints(
                pieces.missingPoints
            );


        return `
            <svg
                class="choice-svg"
                viewBox="0 0 100 80"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
            >

                <polygon
                    points="${pointsString(normalized)}"
                    fill="${shape.color}"
                    stroke="${shape.stroke}"
                    stroke-width="5"
                    stroke-linejoin="round"
                />

            </svg>
        `;

    }


    // =====================================================
    // WRONG CHOICE SHAPES
    // =====================================================

    function getWrongChoices() {

        const wrong =
            shapeLibrary.filter(
                shape =>
                    shape.type !==
                    currentPuzzle.type
            );


        // shuffle wrong shapes

        for (
            let i = wrong.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                wrong[i],
                wrong[j]
            ] =
            [
                wrong[j],
                wrong[i]
            ];

        }


        return [
            wrong[0],
            wrong[1]
        ];

    }


    // =====================================================
    // CREATE WRONG PIECE
    // =====================================================

    function createWrongPiece(
        shape
    ) {

        const fakePuzzle = {

            ...shape,

            pieces:
                getPieces(shape)

        };


        return fakePuzzle;

    }


    // =====================================================
    // CREATE CHOICE
    // =====================================================

    function createChoice(
        puzzle,
        isCorrect
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "shape-choice";


        button.dataset.correct =
            isCorrect
                ? "true"
                : "false";


        button.setAttribute(
            "aria-label",
            isCorrect
                ? "Missing shape piece"
                : "Shape piece choice"
        );


        button.innerHTML =
            choiceSvg(
                puzzle
            );


        button.addEventListener(
            "click",
            function () {

                if (locked) {
                    return;
                }


                handleChoice(
                    isCorrect,
                    button
                );

            }
        );


        choices.appendChild(
            button
        );

    }


    // =====================================================
    // SHUFFLE
    // =====================================================

    function shuffle(array) {

        const result =
            [...array];


        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                result[i],
                result[j]
            ] =
            [
                result[j],
                result[i]
            ];

        }


        return result;

    }


    // =====================================================
    // LOAD PUZZLE
    // =====================================================

    function loadPuzzle() {

        if (
            currentQuestion >=
            TOTAL_QUESTIONS
        ) {

            finishGame();

            return;

        }


        locked = false;


        // Create a brand-new puzzle
        // so the split is randomized.

        currentPuzzle =
            createPuzzle();


        updateStatus();


        if (instruction) {

            instruction.textContent =
                currentPuzzle.title;

        }


        // -----------------------------------------------
        // DRAW PUZZLE
        // -----------------------------------------------

        if (puzzleArea) {

            puzzleArea.innerHTML =
                renderPuzzle(
                    currentPuzzle,
                    false
                );

        }


        // -----------------------------------------------
        // CREATE CHOICES
        // -----------------------------------------------

        if (choices) {

            choices.innerHTML = "";


            const wrongShapes =
                getWrongChoices();


            const correctChoice = {

                puzzle:
                    currentPuzzle,

                correct:
                    true

            };


            const wrongChoiceOne = {

                puzzle:
                    createWrongPiece(
                        wrongShapes[0]
                    ),

                correct:
                    false

            };


            const wrongChoiceTwo = {

                puzzle:
                    createWrongPiece(
                        wrongShapes[1]
                    ),

                correct:
                    false

            };


            const allChoices =
                shuffle([
                    correctChoice,
                    wrongChoiceOne,
                    wrongChoiceTwo
                ]);


            allChoices.forEach(
                item => {

                    createChoice(
                        item.puzzle,
                        item.correct
                    );

                }
            );

        }

    }


    // =====================================================
    // HANDLE CHOICE
    // =====================================================

    function handleChoice(
        isCorrect,
        button
    ) {

        if (isCorrect) {

            handleCorrect(
                button
            );

        } else {

            handleWrong(
                button
            );

        }

    }


    // =====================================================
    // CORRECT
    // =====================================================

    function handleCorrect(
        button
    ) {

        locked = true;


        score +=
            POINTS_PER_PUZZLE;


        updateStatus();


        playSound(
            "correct"
        );


        button.disabled =
            true;


        // Show the complete shape.

        if (puzzleArea) {

            puzzleArea.innerHTML =
                renderPuzzle(
                    currentPuzzle,
                    true
                );

        }


        showFeedback(
            "🎉",
            "Great job! You found the missing piece!"
        );


        setTimeout(
            function () {

                hideFeedback();


                currentQuestion++;


                if (
                    currentQuestion >=
                    TOTAL_QUESTIONS
                ) {

                    finishGame();

                } else {

                    loadPuzzle();

                }

            },
            900
        );

    }


    // =====================================================
    // WRONG
    // =====================================================

    function handleWrong(
        button
    ) {

        lives--;


        updateStatus();


        playSound(
            "wrong"
        );


        button.classList.remove(
            "wrong-shake"
        );


        void button.offsetWidth;


        button.classList.add(
            "wrong-shake"
        );


        showFeedback(
            "💭",
            "Try again! Look at the missing piece."
        );


        setTimeout(
            function () {

                button.classList.remove(
                    "wrong-shake"
                );


                hideFeedback();

            },
            700
        );


        if (lives <= 0) {

            locked = true;


            setTimeout(
                function () {

                    finishGame();

                },
                750
            );

        }

    }


    // =====================================================
    // FEEDBACK
    // =====================================================

    function showFeedback(
        icon,
        message
    ) {

        if (!feedback) {
            return;
        }


        if (feedbackIcon) {

            feedbackIcon.textContent =
                icon;

        }


        if (feedbackText) {

            feedbackText.textContent =
                message;

        }


        feedback.classList.add(
            "show"
        );

    }


    function hideFeedback() {

        if (!feedback) {
            return;
        }


        feedback.classList.remove(
            "show"
        );

    }


    // =====================================================
    // STARS
    // =====================================================

    function calculateStars() {

        if (score >= 90) {
            return 3;
        }

        if (score >= 60) {
            return 2;
        }

        if (score > 0) {
            return 1;
        }

        return 0;

    }


    // =====================================================
    // STATUS
    // =====================================================

    function getStatus() {

        if (
            currentQuestion >=
            TOTAL_QUESTIONS
        ) {

            return "Completed";

        }

        if (score >= 50) {
            return "In Progress";
        }

        if (score > 0) {
            return "Needs Practice";
        }

        return "Not Started";

    }


    // =====================================================
    // LOCAL SAVE
    // =====================================================

    function saveLocalProgress(
        data
    ) {

        try {

            localStorage.setItem(
                "shapePuzzleProgress",
                JSON.stringify(data)
            );


            localStorage.setItem(
                "kq_shape_puzzle_progress",
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "Shape Puzzle local save error:",
                error
            );

        }

    }


    // =====================================================
    // BACKEND SAVE
    // =====================================================

    async function saveProgress() {

        const studentId =
            getStudentId();


        const teacherId =
            getTeacherId();


        const playerName =
            getStudentName();


        const stars =
            calculateStars();


        const progress = {

            teacher_id:
                teacherId,

            student_id:
                studentId,

            category:
                "shapes",

            activity:
                "Shape Puzzle",

            score:
                score,

            stars:
                stars,

            status:
                getStatus(),

            player:
                playerName,

            student_name:
                playerName,

            level:
                Math.min(
                    3,
                    Math.ceil(
                        Math.max(
                            1,
                            currentQuestion
                        ) / 3
                    )
                ),

            game:
                "shape-puzzle",

            game_name:
                "Shape Puzzle",

            date:
                new Date().toISOString(),

            created_at:
                new Date().toISOString()

        };


        saveLocalProgress(
            progress
        );


        if (!studentId) {

            console.warn(
                "Shape Puzzle: Student ID not found."
            );

            return false;

        }


        if (!teacherId) {

            console.warn(
                "Shape Puzzle: Teacher ID not found."
            );

            return false;

        }


        try {

            const response =
                await fetch(
                    PROGRESS_API +
                    "/save",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                progress
                            )

                    }
                );


            if (!response.ok) {

                console.error(
                    "Shape Puzzle save failed:",
                    response.status
                );

                return false;

            }


            progressSaved =
                true;


            return true;

        } catch (error) {

            console.error(
                "Shape Puzzle backend error:",
                error
            );

            return false;

        }

    }


    // =====================================================
    // FINISH
    // =====================================================

    async function finishGame() {

        locked = true;


        hideFeedback();


        const stars =
            calculateStars();


        if (finalScore) {

            finalScore.textContent =
                score;

        }


        if (resultPlayer) {

            resultPlayer.textContent =
                getStudentName();

        }


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


        if (resultMessage) {

            if (stars === 3) {

                resultMessage.textContent =
                    "Amazing! You are a Shape Puzzle Star!";

            } else if (stars === 2) {

                resultMessage.textContent =
                    "Great job! Keep practicing!";

            } else if (stars === 1) {

                resultMessage.textContent =
                    "Good try! Keep learning shapes!";

            } else {

                resultMessage.textContent =
                    "Keep trying! You can do it!";

            }

        }


        await saveProgress();


        if (resultScreen) {

            resultScreen.style.display =
                "flex";

        }


        if (stars > 0) {

            playSound(
                "correct"
            );

        } else {

            playSound(
                "wrong"
            );

        }

    }


    // =====================================================
    // PLAY AGAIN
    // =====================================================

    if (playAgainButton) {

        playAgainButton.addEventListener(
            "click",
            function () {

                playSound(
                    "button"
                );


                if (resultScreen) {

                    resultScreen.style.display =
                        "none";

                }


                currentQuestion = 0;

                score = 0;

                lives =
                    MAX_LIVES;

                locked = false;

                progressSaved =
                    false;

                currentPuzzle =
                    null;


                displayStudentName();

                updateStatus();

                loadPuzzle();

            }
        );

    }


    // =====================================================
    // BACK
    // =====================================================

    function goBack() {

        playSound(
            "button"
        );


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


    // =====================================================
    // START GAME
    // =====================================================

    function startGame() {

        displayStudentName();

        updateStatus();

        loadPuzzle();

    }


    // =====================================================
    // QUICK LOADING
    // SAME STYLE ACROSS ALL KINDERQUEST GAMES
    // =====================================================

    function runLoading() {

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


        const timer =
            setInterval(
                function () {

                    progress += 5;


                    loadingBarFill.style.width =
                        progress + "%";


                    if (
                        progress >=
                        100
                    ) {

                        clearInterval(
                            timer
                        );


                        setTimeout(
                            function () {

                                loadingScreen.classList.add(
                                    "hide"
                                );


                                startGame();

                            },
                            250
                        );

                    }

                },
                70
            );

    }


    // =====================================================
    // START
    // =====================================================

    runLoading();

});