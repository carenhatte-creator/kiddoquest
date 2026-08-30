// =================================
// KinderQuest Progress JS
// ACTIVITY-LEVEL PROGRESS
// =================================


const API_BASE = "https://kiddoquest-backend.onrender.com/api";


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

    const teacher =
        JSON.parse(
            localStorage.getItem(
                "teacher"
            )
        );


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
                `${API_BASE}/teacher/${teacher.id}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            data.success
        ) {

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

    return records
        .map(
            record => {

                const studentId =
                    record.student_id ??
                    record.studentId ??
                    record.studentID ??
                    "";


                const firstName =
                    record.first_name ||
                    record.firstName ||
                    "";


                const lastName =
                    record.last_name ||
                    record.lastName ||
                    "";


                const studentName =
                    `${firstName} ${lastName}`
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


                const category =
                    normalizeCategory(
                        record.category
                    );


                const activity =
                    record.activity ||
                    record.game_name ||
                    record.game ||
                    "—";


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


                const status =
                    record.status ||
                    getStatusFromScore(
                        score
                    );


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


    return value ||
        "alphabet";

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
        ) +
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


            if (!keyword) {

                displayProgress(
                    progressRecords
                );

                return;

            }


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
                            ) ||

                            activity.includes(
                                keyword
                            ) ||

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
        word.charAt(0).toUpperCase() +
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


    const initial = (

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


loadSidebarAvatar();


// =================================
// START
// =================================

loadProgress();