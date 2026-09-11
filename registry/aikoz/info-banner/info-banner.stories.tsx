import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { InfoBanner } from "./info-banner";

const meta = {
  title: "Composants/InfoBanner",
  component: InfoBanner,
  tags: ["autodocs"],
  argTypes: { tone: { control: "inline-radio", options: ["info", "warning", "error"] } },
  args: {
    children:
      "Les réponses affichées ici tournent aléatoirement à chaque chargement : ce que vous voyez n'est pas un classement.",
  },
} satisfies Meta<typeof InfoBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const TroisTons: Story = {
  name: "Trois tons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Même correspondance ton → token que `Badge` : la bordure et l'icône portent " +
          "la couleur, le fond n'est qu'un voile à 8 %. **Une différence assumée avec " +
          "`Badge`** : ici le texte reste `--foreground`. Un badge est un mot court, " +
          "calé pour tenir 4,5:1 dans sa propre teinte ; un bandeau porte une ou deux " +
          "phrases, et la même remontée de ton sur un paragraphe n'a jamais été mesurée " +
          "à cette longueur. Mesuré sur le voile : le texte tient 15,03 à 16,71:1 " +
          "partout, les icônes 4,58 à 9,04:1.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <InfoBanner tone="info">Les réponses affichées tournent aléatoirement à chaque chargement.</InfoBanner>
      <InfoBanner tone="warning">Trois réponses publiées cette semaine s'écartent de la charte éditoriale.</InfoBanner>
      <InfoBanner tone="error">La collecte Google Business est interrompue depuis le 8 septembre.</InfoBanner>
    </div>
  ),
};

export const LIconeNePorteRien: Story = {
  name: "L'icône ne porte rien",
  args: { tone: "warning" },
  parameters: {
    docs: {
      description: {
        story:
          "Les trois glyphes par défaut sont `aria-hidden`. Le ton est déjà dans le " +
          "texte — c'est lui qui dit ce qui se passe. Une icône qui serait le SEUL " +
          "porteur du ton tomberait sous WCAG 1.4.1 ; ici elle ne fait que renforcer.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    await expect(svg).toHaveAttribute("aria-hidden", "true");
  },
};

export const CestUneRegionStatus: Story = {
  name: "C'est une région `status`, pas une alerte",
  parameters: {
    docs: {
      description: {
        story:
          "`role=\"status\"` : annonce non urgente. Un bandeau déjà présent au " +
          "chargement n'est de toute façon pas relu — la région live ne prend effet que " +
          "si le composant apparaît ou change après coup. `role=\"alert\"` " +
          "interromprait la lecture en cours, ce qui ne se justifie pas pour une règle " +
          "de fonctionnement énoncée AVANT que l'utilisateur agisse.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toBeInTheDocument();
  },
};

export const TexteLong: Story = {
  name: "Un texte long reste lisible",
  args: {
    children:
      "Depuis le 1er septembre, les réponses générées automatiquement sont programmées à J+1 et peuvent être corrigées jusqu'à leur publication. Passé ce délai, la correction passe par une nouvelle réponse publique, visible par le client au même titre que la première.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`text-balance` répartit les lignes plutôt que de laisser un mot orphelin en " +
          "dernière ligne. L'icône est calée en haut (`items-start`), pas centrée : " +
          "centrée verticalement sur cinq lignes, elle flotterait au milieu du " +
          "paragraphe sans se rattacher à son début.",
      },
    },
  },
};
