const randomUserURL = 'https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,cell,picture';
const body = document.querySelector('body');
const galleryDiv = document.querySelector('#gallery');
const cardDivs = galleryDiv.children;

// ------------------------------------------------------------------------
// Function to fetch data
// ------------------------------------------------------------------------

/**
 * Request data and, if the response is successful, parse the data as JSON.
 * @param {string} url - The API endpoint.
 * @returns {object} A promise that resolves to an array of objects, each representing an employee.
 */
async function getEmployees(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            const employees = json.results;
            return employees;
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

/**
 * Generates HTML for the modal window.
 * @param {array} employees - The array of objects from the API, each representing an employee.
 * @param {number} index - The index of the card div the user clicks on, which is also the index of that employee object in the array.
 * @returns {object} A promise that resolves to the modal HTML.
 */
 function addModalHTML(employees) { 
    employees.forEach(employee => {
        const dob = employee.dob.date;
        const dobFormatted = `${dob.slice(5, 7)}/${dob.slice(8, 10)}/${dob.slice(0, 4)}`;
        const cellFormatted = employee.cell.replace('-', ' ');

        const script = body.lastElementChild;
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-container';
        modalDiv.innerHTML = `
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
        `;
        body.insertBefore(modalDiv, script);
        modalDiv.style.display = 'none';
    });
 }

async function generateHTML() {
    const employees = await getEmployees(randomUserURL);
    addGalleryHTML(employees);
    addModalHTML(employees);
}

generateHTML();




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
 * Display the modal by calling `getEmployeeIndex` and `generateModalHTML`; activate modal close button after inserting the modal HTML.
 * @param {object} event - The event object from the event handler.
 */
function showModal(event) {
    const index = getEmployeeIndex(event);
    const modalDivs = document.querySelectorAll('.modal-container');
    const activeModalDiv = modalDivs[index];
    const closeButton = activeModalDiv.firstElementChild.firstElementChild;
    
    activeModalDiv.style.display = 'block'; 
    closeButton.addEventListener('click', () => {
        activeModalDiv.style.display = 'none';
    });
}

// ------------------------------------------------------------------------
// Event listener
// ------------------------------------------------------------------------

galleryDiv.addEventListener('click', event => {
    if (event.target.className !== 'gallery') {
        showModal(event);
    }
});
