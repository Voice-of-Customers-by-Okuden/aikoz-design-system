import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ReplyBubble } from "./reply-bubble";

const meta = {
  title: "Composants/ReplyBubble",
  component: ReplyBubble,
  tags: ["autodocs"],
  argTypes: {
    origin: { control: "inline-radio", options: ["ai", "operator"] },
    loading: { control: "boolean" },
    showOrigin: { control: "boolean" },
  },
  args: {
    origin: "ai",
    children:
      "Merci pour votre retour. Nous sommes ravis que votre passage en agence se soit bien déroulé.",
  },
} satisfies Meta<typeof ReplyBubble>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const DeuxOrigines: Story = {
  name: "Deux origines",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "L'origine n'est jamais portée par la couleur : le pictogramme est " +
          "`aria-hidden`, c'est le libellé « IA » ou « Opérateur », écrit en toutes " +
          "lettres, qui porte l'information (WCAG 1.4.1). Le nom de l'opérateur " +
          "s'ajoute à côté quand il est connu.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <ReplyBubble origin="ai">Merci pour votre retour, nous sommes ravis de votre visite.</ReplyBubble>
      <ReplyBubble origin="operator" operatorName="Camille D.">
        Bonjour, je reprends votre dossier personnellement — je vous rappelle demain matin.
      </ReplyBubble>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("IA")).toBeInTheDocument();
    await expect(canvas.getByText("Opérateur")).toBeInTheDocument();
    await expect(canvas.getByText("Camille D.")).toBeInTheDocument();
  },
};

export const EnCoursDeGeneration: Story = {
  name: "En cours de génération",
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          "Le squelette est muet aux technologies d'assistance — c'est donc le " +
          "conteneur qui porte `aria-busy`. Sans lui, un lecteur d'écran annoncerait une " +
          "bulle vide sans dire qu'elle se remplit.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[aria-busy='true']")).toBeInTheDocument();
  },
};

export const ElleEstSubordonneeALaCarte: Story = {
  name: "Elle est subordonnée à la carte qui l'accueille",
  parameters: {
    docs: {
      description: {
        story:
          "Pas de bordure complète ni d'ombre : un simple liseré à gauche sur fond " +
          "`--muted`, le traitement « citation en creux ». Une bulle avec sa propre " +
          "carte rivaliserait visuellement avec l'avis auquel elle répond, alors " +
          "qu'elle en dépend.",
      },
    },
  },
};

export const OrigineMasquee: Story = {
  name: "Origine masquée — quand le texte seul compte",
  args: { showOrigin: false },
  parameters: {
    docs: {
      description: {
        story:
          "Utilisé par `ResponseKanban` dans la relecture d'une réponse hors charte : " +
          "ce qui compte alors est le texte non conforme, pas qui l'a écrit. C'est une " +
          "exception motivée par le contexte, pas un réglage par défaut.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("IA")).not.toBeInTheDocument();
  },
};
