## Accessibilité
Avant de figer tout composant : appliquer la checklist de `a11y.md`.
- Auditer TOUTES les paires de contraste, pas seulement texte/fond : aussi élément/conteneur (badge/carte, bordure/fond, trait/fond) — WCAG 1.4.11, seuil 3:1.
- Mesurer les ratios (calcul WCAG), ne pas juger à l'œil. Vérifier light ET dark séparément.
- Texte >= 4,5:1 (viser AA + marge). Ne jamais véhiculer l'info par la seule couleur (icône/signe/aria-label).
- Couleurs toujours branchées sur le bridge ; un rôle manquant = une variable dédiée, pas un détournement.
