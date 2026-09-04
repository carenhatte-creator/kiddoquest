// ==========================================================
// KINDERQUEST - DASHBOARD JS
// PROGRESS MONITORING DASHBOARD
// ==========================================================


// ==========================================================
// API
// ==========================================================

const API_BASE =
    "https://kiddoquest-backend.onrender.com/api";


// ==========================================================
// PARSE UTC DATE
// SQLite CURRENT_TIMESTAMP is UTC.
// ==========================================================

function parseUTCDate(dateString) {

    if (!dateString) {
        return new Date();
    }

    return new Date(
        dateString.replace(" ", "T") + "Z"
    );
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
                searchInput.value.toLowerCase();

            const rows =
                table.getElementsByTagName("tr");


            for (
                let i = 0;
                i < rows.length;
                i++
            ) {

                const studentName =
                    rows[i]
                        .getElementsByTagName("td")[0];


                if (studentName) {

                    const name =
                        studentName.textContent
                            .toLowerCase();


                    if (
                        name.includes(searchValue)
                    ) {

                        rows[i].style.display =
                            "";

                    } else {

                        rows[i].style.display =
                            "none";
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
            "Invalid teacher data:",
            error
        );
    }


    if (!teacher) {

        window.location.href =
            "login.html";

        return null;
    }


    return teacher;
}


// ==========================================================
// DISPLAY TEACHER NAME
// ==========================================================

function displayTeacherName() {

    const teacher =
        getTeacher();

    if (!teacher) {
        return;
    }


    const teacherNameEl =
        document.getElementById(
            "teacherName"
        );


    if (teacherNameEl) {

        teacherNameEl.textContent =
            teacher.username ||
            teacher.fullname ||
            "Teacher";
    }
}


displayTeacherName();


// ==========================================================
// CURRENT DATE
// ==========================================================

function displayCurrentDate() {

    const dateElement =
        document.getElementById(
            "currentDate"
        );


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


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

    const teacher =
        getTeacher();

    if (!teacher) {
        return;
    }


    const totalStudentsEl =
        document.getElementById(
            "totalStudents"
        );


    if (!totalStudentsEl) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/students?teacher_id=${teacher.id}`
            );


        const data =
            await response.json();


        if (data.success) {

            totalStudentsEl.textContent =
                (
                    data.students || []
                ).length;
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
        document.getElementById(
            "totalGames"
        );


    if (!totalGamesEl) {
        return;
    }


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
// GET LATEST RECORD PER STUDENT + CATEGORY
//
// Important:
// If a student plays Numbers several times:
//
// 20%
// 40%
// 60%
//
// only the latest 60% is used.
//
// This prevents old scores from incorrectly
// increasing or decreasing the dashboard.
// ==========================================================

function getLatestCategoryRecords(records) {

    const latest = {};


    records.forEach(
        (record) => {

            const studentId =
                String(
                    record.student_id
                );


            const category =
                normalizeCategory(
                    record.category
                );


            if (!studentId || !category) {
                return;
            }


            const key =
                `${studentId}_${category}`;


            const existing =
                latest[key];


            if (!existing) {

                latest[key] =
                    record;

                return;
            }


            const oldDate =
                parseUTCDate(
                    existing.created_at
                );


            const newDate =
                parseUTCDate(
                    record.created_at
                );


            if (
                newDate.getTime() >=
                oldDate.getTime()
            ) {

                latest[key] =
                    record;
            }
        }
    );


    return Object.values(
        latest
    );
}


// ==========================================================
// LOAD AVERAGE PROGRESS + AVERAGE SCORE
// ==========================================================

async function loadAverageStats() {

    const teacher =
        getTeacher();

    if (!teacher) {
        return;
    }


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
                ? (
                    studentsData.students ||
                    []
                )
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
                ? (
                    progressData.data ||
                    []
                )
                : [];


        // ==================================================
        // GET ONLY LATEST SCORE PER
        // STUDENT + CATEGORY
        // ==================================================

        const latestRecords =
            getLatestCategoryRecords(
                records
            );


        // ==================================================
        // AVERAGE PROGRESS
        //
        // Each student's progress is based on
        // the actual score of the 4 categories.
        //
        // Example:
        //
        // Alphabet = 60
        // Numbers  = 20
        // Colors   = 0
        // Shapes   = 0
        //
        // Student progress =
        // (60 + 20 + 0 + 0) / 4
        // = 20%
        //
        // Students with no activity = 0%.
        // ==================================================

        if (averageProgressEl) {

            if (
                allStudents.length === 0
            ) {

                averageProgressEl.textContent =
                    "0%";

            } else {

                const mainCategories = [
                    "alphabet",
                    "numbers",
                    "colors",
                    "shapes"
                ];


                let totalStudentProgress =
                    0;


                allStudents.forEach(
                    (student) => {

                        const studentId =
                            String(
                                student.id
                            );


                        let categoryTotal =
                            0;


                        mainCategories.forEach(
                            (category) => {

                                const record =
                                    latestRecords.find(
                                        (item) =>
                                            String(
                                                item.student_id
                                            ) ===
                                            studentId
                                            &&
                                            normalizeCategory(
                                                item.category
                                            ) ===
                                            category
                                    );


                                if (record) {

                                    const score =
                                        Number(
                                            record.score
                                        );


                                    categoryTotal +=
                                        Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                isNaN(score)
                                                    ? 0
                                                    : score
                                            )
                                        );
                                }
                            }
                        );


                        const studentProgress =
                            categoryTotal /
                            mainCategories.length;


                        totalStudentProgress +=
                            studentProgress;
                    }
                );


                const averageProgress =
                    totalStudentProgress /
                    allStudents.length;


                averageProgressEl.textContent =
                    Math.round(
                        averageProgress
                    ) + "%";
            }
        }


        // ==================================================
        // AVERAGE SCORE
        //
        // Uses latest score per student/category.
        // ==================================================

        if (averageScoreEl) {

            if (
                latestRecords.length === 0
            ) {

                averageScoreEl.textContent =
                    "0%";

            } else {

                const validScores =
                    latestRecords
                        .map(
                            (record) =>
                                Number(
                                    record.score
                                )
                        )
                        .filter(
                            (score) =>
                                !isNaN(score)
                        );


                if (
                    validScores.length === 0
                ) {

                    averageScoreEl.textContent =
                        "0%";

                } else {

                    const totalScore =
                        validScores.reduce(
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
                            validScores.length
                        ) + "%";
                }
            }
        }


        // ==================================================
        // UPDATE PROGRESS OVERVIEW
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
// UPDATE CATEGORY PROGRESS
//
// IMPORTANT:
// Category progress now uses the ACTUAL LATEST SCORE.
//
// Example:
//
// Numbers latest score = 20%
// Dashboard Numbers = 20%
//
// Alphabet latest score = 60%
// Dashboard Alphabet = 60%
//
// It will NOT automatically become 100%
// just because the student played the game.
// ==========================================================

function updateCategoryProgress(
    students,
    records
) {

    const mainCategories = [
        "alphabet",
        "numbers",
        "colors",
        "shapes"
    ];


    const latestRecords =
        getLatestCategoryRecords(
            records
        );


    mainCategories.forEach(
        (category) => {

            let totalScore =
                0;


            let studentCount =
                0;


            students.forEach(
                (student) => {

                    const studentId =
                        String(
                            student.id
                        );


                    const record =
                        latestRecords.find(
                            (item) =>
                                String(
                                    item.student_id
                                ) ===
                                studentId
                                &&
                                normalizeCategory(
                                    item.category
                                ) ===
                                category
                        );


                    if (record) {

                        let score =
                            Number(
                                record.score
                            );


                        if (
                            isNaN(score)
                        ) {
                            score = 0;
                        }


                        score =
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    score
                                )
                            );


                        totalScore +=
                            score;


                        studentCount++;
                    }
                }
            );


            let percentage =
                0;


            if (
                students.length > 0
            ) {

                // Include students with no activity
                // as 0% progress.

                percentage =
                    totalScore /
                    students.length;
            }


            setCategoryProgress(
                category,
                Math.round(
                    percentage
                )
            );
        }
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
                Number(
                    percentage
                ) || 0
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

    const teacher =
        getTeacher();

    if (!teacher) {
        return;
    }


    const recentActivityEl =
        document.getElementById(
            "recentActivity"
        );


    if (!recentActivityEl) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/progress/teacher/${teacher.id}`
            );


        const data =
            await response.json();


        const records =
            data.success
                ? (
                    data.data ||
                    []
                )
                : [];


        if (
            records.length === 0
        ) {

            recentActivityEl.innerHTML = `
                <div class="empty-activity">
                    <p>
                        No recent activity yet.
                    </p>
                </div>
            `;

            return;
        }


        // ==================================================
        // SORT NEWEST FIRST
        // ==================================================

        const sortedRecords =
            [...records].sort(
                (a, b) => {

                    const dateA =
                        parseUTCDate(
                            a.created_at
                        ).getTime();


                    const dateB =
                        parseUTCDate(
                            b.created_at
                        ).getTime();


                    return dateB - dateA;
                }
            );


        // ==================================================
        // GET ONLY 5 MOST RECENT
        // ==================================================

        const recent =
            sortedRecords.slice(
                0,
                5
            );


        recentActivityEl.innerHTML =
            "";


        recent.forEach(
            (record) => {

                const createdAt =
                    parseUTCDate(
                        record.created_at
                    );


                const formattedDate =
                    createdAt.toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        }
                    ) +
                    " • " +
                    createdAt.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                const firstName =
                    record.first_name ||
                    "";


                const lastName =
                    record.last_name ||
                    "";


                const studentName =
                    `${firstName} ${lastName}`
                        .trim()
                    ||
                    "Student";


                const activity =
                    record.activity ||
                    "Learning Activity";


                const category =
                    record.category ||
                    "Learning";


                let score =
                    Number(
                        record.score
                    );


                if (
                    isNaN(score)
                ) {
                    score = 0;
                }


                score =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            score
                        )
                    );


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

                        — <span>
                            ${score}%
                        </span>

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

    const teacher =
        getTeacher();

    if (!teacher) {
        return;
    }


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


// ==========================================================
// END
// ==========================================================