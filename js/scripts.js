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
            throw `Fetch unsuccessful: ${response.statusText}`;
        }
    } catch (error) {
        console.log(error);
    }
}

