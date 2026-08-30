document.addEventListener("DOMContentLoaded", () => {

    injectLogoutModal();

    attachLogoutTriggers();

});


// ===================================
// INJECT MODAL (self-contained, may sariling style)
// ===================================

function injectLogoutModal(){

    if(document.getElementById("logoutConfirmModal")) return;

    const style = document.createElement("style");

    style.innerHTML = `

        #logoutConfirmModal {

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

        #logoutConfirmModal .logout-modal-box {

            background: #fff;
            border-radius: 12px;
            padding: 28px 24px;
            width: 90%;
            max-width: 340px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-family: inherit;

        }

        #logoutConfirmModal h3 {

            margin: 0 0 8px;
            font-size: 20px;

        }

        #logoutConfirmModal p {

            margin: 0 0 20px;
            color: #555;
            font-size: 14px;

        }

        #logoutConfirmModal .logout-modal-actions {

            display: flex;
            gap: 10px;
            justify-content: center;

        }

        #logoutConfirmModal button {

            padding: 10px 18px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;

        }

        #logoutConfirmModal #logoutConfirmYes {

            background: #e74c3c;
            color: #fff;

        }

        #logoutConfirmModal #logoutConfirmNo {

            background: #eee;
            color: #333;

        }

    `;

    document.head.appendChild(style);

    const modal = document.createElement("div");

    modal.id = "logoutConfirmModal";

    modal.innerHTML = `

        <div class="logout-modal-box">

            <h3>🚪 Logout</h3>

            <p>Are you sure you want to logout?</p>

            <div class="logout-modal-actions">

                <button id="logoutConfirmNo">Cancel</button>

                <button id="logoutConfirmYes">Yes, Logout</button>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

    document.getElementById("logoutConfirmNo")
    .addEventListener("click", hideLogoutModal);

    document.getElementById("logoutConfirmYes")
    .addEventListener("click", doLogout);

}


// ===================================
// SHOW / HIDE MODAL
// ===================================

function showLogoutModal(){

    const modal =
    document.getElementById("logoutConfirmModal");

    if(modal) modal.style.display = "flex";

}

function hideLogoutModal(){

    const modal =
    document.getElementById("logoutConfirmModal");

    if(modal) modal.style.display = "none";

}


// ===================================
// ACTUAL LOGOUT
// ===================================

function doLogout(){

    localStorage.removeItem("teacher");

    window.location.href = "login.html";

}


// ===================================
// ATTACH TO ALL LOGOUT TRIGGERS SA PAGE
// (covers id="logout", id="logoutLink",
//  id="logoutBtn", class="logout-btn")
// ===================================

function attachLogoutTriggers(){

    const triggers = document.querySelectorAll(

        "#logout, #logoutLink, #logoutBtn, .logout-btn"

    );

    triggers.forEach((el) => {

        el.addEventListener("click", (e) => {

            e.preventDefault();

            showLogoutModal();

        });

    });

}