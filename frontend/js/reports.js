// ==========================================================
// KINDERQUEST - REPORTS
// STUDENT LEARNING REPORT
// FULL UPDATED VERSION
// ==========================================================

const API_BASE = "http://localhost:5001/api";

// ==========================================================
// DOM ELEMENTS
// ==========================================================

const studentSelect = document.getElementById("studentSelect");
const emptyState = document.getElementById("emptyState");
const reportContent = document.getElementById("reportContent");
const printReport = document.getElementById("printReport");
const exportCSV = document.getElementById("exportCSV");

// ==========================================================
// DATA
// ==========================================================

let allStudents = [];
let allProgress = [];
let currentStudentRecords = [];

// ==========================================================
// CATEGORIES
// ==========================================================

const CATEGORIES = [
    "alphabet",
    "numbers",
    "colors",
    "shapes"
];

// ==========================================================
// GET LOGGED-IN TEACHER
// ==========================================================

function getTeacher() {
    const teacher = JSON.parse(
        localStorage.getItem("teacher")
    );

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
            teacher.fullname ||
            teacher.username ||
            "Teacher";
    }
}

// ==========================================================
// SIDEBAR AVATAR
// ==========================================================

function loadSidebarAvatar() {
    const teacher = getTeacher();

    if (!teacher) return;

    const avatarText =
        document.getElementById("sidebarAvatar");

    const avatarImg =
        document.getElementById("sidebarAvatarImg");

    if (!avatarText || !avatarImg) {
        return;
    }

    const initial = (
        teacher.fullname ||
        teacher.username ||
        "T"
    )
        .trim()
        .charAt(0)
        .toUpperCase();

    avatarText.textContent = initial;

    const savedPicture =
        localStorage.getItem(
            `profilePicture_${teacher.id}`
        );

    if (savedPicture) {
        avatarImg.src = savedPicture;
        avatarImg.hidden = false;
        avatarText.style.display = "none";
    } else {
        avatarImg.hidden = true;
        avatarText.style.display = "flex";
    }
}

// ==========================================================
// NORMALIZE CATEGORY
// ==========================================================

function normalizeCategory(category) {
    const value = String(category || "")
        .toLowerCase()
        .trim();

    if (
        value === "alphabet" ||
        value === "letter" ||
        value === "letters"
    ) {
        return "alphabet";
    }

    if (
        value === "number" ||
        value === "numbers"
    ) {
        return "numbers";
    }

    if (
        value === "color" ||
        value === "colors"
    ) {
        return "colors";
    }

    if (
        value === "shape" ||
        value === "shapes"
    ) {
        return "shapes";
    }

    return value;
}

// ==========================================================
// GET RECORD STUDENT ID
// ==========================================================

function getRecordStudentId(record) {
    if (!record) {
        return "";
    }

    return (
        record.student_id ??
        record.studentId ??
        record.studentID ??
        record.id_student ??
        ""
    );
}

// ==========================================================
// GET RECORD STUDENT NAME
// ==========================================================

function getRecordStudentName(record) {
    if (!record) {
        return "";
    }

    const firstName =
        record.first_name ||
        record.firstName ||
        "";

    const lastName =
        record.last_name ||
        record.lastName ||
        "";

    return `${firstName} ${lastName}`
        .replace(/\s+/g, " ")
        .trim();
}

// ==========================================================
// GET STUDENT ID
// ==========================================================

function getStudentId(student) {
    if (!student) {
        return "";
    }

    return (
        student.id ??
        student.student_id ??
        student.studentId ??
        ""
    );
}

// ==========================================================
// GET STUDENT NAME
// ==========================================================

function getStudentName(student) {
    if (!student) {
        return "";
    }

    const firstName =
        student.first_name ||
        student.firstName ||
        "";

    const lastName =
        student.last_name ||
        student.lastName ||
        "";

    return `${firstName} ${lastName}`
        .replace(/\s+/g, " ")
        .trim();
}

// ==========================================================
// LOAD INITIAL DATA
// ==========================================================

async function loadInitialData() {
    const teacher = getTeacher();

    if (!teacher) return;

    try {
        const [
            studentsRes,
            progressRes
        ] = await Promise.all([
            fetch(
                `${API_BASE}/students?teacher_id=${teacher.id}`
            ),

            fetch(
                `${API_BASE}/progress/teacher/${teacher.id}`
            )
        ]);

        if (!studentsRes.ok) {
            throw new Error(
                `Students HTTP ${studentsRes.status}`
            );
        }

        if (!progressRes.ok) {
            throw new Error(
                `Progress HTTP ${progressRes.status}`
            );
        }

        const studentsData =
            await studentsRes.json();

        const progressData =
            await progressRes.json();

        // ==================================================
        // STUDENTS
        // ==================================================

        if (studentsData.success) {
            allStudents =
                studentsData.students ||
                studentsData.data ||
                [];
        } else {
            allStudents = [];
        }

        // ==================================================
        // PROGRESS
        // ==================================================

        if (progressData.success) {
            allProgress =
                progressData.data ||
                progressData.progress ||
                progressData.records ||
                [];
        } else {
            allProgress = [];
        }

        console.log(
            "REPORTS - Students:",
            allStudents
        );

        console.log(
            "REPORTS - Progress:",
            allProgress
        );

        populateStudentDropdown();

    } catch (error) {
        console.error(
            "Reports loading error:",
            error
        );

        studentSelect.innerHTML = `
            <option value="">
                Unable to load students
            </option>
        `;
    }
}

// ==========================================================
// POPULATE STUDENT DROPDOWN
// ==========================================================

function populateStudentDropdown() {
    studentSelect.innerHTML = `
        <option value="">
            -- Select Student --
        </option>
    `;

    if (allStudents.length === 0) {
        studentSelect.innerHTML += `
            <option value="" disabled>
                No students found
            </option>
        `;

        return;
    }

    allStudents
        .sort((a, b) => {
            const nameA =
                getStudentName(a).toLowerCase();

            const nameB =
                getStudentName(b).toLowerCase();

            return nameA.localeCompare(nameB);
        })
        .forEach(student => {
            const option =
                document.createElement("option");

            const studentId =
                getStudentId(student);

            option.value = studentId;

            option.textContent =
                getStudentName(student) ||
                "Unknown Student";

            studentSelect.appendChild(option);
        });
}

// ==========================================================
// FIND STUDENT PROGRESS RECORDS
// ==========================================================

function findStudentProgressRecords(studentId) {
    const targetId = String(studentId);

    return allProgress.filter(record => {
        const recordId =
            getRecordStudentId(record);

        return String(recordId) === targetId;
    });
}

// ==========================================================
// LOAD STUDENT PROGRESS
// ==========================================================

async function loadStudentProgress(studentId) {
    let records =
        findStudentProgressRecords(studentId);

    // Use teacher progress first
    if (records.length > 0) {
        return records;
    }

    // Fallback: direct student progress
    try {
        const response =
            await fetch(
                `${API_BASE}/progress/student/${studentId}`
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        if (data.success) {
            return (
                data.data ||
                data.progress ||
                data.records ||
                []
            );
        }

    } catch (error) {
        console.error(
            "Unable to load student progress:",
            error
        );
    }

    return [];
}

// ==========================================================
// STUDENT SELECT
// ==========================================================

if (studentSelect) {
    studentSelect.addEventListener(
        "change",
        async function () {

            const studentId = this.value;

            if (!studentId) {
                emptyState.style.display = "block";
                reportContent.style.display = "none";
                currentStudentRecords = [];
                return;
            }

            const student =
                allStudents.find(
                    item =>
                        String(
                            getStudentId(item)
                        ) === String(studentId)
                );

            if (!student) {
                console.error(
                    "Student not found:",
                    studentId
                );

                return;
            }

            // Show loading while fetching
            emptyState.style.display = "none";
            reportContent.style.display = "block";

            const records =
                await loadStudentProgress(studentId);

            console.log(
                "REPORTS - Selected Student:",
                student
            );

            console.log(
                "REPORTS - Student ID:",
                studentId
            );

            console.log(
                "REPORTS - Student Records:",
                records
            );

            currentStudentRecords =
                sortNewestFirst(records);

            renderReport(
                student,
                currentStudentRecords
            );
        }
    );
}

// ==========================================================
// SORT NEWEST FIRST
// ==========================================================

function sortNewestFirst(records) {
    return [...records].sort((a, b) => {
        const dateA =
            getDateValue(a.created_at);

        const dateB =
            getDateValue(b.created_at);

        return dateB - dateA;
    });
}

// ==========================================================
// SAFE DATE VALUE
// ==========================================================

function getDateValue(dateString) {
    if (!dateString) {
        return 0;
    }

    const value =
        String(dateString).trim();

    let date;

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
            .test(value)
    ) {
        date =
            new Date(
                value.replace(" ", "T") + "Z"
            );
    } else {
        date =
            new Date(value);
    }

    const time = date.getTime();

    return Number.isFinite(time)
        ? time
        : 0;
}

// ==========================================================
// PARSE UTC DATE
// ==========================================================

function parseUTCDate(dateString) {
    if (!dateString) {
        return new Date();
    }

    const value =
        String(dateString).trim();

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
            .test(value)
    ) {
        return new Date(
            value.replace(" ", "T") + "Z"
        );
    }

    return new Date(value);
}

// ==========================================================
// GET LATEST RECORD PER CATEGORY
// ==========================================================
//
// Important:
// Gets only the latest play for each category.
// ==========================================================

function getLatestCategoryRecords(records) {
    const latest = {};

    sortNewestFirst(records).forEach(record => {
        const category =
            normalizeCategory(
                record.category
            );

        if (
            CATEGORIES.includes(category) &&
            latest[category] === undefined
        ) {
            latest[category] = record;
        }
    });

    return latest;
}

// ==========================================================
// GET SAVED STARS
// ==========================================================
//
// Uses stars saved by the game/backend.
// Does NOT calculate stars from score.
// ==========================================================

function getStars(record) {
    if (!record) {
        return 0;
    }

    let stars =
        Number(record.stars);

    if (!Number.isFinite(stars)) {
        stars = 0;
    }

    return Math.max(
        0,
        Math.min(
            3,
            Math.round(stars)
        )
    );
}

// ==========================================================
// STAR DISPLAY
// ==========================================================

function starText(stars) {
    const count =
        Math.max(
            0,
            Math.min(
                3,
                Number(stars) || 0
            )
        );

    return (
        "⭐".repeat(count) +
        "☆".repeat(3 - count)
    );
}

// ==========================================================
// STATUS CLASS
// ==========================================================

function getStatusClass(status) {
    switch (
        String(status || "")
            .toLowerCase()
            .trim()
    ) {

        case "completed":
            return "completed";

        case "in progress":
            return "in-progress";

        case "needs practice":
            return "needs-practice";

        default:
            return "not-started";
    }
}

// ==========================================================
// STATUS FROM SCORE
// ==========================================================

function getStatusFromScore(score) {
    if (score >= 100) {
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

// ==========================================================
// RENDER REPORT
// ==========================================================

function renderReport(student, records) {

    // ======================================================
    // STUDENT NAME
    // ======================================================

    let studentName =
        getStudentName(student);

    if (records.length > 0) {
        const progressName =
            getRecordStudentName(records[0]);

        if (progressName) {
            studentName = progressName;
        }
    }

    document.getElementById(
        "reportStudentName"
    ).textContent =
        studentName || "Student";

    // ======================================================
    // STUDENT META
    // ======================================================

    const metaParts = [];

    if (student.age) {
        metaParts.push(
            `Age ${student.age}`
        );
    }

    if (student.gender) {
        metaParts.push(
            student.gender
        );
    }

    document.getElementById(
        "reportStudentMeta"
    ).textContent =
        metaParts.length
            ? metaParts.join(" • ")
            : "Kindergarten Pupil";

    // ======================================================
    // CATEGORY DATA
    // ======================================================

    const categoryData =
        getLatestCategoryRecords(records);

    // ======================================================
    // TOTALS
    // ======================================================

    let totalScore = 0;
    let totalStars = 0;
    let completedCategories = 0;

    // ======================================================
    // CATEGORY DISPLAY
    // ======================================================

    CATEGORIES.forEach(category => {

        const capitalized =
            capitalize(category);

        const scoreEl =
            document.getElementById(
                `cat${capitalized}Score`
            );

        const statusEl =
            document.getElementById(
                `cat${capitalized}Status`
            );

        const starsEl =
            document.getElementById(
                `cat${capitalized}Stars`
            );

        const record =
            categoryData[category];

        if (record) {

            const score =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(record.score) || 0
                    )
                );

            const stars =
                getStars(record);

            const status =
                record.status ||
                getStatusFromScore(score);

            // Score
            if (scoreEl) {
                scoreEl.textContent =
                    `${score}%`;
            }

            // Status
            if (statusEl) {
                statusEl.textContent =
                    status;

                statusEl.className =
                    `cat-status ${getStatusClass(status)}`;
            }

            // Stars
            if (starsEl) {
                starsEl.textContent =
                    starText(stars);
            }

            totalScore += score;
            totalStars += stars;
            completedCategories++;

        } else {

            if (scoreEl) {
                scoreEl.textContent = "—";
            }

            if (statusEl) {
                statusEl.textContent =
                    "Not Started";

                statusEl.className =
                    "cat-status not-started";
            }

            if (starsEl) {
                starsEl.textContent =
                    "☆☆☆";
            }
        }
    });

    // ======================================================
    // OVERALL PROGRESS
    // ======================================================

    const overallPercent =
        completedCategories > 0
            ? Math.round(
                totalScore /
                completedCategories
            )
            : 0;

    document.getElementById(
        "overallPercent"
    ).textContent =
        `${overallPercent}%`;

    // ======================================================
    // TOTAL STARS
    // ======================================================

    document.getElementById(
        "totalStars"
    ).textContent =
        `⭐ ${totalStars}`;

    // ======================================================
    // INSIGHTS
    // ======================================================

    renderInsights(categoryData);

    // ======================================================
    // HISTORY
    // ======================================================

    renderHistory(records);
}

// ==========================================================
// INSIGHTS
// ==========================================================

function renderInsights(categoryData) {

    const attempted =
        Object.entries(categoryData);

    const strengthText =
        document.getElementById(
            "strengthText"
        );

    const improveText =
        document.getElementById(
            "improveText"
        );

    if (attempted.length === 0) {

        strengthText.textContent =
            "No games played yet.";

        improveText.textContent =
            "No games played yet.";

        return;
    }

    // ======================================================
    // SORT BY SCORE
    // ======================================================

    const sorted =
        [...attempted].sort(
            (a, b) =>
                Number(b[1].score || 0) -
                Number(a[1].score || 0)
        );

    // ======================================================
    // STRONGEST
    // ======================================================

    const strongest = sorted[0];

    strengthText.textContent =
        `${capitalize(strongest[0])} (${
            Number(strongest[1].score) || 0
        }%) — Great job!`;

    // ======================================================
    // NOT ATTEMPTED
    // ======================================================

    const notAttempted =
        CATEGORIES.filter(
            category =>
                !categoryData[category]
        );

    if (notAttempted.length > 0) {

        improveText.textContent =
            `${notAttempted
                .map(capitalize)
                .join(", ")} — Not started yet.`;

        return;
    }

    // ======================================================
    // WEAKEST
    // ======================================================

    const weakest =
        sorted[sorted.length - 1];

    improveText.textContent =
        `${capitalize(weakest[0])} (${
            Number(weakest[1].score) || 0
        }%) — Could use more practice.`;
}

// ==========================================================
// PLAY HISTORY
// ==========================================================

function renderHistory(records) {

    const historyTable =
        document.getElementById(
            "historyTable"
        );

    historyTable.innerHTML = "";

    if (records.length === 0) {

        historyTable.innerHTML = `
            <tr>
                <td colspan="6">
                    No games played yet.
                </td>
            </tr>
        `;

        return;
    }

    sortNewestFirst(records).forEach(record => {

        const createdAt =
            parseUTCDate(
                record.created_at
            );

        const stars =
            getStars(record);

        const category =
            normalizeCategory(
                record.category
            );

        const score =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(record.score) || 0
                )
            );

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${createdAt.toLocaleDateString()}
            </td>

            <td>
                ${createdAt.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )}
            </td>

            <td>
                ${escapeHTML(
                    capitalize(category)
                )}
            </td>

            <td>
                ${escapeHTML(
                    record.activity || "—"
                )}
            </td>

            <td>
                ${score}%
            </td>

            <td class="history-stars">
                ${starText(stars)}
            </td>
        `;

        historyTable.appendChild(row);
    });
}

// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================================
// CAPITALIZE
// ==========================================================

function capitalize(word) {

    if (!word) {
        return "";
    }

    return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
    );
}

// ==========================================================
// PRINT REPORT
// ==========================================================

if (printReport) {

    printReport.addEventListener(
        "click",
        () => {

            if (!studentSelect.value) {

                alert(
                    "Please select a student first."
                );

                return;
            }

            window.print();
        }
    );
}

// ==========================================================
// CSV EXPORT
// ==========================================================

if (exportCSV) {

    exportCSV.addEventListener(
        "click",
        () => {

            if (!studentSelect.value) {

                alert(
                    "Please select a student first."
                );

                return;
            }

            if (
                currentStudentRecords.length === 0
            ) {

                alert(
                    "This student has no game records yet."
                );

                return;
            }

            let csv =
                "Date,Time,Category,Activity,Score,Stars\n";

            currentStudentRecords.forEach(
                record => {

                    const createdAt =
                        parseUTCDate(
                            record.created_at
                        );

                    const score =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                Number(record.score) || 0
                            )
                        );

                    const stars =
                        getStars(record);

                    const date =
                        createdAt.toLocaleDateString();

                    const time =
                        createdAt.toLocaleTimeString();

                    const category =
                        csvSafe(
                            capitalize(
                                normalizeCategory(
                                    record.category
                                )
                            )
                        );

                    const activity =
                        csvSafe(
                            record.activity || ""
                        );

                    csv +=
                        `"${date}",` +
                        `"${time}",` +
                        `"${category}",` +
                        `"${activity}",` +
                        `"${score}%",` +
                        `"${stars}"\n`;
                }
            );

            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            const studentName =
                document.getElementById(
                    "reportStudentName"
                )
                    .textContent
                    .trim()
                    .replace(/\s+/g, "_");

            link.download =
                `KinderQuest_Report_${studentName}.csv`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);
        }
    );
}

// ==========================================================
// CSV SAFE
// ==========================================================

function csvSafe(value) {

    return String(value ?? "")
        .replace(/"/g, '""');
}

// ==========================================================
// INITIALIZE
// ==========================================================

function initializeReports() {

    displayTeacherName();

    loadSidebarAvatar();

    loadInitialData();
}

// ==========================================================
// START
// ==========================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeReports
    );

} else {

    initializeReports();

}