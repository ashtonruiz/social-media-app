/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import {
    createMessage,
    fetchMessages,
    getProfile,
    getProfiles,
    getUser,
    onMessage,
} from './fetch-utils.js';
import { renderMessages, renderProfiles } from './render-utils.js';

/* Get DOM Elements */
const profileList = document.querySelector('#profile-list');
const chatForm = document.querySelector('#chat-form');
const messagesContainer = document.querySelector('#messages-container');

const user = getUser();

/* State */

/* Events */
window.addEventListener('load', async () => {
    await displayProfiles();
    await displayMessages();

    onMessage(async (payload) => {
        displayMessages();
    });
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sender = await getProfile(user.id);
    const data = new FormData(chatForm);
    const messageInp = data.get('message');

    const messageObj = {
        text: messageInp,
        sender: sender.username,
    };

    if (!sender) {
        alert('Please make a profile to post in chat.');
        location.assign('/create');
    } else {
        await createMessage(messageObj);
    }

    chatForm.reset();
});

/* Display Functions */

async function displayProfiles() {
    const profiles = await getProfiles();
    const checkUser = await getProfile(user.id);

    for (let profile of profiles.data) {
        const profileEl = renderProfiles(profile, checkUser);
        profileList.append(profileEl);
    }
}

async function displayMessages() {
    const messages = await fetchMessages();
    messagesContainer.textContent = '';

    const messagesEl = renderMessages(messages);
    messagesContainer.append(messagesEl);
}
