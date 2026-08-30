// ==========================================
// HELPER FUNCTIONS
// ==========================================


// CHECK EMPTY VALUE

const isEmpty = (value) => {

    return (
        value === undefined ||
        value === null ||
        value === ""
    );

};



module.exports = {

    isEmpty

};