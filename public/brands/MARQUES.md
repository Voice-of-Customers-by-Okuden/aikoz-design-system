# Logos de marques tierces

Les fichiers de ce dossier sont des **marques déposées appartenant à leurs
titulaires respectifs**. Ni Okuden ni Aikoz n'en revendiquent la propriété.

## Pourquoi ils sont là

Aikoz est un outil d'analyse et de **comparaison** du marché de l'assurance.
Identifier un assureur par son logo dans un classement, un filtre ou une
légende relève de l'usage nominatif : on désigne la marque pour parler d'elle,
sans suggérer d'affiliation, de partenariat ni d'approbation.

## Ce que ça implique

- Aucun logo n'est modifié dans sa forme. Le rendu monochrome par masque CSS
  est un traitement d'affichage, réversible, appliqué à l'affichage seul.
- Aucun logo n'est utilisé dans une communication laissant entendre un lien
  commercial avec Okuden.
- Un titulaire qui demande le retrait de sa marque l'obtient : supprimer le
  fichier suffit, le composant retombe seul sur les initiales.

## Provenance

| origine | marques |
|---|---|
| Wikimedia Commons | Crédit Agricole, Groupama, MAIF, AG2R La Mondiale |
| Wikipédia FR | Swiss Life — `Fichier:Logo Swiss Life.svg`, SVG produit par Sa-se sous Inkscape |
| Site officiel de la marque | Matmut, AÉSIO, MACSF, GMF, MMA, Malakoff Humanis, La Médicale |
| Fournis par le client | Generali, Europ Assistance |
| Fonds documentaire Okuden | AXA, Allianz, Abeille, MACIF, MAAF, Harmonie Mutuelle |
| Projet Claude Design Aikoz | MAAF, Harmonie Mutuelle, Groupama |

**Les 19 marques sont couvertes.** Swiss Life a longtemps manqué : son site
refuse tout accès automatisé (HTTP 403) et Commons n'a que des sous-marques —
Swiss Life Select, Swiss Life Asset Managers. Le fichier était en réalité sur
**Wikipédia FR** et non sur Commons, ce qu'une recherche Commons ne pouvait pas
trouver. Alice a fourni la référence.

## Le champ `maskable`

Sept fichiers — AXA, MAAF, MACIF, MAIF, MMA, GMF, Groupama — ne supportent pas
le rendu monochrome : le dessin repose sur une forme pleine dont un masque ne
garderait que la silhouette. Ils sont affichés **en couleur d'origine**, jamais
remplacés par des initiales.

**Et ce n'est pas réparable par une retouche du fichier.** Le SVG d'AXA est un
carré bleu, une diagonale rouge et des lettres blanches : retirer le carré pour
le rendre masquable laisserait les seules lettres, c'est-à-dire une autre
marque. Un logo dont le sens est porté par la couleur ne se monochromise pas.
C'est pour cette raison que la plaque a **une seule surface pour tous** — claire,
avec un trait — au lieu de porter la teinte de marque : mélanger douze blocs
colorés et sept plaques blanches faisait sept trous dans la grille.

Six d'entre eux sont détectés par la mesure (couverture d'encre ≥ 0,40).
Groupama non : son logotype en traits fins dilue la moyenne à 0,26 alors que
son symbole est plein. Le chiffre est le bon filtre de premier tri, il ne
remplace pas un coup d'œil au rendu. Détail dans
`registry/aikoz/brand-logo/brands.ts`.

## Remplacer un fichier

La couverture d'encre est une propriété **du fichier**, pas de la marque : un
logo remplacé doit être remesuré, et `maskable` mis à jour en conséquence.
Les marges transparentes des bitmaps ont été rognées au plus juste — Malakoff
Humanis passait de 3508×2481 à 2960×963, et son logo était rendu minuscule
tant que les marges y étaient.
