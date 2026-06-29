---
version: 1.1
name: "Aikoz Design System"
description: >
  Design system de la plateforme Aikoz by Okuden.
  Solution SaaS d'intelligence des avis digitaux — secteurs assurance,
  assistance, banque, automobile, santé.
  Ce fichier est la source de vérité unique pour tout contenu visuel Aikoz :
  slides, landing page, carrousels LinkedIn, dashboard SaaS, documents commerciaux.
  Le système est en deux couches : Brand Layer (remplaçable en marque blanche)
  et Product Layer (invariable, accessible WCAG AA sur tous supports).

---

## Typographie

### Familles de polices

```
brand-primary:   PP Radio Grotesk   — titres, headings, numéros, labels slides & print
product-primary: Inter              — UI, dashboard, body, captions, composants web
brand-secondary: Satoshi            — communication externe uniquement (événements, landing pages
                                       marketing, onboarding grand public). Jamais dans le dashboard
                                       ni sur les slides internes.
fallback:        system-ui, -apple-system, sans-serif
microsoft:       Bahnschrift        — remplacement natif Microsoft Office
```

### CDN
```
Inter :         https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap
PP Radio Grotesk : non disponible sur Google Fonts — fichiers TTF dans /fonts/PPRadioGrotesk/
Satoshi :       https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap
```

### Hiérarchie typographique — UI / Dashboard (Inter)

```
display:    Inter 900, 36px, tracking -0.02em  — grands chiffres KPI, heroes
h1:         Inter 700, 28px, tracking -0.01em
h2:         Inter 700, 22px
h3:         Inter 600, 18px
h4:         Inter 600, 15px
body-lg:    Inter 400, 16px, line-height 1.5
body:       Inter 400, 14px, line-height 1.5
body-sm:    Inter 400, 13px
caption:    Inter 400, 12px
label:      Inter 600, 11px, tracking 0.06em, UPPERCASE  — badges, kickers, headers tableau
mono:       "JetBrains Mono" ou monospace, 500, 14px     — valeurs KPI, chiffres data
```

### Hiérarchie typographique — Slides / Print (PP Radio Grotesk)

```
cover-title:     PP Radio Grotesk Black, 48–72px
section-number:  PP Radio Grotesk Black, 80–120px, aquamarine-green
slide-title:     PP Radio Grotesk Bold, 36–42px
slide-heading:   PP Radio Grotesk Bold, 26–32px
slide-header:    PP Radio Grotesk Bold, 14–15px  — "X.X – Titre"
slide-subtitle:  PP Radio Grotesk Regular Italic, 12–13px, blue-subtitle
slide-body:      PP Radio Grotesk Regular, 12–14px
slide-kicker:    PP Radio Grotesk Bold, 10–11px, letter-spacing 2–3pt, ALL CAPS
```

### Règles typographiques

**À faire :**
- Inter pour tout ce qui est interface, web, dashboard
- PP Radio Grotesk pour slides, print, supports de marque
- Chiffres KPI dashboard toujours en monospace (JetBrains Mono ou fallback monospace)
- Minimum 12px sur tous les supports

**À éviter :**
- Jamais de police serif — la marque est 100% sans-serif
- Pas d'italic hors sous-titres de slides
- Pas d'ALL CAPS sur les titres principaux (seulement labels/kickers)

---

## Couleurs

### COUCHE 1 — Brand Layer (remplaçable en marque blanche)

#### Palette primaire (source : Brand Book V1.0)

```
midnight-blue:      #0A1128   RGB 10  17  40   — fond dominant, dark backgrounds
ultramarine-blue:   #3B5DCE   RGB 59  93  206  — interactif, énergie, liens
aquamarine-green:   #70FFD4   RGB 112 255 212  — accent primaire, CTA sur dark
frozen-white:       #FFFFFF                    — fond clair, texte sur dark
```

#### Nuances — 5 niveaux par couleur primaire

```
/* Midnight Blue */
midnight-900: #0A1128
midnight-800: #1C223C
midnight-700: #2E3450
midnight-600: #404566
midnight-500: #52587C

/* Ultramarine Blue */
ultramarine-900: #3B5DCE
ultramarine-800: #5674DC
ultramarine-700: #738CE9
ultramarine-600: #A3B6F4
ultramarine-500: #DDE5FC

/* Aquamarine Green */
aquamarine-900: #70FFD4
aquamarine-800: #8CFFE0
aquamarine-700: #A9FFE6
aquamarine-600: #D6FFF4
aquamarine-500: #EDFFF9
```

#### Règles d'usage Brand Layer

```
aquamarine-green (#70FFD4) :
  ✓ Sur fond dark (#0A1128, #1C223C, #2E3450) — contraste 9.8:1 ✓ WCAG AAA
  ✗ JAMAIS sur fond blanc ou gris clair — contraste 1.4:1 ✗ WCAG FAIL

ultramarine-blue (#3B5DCE) :
  ✓ Sur fond blanc (#FFFFFF) — contraste 5.9:1 ✓ WCAG AA
  ✓ Sur fond très clair (#F5F7FA) — contraste 5.6:1 ✓ WCAG AA
  ✓ Sur fond dark en version claire (#DDE5FC, #A3B6F4)
  ✗ Pas comme couleur de texte body sur fond intermédiaire (#E5E7EB)

midnight-blue (#0A1128) :
  ✓ Sur fond blanc — contraste 19.4:1 ✓ WCAG AAA
  ✓ Comme fond avec texte blanc — contraste 19.4:1 ✓ WCAG AAA
```

### COUCHE 2 — Product Layer (invariable, WCAG AA garanti)

#### Neutrals dashboard

```
neutral-900: #0F1117   — texte primaire sur fond clair (ratio 19:1 ✓)
neutral-800: #1E2230
neutral-700: #374151   — texte secondaire (ratio 10.7:1 ✓)
neutral-500: #6B7280   — texte muted (ratio 4.6:1 ✓)
neutral-300: #D1D5DB   — borders, dividers
neutral-200: #E5E7EB   — borders légers
neutral-100: #F3F4F6   — fond sunken
neutral-50:  #F9FAFB   — fond page
```

#### Couleurs sémantiques (états, alertes, data)

```
/* SUCCESS */
success-700: #15803D   — texte sur blanc (ratio 5.9:1 ✓ WCAG AA)
success-600: #16A34A   — texte sur blanc (ratio 5.1:1 ✓ WCAG AA)
success-100: #DCFCE7   — fond badge/tag success

/* WARNING */
warning-700: #B45309   — texte sur blanc (ratio 5.9:1 ✓ WCAG AA)
warning-600: #D97706   — texte sur blanc (ratio 4.7:1 ✓ WCAG AA)
warning-100: #FEF3C7   — fond badge/tag warning

/* ERROR */
error-700:   #B91C1C   — texte sur blanc (ratio 6.2:1 ✓ WCAG AA)
error-600:   #DC2626   — texte sur blanc (ratio 5.9:1 ✓ WCAG AA)
error-100:   #FEE2E2   — fond badge/tag error

/* INFO */
info-700:    #1D4ED8   — texte sur blanc (ratio 7.0:1 ✓ WCAG AA)
info-600:    #2563EB   — texte sur blanc (ratio 5.9:1 ✓ WCAG AA)
info-100:    #DBEAFE   — fond badge/tag info
```

#### Tokens sémantiques surfaces

```
surface-page:      #F9FAFB   — fond global dashboard
surface-card:      #FFFFFF   — fond cards
surface-sunken:    #F3F4F6   — fond inputs, table headers
surface-border:    #E5E7EB   — borders standards
surface-border-strong: #D1D5DB — borders visibles
surface-dark:      #0A1128   — panels dark, sidebar
surface-dark-2:    #1C223C   — cards sur fond dark
surface-overlay:   rgba(10,17,40,0.6) — modales, overlays
```

#### Tokens sémantiques texte

```
text-primary:      #0F1117   — sur fond clair
text-secondary:    #374151   — sur fond clair
text-muted:        #6B7280   — sur fond clair
text-on-dark:      #FFFFFF   — sur fond dark
text-accent-dark:  #70FFD4   — sur fond dark UNIQUEMENT
text-link:         #3B5DCE   — liens, éléments interactifs
text-link-dark:    #A3B6F4   — liens sur fond dark
```

---

## Logos

### Variantes disponibles

```
Logo_Horizontal.svg          — usage principal (symbole + "Aikoz")
Logo_Horizontal-byOkuden.svg — co-branding Okuden, supports officiels
Logo_Vertical.svg            — usage compact vertical
Logo_Vertical-byOkuden.svg   — co-branding vertical
Logo_Symbol.svg              — picto seul, espaces restreints
```

### Règles d'usage

```
Sur fond dark (#0A1128, #1C223C) : logo en blanc — contraste 3:1 ✓
Sur fond clair (#FFFFFF, #F9FAFB) : logo en midnight-blue (#0A1128) — contraste 19:1 ✓
Sur fond ultramarine (#3B5DCE) : logo en blanc — contraste 5.9:1 ✓
```

**À faire :**
- Toujours symbole + logotype ensemble
- Logo bas-gauche sur les slides, bas-gauche sur les interfaces

**À éviter :**
- Jamais d'ombre sur le logo
- Jamais dans un conteneur coloré (pastille, rectangle)
- Jamais les proportions modifiées
- Jamais le logotype sans le symbole

---

## Iconographie

### Source officielle

```
Librairie : Google Material Symbols — style Rounded
CDN :       https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200
Ne jamais mixer avec d'autres librairies (Heroicons, Feather, Lucide, etc.)
```

### Grille de taille

```
16px — icônes inline : labels, badges, boutons, cellules tableau
20px — icônes standard : listes, navigation, champs de formulaire
24px — icônes larges : headers, hero sections, actions primaires
```

### Règles d'usage

```
Sur fond clair :  fill neutral-700 (#374151) — icônes fonctionnelles
                  fill ultramarine-blue (#3B5DCE) — icônes actives / interactives
Sur fond dark :   fill blanc (#FFFFFF) — icônes standard
                  fill aquamarine-green (#70FFD4) — icônes actives / accent
Stroke weight :   wght 300–400 (Regular) — jamais Bold sur les icônes
```

**À éviter :**
- Jamais de contour (outlined) — toujours filled
- Jamais de redimensionnement hors grille 16/20/24px
- Jamais d'icônes d'une autre librairie sur un même support

---

## Composants UI — Dashboard SaaS

### KPI Card

```
Fond :    surface-card (#FFFFFF)
Border :  1px solid surface-border (#E5E7EB), radius 8px
Padding : 20px
Ombre :   none (border suffit)

Label :   Inter 11px/600, UPPERCASE, letter-spacing 0.06em, text-muted (#6B7280)
Valeur :  monospace 32–40px/700, text-primary (#0F1117)
Delta :   Inter 12px/600, couleur selon direction :
          ↑ positif : success-600 (#16A34A)
          ↓ négatif : error-600 (#DC2626)
          → neutre  : text-muted (#6B7280)
Objectif: Inter 11px/400, text-muted — "Obj. 85%"
```

### Badge / Status pill

```
Radius :  9999px (pill)
Padding : 2px 8px
Taille :  Inter 11px/600, UPPERCASE

success : fond success-100, texte success-700
warning : fond warning-100, texte warning-700
error   : fond error-100, texte error-700
info    : fond info-100, texte info-700
neutral : fond neutral-100, texte neutral-700
```

### Progress bar

```
Track :  neutral-200 (#E5E7EB), height 6px, radius 3px
Fill :
  <50% de l'objectif  → error-600   (#DC2626)
  50–80% de l'objectif → warning-600 (#D97706)
  >80% de l'objectif  → success-600 (#16A34A)
```

### Tableau de données

```
Header :    surface-sunken (#F3F4F6), Inter 11px/600 CAPS, text-muted, padding 12px 16px
Row :       surface-card (#FFFFFF), border-bottom 1px surface-border
Row hover : surface-sunken (#F3F4F6)
Row highlight (marque user) : ultramarine-500 (#DDE5FC) à fond, ultramarine-900 en texte
Colonnes numériques : alignées à droite, monospace
Padding cellule : 12px 16px
```

### Sidebar navigation

```
Fond :        surface-dark (#0A1128)
Item actif :  fond surface-dark-2 (#1C223C), texte blanc, accent aquamarine-green (#70FFD4)
Item inactif: texte text-link-dark (#A3B6F4)
Item hover :  fond midnight-800 (#1C223C)
Icônes :      fill blanc ou aquamarine-green (actif)
```

### Bouton primaire

```
Fond :   ultramarine-blue (#3B5DCE)
Texte :  blanc (#FFFFFF), Inter 14px/600
Radius : 6px
Hover :  ultramarine-800 (#5674DC)
Padding: 8px 16px

Variante dark :
Fond :  aquamarine-green (#70FFD4)
Texte : midnight-blue (#0A1128) — contraste 9.8:1 ✓
```

### Bouton secondaire (ghost)

```
Fond :   transparent
Border : 1px solid ultramarine-blue (#3B5DCE)
Texte :  ultramarine-blue (#3B5DCE), Inter 14px/600
Radius : 6px
Hover :  fond ultramarine-500 (#DDE5FC), border inchangé
Padding: 8px 16px

Variante dark :
Border : 1px solid text-link-dark (#A3B6F4)
Texte :  text-link-dark (#A3B6F4)
Hover :  fond rgba(163,182,244,0.12)
```

### Gauge / Arc

```
Stroke fond :   neutral-200 (#E5E7EB)
Stroke valeur : success/warning/error-600 selon performance (logique progress bar)
Valeur centre : monospace bold + caption Inter
```

### Tag / Keyword

```
Positif : fond success-100, texte success-700
Négatif : fond error-100, texte error-700
Neutre  : fond neutral-100, texte neutral-500
```

---

## Layouts de slides — Patterns canoniques

### Structure type d'un deck Aikoz

```
1. Cover           — dark (#0A1128), centré, logo bas-gauche
2. Agenda          — dark, numéros aqua, item actif Bold blanc
3. Section Divider — dark, grand numéro aqua (80–120px) + titre Bold blanc
4. Slide contenu   — blanc, filet aqua gauche (7px), header "X.X – Titre"
N. Section Divider — prochain chapitre
```

### Slide split (50/50)

```
Colonne gauche (50%) :
  Fond    : blanc (#FFFFFF), filet aqua gauche 7px
  Contenu : texte, bullets, stats — police PP Radio Grotesk
  Padding : 35px à gauche (après filet)

Colonne droite (50%) :
  Fond    : midnight-blue (#0A1128) ou image plein fond + overlay rgba(10,17,40,0.6)
  Texte   : blanc (#FFFFFF), chiffres clés en aquamarine-green (#70FFD4)

Séparateur : aucun — le contraste des fonds suffit
```

### Slide contenu dark

```
Fond       : midnight-blue (#0A1128)
Filet haut : rectangle x=0, y=0, w=100%, h=5px, fill: aquamarine-green (#70FFD4)
Header     : PP Radio Grotesk Bold 14–15px, aquamarine-green (#70FFD4) — position x=35px, y=22px
Sous-titre : PP Radio Grotesk Regular Italic 12–13px, text-link-dark (#A3B6F4)
Corps      : PP Radio Grotesk Regular 12–14px, blanc (#FFFFFF)
Chiffres clés : PP Radio Grotesk Black, aquamarine-green (#70FFD4)
Logo       : variante fond sombre, bas-gauche, position identique fond blanc
```

### Filet vertical gauche (fond blanc uniquement)

```
Rectangle : x=0, y=0, w=7px, h=100%, fill: aquamarine-green (#70FFD4)
```

### Header de slide contenu

```
Position : x=35px, y=22px
Titre    : "X.X – Titre", PP Radio Grotesk Bold 14–15px, midnight-blue (#0A1128)
Sous-titre : PP Radio Grotesk Regular Italic 12–13px, #3B9DCE
```

### Footer logo

```
Position : x=35px, y=495px (slide 5.625" de hauteur)
Taille   : w=110px, h=37px
```

---

## Marque blanche

Le système est white-labelable. Pour un client (ex: Generali), seule la Brand Layer change :

```css
/* Exemple client Generali */
--brand-midnight: #C2001A;
--brand-ultramarine: #C2001A;
--brand-aquamarine: #FFFFFF;
```

La Product Layer (neutrals, semantic, composants) reste identique.
Les composants data ne dépendent jamais directement des tokens brand.

---

## Formats LinkedIn / Social

### Carrousel LinkedIn

```
Format   : 1080 × 1350 px (portrait 4:3 LinkedIn)
Marges   : 80px haut/bas · 72px gauche/droite
Safe zone texte : zone centrale 936 × 1190 px

Nombre de slides : 5–10 recommandé (max 20 LinkedIn)
Première et dernière slide : toujours fond dark (#0A1128)
```

### Slide type dark (fond #0A1128)

```
Fond       : midnight-blue (#0A1128)
Titre      : PP Radio Grotesk Bold 52–60px, blanc (#FFFFFF)
Sous-titre : PP Radio Grotesk Regular 22–26px, aquamarine-green (#70FFD4)
Corps      : PP Radio Grotesk Regular 18–20px, blanc (#FFFFFF)
Logo       : bas-gauche, variante fond sombre, w=100px, margin 48px
Numéro     : PP Radio Grotesk Black 80px, aquamarine-green (#70FFD4), discret coin bas-droit
```

### Slide type clair (fond #FFFFFF)

```
Fond       : blanc (#FFFFFF)
Filet gauche : 7px aquamarine-green (#70FFD4), hauteur 100%
Titre      : PP Radio Grotesk Bold 44–52px, midnight-blue (#0A1128)
Sous-titre : PP Radio Grotesk Regular Italic 20–22px, #3B9DCE
Corps      : PP Radio Grotesk Regular 18–20px, neutral-700 (#374151)
Logo       : bas-gauche, variante fond clair, w=90px, margin 48px
```

**À éviter :**
- Jamais aquamarine (#70FFD4) sur fond blanc (échec WCAG — contraste 1.4:1)
- Pas de texte sous 18px sur format carrousel (lisibilité mobile)
- Pas de gradient de fond
- Jamais plus de 40 mots par slide

---

## Règles Do / Don't globales

### Couleurs

**À faire :**
- Aquamarine (#70FFD4) uniquement sur fond dark
- Ultramarine (#3B5DCE) comme couleur interactive sur fond clair
- Midnight Blue comme fond structurel (sidebars, covers, dividers)
- Status communiqué par couleur ET icône (accessibilité)

**À éviter :**
- Jamais aquamarine sur blanc ou gris clair (échec WCAG)
- Jamais de texte en dessous de 12px
- Jamais de contraste inférieur à 4.5:1
- Jamais de couleur brand sur états sémantiques (success/error)
- Pas de gradient entre deux couleurs de marque

### Composants

**À faire :**
- Cards avec border 1px neutral-200 — jamais de shadow épaisse
- Radius 6–8px sur composants dashboard (pas > 12px, trop consumer)
- Icônes fill, mélange angles droits et arrondis (style brand book)
- Densité data : padding 16–20px cards, 12px tables

**À éviter :**
- Pas de shadow lourde (box-shadow épaisse = look daté)
- Pas de rounded-xl (>12px) sur composants data
- Pas de backgrounds alternés en zébré sur tables
- Pas d'illustrations hand-drawn

---

## Assets disponibles

```
/Fonts/
  PP Radio Grotesk/ — Black, Bold, Regular, Light, Ultralight (+ italiques) — 10 TTF
  Satoshi/          — Black, Bold, Medium, Regular, Light (+ italiques) — 10 OTF

/logos/
  Sur fond clair/SVG/   — Logo_Horizontal.svg (usage principal)
  Sur fond clair/SVG/   — Logo_Horizontal-byOkuden.svg
  Sur fond clair/PNG/   — variantes PNG fond clair
  Sur fond sombre/SVG/  — variantes SVG fond dark
  Sur fond sombre/PNG/  — variantes PNG fond dark

/references/
  Présentation/
    [DA]      V1_WIP_Brand book Aikoz.pdf              — source de vérité DA
    [Contenu] 20250604_ALLIANZ_Aikoz.pdf               — patterns slides chiffrées
    [Contenu] 20250324_COVEA_Aikoz.pdf                 — patterns deck commercial
    [Contenu] Aikoz_Presentation_commerciale_v2.pptx   — deck commercial PowerPoint
  Post-linkedin/
    Aikoz_AgenticAI.pdf                — carrousel LinkedIn Agentic AI
    Aikoz_IA_caroussel_valeur.pdf      — carrousel LinkedIn valeur IA
    Aikoz_IA_conversationnelle.pdf     — carrousel LinkedIn IA conversationnelle
    Aikoz_moyenne_top_10.jpg           — visuel LinkedIn performance
    2026_TDelacour.jpg                 — visuel LinkedIn
  badge/
    202512_AIKOZ_Badge_Meilleure-Agence_France.png        — badge Meilleure Agence France 2025
```
