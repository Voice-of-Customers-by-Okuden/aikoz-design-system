import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Breadcrumb } from "./breadcrumb";

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    items: [
      { label: "Tableau de bord", href: "#tb" },
      { label: "Hall of Fames", href: "#hof" },
      { label: "Lyon Part-Dieu" },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LeDernierNestPasUnLien: Story = {
  name: "Le dernier élément n'est pas un lien",
  play: async ({ canvas }) => {
    const liens = canvas.getAllByRole("link");
    await expect(liens).toHaveLength(2);
    const courant = canvas.getByText("Lyon Part-Dieu");
    await expect(courant).toHaveAttribute("aria-current", "page");
    await expect(courant.closest("a")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "C'est la faute la plus courante du motif : rendre la page courante cliquable " +
          "produit un lien qui ne mène nulle part, et prive `aria-current=\"page\"` de son " +
          "support. Les séparateurs sont `aria-hidden` — la liste ordonnée dit déjà la " +
          "profondeur.",
      },
    },
  },
};
