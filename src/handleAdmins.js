import { register, getAdmins, deleteAdmin } from "./fetch.js";
import { initLogOut } from "./auth.js";
import './style.scss'

//hamburgermeny
const adminBtn = document.getElementById("adminMenuBtn");
const adminMenu = document.getElementById("adminMenu");

adminBtn.addEventListener("click", () => {
  adminBtn.classList.toggle("active");
  adminMenu.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
    initLogOut();
})

const regForm = document.getElementById("registerForm");
const regMessage = document.getElementById("regMessage");

//registrera användare. Om regForm och regMessage finns på sidan, så fortsätt med koden.
if (regForm && regMessage){
    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        regMessage.classList.remove("error", "success");
        regMessage.innerText = "";

        const username = document.getElementById("regName").value.trim();
        const password = document.getElementById("regPassword").value;

        if(!username || !password){
            regMessage.classList.remove("success");
            regMessage.innerText = "Fyll i både användarnamn och lösenord!"
            regMessage.classList.add("error");
            return;
        }
        try{
            const response = await register(username, password);
            regMessage.classList.remove("error");
            regMessage.innerText = response.message || "Användare har skapats!";
            regMessage.classList.add("success");

        }catch (err){
            regMessage.classList.remove("success");
            regMessage.innerText = err.message;
            regMessage.classList.add("error");
        }
    })
}

//Ladda alla användare till admin.html
async function loadAdmins(){
    const container = document.getElementById("adminList");
    if(!container){
        return;
    }
    try{
        const token = sessionStorage.getItem("token");
        const admins = await getAdmins(token);
        container.innerHTML = "";

        //for each admin, skapa ett "kort". Ingen redigering - antingen skapa eller radera användare
        admins.forEach(admin => {
            const div = document.createElement("div");
            div.classList.add("admin-cards");
            const btn = document.createElement("button");
            btn.textContent = "Radera";
            btn.dataset.id=admin._id;

            btn.addEventListener("click", async () => {
                if(!confirm("Vill du ta bort denna admin?")) return;

                //deleteAdmin från fetch.js
                await deleteAdmin(admin._id, token);
                loadAdmins();
            });

            div.innerHTML = `<p>${admin.username}</p>`;
            div.appendChild(btn);

            container.appendChild(div);
        })

    }catch(err){
        console.error("Kunde inte ladda admins:", err);
        container.innerHTML = "Det gick inte att ladda in alla admins, försök igen senare"
    }
}
if(document.getElementById("adminList")){
    loadAdmins();
}