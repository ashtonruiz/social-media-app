/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { getProfiles } from './fetch-utils.js';
import { renderProfiles } from './render-utils.js';

/* Get DOM Elements */
const profileList = document.querySelector('#profile-list');
const chatForm = document.querySelector('#chat-form');

/* State */

/* Events */
window.addEventListener('load', async () => {
    const profiles = await getProfiles();

    for (let profile of profiles.data) {
        const profileEl = renderProfiles(profile);
        profileList.append(profileEl);
    }
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

/* Display Functions */
