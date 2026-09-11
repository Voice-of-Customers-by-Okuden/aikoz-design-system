import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ViewTabs } from "./view-tabs";

const onglets = [
  { value: "synthese", label: "Synthèse", content: <p className="m-0 text-sm text-muted-foreground">Panneau « Synthèse ».</p> },
  { value: "detail", label: "Détail", content: <p className="m-0 text-sm text-muted-foreground">Panneau « Détail ».</p> },
  { value: "export", label: "Export", content: <p className="m-0 text-sm text-muted-foreground">Panneau « Export ».</p> },
  { value: "archive", label: "Archive", disabled: true, content: <p className="m-0">Inatteignable.</p> },
];

const meta = {
  title: "Navigation/ViewTabs",
  component: ViewTabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Vues du classement", tabs: onglets },
  decorators: [(S) => <div className="w-[32rem]"><S /></div>],
} satisfies Meta<typeof ViewTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const ClavierEtTabindexTournant: Story = {
  name: "Flèches, Début/Fin, et tabindex tournant",
  play: async ({ canvas, userEvent }) => {
    const tabs = canvas.getAllByRole("tab");
    // Un seul onglet dans l'ordre de tabulation : sans ça il faudrait dix
    // tabulations pour traverser dix onglets avant d'atteindre leur contenu.
    await expect(tabs.filter((t) => t.tabIndex === 0)).toHaveLength(1);

    tabs[0].focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Détail" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{End}");
    // `Fin` saute l'onglet désactivé : traverser ce qu'on ne peut pas
    // atteindre n'aurait pas de sens.
    await expect(canvas.getByRole("tab", { name: "Export" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Synthèse" })).toHaveAttribute("aria-selected", "true");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Le tabindex tournant est ce qui distingue une barre d'onglets d'une rangée de " +
          "boutons. Les flèches bouclent, `Début`/`Fin` vont aux extrémités, et les " +
          "onglets désactivés sont sautés.",
      },
    },
  },
};

export const ActivationManuelle: Story = {
  name: "Activation manuelle : le focus bouge, pas la sélection",
  args: { activation: "manual", label: "Vues à chargement différé" },
  play: async ({ canvas, userEvent }) => {
    const tabs = canvas.getAllByRole("tab");
    tabs[0].focus();
    await userEvent.keyboard("{ArrowRight}");
    // La flèche déplace le FOCUS sans changer la sélection.
    await expect(tabs[1]).toHaveFocus();
    await expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    await expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  },
  parameters: {
    docs: {
      description: {
        story:
          "À réserver aux panneaux qui déclenchent un chargement : en automatique, " +
          "traverser cinq onglets lancerait cinq requêtes dont quatre inutiles.",
      },
    },
  },
};

export const CestLeComportementQuiDecide: Story = {
  name: "C'est le comportement qui décide, jamais l'apparence",
  parameters: {
    docs: {
      description: {
        story:
          "Ce composant échange un panneau et laisse la route inchangée. Un « onglet » qui " +
          "change de route est un lien stylé en onglet : il relève de `SidebarNav`. Lui " +
          "donner `role=\"tab\"` annonce à un lecteur d'écran un panneau qui va s'échanger, " +
          "alors que la page entière va être remplacée. C'est un des défauts d'accessibilité " +
          "les plus répandus.",
      },
    },
  },
};
