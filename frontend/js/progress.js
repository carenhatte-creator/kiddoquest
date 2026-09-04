// =================================
// KiddoQuest Progress JS
// ACTIVITY-LEVEL PROGRESS
// =================================


// =================================
// API
// =================================

const PROGRESS_API =
    "https://kiddoquest-backend.onrender.com/api/progress";


// =================================
// DOM ELEMENTS
// =================================

const progressTable =
    document.getElementById(
        "progressTable"
    );

const searchInput =
    document.getElementById(
        "searchStudent"
    );

let progressRecords = [];


// =================================
// GET LOGGED IN TEACHER
// =================================

function getTeacher() {

    let teacher = null;

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "teacher"
                )
            );

    } catch (error) {

        console.error(
            "Unable to read teacher:",
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


// =================================
// DISPLAY TEACHER NAME
// =================================

function displayTeacherName() {

    const teacher =
        getTeacher();

    if (!teacher) return;


    const teacherNameEl =
        document.getElementById(
            "teacherName"
        );


    if (teacherNameEl) {

        teacherNameEl.textContent =
            teacher.username ||
            teacher.fullname ||
            teacher.full_name ||
            "Teacher";

    }

}


displayTeacherName();


// =================================
// LOAD PROGRESS
// =================================

async function loadProgress() {

    const teacher =
        getTeacher();

    if (!teacher) return;


    try {

        const response =
            await fetch(
                `${PROGRESS_API}/teacher/${teacher.id}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "PROGRESS API RESPONSE:",
            data
        );


        if (data.success) {

            progressRecords =
                normalizeProgressRecords(
                    data.data || []
                );


            displayProgress(
                progressRecords
            );

        } else {

            progressRecords = [];

            showMessage(
                "No progress records found."
            );

        }


    } catch (error) {

        console.error(
            "Progress error:",
            error
        );


        progressRecords = [];


        showMessage(
            "Unable to connect to the server."
        );

    }

}


// =================================
// NORMALIZE PROGRESS RECORDS
// =================================

function normalizeProgressRecords(
    records
) {

    if (!Array.isArray(records)) {

        return [];

    }


    return records

        .map(
            record => {

                // =================================
                // STUDENT ID
                // =================================

                const studentId =
                    record.student_id ??
                    record.studentId ??
                    record.studentID ??
                    "";


                // =================================
                // STUDENT NAME
                // =================================

                const firstName =
                    record.first_name ||
                    record.firstName ||
                    "";


                const lastName =
                    record.last_name ||
                    record.lastName ||
                    "";


                let studentName =
                    `${firstName} ${lastName}`
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .trim();


                // =================================
                // OTHER POSSIBLE STUDENT NAME
                // =================================

                if (!studentName) {

                    studentName =
                        record.student_name ||
                        record.studentName ||
                        record.fullname ||
                        record.fullName ||
                        record.name ||
                        "";

                }


                // =================================
                // CATEGORY
                // =================================

                const category =
                    normalizeCategory(
                        record.category
                    );


                // =================================
                // ACTIVITY
                // =================================

                let activity =
                    record.activity ||
                    record.game_name ||
                    record.game ||
                    "—";


                // =================================
                // IMPORTANT:
                // RENAME OLD COLOR-PATH
                // =================================

                activity =
                    normalizeActivity(
                        activity
                    );


                // =================================
                // SCORE
                // =================================

                let score =
                    Number(
                        record.score
                    );


                if (
                    !Number.isFinite(
                        score
                    )
                ) {

                    score = 0;

                }


                score =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Math.round(
                                score
                            )
                        )
                    );


                // =================================
                // STARS
                // =================================

                let stars =
                    Number(
                        record.stars
                    );


                if (
                    !Number.isFinite(
                        stars
                    )
                ) {

                    stars = 0;

                }


                stars =
                    Math.max(
                        0,
                        Math.min(
                            3,
                            Math.round(
                                stars
                            )
                        )
                    );


                // =================================
                // STATUS
                // =================================

                const status =
                    record.status ||
                    getStatusFromScore(
                        score
                    );


                // =================================
                // RETURN NORMALIZED RECORD
                // =================================

                return {

                    ...record,

                    student_id:
                        studentId,

                    student_name:
                        studentName ||
                        "Unknown Student",

                    category:
                        category,

                    activity:
                        activity,

                    score:
                        score,

                    status:
                        status,

                    stars:
                        stars,

                    created_at:
                        record.created_at ||
                        record.updated_at ||
                        ""

                };

            }
        )

        .sort(
            sortNewestFirst
        );

}


// =================================
// NORMALIZE ACTIVITY
// =================================
//
// This changes old activity names
// only for DISPLAY in Progress.
//
// color-path  -> color-pick
//
// Other activities remain unchanged.
// =================================

function normalizeActivity(
    activity
) {

    const value =
        String(
            activity || ""
        )
        .trim()
        .toLowerCase();


    // =================================
    // COLOR PATH
    // =================================

    if (
        value === "color-path" ||
        value === "color path" ||
        value === "colorpath" ||
        value === "color_path"
    ) {

        return "color-pick";

    }


    // =================================
    // COLOR PICK
    // =================================

    if (
        value === "color-pick" ||
        value === "color pick" ||
        value === "colorpick" ||
        value === "color_pick"
    ) {

        return "color-pick";

    }


    // =================================
    // KEEP ORIGINAL ACTIVITY
    // =================================

    return (
        activity ||
        "—"
    );

}


// =================================
// NORMALIZE CATEGORY
// =================================

function normalizeCategory(
    category
) {

    const value =
        String(
            category || ""
        )
        .toLowerCase()
        .trim();


    // =================================
    // ALPHABET
    // =================================

    if (
        value === "alphabet" ||
        value === "letter" ||
        value === "letters"
    ) {

        return "alphabet";

    }


    // =================================
    // NUMBERS
    // =================================

    if (
        value === "number" ||
        value === "numbers"
    ) {

        return "numbers";

    }


    // =================================
    // COLORS
    // =================================

    if (
        value === "color" ||
        value === "colors"
    ) {

        return "colors";

    }


    // =================================
    // SHAPES
    // =================================

    if (
        value === "shape" ||
        value === "shapes"
    ) {

        return "shapes";

    }


    return (
        value ||
        "alphabet"
    );

}


// =================================
// STATUS CLASS
// =================================

function getStatusClass(
    status
) {

    switch (
        String(
            status || ""
        )
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


// =================================
// STATUS FROM SCORE
// =================================

function getStatusFromScore(
    score
) {

    if (
        score >= 100
    ) {

        return "Completed";

    }


    if (
        score >= 50
    ) {

        return "In Progress";

    }


    if (
        score > 0
    ) {

        return "Needs Practice";

    }


    return "Not Started";

}


// =================================
// DISPLAY PROGRESS
// =================================

function displayProgress(
    records
) {

    if (!progressTable) {

        console.error(
            "Progress table not found."
        );

        return;

    }


    progressTable.innerHTML =
        "";


    if (
        !records ||
        records.length === 0
    ) {

        showMessage(
            "No progress records found."
        );

        return;

    }


    records.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            // =================================
            // DATE
            // =================================

            const date =
                parseUTCDate(
                    record.created_at
                );


            const formattedDate =
                record.created_at
                    ? date.toLocaleDateString(
                        undefined,
                        {
                            month:
                                "short",

                            day:
                                "numeric",

                            year:
                                "numeric"
                        }
                    )
                    : "—";


            // =================================
            // TIME
            // =================================

            const formattedTime =
                record.created_at
                    ? date.toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",

                            minute:
                                "2-digit"
                        }
                    )
                    : "";


            // =================================
            // TABLE ROW
            // =================================

            row.innerHTML = `

                <td>

                    <div class="student-name-cell">

                        ${escapeHTML(
                            record.student_name
                        )}

                    </div>

                </td>


                <td>

                    <span
                        class="category-badge category-${escapeHTML(
                            record.category
                        )}"
                    >

                        ${escapeHTML(
                            capitalize(
                                record.category
                            )
                        )}

                    </span>

                </td>


                <td>

                    <div class="activity-name">

                        ${escapeHTML(
                            record.activity
                        )}

                    </div>

                </td>


                <td class="score-cell">

                    <span class="score-badge">

                        ${record.score}%

                    </span>

                </td>


                <td>

                    <span
                        class="status ${getStatusClass(
                            record.status
                        )}"
                    >

                        ${escapeHTML(
                            record.status
                        )}

                    </span>

                </td>


                <td class="stars-cell">

                    <span class="star-count">

                        ${starText(
                            record.stars
                        )}

                    </span>

                </td>


                <td class="date-cell">

                    <div>

                        ${escapeHTML(
                            formattedDate
                        )}

                    </div>

                    <small>

                        ${escapeHTML(
                            formattedTime
                        )}

                    </small>

                </td>

            `;


            progressTable.appendChild(
                row
            );

        }
    );

}


// =================================
// STAR DISPLAY
// =================================

function starText(
    stars
) {

    const count =
        Math.max(
            0,
            Math.min(
                3,
                Number(stars) || 0
            )
        );


    return (

        "⭐".repeat(
            count
        )

        +

        "☆".repeat(
            3 - count
        )

    );

}


// =================================
// SHOW MESSAGE
// =================================

function showMessage(
    message
) {

    if (!progressTable) {
        return;
    }


    progressTable.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="empty-row"
            >

                ${escapeHTML(
                    message
                )}

            </td>

        </tr>

    `;

}


// =================================
// SEARCH
// =================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();


            // =================================
            // SHOW EVERYTHING
            // =================================

            if (!keyword) {

                displayProgress(
                    progressRecords
                );

                return;

            }


            // =================================
            // FILTER
            // =================================

            const filtered =
                progressRecords.filter(
                    record => {

                        const studentName =
                            String(
                                record.student_name ||
                                ""
                            )
                            .toLowerCase();


                        const activity =
                            String(
                                record.activity ||
                                ""
                            )
                            .toLowerCase();


                        const category =
                            String(
                                record.category ||
                                ""
                            )
                            .toLowerCase();


                        return (

                            studentName.includes(
                                keyword
                            )

                            ||

                            activity.includes(
                                keyword
                            )

                            ||

                            category.includes(
                                keyword
                            )

                        );

                    }
                );


            displayProgress(
                filtered
            );

        }
    );

}


// =================================
// SORT NEWEST FIRST
// =================================

function sortNewestFirst(
    a,
    b
) {

    const dateA =
        getDateValue(
            a.created_at
        );


    const dateB =
        getDateValue(
            b.created_at
        );


    return dateB - dateA;

}


// =================================
// DATE VALUE
// =================================

function getDateValue(
    dateString
) {

    if (!dateString) {

        return 0;

    }


    const value =
        String(
            dateString
        )
        .trim();


    let date;


    // =================================
    // SQLITE UTC FORMAT
    // =================================

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
            .test(value)
    ) {

        date =
            new Date(
                value.replace(
                    " ",
                    "T"
                ) + "Z"
            );

    } else {

        date =
            new Date(
                value
            );

    }


    const time =
        date.getTime();


    return Number.isFinite(
        time
    )
        ? time
        : 0;

}


// =================================
// PARSE UTC DATE
// =================================

function parseUTCDate(
    dateString
) {

    if (!dateString) {

        return new Date();

    }


    const value =
        String(
            dateString
        )
        .trim();


    // =================================
    // SQLITE UTC FORMAT
    // =================================

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
            .test(value)
    ) {

        return new Date(
            value.replace(
                " ",
                "T"
            ) + "Z"
        );

    }


    return new Date(
        value
    );

}


// =================================
// ESCAPE HTML
// =================================

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value ?? "";


    return element.innerHTML;

}


// =================================
// CAPITALIZE
// =================================

function capitalize(
    word
) {

    if (!word) {

        return "";

    }


    return (

        word.charAt(0).toUpperCase()

        +

        word.slice(1)

    );

}


// =================================
// SIDEBAR AVATAR
// =================================

function loadSidebarAvatar() {

    const teacher =
        getTeacher();

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


    const teacherDisplayName =
        teacher.fullname ||
        teacher.full_name ||
        teacher.username ||
        "Teacher";


    const initial =
        teacherDisplayName
            .trim()
            .charAt(0)
            .toUpperCase();


    avatarText.textContent =
        initial;


    const teacherId =
        teacher.id ||
        teacher.teacher_id ||
        teacher._id;


    if (!teacherId) {

        return;

    }


    const savedPicture =
        localStorage.getItem(
            `profilePicture_${teacherId}`
        );


    if (
        savedPicture
    ) {

        avatarImg.src =
            savedPicture;


        avatarImg.hidden =
            false;


        avatarText.style.display =
            "none";

    }

}


// =================================
// START
// =================================

loadSidebarAvatar();

loadProgress();