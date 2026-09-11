import type { Meta, StoryObj } from "@storybook/react-vite";
import { Leaderboard } from "./leaderboard";

const meta = {
  title: "Données/Leaderboard",
  component: Leaderboard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    caption: "Taux de réponse aux avis, 30 derniers jours",
    valueLabel: "Taux de réponse",
    entries: [
      { id: "1", rank: 1, name: "Lyon Part-Dieu", code: "LYO-PDX", organization: "Réseau Sud-Est", brand: "axa", value: "94 %", delta: 2 },
      { id: "2", rank: 2, name: "Paris Opéra", code: "PAR-OPE", organization: "Réseau Île-de-France", brand: "generali", value: "91 %", delta: 5 },
      { id: "3", rank: 3, name: "Bordeaux Chartrons", code: "BDX-CHA", organization: "Réseau Sud-Ouest", brand: "maif", value: "88 %", delta: -1 },
      { id: "4", rank: 4, name: "Marseille Prado", code: "MRS-PRA", organization: "Réseau Sud-Est", brand: "macif", value: "84 %", delta: 0, highlighted: true },
      { id: "5", rank: 5, name: "Lille Grand Place", code: "LIL-GPL", organization: "Réseau Nord", brand: "matmut", value: "79 %", delta: -3 },
    ],
  },
} satisfies Meta<typeof Leaderboard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LePodiumNeTientPasALaCouleur: Story = {
  name: "Le podium ne tient pas à la couleur",
  parameters: {
    docs: {
      description: {
        story:
          "L'or, l'argent et le bronze n'étaient pas maquettés — le composant Figma " +
          "n'expose que `Default` et `Highlight`. Produits ici depuis la spec, ils sont " +
          "doublés : la pastille métallique porte le CHIFFRE du rang, et son nom complet " +
          "est dit en `sr-only`. Ces trois teintes ne passent pas par les tokens : ce sont " +
          "des références à des métaux, pas des couleurs d'interface. Et il n'y a pas de " +
          "`RankRow` exporté — une ligne qui n'a de sens que dans son tableau est un rendu " +
          "de cellule, pas un composant.",
      },
    },
  },
};
