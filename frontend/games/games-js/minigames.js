document.addEventListener("DOMContentLoaded", () => {


    // =========================================
    // GET TEACHER DATA
    // =========================================

    const teacherData =
        localStorage.getItem("teacher");


    // =========================================
    // CHECK LOGIN
    // =========================================

    if (!teacherData) {

        window.location.href = "login.html";

        return;

    }


    // =========================================
    // PARSE TEACHER DATA
    // =========================================

    let teacher;

    try {

        teacher =
            JSON.parse(teacherData);

    } catch (error) {

        console.error(
            "Invalid teacher data:",
            error
        );

        localStorage.removeItem("teacher");

        window.location.href =
            "login.html";

        return;

    }


    // =========================================
    // DISPLAY TEACHER NAME
    // =========================================

    const teacherName =
        document.getElementById(
            "teacherName"
        );


    if (teacherName) {

        teacherName.textContent =
            teacher.username || "Teacher";

    }


    // =========================================
    // GET AVATAR ELEMENTS
    // =========================================

    const avatarText =
        document.getElementById(
            "sidebarAvatar"
        );


    const avatarImg =
        document.getElementById(
            "sidebarAvatarImg"
        );


    // =========================================
    // CHECK AVATAR ELEMENTS
    // =========================================

    if (
        !avatarText ||
        !avatarImg
    ) {

        return;

    }


    // =========================================
    // TEACHER INITIAL
    // =========================================

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


    // =========================================
    // PROFILE PICTURE
    // =========================================

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

});