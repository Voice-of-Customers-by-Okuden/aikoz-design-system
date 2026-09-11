import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NavItem } from "./nav-item";

const meta = {
  title: "Navigation/NavItem",
  component: NavItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Campagnes", href: "#campagnes" },
  decorators: [(S) => <div className="w-56 rounded-lg bg-[var(--nav-surface)] p-2"><S /></div>],
} satisfies Meta<typeof NavItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Courant: Story = { name: "Entrée courante", args: { current: true, label: "Marché" } };

export const AvecCompteur: Story = {
  name: "Avec compteur",
  args: { count: 3 },
  play: async ({ canvas }) => {
    // Le compte est dans le NOM du lien, en une seule chaîne : un `sr-only`
    // séparé donnait « Campagnes , 3 en attente » — l'algorithme de nom
    // accessible joint les éléments par une espace.
    await expect(canvas.getByRole("link")).toHaveAccessibleName("Campagnes, 3 en attente");
  },
  parameters: {
    docs: {
      description: {
        story:
          "La pastille est muette pour les lecteurs d'écran : sans le compte dans le nom, " +
          "le nombre n'est qu'une tache colorée que rien n'annonce.",
      },
    },
  },
};

export const UnLienJamaisUnBouton: Story = {
  name: "Un `<a>`, jamais un `<button>`",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link")).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cette entrée CHANGE DE ROUTE. Un bouton s'annonce comme une action dans la " +
          "page, ce qui trompe sur ce qui va se passer, et prive l'utilisateur de tout ce " +
          "qu'un lien lui doit : ouvrir dans un onglet, copier l'adresse, revenir en " +
          "arrière.",
      },
    },
  },
};
