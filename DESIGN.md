---
version: 1.0
name: "Aikoz Design System"
description: >
  Design system de la plateforme Aikoz by Okuden.
  Solution SaaS d'intelligence des avis digitaux — secteurs assurance,
  assistance, banque, automobile, santé.
  Ce fichier est la source de vérité unique pour tout contenu visuel Aikoz :
  slides, landing page, carrousels LinkedIn, documents commerciaux.

---

## Couleurs

### Palette primaire

```
midnight-blue:    #0A1128   — fond dominant, backgrounds dark, textes sur clair
frozen-white:     #FFFFFF   — fond clair, textes sur dark
aquamarine-green: #70FFD4   — accent primaire, CTA, highlights, numéros de section
ultramarine-blue: #3B5DCE   — interactif, énergie, liens
```

### Palette secondaire (usage slides & contenus)

```
deep-navy:        #1A2744   — blocs dark secondaires (colonnes, panels)
card-dark:        #111B35   — surfaces dark (jamais en fond plein page)
muted-blue:       #5A7BA8   — texte secondaire sur dark
muted-light:      #9AA3B2   — texte tertiaire, captions, dates
blue-subtitle:    #3B9DCE   — sous-titres italiques sur fond clair
section-inactive: #3A5070   — items non-actifs dans agenda/sommaire
rule-dark:        #1A2A50   — séparateurs fins sur fond dark
rule-light:       #D8DEE9   — séparateurs fins sur fond clair
```

### Tokens sémantiques

```
background-dark:    midnight-blue (#0A1128)
background-light:   frozen-white  (#FFFFFF)
background-panel:   deep-navy     (#1A2744)
text-on-dark:       frozen-white  (#FFFFFF)
text-on-light:      #1A1A2E       (quasi-noir, jamais pur #000000)
text-accent:        aquamarine-green (#70FFD4)
text-link:          ultramarine-blue (#3B5DCE)
text-muted-dark:    muted-blue    (#5A7BA8)
text-muted-light:   #555555
text-subtitle:      blue-subtitle (#3B9DCE)
rule-on-dark:       rule-dark     (#1A2A50)
rule-on-light:      rule-light    (#D8DEE9)
left-rule:          aquamarine-green (#70FFD4) — filet vertical gauche, 7px largeur
```

---

## Typographie

### Familles de polices

```
primary:   PP Radio Grotesk   — tous les titres, sous-titres, labels, numéros
secondary: Satoshi             — corps de texte long, captions, notes de bas de page
fallback:  Calibri, Arial      — si PP Radio Grotesk indisponible (Office/LibreOffice)
```

### Hiérarchie typographique (slides 16:9 — 10" × 5.625")

```
display-xl:    PP Radio Grotesk Black,  72–90pt  — grands chiffres impact (+25%, 93%)
display-lg:    PP Radio Grotesk Black,  44–56pt  — titres cover
display-md:    PP Radio Grotesk Bold,   36–42pt  — titres de section divider
heading-1:     PP Radio Grotesk Bold,   26–32pt  — titres de slides contenu
heading-2:     PP Radio Grotesk Bold,   18–22pt  — sous-titres de sections
heading-3:     PP Radio Grotesk Bold,   15–17pt  — titres de colonnes, labels
body-lg:       PP Radio Grotesk Regular, 14–15pt — corps principal
body-md:       PP Radio Grotesk Regular, 12–13pt — corps secondaire
body-sm:       PP Radio Grotesk Regular, 10–12pt — captions, sources, notes
kicker:        PP Radio Grotesk Bold,   10–12pt, letter-spacing: 2–3pt, ALL CAPS — labels de section
numeric-hero:  PP Radio Grotesk Black,  60–120pt — chiffres décoratifs de section
```

### Règles typographiques

**À faire :**
- Utiliser PP Radio Grotesk sur tous les éléments de slides
- Les numéros de section (01, 02…) : Black ou Bold, couleur aquamarine-green, taille 80–120pt
- Les sous-titres de slides contenu : Regular Italic, couleur blue-subtitle (#3B9DCE)
- Les titres de slides : "X.X – Titre" en Bold, couleur text-on-dark ou text-on-light selon fond
- Letter-spacing de 2–3pt uniquement sur les kickers/labels en CAPS (ex: "WE ARE", "AGENDA")

**À éviter :**
- Ne jamais utiliser de police serif — la marque est 100% sans-serif
- Ne pas utiliser Satoshi pour les titres de slides
- Ne pas dépasser 3 tailles de police par slide
- Ne pas utiliser l'italic hors sous-titres — la hiérarchie se fait par le poids, pas par l'italique
- Ne pas utiliser le poids Ultralight pour du texte informatif

---

## Logos

### Variantes disponibles

```
Logo_Horizontal.svg          — usage principal sur fond clair (symbole + "Aikoz")
Logo_Horizontal-byOkuden.svg — co-branding, supports Okuden, fond clair
Logo_Vertical.svg            — usage compact vertical, fond clair
Logo_Vertical-byokuden.svg   — co-branding vertical, fond clair
Logo_Sybol.svg               — picto seul, espaces très restreints
```

### Règles d'usage logo

**Fond dark (Midnight Blue) :**
- Utiliser Logo_Horizontal.svg avec les paths SVG colorés en #FFFFFF
- Position : bas-gauche, marges 8% du bord, hauteur ~0.38" sur slides 16:9

**Fond clair (Frozen White) :**
- Utiliser Logo_Horizontal.svg avec paths originaux (#0A1128)
- Position : bas-gauche, mêmes marges

**À faire :**
- Toujours utiliser symbole + logotype ensemble (jamais le logotype seul)
- Toujours placer le logo bas-gauche sur les slides

**À éviter :**
- Ne jamais ajouter d'ombre ou d'effet sur le logo
- Ne jamais placer le logo dans un conteneur coloré (pastille, rectangle)
- Ne jamais modifier les proportions
- Ne pas répéter le logo sur plusieurs endroits d'une même slide

---

## Layouts de slides — Patterns canoniques

### 1. Slide Cover

**Fond :** midnight-blue (#0A1128) plein  
**Structure :**
- Surtitle centré, Regular 15–16pt, text-on-dark : contexte ("Présentation & échanges")
- Titre principal centré, Bold 44–56pt, text-on-dark
- Sous-titre centré, Regular 18–22pt, text-on-dark
- Date centré, Regular italic 13pt, aquamarine-green
- Logo bas-gauche (version white)
- Optionnel : logo client bas-droit (dans bloc blanc ou transparent)

**À éviter :** Cards, shadows, éléments décoratifs superflus

---

### 2. Slide Agenda / Sommaire

**Fond :** midnight-blue (#0A1128) plein  
**Structure :**
- "Agenda" haut-gauche, Bold 16–18pt, aquamarine-green
- Liste numérotée, centrée verticalement, indentée à 25–30% du bord gauche
  - Numéro : aquamarine-green, Bold 16pt
  - Item actif : text-on-dark, Bold, CAPS ou capitalisation standard
  - Items inactifs : section-inactive (#3A5070), Regular, CAPS
- Logo bas-gauche (version white)

**À éviter :** séparateurs entre items, backgrounds alternatifs

---

### 3. Slide Section Divider

**Fond :** midnight-blue (#0A1128) plein  
**Structure :**
- Grand numéro (01, 02…) : 80–120pt, Black, aquamarine-green, aligné gauche, y=1.2"
- Titre de section : 36–42pt, Bold, text-on-dark, aligné gauche sous le numéro, y=2.9"
- Logo bas-gauche (version white)
- Aucun autre élément

**À éviter :** sous-titres, descriptions, images

---

### 4. Slide Contenu Standard (fond blanc, filet aqua gauche)

**Fond :** frozen-white (#FFFFFF)  
**Filet gauche :** rectangle aquamarine-green, 0.07" de large, toute la hauteur  
**Header :**
- Haut-gauche, x=0.35", y=0.22"
- Titre : "X.X – Titre", Bold 14–15pt, text-on-light (#1A1A2E)
- Sous-titre : Regular italic 12–13pt, blue-subtitle (#3B9DCE), y=0.62"

**Zone de contenu :** démarre à y=1.05", x=0.35"  
**Logo :** bas-gauche version dark, x=0.35", y=4.95"

---

### 5. Slide Split (photo gauche + contenu droit)

**Fond :** frozen-white (#FFFFFF)  
**Filet gauche :** rectangle aquamarine-green, 0.07" × toute la hauteur  
**Bloc gauche (0.07"–4.55") :**
- Fond deep-navy (#1A2744), plein, toute la hauteur
- Contenu : citation forte ou constat, Bold 22–28pt, text-on-dark (#FFFFFF)
- Optionnel : grand chiffre, Black 72–90pt, aquamarine-green

**Bloc droit (4.55"–10") :**
- Fond frozen-white
- Header standard en haut-gauche du bloc
- Contenu : stats, chiffres, ou liste

**Logo :** bas-gauche version dark

---

### 6. Slide Split (contenu gauche + panel dark droit)

**Fond :** frozen-white (#FFFFFF)  
**Filet gauche :** rectangle aquamarine-green, 0.07" × toute la hauteur  
**Zone gauche (0.07"–5.9") :**
- Header standard
- Grand chiffre impact, Black 72–90pt, aquamarine-green
- Sous-titre chiffre, Regular 26–36pt, text-on-light
- Corps, Regular 13–14pt, text-muted-light

**Panel droit (5.9"–10") :**
- Fond deep-navy (#1A2744), plein
- Titre fort, Bold 18–22pt, text-on-dark
- Corps, Regular 12pt, text-muted-dark

**Logo :** bas-gauche version dark

---

### 7. Slide Contenu Dark (fond midnight blue)

**Fond :** midnight-blue (#0A1128) plein  
**Header :**
- Titre : "X.X – Titre", Bold 14–15pt, text-on-dark (#FFFFFF)
- Sous-titre : Regular italic 12–13pt, blue-subtitle (#3B9DCE)

**Séparateurs :** rectangles fins 0.01"–0.02" hauteur, rule-on-dark (#1A2A50)  
**Logo :** bas-gauche version white

---

### 8. Slide Two-Column (do / don't, we are / we are not)

Variante de la slide contenu dark.

**Labels colonnes :** Bold 11pt, letter-spacing 2–3pt, ALL CAPS
- Colonne positive : aquamarine-green (#70FFD4)
- Colonne négative : section-inactive (#3A5070)

**Séparateur entre colonnes :** pas de ligne — l'espace est suffisant (colonne 1 : x=0.45"–4.55", colonne 2 : x=5.3"–9.65")

**Items :** Regular 13–14pt
- Colonne positive : #ADFFD8 (aqua très clair)
- Colonne négative : #5A7BA8 (muted blue)

**Séparateurs horizontaux entre items :** 0.01" hauteur, rule-on-dark (#1A2A50)

---

## Éléments graphiques & décoration

### Filet vertical gauche

Présent sur toutes les slides à fond blanc (sauf cover et agenda).  
`Rectangle : x=0, y=0, w=0.07", h=5.625", fill: aquamarine-green (#70FFD4)`  
Ne jamais utiliser d'autre couleur pour ce filet.

### Règles horizontales (séparateurs)

Sur fond dark : 0.01"–0.02" hauteur, #1A2A50  
Sur fond clair, sous labels : 0.02"–0.03" hauteur, aquamarine-green (colonne +) ou #FCA5A5 (colonne −)  
Sur fond clair, entre items : 0.01" hauteur, #D8DEE9

### Grands chiffres décoratifs

Usage : chiffres-clés (stat, %) ou numéros de section  
Police : PP Radio Grotesk Black  
Taille : 60–120pt selon contexte  
Couleur sur dark : aquamarine-green (#70FFD4)  
Couleur sur clair : aquamarine-green (#70FFD4) ou ultramarine-blue (#3B5DCE)

### Grid Vision (décoration géométrique)

Motif de carrés emboîtés en tirets — signature graphique Aikoz.  
Usage : fonds de slides dark, fond de carrousels LinkedIn.  
Couleur : aquamarine-green ou ultramarine-blue, opacité 15–30%.  
**Ne jamais surcharger** — 1 seul motif par slide maximum, en arrière-plan discret.

### Halos / gradients

Usage : slides cover, section dividers, backgrounds de présentation premium.  
Technique : radial gradient, depuis ultramarine-blue (#3B5DCE) à opacité 30–50% vers transparent, sur fond midnight-blue.  
**Ne jamais utiliser de gradient entre deux couleurs de marque.**

---

## Composants slides récurrents

### Header de slide contenu

```
Position : x=0.35", y=0.22" (toutes slides contenu)
Titre    : "X.X – Titre long ici"
           PP Radio Grotesk Bold, 14–15pt
           Couleur : text-on-light (#1A1A2E) sur blanc / text-on-dark (#FFFFFF) sur dark
Sous-titre : Regular italic, 12–13pt
           Couleur : blue-subtitle (#3B9DCE) sur blanc / même couleur sur dark
Séparation du contenu : y content start = 1.05" minimum
```

### Footer logo

```
Position : x=0.35", y=4.95"
Taille   : w=1.10", h=0.37"
Version  : white sur fond dark / dark sur fond clair
```

### Analyse Brand Voice (colonne droite)

Utilisé sur les slides d'exemples de contenu généré.

```
Panel droit : x=6.1", w=3.9", fond midnight-blue (#0A1128)
Label       : "Analyse Brand Voice", Bold 13pt, aquamarine-green, x=6.3", y=0.55"
Règle       : h=0.02", rule-on-dark (#1A2A50), y=1.0"
Items (5)   : icône (✓ ou ⚠) + texte, 12–13pt
              ✓ : couleur #ADFFD8
              ⚠ : couleur #FBBF24 (jaune ambre)
              Séparateurs entre items : 0.01", #1A2A50
```

---

## Patterns d'espacement (slides 16:9)

```
Marge gauche standard (après filet) : x = 0.35"
Marge droite standard               : x = 9.65" (right edge)
Marge haute standard                : y = 0.22" (header)
Marge basse standard                : y = 4.95" (footer logo)
Content area start Y                : 1.05"
Content area end Y                  : 4.85"
Colonne gauche (split)              : 0.07" – 4.50"
Colonne droite (split)              : 4.55" – 10.00"
Séparateur entre colonnes           : 4.50" – 4.55" (espace)
Gutter entre colonnes parallèles    : 0.15"–0.20"
Espacement entre sections (ligne)   : 0.70"–0.80"
```

---

## Règles d'usage — Do & Don't

### Couleurs

**À faire :**
- Utiliser midnight-blue comme couleur structurelle dominante (fonds, headers de section)
- Réserver aquamarine-green aux accents, CTA, chiffres-clés, filets — jamais en grand aplat
- Utiliser frozen-white pour les slides de contenu détaillé (lisibilité maximale)
- Alterner dark/clair selon la densité de contenu : cover=dark, contenu=clair, divider=dark

**À éviter :**
- Ne jamais mettre de texte blanc sur aquamarine-green (contraste insuffisant)
- Ne jamais utiliser aquamarine-green comme fond de slide entier
- Ne jamais introduire de couleur hors palette (orange, rouge, violet)
- Ne pas utiliser de dégradés entre couleurs de marque
- Ne pas utiliser le pur noir (#000000) — toujours #1A1A2E ou #0A1128

### Typographie

**À faire :**
- PP Radio Grotesk sur tous les éléments visuels sans exception
- Hiérarchie stricte : 1 display + 1 heading + 1 body par slide maximum
- Sous-titres de slides toujours en italic + blue-subtitle (#3B9DCE)
- Numéros de section (01, 02…) toujours en aquamarine-green, taille ≥ 80pt

**À éviter :**
- Aucune police serif — même pour les citations
- Pas d'italic hors sous-titres de slide
- Pas de souligné
- Pas d'ALL CAPS sur les titres principaux (seulement les labels/kickers en CAPS)
- Pas plus de 3 tailles de police par slide

### Composants & layout

**À faire :**
- Filet aqua gauche sur toutes les slides fond blanc
- Logo bas-gauche systématiquement
- Header "X.X – Titre / sous-titre italic" sur toutes les slides contenu
- Séparateurs fins (#1A2A50 ou #D8DEE9) pour séparer les items en liste
- Grand chiffre aqua comme élément visuel central sur les slides de stat

**À éviter :**
- Pas de cards avec shadow (shadow = AI-generated look, pas Aikoz)
- Pas de rounded rectangles comme conteneurs d'information
- Pas de badges ou pastilles de couleur superposées au texte
- Pas de backgrounds alternatifs pour les rangées de liste (zébré)
- Pas de borders multiples ou encadrements
- Pas d'éléments centrés sauf sur les slides cover et agenda
- Pas de plus de 2 blocs de couleur distincts par slide (ex: pas de 3 panels côte à côte)

### Décoration

**À faire :**
- Grid Vision (carrés tiretés) comme seul motif décoratif, discret, en bg dark
- Halos gradients uniquement sur covers et dividers
- Filet aqua gauche comme seul accent coloré récurrent sur fond blanc

**À éviter :**
- Pas d'icônes colorées (uniquement blanc ou aqua, ligne fine)
- Pas d'illustrations ou éléments hand-drawn
- Pas d'images stock génériques
- Pas de motifs répétitifs sur fond blanc

---

## Patterns de slides pour présentations

### Structure type d'un deck Aikoz

```
1. Cover           — dark, centré, logo bas-gauche
2. Agenda          — dark, numérotation aqua, item actif en blanc Bold
3. Section Divider — dark, grand numéro aqua + titre Bold
4. Slide contenu   — blanc, filet aqua, header X.X, layout adapté au contenu
   ...             — alterner dark/clair selon densité
N. Section Divider — prochain chapitre
N+1. Slide contenu — etc.
```

### Slides de contenu chiffré (stat headline)

Layout : fond blanc, filet aqua gauche  
Grand chiffre gauche (Black, 72–90pt, aqua) + explication dessous  
Panel dark droit avec phrase-clé Bold + corps muted

### Slides de liste comparative (do/don't)

Layout : fond dark, two-column  
Labels ALL CAPS + letter-spacing en haut de chaque colonne  
Règle colorée sous chaque label (aqua + rouge clair)  
Items avec séparateurs fins

### Slides d'exemple de contenu généré

Layout : fond blanc, filet aqua  
Zone principale gauche (x=0.35"–5.9") : texte du contenu généré
Panel analyse dark droit (x=6.1"–10") : checklist ✓/⚠

---

## Voice & messaging — intégration DA

Le design et la voix sont indissociables. Chaque choix visuel renforce le message.

### Principes de composition visuelle

- **Direct** : une idée par slide. Si le contenu ne tient pas en 3 lignes de body, c'est deux slides.
- **Hiérarchie visuelle** : le regard suit chiffre → titre → corps. Ne jamais inverser.
- **Blanc dominant** : les slides de contenu dense sont blanches. Le dark est réservé aux moments structurels (cover, divider) et aux panels d'analyse.
- **Aquamarine = signal** : quand le lecteur voit du aqua, c'est l'information la plus importante de la slide.

### Formulations visuelles récurrentes

```
Grand chiffre aqua   + label en dessous = stat headline (agents ou COMEX)
"X.X – Titre"        + sous-titre italic = entrée de slide contenu
Numéro (01, 02…)    + titre Bold        = transition de section
"WE ARE / WE ARE NOT" + items aqua/muted = slide identité de marque
✓ vert clair / ⚠ ambre                  = analyse de contenu généré
```

---

## Assets disponibles

```
/fonts/
  PPRadioGrotesk-Black.ttf
  PPRadioGrotesk-BlackItalic.ttf
  PPRadioGrotesk-Bold.ttf
  PPRadioGrotesk-BoldItalic.ttf
  PPRadioGrotesk-Regular.ttf
  PPRadioGrotesk-RegularItalic.ttf
  PPRadioGrotesk-Light.ttf
  PPRadioGrotesk-LightItalic.ttf
  PPRadioGrotesk-Ultralight.ttf
  PPRadioGrotesk-UltralightItalic.ttf
  Satoshi-Bold.otf
  Satoshi-Regular.otf (si disponible)

/logos/
  Logo_Horizontal.svg          (usage principal)
  Logo_Horizontal-byOkuden.svg (co-branding)
  Logo_Vertical.svg
  Logo_Vertical-byokuden.svg
  Logo_Sybol.svg               (picto seul)
```

---

## Références visuelles

Les fichiers suivants sont les sources canoniques de la DA Aikoz. Tout nouveau contenu doit être iso à ces références.

`[DA]` = référence visuelle à respecter à la lettre.  
`[Contenu]` = exemple de messaging et structure, pas de référence pour la DA.

- `[DA]`      `V1_WIP_Brand book Aikoz.pdf`                  — Brand book officiel, tous les patterns visuels de base
- `[Contenu]` `20250604_ALLIANZ_Aikoz.pdf`                  — Deck commercial, patterns slides chiffrées + split
- `[Contenu]` `20250324_COVEA_Aikoz.pdf`                    — Deck commercial, variante marque blanche
- `[Généré]`  `Aikoz_-_Pr_sentation_commerciale_v2.pptx`   — Exemple de génération réussie, conforme à la DA
