// ==========================================================
// KINDERQUEST - DASHBOARD JS
// PROGRESS MONITORING DASHBOARD
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


    // Already UTC
    if (value.endsWith("Z")) {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // Already has timezone offset
    if (/[+-]\d{2}:\d{2}$/.test(value)) {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // SQLite format:
    // YYYY-MM-DD HH:MM:SS
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


    // ISO format without timezone
    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    // General fallback
    const fallbackDate = new Date(value);

    if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate;
    }


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
// GET LATEST RECORDS
//
// If a student has played the same category several times,
// only the latest score is used.
// ==========================================================

function getLatestCategoryRecords(
    students,
    records
) {

    const latest = {};


    records.forEach(
        (record) => {

            const studentId =
                String(record.student_id);


            const category =
                normalizeCategory(
                    record.category
                );


            if (
                !studentId ||
                !category
            ) {

                return;

            }


            if (
                category !== "alphabet" &&
                category !== "numbers" &&
                category !== "colors" &&
                category !== "shapes"
            ) {

                return;

            }


            const key =
                `${studentId}_${category}`;


            if (
                !latest[key]
            ) {

                latest[key] = record;

                return;

            }


            const currentDate =
                parseUTCDate(
                    record.created_at
                );


            const previousDate =
                parseUTCDate(
                    latest[key].created_at
                );


            if (
                currentDate.getTime() >=
                previousDate.getTime()
            ) {

                latest[key] = record;

            }

        }
    );


    return latest;

}


// ==========================================================
// GET SCORE SAFELY
// ==========================================================

function getSafeScore(score) {

    const value =
        Number(score);


    if (
        isNaN(value)
    ) {

        return 0;

    }


    return Math.max(
        0,
        Math.min(
            100,
            value
        )
    );

}


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
        // GET LATEST RECORD FOR EACH
        // STUDENT + CATEGORY
        // ==================================================

        const latestRecords =
            getLatestCategoryRecords(
                allStudents,
                records
            );


        // ==================================================
        // AVERAGE PROGRESS
        //
        // Each student's progress is based on the
        // average score of the 4 main categories.
        //
        // No activity = 0%
        //
        // Example:
        // Alphabet = 60
        // Numbers  = 20
        // Colors   = 0
        // Shapes   = 0
        //
        // Student progress = 20%
        // ==================================================

        if (averageProgressEl) {

            if (
                allStudents.length === 0
            ) {

                averageProgressEl.textContent =
                    "0%";

            } else {

                let totalStudentProgress = 0;


                allStudents.forEach(
                    (student) => {

                        const studentId =
                            String(student.id);


                        const alphabetScore =
                            getSafeScore(
                                latestRecords[
                                    `${studentId}_alphabet`
                                ]?.score
                            );


                        const numbersScore =
                            getSafeScore(
                                latestRecords[
                                    `${studentId}_numbers`
                                ]?.score
                            );


                        const colorsScore =
                            getSafeScore(
                                latestRecords[
                                    `${studentId}_colors`
                                ]?.score
                            );


                        const shapesScore =
                            getSafeScore(
                                latestRecords[
                                    `${studentId}_shapes`
                                ]?.score
                            );


                        const studentProgress =
                            (
                                alphabetScore +
                                numbersScore +
                                colorsScore +
                                shapesScore
                            ) / 4;


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
        // Uses the latest score from each activity record.
        // ==================================================

        if (averageScoreEl) {

            const latestScoreValues =
                Object.values(
                    latestRecords
                ).map(
                    (record) =>
                        getSafeScore(
                            record.score
                        )
                );


            if (
                latestScoreValues.length === 0
            ) {

                averageScoreEl.textContent =
                    "0%";

            } else {

                const totalScore =
                    latestScoreValues.reduce(
                        (
                            sum,
                            score
                        ) =>
                            sum + score,
                        0
                    );


                const averageScore =
                    totalScore /
                    latestScoreValues.length;


                averageScoreEl.textContent =
                    Math.round(
                        averageScore
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
// UPDATE PROGRESS OVERVIEW
//
// Category progress is based on the ACTUAL SCORE.
//
// Example with 1 student:
//
// Alphabet = 60%
// Numbers  = 20%
// Colors   = 0%
// Shapes   = 0%
//
// Dashboard:
// Alphabet = 60%
// Numbers  = 20%
// Colors   = 0%
// Shapes   = 0%
// ==========================================================

function updateCategoryProgress(
    students,
    records
) {

    const latestRecords =
        getLatestCategoryRecords(
            students,
            records
        );


    const categories = [
        "alphabet",
        "numbers",
        "colors",
        "shapes"
    ];


    categories.forEach(
        (category) => {

            let totalScore = 0;


            students.forEach(
                (student) => {

                    const studentId =
                        String(student.id);


                    const key =
                        `${studentId}_${category}`;


                    const record =
                        latestRecords[key];


                    const score =
                        record
                            ? getSafeScore(
                                record.score
                            )
                            : 0;


                    totalScore +=
                        score;

                }
            );


            let percentage = 0;


            if (
                students.length > 0
            ) {

                percentage =
                    Math.round(
                        totalScore /
                        students.length
                    );

            }


            setCategoryProgress(
                category,
                percentage
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

                // ==========================================
                // DATE
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
                    getSafeScore(
                        record.score
                    );


                // ==========================================
                // DISPLAY
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