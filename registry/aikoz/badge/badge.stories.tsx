import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Composants/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Répondu" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Tons: Story = {
  name: "Les tons",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success" icon="✓">Répondu</Badge>
      <Badge tone="warning" icon="!">À surveiller</Badge>
      <Badge tone="error" icon="✕">Critique</Badge>
      <Badge tone="info" icon="i">Info</Badge>
      <Badge tone="neutral">Neutre</Badge>
    </div>
  ),
};

export const LIconeDoubleLaCouleur: Story = {
  name: "L'icône double la couleur",
  args: { tone: "error", icon: "✕", children: "Sans réponse" },
  parameters: {
    docs: {
      description: {
        story:
          "Le glyphe n'est pas un ornement : sans lui, l'état ne tiendrait qu'à la teinte, " +
          "ce qu'interdit WCAG 1.4.1. Le voile de fond, lui, ne compte pas — mesuré à " +
          "1,19:1 sur la carte, il est décoratif.",
      },
    },
  },
};
