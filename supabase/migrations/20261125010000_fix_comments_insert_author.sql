-- Correctif de sécurité : on ne peut plus écrire un commentaire au nom de quelqu'un d'autre.
--
-- Avant : la policy d'insertion des commentaires avait « with check (true) » → n'importe quel
-- utilisateur connecté pouvait envoyer l'author_id d'un collègue en appelant l'API directement.
-- Après : l'auteur du commentaire doit être l'utilisateur connecté.
alter policy "Authenticated users can insert comments"
  on public.comments
  with check (author_id = (select auth.uid()));
