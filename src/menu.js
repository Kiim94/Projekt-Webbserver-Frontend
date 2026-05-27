import { getMeny } from "./fetch.js";
import './style.scss'
const output = document.getElementById("output");
//const menyContainer = document.getElementById("app");
const hotWrap = document.getElementById("hot");
const coldWrap = document.getElementById("cold");
const sandwichWrap = document.getElementById("sandwich");
const otherWrap = document.getElementById("other");

//kategori namn på engelska: inte vackra
//skriver över här med svenska

const categoryNames = {
  hot_drinks: "Varma drycker",
  cold_drinks: "Kalla drycker",
  sandwich: "Smörgåsar",
  other: "Annat"
}

document.addEventListener("DOMContentLoaded", () => {
  loadMeny();
});

//skriv ut maträtter till meny
async function loadMeny(){
  try{
    const meny = await getMeny();

    output.classList.remove("error");

    //istället för att skriva ut hela menyn huller om buller, gör kategorier
    const hot = meny.filter(item => item.category === "hot_drinks");
    const cold = meny.filter(item => item.category === "cold_drinks");
    const sandwiches = meny.filter(item => item.category === "sandwich");
    const other = meny.filter(item => item.category === "other");

    const renderItems = (items) => items.map(item => `
      <li class="meny-item">
      <div class="row">
        <span class="dish-name">${item.name}</span>
        <span class="dots"></span>
        <span class="price">${item.price} kr</span>
      </div>
          <p class="category">${categoryNames[item.category] || item.category}</p>
          <p class="description">${item.description || ""}</p>
          <p class="allergens">Allergener: ${item.allergens || "inga"}</p>
      </li>`).join("");
      
      hotWrap.innerHTML = renderItems(hot);
      coldWrap.innerHTML = renderItems(cold);
      sandwichWrap.innerHTML = renderItems(sandwiches);
      otherWrap.innerHTML = renderItems(other);
  }catch(err){
    output.classList.add("error");
    output.innerText = err.message;
  }
}