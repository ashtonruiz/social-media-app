/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { getProfiles } from './fetch-utils.js';
import { renderProfiles } from './render-utils.js';

/* Get DOM Elements */
const profileList = document.querySelector('#profile-list');
const profileWrapper = document.createElement('div');

/* State */

/* Events */
window.addEventListener('load', async () => {
    displayProfiles();
});
/* Display Functions */
async function displayProfiles() {
    profileList.textContent = '';
    const profiles = await getProfiles();

    for (let profile of profiles) {
        const profileEl = renderProfiles(profile);
        console.log('profileEl', profileEl);
        profileList.append(profileEl);
    }
}
// element that will be wrapped
