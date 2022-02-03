const randomUserURL = 'https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,cell,picture&seed=awesome';
const body = document.querySelector('body');
const galleryDiv = document.querySelector('#gallery');
const cardDivs = galleryDiv.children;

// ------------------------------------------------------------------------
// Function to fetch data
// ------------------------------------------------------------------------

/**
 * Request data and, if the response is successful, parse the data as JSON.
 * @param {string} url - The API endpoint.
 * @returns {object} A promise that resolves to the parsed JSON.
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

// ------------------------------------------------------------------------
// Functions to get and display random employees
// ------------------------------------------------------------------------

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

getJSON(randomUserURL)
    .then(json => {
        const employees = json.results;
        addGalleryHTML(employees);
    });

// ------------------------------------------------------------------------
// Functions to create a modal window
// ------------------------------------------------------------------------

/**
 * Get the index of the employee the user clicks on by finding the div stored in `cards` that matches the clicked div.
 * @param {object} event - The event object from the event handler. 
 * @returns {number} The index of the chosen card div.
 */
function getEmployeeIndex(event) {
    const element = event.target;
    let chosenDiv;
    if (element.tagName === 'DIV' && element.className === 'card') {
        chosenDiv = element;
    } else if (element.tagName === 'DIV' && element.className !== 'card') {
        chosenDiv = element.parentNode;
    } else {
        chosenDiv = element.parentNode.parentNode;
    }

    for (let i = 0; i < cardDivs.length; i++) {
        const cardDiv = cardDivs[i];
        if (cardDiv === chosenDiv) {
            return i;
        }
    }
}

/**
 * Generates HTML for the modal window.
 * @param {number} index - The index of the card div the user clicks on, which is also the index of that employee object in the array.
 * @returns {object} A promise that resolves to the modal HTML.
 */
async function generateModalHTML(index) {
    const json = await getJSON(randomUserURL);
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

/**
 * Add event listener to the modal close button.
 */
function activateModalClose() {
    const closeButton = body.querySelector('#modal-close-btn');
    const modalContainer = body.querySelector('.modal-container');
    closeButton.addEventListener('click', () => {
        body.removeChild(modalContainer);
    });
}

/**
 * Display the modal by calling `getEmployeeIndex` and `generateModalHTML`; activate modal close button after inserting the modal HTML.
 * @param {object} event - The event object from the event handler.
 */
async function showModal(event) {
    const index = getEmployeeIndex(event);
    const modalHTML = await generateModalHTML(index);
    body.insertAdjacentHTML('beforeend', modalHTML);
    activateModalClose();
}

// ------------------------------------------------------------------------
// Event listener
// ------------------------------------------------------------------------

galleryDiv.addEventListener('click', event => {
    if (event.target.className !== 'gallery') {
        showModal(event);
    }
});

