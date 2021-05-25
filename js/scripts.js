/************************************************
Treehouse FSJS Techdegree:
Project 5 - Employee Directory
************************************************/

const gallery = document.getElementById("gallery");
const dataUrl = "https://randomuser.me/api/?exc=gender,login,registered,phone,id&results=12&nat=us";

async function getJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch(error) {
        throw error;
    }
}

async function getEmployees(url) {
    const profiles = await getJSON(url)
                            .then(data => data.results);
    return profiles;
}

function generateHTML(data) {
    data.map(person => {
        const card = document.createElement("div");
        card.className = "card";

        const cardImage = document.createElement("div");
        cardImage.className = "card-img-container";
        cardImage.insertAdjacentHTML("beforeend", `
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        `);

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info-container";
        cardInfo.insertAdjacentHTML("beforeend", `
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        `);

        card.appendChild(cardImage)
        card.appendChild(cardInfo)
        gallery.appendChild(card);
    })

    // console.log(data);
}

window.addEventListener("load", async () => {
    const employees = await getEmployees(dataUrl);
    generateHTML(employees)
});












