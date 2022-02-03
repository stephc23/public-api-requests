const galleryDiv = document.querySelector('#gallery');
const body = document.querySelector('body');
const cards = galleryDiv.children;

/**
 * Request data and, if the response is successful, parse the data as JSON.
 * @param {string} url - The API endpoint.
 * @returns {object} A promise for the parsed JSON.
 */
async function getJSON(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw `Fetch unsuccessful: ${response.status}`;
        }
    } catch (error) {
        console.log(error);
    }
}


/**
 * Generate HTML for the gallery using data from the API.
 * @param {array} employees - The array of objects, each representing an employee.
 */
function addGalleryHTML(employees) {
    const galleryHTML = employees.map(employee => `
        <div class='card'>
            <div class='card-img-container'>
                <img class='card-img' src=${employee.picture.large} alt='profile picture'>
            </div>
            <div class='card-info-container'>
                <h3 id='name' class='card-name cap'>${employee.name.first} ${employee.name.last}</h3>
                <p class='card-text'>${employee.email}</p>
                <p class='card-text cap'>${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
    `).join('');
    galleryDiv.insertAdjacentHTML('beforeend', galleryHTML);
}

getJSON('https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,cell,picture&seed=awesome')
    .then(json => {
        const employees = json.results;
        addGalleryHTML(employees);
    });


function getEmployeeIndex(event) {
    const element = event.target;
    let selectedCard;
    if (element.tagName === 'DIV' && element.className === 'card') {
        selectedCard = element;
    } else if (element.tagName === 'DIV' && element.className !== 'card') {
        selectedCard = element.parentNode;
    } else {
        selectedCard = element.parentNode.parentNode;
    }

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card === selectedCard) {
            return i;
        }
    }
}

async function generateModalHTML(index) {
    const json = await getJSON('https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,cell,picture&seed=awesome');
    const employees = json.results;
    const employee = employees[index];
    const dob = employee.dob.date;
    const dobFormatted = `${dob.slice(5, 7)}/${dob.slice(8, 10)}/${dob.slice(0, 4)}`;
    const cellFormatted = employee.cell.replace('-', ' ');
    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src=${employee.picture.large} alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${cellFormatted}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${dobFormatted}</p>
                </div>
            </div>
        </div>
    `;
    return modalHTML;
}

function activateModalClose() {
    const closeButton = body.querySelector('#modal-close-btn');
    const modalContainer = body.querySelector('.modal-container');
    closeButton.addEventListener('click', () => {
        body.removeChild(modalContainer);
    });
}

function showModal(event) {
    const index = getEmployeeIndex(event);
    generateModalHTML(index)
        .then(modalHTML => body.insertAdjacentHTML('beforeend', modalHTML));
    activateModalClose();
}

galleryDiv.addEventListener('click', event => {
    const element = event.target;
    if (element.className !== 'gallery') {
        showModal(event);
    }
});

