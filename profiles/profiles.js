import {
    createMessage,
    decrementStars,
    getProfileById,
    getProfiles,
    getUser,
    incrementStars,
    onMessage,
    uploadImage,
    upsertBio,
} from '../fetch-utils.js';

const avatarImg = document.querySelector('#avatar-image');
const usernameHeader = document.querySelector('.username-h2');
const profileDetail = document.querySelector('.profile-detail');
const starsDiv = document.querySelector('.stars-div');
const bioForm = document.querySelector('#bio-form');
const messageForm = document.querySelector('.message-form');

const params = new URLSearchParams(location.search);
const id = params.get('id');
const user = getUser();

window.addEventListener('load', async () => {
    const user2 = await getProfileById(id);

    // removed user_id from user2.data at the end from the line because I think that might be the problem
    if (user.id === user2.data) {
        bioForm.classList.remove('hidden');
    }
    //if user_id from getUser() is same as user_id from getProfileById
    //bioForm.classList.remove('hidden');
    onMessage(id, async (payload) => {});
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

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // - get user's form input values
    const data = new FormData(messageForm);
    // - check sender user has profile info
    // call getUser to grab the user object of the currently logged in user
    const user = getUser();
    //console.log('user', user);
    // passing the user.id into getProfile to check if there is an associated profile
    const senderProfile = await getProfileById(id);
    console.log('senderProfile', senderProfile);
    // if theres not a profile associated with the logged in user...
    if (!senderProfile) {
        // send an alert and redirect the user
        alert('You must make your profile before you can message anyone');
        location.assign('/');
    } else {
        // if there IS a profile for the logged in user in our profiles table
        // - send message to supabase
        await createMessage({
            // text value is coming from form data
            text: data.get('message'),
            // sender value is taking the logged in user and looking at the data.username on it
            sender: senderProfile.data.username,
            // recp id value is coming from our URL search params (line 16)
            recipient_id: id,
            // user id is coming from our getUser function - the logged in user
            user_id: user.id,
        });
        //- reset form
        messageForm.reset();
    }
    //- (before we implement realtime) call our fetch&Display function
    // await fetchAndDisplayProfile();
});
