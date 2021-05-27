/************************************************
Treehouse FSJS Techdegree:
Project 5 - Employee Directory
************************************************/






//------------------------------
//               *
//------------------------------
const dataUrl = "https://randomuser.me/api/?exc=gender,login,registered,phone,id&results=12&nat=us";
const gallery = document.getElementById("gallery");
const body = document.querySelector("body");
const script = document.querySelector("script");
const searchContainer = document.getElementsByClassName("search-container")[0];




//------------------------------
//          GALLERY
//------------------------------
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
    });
}





//------------------------------
//           MODAL
//------------------------------
function getSelectedProfile(employees, selected, prev, next) {
    for (let i = 0; i < employees.length; i++) {
        const name = `${employees[i].name.first} ${employees[i].name.last}`;
        if (name === selected) {
            if (prev === true && i > 0) {
                generateModal(employees[i - 1]);
            } else if (next === true && i < employees.length - 1) {
                generateModal(employees[i + 1]);
            } else {
                generateModal(employees[i]);
            }
        }
    }
}

function generateModal(profile) {
    const container = document.createElement("div");
    container.className = "modal-container";

    const modal = document.createElement("div");
    modal.className = "modal";

    const modalInfo = document.createElement("div");
    modalInfo.className = "modal-info-container";
    modal.insertAdjacentHTML("beforeend", `
        <img class="modal-img" src="${profile.picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
        <p class="modal-text">${profile.email}</p>
        <p class="modal-text cap">${profile.location.city}</p>
        <hr>
        <p class="modal-text">${format(profile.cell, "cell")}</p>
        <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}., 
                                ${profile.location.city}, 
                                ${profile.location.state} ${profile.location.postcode}</p>
        <p class="modal-text">Birthday: ${format(profile.dob.date, "date")}</p>
    `);

    const modalButtons = document.createElement("div");
    modalButtons.className = "modal-btn-container";
    modalButtons.insertAdjacentHTML("beforeend", `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    `);

    modal.appendChild(modalInfo);
    modalInfo.insertAdjacentHTML("beforebegin", `
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    `);
    container.appendChild(modal);
    container.appendChild(modalButtons);
    body.insertBefore(container, script);
}
function format(data, type) {
    let newData = "";
    if (type === "date") {
        const birthday = new Date(Date.parse(data));
        newData = `${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`;
    } else if (type === "cell") {
        newData = data.replace("-", " ");
    }
    return newData;
}

function openModal(element) {
    let name = "";
        if (element.className === "card") {
            name = element.children[1].firstElementChild.textContent;
        } else if (element.parentElement.className === "card") {
            name = element.parentElement.children[1].firstElementChild.textContent;
        } else if (element.parentElement.parentElement.className === "card") {
            name = element.parentElement.parentElement.children[1].firstElementChild.textContent;
        }
        return name;
}
function changeModal(element) {
    let name = element.parentElement.previousSibling.children[1].textContent;
    return name;
}




//------------------------------
//          SEARCH
//------------------------------
function addSearch() {
    const form = document.createElement("form");
    form.action = "#";
    form.method = "get";

    form.insertAdjacentHTML("beforeend", `
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    `);

    searchContainer.appendChild(form);
}

function getInput() {
    const input = document.getElementById("search-input").value;
    return input;
}

function search(employees, input) {
    let results = [];
    employees.forEach(person => {
        const name = `${person.name.first} ${person.name.last}`;
        if (name.toLowerCase().includes(input.toLowerCase())) {
            results.push(person);
        }
    });
    return results;
}






//------------------------------
//      EVENT LISTENERS
//------------------------------
window.addEventListener("load", async () => {
    addSearch();

    const employees = await getEmployees(dataUrl);
    generateHTML(search(employees, getInput()));
    
    searchContainer.addEventListener("click", (e) => {
        if (e.target.id === "search-submit") {
            gallery.innerHTML = "";
            generateHTML(search(employees, getInput())); 
        }
    })
    searchContainer.addEventListener("keyup", (e) => {
        gallery.innerHTML = "";
        generateHTML(search(employees, getInput())); 
    })
    
    body.addEventListener("click", (e) => {
        getSelectedProfile(search(employees, getInput()), openModal(e.target));
        
        if (e.target.tagName === "BUTTON" || e.target.parentElement.tagName === "BUTTON") {
            document.getElementsByClassName("modal-container")[0].remove();

            if (e.target.id === "modal-prev") {
                getSelectedProfile(search(employees, getInput()), changeModal(e.target), true, false);
            }
            if (e.target.id === "modal-next") {
                getSelectedProfile(search(employees, getInput()), changeModal(e.target), false, true);
            }
        }
    });
});
