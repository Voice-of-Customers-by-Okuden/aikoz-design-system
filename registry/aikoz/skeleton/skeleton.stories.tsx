import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonText } from "./skeleton";

const meta = {
  title: "Composants/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Par défaut",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" className="size-10" />
        <div className="flex-1"><SkeletonText lines={2} /></div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  ),
};

export const MuetParChoix: Story = {
  name: "Muet pour les lecteurs d'écran, par choix",
  render: () => <Skeleton className="h-16 w-64" />,
  parameters: {
    docs: {
      description: {
        story:
          "Annoncer « rectangle gris » quatorze fois ne renseigne personne. C'est au " +
          "CONTENEUR de dire qu'un chargement est en cours, une fois, par `aria-busy` — " +
          "ce que fait `Table`. Le fond est sur `--track` et non `--muted` : en sombre ce " +
          "dernier vaut exactement `--card`, le squelette y serait invisible.",
      },
    },
  },
};
