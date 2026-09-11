import type { Meta, StoryObj } from "@storybook/react-vite";
import { KpiCard } from "./kpi-card";

const meta = {
  title: "Données/KpiCard",
  component: KpiCard,
  tags: ["autodocs"],
  args: { label: "Taux de réponse", value: 87, unit: "%", variant: "target", target: 90 },
  decorators: [(S) => <div className="w-72"><S /></div>],
} satisfies Meta<typeof KpiCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const DeuxAxesIndependants: Story = {
  name: "Deux axes : variant × density",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <KpiCard className="w-52" label="Note moyenne" value={4.2} max={5} variant="rating" />
      <KpiCard className="w-52" label="Taux de réponse" value={87} unit="%" variant="target" target={90} />
      <KpiCard className="w-52" label="Avis traités" value={312} variant="trend" data={[4, 6, 5, 8, 7, 9]} trend={18} />
      <KpiCard className="w-52" label="Délai de réponse" value={6} unit="h" variant="raw" />
    </div>
  ),
};

export const LeNiveauVientDeLObjectif: Story = {
  name: "Le niveau vient de l'objectif, pas du maximum",
  args: { label: "Taux de réponse", value: 87, unit: "%", variant: "target", target: 90 },
  parameters: {
    docs: {
      description: {
        story:
          "87 sur un objectif de 90, c'est 97 % de l'objectif — donc « bon ». Rapporté à " +
          "un maximum de 100, ce serait « à surveiller ». Le niveau se calcule sur " +
          "`value/target`, jamais sur `value/max` : sinon un objectif atteint à 97 % " +
          "s'afficherait en alerte.",
      },
    },
  },
};
