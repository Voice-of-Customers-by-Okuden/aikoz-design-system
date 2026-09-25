import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { BrandMark, LOGOS, nomDeMarque } from "./brand-mark";

const meta = {
  title: "Marque/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof BrandMark>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Par défaut — la marque du document",
  parameters: {
    docs: {
      description: {
        story:
          "Sans prop, il affiche la marque que porte `data-brand` sur la " +
          "racine, et **il la suit** via un observateur d'attribut. Le passer " +
          "en prop à chaque appelant reviendrait à réimplémenter la marque " +
          "blanche dans chaque page, et un oubli ne se verrait nulle part.",
      },
    },
  },
};

export const LesQuatreMarques: Story = {
  name: "Les quatre marques, cadrées par la même boîte",
  parameters: {
    docs: {
      description: {
        story:
          "Un logo s'inscrit dans une BOÎTE, il n'est pas calé sur sa seule " +
          "hauteur. Les rapports largeur/hauteur vont de 2,9 à 7,3 selon la " +
          "marque : à hauteur égale, le plus large écrase les autres et les " +
          "compacts paraissent minuscules.\n\n" +
          "`object-contain` garantit qu'aucun n'est déformé — toutes les " +
          "chartes l'interdisent.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {Object.keys(LOGOS).map((b) => (
        <div key={b} className="flex items-center gap-4">
          <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {b}
          </span>
          <BrandMark brand={b} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Toutes les marques rendent à la MÊME hauteur : c'est la règle de
    // cadrage, et c'est elle qu'on vérifie, pas une largeur particulière.
    const visibles = [...canvasElement.querySelectorAll("img")].filter(
      (i) => i.offsetParent !== null
    );
    await expect(visibles.length).toBe(Object.keys(LOGOS).length);
    await waitFor(async () => {
      for (const i of visibles) await expect(i.naturalWidth).toBeGreaterThan(0);
    });
    const hauteurs = visibles.map((i) => Math.round(i.getBoundingClientRect().height));
    await expect(Math.max(...hauteurs) - Math.min(...hauteurs)).toBeLessThanOrEqual(1);
  },
};

export const UneMarqueSansLogoEcritSonNom: Story = {
  name: "Une marque sans fichier écrit son nom",
  args: { brand: "une-marque-inconnue" },
  parameters: {
    docs: {
      description: {
        story:
          "Une marque sans logo doit être visible COMME TELLE. Un espace " +
          "vide passerait inaperçu jusqu'à la démonstration client ; un nom " +
          "écrit se remarque, donc se réclame.\n\n" +
          "La même règle vaut pour une marque qui n'a pas de version sombre " +
          "de son logo : le thème sombre écrit alors son nom plutôt que de " +
          "réutiliser le fichier clair, qui deviendrait une tache illisible.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector("img")).toBeNull();
    await expect(canvas.getByText("Une-marque-inconnue")).toBeInTheDocument();
    // `nomDeMarque` sert les `aria-label` des liens qui entourent le logo :
    // il doit répondre pour une marque inconnue comme pour les autres.
    await expect(nomDeMarque("une-marque-inconnue")).toBe("Une-marque-inconnue");
    await expect(nomDeMarque("adp")).toBe("Groupe ADP");
  },
};

export const LeLogoEstDecoratif: Story = {
  name: "Le logo est décoratif, c'est le lien qui le nomme",
  parameters: {
    docs: {
      description: {
        story:
          "Le `alt` est vide, délibérément : c'est le lien qui entoure ce " +
          "composant qui porte le nom accessible. Sans ça, un lecteur " +
          "d'écran annoncerait la marque deux fois — « Aikoz, lien Aikoz ».",
      },
    },
  },
  render: () => (
    <a href="#accueil" aria-label={`${nomDeMarque("aikoz")} — accueil`} className="inline-flex">
      <BrandMark brand="aikoz" />
    </a>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lien = canvas.getByRole("link", { name: "Aikoz — accueil" });
    // Une seule source de nom : le lien. Les images n'en portent aucun.
    for (const img of lien.querySelectorAll("img")) {
      await expect(img).toHaveAttribute("alt", "");
    }
  },
};

export const LaBoiteResteAppliquee: Story = {
  name: "`className` s'ajoute à la boîte, il ne la remplace pas",
  args: { className: "shrink-0" },
  parameters: {
    docs: {
      description: {
        story:
          "`className` REMPLAÇAIT la boîte par défaut. Un `shrink-0` posé " +
          "pour une raison de mise en page effaçait donc `h-8 max-w-[160px]`, " +
          "et le logo d'ADP se rendait à **950 × 326 px** au milieu d'un " +
          "en-tête.\n\n" +
          "Un même nom pour deux comportements — ajouter partout ailleurs, " +
          "remplacer ici — est le défaut le plus cher d'une bibliothèque : il " +
          "ne se voit qu'à l'usage, et il se voit tard.\n\n" +
          "Redimensionner reste possible : `h-12` ou `max-w-[200px]` gagnent, " +
          "c'est `tailwind-merge` qui tranche.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const logo = canvasElement.querySelector<HTMLElement>("img:not(.hidden)");
    await expect(logo).not.toBeNull();
    const r = logo!.getBoundingClientRect();
    // La boîte du système tient, malgré le `className` passé.
    await expect(
      Math.round(r.height),
      `le logo fait ${Math.round(r.width)} × ${Math.round(r.height)} px : la ` +
        `boîte du système a été effacée par le className.`,
    ).toBeLessThanOrEqual(32);
    await expect(Math.round(r.width)).toBeLessThanOrEqual(160);
  },
};

export const BlocVertical: Story = {
  name: "Le bloc vertical, quand la largeur manque",
  globals: { marque: "adp" },
  render: () => (
    <div className="flex items-start gap-8">
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">horizontal</figcaption>
        <BrandMark brand="adp" className="h-10 max-w-[10rem]" />
      </figure>
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">vertical</figcaption>
        <BrandMark brand="adp" orientation="vertical" className="h-10 max-w-[10rem]" />
      </figure>
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">
          aikoz, sans bloc vertical
        </figcaption>
        <BrandMark brand="aikoz" orientation="vertical" className="h-10 max-w-[10rem]" />
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Beaucoup de chartes prévoient deux cadrages du même logo. Ce n'est " +
          "pas une variante décorative : c'est ce qui permet de poser la marque " +
          "là où la largeur manque.\n\n" +
          "Mesuré à 40 px de haut, le bloc horizontal du Groupe ADP demande " +
          "**116 px** de large, le vertical **47**. Dans une barre latérale de " +
          "240 px, l'écart décide si le nom du produit tient à côté.\n\n" +
          "Une marque sans bloc vertical retombe **silencieusement** sur son " +
          "bloc horizontal, et c'est voulu : contrairement à une version sombre " +
          "manquante — où reprendre le fichier clair donnerait une tache " +
          "illisible —, l'autre cadrage reste le logo validé par la marque. " +
          "Rien n'est à signaler.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const [h, v, repli] = [...canvasElement.querySelectorAll("figure")];
    const largeur = (f: Element) => {
      const img = [...f.querySelectorAll<HTMLImageElement>("img")].find(
        (i) => i.getBoundingClientRect().width > 0,
      )!;
      return Math.round(img.getBoundingClientRect().width);
    };

    // Le vertical est NETTEMENT plus étroit : c'est sa raison d'être.
    const lh = largeur(h);
    const lv = largeur(v);
    await expect(
      lv,
      `le bloc vertical fait ${lv} px contre ${lh} px pour l'horizontal : ` +
        `il ne gagne rien, donc il ne sert à rien.`,
    ).toBeLessThan(lh * 0.75);

    // Le repli rend bien QUELQUE CHOSE, et c'est le bloc horizontal d'Aikoz.
    const src = [...repli.querySelectorAll<HTMLImageElement>("img")].find(
      (i) => i.getBoundingClientRect().width > 0,
    )!.src;
    // `aikoz-clair` OU `aikoz-sombre` selon le thème : l'assertion nommait
    // le fichier clair, et tombait en sombre sur un composant parfaitement
    // correct. Ce qu'on veut prouver est que le repli rend le bloc d'AIKOZ,
    // et qu'il n'est pas allé chercher un bloc vertical qui n'existe pas.
    await expect(
      src,
      "Aikoz n'a pas de bloc vertical : le repli doit rendre son bloc " +
        "horizontal, pas rien.",
    ).toMatch(/aikoz-(clair|sombre)/);
    await expect(src).not.toMatch(/vertical/);
  },
};
