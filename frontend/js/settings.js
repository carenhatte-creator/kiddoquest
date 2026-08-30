// =========================================================
// KINDERQUEST - SETTINGS
// UPDATED AUTHENTICATION VERSION
// =========================================================

const API_BASE = "http://localhost:5001/api";


// =========================================================
// GET LOGGED IN TEACHER
// =========================================================

function getTeacher() {

    try {

        const rawTeacher =
            localStorage.getItem("teacher");

        if (!rawTeacher) {

            window.location.href = "login.html";

            return null;
        }

        const teacher =
            JSON.parse(rawTeacher);

        if (!teacher) {

            window.location.href = "login.html";

            return null;
        }

        return teacher;

    } catch (error) {

        console.error(
            "Teacher data error:",
            error
        );

        localStorage.removeItem("teacher");
        localStorage.removeItem("token");

        window.location.href = "login.html";

        return null;
    }

}


// =========================================================
// GET JWT TOKEN
// =========================================================

function getAuthToken() {

    const possibleKeys = [
        "token",
        "jwt",
        "authToken",
        "accessToken"
    ];

    for (const key of possibleKeys) {

        const token =
            localStorage.getItem(key);

        if (token) {
            return token;
        }
    }

    // Some login systems store the token
    // inside the teacher object.

    const teacher =
        getTeacherWithoutRedirect();

    if (
        teacher &&
        teacher.token
    ) {

        return teacher.token;
    }

    if (
        teacher &&
        teacher.jwt
    ) {

        return teacher.jwt;
    }

    return null;
}


// =========================================================
// GET TEACHER WITHOUT REDIRECT
// =========================================================

function getTeacherWithoutRedirect() {

    try {

        const rawTeacher =
            localStorage.getItem("teacher");

        if (!rawTeacher) {
            return null;
        }

        return JSON.parse(rawTeacher);

    } catch (error) {

        return null;
    }

}


// =========================================================
// LOGOUT
// =========================================================

function logoutTeacher() {

    // IMPORTANT:
    // Do NOT remove profile pictures.
    // Do NOT remove sound/music settings.
    // Do NOT remove student progress here.
    //
    // Only remove authentication/session data.

    localStorage.removeItem("teacher");

    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");

    window.location.href = "login.html";
}


// =========================================================
// HANDLE AUTHENTICATION ERROR
// =========================================================

function handleAuthenticationError(response, data) {

    if (
        response.status === 401 ||
        response.status === 403
    ) {

        console.warn(
            "Authentication expired or invalid."
        );

        logoutTeacher();

        return true;
    }

    // Some backend versions may return
    // a message instead of the status code.

    const message =
        String(
            data?.message ||
            data?.error ||
            ""
        ).toLowerCase();

    if (
        message.includes("token") &&
        (
            message.includes("required") ||
            message.includes("invalid") ||
            message.includes("expired") ||
            message.includes("unauthorized")
        )
    ) {

        logoutTeacher();

        return true;
    }

    return false;
}


// =========================================================
// AUTHORIZATION HEADERS
// =========================================================

function getAuthHeaders() {

    const token =
        getAuthToken();

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;

    }

    return headers;
}


// =========================================================
// ELEMENTS
// =========================================================

const teacherNameEl =
    document.getElementById("teacherName");

const defaultAvatar =
    document.getElementById("defaultAvatar");

const profilePreview =
    document.getElementById("profilePreview");

const profileImageInput =
    document.getElementById("profileImageInput");

const changeProfileBtn =
    document.getElementById("changeProfileBtn");

const fullNameDisplay =
    document.getElementById("fullNameDisplay");

const usernameDisplay =
    document.getElementById("usernameDisplay");

const openPasswordBtn =
    document.getElementById("openPasswordBtn");

const passwordSection =
    document.getElementById("passwordSection");

const passwordForm =
    document.getElementById("passwordForm");

const currentPasswordInput =
    document.getElementById("currentPassword");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const cancelPasswordBtn =
    document.getElementById("cancelPasswordBtn");

const passwordMessage =
    document.getElementById("passwordMessage");

const soundToggle =
    document.getElementById("soundToggle");

const musicToggle =
    document.getElementById("musicToggle");

const volumeSlider =
    document.getElementById("volumeSlider");

const volumeValue =
    document.getElementById("volumeValue");

const resetProgressBtn =
    document.getElementById("resetProgressBtn");

const saveMessage =
    document.getElementById("saveMessage");


// =========================================================
// SHOW SAVE TOAST
// =========================================================

function showSaveMessage(text) {

    if (!saveMessage) {
        return;
    }

    saveMessage.textContent =
        text ||
        "Settings saved successfully.";

    saveMessage.classList.add("show");

    setTimeout(() => {

        saveMessage.classList.remove("show");

    }, 2500);

}


// =========================================================
// LOAD PROFILE INFO
// =========================================================

function loadProfile() {

    const teacher =
        getTeacher();

    if (!teacher) {
        return;
    }

    if (teacherNameEl) {

        teacherNameEl.textContent =
            teacher.username || "Teacher";

    }

    if (fullNameDisplay) {

        fullNameDisplay.textContent =
            teacher.fullname || "—";

    }

    if (usernameDisplay) {

        usernameDisplay.textContent =
            teacher.username || "—";

    }

    if (defaultAvatar) {

        const initial =
            (
                teacher.fullname ||
                teacher.username ||
                "T"
            )
            .trim()
            .charAt(0)
            .toUpperCase();

        defaultAvatar.textContent =
            initial;

    }


    // =====================================================
    // PROFILE PICTURE
    // =====================================================
    // IMPORTANT:
    // Existing profile picture remains untouched.

    const savedPicture =
        localStorage.getItem(
            `profilePicture_${teacher.id}`
        );

    if (
        savedPicture &&
        profilePreview &&
        defaultAvatar
    ) {

        profilePreview.src =
            savedPicture;

        profilePreview.style.display =
            "block";

        defaultAvatar.style.display =
            "none";

    }

}


// =========================================================
// CHANGE PROFILE PICTURE
// =========================================================

if (
    changeProfileBtn &&
    profileImageInput
) {

    changeProfileBtn.addEventListener(
        "click",
        () => {

            profileImageInput.click();

        }
    );


    profileImageInput.addEventListener(
        "change",
        () => {

            const file =
                profileImageInput.files[0];

            if (!file) {
                return;
            }

            const teacher =
                getTeacher();

            if (!teacher) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload = () => {

                const dataUrl =
                    reader.result;

                localStorage.setItem(
                    `profilePicture_${teacher.id}`,
                    dataUrl
                );

                if (
                    profilePreview &&
                    defaultAvatar
                ) {

                    profilePreview.src =
                        dataUrl;

                    profilePreview.style.display =
                        "block";

                    defaultAvatar.style.display =
                        "none";

                }

                loadSidebarAvatar();

                showSaveMessage(
                    "Profile picture updated."
                );

            };

            reader.readAsDataURL(file);

        }
    );

}


// =========================================================
// TOGGLE CHANGE PASSWORD SECTION
// =========================================================

if (
    openPasswordBtn &&
    passwordSection
) {

    openPasswordBtn.addEventListener(
        "click",
        () => {

            passwordSection.classList.toggle(
                "show"
            );

            passwordSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );

}


if (
    cancelPasswordBtn &&
    passwordSection
) {

    cancelPasswordBtn.addEventListener(
        "click",
        () => {

            passwordSection.classList.remove(
                "show"
            );

            if (passwordForm) {
                passwordForm.reset();
            }

            if (passwordMessage) {

                passwordMessage.textContent =
                    "";

                passwordMessage.className =
                    "password-message";

            }

        }
    );

}


// =========================================================
// SUBMIT CHANGE PASSWORD
// =========================================================

if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const teacher =
                getTeacher();

            if (!teacher) {
                return;
            }


            const currentPassword =
                currentPasswordInput
                    ? currentPasswordInput.value.trim()
                    : "";

            const newPassword =
                newPasswordInput
                    ? newPasswordInput.value.trim()
                    : "";

            const confirmPassword =
                confirmPasswordInput
                    ? confirmPasswordInput.value.trim()
                    : "";


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                passwordMessage.textContent =
                    "Please complete all fields.";

                passwordMessage.className =
                    "password-message error";

                return;
            }


            if (
                newPassword.length < 6
            ) {

                passwordMessage.textContent =
                    "New password must be at least 6 characters.";

                passwordMessage.className =
                    "password-message error";

                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {

                passwordMessage.textContent =
                    "New passwords do not match.";

                passwordMessage.className =
                    "password-message error";

                return;
            }


            // =================================================
            // CHECK TOKEN
            // =================================================

            const token =
                getAuthToken();

            if (!token) {

                passwordMessage.textContent =
                    "Your login session has expired. Please login again.";

                passwordMessage.className =
                    "password-message error";

                setTimeout(
                    logoutTeacher,
                    1200
                );

                return;
            }


            try {

                // =================================================
                // CHANGE PASSWORD REQUEST
                // =================================================

                const response =
                    await fetch(
                        `${API_BASE}/auth/change-password`,
                        {
                            method: "PUT",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({

                                    teacher_id:
                                        teacher.id,

                                    currentPassword:
                                        currentPassword,

                                    newPassword:
                                        newPassword

                                })
                        }
                    );


                let data = {};

                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    console.warn(
                        "Password response was not JSON."
                    );

                }


                // =================================================
                // INVALID / EXPIRED TOKEN
                // =================================================

                if (
                    handleAuthenticationError(
                        response,
                        data
                    )
                ) {

                    return;
                }


                // =================================================
                // SUCCESS
                // =================================================

                if (response.ok && data.success) {

                    passwordMessage.textContent =
                        "Password changed successfully!";

                    passwordMessage.className =
                        "password-message success";

                    passwordForm.reset();

                    setTimeout(
                        () => {

                            if (passwordSection) {

                                passwordSection.classList.remove(
                                    "show"
                                );

                            }

                            if (passwordMessage) {

                                passwordMessage.textContent =
                                    "";

                                passwordMessage.className =
                                    "password-message";

                            }

                        },
                        1500
                    );

                    showSaveMessage(
                        "Password updated."
                    );

                } else {

                    passwordMessage.textContent =
                        data.message ||
                        "Unable to change password.";

                    passwordMessage.className =
                        "password-message error";

                }

            } catch (err) {

                console.error(
                    "Change password error:",
                    err
                );

                passwordMessage.textContent =
                    "Cannot connect to server.";

                passwordMessage.className =
                    "password-message error";

            }

        }
    );

}


// =========================================================
// SOUND SETTINGS
// =========================================================
// IMPORTANT:
// Existing sound/music settings are preserved.

function loadSoundSettings() {

    let saved = null;

    try {

        saved =
            JSON.parse(
                localStorage.getItem(
                    "kq_sound_settings"
                )
            );

    } catch (error) {

        console.warn(
            "Sound settings could not be read."
        );

    }


    saved =
        saved || {

            sound: true,

            music: true,

            volume: 70

        };


    if (soundToggle) {

        soundToggle.checked =
            saved.sound !== false;

    }

    if (musicToggle) {

        musicToggle.checked =
            saved.music !== false;

    }

    if (volumeSlider) {

        volumeSlider.value =
            saved.volume ?? 70;

    }

    if (volumeValue) {

        volumeValue.textContent =
            `${saved.volume ?? 70}%`;

    }

}


function saveSoundSettings() {

    const settings = {

        sound:
            soundToggle
                ? soundToggle.checked
                : true,

        music:
            musicToggle
                ? musicToggle.checked
                : true,

        volume:
            volumeSlider
                ? Number(volumeSlider.value)
                : 70

    };


    localStorage.setItem(
        "kq_sound_settings",
        JSON.stringify(settings)
    );


    showSaveMessage(
        "Sound settings saved."
    );

}


if (soundToggle) {

    soundToggle.addEventListener(
        "change",
        saveSoundSettings
    );

}


if (musicToggle) {

    musicToggle.addEventListener(
        "change",
        saveSoundSettings
    );

}


if (volumeSlider) {

    volumeSlider.addEventListener(
        "input",
        () => {

            if (volumeValue) {

                volumeValue.textContent =
                    `${volumeSlider.value}%`;

            }

        }
    );


    volumeSlider.addEventListener(
        "change",
        saveSoundSettings
    );

}


// =========================================================
// RESET ALL PROGRESS
// =========================================================

function injectResetConfirmModal() {

    if (
        document.getElementById(
            "resetConfirmModal"
        )
    ) {

        return;
    }


    // =====================================================
    // MODAL STYLE
    // =====================================================

    const style =
        document.createElement("style");


    style.innerHTML = `

        #resetConfirmModal {

            display: none;

            position: fixed;

            top: 0;
            left: 0;

            width: 100%;
            height: 100%;

            background: rgba(0,0,0,0.5);

            align-items: center;
            justify-content: center;

            z-index: 9999;

        }


        #resetConfirmModal .reset-modal-box {

            background: #fff;

            border-radius: 16px;

            padding: 28px 26px;

            width: 90%;

            max-width: 360px;

            text-align: center;

            box-shadow:
                0 10px 30px rgba(0,0,0,0.25);

        }


        #resetConfirmModal h3 {

            margin: 0 0 10px;

            font-size: 19px;

            color: #d84848;

        }


        #resetConfirmModal p {

            margin: 0 0 20px;

            color: #666;

            font-size: 14px;

            line-height: 1.5;

        }


        #resetConfirmModal .reset-modal-actions {

            display: flex;

            gap: 10px;

        }


        #resetConfirmModal button {

            flex: 1;

            padding: 11px;

            border: none;

            border-radius: 10px;

            font-size: 14px;

            font-weight: bold;

            cursor: pointer;

        }


        #resetConfirmModal #resetConfirmYes {

            background: #e85c5c;

            color: #fff;

        }


        #resetConfirmModal #resetConfirmNo {

            background: #eee;

            color: #444;

        }

    `;


    document.head.appendChild(style);


    // =====================================================
    // MODAL
    // =====================================================

    const modal =
        document.createElement("div");

    modal.id =
        "resetConfirmModal";


    modal.innerHTML = `

        <div class="reset-modal-box">

            <h3>
                🗑️ Reset All Progress
            </h3>

            <p>
                Buburahin lahat ng progress records
                ng LAHAT ng estudyante mo.
                Hindi ito maibabalik.
                Hindi matatanggal ang mga
                estudyante mismo.
            </p>

            <div class="reset-modal-actions">

                <button
                    type="button"
                    id="resetConfirmNo"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    id="resetConfirmYes"
                >
                    Yes, Reset
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    // =====================================================
    // CANCEL
    // =====================================================

    document
        .getElementById("resetConfirmNo")
        .addEventListener(
            "click",
            () => {

                modal.style.display =
                    "none";

            }
        );


    // =====================================================
    // CONFIRM RESET
    // =====================================================

    document
        .getElementById("resetConfirmYes")
        .addEventListener(
            "click",
            async () => {

                modal.style.display =
                    "none";


                const teacher =
                    getTeacher();

                if (!teacher) {
                    return;
                }


                // =================================================
                // CHECK TOKEN
                // =================================================

                const token =
                    getAuthToken();

                if (!token) {

                    showSaveMessage(
                        "Your session has expired. Please login again."
                    );

                    setTimeout(
                        logoutTeacher,
                        1200
                    );

                    return;
                }


                try {

                    // =================================================
                    // RESET PROGRESS REQUEST
                    // =================================================

                    const response =
                        await fetch(
                            `${API_BASE}/progress/teacher/${teacher.id}/reset`,
                            {
                                method: "DELETE",

                                headers:
                                    getAuthHeaders()
                            }
                        );


                    let data = {};

                    try {

                        data =
                            await response.json();

                    } catch (jsonError) {

                        console.warn(
                            "Reset response was not JSON."
                        );

                    }


                    // =================================================
                    // INVALID / EXPIRED TOKEN
                    // =================================================

                    if (
                        handleAuthenticationError(
                            response,
                            data
                        )
                    ) {

                        return;
                    }


                    // =================================================
                    // SUCCESS
                    // =================================================

                    if (
                        response.ok &&
                        data.success
                    ) {

                        showSaveMessage(
                            "All progress has been reset."
                        );

                    } else {

                        showSaveMessage(
                            data.message ||
                            "Unable to reset progress."
                        );

                    }

                } catch (err) {

                    console.error(
                        "Reset progress error:",
                        err
                    );

                    showSaveMessage(
                        "Cannot connect to server."
                    );

                }

            }
        );

}


// =========================================================
// RESET BUTTON
// =========================================================

if (resetProgressBtn) {

    injectResetConfirmModal();


    resetProgressBtn.addEventListener(
        "click",
        () => {

            const modal =
                document.getElementById(
                    "resetConfirmModal"
                );

            if (modal) {

                modal.style.display =
                    "flex";

            }

        }
    );

}


// =========================================================
// SIDEBAR AVATAR
// =========================================================

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

    }

}


// =========================================================
// START
// =========================================================

loadProfile();

loadSoundSettings();

loadSidebarAvatar();