import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "Formulaires/Input",
  component: Input,
  tags: ["autodocs"],
  args: { label: "Nom de l'agence" },
  decorators: [(S) => <div className="w-80"><S /></div>],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const LeLibelleEstObligatoire: Story = {
  name: "Le libellé est obligatoire",
  args: { placeholder: "Lyon Part-Dieu" },
  parameters: {
    docs: {
      description: {
        story:
          "`label` est un prop requis, pas une option. Un `placeholder` n'est pas un " +
          "libellé : il disparaît à la saisie, laissant l'utilisateur sans repère sur ce " +
          "qu'il est en train de remplir.",
      },
    },
  },
};

export const LaConsigneArriveAvant: Story = {
  name: "La consigne arrive AVANT le champ",
  args: {
    label: "Code postal",
    description: "Cinq chiffres, sans espace.",
    inputMode: "numeric",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Placée après le champ, elle arrive trop tard : l'utilisateur a déjà saisi.",
      },
    },
  },
};

export const LErreurDitCommentCorriger: Story = {
  name: "L'erreur dit comment corriger",
  args: {
    label: "Adresse e-mail",
    type: "email",
    required: true,
    defaultValue: "camille.brun",
    error: "L'adresse doit contenir un domaine, par exemple camille.brun@neoassur.fr",
  },
  parameters: {
    docs: {
      description: {
        story:
          "« Champ invalide » ne dit rien. Le message nomme le problème ET la correction " +
          "attendue, et il est annoncé en `role=\"alert\"` puisqu'il apparaît après coup.",
      },
    },
  },
};

export const LectureSeuleEnTirete: Story = {
  name: "Lecture seule : un trait tireté, pas un fond",
  args: { label: "Identifiant", defaultValue: "AG-4417", readOnly: true },
  parameters: {
    docs: {
      description: {
        story:
          "L'état est porté par un trait TIRETÉ : `--muted` ne se détache pas de `--card` " +
          "— de 1,00 à 1,19:1 selon la combinaison, strictement identique en produit " +
          "sombre. Un état signalé par un fond invisible n'est pas signalé. Et c'est " +
          "`readOnly`, pas `disabled` : la valeur reste focusable, donc découvrable.",
      },
    },
  },
};
