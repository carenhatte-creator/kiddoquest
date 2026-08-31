// =========================================================
// KIDDOQUEST - POSTGRESQL DATABASE
// PostgreSQL version
// Compatible with existing controllers
// =========================================================

const { Pool } = require("pg");

// =========================================================
// DATABASE URL
// =========================================================

const DATABASE_URL = process.env.DATABASE_URL;


// =========================================================
// CHECK DATABASE URL
// =========================================================

if (!DATABASE_URL) {

    console.error("");
    console.error("===================================");
    console.error("DATABASE ERROR");
    console.error("===================================");
    console.error("DATABASE_URL is not configured.");
    console.error(
        "Please add DATABASE_URL to Render Environment Variables."
    );
    console.error("===================================");
    console.error("");

}


// =========================================================
// POSTGRESQL CONNECTION POOL
// =========================================================

const pool = new Pool({

    connectionString: DATABASE_URL,

    ssl: DATABASE_URL
        ? {
            rejectUnauthorized: false
        }
        : false

});


// =========================================================
// POSTGRESQL CONNECTION
// =========================================================

pool.on("connect", () => {

    console.log("");
    console.log("===================================");
    console.log("Connected to PostgreSQL Database");
    console.log("===================================");
    console.log("");

});


pool.on("error", (err) => {

    console.error(
        "Unexpected PostgreSQL pool error:",
        err
    );

});


// =========================================================
// DATABASE STATUS
// =========================================================

let databaseReady = false;

let databaseInitialization = null;


// =========================================================
// INITIALIZE DATABASE
// =========================================================

async function initializeDatabase() {

    // Prevent multiple database initialization
    if (databaseInitialization) {

        return databaseInitialization;

    }


    databaseInitialization = (async () => {

        // =================================================
        // CHECK DATABASE URL
        // =================================================

        if (!DATABASE_URL) {

            throw new Error(
                "DATABASE_URL environment variable is missing."
            );

        }


        // =================================================
        // GET CLIENT
        // =================================================

        const client =
            await pool.connect();


        try {

            // =================================================
            // BEGIN TRANSACTION
            // =================================================

            await client.query(
                "BEGIN"
            );


            // =================================================
            // TEACHERS TABLE
            // =================================================

            await client.query(`

                CREATE TABLE IF NOT EXISTS teachers (

                    id SERIAL PRIMARY KEY,

                    fullname TEXT NOT NULL,

                    username TEXT UNIQUE NOT NULL,

                    password TEXT NOT NULL,

                    created_at TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP

                )

            `);


            // =================================================
            // STUDENTS TABLE
            // =================================================

            await client.query(`

                CREATE TABLE IF NOT EXISTS students (

                    id SERIAL PRIMARY KEY,

                    teacher_id INTEGER NOT NULL,

                    first_name TEXT NOT NULL,

                    last_name TEXT NOT NULL,

                    age INTEGER,

                    gender TEXT,

                    created_at TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP,

                    CONSTRAINT fk_students_teacher

                    FOREIGN KEY (teacher_id)

                    REFERENCES teachers(id)

                    ON DELETE CASCADE

                )

            `);


            // =================================================
            // PROGRESS TABLE
            // =================================================

            await client.query(`

                CREATE TABLE IF NOT EXISTS progress (

                    id SERIAL PRIMARY KEY,

                    teacher_id INTEGER NOT NULL,

                    student_id INTEGER NOT NULL,

                    category TEXT NOT NULL,

                    activity TEXT NOT NULL,

                    score INTEGER DEFAULT 0,

                    stars INTEGER DEFAULT 0,

                    status TEXT
                    DEFAULT 'Not Started',

                    created_at TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP,

                    CONSTRAINT fk_progress_teacher

                    FOREIGN KEY (teacher_id)

                    REFERENCES teachers(id)

                    ON DELETE CASCADE,

                    CONSTRAINT fk_progress_student

                    FOREIGN KEY (student_id)

                    REFERENCES students(id)

                    ON DELETE CASCADE

                )

            `);


            // =================================================
            // ADD STARS COLUMN IF IT DOES NOT EXIST
            // =================================================

            await client.query(`

                ALTER TABLE progress

                ADD COLUMN IF NOT EXISTS
                stars INTEGER DEFAULT 0

            `);


            // =================================================
            // ADD STATUS COLUMN IF IT DOES NOT EXIST
            // =================================================

            await client.query(`

                ALTER TABLE progress

                ADD COLUMN IF NOT EXISTS
                status TEXT DEFAULT 'Not Started'

            `);


            // =================================================
            // COUNT TEACHERS
            // =================================================

            const teacherCount =
                await client.query(`

                    SELECT COUNT(*) AS total

                    FROM teachers

                `);


            // =================================================
            // COUNT STUDENTS
            // =================================================

            const studentCount =
                await client.query(`

                    SELECT COUNT(*) AS total

                    FROM students

                `);


            // =================================================
            // COUNT PROGRESS
            // =================================================

            const progressCount =
                await client.query(`

                    SELECT COUNT(*) AS total

                    FROM progress

                `);


            // =================================================
            // COMMIT
            // =================================================

            await client.query(
                "COMMIT"
            );


            // =================================================
            // DATABASE READY
            // =================================================

            databaseReady = true;


            console.log("");
            console.log("===================================");
            console.log("POSTGRESQL DATABASE READY");
            console.log("===================================");

            console.log(
                "Teachers in database:",
                teacherCount.rows[0].total
            );

            console.log(
                "Students in database:",
                studentCount.rows[0].total
            );

            console.log(
                "Progress records in database:",
                progressCount.rows[0].total
            );

            console.log(
                "Progress stars column: READY"
            );

            console.log("===================================");
            console.log("");


        } catch (error) {

            // =================================================
            // ROLLBACK IF ERROR
            // =================================================

            await client.query(
                "ROLLBACK"
            );


            console.error("");
            console.error(
                "==================================="
            );
            console.error(
                "DATABASE INITIALIZATION FAILED"
            );
            console.error(
                "==================================="
            );

            console.error(
                error.message
            );

            console.error(
                "==================================="
            );

            console.error("");

            throw error;

        } finally {

            // =================================================
            // RELEASE CLIENT
            // =================================================

            client.release();

        }

    })();


    return databaseInitialization;

}


// =========================================================
// CONVERT SQLITE ? PLACEHOLDERS
// TO POSTGRESQL $1, $2, $3...
// =========================================================

function convertPlaceholders(sql) {

    let index = 0;


    return sql.replace(
        /\?/g,
        () => {

            index++;

            return `$${index}`;

        }
    );

}


// =========================================================
// GET ONE ROW
//
// Compatible with:
//
// db.get(
//     sql,
//     params,
//     callback
// );
//
// =========================================================

function get(
    sql,
    params,
    callback
) {

    // =================================================
    // SUPPORT db.get(sql, callback)
    // =================================================

    if (
        typeof params === "function"
    ) {

        callback = params;

        params = [];

    }


    // =================================================
    // DEFAULT PARAMS
    // =================================================

    if (!Array.isArray(params)) {

        params = [];

    }


    // =================================================
    // INITIALIZE DATABASE
    // =================================================

    initializeDatabase()

        .then(() => {

            const postgresSQL =
                convertPlaceholders(sql);


            return pool.query(

                postgresSQL,

                params

            );

        })

        .then(result => {

            // =================================================
            // RETURN FIRST ROW
            // =================================================

            callback(

                null,

                result.rows[0] || undefined

            );

        })

        .catch(error => {

            console.error(
                "DATABASE GET ERROR:",
                error.message
            );


            callback(
                error
            );

        });

}


// =========================================================
// GET MULTIPLE ROWS
//
// Compatible with:
//
// db.all(
//     sql,
//     params,
//     callback
// );
//
// =========================================================

function all(
    sql,
    params,
    callback
) {

    // =================================================
    // SUPPORT db.all(sql, callback)
    // =================================================

    if (
        typeof params === "function"
    ) {

        callback = params;

        params = [];

    }


    // =================================================
    // DEFAULT PARAMS
    // =================================================

    if (!Array.isArray(params)) {

        params = [];

    }


    // =================================================
    // INITIALIZE DATABASE
    // =================================================

    initializeDatabase()

        .then(() => {

            const postgresSQL =
                convertPlaceholders(sql);


            return pool.query(

                postgresSQL,

                params

            );

        })

        .then(result => {

            // =================================================
            // RETURN ALL ROWS
            // =================================================

            callback(

                null,

                result.rows

            );

        })

        .catch(error => {

            console.error(
                "DATABASE ALL ERROR:",
                error.message
            );


            callback(
                error
            );

        });

}


// =========================================================
// RUN INSERT / UPDATE / DELETE
//
// Compatible with:
//
// db.run(
//     sql,
//     params,
//     callback
// );
//
// =========================================================

function run(
    sql,
    params,
    callback
) {

    // =================================================
    // SUPPORT db.run(sql, callback)
    // =================================================

    if (
        typeof params === "function"
    ) {

        callback = params;

        params = [];

    }


    // =================================================
    // DEFAULT PARAMS
    // =================================================

    if (!Array.isArray(params)) {

        params = [];

    }


    // =================================================
    // INITIALIZE DATABASE
    // =================================================

    initializeDatabase()

        .then(async () => {

            // =================================================
            // CONVERT SQL
            // =================================================

            const postgresSQL =
                convertPlaceholders(sql);


            // =================================================
            // CHECK IF INSERT
            // =================================================

            const isInsert =
                /^\s*INSERT\s+/i.test(
                    postgresSQL
                );


            let finalSQL =
                postgresSQL;


            // =================================================
            // POSTGRES RETURNING ID
            // =================================================

            if (isInsert) {

                finalSQL =
                    `${postgresSQL} RETURNING id`;

            }


            // =================================================
            // EXECUTE QUERY
            // =================================================

            const result =
                await pool.query(

                    finalSQL,

                    params

                );


            // =================================================
            // LAST INSERT ID
            // =================================================

            let lastID =
                undefined;


            if (
                isInsert &&
                result.rows.length > 0
            ) {

                lastID =
                    result.rows[0].id;

            }


            // =================================================
            // NUMBER OF CHANGED ROWS
            // =================================================

            const changes =
                result.rowCount || 0;


            // =================================================
            // SQLITE-COMPATIBLE CONTEXT
            // =================================================

            const context = {

                lastID: lastID,

                changes: changes

            };


            // =================================================
            // CALLBACK
            // =================================================

            callback.call(

                context,

                null

            );

        })

        .catch(error => {

            console.error(
                "DATABASE RUN ERROR:",
                error.message
            );


            callback(
                error
            );

        });

}


// =========================================================
// CLOSE DATABASE
// =========================================================

async function close() {

    try {

        await pool.end();

        console.log(
            "PostgreSQL database connection closed."
        );

    } catch (error) {

        console.error(
            "Error closing PostgreSQL:",
            error.message
        );

    }

}


// =========================================================
// EXPORT
// =========================================================

module.exports = {

    get,

    all,

    run,

    close,

    pool,

    initializeDatabase,

    get databaseReady() {

        return databaseReady;

    }

};