import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeltaBadge } from "./delta-badge";

const meta = {
  title: "Composants/DeltaBadge",
  component: DeltaBadge,
  tags: ["autodocs"],
  args: { value: 12 },
} satisfies Meta<typeof DeltaBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const TroisSignes: Story = {
  name: "Hausse, baisse, stable",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <DeltaBadge value={12} />
      <DeltaBadge value={-8} />
      <DeltaBadge value={0} />
    </div>
  ),
};

export const ZeroNestPasUneHausse: Story = {
  name: "Zéro n'est ni une hausse ni une baisse",
  args: { value: 0 },
  parameters: {
    docs: {
      description: {
        story:
          "L'état neutre existe parce que rendre zéro en vert ou en rouge affirme un " +
          "mouvement qui n'a pas eu lieu. La flèche disparaît, le signe aussi.",
      },
    },
  },
};
