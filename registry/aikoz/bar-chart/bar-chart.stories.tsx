import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { BarChart } from "./bar-chart";

const meta = {
  title: "Graphiques/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [(S) => <div className="w-[44rem]"><S /></div>],
  args: {
    caption: "Avis reçus par source et par trimestre",
    xKey: "trim",
    xLabel: "Trimestre",
    series: [
      { key: "google", label: "Google" },
      { key: "trustpilot", label: "Trustpilot" },
      { key: "pj", label: "Pages Jaunes" },
    ],
    data: [
      { trim: "T1", google: 820, trustpilot: 210, pj: 64 },
      { trim: "T2", google: 940, trustpilot: 268, pj: 71 },
      { trim: "T3", google: 1120, trustpilot: 302, pj: 58 },
      { trim: "T4", google: 1240, trustpilot: 318, pj: 96 },
    ],
  },
} satisfies Meta<typeof BarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empile: Story = { name: "Empilé" };

export const LeTotalALaColonne: Story = {
  name: "En empilé, le total a sa colonne",
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Voir les données"));
    await expect(canvas.getByRole("columnheader", { name: "Total" })).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empilé, on lit bien le total mais mal chaque part — sauf la première, qui seule " +
          "part de zéro. Le total est donc l'information que l'empilement met en avant : " +
          "il a sa colonne dans le tableau équivalent.",
      },
    },
  },
};

export const Horizontal: Story = {
  name: "Horizontal, trié — l'ex-RankedBarChart",
  args: {
    caption: "Classement des agences par taux de réponse",
    xKey: "agence",
    xLabel: "Agence",
    orientation: "horizontal",
    layout: "grouped",
    formatValue: (v: string | number) => `${v} %`,
    series: [{ key: "taux", label: "Taux de réponse" }],
    data: [
      { agence: "Lyon Part-Dieu", taux: 94 },
      { agence: "Paris Opéra", taux: 91 },
      { agence: "Bordeaux Chartrons", taux: 88 },
      { agence: "Marseille Prado", taux: 84 },
      { agence: "Lille Grand Place", taux: 79 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Il n'y a pas de `RankedBarChart` : c'est ce composant, horizontal, trié, à une " +
          "série. L'horizontal est indispensable dès que les libellés sont longs.",
      },
    },
  },
};

export const LaTrameEstLeSecondCanal: Story = {
  name: "Le second canal d'un aplat est une trame",
  parameters: {
    docs: {
      description: {
        story:
          "Une barre n'a pas de tracé où poser un pointillé. Hachures, points, " +
          "quadrillage — même rôle et même ordre fixe que les tracés des courbes, pour " +
          "qu'une série garde son identité d'un type de graphique à l'autre. Et un " +
          "séparateur de 2 px entre segments empilés : deux teintes voisines " +
          "fusionneraient sinon en un seul bloc.",
      },
    },
  },
};
