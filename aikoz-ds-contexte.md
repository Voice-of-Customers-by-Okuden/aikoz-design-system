# Aikoz Design System — Contexte & doctrine

> À lire au démarrage de CHAQUE session (Claude Code comme le chat).
> Source unique de vérité du contexte projet. Toute décision structurante s'écrit ici, tout de suite.
> Dernière mise à jour : 2026-07-02

## 1. Objectif
Construire le design system Aikoz by Okuden : socle de composants React pour un SaaS B2B d'analyse d'avis clients (assurance, banque, auto), aussi distribué en marque blanche. Cap : fondations solides vers un dashboard d'analyse d'avis démontrable (v0.1). Démarrage dev produit : à poser à Arnaud/Louis.

## 2. Rôles
- Alice — product designer / archi DS. Conçoit, tranche le visuel, exécute dans Claude Code.
- Claude (chat) — assistant senior UX-UI + architecte DS. Conçoit, challenge, audite. N'a PAS accès au repo → Alice colle captures/sorties.
- Équipe : Arnaud (fondateur, valide brand) · Pietro (N+1, autorité technique) · Tommy (data) · Louis (produit) · Julien (commercial) · Cyril (tech, indispo août).
- Gouvernance PR : Alice merge ses PR elle-même. Seul réflexe : vérifier le rendu visuel avant de figer.

## 3. Façon de travailler (contrat d'équipe)
Boucle : Claude rédige un prompt auto-suffisant → Alice le colle dans Claude Code → valide chaque commande « 1. Yes » (jamais « don't ask again ») → colle la sortie → Claude audite. Playground = labo ; composant/tokens = produit fini.
Délégation : Claude tranche et avance sur la plomberie et l'archi quand Alice n'a pas de préférence forte ; Alice juge le rendu, pas chaque décision intermédiaire. Question uniquement si choix de marque/design ou aiguillage structurant.
Principes non négociables : jamais une couleur à l'œil (auditer chiffré) ; une variable = un rôle ; aucune valeur en dur hors primitives ; le bridge est généré, JAMAIS édité à la main ; lecture seule avant modif ; fichier temporaire + diff avant bascule, .bak avant remplacement ; commits atomiques. generated/ et public/r/ jamais committés.
Definition of Done (composant) : (1) zéro couleur en dur ; (2) tous variants + tailles ; (3) tous états repos/hover/active/focus-visible/disabled ; (4) focus a11y conforme ; (5) audit contraste chiffré light+dark ; (6) rendu validé playground light+dark ; (7) déclaré au registry + build OK ; (8) décisions documentées ici.
Rituel début de session : branche ? git status propre ? build:tokens passe ? playground démarre ? un seul serveur Vite ?
Rituel fin de session : maj de ce fichier + commit propre + écrire les 3 prochaines étapes.

## 4. Architecture des tokens (modèle Lyse, MIT)
Build via Style Dictionary (build-tokens.mjs, config inline) depuis le DTCG (tokens/), en cascade :
1. Primitives (tokens/primitives.json → build/primitives.css) : palette brute, rampes 50→1000 (12 paliers) pour midnight-blue, ultramarine, aquamarine, neutral, success, warning, error, info ; generali-red s'arrête à 900. Layout + typo complètes.
2. Brand (tokens/brand/aikoz.json → build/brand-aikoz.css) : rôles de marque, constants (ne varient pas par thème).
3. Theme sémantique (tokens/theme/{light,dark}.json → build/theme-{light,dark}.css) : rôles adaptatifs, préfixe --color-{namespace}-{role}, namespaces surface/text/border/status/nav, sélecteurs :root (light) / .dark (dark).
4. Bridge (tokens/bridge/shadcn.json → bridge/shadcn-bridge.css) : GÉNÉRÉ depuis le DTCG via transform custom color/hslTriplet (sortie H S% L% pour compat hsl(var(--x)/alpha)). Mappe chaque variable shadcn vers un token sémantique. NE JAMAIS éditer à la main.
Régénération : npm run build:tokens.
Long terme (non bloquant) : composants cibles Web Components (Lit/Stencil) pour agnosticisme framework + marque blanche.

## 5. État actuel
- Repo : Voice-of-Customers-by-Okuden/aikoz-design-system. Local ~/aikoz-design-system. Playground Vite sur /playground/ (port glisse 5173→5176 si vieilles instances — les tuer).
- Docs racine : CLAUDE.md (lu auto, pointe vers ce fichier + a11y.md), DESIGN.md (brand/tokens, verrou Arnaud), a11y.md, README.md.
- KpiCard : livré. Zéro dépendance à --primary/--secondary/--accent.
- Bridge réparé (2026-07-02, commit fc1eadc) : généré depuis le DTCG, les 3 bugs dark réglés à la source. Vérifié au rendu : dark = default aquamarine, secondary pâle, outline bordure aquamarine.
- Button : vague 1 construite mais UX/UI à revoir (hiérarchie light : secondary domine le default). En pause. button.tsx sans report hovers ni max-width.
- Registry shadcn : build OK. Install tierce bloquée sur divergence Tailwind v3 (Aikoz) vs v4.

## 6. Décisions verrouillées (avec le pourquoi)
- Grammaire couleur : « l'aquamarine (#70ffd4) est l'étincelle du foncé » — vit sur midnight, jamais à nu sur blanc (échoue WCAG 1.4.11).
- Primary adaptatif (modélisé) : surface.action = midnight light / aquamarine dark ; text.on-action = blanc / midnight. → --primary.
- Secondary adaptatif : surface.action-secondary = ultramarine hsl(226 60% 52%) light / pâle #BDCAEF hsl(224 61% 84%) dark (même teinte/saturation, luminosité change). Primitive ultramarine.225 créée. → --secondary.
- Accent = brand.accent = aquamarine CONSTANT les 2 thèmes. → --accent (= hover neutre shadcn). Ne pas détourner.
- Outline : bordure neutre light / bordure + texte aquamarine dark. Voile de survol = aquamarine.
- Focus : :focus-visible, ring >= 2px, ring-offset lié à --background, contraste >= 3:1. border.focus = ultramarine light / aquamarine dark. Socle AA = 2.4.7 + 1.4.11 ; apparence chiffrée = 2.4.13 (AAA).
- Règle de hover (à modéliser en tokens surface.*-hover, pas dans le composant) : surface claire → s'assombrit ; surface foncée → s'éclaircit. Sur fond sombre, jouer sur la luminosité, pas l'opacité.
- Forme/typo : pilule pour actions, radius léger pour champs. Label medium (500), casse normale. Tailles sm 36 / md 44 (défaut) / lg 48px.

## 7. Pièges & dettes
- NE JAMAIS éditer bridge/shadcn-bridge.css à la main (cause n°1 des bugs de la journée). Toujours DTCG + build:tokens.
- À construire : npm run verify:bridge (régénère et compare au commité, détecte édition manuelle / oubli de régénération), idéalement en CI.
- Tailwind v3 : pas de classes interpolées (bg-x/${n} est purgé) — écrire en toutes lettres.
- git config user.email : commits signés placeholder, pas le vrai mail Okuden.
- Ramp generali-red incohérente + pas de 950/1000.
- README périmé (dit à tort que Claude Code lit DESIGN.md auto — il ne lit que CLAUDE.md).

## 8. Backlog / à auditer
- Audit contraste des valeurs changées par la réparation : --muted-foreground dark (neutral.300 non audité, note dans theme/dark.json), --destructive dark (error.400), --secondary-foreground dark (midnight sur pâle).
- Button : hiérarchie light, puis report hovers + max-width dans button.tsx.
- Modéliser les tokens de hover (surface.*-hover) selon la règle §6.
- Construire verify:bridge + doctor.
- Compléter generali-red (950/1000).
- Scinder ce fichier : garder ici la doctrine stable, sortir l'état/backlog/prochaines-étapes dans un JOURNAL.md actualisé à chaque fin de session. CLAUDE.md pointera vers les deux.

## 9. Prochaines étapes (3 max, à réactualiser)
1. Poser ce contexte + renvoi dans CLAUDE.md (en cours).
2. Reprendre le Button : hiérarchie UX light, puis hovers + max-width.
3. Décision Tailwind v3/v4 avec Pietro (conditionne bascule HSL→oklch).

## En attente externe
- Pietro : Tailwind v3 ou v4 (conditionne HSL→oklch).
- Arnaud (Brand Brain) : voix unique vs collective, ton agents/COMEX, contenu anglais, corpus d'exemples, ton Labels Aikoz.
