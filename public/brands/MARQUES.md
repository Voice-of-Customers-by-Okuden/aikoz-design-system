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

## Les masques fabriqués

Sept logos — AXA, MAAF, MACIF, MAIF, MMA, GMF, Groupama — ne se masquaient pas :
leur dessin est un aplat plein dont un masque n'aurait gardé qu'une silhouette
muette. Ils ont d'abord été affichés en couleur d'origine, ce qui faisait deux
traitements dans la même grille.

Leur masque est désormais **fabriqué** par `scripts/masques-marques.py`, selon
une règle unique : *est opaque ce qui n'est ni le fond extérieur, ni le blanc*.
Le blanc compte comme un trou parce que dans ces logos il **est** le dessin —
les lettres d'AXA, celles de MAIF, le M de MMA sont des réserves creusées dans
un aplat. Les garder donnait un pavé ; les creuser donne un logo lisible en une
seule encre, exactement comme un logotype imprimé en une couleur.

Deux cas, distingués par les **coins** de l'image et non par la marque :

| coins | traitement |
|---|---|
| transparents | le fond extérieur existe → on le retire, plus le blanc |
| opaques | l'aplat **est** le logo (AXA) → on ne retire que le blanc |

Sans cette distinction, AXA perdait son carré et il ne restait qu'une diagonale.

**Ce que ça coûte.** Le masque est une réduction : la diagonale rouge d'AXA
disparaît dans le carré, le symbole de MACIF se fond dans le sien. Deux couleurs
qui se touchent fusionnent forcément en une seule encre. Les fichiers d'origine
restent dans ce dossier — ce sont eux qu'il faudra servir le jour où on
affichera les logos en couleur.

Les fichiers produits sont suffixés `-mask.png`, 1 à 3 Ko chacun.

## Remplacer un fichier

La couverture d'encre est une propriété **du fichier**, pas de la marque : un
logo remplacé doit être remesuré, et `maskable` mis à jour en conséquence.
Les marges transparentes des bitmaps ont été rognées au plus juste — Malakoff
Humanis passait de 3508×2481 à 2960×963, et son logo était rendu minuscule
tant que les marges y étaient.
