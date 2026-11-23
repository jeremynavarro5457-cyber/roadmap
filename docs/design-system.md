# Design system — Roadmap · « Atelier Précision »

Clair, dense et structuré. La donnée passe avant la décoration : fond neutre doux, surfaces blanches, bordures fines de 1 px, hiérarchie portée par la typographie. La couleur est réservée au sens (statut, priorité, module, action principale).

## 1. Couleurs

### Neutres
| Nom | Valeur | Rôle |
|---|---|---|
| `bg` | `#F7F7F5` | Fond de l'application |
| `surface` | `#FFFFFF` | Cartes, tableaux, panneaux, champs |
| `surface-hover` | `#F2F2EF` | Survol de ligne / d'élément de menu |
| `sidebar` | `#FBFBFA` | Barre latérale |
| `border` | `#E7E5E4` | Bordures 1 px, séparateurs |
| `border-strong` | `#D6D3D1` | Bordure de champ, survol de carte |
| `text` | `#1C1917` | Texte principal, titres |
| `text-muted` | `#57534E` | Texte secondaire, libellés |
| `text-subtle` | `#A8A29E` | Métadonnées, placeholders, icônes |

### Accent
| Nom | Valeur | Rôle |
|---|---|---|
| `accent` | `#4F46E5` | Bouton principal, lien, élément actif du menu, focus |
| `accent-hover` | `#4338CA` | Survol du bouton principal |
| `accent-soft` | `#EEF2FF` | Fond de l'élément actif, sélection |
| `danger` | `#DC2626` | Suppression, erreurs de formulaire |

### Statuts de feature (pastille + texte)
| Statut | Libellé | Pastille | Fond badge | Texte badge |
|---|---|---|---|---|
| `backlog` | Backlog | `#A8A29E` | `#F5F5F4` | `#57534E` |
| `todo` | À faire | `#64748B` | `#F1F5F9` | `#334155` |
| `in_progress` | En cours | `#D97706` | `#FEF3C7` | `#92400E` |
| `done` | Terminé | `#16A34A` | `#DCFCE7` | `#166534` |
| `cancelled` | Annulé | `#A8A29E` | `#F5F5F4` | `#78716C` (barré) |

### Statuts de sprint
| Statut | Libellé | Fond | Texte |
|---|---|---|---|
| `planned` | Planifié | `#F1F5F9` | `#334155` |
| `active` | Actif | `#EEF2FF` | `#4338CA` |
| `completed` | Terminé | `#DCFCE7` | `#166534` |

### Priorités (icône barres + libellé)
| Priorité | Libellé | Couleur | Icône |
|---|---|---|---|
| `critical` | Critique | `#DC2626` | ! dans un carré plein rouge |
| `high` | Haute | `#EA580C` | 3 barres |
| `medium` | Moyenne | `#CA8A04` | 2 barres |
| `low` | Basse | `#64748B` | 1 barre |
| `nice_to_have` | Bonus | `#A8A29E` | barres en pointillé |

### Modules
On utilise la couleur stockée en base (`modules.color`), **uniquement** en pastille de 8 px à côté du nom — jamais en fond plein.
Facturation `#E8634A` · Onboarding `#4A90D9` · Dashboard `#6C5CE7` · Notifications `#00B894` · Gestion des accès `#F39C12`.

## 2. Typographie
Police : **Inter** (Google Fonts), repli `system-ui, sans-serif`. Chiffres tabulaires (`font-variant-numeric: tabular-nums`) pour dates et compteurs.

| Style | Taille / interligne | Graisse | Usage |
|---|---|---|---|
| `h1` | 22 / 28 px | 600 | Titre de page |
| `h2` | 16 / 24 px | 600 | Titre de section, de carte |
| `body` | 14 / 20 px | 400 | Texte courant, lignes de liste |
| `body-strong` | 14 / 20 px | 500 | Titre de feature dans une liste |
| `small` | 12 / 16 px | 500 | Badges, métadonnées, en-têtes de tableau (MAJUSCULES, +0,04em) |

## 3. Espacements
Échelle de base 4 px : `4 · 8 · 12 · 16 · 24 · 32 · 48`.
- Padding de carte : 16 px · padding de page : 32 px (16 px sur mobile)
- Hauteur de ligne de liste : 40 px · espace entre sections : 32 px
- Barre latérale : 232 px de large

## 4. Arrondis
| Nom | Valeur | Usage |
|---|---|---|
| `radius-sm` | 4 px | Badges, pastilles carrées |
| `radius-md` | 6 px | Boutons, champs |
| `radius-lg` | 10 px | Cartes, panneaux, modales |
| `radius-full` | 999 px | Avatars, pastilles rondes |

Ombres : quasi absentes. `shadow-sm: 0 1px 2px rgba(28,25,23,.05)` sur les cartes ; `shadow-lg: 0 8px 24px rgba(28,25,23,.12)` sur les menus déroulants et modales.

## 5. Composants de base

### Bouton
- Hauteur 32 px, padding 0 12 px, `radius-md`, texte 14 px / 500, icône 16 px à gauche (gap 6 px).
- **Primaire** : fond `accent`, texte blanc ; survol `accent-hover`.
- **Secondaire** : fond `surface`, bordure `border-strong`, texte `text` ; survol `surface-hover`.
- **Fantôme** : sans fond ni bordure, texte `text-muted` ; survol `surface-hover`.
- **Danger** : comme secondaire, texte `danger`.
- Focus : anneau 2 px `accent` à 2 px de distance. Désactivé : opacité 50 %.

### Badge de statut
Hauteur 22 px, padding 0 8 px, `radius-sm`, texte `small`, pastille ronde 6 px de la couleur du statut + libellé. Fond et texte selon le tableau des statuts.

### Badge de priorité
Sans fond : icône 14 px (barres) dans la couleur de priorité + libellé `small` en `text-muted`. Seul « Critique » a un fond `#FEE2E2` avec texte `#991B1B` pour ressortir.

### Carte
Fond `surface`, bordure 1 px `border`, `radius-lg`, padding 16 px, `shadow-sm`. Cliquable : survol → bordure `border-strong`. Carte de feature (vue tableau) : titre `body-strong`, puis ligne de métadonnées (module, priorité, effort, avatar, nb de commentaires).

### Champ de formulaire
- Libellé `small` `text-muted` au-dessus (gap 6 px), astérisque pour les champs obligatoires.
- Champ : hauteur 36 px, padding 0 10 px, fond `surface`, bordure 1 px `border-strong`, `radius-md`, texte 14 px ; placeholder `text-subtle`.
- Focus : bordure `accent` + anneau `0 0 0 3px accent-soft`. Erreur : bordure `danger` + message 12 px `danger` en dessous.
- Select et zone de texte suivent le même style (zone de texte : min 96 px).

### Autres
- **Avatar** : rond 24 px, initiales 11 px / 600 sur fond pastel ; « Non assigné » = cercle pointillé.
- **Barre de progression** : 6 px de haut, fond `border`, remplissage `#16A34A`, `radius-full`.
- **Ligne de liste** : 40 px, séparateur 1 px `border`, survol `surface-hover`, toute la ligne est cliquable.
