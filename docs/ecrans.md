# Écrans de l'app Roadmap

## Modèle de données (Supabase « Roadmap »)
- **sprints** : objectif (`goal`), date de début / fin, statut `planned` · `active` · `completed` (pas de nom → affiché « Sprint n° + dates »)
- **features** : titre, description, statut, priorité, effort, impact, module, sprint (optionnel), assigné (optionnel)
  - statut : `backlog` · `todo` · `in_progress` · `done` · `cancelled`
  - priorité : `critical` · `high` · `medium` · `low` · `nice_to_have`
  - effort : `xs` · `s` · `m` · `l` · `xl` — impact : `low` · `medium` · `high`
- **modules** : nom, couleur, description (Facturation, Onboarding, Dashboard, Notifications, Gestion des accès)
- **comments** : contenu, auteur, date, rattaché à une feature
- **profiles** : prénom, nom, email, avatar, rôle `user` / `admin`

Libellés FR : Backlog · À faire · En cours · Terminé · Annulé — Critique · Haute · Moyenne · Basse · Bonus.

## 1. Connexion
- **On voit** : logo, email, mot de passe.
- **On peut** : se connecter.

## 2. Tableau de bord (accueil)
- **On voit** : le sprint actif (objectif, dates, jours restants, progression = features terminées / total), répartition des features par statut, « Mes features », derniers commentaires.
- **On peut** : ouvrir le sprint actif, ouvrir une feature, aller aux sprints / au backlog.

## 3. Liste des sprints
- **On voit** : chaque sprint (n°, objectif, dates, badge statut Planifié / Actif / Terminé, nb de features, barre de progression), l'actif en premier.
- **On peut** : ouvrir un sprint, créer un sprint, filtrer par statut.

## 4. Détail d'un sprint
- **On voit** : objectif, dates, progression ; ses features en **liste** ou en **tableau** (colonnes À faire / En cours / Terminé), chaque feature avec badge priorité, pastille module, effort, avatar de l'assigné, nb de commentaires.
- **On peut** : basculer liste / tableau, filtrer par module, priorité ou assigné, ouvrir une feature, ajouter une feature (admin), **reporter les features non terminées au sprint suivant (admin)**, modifier le sprint.
- **Résumé du sprint** : progression, nombre de features par statut, nombre de features non assignées.

## 5. Backlog (toutes les features)
- **On voit** : toutes les features, colonnes sprint, module, statut, priorité, effort, impact, assigné.
- **On peut** : rechercher, filtrer (module, statut, priorité, « sans sprint »), trier, ouvrir ou créer une feature.

## 6. Détail d'une feature
- **On voit** : titre, description, statut, priorité, effort, impact, module, sprint, assigné, date de création ; fil des commentaires (avatar, nom, date, texte).
- **On peut** : changer statut / priorité / sprint / assigné, modifier, ajouter un commentaire, revenir au sprint (fil d'Ariane).

## 7. Formulaire feature (création / édition)
- **Champs** : titre*, description, module, sprint, statut, priorité, effort, impact, assigné.
- **On peut** : enregistrer, annuler.

## 8. Formulaire sprint (création / édition)
- **Champs** : objectif, date de début*, date de fin*, statut.
- **On peut** : enregistrer, annuler.

## 9. Modules
- **On voit** : les modules (couleur, nom, description, nb de features par statut).
- **On peut** : ouvrir la **page d'un module** (`/modules/[id]`) : ses features, avec leur nombre de commentaires.

## Navigation globale
Barre latérale partout (sauf connexion) : Tableau de bord · Sprints · Backlog · Modules · Profil.
Fil d'Ariane en haut : *Sprints › Sprint 2 › Export PDF des factures*.

---

# Parcours

### P1 — Consulter les features d'un sprint
Tableau de bord → **Sprints** (menu) → clic sur « Sprint 2 » → liste des features.
*Raccourci :* Tableau de bord → carte « Sprint actif ».

### P2 — Ouvrir une feature et lire ses commentaires
Détail sprint → clic sur « Stripe webhook retry » → Détail feature → Commentaires (5).

### P3 — Créer une feature dans un sprint
Détail sprint → « + Ajouter une feature » → formulaire (sprint pré-rempli) → Enregistrer.

### P4 — Faire avancer une de mes features
Tableau de bord → « Mes features » → feature → statut En cours → Terminé → commentaire.

### P5 — Planifier le prochain sprint
Backlog → filtre « sans sprint » → ouvrir une feature → choisir Sprint 3.

### P6 — Voir tout ce qui concerne un module
Modules → Facturation → backlog filtré sur Facturation.
