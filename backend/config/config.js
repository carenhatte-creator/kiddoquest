const path = require("path");

module.exports = {

    PORT: process.env.PORT || 5001,

    DATABASE_PATH: path.join(
        __dirname,
        "../database/database.db"
    ),

    JWT_SECRET: process.env.JWT_SECRET

};