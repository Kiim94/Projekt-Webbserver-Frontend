import { getMeny } from "./fetch.js";
import './style.scss'
const output = document.getElementById("output");

//olika containers beroende på vilken menyrätt
const hotWrap = document.getElementById("hot");
const coldWrap = document.getElementById("cold");
const sandwichWrap = document.getElementById("sandwich");
const otherWrap = document.getElementById("other");

//hamburgermeny
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
})

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
    //pga render: en "laddar" för att användare ska förstå att menyn laddas
    output.classList.add("loading");
    output.innerText="Väcker servern och hämtar menyn..."
    output.classList.remove("error");

    const meny = await getMeny();
    output.classList.remove("loading");
    output.innerText="";

    //istället för att skriva ut hela menyn huller om buller, gör kategorier
    const hot = meny.filter(item => item.category === "hot_drinks");
    const cold = meny.filter(item => item.category === "cold_drinks");
    const sandwiches = meny.filter(item => item.category === "sandwich");
    const other = meny.filter(item => item.category === "other");

    //map() för att skapa ny array enligt nedan. join() för att skapa lista
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
      
      //flytta rätt meny-rätter till rätt plats
      hotWrap.innerHTML = renderItems(hot);
      coldWrap.innerHTML = renderItems(cold);
      sandwichWrap.innerHTML = renderItems(sandwiches);
      otherWrap.innerHTML = renderItems(other);
  }catch(err){
    output.classList.add("error");
    output.innerText = "Något gick fel. Testa att ladda om sidan eller vänta en stund";
    console.error("Laddning av meny misslyckades: ", err);
  }
}