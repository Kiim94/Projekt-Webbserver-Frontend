import './style.scss'
import { login, getMeny, deleteMenyItem, updateItem, createMenyItem } from "./fetch.js";
import { initLogOut } from "./auth.js";
//denna sida är bara för admin som är inloggad
//admin ska kunna lägga till, redigera, ta bort maträtter

//globala
const appDiv = document.getElementById("appAdmin");
const form = document.getElementById("addForm");
const message = document.getElementById("message");
let editingId = null;
const url = import.meta.env.VITE_CAFE_URL;

document.addEventListener("DOMContentLoaded", () =>{
    if(!requireAuth()) return;
    loadMeny();
    initLogOut();
});

//engelska namn på kategorier = inte vackra
const categoryNames = {
    hot_drinks: "Varm dryck",
    cold_drinks: "Kall dryck",
    sandwich: "Smörgås",
    other: "Övrigt"
};

function requireAuth(){
    console.log("ADMIN PAGE LOADED");
    const token = sessionStorage.getItem("token");
    if(!token){
        window.location.href = "/loginAdmin.html";
        return false;
    }
    //return false/true: är användaren inloggad, sant eller falskt?
    return true;
}

//hämta/visa menyn. Knappar för att redigera/ta bort också
//categoryNames: ändra engelska kategori namn till svenska (bökigt här, men bra övning)

async function loadMeny(){
    try{
        const meny = await getMeny();
        if(!meny.length){
            appDiv.innerHTML = "<p>Ingen meny tillgänglig</p>";
            return;
        }
        appDiv.innerHTML = meny.map(item => `
            <div class="card">
            <h3>${item.name}</h3>
            <p class="price">${item.price} kr</p>
            <p class="category">${categoryNames[item.category]}</p>
            <p class="description">${item.description}</p>
            <p class="allergens">${item.allergens || "inga"}</p>
            <button class="delete-btn" data-id="${item._id}">Ta bort</button>
            <button class="edit-btn" data-id="${item._id}">Edit</button>
        </div>`).join("");
        
    }catch(err){
        console.error(err);
        message.classList.add("error");
        message.innerHTML = "<p>Fel vid hämtning av meny</p>";
    }  
}

//har två knappar i appDiv
//if appDiv - om appDiv hittas, gå vidare
//beroende på vilken knapp som klickas på, olika funktioner (edit/delete)
if(appDiv){
    appDiv.addEventListener("click", async (event) => {
        if(event.target.classList.contains("delete-btn")){
            deleteItem(event);
        }
        if(event.target.classList.contains("edit-btn")){
            editItem(event);
        }
    })
}
//radera från menyn
async function deleteItem(event){
    const id = event.target.dataset.id;
    const token = sessionStorage.getItem("token");
    try{
        await deleteMenyItem(id, token);
        loadMeny();
    }catch(err){
        console.error(err);
        message.innerText = "Kunde inte ta bort meny-item"
    }
}

//edit
async function editItem(event){
    const id = event.target.dataset.id;
    const meny = await getMeny();
    const item = meny.find(i => i._id === id);
    editingId = id;
    updateFormUI();

    document.getElementById("name").value = item.name;
    document.getElementById("price").value = item.price;
    document.getElementById("category").value = item.category;
    document.getElementById("description").value = item.description;
    document.getElementById("allergens").value = item.allergens;
}
    
//redigera rätt/lägg till ny rätt
//if först för att kontrollera om formuläret finns på sidan
if(form){
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        const body = {
            name:  document.getElementById("name").value.trim(),
            price: Number(document.getElementById("price").value),
            category:  document.getElementById("category").value,
            description:  document.getElementById("description").value.trim(),
            allergens: document.getElementById("allergens").value.trim()
        }

        //edit
        try{
            
            message.classList.remove("error", "success");
            message.classList.add("success");

            if(editingId){
                await updateItem(editingId, body, token);
                message.innerHTML = "Rätt har blivit uppdaterad!";
            }else{
                await createMenyItem(body, token);
                message.innerHTML = "Ny rätt tillagd!"
            }

            editingId = null;
            form.reset();
            updateFormUI();  
            loadMeny();

            //timeout för hur länge meddelande syns
            setTimeout(() => {
                message.innerHTML = "";
                message.classList.remove("success", "error");
            }, 2000);

        }catch(err){
            console.error(err);
            message.innerHTML = "Något gick fel, försök igen";
            message.classList.add("error");
        }
    });
}

//funktion för att ändra text på knapp när man antingen lägger till nytt eller uppdaterar
function updateFormUI(){
    const title = document.getElementById("edit-or-add");
    const btn = document.getElementById("addBtn");
    if(editingId){
        title.innerText = "Redigera rätt";
        btn.innerText = "Uppdatera";
    }else{
        title.innerText = "Lägg till ny rätt";
        btn.innerText = "Lägg till";
    }
}