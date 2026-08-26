# Aikoz — Inventaire des composants (dashboard)

> Version 1.2 — dérivée de `aikoz-composants-V1_LB.xlsx` (specs fonctionnelles de Louis), nettoyée, complétée, **recroisée avec le code du repo et le fichier Figma** (`ODMOwBvckfjPxTCUP1S1Su`), puis enrichie des arbitrages pris le 26/08/2026.
> Ce fichier est la **source de vérité** du périmètre de la bibliothèque. Il est lu par Claude Code avant toute création de composant.

---

## Périmètre

**Inclus** : les composants du **dashboard Aikoz** (produit SaaS, vendu en direct et en white-label).

**Exclus** : les composants du **site vitrine / landing** (Footer flottant, Bloc texte, Sections déroulantes, Infinite loop partenaires, Overlay Calendrier, Overlay Contact, Header de navigation site). Ils figurent dans le fichier source de Louis et peuvent servir d'inspiration, mais ne rentrent pas dans le design system à ce stade.

## Règles de construction

1. **Origine `shadcn`** = le composant existe dans shadcn/Radix, on l'habille avec les tokens Aikoz. On ne le réécrit pas.
2. **Origine `aikoz`** = pas d'équivalent, on le construit (souvent par composition de primitives shadcn).
3. Les composants consomment exclusivement des tokens **sémantiques** (`role.*`), jamais de primitives (`dimension.*`, couleurs brutes).
4. On ne détaille la spec d'un composant que **juste avant de le construire** — pas d'avance sur les fiches.
5. Contraste ≥ 4.5:1 en light et dark, focus visible au clavier, sur tous les composants.

## Comment lire la colonne Statut

Trois sources indépendantes, systématiquement distinguées :

| Marqueur | Sens |
|---|---|
| **code** | fichier livré dans `registry/aikoz/` sur `main` |
| **composant Figma** | vrai composant (`symbol`) dans les pages Atomes / Molécules / Organismes — réutilisable |
| **maquetté** | dessiné dans les maquettes de la page 1, mais **jamais componentisé** — à reconstruire de zéro |

Un composant peut être maquetté sans exister comme composant Figma. La distinction change le coût : un composant Figma se transpose, une maquette se re-spécifie.

---

## Inventaire

| # | Composant | Famille | Origine | Priorité | Statut | Dépend de |
|---|---|---|---|---|---|---|
| 1 | `Button` | Actions | shadcn | v1 | **code + composant Figma** (12 variantes) — ⚠ absent de `registry.json` ; axes désalignés | — |
| 2 | `KpiCard` | Data display | aikoz | v1 | **code + composant Figma** — ⚠ code et maquette divergent | ScoreStars, DeltaBadge, ProgressBar |
| 3 | `ScoreStars` | Data display | aikoz | v1 | **existe inliné** dans `kpi-card.tsx` (`StarRating`) — à extraire ; couleur tranchée (`warning-600`) | — |
| 4 | `DeltaBadge` | Data display | aikoz | v1 | **existe inliné** dans `kpi-card.tsx` (`TrendBadge`) — à extraire ; composant Figma `Tag` | Badge |
| 5 | `Badge` | Data display | shadcn | v1 | **composant Figma** (5 statuts), à créer en code | — |
| 6 | `Tooltip` | Feedback | shadcn | v1 | à créer — absent du code et du Figma | — |
| 7 | `Select` | Forms | shadcn | v1 | **maquetté** (`MiniSelect`), à créer | — |
| 8 | `ViewTabs` | Navigation | shadcn | v1 | **maquetté** (`ViewTab`) — bascule de vue dans la page, cf. décision 2 | — |
| 9 | `Card` | Layout | shadcn | v1 | à créer — pas de Card générique en Figma | — |
| 10 | `ChoiceCard` | Navigation | aikoz | v1 | à créer — absent du code et du Figma | Card, Badge |
| 11 | `DonutChart` | Data display | aikoz | v1 | **maquetté** (`SourcesDonut`), à créer | Select, Tooltip |
| 12 | `RankedBarChart` | Data display | aikoz | v1 | à créer — absent du code et du Figma | TimeRangePicker, Tooltip |
| 13 | `Leaderboard` | Data display | aikoz | v1 | **composants Figma** `RankRow` + `RankingCard`, à créer en code | Avatar, DeltaBadge |
| 14 | `MapWidget` | Data display | aikoz | v1 | ⚠ **à créer — aucune carte dans le Figma** (statut v1.0 erroné) | Breadcrumb, Table |
| 15 | `Avatar` | Data display | shadcn | v1 | **composant Figma**, à créer en code | — |
| 16 | `Table` | Data display | shadcn | v1 | à créer — absent du code et du Figma | — |
| 17 | `Breadcrumb` | Navigation | shadcn | v1 | à créer — absent du code et du Figma | — |
| 18 | `TimeRangePicker` | Forms | aikoz | v1 | **maquetté** (pill « 30 derniers jours » du topbar), à créer | Select ou Calendar+Popover |
| 19 | `Skeleton` | Feedback | shadcn | v1 | à créer — absent du code et du Figma | — |
| 20 | `EmptyState` | Feedback | aikoz | v1 | à créer — absent du code et du Figma | Button |
| 21 | `Dialog` / `Sheet` | Overlays | shadcn | v1 | à créer — absent du code et du Figma | — |
| 22 | `Toast` (sonner) | Feedback | shadcn | plus tard | à créer — absent du code et du Figma | — |
| 23 | `VerbatimCard` | Data display | aikoz | v1 | à créer — retenue au périmètre, cf. décision 5 | ScoreStars, Badge, Tag |
| 24 | `ProgressBar` | Data display | aikoz | v1 | **composant Figma** (3 niveaux), à créer — promu par la décision 1 | — |
| 25 | `SidebarNav` | Navigation | aikoz | v1 | **composant Figma** `Sidebar`, à créer — promu par la décision 2 | NavItem |
| 26 | `NavItem` | Navigation | aikoz | v1 | **composant Figma** (3 états), à créer — brique de `SidebarNav` | — |

**Compte** : 26 composants = **12 d'origine shadcn** + **14 spécifiques Aikoz**.
*(La v1.0 annonçait « 11 shadcn / 12 spécifiques » — la répartition était inversée d'une unité, `Button` étant d'origine shadcn.)*

État réel : **2 livrés** (`Button`, `KpiCard`), **2 à extraire** de `KpiCard` (`ScoreStars`, `DeltaBadge`), **22 à construire** — dont 8 transposables depuis un composant Figma existant et 4 seulement maquettés.

*Les trois derniers (`ProgressBar`, `SidebarNav`, `NavItem`) sont entrés au périmètre par les décisions 1 et 2 ; ils figuraient déjà comme composants Figma non reflétés dans la v1.0.*

---

## Écarts relevés au recroisement

Cinq écarts ont un impact sur le plan de charge ou sur la qualité. Ils appellent une décision ou une correction, pas seulement une note.

### 1. `Button` n'est pas publiable

`registry/aikoz/button/button.tsx` est sur `main` mais `registry.json` ne déclare que `kpi-card`. Le Button est donc **invisible pour `npx shadcn add`** : il existe pour nous, pas pour un consommateur du registry.

Second écart, de fond : les axes de variantes ne concordent pas.

| | Code | Figma |
|---|---|---|
| Style | `default`, `secondary`, `outline`, `ghost` | `Primary`, `Ghost` |
| Surface | — (géré par `.dark`) | `Light`, `Dark` (axe de variante) |
| État | `hover`, `active`, `focus`, `disabled` | `Default`, `Hover`, `Disabled` |

Le Figma traite la surface comme un axe de variante là où le code la traite comme un contexte de thème. Le code a raison (c'est ce qui rend le white-label possible) : c'est le Figma qui doit s'aligner. `secondary` et `outline` n'ont par ailleurs aucun équivalent maquetté — soit ils sont spéculatifs, soit le Figma est en retard.

### 2. `KpiCard` : le code et la maquette ne décrivent pas la même carte

| | Code (`kpi-card.tsx`) | Maquette (Figma + `dashboard-marche-light.png`) |
|---|---|---|
| Valeur | ✅ | ✅ |
| Label | ✅ | ✅ |
| Étoiles | ✅ `StarRating` | ❌ absentes |
| Badge de tendance | ✅ `TrendBadge`, en bas | ✅ en haut à droite |
| Barre de progression | ❌ | ✅ sous la valeur, avec objectif |
| Sparkline | ✅ (taille `lg`) | ❌ absente |

Les quatre KpiCard des maquettes portent toutes une `ProgressBar` + un sous-texte d'objectif (« Objectif · 90 % », « vs 4,2 marché »). Le code livre à la place des étoiles et une sparkline.

> **Résolu** — cf. décision 1. Aucun des deux n'est périmé : ce sont deux variantes légitimes de métriques différentes. Le défaut était l'axe de l'API, pas le contenu de la carte.

### 3. `ScoreStars` et `DeltaBadge` existent déjà, inlinés

Ils ne sont pas « à créer » mais **à extraire** de `kpi-card.tsx` (`StarRating` l.62-86, `TrendBadge` l.88-107). Deux réserves à lever au passage :

- `StarRating` colore les étoiles en **`text-amber-400`** — une couleur Tailwind brute, hors tokens. C'est la seule violation de la règle 3 du présent document dans tout le code livré. Il faut un rôle dédié (`role.color.rating.*`), pas un détournement d'un rôle existant.
- `TrendBadge` ne gère que positif / négatif. La spec de Louis et le composant Figma `Tag` prévoient tous deux un **état neutre (gris)**, absent du code.

### 4. `MapWidget` : le statut de la v1.0 était faux

La v1.0 annonçait « maquetté Figma ». Vérification faite sur les quatre pages du fichier (Atomes, Molécules, Organismes, Page 1) : **aucun composant, frame ou calque de type carte, choroplèthe ou tracé géographique**. Recherche par nom (`Map`, `Carte`, `Geo`, `Choropleth`, `Département`, `Région`) : seules remontent des **étiquettes textuelles** de région (« Région · Est », « Région · Nord-IDF », « Région · Ouest », « Région · France »).

Lecture la plus probable : la segmentation géographique est prévue, sa **représentation cartographique ne l'est pas**. `MapWidget` est donc à considérer comme entièrement à spécifier — c'est le composant le plus coûteux de la liste et le seul sans aucune référence visuelle.

### 5. La navigation des maquettes est une Sidebar, pas des Tabs

L'inventaire v1.0 listait `Tabs` en v1 et laissait « Tabs ou sidebar ? » en question ouverte. Les maquettes répondent : **les deux dashboards (light et dark) utilisent une `Sidebar`**, composant Figma existant (organisme), avec `NavItem` (molécule, 3 états) — quatre entrées : Marché, Campagnes, Hall of Fames, Paramètres.

`ViewTab` existe bien, mais comme frame non componentisé et en usage secondaire (bascule de vue à l'intérieur d'un panneau), pas comme navigation globale.

> **Résolu** — cf. décision 2. Les deux entrent en v1 : ce sont deux composants aux contrats d'accessibilité distincts, qui coexistent dans un même écran. `Tabs` ne « rétrograde » pas, il change de périmètre.

---

## Composants présents en Figma, absents de l'inventaire v1.0

Huit composants Figma n'étaient reflétés nulle part dans la liste. Trois d'entre eux sont utilisés dans les maquettes du dashboard et sont donc, de fait, des prérequis v1.

| Composant Figma | Page | Variantes | Usage constaté | Suite à donner |
|---|---|---|---|---|
| `ProgressBar` | Atomes | Good / Warning / Critical | **dans les 4 KpiCard** des maquettes | v1 — prérequis de `KpiCard`, cf. écart 2 |
| `Sidebar` | Organismes | — | **navigation des 2 dashboards** | v1 si la Sidebar est retenue, cf. écart 5 |
| `NavItem` | Molécules | Default / Active / Hover | dans `Sidebar` | idem |
| `Input` | Atomes | Default / Focus / Error / Disabled | prérequis de `SearchBar` | à arbitrer |
| `SearchBar` | Molécules | Default / Focus | **topbar des maquettes** | à arbitrer — dépend de `Input` |
| `Topbar` | Organismes | — | maquettes | layout plutôt que composant — à arbitrer |
| `KpiGrid` | Organismes | — | maquettes | layout plutôt que composant — à arbitrer |
| `Chip` | Atomes | Default / Active / Hover | aucun usage constaté | à arbitrer — recoupe peut-être `Badge` / `Tag` |
| `Tag` | Atomes | Positive / Negative / Neutral | aucun usage constaté | cf. `VerbatimCard` ci-dessous |

`Topbar` et `KpiGrid` sont vraisemblablement des **gabarits de mise en page**, pas des composants de bibliothèque. À confirmer avant de les faire entrer dans le périmètre.

---

## Décisions prises — 26/08/2026

### 1 · `KpiCard` — deux axes, pas deux cartes

La question « code ou maquette » était mal posée : les deux cartes affichent des métriques de **nature différente** et fonctionnent toutes les deux. Le vrai défaut est que l'API indexe la richesse sur `size`, ce qui mélange **la place disponible** et **la nature de la donnée**.

```tsx
<KpiCard variant="rating" | "target" | "trend" | "raw"
         density="compact" | "default" | "large" />
```

`variant` décrit ce que la donnée *est*, `density` la place qu'on lui accorde. Aujourd'hui `size="lg"` force la sparkline : impossible d'afficher une note en étoiles dans une grande carte.

| Métrique | Échelle | Appui |
|---|---|---|
| Note moyenne 4,2 | bornée 0–5 | étoiles → `rating` |
| Taux de réponse 87 % | bornée, avec objectif | barre → `target` |
| Avis traités 312 | non bornée | tendance → `trend` |
| Délai 6 h | bornée par un objectif | barre inversée (moins = mieux) → `target` |

**Conséquence : l'extraction de `ScoreStars` et `DeltaBadge` n'est plus bloquée.** Avec `ProgressBar`, ils deviennent les briques d'appui que les variantes composent. `ProgressBar` entre en v1.

**Principe retenu pour le DS** : variantes **fermées** par défaut, plus un slot d'échappement documenté « si tu t'en sers deux fois, ça doit devenir une variante ». Sur un dashboard la cohérence prime sur la flexibilité — un même type de métrique doit se lire pareil d'un écran à l'autre.

**Reste à valider avec Louis** : les 4 cartes des maquettes portent toutes une barre, y compris « Avis traités · 312 » dont le sous-texte est « 30 derniers jours ». Une barre suppose un dénominateur — 312 sur combien ? Le système de variantes force cette question, la maquette actuelle l'esquive.

### 2 · Navigation — `SidebarNav` et `ViewTabs`, les deux

Ce ne sont pas deux options concurrentes mais **deux composants distincts qui coexistent dans le même écran** : la sidebar navigue entre sections, les tabs basculent de vue à l'intérieur d'une page. Ils n'ont pas le même contrat d'accessibilité.

| | `SidebarNav` | `ViewTabs` |
|---|---|---|
| Rôle | navigation entre sections | bascule de vue dans la page |
| Sémantique | `<nav>` + liens | `role="tablist"` / `role="tab"` |
| État courant | `aria-current="page"` | `aria-selected="true"` |
| Clavier | Tab de lien en lien | flèches ← → + roving tabindex |
| Effet | change la route | échange un panneau, même route |

**Règle à appliquer sans exception : c'est le comportement qui décide, jamais l'apparence.** Un « onglet » qui change de route est un lien stylé en onglet ; l'implémenter en `role="tab"` annonce à un lecteur d'écran un panneau qui va s'échanger alors que la page entière est remplacée. C'est un des bugs d'a11y les plus fréquents.

Les deux entrent en v1. Ils partagent les **tokens**, pas le composant : `NavItem` ressemble à un onglet, mais mutualiser ferait fuiter la mauvaise sémantique.

### 3 · Typographie — longhand

Le shorthand CSS `font` ne transporte pas `letter-spacing` et **réinitialise `font-feature-settings` et `font-variant-numeric`** — vérifié en navigateur : `font: var(--role-typography-metric)` casse l'alignement des chiffres, sur le rôle des KPI. Les rôles passent en longhand, 5 variables par rôle. Coût de migration nul, aucun composant ne consomme encore ces variables.

L'unité `em` du tracking est conservée et l'écart au type `dimension` du DTCG documenté : l'alternative conforme (ratio sans unité recomposé en `calc(x * 1em)`) violerait la règle verrouillée « la variable porte la valeur directement utilisable ».

### 4 · `ScoreStars` — `role.color.rating` sur `warning-600`

`text-amber-400`, seule couleur hors tokens du code livré, donne **1,67:1** sur carte : hors sujet au regard du seuil 3:1 de WCAG 1.4.11 (l'étoile porte l'information, ce n'est pas du texte). Rampe mesurée contre `--card` :

| palier | light | dark |
|---|---|---|
| 400 | 1,66 ❌ | 10,45 ✅ |
| 500 | 2,18 ❌ | 7,97 ✅ |
| **600** | **3,25 ✅** | **5,35 ✅** |
| 700 | 5,13 ✅ | 3,39 ✅ |

`warning-600` est le seul palier conforme des deux côtés. Marge courte en light : si la carte s'assombrit un jour, c'est le premier ratio à retester.

### 5 · `VerbatimCard` — au périmètre v1

Retenue. L'atome Figma `Tag` (3 variantes de sentiment, sans usage maquetté) n'a de sens que sur un avis unitaire. Reste à confirmer côté produit le moment où le dashboard donne accès aux avis un par un, pour situer la priorité dans le lot.

---

## Points encore à trancher

- **Charts** : adopter le module `chart` de shadcn (basé sur recharts) comme socle des trois graphiques plutôt que du SVG maison. Conditionne la structure de `DonutChart`, `RankedBarChart` et `Leaderboard`. **Ne se tranche pas dans le DS — remonte à Alice**, qui décide de la façon de la valider (le brouillon source suggérait d'en passer par Pietro, autorité technique). *Élément factuel versé au dossier : `kpi-card.tsx` importe déjà `recharts`, et la dépendance est déjà déclarée dans `registry.json`.*
- **Web Components (Lit / Stencil)** : l'architecture cible pour l'embarquabilité white-label. Si la décision tombe après la construction de ces composants, il faudra les reconstruire. **Ne se tranche pas dans le DS — remonte à Alice**, à arbitrer **avant** d'attaquer le lot. C'est la plus urgente des deux.
- **Dénominateur de la variante `target`** pour les métriques non bornées — cf. décision 1, à valider avec Louis.

---

## Specs fonctionnelles (source : Louis, 08/2026)

Reprises telles quelles pour les composants dashboard. Les captures d'écran correspondantes sont dans le xlsx source.

### `KpiCard`
**Rôle** — mettre en avant une donnée : note, pourcentage, durée, volume.
**Contenu** — la valeur, avec code couleur selon performance : note verte > 4.0 / rouge < 4.0 (couleur portée par l'étoile) ; taux de réponse vert > 85% / rouge < 85%. Durée et volume : seuils à définir.
**Interactivité** — aucune.

> ⚠ Diverge des maquettes, cf. écart 2. Les maquettes ne montrent pas d'étoile et ajoutent une barre de progression avec objectif.

### `DonutChart`
**Rôle** — comparer plusieurs cohortes de données ; permettre de choisir les données comparées.
**Contenu** — somme au centre ; étiquette de variation sous la somme (verte si positive, rouge si négative — seuil à définir) ; sections colorées (vert/rouge en binaire, palette au-delà de 2 cohortes) ; légendes (titre, donnée, répartition) ; menu déroulant si d'autres données sont restituables.
**Interactivité** — pas d'interaction sur une donnée unique. Avec plusieurs données : menu déroulant cliquable. On-hover : met en exergue la cohorte survolée et grise les autres.

### `RankedBarChart` (graphique bâton)
**Rôle** — présenter une hiérarchie entre entités (marques, agences) et son évolution dans le temps. Bâtons classés par ordre décroissant, de droite à gauche.
**Contenu** — en-tête (titre, sous-titre, infobulle optionnelle) ; bâton + logo/image + chiffre ; card au survol (titre, légendes, note/volume/pourcentage) ; plage temporelle (texte + années).
**Interactivité** — plage temporelle cliquable → recalcule la répartition et peut modifier l'ordre des bâtons. Survol d'un bâton → card de détail.

### `Leaderboard` (classement)
**Rôle** — comparer des entités ou individus (Top 5 / 8 / 10), identifier visuellement le podium, connaître sa position.
**Contenu** — en-tête (titre, sous-titre, infobulle optionnelle) ; par ligne : rang fixe, initiale, texte, valeur, étiquette de variation (vert positif / gris neutre / rouge négatif) ; liseré, chiffre et initiale en or / argent / bronze pour les trois premiers.
**Interactivité** — aucune.

> Note de recroisement : le composant Figma `RankRow` n'expose que deux états (`Default`, `Highlight` — la ligne « Vous »). L'or / argent / bronze du podium **n'est pas maquetté**. À produire à partir de la spec seule.

### `DeltaBadge` (étiquette de variation)
**Rôle** — mettre en exergue une donnée ou un mot.
**Contenu** — texte, chiffre ou pourcentage. Vert si positif, rouge si négatif, gris si neutre.
**Interactivité** — aucune.

### `ChoiceCard` (card de segmentation)
**Rôle** — segmenter le parcours utilisateur en scénarios. Chaque clic renvoie une décision au back-office (ex. « assurance » → tag transmis à Aikoz pour déterminer le marché à étudier).
**Contenu** — picto ou logo dans un cercle/rectangle, titre, sous-titre. Si inactif : tag « Bientôt disponible ici ».
**États** — actif / inactif (en plus des états standards).
**Interactivité** — cliquable.

### `Tabs` (tabulation header)
**Rôle** — naviguer entre les vues.
**Contenu** — 5 entrées maximum.
**Interactivité** — cliquable, déclenche la navigation.

### `Button`
**Rôle** — déclencher une action : valider, annuler, naviguer, ouvrir une modale.
**Variantes** — default, secondary, outline, ghost. **Tailles** — sm 36px, md 44px (défaut), lg 48px.
**États** — default, hover, active, focus (anneau clavier), disabled, loading si action asynchrone.
**Règles** — coins pilule (`rounded-full`), label obligatoire, icône optionnelle gauche/droite, disabled ni cliquable ni focusable.

---

## Prérequis avant construction

**Fondation typographique — soldée.** La branche `feat/dimensions-typography` est commitée ([PR #22](https://github.com/Voice-of-Customers-by-Okuden/aikoz-design-system/pull/22)) : `font-size` est passé sous `dimension.font-size.*` au format `{ value, unit }`, et `--role-typography-label-sm` — corrompu depuis l'origine — est corrigé à la racine dans le générateur.

**Reste ouvert : le letter-spacing.** Deux problèmes distincts, aucun bloquant pour démarrer, tous deux à solder avant de figer les composants qui portent du texte :

1. Le shorthand CSS `font` **ne peut pas transporter `letter-spacing`**. Les 6 valeurs déclarées dans `semantics.json` sont silencieusement perdues à la génération (Style Dictionary les classe en `unknownProps` ; le warning est masqué par `verbosity: 'silent'`). Vérifié en navigateur : les 14 rôles calculent `letter-spacing: normal`.
2. L'unité `em` des primitives `letter-spacing.*` n'est pas conforme au type `dimension` du DTCG, qui n'admet que `px` et `rem`.
