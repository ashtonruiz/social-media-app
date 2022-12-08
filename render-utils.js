export function renderProfiles(profile, checkUser) {
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

    if (profile.username === checkUser.username) {
        usernameP.classList.add('username-star');
    }

    linkA.append(imgEl, usernameP);
    return linkA;
}

export function renderMessages(messages) {
    const ul = document.createElement('ul');

    ul.classList.add('messages-ul');

    for (let i = messages.length - 1; i > -1; i--) {
        const li = document.createElement('li');
        li.classList.add('message-li');

        const div = document.createElement('div');
        div.classList.add('message-info');

        const senderSpan = document.createElement('span');
        senderSpan.classList.add('sender');
        senderSpan.textContent = `${messages[i].sender} — `;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('created-date');
        dateSpan.textContent = new Date(messages[i].created_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        const text = document.createElement('p');
        text.classList.add('message-text');
        text.textContent = messages[i].text;

        div.append(senderSpan, dateSpan);

        li.append(div, text);

        ul.append(li);
    }

    return ul;
}
