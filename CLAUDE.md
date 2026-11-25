@AGENTS.md

# Roadmap — contexte du projet

## L'app
Roadmap est un outil interne de pilotage produit pour une petite équipe (PM, devs, designer).
On y range les **features** (idées et évolutions du produit) par **module** fonctionnel, on les planifie dans des **sprints** de 2 semaines, on les assigne à un membre de l'équipe et on en discute via des **commentaires**.

Objectif : savoir en un coup d'œil ce que l'équipe fait dans le sprint en cours, ce qui attend dans le backlog, et pourquoi une décision a été prise (fil de commentaires).

## Modèle de données (Supabase, schéma `public`, existe déjà)
- `sprints` : `goal`, `start_date`, `end_date`, `status` (`planned` | `active` | `completed`). Pas de nom : on affiche « Sprint {id} ».
- `features` : `title`, `description`, `status` (`backlog` | `todo` | `in_progress` | `done` | `cancelled`), `priority` (`critical` | `high` | `medium` | `low` | `nice_to_have`), `effort` (`xs` | `s` | `m` | `l` | `xl`, nullable), `impact` (`low` | `medium` | `high`), `module_id`, `sprint_id` (null = backlog), `assigned_to` (→ profiles).
- `modules` : `name`, `color` (hex, affiché en pastille), `description`.
- `comments` : `content`, `feature_id`, `author_id` (→ profiles), `created_at`.
- `profiles` : `firstname`, `lastname`, `email`, `avatar_url`, `role` (`user` | `admin`), `id` = `auth.users.id`.

Types : `lib/supabase/database.types.ts`. Libellés FR et couleurs des statuts / priorités : `lib/labels.ts`.

## Pages attendues (voir docs/ecrans.md)
- `/` tableau de bord : sprint actif + progression, répartition par statut, derniers commentaires
- `/sprints` liste des sprints · `/sprints/new` création · `/sprints/[id]` features du sprint (vue liste / tableau)
- `/backlog` toutes les features avec recherche et filtres (module, statut, priorité, sans sprint)
- `/modules` les modules et leurs compteurs
- `/features/[id]` détail + changement de statut/priorité/sprint/assigné + commentaires
- `/features/new` et `/features/[id]/edit` formulaire feature

Retour du test utilisateur : les commentaires doivent être **visibles dès les listes** (compteur 💬) et accessibles en un clic depuis le haut de la page feature.

## Droits (RLS Supabase activé)
Les policies sont dans la base ; le front ne fait que **cacher** les boutons inutiles (règles dans `lib/permissions.ts`, profil courant via `lib/auth.ts`).
- Créer une feature : `admin` uniquement
- Modifier / supprimer une feature : `admin` OU responsable assigné (`assigned_to`)
- Modifier un commentaire : son auteur uniquement
- Profil : on modifie son prénom et son nom ; le **rôle est en lecture seule** (jamais dans le formulaire)
- Lecture : tout utilisateur connecté

## Photos de profil
Bucket Supabase Storage **`avatars`** (public, 2 Mo, JPEG/PNG/WebP). Un dossier par utilisateur : `avatars/<user_id>/avatar`. Policies : chacun n'écrit (envoi + remplacement) que dans son propre dossier ; la lecture est publique via le lien (voir `supabase/migrations/20261125000000_avatars_bucket.sql`).
L'URL est enregistrée dans `profiles.avatar_url` (action `saveAvatarUrl`). Le composant `Avatar` (`components/badges.tsx`) affiche la photo, ou les initiales si elle n'existe pas : l'utiliser partout où un profil apparaît.

## Design
Respecter strictement **docs/design-system.md** (thème « Cacao » : sombre et chaud, fond brun doux, accent ambré, bordures 1 px, la couleur sert le sens). Les tokens sont dans `app/globals.css` (`@theme` et `:root`). Le prototype `prototype/index.html` garde l'ancienne direction claire : il n'est plus la référence visuelle.

---

Tu génères du code en respectant strictement cette stack. Objectif prioritaire : le code doit être lu et compris par des étudiants qui débutent en code. Clarté avant élégance.

## Stack
- Framework : Next.js (App Router, Server Components par défaut, "use client" uniquement quand nécessaire)
- Langage : TypeScript (strict mode). Pas de any ; si un type est vraiment impossible, unknown + narrowing, jamais any
- UI : React 19
- Styling : Tailwind CSS v4 (utility-first ; thème et tokens définis dans globals.css via @theme, pas de fichier de config JS ; pas de CSS modules ni styled-components)
- Composants : shadcn/ui (Radix UI + Tailwind). Utilise les composants existants avant d'en créer. Installe-les via npx shadcn@latest add <component>
- Icônes : lucide-react
- Formulaires : react-hook-form + zod
- Données : Supabase via @supabase/ssr
- State serveur : Server Actions (pas de React Query pour ces apps)

## Supabase
- La base Supabase existe déjà : tu la réutilises, tu ne la (re)crées pas.
- Avant d'écrire le moindre code de données, lis le schéma existant (via le MCP Supabase). N'invente jamais de table ni de colonne
- Aucune migration, aucun CREATE TABLE / ALTER TABLE, aucun seed : tu ne modifies pas le schéma
- Reprends exactement les noms de tables et de colonnes existants
- Génère les types TypeScript à partir du schéma réel (generate_typescript_types via le MCP, ou des types strictement alignés sur les colonnes existantes) — pas de types inventés
- Deux clients séparés : createServerClient côté serveur (lit les cookies) et createBrowserClient côté navigateur, rangés dans lib/supabase/
- Lecture/écriture via Server Components et Server Actions par défaut
- Clé anon côté client (protégée par RLS). Clé service_role server-only, jamais dans un bundle client
- L'introspection du schéma passe par le MCP (outil de dev) ; le code applicatif lit et écrit toujours via @supabase/ssr

## Conventions
- Structure : app/ pour les routes, components/ pour le réutilisable, lib/ pour les utilitaires
- Server Components par défaut ; passe en "use client" seulement pour l'interactivité (state, effects, event handlers). Garde ces composants client petits et en feuille de l'arbre
- Place un commentaire en français au-dessus de chaque "use client" qui explique pourquoi ce composant doit être client
- cn() (clsx + tailwind-merge) pour composer les classes conditionnelles
- Accessibilité : composants sémantiques, attributs ARIA quand pertinent

## Lisibilité (audience débutante)
- Privilégie la solution correcte la plus simple. Pas d'abstraction prématurée, fichiers courts
- Commentaires en français, sobres, qui expliquent le pourquoi plutôt que le quoi

## Ce que tu ne fais pas
- Pas de CSS inline arbitraire (un style inline n'est toléré que pour une valeur réellement dynamique, ex. une largeur calculée) ni de fichiers .css custom (sauf globals.css)
- Pas de librairie UI concurrente (Material UI, Chakra, etc.)
- Pas de valeur Tailwind arbitraire hors des tokens définis dans globals.css
- Pas de React Query ni de fetch client pour des données qu'un Server Component peut charger
