# Aikoz Design System

Dossier de référence complet pour tout contenu visuel Aikoz.  
**Ne pas modifier sans validation Arnaud.**

## Structure

```
aikoz-design-system/
├── DESIGN.md                      ← SOURCE DE VÉRITÉ — design system complet
├── brand-brain/
│   └── brand-voice-guidelines.md  ← Tone of voice, règles éditoriales
├── fonts/
│   ├── PPRadioGrotesk/            ← Police principale (titres, UI)
│   │   ├── PPRadioGrotesk-Black.ttf
│   │   ├── PPRadioGrotesk-Bold.ttf
│   │   ├── PPRadioGrotesk-Regular.ttf
│   │   ├── PPRadioGrotesk-Light.ttf
│   │   └── ...italiques
│   └── Satoshi/                   ← Police secondaire (corps long)
│       ├── Satoshi-Bold.otf
│       └── ...
├── logos/
│   ├── Logo_Horizontal.svg        ← USAGE PRINCIPAL (fond clair)
│   ├── Logo_Horizontal-byOkuden.svg
│   ├── Logo_Vertical.svg
│   ├── Logo_Vertical-byokuden.svg
│   └── Logo_Sybol.svg             ← Picto seul
└── references/
    ├── 20240830_PRESENTATION_AIKOZ.pdf   ← Brand book — référence canonique
    ├── 20250604_ALLIANZ_Aikoz_v2.pdf     ← Deck commercial de référence
    └── 20250324_COVEA_Aikoz.pdf          ← Deck commercial de référence
```

## Comment utiliser ce dossier

### Pour Claude Design (claude.ai/design)

1. Va sur `claude.ai/design`
2. Clique **"Set up design system"**
3. Upload dans cet ordre :
   - `DESIGN.md` (fondation)
   - Les 5 logos SVG
   - Les 3 PDFs de références (brand book + decks)
4. Valide le design system généré
5. Crée un projet **Slides** avec ce prompt :

```
Crée une présentation Brand Voice Aikoz en 17 slides.
Structure : Cover → Agenda → 6 sections avec dividers et slides de contenu.
Respecte strictement le DESIGN.md : PP Radio Grotesk, palette midnight-blue/aquamarine,
filet aqua gauche, header "X.X – Titre", logos bas-gauche.
Référence visuelle : les decks Allianz et brand book uploadés.
```

### Pour Claude Code (terminal)

Le dossier `~/aikoz-brand/.claude/` contient déjà `brand-voice-guidelines.md`.  
Copie aussi `DESIGN.md` dedans :

```bash
cp ~/aikoz-design-system/DESIGN.md ~/aikoz-brand/.claude/DESIGN.md
```

Ensuite dans Claude Code (`cd ~/aikoz-brand && claude`) :

```
Génère une présentation Brand Voice Aikoz V5 en PPTX.
Lis d'abord .claude/DESIGN.md pour les tokens et patterns exacts.
```

### Pour les polices (installation Mac)

```bash
# Double-clique sur chaque fichier, ou via terminal :
open ~/aikoz-design-system/fonts/PPRadioGrotesk/
open ~/aikoz-design-system/fonts/Satoshi/
```

## Tokens clés (rappel rapide)

| Token | Valeur |
|---|---|
| midnight-blue | #0A1128 |
| aquamarine-green | #70FFD4 |
| ultramarine-blue | #3B5DCE |
| frozen-white | #FFFFFF |
| Police principale | PP Radio Grotesk |
| Police secondaire | Satoshi |

## À compléter

- [ ] `Logo_Horizontal-byOkuden.svg` à ajouter dans `/logos/`
- [ ] `Logo_Vertical-byokuden.svg` à ajouter dans `/logos/`
- [ ] Exemples de contenus validés par Arnaud → à ajouter dans `/brand-brain/exemples-valides.md`
