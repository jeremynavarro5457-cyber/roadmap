# Sécurité de Roadmap

> Dernière mise à jour : 25/11/2026. Les droits ci-dessous ont été relus **directement dans la base Supabase** (policies RLS), puis vérifiés par des tests dans une transaction annulée.

## 1. Principe général

- La **sécurité des lignes (RLS)** est activée sur les 5 tables (`profiles`, `sprints`, `modules`, `features`, `comments`).
- Sans policy qui l'autorise, une action est **refusée** : on ne liste donc que ce qui est permis.
- Toutes les policies ciblent le rôle `authenticated` : un **visiteur non connecté n'a accès à rien**.
- L'interface **cache** les boutons inutiles (`lib/permissions.ts`), mais la vraie protection est dans la base : si quelqu'un contourne l'app et appelle Supabase directement, c'est la base qui décide.
- Le rôle d'un utilisateur est stocké dans `profiles.role`. Il se change uniquement dans Supabase (jamais depuis l'app).

## 2. Les rôles

| Rôle | Qui | Ce qu'il peut faire, en résumé |
|---|---|---|
| **Visiteur** (`anon`) | Personne de non connecté | **Rien.** Ni lecture, ni écriture. |
| **Membre** (`authenticated`, `profiles.role = 'user'`) | Tout utilisateur connecté | Lire toutes les données. Commenter. Modifier son profil, ses commentaires et les features dont il est le responsable. |
| **Responsable assigné** | Un membre dont l'id est dans `features.assigned_to` | Comme un membre, et en plus modifier et supprimer **cette** feature. (Ce n'est pas un rôle stocké : c'est une situation propre à chaque feature.) |
| **Admin** (`profiles.role = 'admin'`) | Un membre promu dans la base | Comme un membre, et en plus créer des features, et modifier ou supprimer **toutes** les features. |

## 3. Qui peut faire quoi, table par table

`✅` = autorisé · `❌` = refusé à tout le monde (via l'API) · le reste précise la condition.

| Table | Lire | Créer | Modifier | Supprimer |
|---|---|---|---|---|
| `profiles` | ✅ tout membre connecté | ❌ personne (le profil est créé automatiquement à l'inscription par le déclencheur `handle_new_user`) | Seulement **son propre profil**, et **sans pouvoir changer son rôle** | ❌ personne (un profil disparaît avec son compte) |
| `sprints` | ✅ tout membre connecté | ❌ personne | ❌ personne | ❌ personne |
| `modules` | ✅ tout membre connecté | ❌ personne | ❌ personne | ❌ personne |
| `features` | ✅ tout membre connecté | **Admin** uniquement | **Admin** ou **responsable assigné** | **Admin** ou **responsable assigné** |
| `comments` | ✅ tout membre connecté | ✅ tout membre connecté, **uniquement à son propre nom** | Son **auteur** uniquement | ❌ personne |
| Fichiers `avatars` (Storage) | ✅ lien public pour tous · liste des fichiers pour les membres connectés | Un membre, **dans son dossier** `avatars/<son id>/` uniquement | Un membre, **dans son dossier** uniquement | ❌ personne |

Pour les tables marquées « ❌ personne », les données se gèrent aujourd'hui uniquement depuis le dashboard Supabase (ou avec la clé `service_role`, qui contourne RLS et ne doit jamais apparaître dans l'app).

## 4. Les policies, une par une

| Table | Nom de la policy | Action | Condition |
|---|---|---|---|
| `profiles` | Authenticated users can read profiles | lecture | toujours vraie (connecté) |
| `profiles` | Users can update own profile but not role | modification | `id = auth.uid()` et le rôle reste identique à l'ancien |
| `sprints` | Authenticated users can read sprints | lecture | toujours vraie (connecté) |
| `modules` | Authenticated users can read modules | lecture | toujours vraie (connecté) |
| `features` | Authenticated users can read features | lecture | toujours vraie (connecté) |
| `features` | Admins can insert features | création | l'utilisateur a le rôle `admin` |
| `features` | Admins and assignees can update features | modification | rôle `admin` **ou** `assigned_to = auth.uid()` |
| `features` | Admins and assignees can delete features | suppression | rôle `admin` **ou** `assigned_to = auth.uid()` |
| `comments` | Authenticated users can read comments | lecture | toujours vraie (connecté) |
| `comments` | Authenticated users can insert comments | création | `author_id = auth.uid()` (on ne peut écrire qu'en son nom) |
| `comments` | Authors can update their own comments | modification | `author_id = auth.uid()` |
| `storage.objects` | Authenticated users can read avatars | lecture | bucket `avatars`, connecté |
| `storage.objects` | Users can upload to their own avatar folder | création | bucket `avatars` et 1er dossier du chemin = `auth.uid()` |
| `storage.objects` | Users can update their own avatar | modification | bucket `avatars` et 1er dossier du chemin = `auth.uid()` |

## 5. Points d'attention connus

Ce que l'on sait déjà, avant la red team. Chaque point a été vérifié par un test.

1. **✅ Corrigé le 25/11/2026 : on pouvait écrire un commentaire au nom de quelqu'un d'autre.** La policy de création acceptait n'importe quoi (`with check (true)`) : en appelant directement l'API Supabase, Marie avait pu créer un commentaire signé Thomas. La condition est maintenant `author_id = auth.uid()` (migration `20261125010000_fix_comments_insert_author.sql`). *Tests après correctif : écrire à son nom ✅ autorisé · écrire au nom d'un autre ❌ refusé · changer l'auteur d'un commentaire existant ❌ refusé · visiteur non connecté ❌ refusé.*
2. **Un responsable ne peut pas passer sa feature à quelqu'un d'autre.** Sans clause `with check`, Postgres réutilise la condition de modification sur la nouvelle ligne : après le changement, `assigned_to` n'est plus l'utilisateur, donc c'est refusé. *Test : refusé pour Marie.* Seul un admin peut réassigner. Le sélecteur « Assigné à » de l'app est pourtant affiché au responsable : il verra le message « Vous n'avez pas le droit… ».
3. **Aucune policy d'écriture sur `sprints` et `modules`.** Personne ne peut les créer ni les modifier via l'API, admin compris. Le bouton « Nouveau sprint » de l'app échoue donc pour tout le monde.
4. **Impossible de supprimer une feature qui a des commentaires.** Il n'y a pas de policy de suppression sur `comments` et le lien entre les deux tables n'est pas en cascade. *Test : Marie n'a pas pu supprimer son propre commentaire.* C'est le cas de 8 features sur 20.
5. **Le rôle ne peut pas être modifié par l'utilisateur.** *Test : Marie n'a pas pu se passer admin.* ✅
6. **Les droits SQL par défaut de Supabase** donnent au rôle `anon` des privilèges sur les tables (dont `TRUNCATE`). RLS bloque lecture et écriture (*test : un visiteur lit 0 ligne et ne peut pas créer*), mais `TRUNCATE` n'est pas soumis à RLS. L'API REST de Supabase ne l'expose pas, donc ce n'est pas exploitable par ce chemin, mais on peut retirer ces droits pour fermer la porte.
7. **Le bucket `avatars` est public** : quiconque connaît le lien d'une photo la voit, même sans compte. C'est voulu (photos de profil), mais il ne faut y mettre que des photos de profil.
8. **Aucune inscription ouverte** : les comptes se créent à la main dans Supabase. Si on ouvre l'inscription, tout inconnu inscrit pourra **lire toute la roadmap** (la lecture est ouverte à tout membre connecté).

## 6. Attaques testées

> À compléter pendant la red team. Une ligne par attaque tentée.

| N° | Attaque tentée | Comment (outil, requête) | Résultat attendu | Résultat obtenu | Corrigé ? |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

**Pistes pour démarrer** (tirées des points d'attention) :
- Écrire un commentaire avec l'`author_id` d'un autre utilisateur (point 1, corrigé : vérifier que le correctif tient bien).
- Se passer admin en modifiant `profiles.role` (point 5).
- Modifier la feature d'un collègue, ou réassigner une feature (point 2).
- Envoyer un fichier dans le dossier d'un autre utilisateur, ou un fichier qui n'est pas une image, ou de plus de 2 Mo.
- Appeler l'API sans être connecté, avec la seule clé publique (`anon`).
