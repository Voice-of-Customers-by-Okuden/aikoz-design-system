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
Logo_Vertical-byokuden.svg   — co-branding vertical
Logo_Sybol.svg               — picto seul, espaces restreints
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
/fonts/
  PPRadioGrotesk/ — Black, Bold, Regular, Light, Ultralight (+ italiques)
  Satoshi/        — Bold, Regular, Medium (+ italiques)

/logos/
  Sur fond clair/SVG/ — Logo_Horizontal.svg (usage principal)
  Sur fond clair/SVG/ — Logo_Horizontal-byOkuden.svg
  Sur fond sombre/SVG/ — variantes fond dark

/references/
  [DA]      V1_WIP_Brand book Aikoz.pdf   — source de vérité DA
  [Contenu] 20250604_ALLIANZ_Aikoz.pdf    — patterns slides chiffrées
  [Contenu] 20250324_COVEA_Aikoz.pdf      — patterns deck commercial
```
