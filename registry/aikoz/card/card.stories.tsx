import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card";

const meta = {
  title: "Composants/Card",
  component: Card,
  tags: ["autodocs"],
  args: { children: "Contenu de la carte" },
  decorators: [(S) => <div className="w-72"><S /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Surfaces: Story = {
  name: "Les trois surfaces",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card surface="raised" className="w-48">raised</Card>
      <Card surface="flat" className="w-48">flat</Card>
      <Card surface="bare" className="w-48">bare</Card>
    </div>
  ),
};

export const PasDeCardTitle: Story = {
  name: "Pas de `CardTitle`, délibérément",
  args: { as: "article", children: "Une carte rendue en <article>" },
  parameters: {
    docs: {
      description: {
        story:
          "Un `CardTitle` figerait un `h3` et casserait la hiérarchie dès qu'une carte est " +
          "utilisée ailleurs : le niveau de titre dépend du plan de la PAGE, pas de la " +
          "carte. Le prop `as` est sémantique et non décoratif — un avis autonome sort en " +
          "`article`, une section nommée en `section`, et ça change les repères de " +
          "navigation d'un lecteur d'écran.",
      },
    },
  },
};
