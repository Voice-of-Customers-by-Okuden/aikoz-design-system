> **À lire en priorité au démarrage : [aikoz-ds-contexte.md](./aikoz-ds-contexte.md)** — contexte projet, façon de travailler, décisions verrouillées, backlog.

## Couleur (tokens & CSS)
- Primitives au format DTCG objet : `$value` = `{ "colorSpace": "oklch", "components": [L, C, H], "alpha": 1, "hex": "#..." }`. Les `components` OKLCH font foi ; `hex` = repli sRGB. `$description` décrit l'**usage** de la teinte.
- La variable CSS porte la couleur **complète** : `--x: oklch(L C H)` (ou `oklch(L C H / alpha)`). Les consommateurs font `var(--x)` **brut** — JAMAIS `oklch(var(--x))` ni `hsl(var(--x))` : on ne réenveloppe jamais la fonction couleur autour de la variable.
- Transparence : `color-mix(in oklch, var(--x), transparent N%)`, ou une variable dédiée avec l'alpha déjà inclus.
- `components` émis verbatim en `oklch()` à la génération (jamais recalculés).

## Accessibilité
Avant de figer tout composant : appliquer la checklist de `a11y.md`.
- Auditer TOUTES les paires de contraste, pas seulement texte/fond : aussi élément/conteneur (badge/carte, bordure/fond, trait/fond) — WCAG 1.4.11, seuil 3:1.
- Mesurer les ratios (calcul WCAG), ne pas juger à l'œil. Vérifier light ET dark séparément.
- Texte >= 4,5:1 (viser AA + marge). Ne jamais véhiculer l'info par la seule couleur (icône/signe/aria-label).
- Couleurs toujours branchées sur le bridge ; un rôle manquant = une variable dédiée, pas un détournement.
