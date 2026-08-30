const express = require("express");

const router = express.Router();

const gameController = require("../controllers/gameController");


// ==========================================
// GAME ROUTES
// ==========================================


// GET ALL GAMES
// GET /api/games

router.get("/", gameController.getGames);


// GET ONE ACTIVITY
// GET /api/games/:categoryId/activity/:activityId

router.get(
    "/:categoryId/activity/:activityId",
    gameController.getActivity
);


// GET ONE CATEGORY
// GET /api/games/:id

router.get(
    "/:id",
    gameController.getCategory
);


module.exports = router;