import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoMarquee } from "./logo-marquee";
import { BRANDS } from "../brand-logo/brands";

const meta = {
  title: "Marques/LogoMarquee",
  component: LogoMarquee,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Assureurs analysés par Aikoz",
    showLabel: true,
    brands: BRANDS.map((b) => b.id),
  },
} satisfies Meta<typeof LogoMarquee>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const IlNeDefilePas: Story = {
  name: "Il ne défile pas, et c'est le sujet",
  parameters: {
    docs: {
      description: {
        story:
          "WCAG 2.2.2 impose un moyen de mettre en pause tout mouvement de plus de cinq " +
          "secondes : donc un bouton, un état, un arrêt de tabulation de plus — pour une " +
          "décoration. Et le mouvement perpétuel gêne réellement, sans rien apporter : la " +
          "preuve, ce sont les marques, pas leur déplacement. Le bandeau passe à la ligne, " +
          "ce qui règle le reflow au passage.",
      },
    },
  },
};
