import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SidebarNav } from "./sidebar-nav";

const meta = {
  title: "Navigation/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Navigation principale",
    current: "marche",
    groups: [
      { label: "Pilotage", entries: [
        { id: "marche", label: "Marché", href: "#marche" },
        { id: "campagnes", label: "Campagnes", href: "#campagnes", count: 3 },
        { id: "hall", label: "Hall of Fames", href: "#hall" },
      ]},
      { label: "Configuration", entries: [{ id: "params", label: "Paramètres", href: "#params" }] },
    ],
  },
  decorators: [(S) => <div className="flex w-[36rem] overflow-hidden rounded-lg border border-border"><S /><div className="flex-1 bg-background p-5 text-sm text-muted-foreground">Zone de contenu</div></div>],
} satisfies Meta<typeof SidebarNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const TroisCanauxPourLEtatCourant: Story = {
  name: "L'état courant tient sur trois canaux",
  play: async ({ canvas }) => {
    const courant = canvas.getByRole("link", { name: /Marché/ });
    await expect(courant).toHaveAttribute("aria-current", "page");
    // Le compteur est intégré au nom du lien : sans ça, le nombre n'est
    // qu'une tache colorée que rien n'annonce.
    await expect(canvas.getByRole("link", { name: /Campagnes, 3 en attente/ })).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "`aria-current=\"page\"`, un trait vertical en `--nav-accent` (5,77:1 clair, " +
          "15,08:1 sombre) et la graisse. Le voile de fond ne compte pas dans le lot : " +
          "1,19:1 en clair, 1,07 en sombre — même piège que le survol des boutons.",
      },
    },
  },
};

export const PasLeMemeContratQueViewTabs: Story = {
  name: "Pas le même contrat que ViewTabs",
  parameters: {
    docs: {
      description: {
        story:
          "Cette barre navigue entre SECTIONS : elle change la route, donc des liens dans " +
          "un `<nav>`, `aria-current=\"page\"`, tabulation lien après lien. `ViewTabs` " +
          "échange un panneau dans la page : `role=\"tablist\"`, `aria-selected`, flèches. " +
          "Ils partagent les tokens, pas le code — mutualiser ferait fuiter la mauvaise " +
          "sémantique. Ce composant ne gère ni repli en icônes ni tiroir mobile : cela " +
          "dépend du gabarit de page, pas de la barre.",
      },
    },
  },
};
