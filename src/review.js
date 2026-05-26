import './style.scss'
import { getReviews, postReview } from "./fetch.js";

const reviewContainer = document.getElementById("reviews");
const reviewForm = document.getElementById("reviewForm");

const list = document.getElementById("reviewList");

document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
})

async function loadReviews(){
    const reviews = await getReviews();

    reviewContainer.innerHTML = reviews.map(rev => `
        <div class="review-card">
            <h3>${rev.name}</h3>
            <p>${"⭐".repeat(rev.rating)}<span>(${rev.rating}/5)</span></p>
            <p>${rev.message}</p>
            <p>${new Date(rev.createdAt).toLocaleDateString("sv")}</p>
        </div>`).join("");
}

reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
    const rating = Number(document.querySelector("#rating").value);

    if(!name ||!message ||!rating){
        return;
    }
    try{
        await postReview({ name, message, rating });

        reviewForm.reset();
        loadReviews();
    }catch(err){
        console.error(err);
        alert("Kunde inte skicka recension")
    }
})