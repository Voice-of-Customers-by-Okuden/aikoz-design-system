import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SiteNav } from "./site-nav";
import { Button } from "../button/button";

const meta = {
  title: "Site/SiteNav",
  component: SiteNav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    links: [
      { label: "Notre solution", href: "#solution", current: true },
      { label: "Secteurs", href: "#secteurs" },
      { label: "Ressources", href: "#ressources" },
    ],
    actions: <Button size="sm">Demander une démo</Button>,
  },
} satisfies Meta<typeof SiteNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LeLienDEvitementEstIci: Story = {
  name: "Le lien d'évitement est ici, et pas ailleurs",
  play: async ({ canvas }) => {
    const entete = canvas.getByRole("banner");
    const premier = entete.querySelector("a,button");
    await expect(premier).toHaveTextContent("Aller au contenu");
  },
  parameters: {
    docs: {
      description: {
        story:
          "WCAG 2.4.1 veut qu'il soit le PREMIER élément focusable de la page — un " +
          "composant rendu plus bas ne peut donc pas le fournir. Il est hors écran tant " +
          "qu'il n'a pas le focus, puis s'affiche : `sr-only` seul ne suffirait pas, il " +
          "resterait invisible une fois focalisé.",
      },
    },
  },
};

export const MenuMobile: Story = {
  name: "Le menu mobile est un disclosure, pas une modale",
  globals: { viewport: { value: "mobile1" } },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Il ne piège pas le focus et ne masque pas le reste du document : ce n'est pas " +
          "un dialogue, c'est une liste qu'on déplie. Échap le ferme et rend le focus au " +
          "bouton. Menu fermé = attribut `hidden`, donc hors tabulation.",
      },
    },
  },
};
