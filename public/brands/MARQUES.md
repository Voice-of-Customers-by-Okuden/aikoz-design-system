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
| Site officiel de la marque | Matmut, AÉSIO, MACSF, GMF, Malakoff Humanis, La Médicale |
| Fournis par le client | Generali, Europ Assistance |
| Fonds documentaire Okuden | AXA, Allianz, Abeille, MACIF, MAAF, Harmonie Mutuelle |
| Projet Claude Design Aikoz | MAAF, Harmonie Mutuelle, Groupama |

**Absents** : MMA et Swiss Life. Leurs sites refusent tout accès automatisé
(HTTP 403) ; il faut les récupérer à la main. En attendant, les deux marques
s'affichent en initiales, ce qui ne casse rien.

## Le champ `maskable`

Cinq fichiers — AXA, MAAF, MACIF, MAIF, GMF — ne supportent pas le rendu
monochrome : leur couverture d'encre dépasse 0,40, c'est-à-dire que le dessin
repose sur une forme pleine dont un masque ne garderait que la silhouette.
Ils restent dans le dépôt pour un futur affichage en couleur d'origine. Le
détail de la mesure est dans `registry/aikoz/brand-logo/brands.ts`.

## Remplacer un fichier

La couverture d'encre est une propriété **du fichier**, pas de la marque : un
logo remplacé doit être remesuré, et `maskable` mis à jour en conséquence.
