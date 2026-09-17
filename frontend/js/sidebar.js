/* =========================================
   KINDERQUEST — SHARED SIDEBAR MOBILE TOGGLE
   Dynamically injects a hamburger button and
   overlay so the sidebar can collapse/open on
   mobile widths, without editing every page's
   HTML structure.
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) {
        return;
    }


    // =================================
    // CREATE HAMBURGER TOGGLE BUTTON
    // =================================

    const toggleBtn = document.createElement("button");

    toggleBtn.type = "button";
    toggleBtn.className = "sidebar-toggle-btn";
    toggleBtn.setAttribute("aria-label", "Toggle menu");
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';


    // =================================
    // CREATE OVERLAY (BEHIND SIDEBAR)
    // =================================

    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";


    document.body.appendChild(toggleBtn);
    document.body.appendChild(overlay);


    // =================================
    // OPEN / CLOSE HELPERS
    // =================================

    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("show");
    }

    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("show");
    }


    // =================================
    // TOGGLE BUTTON CLICK
    // =================================

    toggleBtn.addEventListener("click", () => {

        if (sidebar.classList.contains("active")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });


    // =================================
    // CLICK OVERLAY TO CLOSE
    // =================================

    overlay.addEventListener("click", closeSidebar);


    // =================================
    // CLOSE SIDEBAR AFTER TAPPING A
    // NAVIGATION LINK (mobile only)
    // =================================

    sidebar.querySelectorAll("nav a").forEach((link) => {

        link.addEventListener("click", () => {
            closeSidebar();
        });

    });


    // =================================
    // CLOSE SIDEBAR IF RESIZED BACK
    // TO DESKTOP WIDTH
    // =================================

    window.addEventListener("resize", () => {

        if (window.innerWidth > 700) {
            closeSidebar();
        }

    });

});