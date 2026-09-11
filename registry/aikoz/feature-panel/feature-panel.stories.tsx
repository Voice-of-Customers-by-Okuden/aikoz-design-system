import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FeaturePanel } from "./feature-panel";

const meta = {
  title: "Site/FeaturePanel",
  component: FeaturePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Quatre leviers",
    intro: "Ce que le pilotage des avis change vraiment, une fois branché sur vos données.",
    features: [
      { metric: "×3", title: "Taux de réponse", description: "Les agences pilotées répondent trois fois plus vite." },
      { metric: "48 h", title: "Détection des signaux", description: "Un décrochage local est remonté avant qu'il ne devienne une tendance." },
      { metric: "12", title: "Sources unifiées", description: "Une seule note, un seul verbatim de référence." },
      { metric: "0", title: "Ressaisie", description: "Les tableaux de bord se branchent sur l'existant." },
    ],
  },
} satisfies Meta<typeof FeaturePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LePlanSeDeduit: Story = {
  name: "Le plan se déduit, il ne se saisit pas deux fois",
  args: { headingLevel: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent("Quatre leviers");
    // Les titres de leviers prennent le niveau SUIVANT, automatiquement.
    await expect(canvas.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    // Une `ul`, pas une grille de div : « quatre leviers » n'est pas une
    // figure de style, un lecteur d'écran annonce « liste de 4 éléments ».
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
  },
  parameters: {
    docs: {
      description: {
        story:
          "L'appelant donne le niveau du titre de SECTION ; les titres de leviers prennent " +
          "le suivant, plafonné à h6. On ne peut donc pas sauter un niveau, c'est " +
          "arithmétique — c'est le cas classique d'une section en h2 avec des cartes en h4 " +
          "parce que quelqu'un a choisi le niveau à l'apparence.",
      },
    },
  },
};
