import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { DonutChart } from "./donut-chart";

const meta = {
  title: "Graphiques/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [(S) => <div className="w-[26rem]"><S /></div>],
  args: {
    caption: "Répartition des avis par source",
    centerValue: "1 654",
    centerLabel: "avis",
    parts: [
      { key: "google", label: "Google", value: 1240 },
      { key: "trustpilot", label: "Trustpilot", value: 318 },
      { key: "pj", label: "Pages Jaunes", value: 96 },
    ],
  },
} satisfies Meta<typeof DonutChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LePourcentageEstEcrit: Story = {
  name: "Le pourcentage est écrit, pas seulement dessiné",
  play: async ({ canvas }) => {
    // La légende porte le chiffre : au-delà de quatre parts, ou dès que deux
    // sont proches, l'œil ne compare pas des angles.
    await expect(canvas.getByText(/Google · 75 %/)).toBeInTheDocument();
    // Un seul `role="img"` : celui de la coque, qui porte le résumé.
    await expect(canvas.getByRole("img")).toHaveAccessibleName(/Google 75 %/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Un anneau se lit mal : l'œil compare des longueurs bien mieux que des angles. " +
          "Au-delà de quatre parts, préférer une barre horizontale. Ce qu'un anneau garde " +
          "de mieux, c'est qu'il montre un TOUT — d'où le chiffre au centre, souvent la " +
          "seule information retenue.",
      },
    },
  },
};
