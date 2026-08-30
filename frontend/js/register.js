// =========================================================
// KINDERQUEST - TEACHER REGISTER
// REGISTER → TEACHER LOGIN
// =========================================================

const API_BASE = "http://localhost:5001/api";

const registerForm = document.getElementById("registerForm");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const fullname = document
        .getElementById("fullname")
        .value
        .trim();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!fullname || !username || !password) {

        message.style.display = "block";
        message.className = "message error";
        message.textContent = "Please complete all fields.";

        return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Creating account...";

    try {

        const response = await fetch(
            `${API_BASE}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fullname: fullname,
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        console.log("REGISTER RESPONSE:", data);
        console.log("STATUS:", response.status);

        // ================================================
        // SUCCESS
        // ================================================

        if (data.success === true) {

            // DIRETSO SA TEACHER LOGIN
            window.location.href = "./login.html";

            return;
        }

        // ================================================
        // FAILED
        // ================================================

        message.style.display = "block";
        message.className = "message error";

        message.textContent =
            data.message || "Unable to create account.";

        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        message.style.display = "block";
        message.className = "message error";

        message.textContent =
            "Cannot connect to server.";

        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";
    }

});