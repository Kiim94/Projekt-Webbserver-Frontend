

//logga ut
export function initLogOut(){
    const logoutBtn = document.getElementById("logoutBtn");
    //logga ut -> man skickas till startsida, utloggad
    if(logoutBtn){
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("token");
            window.location.href ="index.html";
        })
    }
}