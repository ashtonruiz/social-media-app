export function renderProfiles(profile) {
    const linkA = document.createElement('a');
    const imgEl = document.createElement('img');
    const usernameP = document.createElement('p');

    linkA.classList.add('card');
    linkA.href = `../profiles/?id=${profile.id}`;

    imgEl.classList.add('avatar-home');
    imgEl.src = profile.avatar_url;
    imgEl.alt = 'avatar';

    usernameP.textContent = `${profile.username}`;
    usernameP.classList.add('username-home');

    linkA.append(imgEl, usernameP);
    return linkA;
}
