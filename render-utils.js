export function renderProfiles(profile) {
    const linkA = document.createElement('a');
    const imgEl = document.createElement('img');
    const usernameP = document.createElement('p');

    linkA.classList.add('card');
    // imgEl.classList.add('avatar');

    linkA.href = `../profiles/?id=${profile.id}`;
    imgEl.src = profile.avatar_url;
    console.log(profile.avatar_url, 'testing');
    imgEl.alt = 'avatar';
    usernameP.textContent = `${profile.username}`;

    linkA.append(imgEl, usernameP);
    return linkA;
}
