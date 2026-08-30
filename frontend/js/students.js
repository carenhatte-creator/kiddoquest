const API_BASE = "http://localhost:5001/api";

let students = [];
let editID = null;

const modal = document.getElementById("studentModal");
const openAdd = document.getElementById("openAdd");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveStudent");

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let deleteID = null;

const table = document.getElementById("studentTable");
const search = document.getElementById("search");
const message = document.getElementById("message");


// ===============================
// GET LOGGED IN TEACHER
// ===============================

function getTeacher() {

    const teacher = JSON.parse(
        localStorage.getItem("teacher")
    );


    if (!teacher) {

        alert("Please login first.");

        window.location.href = "login.html";

        return null;

    }


    return teacher;

}



// ===============================
// DISPLAY TEACHER NAME (sidebar)
// ===============================

function displayTeacherName(){

    const teacher = getTeacher();

    if(!teacher) return;

    const teacherNameEl =
    document.getElementById("teacherName");

    if(teacherNameEl){

        teacherNameEl.textContent =
        teacher.username;

    }

}

displayTeacherName();



// ===============================
// OPEN MODAL
// ===============================

openAdd.onclick = () => {

    editID = null;

    clearForm();

    modal.style.display = "flex";

};



// ===============================
// CLOSE MODAL
// ===============================

closeModal.onclick = () => {

    modal.style.display = "none";

    clearForm();

    editID = null;

};



// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents() {

    const teacher = getTeacher();

    if (!teacher) return;


    try {

        const response = await fetch(
            `${API_BASE}/students?teacher_id=${teacher.id}`
        );


        const data = await response.json();


        console.log("STUDENTS:", data);



        if(data.success){


            students = data.students || [];


            displayStudents(students);


        }else{


            showMessage(
                data.message,
                "error"
            );


        }


    }catch(err){


        console.log(err);


        showMessage(
            "Cannot connect to server.",
            "error"
        );


    }

}

// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(data) {


    table.innerHTML = "";



    if(data.length === 0){


        table.innerHTML = `

        <tr>

            <td colspan="5">

                No students found.

            </td>

        </tr>

        `;


        return;

    }



    data.forEach((student,index)=>{


        table.innerHTML += `


        <tr>


            <td>

                ${index + 1}

            </td>



            <td>

                ${student.first_name}

                ${student.last_name}

            </td>



            <td>

                ${student.age}

            </td>



            <td>

                ${student.gender}

            </td>



            <td>


                <button

                class="action-btn edit"

                onclick="editStudent(${student.id})">

                ✏ Edit

                </button>



                <button

                class="action-btn delete"

                onclick="deleteStudent(${student.id})">

                🗑 Delete

                </button>



                <button

                class="action-btn play"

                onclick="playGame(${student.id})">

                ▶ Play

                </button>



            </td>


        </tr>


        `;


    });


}



// ===============================
// SAVE STUDENT
// ===============================

saveBtn.onclick = async()=>{


    const teacher = getTeacher();


    if(!teacher)return;



    const student = {


        teacher_id: teacher.id,


        first_name:

        document.getElementById("first_name").value.trim(),



        last_name:

        document.getElementById("last_name").value.trim(),



        age:

        document.getElementById("age").value,



        gender:

        document.getElementById("gender").value


    };



    if(

        !student.first_name ||

        !student.last_name ||

        !student.age ||

        !student.gender

    ){


        showMessage(

            "Please complete all fields.",

            "error"

        );


        return;


    }



    try{


        const response = await fetch(

            `${API_BASE}/students`,

            {


                method:"POST",


                headers:{


                    "Content-Type":"application/json"

                },


                body:JSON.stringify(student)


            }

        );



        const data = await response.json();



        console.log(data);



        if(data.success){


            modal.style.display="none";


            clearForm();



            showMessage(

                "Student added successfully!",

                "success"

            );



            loadStudents();



        }

        else{


            showMessage(

                data.message,

                "error"

            );


        }



    }catch(err){


        console.log(err);


        showMessage(

            "Cannot connect to server.",

            "error"

        );


    }


};



// ===============================
// EDIT STUDENT
// ===============================

function editStudent(id){


    const student = students.find(

        s=>s.id==id

    );


    if(!student)return;



    document.getElementById("first_name").value =
    student.first_name;



    document.getElementById("last_name").value =
    student.last_name;



    document.getElementById("age").value =
    student.age;



    document.getElementById("gender").value =
    student.gender;



    editID=id;



    modal.style.display="flex";


}



// ===============================
// PLAY GAME
// ===============================

function playGame(id){


    const student = students.find(

        s=>s.id==id

    );



    if(!student)return;



    localStorage.setItem(

        "selectedStudent",

        JSON.stringify(student)

    );



    window.location.href="minigames.html";


}



// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(id){


    deleteID = id;


    deleteModal.style.display = "flex";


}



// ===============================
// CANCEL DELETE
// ===============================

cancelDeleteBtn.onclick = () => {


    deleteModal.style.display = "none";


    deleteID = null;


};



// ===============================
// CONFIRM DELETE
// ===============================

confirmDeleteBtn.onclick = async () => {


    if(!deleteID) return;


    try{


        const response = await fetch(

            `${API_BASE}/students/${deleteID}`,

            {

                method:"DELETE",

                headers:{

                    "Content-Type":"application/json"

                }

            }

        );



        const data = await response.json();


        console.log(data);



        if(data.success){


            showMessage(

                "Student deleted successfully!",

                "success"

            );



            loadStudents();


        }

        else{


            showMessage(

                data.message,

                "error"

            );


        }



    }catch(err){


        console.log(err);


        showMessage(

            "Cannot connect to server.",

            "error"

        );


    }


    deleteModal.style.display = "none";


    deleteID = null;


};



// ===============================
// SEARCH
// ===============================

search.addEventListener(

"keyup",

()=>{


    const keyword =

    search.value.toLowerCase();



    const filtered = students.filter(student=>


        student.first_name.toLowerCase()

        .includes(keyword)



        ||

        student.last_name.toLowerCase()

        .includes(keyword)


    );



    displayStudents(filtered);



});



// ===============================
// CLEAR FORM
// ===============================

function clearForm(){


    document.getElementById("first_name").value="";


    document.getElementById("last_name").value="";


    document.getElementById("age").value="";


    document.getElementById("gender").value="";


}



// ===============================
// MESSAGE
// ===============================

function showMessage(text,type){


    message.style.display="block";


    message.className =

    `message ${type}`;



    message.innerHTML=text;



    setTimeout(()=>{


        hideMessage();


    },3000);


}



function hideMessage(){


    message.style.display="none";


}



// ===============================
// SIDEBAR AVATAR
// ===============================

function loadSidebarAvatar(){

    const teacher = getTeacher();

    if(!teacher) return;

    const avatarText =
    document.getElementById("sidebarAvatar");

    const avatarImg =
    document.getElementById("sidebarAvatarImg");

    if(!avatarText || !avatarImg) return;

    const initial =
    (teacher.fullname || teacher.username || "T")
    .trim().charAt(0).toUpperCase();

    avatarText.textContent = initial;

    const savedPicture =
    localStorage.getItem(`profilePicture_${teacher.id}`);

    if(savedPicture){

        avatarImg.src = savedPicture;
        avatarImg.hidden = false;
        avatarText.style.display = "none";

    }

}

loadSidebarAvatar();



// ===============================
// START
// ===============================

loadStudents();