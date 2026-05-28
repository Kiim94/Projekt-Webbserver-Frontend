import './style.scss'
import { getReviews, postReview } from "./fetch.js";

const reviewContainer = document.getElementById("reviews");
const reviewForm = document.getElementById("reviewForm");
const wrongMessage = document.getElementById("smthWrong");

const list = document.getElementById("reviewList");

document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
})

async function loadReviews(){
    try{
        //hämta recensioner
        const reviews = await getReviews();
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

reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
    const rating = Number(document.querySelector("#rating").value);
    
    wrongMessage.classList.remove("error", "success");

    try{

        if(!name ||!message ||!rating){
            wrongMessage.classList.add("error");
            wrongMessage.innerHTML = "Fyll i alla fält innan du skickar din recension"
            return;
        }

        await postReview({ name, message, rating });

        reviewForm.reset();

        wrongMessage.classList.add("success");
        wrongMessage.innerHTML = "Tack för din recension!"

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