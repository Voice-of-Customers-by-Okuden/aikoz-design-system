#!/usr/bin/env python3
"""
Fabrique un masque monochrome pour un logo qui n'en fournit pas.

POURQUOI
--------
`BrandLogo` rend les logos en monochrome par masque CSS : le fichier sert de
`mask-image`, la couleur vient du dessous. Un fichier ne s'y prête que si son
canal alpha dessine déjà la forme utile. Sept des dix-neuf marques du registre
ne remplissaient pas cette condition : leur logo est un aplat plein — le carré
d'AXA, le triangle de MAIF, les pastilles de MMA — dont un masque ne garderait
que la silhouette, c'est-à-dire un bloc muet.

On a d'abord affiché ces sept-là en couleur d'origine. C'était honnête mais pas
tenable : deux traitements dans la même grille, et il a fallu renoncer à mettre
la teinte de marque sur les plaques pour que l'ensemble reste cohérent.

CE QUE FAIT CE SCRIPT
---------------------
Il reconstruit le masque au lieu de l'attendre du fichier, par une règle
unique : **est opaque ce qui n'est ni le fond extérieur, ni le blanc.**

Le blanc compte comme un trou parce que dans ce type de logo, il EST le
dessin — les lettres d'AXA, celles de MAIF, le M de MMA sont des réserves
blanches creusées dans un aplat. Les garder produirait un pavé ; les creuser
produit un logo lisible en une seule encre. C'est exactement ce que fait un
logotype monochrome imprimé en une couleur.

Deux cas, distingués par les COINS de l'image et non par la marque :

  coins transparents  le fond extérieur existe → on le retire, plus le blanc
  coins opaques       l'aplat EST le logo (AXA) → on ne retire que le blanc

Sans cette distinction, AXA perdait son carré et il ne restait qu'une diagonale.

CE QUE ÇA COÛTE
---------------
Le masque est une réduction : la diagonale rouge d'AXA disparaît dans le carré,
le symbole de MACIF se fond dans le sien. Deux couleurs qui se touchent
fusionnent forcément en une seule encre. Les fichiers d'origine restent dans
`public/brands/` — c'est eux qu'il faudra servir le jour où on affichera les
logos en couleur.

USAGE
-----
    python3 scripts/masques-marques.py            # tous les fichiers déclarés
    python3 scripts/masques-marques.py axa maif   # seulement ceux-là

Prérequis : `python3 -m pip install Pillow`, et `rsvg-convert` pour les SVG
(`brew install librsvg`). Ce n'est pas une étape du build : on la relance à la
main quand un logo est ajouté ou remplacé.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow manquant : python3 -m pip install Pillow")

DOSSIER = Path("public/brands")
LARGEUR = 512

# Fichiers dont le masque doit être fabriqué. Un logo qui se masque déjà
# correctement n'a rien à faire ici : on n'ajoute une entrée qu'après avoir
# constaté que le rendu direct donne un aplat.
A_TRAITER = {
    "axa": "axa.svg",
    "maif": "maif.svg",
    "gmf": "gmf.svg",
    "mma": "mma.svg",
    "groupama": "groupama.svg",
    "macif": "macif.png",
    "maaf": "maaf.png",
}

SEUIL_BLANC = 235   # au-delà, on considère que le pixel est une réserve
TOLERANCE_FOND = 40  # écart admis par canal pour reconnaître le fond
SEUIL_ALPHA = 40     # en-deçà, le pixel est déjà transparent


def rasteriser(source: Path) -> Image.Image:
    """SVG ou bitmap → image RGBA de `LARGEUR` de large."""
    if source.suffix.lower() == ".svg":
        tmp = source.with_suffix(".tmp.png")
        subprocess.run(
            ["rsvg-convert", "-w", str(LARGEUR), "-o", str(tmp), str(source)],
            check=True,
        )
        im = Image.open(tmp).convert("RGBA")
        im.load()
        tmp.unlink()
        return im
    im = Image.open(source).convert("RGBA")
    hauteur = round(LARGEUR * im.height / im.width)
    return im.resize((LARGEUR, hauteur), Image.LANCZOS)


def fabriquer_masque(im: Image.Image) -> tuple[Image.Image, float]:
    px = im.load()
    W, H = im.size
    coins = [px[0, 0], px[W - 1, 0], px[0, H - 1], px[W - 1, H - 1]]
    fond = max(set(coins), key=coins.count)
    # Coins opaques : il n'y a pas de fond extérieur, l'aplat fait partie du
    # logo. On ne retire alors que les réserves blanches.
    retirer_le_fond = fond[3] < SEUIL_ALPHA * 6

    masque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mp = masque.load()
    for y in range(H):
        for x in range(W):
            c = px[x, y]
            if c[3] < SEUIL_ALPHA:
                continue
            if retirer_le_fond and fond[3] >= SEUIL_ALPHA and all(
                abs(c[i] - fond[i]) <= TOLERANCE_FOND for i in range(3)
            ):
                continue
            if c[0] > SEUIL_BLANC and c[1] > SEUIL_BLANC and c[2] > SEUIL_BLANC:
                continue
            mp[x, y] = (0, 0, 0, 255)

    boite = masque.getbbox()
    if boite:
        masque = masque.crop(boite)
    total = masque.size[0] * masque.size[1]
    opaques = sum(1 for p in masque.getdata() if p[3] > 128)
    return masque, opaques / total if total else 0.0


def main(argv: list[str]) -> int:
    demandes = argv[1:] or list(A_TRAITER)
    inconnus = [d for d in demandes if d not in A_TRAITER]
    if inconnus:
        return print(f"inconnu(s) : {', '.join(inconnus)}") or 1

    for slug in demandes:
        source = DOSSIER / A_TRAITER[slug]
        if not source.exists():
            print(f"  !! {slug} — {source} absent")
            continue
        im = rasteriser(source)
        masque, couverture = fabriquer_masque(im)
        sortie = DOSSIER / f"{slug}-mask.png"
        masque.save(sortie, optimize=True)
        poids = sortie.stat().st_size // 1024
        print(
            f"  {slug:<10} {im.size[0]}x{im.size[1]} → {masque.size[0]}x{masque.size[1]}"
            f"  couverture {couverture:.2f}  {poids} Ko"
        )
    print(
        "\nRegarder le résultat avant de s'en contenter : la couverture ne dit "
        "pas si le logo reste reconnaissable."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
