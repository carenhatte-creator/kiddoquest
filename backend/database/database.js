const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const config = require("../config/config");

// ======================================
// SHOW DATABASE PATH
// ======================================

console.log("");
console.log("===================================");
console.log("DATABASE LOCATION:");
console.log(config.DATABASE_PATH);
console.log("===================================");
console.log("");

// ======================================
// CONNECT DATABASE
// ======================================

const db = new sqlite3.Database(
    config.DATABASE_PATH,
    (err) => {

        if (err) {

            console.log("Database connection failed");
            console.log(err.message);

        } else {

            console.log("Connected to SQLite Database");

        }

    }
);

// ======================================
// CREATE TABLES
// ======================================

db.serialize(() => {

    // ======================================
    // TEACHERS
    // ======================================

    db.run(`
        CREATE TABLE IF NOT EXISTS teachers (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            fullname TEXT NOT NULL,

            username TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // ======================================
    // STUDENTS
    // ======================================

    db.run(`
        CREATE TABLE IF NOT EXISTS students (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            teacher_id INTEGER NOT NULL,

            first_name TEXT NOT NULL,

            last_name TEXT NOT NULL,

            age INTEGER,

            gender TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (teacher_id)
            REFERENCES teachers(id)
            ON DELETE CASCADE

        )
    `);


    // ======================================
    // PROGRESS
    // ======================================

    db.run(`
        CREATE TABLE IF NOT EXISTS progress (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            teacher_id INTEGER NOT NULL,

            student_id INTEGER NOT NULL,

            category TEXT NOT NULL,

            activity TEXT NOT NULL,

            score INTEGER DEFAULT 0,

            stars INTEGER DEFAULT 0,

            status TEXT DEFAULT 'Not Started',

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (teacher_id)
            REFERENCES teachers(id)
            ON DELETE CASCADE,

            FOREIGN KEY (student_id)
            REFERENCES students(id)
            ON DELETE CASCADE

        )
    `);


    // ======================================
    // ADD STARS COLUMN TO EXISTING DATABASE
    // ======================================
    //
    // IMPORTANT:
    // If the progress table already existed before
    // we added the stars system, CREATE TABLE IF NOT
    // EXISTS will NOT add the new column.
    //
    // This migration checks first.
    // If stars does not exist, it adds it.
    //
    // ======================================

    db.all(
        `PRAGMA table_info(progress)`,
        (err, columns) => {

            if (err) {

                console.log(
                    "Could not check progress table:"
                );

                console.log(err.message);

                return;

            }


            const hasStarsColumn =
                columns.some(
                    column =>
                        column.name === "stars"
                );


            if (!hasStarsColumn) {

                db.run(
                    `
                    ALTER TABLE progress
                    ADD COLUMN stars INTEGER DEFAULT 0
                    `,
                    (alterErr) => {

                        if (alterErr) {

                            console.log(
                                "Could not add stars column:"
                            );

                            console.log(
                                alterErr.message
                            );

                        } else {

                            console.log(
                                "Stars column added to progress table."
                            );

                        }

                    }
                );

            } else {

                console.log(
                    "Stars column already exists."
                );

            }

        }
    );


    // ======================================
    // COUNT STUDENTS
    // ======================================

    db.get(
        "SELECT COUNT(*) AS total FROM students",
        (err, row) => {

            if (!err) {

                console.log(
                    "Students in database:",
                    row.total
                );

            }

        }
    );


    // ======================================
    // COUNT PROGRESS RECORDS
    // ======================================

    db.get(
        "SELECT COUNT(*) AS total FROM progress",
        (err, row) => {

            if (!err) {

                console.log(
                    "Progress records in database:",
                    row.total
                );

            }

        }
    );


    // ======================================
    // CHECK STARS COLUMN
    // ======================================

    db.all(
        `PRAGMA table_info(progress)`,
        (err, columns) => {

            if (err) {

                console.log(
                    "Could not verify progress columns:"
                );

                console.log(
                    err.message
                );

                return;

            }


            const starsColumn =
                columns.find(
                    column =>
                        column.name === "stars"
                );


            if (starsColumn) {

                console.log(
                    "Progress stars column: READY"
                );

            } else {

                console.log(
                    "Progress stars column: NOT FOUND"
                );

            }

        }
    );

});


// ======================================
// EXPORT DATABASE
// ======================================

module.exports = db;