import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
// `?raw` : la page de doc montre le fichier RÉEL, pas une copie qui
// divergerait. C'est ce que « Copy code » met dans le presse-papier.
import source from "./matrice-habilitation.tsx?raw";
import { MatriceHabilitation, ROLES } from "./matrice-habilitation";

// ─── Storybook ───────────────────────────────────────────────────────────────

const meta = {
  title: "Assemblages/Matrice d'habilitation",
  component: MatriceHabilitation,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: source, language: "tsx" } },
  },
  args: { modifiable: true },
  // La marque est un global de barre d'outils, plus un décorateur maison :
  // celui-ci la posait sur la racine et la retirait au démontage, et le
  // nettoyage arrivait après le montage de l'histoire suivante.
  globals: { marque: "adp" },
  decorators: [
    (S) => (
      <div className="min-w-0 max-w-5xl p-4">
        <S />
      </div>
    ),
  ],
} satisfies Meta<typeof MatriceHabilitation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Modifiable: Story = {
  name: "Modifiable — marque ADP, thème clair",
  globals: { theme: "clair" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Chaque case porte SON nom, déduit de sa ligne et de sa colonne.
    await expect(
      c.getByRole("switch", { name: "Réponse aux avis pour Directeur" }),
    ).toBeInTheDocument();

    // On lit le nom par l'étiquette ASSOCIÉE, pas par `aria-label` : `Switch`
    // rend un vrai `<label for>`, et `getAttribute("aria-label")` rendait
    // `null` vingt-quatre fois — soit un seul nom distinct, et une assertion
    // qui mesurait mon erreur au lieu du composant.
    const noms = c
      .getAllByRole("switch")
      .map(
        (s) => (s as HTMLInputElement).labels?.[0]?.textContent?.trim() ?? "",
      );
    await expect(noms).toHaveLength(24);

    // ── Ce que coûtent deux colonnes homonymes ────────────────────────────
    //
    // Leur maquette nomme DEUX colonnes « RÔLE 6 ». Le nom d'une case est
    // déduit de sa ligne et de sa colonne : quatre paires de cases portent
    // donc le même nom et désignent des droits différents. Au lecteur
    // d'écran comme au relecteur, elles sont indiscernables.
    //
    // Ce test ne tombe pas : il MESURE le coût, pour qu'il soit chiffré dans
    // la conversation avec ADP plutôt qu'observé le jour de la recette.
    // ── Les colonnes de rôles font la même largeur ────────────────────────
    //
    // Elles portent le MÊME contenu — un interrupteur — donc une différence
    // de largeur se lit comme une différence de sens. En `layout="auto"`,
    // la largeur suivait la longueur de l'intitulé : mesuré 165 px pour
    // « Gestionnaire POI » contre 84 px pour « Rôle 5 ».
    const entetes = [...canvasElement.querySelectorAll("thead th")].slice(1);
    const largeurs = entetes.map((t) =>
      Math.round(t.getBoundingClientRect().width),
    );
    const ecart = Math.max(...largeurs) - Math.min(...largeurs);
    await expect(
      ecart,
      `les colonnes de rôles mesurent ${largeurs.join(" · ")} px : elles ` +
        `portent le même contenu et doivent donc avoir la même largeur.`,
    ).toBeLessThanOrEqual(1);

    // ── Les en-têtes s'alignent ───────────────────────────────────────────
    //
    // Collé au bas de sa cellule, un libellé qui passe sur deux lignes pousse
    // son pictogramme vers le haut : mesuré 18 px d'écart entre
    // « Gestionnaire POI » et « Directeur », et une rangée d'icônes en
    // escalier. Aligné en haut, les six pictogrammes forment une ligne.
    const tops = entetes.map((t) => {
      const sp = [...t.querySelectorAll("span")];
      return Math.round(sp[0].getBoundingClientRect().top);
    });
    await expect(
      Math.max(...tops) - Math.min(...tops),
      `les pictogrammes d'en-tête sont à ${tops.join(" · ")} px : ils doivent ` +
        `former une ligne, pas un escalier.`,
    ).toBeLessThanOrEqual(1);

    const distincts = new Set(noms).size;
    await expect(
      distincts,
      `${noms.length - distincts} cases indiscernables : deux colonnes ` +
        `portent le même intitulé dans la maquette.`,
    ).toBe(20);
  },
};

export const LesNomsCorriges: Story = {
  name: "Une fois les colonnes nommées",
  args: {
    roles: ROLES.map((r, i) => (i === 5 ? { ...r, label: "Rôle 7" } : r)),
  },
  globals: { theme: "clair" },
  parameters: {
    docs: {
      description: {
        story:
          "La même matrice une fois les six colonnes nommées. Les vingt-quatre " +
          "cases redeviennent distinctes.\n\n" +
          "« Rôle 5 », « Rôle 6 » et « Rôle 7 » sont des réservations : les " +
          "vrais noms appartiennent à ADP, et c'est la seule chose qui manque " +
          "pour que cet écran soit livrable.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const noms = within(canvasElement)
      .getAllByRole("switch")
      .map(
        (s) => (s as HTMLInputElement).labels?.[0]?.textContent?.trim() ?? "",
      );
    await expect(new Set(noms).size).toBe(24);
  },
};

export const LectureSeule: Story = {
  name: "Consultable — marque ADP, thème clair",
  args: { modifiable: false },
  globals: { theme: "clair" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Aucun interrupteur : ce qui ne se change pas ne se présente pas comme
    // un contrôle.
    await expect(c.queryAllByRole("switch")).toHaveLength(0);
    await expect(
      c.getByText("Réponse aux avis pour Directeur"),
    ).toBeInTheDocument();
  },
};
