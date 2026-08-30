// =========================================================
// KINDERQUEST - LOGIN JS
// JWT AUTHENTICATION
// =========================================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginSubmitBtn");


// =========================================================
// LOGIN
// =========================================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!username || !password) {

        message.style.display = "block";
        message.className = "message error";
        message.textContent =
            "Please enter your username and password.";

        return;
    }


    // =====================================================
    // LOGIN STATUS
    // =====================================================

    message.style.display = "block";
    message.className = "message";
    message.textContent = "Checking account...";

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";


    try {

        // =================================================
        // LOGIN REQUEST
        // =================================================

        const response = await fetch(
            `${API_BASE}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );


        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);


        // =================================================
        // LOGIN SUCCESS
        // =================================================

        if (data.success) {

            // IMPORTANT:
            // successResponse() puts everything inside data

            const token = data.data?.token;
            const teacher = data.data?.teacher;


            // =================================================
            // CHECK TOKEN
            // =================================================

            if (!token) {

                console.error(
                    "Server response does not contain JWT token:",
                    data
                );

                message.className =
                    "message error";

                message.textContent =
                    "Login failed. Authentication token missing.";

                loginButton.disabled = false;
                loginButton.textContent = "Login";

                return;
            }


            // =================================================
            // SAVE TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                token
            );


            // =================================================
            // SAVE TEACHER
            // =================================================

            if (teacher) {

                localStorage.setItem(
                    "teacher",
                    JSON.stringify(teacher)
                );

            }


            console.log(
                "JWT token saved successfully."
            );

            console.log(
                "Teacher saved:",
                teacher
            );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            message.className =
                "message success";

            message.textContent =
                "Login successful!";


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);


        } else {

            // =================================================
            // LOGIN FAILED
            // =================================================

            message.className =
                "message error";

            message.textContent =
                data.message ||
                "Invalid username or password.";

            loginButton.disabled = false;
            loginButton.textContent = "Login";

        }


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        message.className =
            "message error";

        message.textContent =
            "Cannot connect to server.";

        loginButton.disabled = false;
        loginButton.textContent = "Login";

    }

});