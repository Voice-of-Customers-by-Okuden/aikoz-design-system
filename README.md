# Aikoz Design System

Dépôt de référence pour tout contenu visuel et éditorial Aikoz by Okuden.  
Il contient les sources de vérité — design tokens, voix de marque, logos, polices — que l'équipe injecte dans ses outils IA et ses productions.

> **Règle d'or** : toute modification passe par une branche + PR. Les fichiers marqués 🔒 ne se modifient pas sans validation.
>
> **Le design system a une propriétaire unique : Alice (`@Alicokuden`).** Tokens, composants, bridge et doctrine d'accessibilité ne se modifient pas sans sa revue. Cf. [Gouvernance](#gouvernance).

---

## Sommaire

1. [Structure du repo](#structure)
2. [Cloner le repo](#cloner)
3. [Utiliser DESIGN.md](#designmd)
4. [Utiliser brand-voice-guidelines.md](#brand-voice)
5. [Workflow Git](#workflow-git)
6. [Ce qui est protégé](#protégé)
7. [Consommer le design system](#consommer)
8. [Gouvernance](#gouvernance)

---

## Structure

```
aikoz-design-system/
│
├── DESIGN.md                          🔒 SOURCE DE VÉRITÉ — design system complet
│                                         (couleurs, typo, grilles, logos, formats)
│
├── brand-brain/
│   └── brand-voice-guidelines.md     🔒 Voix de marque, règles éditoriales, formulations
│                                         canoniques (v1.3 — confiance 95%)
│
├── Fonts/
│   ├── PP Radio Grotesk/              Police principale (titres, UI, carrousels)
│   └── Satoshi/                       Police secondaire (corps long, sous-titres)
│
├── logos/                             Tous les logos SVG/PNG Aikoz
│   ├── Logo_Horizontal.svg            Usage principal sur fond clair
│   ├── Logo_Horizontal-byOkuden.svg
│   ├── Logo_Vertical.svg
│   └── Logo_Sybol.svg                 Picto seul (favicon, réseaux)
│
├── references/
│   ├── Post-linkedin/                 Carrousels LinkedIn publiés (PDFs sources)
│   ├── dashboard/                     Screenshot de référence du dashboard Figma (light mode)
│   └── *.pdf                          Brand book + decks commerciaux de référence
│
└── aikoz-design-system-by-claude-design/
    └── project/                       Export Claude Design (composants, assets web)
```

---

## Cloner

```bash
git clone https://github.com/lilicegonzales/aikoz-design-system.git
cd aikoz-design-system
```

Aucune dépendance à installer. Le repo contient uniquement des fichiers statiques (Markdown, SVG, TTF/OTF, PDF).

---

## Utiliser DESIGN.md

`DESIGN.md` est la source de vérité technique du design system : couleurs (hex exacts), typographie (tailles, graisses, usages), grilles, formats de carrousel, règles d'accessibilité.

**À injecter en contexte dans tout outil IA qui produit du visuel Aikoz.**

### Avec Claude Code (terminal)

```bash
cd ~/aikoz-design-system && claude
```

Claude Code lit `DESIGN.md` automatiquement depuis le répertoire de travail.  
Pour une session hors du repo, copier le fichier dans `.claude/` :

```bash
cp DESIGN.md ~/.claude/DESIGN.md
```

### Avec Claude.ai (interface web)

1. Créer un **Projet** Claude.ai
2. Ajouter `DESIGN.md` dans les fichiers du projet
3. Ajouter les logos SVG et les PDFs de `references/`
4. Toutes les conversations du projet héritent du contexte

### Tokens essentiels (rappel rapide)

| Token | Valeur | Usage |
|---|---|---|
| midnight-blue | `#0A1128` | Fond principal, textes dark |
| aquamarine-green | `#70FFD4` | Accent — **fond sombre uniquement** |
| ultramarine-blue | `#3B5DCE` | Liens, éléments sur fond clair |
| frozen-white | `#FFFFFF` | Textes sur fond sombre |
| Police slides / print | PP Radio Grotesk | Titres, slides, carrousels |
| Police UI / web | Inter | Interface, dashboard, corps |
| Police métriques | JetBrains Mono | KPI, affichage de chiffres |
| Police secondaire | Satoshi | Communication externe uniquement |

> L'aquamarine `#70FFD4` sur fond blanc = contraste 1.4:1 → échec WCAG. Ne jamais l'utiliser sur fond clair.

---

## Utiliser brand-voice-guidelines.md

`brand-brain/brand-voice-guidelines.md` définit la voix, le ton et les règles d'écriture d'Aikoz. Corpus : 15 slides LinkedIn réelles + inputs fondateur.

**À injecter dans tout outil IA qui produit du contenu texte Aikoz.**

### Ce que le fichier contient

| Section | Ce que ça donne |
|---|---|
| §3 We Are / We Are Not | Garde-fou rapide pour calibrer le ton |
| §5 Matrice Ton × Contexte | Quel registre selon le format (post, carrousel, deck…) |
| §6 Formulations canoniques | Phrases réelles validées — à réutiliser et imiter |
| §7 Terminologie | Ce qu'Aikoz dit / ce qu'Aikoz ne dit pas |
| §9 Exemples sectoriels | Patterns carrousel complets par thème IA |

### Avec Claude Code

```bash
cd ~/aikoz-design-system && claude
# Le fichier est lu automatiquement en contexte projet
```

Pour une session hors du repo :

```bash
cp brand-brain/brand-voice-guidelines.md ~/.claude/brand-voice-guidelines.md
```

### Prompt de référence (contenu LinkedIn)

```
Génère un carrousel LinkedIn 5 slides pour Aikoz, secteur assurance,
sur le thème [THÈME]. Respecte brand-voice-guidelines.md :
ton direct, formulations canoniques §6, structure dark/clair/dark §8,
terminologie §7. CTA final en aquamarine sur fond midnight-blue.
```

---

## Workflow Git

**Règle absolue : jamais de commit direct sur `main`.**

### Étapes

```bash
# 1. Se mettre sur main à jour
git checkout main && git pull

# 2. Créer une branche (nommage : type/description-courte)
git checkout -b feat/nom-de-la-feature
# ou : fix/correction · docs/mise-a-jour · chore/nettoyage

# 3. Faire ses modifications, puis commit
git add fichier-modifie.md
git commit -m "type: description courte de ce qui change"

# 4. Pousser et ouvrir une PR
git push -u origin feat/nom-de-la-feature
gh pr create --title "..." --body "..."

# 5. Demander une review si nécessaire, puis merger via GitHub
# La branche est supprimée après merge
```

### Conventions de nommage des branches

| Préfixe | Usage |
|---|---|
| `feat/` | Nouvelle fonctionnalité ou nouveau contenu |
| `fix/` | Correction d'une erreur |
| `docs/` | Mise à jour de documentation |
| `chore/` | Nettoyage, renommage, maintenance |

### Conventions de message de commit

```
feat: ajout des slides carrousel IA_agentique
fix: correction hex aquamarine dans DESIGN.md
docs: mise à jour README section workflow
chore: suppression fichiers DS_Store
```

---

## Ce qui est protégé

Ces fichiers sont les **sources de vérité** du projet. Toute modification sans validation peut casser la cohérence de l'ensemble des productions Aikoz.

| Fichier | Pourquoi c'est protégé |
|---|---|
| 🔒 `DESIGN.md` | Définit les tokens couleur, typo et formats utilisés par tous les outils IA. Un hex modifié = toutes les productions cassées. |
| 🔒 `brand-brain/brand-voice-guidelines.md` | Source de vérité éditoriale. Modifié sans validation = le ton d'Aikoz part dans tous les sens. |
| 🔒 `logos/` | Fichiers masters des logos. Ne pas redimensionner, recolorer ni convertir — utiliser les fichiers tels quels. |
| 🔒 `references/*.pdf` | Decks et brand book validés par Arnaud. Servir de référence visuelle, jamais de source à modifier. |

### Ce qu'on peut faire librement

- Ajouter des fichiers dans `references/Post-linkedin/`
- Ajouter des exemples validés dans `brand-brain/`
- Mettre à jour ce README
- Ajouter des scripts dans `scripts/`

Toujours via branche + PR, même pour les petites modifications.

---

*Repo maintenu par Alice Maréchaud (Okuden) — questions : alice.marechaud@okuden.fr*


---

<a name="gouvernance"></a>
<a id="consommer"></a>
## Consommer le design system

Trois commandes, trois artefacts.

```bash
npm run build:tokens     # tokens DTCG → build/*.css + bridge + couleurs Tailwind
npm run registry:build   # composants → public/r/*.json, installables
npm run build:preview    # aperçu statique → docs/preview/ (non versionné)
npm run build            # les trois d'affilée
```

### Installer un composant

`public/r/` est **versionné** : c'est le registry installable, et c'est la seule
chose qu'un consommateur peut réellement récupérer depuis GitHub. Il contient
33 composants au format shadcn.

```bash
npx shadcn@latest add https://raw.githubusercontent.com/Voice-of-Customers-by-Okuden/aikoz-design-system/main/public/r/button.json
```

### Les tokens en CSS

Un seul import suffit ; il tire les quatre combinaisons registre × thème.

```css
@import "./build/index.css";
@import "./bridge/shadcn-bridge.css";
```

```html
<html>                                          <!-- produit clair -->
<html class="dark">                             <!-- produit sombre -->
<html data-register="marketing">                <!-- marketing clair -->
<html class="dark" data-register="marketing">   <!-- marketing sombre -->
```

**Les couleurs Tailwind sont générées**, pas listées à la main :
`build/tailwind-colors.mjs` se déduit du bridge et `tailwind.config.ts`
l'importe. Ajouter un rôle au bridge suffit à le rendre utilisable en classe.
Une garde de build échoue si la config cesse d'importer le fichier — parce que
la divergence est déjà arrivée, et qu'elle est invisible : `bg-card` n'existait
pas côté Tailwind alors qu'elle était écrite sur 51 éléments.

### Les logos de marque

`BrandLogo` ne code aucun chemin en dur. Le dossier se règle une fois, au
démarrage de l'application :

```ts
import { definirBaseDesLogos } from "@registry/aikoz/brand-logo/brands";
definirBaseDesLogos("/mon-dossier/logos/");
```

Les fichiers sont dans `public/brands/`, et `public/brands/MARQUES.md` documente
leur provenance ainsi que la procédure de retrait.

### L'aperçu

`npm run build:preview` produit `docs/preview/`, **non versionné** : ce sont
2 Mo de binaires dupliqués, pour un bundle minifié qu'aucun agent ne sait lire
et que GitHub n'affiche pas. Servir l'aperçu en ligne demande d'activer GitHub
Pages ; le build est déjà prêt pour un sous-chemin :

```bash
npx vite build --base=/aikoz-design-system/preview/
```

### Vérifier l'accessibilité

Le playground (`npm run dev`, puis la racine) porte un bouton **Lancer
l'audit** : il compare chaque texte visible à son fond **composé** dans les
quatre combinaisons. Le module est réutilisable — `playground/audit.ts` — et
documente trois pièges de calcul qui ont chacun produit un faux diagnostic.

## Gouvernance

### Une propriétaire, une porte d'entrée

Le design system — `tokens/`, `registry/`, `bridge/`, `build-tokens.mjs`, `a11y.md`, `docs/components/` — appartient à **Alice (`@Alicokuden`)**. Toute modification passe par une PR qu'elle relit.

Ce n'est pas une question de hiérarchie mais de cohérence : un token modifié sans mesure casse un contraste ailleurs, un composant ajouté sans passer par les rôles sémantiques sort du système. Les écarts constatés jusqu'ici — une couleur Tailwind en dur, un rôle texte à 3,25:1, une bordure de champ invisible — sont tous venus d'une modification faite hors du cadre.

### Ce qui est en place, et ce qui ne l'est pas

`.github/CODEOWNERS` désigne Alice comme relectrice. GitHub la demande donc **automatiquement** sur chaque PR touchant ces chemins.

**Mais rien n'empêche techniquement un push direct sur `main` aujourd'hui.** Au 10/09/2026, cinq comptes en ont le droit :

| Droit | Comptes | Peut pousser sur `main` |
|---|---|---|
| admin | `OkudenAdmin`, `OkudenPietroFiani`, `VoCbyOkuden` | oui, et forcer |
| write | `Alicokuden`, `lilicegonzales` | oui |
| read | `LouisBrachOkuden`, `OkudenCyrilDever`, `Sp1raly-VoC` | non — PR uniquement |

### Ce qu'il faut demander à un admin

Rendre la règle exécutoire suppose une **règle de branche sur `main`**, que seuls les trois comptes admin peuvent créer :

- exiger une pull request avant fusion ;
- exiger l'approbation des propriétaires de code (`Require review from Code Owners`) ;
- interdire le push forcé et la suppression de branche.

Tant que ce n'est pas fait, `CODEOWNERS` reste une convention : il demande la revue, il ne la rend pas obligatoire.
