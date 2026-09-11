import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Stepper } from "./stepper";

const meta = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    current: 2,
    steps: [
      { label: "Établissement", href: "#s1" },
      { label: "Sources", href: "#s2" },
      { label: "Périmètre" },
      { label: "Coordonnées" },
      { label: "Confirmation" },
    ],
  },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LeCompteEstEcrit: Story = {
  name: "« Étape 3 sur 5 » est écrit, pas seulement dessiné",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toHaveAccessibleName(/étape 3 sur 5/i);
    // Une étape à venir n'est jamais un lien : un tunnel se remonte, il ne se
    // saute pas.
    await expect(canvas.getAllByRole("link")).toHaveLength(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Sans ce compte, un lecteur d'écran entend cinq intitulés sans savoir où il en " +
          "est ni combien il en reste — les pastilles numérotées ne lui disent rien. C'est " +
          "l'erreur de la quasi-totalité des tunnels de commande.",
      },
    },
  },
};
