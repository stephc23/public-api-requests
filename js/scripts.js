const galleryDiv = document.querySelector('#gallery');

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

getJSON('https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,cell,picture')
    .then(json => {
        const employees = json.results;
        addGalleryHTML(employees);
    });
