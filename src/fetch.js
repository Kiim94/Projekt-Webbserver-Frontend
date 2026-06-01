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

export async function createMenyItem(data, token){
    const response = await fetch(url + "/meny", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
    const respData = await response.json();
    if(!response.ok){
        throw new Error("Kunde inte skapa ny meny-item");
    }
    return respData;
}

export async function updateItem(id, data, token){
    const response = await fetch(url + "/meny/" + id,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });
    const respData = await response.json();
    if(!response.ok){
        throw new Error("Kunde inte uppdatera meny-item");
    }
    return respData;
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
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.error || "Inloggning misslyckades")
    }
    return data;
}

//skapa användare
export async function register(username, password){
    const response = await fetch(url + "/auth/register", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password})
    });
    const data = await response.json();

    if(!response.ok){
        throw new Error(data.error || "Registreringen misslyckades!")
    }
    return data;
}
//hämta användare
export async function getAdmins(token){
    const response = await fetch(url +"/auth/admins" , {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if(!response.ok){
        throw new Error("Kunde inte hämta admins");
    }
    return response.json();
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
//radera menyitem
export async function deleteMenyItem(id, token){
    const response = await fetch(url + "/meny/" + id,{
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.error || "Kunde inte ta bort admin");
    }
    return data;
}

//radera användare
export async function deleteAdmin(id, token){
    const response = await fetch(url + "/auth/admins/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.error || "Kunde inte ta bort admin");
    }
    return data;
}