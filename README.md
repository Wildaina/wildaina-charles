# Wildaïna Charles — Official Website

Premium multilingual website for Wildaïna Charles, official Miss Universe Haiti 2026 candidate and Grace Hope ambassador.

## Structure

- `index.html` — Home
- `about.html` — Biography, personality, favorites and culture
- `advocacy.html` — Grace Hope + Back to Hope + education advocacy
- `gallery.html` — Editorial gallery
- `media.html` — Campaign and advocacy videos
- `vote.html` — MU Fan voting instructions
- `admin.html` — Protected content studio

## Secure admin setup

The admin does **not** use localStorage or a public sign-up flow. It is designed for Supabase Auth + Row Level Security.

1. Create a dedicated Supabase project for this website.
2. Run `supabase-schema.sql` in the SQL editor.
3. Create the authorized administrator account in Supabase Authentication.
4. Add that user's UUID to `public.wildaina_admins` using the SQL example at the bottom of `supabase-schema.sql`.
5. Put the project's public URL and anon/publishable key in `config.js`.

Never place a Supabase service-role key, database password, or administrator password in this repository.

## Credits

Website created by Ederito.
