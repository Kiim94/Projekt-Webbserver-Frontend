import './style.scss'
import { login } from "./fetch.js";

document.addEventListener("DOMContentLoaded", initLogin);

function initLogin(){
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    if(!form || !message) return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        message.classList.remove("error", "success");
        message.innerText = "";

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        if(!username || !password){
            message.innerText = "Fyll i alla fält!";
            message.classList.add("error");
            return;
        }

        try{
            message.classList.remove("error", "success");
            const data = await login(username, password);
            if(data && data.token){
                localStorage.setItem("token", data.token);
                message.innerText = "Inloggad!";
                message.classList.remove("error");
                message.classList.add("success");
                window.location.href = "/admin.html";
            }else{
                message.innerText = data.error || "Fel inloggning!";
                message.classList.add("error");
            }
        }catch(err){
            console.log("CATCH ERROR:", err);
            message.innerText = "Serverfel";
            message.classList.add("error");
        }
    })
}