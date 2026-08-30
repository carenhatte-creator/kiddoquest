// ========================================
// KinderQuest API
// ========================================

const API_BASE = "https://kiddoquest-backend.onrender.com/api";;

const api = {

    // ==========================
    // GET
    // ==========================
    async get(url){

        const response = await fetch(
            API_BASE + url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return await response.json();

    },



    // ==========================
    // POST
    // ==========================
    async post(url,data){

        const response = await fetch(
            API_BASE + url,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(data)
            }
        );

        return await response.json();

    },



    // ==========================
    // PUT
    // ==========================
    async put(url,data){

        const response = await fetch(
            API_BASE + url,
            {
                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(data)
            }
        );

        return await response.json();

    },



    // ==========================
    // DELETE
    // ==========================
    async delete(url){

        const response = await fetch(
            API_BASE + url,
            {
                method:"DELETE",

                headers:{
                    "Content-Type":"application/json"
                }
            }
        );

        return await response.json();

    }

};


// para magamit sa ibang JS file
window.api = api;