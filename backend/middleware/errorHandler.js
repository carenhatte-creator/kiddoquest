// ==========================================
// ERROR HANDLER MIDDLEWARE
// ==========================================


const errorHandler = (err, req, res, next) => {


    console.error("ERROR:");

    console.error(err.message);



    res.status(err.status || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });


};



module.exports = errorHandler;