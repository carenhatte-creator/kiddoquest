// ==========================================
// GAME CONTROLLER
// ==========================================


const {
    successResponse,
    errorResponse
} = require("../utils/response");




// ==========================================
// GAME DATA
// ==========================================

const games = [


    {
        id: 1,

        category: "Alphabet",

        activities: [

            {
                id: 1,
                name: "Letter Matching",
                description: "Match the correct letters"
            },

            {
                id: 2,
                name: "Missing Letter",
                description: "Find the missing letter"
            },

            {
                id: 3,
                name: "Trace Letter",
                description: "Trace the correct letter"
            },

            {
                id: 4,
                name: "Pronunciation",
                description: "Listen and pronounce letters"
            }

        ]

    },



    {
        id: 2,

        category: "Numbers",

        activities: [

            {
                id: 1,
                name: "Counting",
                description: "Count objects correctly"
            },

            {
                id: 2,
                name: "Number Puzzle",
                description: "Arrange numbers correctly"
            },

            {
                id: 3,
                name: "Compare Numbers",
                description: "Compare bigger and smaller numbers"
            },

            {
                id: 4,
                name: "Addition",
                description: "Solve simple addition"
            }

        ]

    },



    {
        id: 3,

        category: "Colors",

        activities: [

            {
                id: 1,
                name: "Match Color",
                description: "Match the correct colors"
            },

            {
                id: 2,
                name: "Color Mixing",
                description: "Learn color combinations"
            },

            {
                id: 3,
                name: "Paint Game",
                description: "Color different objects"
            }

        ]

    },



    {
        id: 4,

        category: "Shapes",

        activities: [

            {
                id: 1,
                name: "Shape Puzzle",
                description: "Complete the shape puzzle"
            },

            {
                id: 2,
                name: "Find the Shape",
                description: "Identify the correct shape"
            },

            {
                id: 3,
                name: "Build the Shape",
                description: "Create shapes"
            }

        ]

    }


];





// ==========================================
// GET ALL GAMES
// ==========================================

exports.getGames = (req,res)=>{


    successResponse(

        res,

        "Games retrieved successfully.",

        games

    );


};





// ==========================================
// GET ONE CATEGORY
// ==========================================

exports.getCategory = (req,res)=>{


    const id = Number(req.params.id);



    const game = games.find(

        item => item.id === id

    );



    if(!game){


        return errorResponse(

            res,

            "Category not found.",

            404

        );


    }



    successResponse(

        res,

        "Category retrieved.",

        game

    );


};





// ==========================================
// GET ONE ACTIVITY
// ==========================================

exports.getActivity = (req,res)=>{


    const categoryId = Number(
        req.params.categoryId
    );


    const activityId = Number(
        req.params.activityId
    );



    const category = games.find(

        item => item.id === categoryId

    );



    if(!category){


        return errorResponse(

            res,

            "Category not found.",

            404

        );


    }




    const activity = category.activities.find(

        item => item.id === activityId

    );



    if(!activity){


        return errorResponse(

            res,

            "Activity not found.",

            404

        );


    }



    successResponse(

        res,

        "Activity retrieved.",

        {

            category: category.category,

            activity: activity

        }

    );


};