# Aikoz Design Tokens (DTCG)

Source de verite des tokens, au format **DTCG** (Design Tokens Community Group).
Nommage et structure **alignes sur le repo de Pietro** (`primitives` + `semantics`),
enrichis de ce qui manquait : la dimension **marque** (Aikoz / Generali) et la
dimension **theme** (Light / Dark).

## Structure

```
tokens/
  primitives.json        # valeurs brutes : rampes couleur OKLCH 50->1000, typo, spacing, radius, border-width, shadow
  semantics.json         # semantiques INDEPENDANTES du mode : radius, shadow, border-width, typography (alias -> primitives)
  brand/
    aikoz.json           # color.brand.* (primary/secondary/accent...) -> primitives
    generali.json        # meme contrat, valeurs Generali (marque blanche)
  theme/
    light.json           # color.surface/text/border/status/nav -> primitives + brand
    dark.json            # meme contrat, valeurs sombres
```

Resolution : un ecran applique un mode **marque** (brand/*) ET un mode **theme** (theme/*).
Les semantiques de theme referencent la couche brand la ou la couleur depend de la marque
(ex : `nav.accent` = `brand.secondary` en light, `brand.accent` en dark).

## Aligne sur Pietro

- Format DTCG (`$type`/`$value`/`$description`), nommage de rampes (`midnight-blue`,
  `ultramarine`, `aquamarine`, `neutral`, `success/warning/error/info`) et de semantiques
  (`brand.*`, `surface.*`, `text.*`, `border.*`, `status.*`) repris **tels quels**.
- Rampes couleur OKLCH 50->1000 reprises verbatim de son `primitives.json`.

## Decisions DA conservees (plus recentes que son repo, ~2 mois)

- **Typo** : `font-family.body` = **Inter** (UI/web/dashboard), `heading` = PP Radio Grotesk
  (slides/print), `mono` = JetBrains Mono (KPI). (Son repo avait Satoshi en body.)
- **Elevation** : la DA mene par les **bordures** (`border.*`), pas les ombres. Les tokens
  `shadow.*` restent dispo pour les rares overlays/dropdowns uniquement.
- **Aquamarine sur fond sombre uniquement** : `nav.accent` = ultramarine en light,
  aquamarine en dark (contraste WCAG).

## Ajouts (manquants chez lui)

- Dimension **marque blanche** : `brand/aikoz.json` + `brand/generali.json` + rampe
  `color.generali-red` dans primitives (valeurs a confirmer cote brand Generali).
- Dimension **theme** : `theme/light.json` + `theme/dark.json`.
- Groupe **`color.nav.*`** (sidebar thematisee) + `typography.metric` (chiffres mono).

## A trancher cote CI (avec Cyril)

Build (Style Dictionary) + module **Resolver** DTCG pour declarer marque x theme dans un
manifeste unique. Non bloquant : les tokens ci-dessus sont la partie durable et reviewable.
