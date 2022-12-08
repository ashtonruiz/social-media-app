const SUPABASE_URL = 'https://madsmicxvvkhsnmoovxs.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZHNtaWN4dnZraHNubW9vdnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAyNjIwNzUsImV4cCI6MTk4NTgzODA3NX0.jWpWr5EbuVoJ5zcPGAuIulwzNcM674ZT6agUtX1McPE';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */
export async function getProfiles() {
    const response = await client.from('profiles').select('*');
    return response;
}

export async function getProfileById(id) {
    const response = await client.from('profiles').select('*').match({ id }).single();
    return response;
}

export async function incrementStars(id) {
    const profile = await getProfileById(id);

    const response = await client
        .from('profiles')
        .update({ stars: profile.data.stars + 1 })
        .match({ id });
    return response;
}

export async function decrementStars(id) {
    const profile = await getProfileById(id);

    const response = await client
        .from('profiles')
        .update({ stars: profile.data.stars - 1 })
        .match({ id });
    return response;
}

export async function uploadImage(imagePath, imageFile) {
    const bucket = client.storage.from('avatars');
    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        // we want to replace and existing file with same name
        upsert: true,
    });
    if (response.error) {
        return null;
    }
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    return url;
}

export async function createNewUser(user, url) {
    const response = await client.from('profiles').insert({
        user_id: client.auth.user().id,
        username: user.username,
        bio: user.bio,
        avatar_url: url,
    });
    return response;
}

export async function upsertBio(profileObject, id, user) {
    const response = await client
        .from('profiles')
        .update({ bio: profileObject.bio, avatar_url: profileObject.avatar_url })
        .match({ id, user_id: user.id })
        .single();
    return response;
}

export async function createMessage(message) {
    const response = await client.from('messages').insert(message).single();
    return response;
}

export function onMessage(profileId, handleMessage) {
    client
        // what table and what rows are we interested in?
        .from(`messages:recipient_id=eq.${profileId}`)
        // what type of changes are we interested in?
        .on('INSERT', handleMessage)
        // okay do it!
        .subscribe();
}
