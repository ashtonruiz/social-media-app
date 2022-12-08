const SUPABASE_URL = 'https://uqwstvnsesaenalrdjyp.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd3N0dm5zZXNhZW5hbHJkanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDgwMjYsImV4cCI6MTk4MzY4NDAyNn0.bZ660DcBSXEiAg5PHlsCACk9kEfmD8_HYAnhjOB69Vo';
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

export async function getProfile(user_id) {
    const response = await client.from('profiles').select('*').match({ user_id }).single();
    // ({ user_id }) = ({user_id : user_id})
    return response.data;
}

export async function incrementStars(id) {
    const profile = await getProfileById(id);

    const response = await client
        .from('profiles')
        .update({ stars: profile.data.stars + 1 })
        .match({ id });
    console.log(response);
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
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    return url;
}

export async function upsertNewUser(profile) {
    const response = await client
        .from('profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .single();
    return response;
}

export async function updateBio(profileObject, id, user) {
    const response = await client
        .from('profiles')
        .update({ bio: profileObject.bio, avatar_url: profileObject.avatar_url })
        .match({ id, user_id: user.id })
        .single();
    return response;
}

export async function createMessage(message) {
    const response = await client.from('messages').insert(message).single();
    return checkError(response);
}

export function onMessage(handleMessage) {
    client
        // what table and what rows are we interested in?
        .from(`messages`)
        // what type of changes are we interested in?
        .on('INSERT', handleMessage)
        // okay do it!
        .subscribe();
}

export async function fetchMessages() {
    const response = await client.from('messages').select('*');
    return response.data;
}

function checkError(response) {
    return response.error ? console.error(response.error) : response.data;
}
