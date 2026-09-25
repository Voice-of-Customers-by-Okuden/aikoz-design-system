# Aikoz Design System — Contexte & doctrine

> À lire au démarrage de CHAQUE session (Claude Code comme le chat).
> Source unique de vérité du contexte projet. Toute décision structurante s'écrit ici, tout de suite.
> Dernière mise à jour : 2026-09-22

## 1. Objectif
Construire le design system Aikoz by Okuden : socle de composants React pour un SaaS B2B d'analyse d'avis clients (assurance, banque, auto), aussi distribué en marque blanche. Cap : fondations solides vers un dashboard d'analyse d'avis démontrable (v0.1). Démarrage dev produit : à poser à Arnaud/Louis.

## 2. Rôles
- Alice — product designer / archi DS. Conçoit, tranche le visuel, exécute dans Claude Code.
- Claude (chat) — assistant senior UX-UI + architecte DS. Conçoit, challenge, audite. N'a PAS accès au repo → Alice colle captures/sorties.
- Équipe : Arnaud (fondateur, valide brand) · Pietro (N+1, autorité technique) · Tommy (data) · Louis (produit, **pousse des PR sous le compte `AstralPhoebus`**) · Julien (commercial) · Cyril (tech).
- Gouvernance PR : Alice merge ses PR elle-même. Seul réflexe : vérifier le rendu visuel avant de figer.

## 3. Façon de travailler (contrat d'équipe)
Boucle : Claude rédige un prompt auto-suffisant → Alice le colle dans Claude Code → valide chaque commande « 1. Yes » (jamais « don't ask again ») → colle la sortie → Claude audite. Playground = labo ; composant/tokens = produit fini.
Délégation : Claude tranche et avance sur la plomberie et l'archi quand Alice n'a pas de préférence forte ; Alice juge le rendu, pas chaque décision intermédiaire. Question uniquement si choix de marque/design ou aiguillage structurant.
Principes non négociables : jamais une couleur à l'œil (auditer chiffré) ; une variable = un rôle ; aucune valeur en dur hors primitives ; le bridge est généré, JAMAIS édité à la main ; lecture seule avant modif ; fichier temporaire + diff avant bascule, .bak avant remplacement ; commits atomiques. `generated/` jamais committé ; **`public/r/` l'est** — le registry publié embarque une copie du source et la CI vérifie qu'ils ne divergent pas.
Definition of Done (composant) : (1) zéro couleur en dur ; (2) tous variants + tailles ; (3) tous états repos/hover/active/focus-visible/disabled ; (4) focus a11y conforme ; (5) audit contraste chiffré light+dark ; (6) rendu validé playground light+dark ; (7) déclaré au registry + build OK ; (8) décisions documentées ici.
Rituel début de session : branche ? git status propre ? build:tokens passe ? playground démarre ? un seul serveur Vite ?
Rituel fin de session : maj de ce fichier + commit propre + écrire les 3 prochaines étapes.

## 4. Architecture des tokens (modèle Lyse, MIT)
Build via Style Dictionary (build-tokens.mjs, config inline) depuis le DTCG (tokens/), en cascade :
1. Primitives (tokens/primitives.json → build/primitives.css) : palette brute, rampes 50→1000 (12 paliers) pour midnight-blue, ultramarine, aquamarine, neutral, success, warning, error, info ; generali-red s'arrête à 900. Layout + typo complètes. Couleurs au **format DTCG objet** : `$value` = { colorSpace: "oklch", components: [L, C, H], alpha, hex }. Les `components` OKLCH font foi, `hex` = repli sRGB. `$description` décrit l'**usage** de la teinte. Sortie CSS en `oklch()` complet (transform `color/oklch`, composants source verbatim).
2. Brand (tokens/brand/aikoz.json → build/brand-aikoz.css) : rôles de marque, constants (ne varient pas par thème).
3. Theme sémantique (tokens/theme/{light,dark}.json → build/theme-{light,dark}.css) : rôles adaptatifs, préfixe --color-{namespace}-{role}, namespaces surface/text/border/status/nav, sélecteurs :root (light) / .dark (dark).
4. Bridge (tokens/bridge/shadcn.json → bridge/shadcn-bridge.css) : RUNTIME **généré** depuis le DTCG (transform `color/oklch`), consommé par playground/demo. Mappe chaque variable shadcn vers un token sémantique, en **oklch() complet**. Consommation : `var(--x)` brut côté Tailwind/composants — JAMAIS `oklch(var(--x))` / `hsl(var(--x))` ; transparence via `color-mix(in oklch, var(--x), transparent N%)`. Extensions DS (au-delà du set shadcn) : `--success`, `--destructive-text`, `--chart-1`, adossées aux rôles sémantiques `status.success-text` / `status.error-text` / `chart.1` (valeurs par mode light/dark). NE JAMAIS éditer à la main — régénérer.
Régénération : npm run build:tokens.
Long terme (non bloquant) : composants cibles Web Components (Lit/Stencil) pour agnosticisme framework + marque blanche.

## 5. État actuel — 25/09/2026, version 2.19.2

- Repo : Voice-of-Customers-by-Okuden/aikoz-design-system, **public**. Site publié par GitHub Pages depuis `main` : https://voice-of-customers-by-okuden.github.io/aikoz-design-system/
- **55 composants, 56 entrées de registry, 275 tests**, verts dans les deux thèmes. Louis a l'accès `write` et consomme le registry publié.
- **Section « Assemblages »** dans Storybook, publiée : matrice d'habilitation (modifiable · consultable · noms corrigés), circuit de validation, démo ADP « État des réponses » avec leur contenu exact. Un assemblage vit dans un **fichier nu** à côté de son histoire (motif de `dashboard-complet.tsx`), et sa page Docs montre ce fichier EN ENTIER, lu par `?raw` : la doc ne peut pas diverger du code. Code **déplié d'entrée** (`canvas.sourceState`), bouton « Copy code ».
- **Trois façons de récupérer du code**, toutes vérifiées en ligne : `npx shadcn@latest add .../r/<nom>.json` pour un composant · « Show code » sur une histoire pour l'usage · page **Docs** d'un assemblage pour l'écran entier.
- **Versionnage sémantique** : `CHANGELOG.md`, `public/version.json`, `audit:version` refuse une PR qui touche `registry/`, `tokens/` ou `bridge/` sans monter la version ET écrire le journal — verrou npm compris. ⚠️ **Lancer `registry:build` APRÈS `npm version`**, sinon `chiffres.ts` porte l'ancienne version et la CI tombe.
- **Les chiffres de la vitrine sont comptés, pas écrits** (`docs/storybook/chiffres.ts`, généré).
- `public/r/` **est** committé ; la CI échoue si le publié diverge du source.
- Node **24** en local comme en CI (`engines: node >= 22`).
- **Les démos ADP se font en mode clair.** Constat, pas une règle.
- **`AstralPhoebus` est LOUIS**, pas Tommy — vérifié sur ses commits (`brach.louispj@gmail.com`). Erreur d'attribution corrigée le 24/09. Ses PR #127 et #129 sont fusionnées.
- **`gh` rebascule tout seul sur le compte perso d'Alice** (`lilicegonzales`), et `git push` échoue en 403. Cause : le `gitconfig` d'Xcode pose un `credential.helper = osxkeychain` générique, lu AVANT la config perso ; et `gh auth git-credential` ne sert QUE le compte actif, vérifié. Correction en attente côté Alice, cf. §Dettes ouvertes.
- Storybook : le serveur de dev **ne rescanne pas un fichier créé après son démarrage**. Redémarrer avant de conclure à une classe morte. Piège rencontré cinq fois.

### Les neuf contrôles qui tournent en CI
| contrôle | ce qu'il refuse |
|---|---|
| `build:tokens` | un bridge qui ment, une échelle sombre qui diverge, une carte héroïne hors bande, **un rôle `--role-*` que personne ne lit**, et **un rôle de statut défini dans un thème que le pont ne publie pas** |
| `audit:conventions` | un composant qui s'écarte des **douze conventions** du système |
| `audit:typo` | une taille ou une graisse hors échelle |
| `audit:mouvement` | une animation de position sans `motion-reduce`/`motion-safe` |
| `audit:marques` | une couleur empruntée à la rampe d'une autre marque |
| `audit:registry` | une entrée absente, qui ne livre pas ce que ses imports atteignent, ou **décrite en français dépouillé** |
| `audit:version` | une PR qui change le livré sans version ni journal |
| stories | `AuditContraste` (WCAG + APCA, 8 combinaisons) · `AuditCibles` · `AuditFocus` · `AuditIcones` · axe en mode `error` · **`mesurerLeRendu` sur CHAQUE histoire** (cibles ≥ 24 px, svg nommé ou masqué, pas de débordement) |

**Chaque garde-fou a été vérifié en le cassant.** Trois d'entre eux ne mesuraient rien avant qu'on essaie.

## 6. Décisions verrouillées (avec le pourquoi)
- **Composant ou assemblage.** Un composant est une brique : son contrat doit tenir PARTOUT, sans qu'on le voie, il vit dans `registry/aikoz/` et se livre par `shadcn add`. Un assemblage est un écran : il tient ICI, on le voit, il vit dans `docs/storybook/` (fichier nu + histoire) et se **copie** depuis sa page Docs. La question qui tranche : *la prochaine personne qui en a besoin en a besoin à l'identique, ou comme point de départ ?* Un assemblage porte quand même son test — ici une histoire EST un test. Écrit en section 1 de « Créer un composant ». Pourquoi : le système avait 53 atomes et zéro assemblage publié, donc toute demande d'écran client devenait un 54e composant.
- **Le rouge ne dit qu'une chose : l'utilisateur est refusé, ou quelque chose va être détruit.** Un chargement qui échoue ne fait ni l'un ni l'autre : `EmptyState tone="error"` n'est PAS rouge, et ce qui distingue l'échec du vide est la présence d'une **action de reprise**, pas une teinte.
- **Le vocabulaire des props.** `label` nomme un contrôle ou une mesure · `title` titre un bloc qu'on lit · `caption` nomme un jeu de données (c'est le `<caption>` HTML, donc **obligatoire ou inexistant**) · `description` est la ligne de contexte. Les rappels disent CE QUI a changé, jamais le geste : `onValueChange`, `onCheckedChange`, `onOpenChange`. Deux exceptions nommées : `BarChart.onBarClick` et `FranceMap.onSelect` disent « clic » parce qu'ils sont des raccourcis souris uniquement, le graphique étant masqué aux technologies d'assistance.
- Format & câblage couleur : primitives en DTCG objet (components oklch, source de vérité) ; toute variable CSS porte la couleur **complète** (`oklch(L C H)`, ou `/ alpha`) ; consommateurs en `var(--x)` brut ; transparence via `color-mix(in oklch, …, transparent N%)` ou variable à alpha inclus. Pourquoi : couleur atomique/opaque au point de définition → pas de manipulation de composants dispersée, pas d'erreur de syntaxe, prêt gamut large. Jamais `oklch(var())` / `hsl(var())` / triplet nu.
- Grammaire couleur : « l'aquamarine (#70ffd4) est l'étincelle du foncé » — vit sur midnight, jamais à nu sur blanc (échoue WCAG 1.4.11).
- Primary adaptatif (modélisé) : surface.action = midnight light / aquamarine dark ; text.on-action = blanc / midnight. → --primary.
- Secondary adaptatif : surface.action-secondary = ultramarine hsl(226 60% 52%) light / pâle #BDCAEF hsl(224 61% 84%) dark (même teinte/saturation, luminosité change). Primitive ultramarine.225 créée. → --secondary.
- Accent = brand.accent = aquamarine, **aquamarine.300 dans les deux thèmes**. Mais `--accent` (shadcn) NE pointe PAS dessus : dans shadcn c'est une **surface discrète**, et la pointer sur l'aplat vif rendait la paire illisible (APCA 38 chez ADP). `--accent` = `surface.accent` (le voile), `--accent-foreground` = `text.accent`. L'aplat de marque reste disponible en `--color-brand-accent`. (22/09/2026)
- **L'accent est un SIGNE, pas une couleur de texte.** Posé sur la carte il plafonnait à 43-54 en APCA pour un plancher de 75, et aucun palier de rampe n'y arrivait sous Extime. Il porte du texte sur son propre voile, ou il ne porte rien. (22/09/2026)
- **`brand.focus` est un rôle à soi.** Il était emprunté — `brand.secondary` en clair, `brand.accent` en sombre — parce qu'aucune des deux sources ne tient dans les deux thèmes (accent : 12 chez Aikoz en clair, 0 chez Generali ; secondaire : 9-24 chez les quatre en sombre ; seuil 45). Le rôle porte EXACTEMENT les couleurs d'avant : corriger une architecture ne donne pas le droit de changer une identité. (22/09/2026)
- Outline : bordure neutre light / bordure + texte aquamarine dark. Voile de survol = aquamarine.
- Focus : :focus-visible, ring >= 2px, **ring-offset de 2px en `--background`** — l'anneau ne touche donc jamais le contrôle, il se mesure contre la page/la carte, jamais contre le bouton. `border.focus` = `brand.focus`. Socle AA = 2.4.7 + 1.4.11 ; apparence chiffrée = 2.4.13 (AAA).
- Règle de hover (à modéliser en tokens surface.*-hover, pas dans le composant) : surface claire → s'assombrit ; surface foncée → s'éclaircit. Sur fond sombre, jouer sur la luminosité, pas l'opacité.
- Forme/typo : pilule pour actions, radius léger pour champs. Label medium (500), casse normale. Tailles sm 36 / md 44 (défaut) / lg 48px.
- **Cibles : 24 px partout (WCAG 2.2 AA 2.5.8), 44 au doigt** via la variante `tactile:` (`@media (pointer: coarse)`). Élargir la zone en douce par un `::after` invisible est écarté : ça rend la cible vraie et l'affordance fausse. (22/09/2026)
- **Carte héroïne** : `surface.hero` — le rôle est la HIÉRARCHIE, pas l'inversion. En clair elle s'enfonce (0,05× la clarté des autres cartes), en sombre elle s'allume (2,4×) au lieu d'éblouir (15,3× auparavant). Bande vérifiée au build. Le registre marketing garde l'inversion. (22/09/2026)
- **Le sombre n'est pas le clair inversé** : pas de blanc pur en texte (halo), profondeur portée par la clarté des surfaces et non par des ombres, un voile doit avoir son palier sombre.

## 7. Pièges & dettes

### La leçon de la journée du 22/09 : **on mesure le rendu, jamais le déclaré**
Chaque défaut trouvé ressemblait à du code correct, parce que la mauvaise chose était mesurée.
- `strokeWidth` est en unités du **viewBox** : 1,75 rendait 1,17 px ici et 1,67 px là.
- `outline-none` de Tailwind pose `outline: 2px solid transparent` — un contour qui ne peint rien se faisait passer pour un indicateur de focus.
- `strokeWidth` vaut 1 par défaut sur un chemin en `stroke: none` — l'audit réclamait d'épaissir des logos sans trait.
- `:focus-visible` ne répond qu'au **vrai clavier** : `element.focus()` depuis un script ne déclenche rien.
- Un audit qui scanne des `.mdx` accuse la documentation qui **cite** la règle. Neutraliser commentaires et citations Markdown.
- **Toujours assortir un audit d'une assertion « ai-je mesuré quelque chose ? »** — sans elle, un audit qui ne mesure rien passe.

### La leçon des 24-25/09 : **un axe posé sur le document fuit sur ses voisins**
Trois défauts, un seul mécanisme. Ce qui se pose sur `documentElement` ne se range pas tout seul.
- Trois assemblages posaient `data-brand` dans un `useEffect` avec nettoyage. Le nettoyage arrive **après** le montage de l'histoire suivante : `KpiCard` se rendait sous la police d'ADP, absente, donc sans jeu tabulaire. La marque est devenue un **global de barre d'outils**, posé par chaque histoire — un axe que personne n'oublie de retirer, puisque la suivante le repose.
- Sur une page **Docs**, toutes les histoires partagent le même document. L'histoire « thème sombre » de la démo ADP assombrissait ses voisines et la page entière. **Une histoire qui épingle un global de niveau document n'a pas sa place sur une page qui en empile d'autres** (`tags: ["!autodocs"]`).
- L'audit de rendu tournait aussi en mode docs, où il mesurait le gabarit de Storybook (143 px de débordement) au lieu du nôtre. Et un `afterEach` qui lève en docs **remplace l'histoire** par un bloc d'erreur : **cinq pages de composant sur six** affichaient six encadrés rouges à la place des exemples, en ligne depuis la 2.9.0. Il ne tourne plus en docs, et son contrôle de débordement mesure le **canevas**, plus le document.

### Corollaire : **un test qui dépend de l'environnement ne parle pas du composant**
Le test d'alignement de `KpiCard` mesurait la chasse des chiffres sans attendre les polices. Isolé il passait, en CI il passait (les polices n'y chargent pas), en suite complète il échouait à 3,53 px. Trois environnements, trois verdicts, aucun sur le composant. `await document.fonts.ready`. **C'est le pire type de test : celui qui échoue pour de mauvaises raisons, parce qu'on finit par l'ignorer.**

### Corollaire : **deviner une valeur qu'on peut lire, c'est se mesurer soi-même**
J'ai estimé `info.200` à 4,77:1 en devinant ses composantes au lieu de les lire dans `primitives.json`. La vraie valeur donne 4,18. Quinze histoires tombées, une seule cause. Même famille : j'ai lu un `oklch()` rendu comme du `rgb()` et annoncé un chroma de 0,318 — un bleu pur — sur une bordure grise.

### Dettes fermées les 23-25/09
- ✅ **La suite tourne dans les deux thèmes** (`npm run test:sombre`), et `mesurerLeRendu` s'applique à chaque histoire, plus au seul tableau de bord.
- ✅ **Les 54 descriptions du registry** étaient sans accents — le seul texte que voit qui fait `shadcn add`. Réécrites, et `audit:registry` refuse le français dépouillé.
- ✅ **Le vocabulaire des props est écrit** : `label` nomme un contrôle, `title` titre un bloc, `caption` nomme un jeu de données, `description` est la ligne de contexte. `ChoiceCard.onChange` portait le nom exact que `Checkbox` hérite de React **avec une signature incompatible** ; `KpiCard.caption` était le seul `caption` à ne pas nommer un jeu de données. Les deux sont renommés, anciens noms en `@deprecated` et **exercés par une histoire**.
- ✅ **`KanbanBoard`** extrait de `ResponseKanban`, qui est rebâti dessus sans changer d'API.
- ✅ **Six props nouvelles sur `Table`** — `density="large"`, `rowHeaderSurface`, `columnRules`, `headerCell`, `layout="fixed"`, et `relative` sur le conteneur de défilement (un tableau large poussait la PAGE au lieu de défiler chez lui : 238 px à 375 px de large).
- ✅ **`BrandMark.className` remplaçait la boîte** au lieu de s'y ajouter : le logo d'ADP se rendait à 950 × 326 px.
- ✅ **Le badge employait UNE variable pour trois rôles.** La rampe de statut `*.300` (#FAD94E, #EC9A84…) existait dans les thèmes et n'était **publiée nulle part** : le contour prenait donc la couleur de TEXTE, d'où l'avertissement kaki. Et le fond de statut en clair était sur `*.50` quand le sombre est sur `*.950` — **5 à 10 fois moins détaché de sa carte**. Corrigé aux deux endroits.

### Dettes fermées le 22/09
- ✅ Les **cinq dettes d'accent** — sans retoucher une couleur de charte. `PAIRES` ne contient plus aucune `dette`.
- ✅ **75 rôles `--role-*` sur 86** que zéro composant ne lisait : retirés, et le build refuse d'en réintroduire.
- ✅ L'échelle typographique ne gouvernait rien (pont `build/tailwind-typo.mjs`).
- ✅ Les tableaux Markdown ne s'affichaient pas dans les MDX (`remark-gfm` manquait).

### Dettes ouvertes
- **`git push` bascule sur le compte perso d'Alice et échoue en 403.** Deux causes cumulées : le `gitconfig` d'Xcode pose un `credential.helper = osxkeychain` **générique**, lu avant la config perso, et `gh auth git-credential` **ne sert que le compte actif** (vérifié : il ne rend rien quand git demande `Alicokuden` alors que `lilicegonzales` est actif). `gh` ne peut donc pas arbitrer entre deux comptes. Correction : ranger un jeton par compte dans le trousseau, puis `credential.username` par dépôt. Les commandes sont prêtes, **Alice seule peut les lancer** (elles manipulent ses jetons). `lilicegonzales` est son compte **perso**, à ne pas déconnecter.
- **Réécriture d'historique** — `references/20250324_COVEA_Aikoz.pdf`, `20250604_ALLIANZ_Aikoz.pdf`, la présentation commerciale, les polices sous licence (PP Radio Grotesk, Satoshi) et `typo extime.zip` sont **lisibles publiquement dans l'historique git**. Le dépôt ne peut pas passer en privé : plan gratuit, GitHub Pages s'arrêterait et Louis n'installerait plus rien. `git filter-repo` + force-push + ticket au support GitHub pour purger les anciens SHA (ce ticket, Alice seule peut l'ouvrir). Aucun fork, Louis n'a aucun commit, sa branche est supprimée — **vérifier seulement qu'il n'a pas un clone local avec du travail en cours**. **Louis n'est PAS en congé et a deux clones locaux** (ses PR #127 et #129, désormais fusionnées) : lui demander avant de lancer. Ordre : fusionner tout ce qui est ouvert, puis réécrire, puis lui faire refaire un clone.
- **119 commits signés `Alice Maréchaud <ton@email.com>`** — adresse bidon d'une config git jamais remplie. À corriger pendant la réécriture, c'est le seul moment où c'est gratuit.
- **Écart assumé avec la charte ADP** : elle impose l'aplat 100 % (« applied in a 100 % solid block », page 18 barrant les primaires en teinte) et le système pose des voiles. Décision d'Alice du 22/09 : on assume, c'est écrit avec la citation dans « Ajouter une marque » pour être défendable. Les 24 couleurs secondaires ADP ne sont PAS entrées dans les tokens — rien ne les consommerait.
- `border` / `input` à ~1,3:1 — filets hairline, préexistant, décision de design en attente.
- `verify:bridge` / `doctor` : jamais construits. Le besoin est en partie couvert par `build:tokens` et `audit:registry`.
- Ramp `generali-red` sans 950/1000.
- README périmé (dit à tort que Claude Code lit DESIGN.md).
- **Workflow Jekyll hérité** : il échoue à chaque fusion sur `main` alors que le vrai déploiement (« Design system ») passe. Une croix rouge qui ne veut rien dire apprend à ignorer les croix rouges. À désactiver dans les réglages Pages.
- **21 branches distantes sur 33 sont déjà fusionnées** dans `main`. À nettoyer, de préférence AVANT la réécriture d'historique : chaque référence est réécrite.
- **Rien n'est écrit sur la hiérarchie et la densité.** Les douze conventions CI sont douze règles de **non-erreur** ; la section « typographie et espacement » dit « rien à faire de spécial, sauf ne pas sortir de l'échelle ». Le système sait dire « c'est faux », pas « c'est mou » — donc chaque écran re-dérive sa hiérarchie et tombe sur le plus petit dénominateur qui passe la CI. Sept règles ont été trouvées en corrigeant la matrice d'habilitation, aucune n'est écrite : la densité suit ce que la cellule contient · filets verticaux ssi les deux axes portent du sens · une colonne d'ancrage dès qu'on lit vers la droite · le trait d'en-tête porte 3:1 quand il sépare des rangées qui se ressemblent · un pictogramme par ligne quand toutes se ressemblent · **des colonnes de même contenu, même largeur** (mesurable, déjà testée) · **un en-tête riche s'aligne en haut** (mesurable, déjà testée).

## 8. Backlog / à auditer
- **Polices sous licence non livrées** (doctrine assumée : un DS *déclare* la police, il ne la *livre* pas — `public/fonts/LISEZ-MOI.md`). Manquent : les fichiers **Extime** (brand center) et **Gotham** pour ADP (à acheter chez Hœfler & Co). Les replis sont ceux que les chartes désignent.
- **Généraliser `Pagination` dans `Table`** : le composant existe, le tableau ne l'emploie pas encore.
- Composants encore absents et jugés non nécessaires aujourd'hui : `slider`, `drawer`, `sheet`, `calendar`, `command`, `tag`, `spinner`.
- Button : hiérarchie light, hovers + max-width.
- Modéliser les tokens de hover (`surface.*-hover`) selon la règle du §6.
- `--radius` à câbler proprement.

## 9. Prochaines étapes (3 max, à réactualiser)
1. **Livrer à Cyril les assemblages d'écran** dont il a besoin — priorité du 25/09. Reste à savoir lesquels et s'il part d'un projet React existant.
2. **Les trois commandes `gh`**, par Alice. C'est le seul point de la liste qui peut la gêner dans la journée.
3. **Écrire la section « Hiérarchie et densité »**, et faire passer en convention CI les deux règles déjà mesurables.

## En attente externe
- **Alice** : feu vert pour la réécriture d'historique, et ouverture du ticket au support GitHub (elle seule peut).
- **Louis** : confirmer qu'il n'a pas de clone local avec du travail en cours avant la réécriture. Ses deux PR sont fusionnées, avec une relecture postée sur chacune. Une remarque lui reste ouverte : le compteur de `ViewTabs` est visible et jamais annoncé (`label={null}` → `label="entrées"`).
- **ADP** : les **six noms de rôles** de la matrice d'habilitation. Trois n'en ont pas, et deux colonnes portent le même intitulé (« RÔLE 6 »), ce qui rend **quatre paires de droits indiscernables** — mesuré, 20 noms distincts pour 24 cases. C'est la seule chose entre la matrice et un livrable. Et : la matrice est-elle **modifiable ou consultable** ? Les deux existent.
- **Cyril** : licence Gotham pour ADP (Hœfler & Co) · fichiers de police Extime (brand center).
- Pietro : Tailwind v3 ou v4 (choix d'archi ; ne bloque plus l'oklch, confirmé fonctionnel sur v3 via valeurs arbitraires + color-mix).
- Arnaud (Brand Brain) : voix unique vs collective, ton agents/COMEX, contenu anglais, corpus d'exemples, ton Labels Aikoz.
