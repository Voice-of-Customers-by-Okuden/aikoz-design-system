import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./empty-state";
import { Button } from "../button/button";

const meta = {
  title: "Composants/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Aucun avis sur cette période",
    description: "Élargissez la période d'analyse ou retirez le filtre par source.",
  },
  decorators: [(S) => <div className="w-[28rem]"><S /></div>],
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Par défaut",
  args: { action: <Button size="sm" variant="outline">Élargir à 90 jours</Button> },
};

export const IlNommeCeQuiManque: Story = {
  name: "Il nomme ce qui manque, et indique la sortie",
  args: { action: <Button size="sm">Créer une campagne</Button> },
  parameters: {
    docs: {
      description: {
        story:
          "« Aucun avis sur cette période », pas « Aucune donnée ». Et un état vide sans " +
          "action ni consigne est un cul-de-sac : l'utilisateur voit que rien ne s'affiche, " +
          "sans savoir si c'est normal, si ça va arriver, ou s'il a mal réglé quelque chose.",
      },
    },
  },
};

export const TonErreur: Story = {
  name: "Ton erreur",
  args: {
    tone: "error",
    title: "Le chargement a échoué",
    description: "La source Google n'a pas répondu. Réessayez dans un instant.",
    action: <Button size="sm" variant="outline">Réessayer</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Le fond pâle est DÉCORATIF — 1,10:1 sur la carte. L'état est porté par le trait " +
          "ET par le texte, jamais par cette teinte.",
      },
    },
  },
};
