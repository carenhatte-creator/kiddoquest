// =========================================================
// KINDERQUEST - FORGOT PASSWORD JS
// STEP 1: VERIFY USERNAME
// STEP 2: SET NEW PASSWORD
// =========================================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";

const stepSubtitle = document.getElementById("stepSubtitle");
const message = document.getElementById("formMessage");

const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("username");
const usernameSubmitBtn = document.getElementById("usernameSubmitBtn");

const resetForm = document.getElementById("resetForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const resetSubmitBtn = document.getElementById("resetSubmitBtn");

// Holds the username once verified in Step 1,
// so it can be sent along with Step 2's reset request.
let verifiedUsername = "";


// =========================================================
// SHOW / HIDE PASSWORD (works for both password fields)
// =========================================================

document
    .querySelectorAll(".toggle-password")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-target");

            const input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }

            const isHidden =
                input.type === "password";

            input.type =
                isHidden ? "text" : "password";


            const icon =
                button.querySelector("i");

            if (icon) {

                icon.classList.toggle(
                    "fa-eye",
                    !isHidden
                );

                icon.classList.toggle(
                    "fa-eye-slash",
                    isHidden
                );

            }


            button.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );

        });

    });


// =========================================================
// HELPERS
// =========================================================

function showMessage(text, type) {

    message.style.display = "block";
    message.className = `message ${type}`;
    message.textContent = text;

}


// =========================================================
// STEP 1: VERIFY USERNAME
// =========================================================

usernameForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        usernameInput.value.trim();


    if (!username) {

        showMessage(
            "Please enter your username.",
            "error"
        );

        return;
    }


    message.style.display = "none";

    usernameSubmitBtn.disabled = true;
    usernameSubmitBtn.textContent = "Checking...";


    try {

        const response = await fetch(
            `${API_BASE}/auth/forgot-password/verify`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ username })
            }
        );

        const data = await response.json();


        if (data.success) {

            verifiedUsername = username;

            // Move to Step 2
            usernameForm.hidden = true;
            resetForm.hidden = false;

            stepSubtitle.textContent =
                `Set a new password for "${username}"`;

            newPasswordInput.focus();

        } else {

            showMessage(
                data.message ||
                "Username not found.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "FORGOT PASSWORD - VERIFY ERROR:",
            error
        );

        showMessage(
            "Cannot connect to server.",
            "error"
        );

    } finally {

        usernameSubmitBtn.disabled = false;
        usernameSubmitBtn.textContent = "Continue";

    }

});


// =========================================================
// STEP 2: RESET PASSWORD
// =========================================================

resetForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const newPassword =
        newPasswordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    if (!newPassword || !confirmPassword) {

        showMessage(
            "Please fill in both password fields.",
            "error"
        );

        return;
    }


    if (newPassword.length < 6) {

        showMessage(
            "Password must be at least 6 characters.",
            "error"
        );

        return;
    }


    if (newPassword !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    message.style.display = "none";

    resetSubmitBtn.disabled = true;
    resetSubmitBtn.textContent = "Resetting...";


    try {

        const response = await fetch(
            `${API_BASE}/auth/forgot-password/reset`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: verifiedUsername,
                    newPassword
                })
            }
        );

        const data = await response.json();


        if (data.success) {

            showMessage(
                "Password reset successful! Redirecting to login...",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);

        } else {

            showMessage(
                data.message ||
                "Could not reset password.",
                "error"
            );

            resetSubmitBtn.disabled = false;
            resetSubmitBtn.textContent = "Reset Password";

        }


    } catch (error) {

        console.error(
            "FORGOT PASSWORD - RESET ERROR:",
            error
        );

        showMessage(
            "Cannot connect to server.",
            "error"
        );

        resetSubmitBtn.disabled = false;
        resetSubmitBtn.textContent = "Reset Password";

    }

});