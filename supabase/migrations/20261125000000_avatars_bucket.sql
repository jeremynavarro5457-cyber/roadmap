-- Photos de profil : bucket « avatars » + règles d'accès (Storage).
--
-- Organisation : un dossier par utilisateur, nommé avec son id → avatars/<user_id>/avatar
-- Le bucket est PUBLIC : les images sont visibles par un simple lien (pas besoin de policy
-- pour les afficher). Les policies ci-dessous contrôlent qui peut ÉCRIRE.

-- 1. Le bucket (2 Mo max, images uniquement)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- 2. Lecture : les membres connectés peuvent lire (nécessaire pour remplacer un fichier existant)
create policy "Authenticated users can read avatars"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars');

-- 3. Envoi : uniquement dans son propre dossier.
--    storage.foldername(name)[1] = premier dossier du chemin = l'id de l'utilisateur.
create policy "Users can upload to their own avatar folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- 4. Modification (remplacer sa photo) : uniquement dans son propre dossier
create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
