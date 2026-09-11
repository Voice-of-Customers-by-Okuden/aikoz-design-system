import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { DateRangePicker } from "./date-range-picker";

const meta = {
  title: "Formulaires/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Période d'analyse", defaultValue: { preset: "30j" } },
} satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const PlagePersonnalisee: Story = {
  name: "Plage personnalisée",
  args: {
    label: "Période de comparaison",
    defaultValue: { preset: "custom", from: "2026-01-01", to: "2026-03-31" },
  },
  parameters: {
    docs: {
      description: {
        story:
          "`Intl` rend « 1 janvier ». Personne ne l'écrit ni ne le lit ainsi, y compris un " +
          "lecteur d'écran — d'où « 1er janvier ».",
      },
    },
  },
};

export const LeNomPorteLaValeur: Story = {
  name: "Le nom du déclencheur porte la valeur",
  play: async ({ canvas }) => {
    const bouton = canvas.getByRole("button");
    // « Période d'analyse, 30 derniers jours ». Sans la valeur, il faudrait
    // ouvrir le panneau pour savoir ce qui est sélectionné.
    await expect(bouton).toHaveAccessibleName(/Période d'analyse/);
    await expect(bouton).toHaveAccessibleName(/30 derniers jours/);
  },
};

export const PasDeCalendrier: Story = {
  name: "Pas de calendrier, délibérément",
  parameters: {
    docs: {
      description: {
        story:
          "Sur un tableau de bord, la quasi-totalité des sélections tombe sur un " +
          "préréglage. Une grille ARIA correcte demande un clavier à deux dimensions, " +
          "PageUp/Down pour les mois, une sélection en deux temps et une région live à " +
          "chaque déplacement — beaucoup de surface pour le cas rare. Les préréglages sont " +
          "de vrais boutons radio (« 2 sur 5 » à l'annonce) ; la saisie libre passe par " +
          "deux `<input type=\"date\">` natifs, qui ouvrent le sélecteur du système sur " +
          "mobile.",
      },
    },
  },
};
