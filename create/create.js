import { getUser, uploadImage, upsertNewUser } from '../fetch-utils.js';

const usernameForm = document.querySelector('#profile-form');

const user = getUser();

usernameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = new FormData(usernameForm);
    const profileObject = {
        username: username.get('username'),
        bio: username.get('bio'),
        user_id: user.id,
    };

    const imageFile = username.get('avatar');
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;
        const url = await uploadImage(imagePath, imageFile);
        profileObject.avatar_url = url;
        const newuser = await upsertNewUser(profileObject);
        console.log(newuser, 'newuser');
    }
    location.replace('../');
});
