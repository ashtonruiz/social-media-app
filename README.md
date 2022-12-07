# Octogram App

![](/assets/wireframe.png)

![](/assets/table.png)

https://zgixhmlshitskkemwyaf.supabase.co/storage/v1/object/public/avatars/32488156-c401-4c8b-a6d2-8e9b9f395c10/headshot18.png

## New Plan

    - edit button only shows if user_id matches the user
    - create profile submit needs to redirect to home page

## Plan

    - Table in Supabase connected to auth table
    - User is directed to main page where they will see a list of users
        - create container for user cards in HTML
        - FetchAllUsers and display users on load
        - Event listener on each card which will redirect user to user profile
    - When profile is chosen
        - fetchUser(id) by user_id by URL and avatar, bio, rating
        - display all profile info (avatar, bio, rating, username)
        - renderProfile
        - Event listener on profile for stars rating system. increment/decrementStars function (redisplay profile)

## Screenshots

![](/assets/avatars.bucket.png)
![](/assets/RLS.policies.png)
