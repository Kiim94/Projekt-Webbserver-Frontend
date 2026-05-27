//fetch: för att hämta data från backend

const url = import.meta.env.VITE_CAFE_URL;

//visa menyn. Ingen metod behövs
export async function getMeny(){
    const response = await fetch(url +"/meny");
    if(!response.ok){
        throw new Error("Kunde inte hämta meny");
    }
    return response.json();
}

//logga in: hämta inskrivet användarnamn + lösenord, jämför mot databas
export async function login(username, password){
    const response = await fetch(url + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });
    if(!response.ok){
        throw new Error("Inloggning misslyckades")
    }
    return await response.json();
}


//för gästbok/recension sida
export async function getReviews(){
    const response = await fetch(url + "/review");
    if(!response.ok){
        throw new Error("Kunde inte hämta recensioner")
    }
    return response.json();
}

export async function postReview(data){
    const response = await fetch(url + "/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if(!response.ok){
        throw new Error("Kunde inte skicka recension");
    }
    return response.json();
}

//RADERA. Ingen return response pga delete
//radera review
export async function deleteReview(id, token){
    const response = await fetch(url + "/review/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if(!response.ok){
        throw new Error("Kunde inte ta bort recension");
    }
}
//radera menyitem
export async function deleteMenyItem(id, token){
    const response = await fetch(url + "/meny/" + id,{
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if(!response.ok){
        throw new Error("Kunde inte ta bort meny-item");
    }
}
