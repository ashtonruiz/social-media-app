import {
    decrementStars,
    getProfileById,
    getUser,
    incrementStars,
    uploadImage,
    upsertBio,
} from '../fetch-utils.js';

const avatarImg = document.querySelector('#avatar-image');
const usernameHeader = document.querySelector('.username-h2');
const profileDetail = document.querySelector('.profile-detail');
const starsDiv = document.querySelector('.stars-div');
const bioForm = document.querySelector('#bio-form');

const params = new URLSearchParams(location.search);
const id = params.get('id');
const user = getUser();

console.log(user, 'user');

window.addEventListener('load', async () => {
    const user2 = await getProfileById(id);

    if (user.id === user2.data.user_id) {
        bioForm.classList.remove('hidden');
    }
    //if user_id from getUser() is same as user_id from getProfileById
    //bioForm.classList.remove('hidden');
    displayProfile();
});

async function displayProfile() {
    profileDetail.textContent = '';
    starsDiv.textContent = '';
    const profile = await getProfileById(id);

    usernameHeader.textContent = profile.data.username;
    avatarImg.src = profile.data.avatar_url;
    profileDetail.textContent = profile.data.bio;

    const profileStars = renderStars(profile.data);
    starsDiv.append(profileStars);
}

function renderStars({ stars, username, id }) {
    const p = document.createElement('p');
    const downButton = document.createElement('button');
    const upButton = document.createElement('button');

    const profileStars = document.createElement('div');

    profileStars.classList.add('profile-stars');
    profileStars.append(p, upButton, downButton);

    downButton.textContent = 'downvote user ⬇️';
    upButton.textContent = 'upvote user ⬆️';
    p.classList.add('profile-name');

    p.textContent = `${username} has ${stars} ⭐`;

    downButton.addEventListener('click', async () => {
        await decrementStars(id);
        await displayProfile();
    });

    upButton.addEventListener('click', async () => {
        await incrementStars(id);
        await displayProfile();
    });

    return profileStars;
}

bioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(bioForm);
    const bio = formData.get('bio');
    const avatar = formData.get('avatar');

    const profileObject = {
        bio: bio,
    };

    if (avatar.size) {
        const imagePath = `${user.id}/${avatar.name}`;
        const url = await uploadImage(imagePath, avatar);

        profileObject.avatar_url = url;
    } else {
        const profileinfo = await getProfileById(id);
        profileObject.avatar_url = profileinfo.data.avatar_url;
    }

    await upsertBio(profileObject, id, getUser());
    //send profileObject to upsertBio
    bioForm.reset();
    await displayProfile();
});
