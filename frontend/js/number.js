document.addEventListener("DOMContentLoaded", () => {

    window.startGame = function(game) {

        if (game == "counting") {

            window.location.href =
                "activities/number-counting.html";

        }

        else if (game == "jumping-number") {

            window.location.href =
                "activities/jumping-number.html";

        }

        else if (game == "addition") {

            window.location.href =
                "activities/number-addition.html";

        }

        else if (game == "balloon") {

            alert("🎈 Balloon Pop (coming soon)");

        }

    };

});