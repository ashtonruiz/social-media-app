import { createNewUser, getUser, uploadImage } from '../fetch-utils.js';

const usernameForm = document.querySelector('#profile-form');

const user = getUser();

usernameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = new FormData(usernameForm);
    const profileObject = {
        username: username.get('username'),
        bio: username.get('bio'),
    };

    const imageFile = username.get('avatar');
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;
        const url = await uploadImage(imagePath, imageFile);
        profileObject.avatar_url = url;
        await createNewUser(profileObject, url);
    }
    location.replace('../');
});
