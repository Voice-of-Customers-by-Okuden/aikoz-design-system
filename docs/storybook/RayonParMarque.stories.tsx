import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PanneauRayon } from "./rayon-par-marque";

/**
 * ── Pourquoi des cadres, et pas deux colonnes ────────────────────────────
 *
 * La marque est un axe de RACINE : les fichiers générés ciblent
 * `:root[data-brand="adp"]`, et la spécificité (0,2,0) est ce qui lui fait
 * passer devant le thème. Posé sur un sous-arbre, `data-brand` ne déclenche
 * rien — deux marques dans une même page est exactement ce que cette
 * architecture interdit, et c'est aussi pour ça que l'axe de thème fuyait
 * d'une histoire à l'autre quand il était posé par un décorateur.
 *
 * Deux histoires empilées sur une page de doc ne suffiraient pas non plus :
 * elles partagent UN document, donc une seule racine, donc une seule marque.
 *
 * Un cadre par marque donne deux vraies racines. Ce n'est pas un contournement
 * du mécanisme : c'est le mécanisme, rendu deux fois.
 */
function Cadre({ marque, nom }: { marque: string; nom: string }) {
  return (
    <figure className="m-0 flex min-w-0 flex-1 flex-col gap-2">
      <figcaption className="text-sm font-semibold">{nom}</figcaption>
      <iframe
        title={`Panneau ${nom}`}
        data-marque={marque}
        src={`iframe.html?id=design-system-decisions-rayon-par-marque--panneau&viewMode=story&globals=marque:${marque};theme:clair`}
        className="h-80 w-full rounded-[var(--radius)] border border-border bg-[var(--background)]"
      />
    </figure>
  );
}

function Comparaison() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
      <Cadre marque="aikoz" nom="Aikoz — en pilule" />
      <Cadre marque="adp" nom="ADP — angles courts" />
    </div>
  );
}

const meta = {
  title: "Design system/Décisions/Rayon par marque",
  component: Comparaison,
  parameters: { layout: "fullscreen" },
  globals: { theme: "clair" },
} satisfies Meta<typeof Comparaison>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Le panneau seul — c'est lui que les cadres chargent. */
export const Panneau: StoryObj = {
  name: "Panneau (chargé par la comparaison)",
  tags: ["!autodocs", "!dev"],
  render: () => <PanneauRayon />,
};

export const DeuxMarques: Story = {
  name: "Une marque, une ligne",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        story:
          "**Le travail n'est pas la valeur, c'est le tri.** Vingt-cinq " +
          "`rounded-full` étaient écrits en dur dans dix-huit composants. Neuf " +
          "relèvent de l'IDENTITÉ — bouton, badge, puce de filtre, déclencheur " +
          "de période : ils restent lisibles à tous les rayons, donc leur " +
          "rayon appartient à la marque. Seize relèvent de la GÉOMÉTRIE — " +
          "avatar, curseur d'interrupteur, piste de jauge : aussi larges que " +
          "hauts, ou finissant en demi-cercle. Changer leur rayon ne produit " +
          "pas une autre identité, mais une erreur de dessin.\\n\\n" +
          "Les neuf premiers lisent `--radius-pill`. ADP le surcharge d'une " +
          "ligne dans `tokens/brand/adp.json`, à 8 px — la même valeur que " +
          "`--radius`, pour qu'un bouton et la carte qui le contient partagent " +
          "leur rayon. **Retirer cette ligne rend les pilules**, sans toucher " +
          "à un seul composant.\\n\\n" +
          "La treizième convention de `audit:conventions` tient le tri : tout " +
          "`rounded-full` restant doit être nommé avec la raison qui le range " +
          "du côté de la géométrie. Sans elle, le tri se défait au premier " +
          "composant ajouté — quelqu'un écrit `rounded-full` sur un nouveau " +
          "bouton, il reste en pilule sous ADP, et personne ne le voit avant " +
          "la démonstration.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    // ── Les cadres illustrent, ils ne mesurent pas ────────────────────────
    //
    // Ils ne se chargent que dans Storybook : sous le lanceur de tests,
    // `iframe.html` n'existe pas, et une assertion posée dessus mesurerait
    // le harnais au lieu du design system. On vérifie donc qu'ils sont là,
    // et la mesure se fait sur le mécanisme lui-même.
    await expect(canvasElement.querySelectorAll("iframe")).toHaveLength(2);

    // ── Ce que mesure vraiment ce test ────────────────────────────────────
    //
    // La marque est un axe de RACINE. On la bascule donc sur la racine, on
    // remesure le MÊME élément, et on la remet — c'est exactement ce que
    // fait la barre d'outils, et c'est la seule façon d'observer les deux
    // états sans dépendre d'un cadre.
    //
    // Restaurée dans un `finally` : un axe laissé sur le document fuit sur
    // l'histoire suivante, et le nettoyage d'un décorateur arrive après le
    // montage de celle-ci. C'est le défaut qui avait fait rendre `KpiCard`
    // sous la police absente d'ADP.
    const racine = document.documentElement;
    const avant = racine.dataset.brand;

    const sonde = document.createElement("div");
    sonde.innerHTML =
      '<button class="rounded-[var(--radius-pill)] h-11"></button>' +
      '<span class="rounded-full h-10 w-10"></span>';
    canvasElement.appendChild(sonde);
    const bouton = sonde.querySelector("button")!;
    const cercle = sonde.querySelector("span")!;

    const mesurer = () => ({
      pilule: parseFloat(getComputedStyle(bouton).borderTopLeftRadius),
      cercle: parseFloat(getComputedStyle(cercle).borderTopLeftRadius),
      hauteur: bouton.getBoundingClientRect().height,
      hauteurCercle: cercle.getBoundingClientRect().height,
    });

    try {
      racine.dataset.brand = "aikoz";
      const a = mesurer();
      racine.dataset.brand = "adp";
      const adp = mesurer();

      // Une pilule a un rayon d'au moins la moitié de sa hauteur ; un angle
      // court en a bien moins. Mesuré en PROPORTION : en pixels bruts, le
      // seuil dépendrait de la taille du bouton.
      await expect(
        a.pilule >= a.hauteur / 2 - 1,
        `Aikoz rend la pilule à ${a.pilule} px pour ${a.hauteur} px de haut : ` +
          `ce n'est plus une pilule.`,
      ).toBe(true);
      await expect(
        adp.pilule < adp.hauteur / 2 - 1,
        `ADP rend la pilule à ${adp.pilule} px pour ${adp.hauteur} px de ` +
          `haut : la surcharge de tokens/brand/adp.json n'a pas pris.`,
      ).toBe(true);

      // ── La valeur d'ADP est une MESURE, pas un arrondi ────────────────
      //
      // 6 px vient de l'inspection d'un bouton de leur plateforme
      // multi-POI : `border-radius: calc(var(--radius) - 2px)`, résolu en
      // `calc(-2px + 0.5rem)`. Notre échelle de rayons va de 4 à 8 sans
      // passer par 6, donc quelqu'un qui « range » ce littéral en
      // `dimension.radius.md` le ferait dériver de 2 px sur chaque bouton et
      // chaque badge — invisible isolément, très visible à côté de leur
      // écran. D'où une assertion sur la valeur exacte.
      await expect(
        adp.pilule,
        `ADP rend la pilule à ${adp.pilule} px. La valeur relevée sur leur ` +
          `plateforme est 6 px : un alias de notre échelle donnerait 4 ou 8.`,
      ).toBe(6);

      // Et le cercle ne bouge pas d'un pixel entre les deux marques.
      await expect(
        adp.cercle,
        `le cercle passe de ${a.cercle} à ${adp.cercle} px : il a suivi la ` +
          `marque alors que sa rondeur est imposée par sa forme.`,
      ).toBe(a.cercle);
      await expect(adp.cercle >= adp.hauteurCercle / 2 - 1).toBe(true);
    } finally {
      if (avant === undefined) delete racine.dataset.brand;
      else racine.dataset.brand = avant;
      sonde.remove();
    }
  },
};
