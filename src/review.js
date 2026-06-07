import './style.scss'
import { getReviews, postReview } from "./fetch.js";

const reviewContainer = document.getElementById("reviews");
const reviewForm = document.getElementById("reviewForm");
const wrongMessage = document.getElementById("smthWrong");

const list = document.getElementById("reviewList");

//hamburgermeny
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
})

//laddar in recensioner
async function loadReviews(){
    try{
        //hämta recensioner
        const reviews = await getReviews();
        //skapa recensioner med element nedan: map() för att skapa ny array inuti reviewContainer
        //join för att göra lång lista
        //repeat(rev.rating) -> repetera antalet stjärnor efter vilen siffra recensent valde
        //ex: valt 3, visar ⭐⭐⭐
        reviewContainer.innerHTML = reviews.map(rev => `
        <div class="review-card">
            <h3>${rev.name}</h3>
            <p>${"⭐".repeat(rev.rating)}<span>(${rev.rating}/5)</span></p>
            <p>${rev.message}</p>
            <p>${new Date(rev.createdAt).toLocaleDateString("sv")}</p>
        </div>`).join("");
    }catch(err){
        console.error(err);
        wrongMessage.classList.add("error");
        wrongMessage.innerHTML = "Kunde inte ladda recensioner. Försök igen senare";
    }
}

//skapa recension
reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
    //ingen trim pga att det är ett nummer
    const rating = Number(document.querySelector("#rating").value);
    
    wrongMessage.classList.remove("error", "success");

    try{
        //visa felmeddelande om ngt fält inte är ifyllt, avbryt så inget skickas
        if(!name ||!message ||!rating){
            wrongMessage.classList.add("error");
            wrongMessage.innerHTML = "Fyll i alla fält innan du skickar din recension"
            return;
        }
        //vänta på att kunna skicka POST request till backend (se fetch.js)
        await postReview({ name, message, rating });

        //återställ formulär
        reviewForm.reset();

        wrongMessage.classList.add("success");
        wrongMessage.innerHTML = "Tack för din recension!"

        //visa meddelande ett tag, ta bort sedan
        setTimeout(() => {
            wrongMessage.innerHTML = "";
            wrongMessage.classList.remove("error", "success");
        }, 2000);

        loadReviews();

    }catch(err){
        console.error(err);
        wrongMessage.classList.add("error");
        wrongMessage.innerHTML = "Kunde inte skicka recensionen. Försök igen senare."
    }
})