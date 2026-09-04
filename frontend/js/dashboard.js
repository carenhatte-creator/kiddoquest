// ==========================================================
// KINDERQUEST - DASHBOARD JS
// PROGRESS MONITORING DASHBOARD
// ==========================================================


// ==========================================================
// API
// ==========================================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";


function parseUTCDate(dateString) {

    if (!dateString) {
        return new Date();
    }

    const value = String(dateString).trim();

    if (!value) {
        return new Date();
    }


    if (value.endsWith("Z")) {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // ------------------------------------------------------
    // Already has timezone offset
    // Example:
    // 2026-09-04T05:30:00+00:00
    // ------------------------------------------------------

    if (/[+-]\d{2}:\d{2}$/.test(value)) {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // ------------------------------------------------------
    // SQLite format
    // YYYY-MM-DD HH:MM:SS
    // ------------------------------------------------------

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    ) {

        const date = new Date(
            value.replace(" ", "T") + "Z"
        );

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // ------------------------------------------------------
    // ISO format without timezone
    // ------------------------------------------------------

    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // ------------------------------------------------------
    // General fallback
    // ------------------------------------------------------

    const fallbackDate = new Date(value);

    if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate;
    }


    // ------------------------------------------------------
    // Final safe fallback
    // ------------------------------------------------------

    return new Date();

}


// ==========================================================
// FORMAT ACTIVITY DATE
// ==========================================================

function formatActivityDate(dateString) {

    const date = parseUTCDate(dateString);


    if (isNaN(date.getTime())) {
        return "Date unavailable";
    }


    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );


    const formattedTime =
        date.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    return `${formattedDate} • ${formattedTime}`;

}


// ==========================================================
// SEARCH STUDENT
// Only runs on pages that have these elements.
// ==========================================================

const searchInput =
    document.getElementById("searchStudent");

const table =
    document.getElementById("progressTable");


if (searchInput && table) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const rows =
                table.getElementsByTagName("tr");


            for (
                let i = 0;
                i < rows.length;
                i++
            ) {

                const cells =
                    rows[i].getElementsByTagName("td");


                const studentName =
                    cells[0];


                if (studentName) {

                    const name =
                        studentName.textContent
                            .toLowerCase();


                    if (
                        name.includes(searchValue)
                    ) {

                        rows[i].style.display = "";

                    } else {

                        rows[i].style.display = "none";

                    }

                }

            }

        }
    );

}


// ==========================================================
// GET LOGGED IN TEACHER
// ==========================================================

function getTeacher() {

    let teacher = null;


    try {

        teacher =
            JSON.parse(
                localStorage.getItem("teacher")
            );

    } catch (error) {

        console.log(
            "Error reading teacher data:",
            error
        );

        teacher = null;

    }


    if (!teacher) {

        window.location.href = "login.html";

        return null;

    }


    return teacher;

}


// ==========================================================
// DISPLAY TEACHER NAME
// ==========================================================

function displayTeacherName() {

    const teacher = getTeacher();

    if (!teacher) return;


    const teacherNameEl =
        document.getElementById("teacherName");


    if (teacherNameEl) {

        teacherNameEl.textContent =
            teacher.username || "Teacher";

    }

}


displayTeacherName();


// ==========================================================
// CURRENT DATE
// ==========================================================

function displayCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");


    if (!dateElement) return;


    const today = new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

}


displayCurrentDate();


// ==========================================================
// LOAD TOTAL STUDENTS
// ==========================================================

async function loadTotalStudents() {

    const teacher = getTeacher();

    if (!teacher) return;


    const totalStudentsEl =
        document.getElementById("totalStudents");


    if (!totalStudentsEl) return;


    try {

        const response =
            await fetch(
                `${API_BASE}/students?teacher_id=${teacher.id}`
            );


        const data =
            await response.json();


        if (data.success) {

            totalStudentsEl.textContent =
                (data.students || []).length;

        }

    } catch (err) {

        console.log(
            "Error loading students:",
            err
        );

    }

}


loadTotalStudents();


// ==========================================================
// LOAD TOTAL MINI GAMES
// ==========================================================

function loadTotalGames() {

    const totalGamesEl =
        document.getElementById("totalGames");


    if (!totalGamesEl) return;


    if (
        typeof getTotalGamesCount !==
        "function"
    ) {

        return;

    }


    totalGamesEl.textContent =
        getTotalGamesCount();

}


loadTotalGames();


// ==========================================================
// LOAD AVERAGE PROGRESS + AVERAGE SCORE
// ==========================================================

async function loadAverageStats() {

    const teacher = getTeacher();

    if (!teacher) return;


    const averageProgressEl =
        document.getElementById(
            "averageProgress"
        );


    const averageScoreEl =
        document.getElementById(
            "averageScore"
        );


    if (
        !averageProgressEl &&
        !averageScoreEl
    ) {

        return;

    }


    try {

        // ==================================================
        // GET ALL STUDENTS
        // ==================================================

        const studentsResponse =
            await fetch(
                `${API_BASE}/students?teacher_id=${teacher.id}`
            );


        const studentsData =
            await studentsResponse.json();


        const allStudents =
            studentsData.success
                ? (studentsData.students || [])
                : [];


        // ==================================================
        // GET ALL PROGRESS RECORDS
        // ==================================================

        const progressResponse =
            await fetch(
                `${API_BASE}/progress/teacher/${teacher.id}`
            );


        const progressData =
            await progressResponse.json();


        const records =
            progressData.success
                ? (progressData.data || [])
                : [];


        // ==================================================
        // GROUP RECORDS PER STUDENT
        // ==================================================

        const perStudentCategories = {};

        const allScores = [];


        records.forEach(
            (record) => {

                const score =
                    Number(record.score) || 0;


                allScores.push(score);


                if (
                    !perStudentCategories[
                        record.student_id
                    ]
                ) {

                    perStudentCategories[
                        record.student_id
                    ] = new Set();

                }


                perStudentCategories[
                    record.student_id
                ].add(
                    normalizeCategory(
                        record.category
                    )
                );

            }
        );


        // ==================================================
        // AVERAGE PROGRESS
        // ==================================================

        if (averageProgressEl) {

            if (
                allStudents.length === 0
            ) {

                averageProgressEl.textContent =
                    "0%";

            } else {

                const totalPercent =
                    allStudents.reduce(
                        (
                            sum,
                            student
                        ) => {

                            const categoriesAttempted =
                                perStudentCategories[
                                    student.id
                                ]
                                    ? countMainCategories(
                                        perStudentCategories[
                                            student.id
                                        ]
                                    )
                                    : 0;


                            return (
                                sum +
                                (
                                    categoriesAttempted /
                                    4
                                ) *
                                100
                            );

                        },
                        0
                    );


                averageProgressEl.textContent =
                    Math.round(
                        totalPercent /
                        allStudents.length
                    ) + "%";

            }

        }


        // ==================================================
        // AVERAGE SCORE
        // ==================================================

        if (averageScoreEl) {

            if (
                allScores.length === 0
            ) {

                averageScoreEl.textContent =
                    "0%";

            } else {

                const totalScore =
                    allScores.reduce(
                        (
                            sum,
                            score
                        ) =>
                            sum + score,
                        0
                    );


                averageScoreEl.textContent =
                    Math.round(
                        totalScore /
                        allScores.length
                    ) + "%";

            }

        }


        // ==================================================
        // UPDATE CATEGORY PROGRESS
        // ==================================================

        updateCategoryProgress(
            allStudents,
            records
        );

    } catch (err) {

        console.log(
            "Error loading average stats:",
            err
        );

    }

}


loadAverageStats();


// ==========================================================
// NORMALIZE CATEGORY
// ==========================================================

function normalizeCategory(category) {

    if (!category) {
        return "";
    }


    const value =
        String(category)
            .trim()
            .toLowerCase();


    if (
        value.includes("alphabet") ||
        value.includes("letter")
    ) {

        return "alphabet";

    }


    if (
        value.includes("number") ||
        value.includes("count") ||
        value.includes("addition")
    ) {

        return "numbers";

    }


    if (
        value.includes("color") ||
        value.includes("colour")
    ) {

        return "colors";

    }


    if (
        value.includes("shape")
    ) {

        return "shapes";

    }


    return value;

}


// ==========================================================
// COUNT MAIN CATEGORIES
// ==========================================================

function countMainCategories(categorySet) {

    const mainCategories =
        new Set();


    categorySet.forEach(
        (category) => {

            if (
                category === "alphabet" ||
                category === "numbers" ||
                category === "colors" ||
                category === "shapes"
            ) {

                mainCategories.add(
                    category
                );

            }

        }
    );


    return mainCategories.size;

}


// ==========================================================
// UPDATE PROGRESS OVERVIEW
// ==========================================================

function updateCategoryProgress(
    students,
    records
) {

    const categoryStudentMap = {

        alphabet: new Set(),

        numbers: new Set(),

        colors: new Set(),

        shapes: new Set()

    };


    records.forEach(
        (record) => {

            const category =
                normalizeCategory(
                    record.category
                );


            if (
                categoryStudentMap[category]
            ) {

                categoryStudentMap[
                    category
                ].add(
                    String(
                        record.student_id
                    )
                );

            }

        }
    );


    const totalStudents =
        students.length;


    const alphabet =
        calculateCategoryPercentage(
            categoryStudentMap.alphabet,
            totalStudents
        );


    const numbers =
        calculateCategoryPercentage(
            categoryStudentMap.numbers,
            totalStudents
        );


    const colors =
        calculateCategoryPercentage(
            categoryStudentMap.colors,
            totalStudents
        );


    const shapes =
        calculateCategoryPercentage(
            categoryStudentMap.shapes,
            totalStudents
        );


    setCategoryProgress(
        "alphabet",
        alphabet
    );


    setCategoryProgress(
        "numbers",
        numbers
    );


    setCategoryProgress(
        "colors",
        colors
    );


    setCategoryProgress(
        "shapes",
        shapes
    );

}


// ==========================================================
// CALCULATE CATEGORY PERCENTAGE
// ==========================================================

function calculateCategoryPercentage(
    studentSet,
    totalStudents
) {

    if (
        totalStudents === 0
    ) {

        return 0;

    }


    return Math.round(
        (
            studentSet.size /
            totalStudents
        ) *
        100
    );

}


// ==========================================================
// SET CATEGORY PROGRESS IN UI
// ==========================================================

function setCategoryProgress(
    category,
    percentage
) {

    const safePercentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(percentage) || 0
            )
        );


    const textElement =
        document.getElementById(
            `${category}Progress`
        );


    const barElement =
        document.getElementById(
            `${category}Bar`
        );


    if (textElement) {

        textElement.textContent =
            safePercentage + "%";

    }


    if (barElement) {

        barElement.style.width =
            safePercentage + "%";

    }

}


// ==========================================================
// LOAD RECENT ACTIVITIES
// ==========================================================

async function loadRecentActivities() {

    const teacher = getTeacher();

    if (!teacher) return;


    const recentActivityEl =
        document.getElementById(
            "recentActivity"
        );


    if (!recentActivityEl) return;


    try {

        const response =
            await fetch(
                `${API_BASE}/progress/teacher/${teacher.id}`
            );


        const data =
            await response.json();


        const records =
            data.success
                ? (data.data || [])
                : [];


        if (
            records.length === 0
        ) {

            recentActivityEl.innerHTML = `

                <div class="empty-activity">

                    <i class="fa-regular fa-folder-open"></i>

                    <p>
                        No recent activity yet.
                    </p>

                </div>

            `;

            return;

        }


        // ==================================================
        // GET ONLY 5 MOST RECENT
        // Backend already returns newest first.
        // ==================================================

        const recent =
            records.slice(0, 5);


        recentActivityEl.innerHTML = "";


        recent.forEach(
            (record) => {

                // ==========================================
                // SAFE DATE
                // ==========================================

                const formattedDate =
                    formatActivityDate(
                        record.created_at
                    );


                // ==========================================
                // STUDENT NAME
                // ==========================================

                const firstName =
                    record.first_name || "";


                const lastName =
                    record.last_name || "";


                const studentName =
                    `${firstName} ${lastName}`
                        .trim()
                    || "Student";


                // ==========================================
                // ACTIVITY
                // ==========================================

                const activity =
                    record.activity
                    || "Learning Activity";


                // ==========================================
                // CATEGORY
                // ==========================================

                const category =
                    record.category
                    || "Learning";


                // ==========================================
                // SCORE
                // ==========================================

                const score =
                    Number(record.score) || 0;


                // ==========================================
                // DISPLAY ACTIVITY
                // ==========================================

                recentActivityEl.innerHTML += `

                    <div class="activity-item">

                        <strong>
                            ${studentName}
                        </strong>

                        completed

                        <strong>
                            ${activity}
                        </strong>

                        (${category})

                        — <span>${score}%</span>

                        <small>
                            ${formattedDate}
                        </small>

                    </div>

                `;

            }
        );

    } catch (err) {

        console.log(
            "Error loading recent activities:",
            err
        );

    }

}


loadRecentActivities();


// ==========================================================
// SIDEBAR AVATAR
// ==========================================================

function loadSidebarAvatar() {

    const teacher = getTeacher();

    if (!teacher) return;


    const avatarText =
        document.getElementById(
            "sidebarAvatar"
        );


    const avatarImg =
        document.getElementById(
            "sidebarAvatarImg"
        );


    if (
        !avatarText ||
        !avatarImg
    ) {

        return;

    }


    const initial =
        (
            teacher.fullname ||
            teacher.username ||
            "T"
        )
            .trim()
            .charAt(0)
            .toUpperCase();


    avatarText.textContent =
        initial;


    const savedPicture =
        localStorage.getItem(
            `profilePicture_${teacher.id}`
        );


    if (savedPicture) {

        avatarImg.src =
            savedPicture;

        avatarImg.hidden =
            false;

        avatarText.style.display =
            "none";

    } else {

        avatarImg.hidden =
            true;

        avatarText.style.display =
            "flex";

    }

}


loadSidebarAvatar();