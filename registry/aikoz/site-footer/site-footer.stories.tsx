import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SiteFooter } from "./site-footer";

const meta = {
  title: "Site/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    tagline: "Le pilotage des avis clients pour les réseaux d'assurance, d'assistance et de mobilité.",
    groups: [
      { label: "Solution", links: [{ label: "Tableau de bord", href: "#tb" }, { label: "Alertes", href: "#al" }] },
      { label: "Secteurs", links: [{ label: "Assurance", href: "#as" }, { label: "Mobilité", href: "#mo" }] },
      { label: "Ressources", links: [{ label: "Études", href: "#et" }, { label: "Documentation", href: "#doc", external: true }] },
    ],
    legal: [{ label: "Mentions légales", href: "#ml" }, { label: "Confidentialité", href: "#cf" }],
  },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const ZeroTitreDansLePlan: Story = {
  name: "Zéro titre dans le plan du document",
  play: async ({ canvas }) => {
    const pied = canvas.getByRole("contentinfo");
    // Les intitulés de colonne nomment leur liste par `aria-labelledby`, ils
    // n'entrent pas dans l'outline : un pied de page n'a pas à le peupler.
    await expect(pied.querySelectorAll("h1,h2,h3,h4,h5,h6")).toHaveLength(0);
    await expect(pied.querySelectorAll("ul[aria-labelledby]")).toHaveLength(3);
    // Un lien vers un nouvel onglet le dit dans son nom accessible.
    await expect(canvas.getByRole("link", { name: /nouvel onglet/ })).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Un `<footer>` en fin de document est un repère `contentinfo` sans qu'on " +
          "l'écrive — à condition de n'être imbriqué dans aucun `<article>` ni " +
          "`<section>`. C'est une des rares balises où le placement change le rôle.",
      },
    },
  },
};
