# Design system — Roadmap · « Cacao »

Thème sombre et chaud, dans l'esprit des outils de développeur : un fond brun doux, des cartes un cran plus claires, une barre latérale « espresso » plus profonde, du texte crème et un accent ambré (la lueur d'une lampe de bureau). Les bordures font 1 px ; la couleur sert le sens (statut, priorité, action).

> Les valeurs ci-dessous sont les tokens de `app/globals.css`. En cas de doute, ce fichier-là fait foi.
> (Ancienne direction « Atelier Précision », claire et indigo : conservée dans `prototype/index.html`.)

## 1. Couleurs

### Neutres
| Nom | Valeur | Rôle |
|---|---|---|
| `background` | `#3B2F26` | Fond de l'application (brun doux) |
| `card` | `#47392F` | Cartes, tableaux, champs |
| `popover` | `#4F4137` | Menus déroulants |
| `secondary` / `muted` | `#52443A` | Survol des lignes et des éléments de menu |
| `sidebar` | `#241C16` | Barre latérale et en-têtes de tableau (espresso) |
| `border` | `#5F4F43` | Bordures 1 px, séparateurs |
| `input` | `#6E5C4E` | Bordure des champs |
| `foreground` | `#F5EDE3` | Texte principal (crème) |
| `muted-foreground` | `#D2C2B2` | Texte secondaire |
| `subtle` | `#B5A391` | Métadonnées, placeholders |

### Accent et alertes
| Nom | Valeur | Rôle |
|---|---|---|
| `primary` | `#E9B15B` | Bouton principal, focus, logo (ambre) |
| `primary-foreground` | `#2A1D10` | Texte sombre posé sur l'ambre |
| `accent` | `#E9B15B` à 18 % | Élément actif du menu, sélection |
| `accent-foreground` | `#F5CD8E` | Texte sur fond `accent` |
| `destructive` | `#F0746A` | Suppression, erreurs |

### Statuts de feature (pastille / fond à 20 % / texte)
| Statut | Libellé | Pastille | Texte |
|---|---|---|---|
| `backlog` | Backlog | `#A39382` | `#D8CCBE` |
| `todo` | À faire | `#7FA6D6` | `#B4CDEA` |
| `in_progress` | En cours | `#F0935A` | `#F8BC92` |
| `done` | Terminé | `#86C98B` | `#B4E2B7` |
| `cancelled` | Annulé | `#A39382` | `#D2C5B7` (barré) |

### Statuts de sprint
Planifié (comme « À faire ») · **Actif** (ambre : pastille `#E9B15B`, texte `#F5CD8E`) · Terminé (comme « Terminé »).

### Priorités
| Priorité | Libellé | Couleur |
|---|---|---|
| `critical` | Critique | `#F0746A` (badge à fond rouge 20 %, texte `#FFB4AC`) |
| `high` | Haute | `#F0935A` |
| `medium` | Moyenne | `#E5C04B` |
| `low` | Basse | `#8FA3B8` |
| `nice_to_have` | Bonus | `#A39382` |

### Modules
Couleur stockée en base (`modules.color`), affichée uniquement en pastille de 8 px.

Tous les textes respectent un contraste d'au moins **4,5:1** sur leur fond (vérifié par calcul).

## 2. Typographie
- **Inter** pour l'interface.
- **JetBrains Mono** pour les repères « techniques » : nom de l'app, fil d'Ariane, en-têtes de tableau (MAJUSCULES), effort, numéros de sprint.

| Style | Taille / interligne | Graisse | Usage |
|---|---|---|---|
| Titre de page | 22 / 28 px | 600 | `h1` |
| Titre de section | 16 / 24 px | 600 | `h2` |
| Texte | 14 / 20 px | 400 | Courant |
| Petit | 12 / 16 px | 500 | Badges, métadonnées |

## 3. Espacements et arrondis
- Échelle de 4 px : `4 · 8 · 12 · 16 · 24 · 32`. Carte : 16 px de padding. Page : 32 px (16 px sur mobile). Barre latérale : 232 px.
- Arrondis : 4 px (badges) · 6 px (boutons, champs) · 10 px (cartes).

## 4. Profondeur et lueur
- `shadow-card` : ombre douce et fin liseré de lumière en haut des cartes.
- `shadow-glow` : lueur ambrée sur le logo et au survol du bouton principal.
- Une très légère lueur ambrée en haut à gauche de la page (dégradé radial à 8 %).
- Au survol d'une carte cliquable, son contour passe à l'ambre.

## 5. Composants
- **Bouton principal** : fond ambre, texte sombre, lueur au survol. **Secondaire** : contour. **Fantôme** : sans fond. **Danger** : rouge à 10 %.
- **Badge de statut** : pastille ronde + libellé, fond semi-transparent de la couleur du statut.
- **Badge de priorité** : icône à 3 barres + libellé ; « Critique » a un fond rouge.
- **Carte** : fond `card`, liseré 1 px, 10 px d'arrondi, `shadow-card`.
- **Champ** : fond `card`, bordure `input`, focus ambre.
- **Menu actif** : fond ambre 18 %, texte `accent-foreground`, liseré ambre.
