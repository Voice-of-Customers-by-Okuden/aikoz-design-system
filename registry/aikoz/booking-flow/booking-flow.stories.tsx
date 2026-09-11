import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { BookingFlow } from "./booking-flow";
import { Button } from "../button/button";

const jours = [
  { label: "Mardi 14 avril", slots: [
    { value: "a1", time: "09:00" }, { value: "a2", time: "09:30", full: true }, { value: "a3", time: "10:00" },
  ]},
];

const meta = {
  title: "Parcours/BookingFlow",
  component: BookingFlow,
  tags: ["autodocs"],
  args: { days: jours, trigger: <Button>Réserver une démonstration</Button> },
} satisfies Meta<typeof BookingFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Formulaire: Story = { name: "Formulaire", args: { open: true } };

export const LaValidationSeFaitALaSoumission: Story = {
  name: "La validation se fait à la soumission",
  args: { open: true },
  play: async ({ canvas, userEvent }) => {
    const dialogue = document.querySelector("[role=dialog]") as HTMLElement;
    const confirmer = [...dialogue.querySelectorAll("button")].find((b) => /Confirmer/.test(b.textContent ?? ""))!;
    await userEvent.click(confirmer);
    // Trois erreurs, chacune en role=alert puisqu'elles apparaissent après coup.
    await expect(dialogue.querySelectorAll("[role=alert]")).toHaveLength(3);
    await expect(dialogue.querySelectorAll("[aria-invalid='true']")).toHaveLength(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Jamais à la frappe : corriger quelqu'un pendant qu'il écrit affiche une erreur " +
          "dès le premier caractère. Et la règle de l'e-mail est volontairement permissive " +
          "— on refuse l'absence d'arobase ou de domaine, pas les formes inhabituelles.",
      },
    },
  },
};

export const Confirme: Story = {
  name: "Confirmé",
  args: { open: true, status: "confirmed" },
  parameters: {
    docs: {
      description: {
        story:
          "Le changement d'état est ANNONCÉ et reçoit le FOCUS. Deux mécanismes, parce " +
          "qu'ils ne servent pas la même personne : `role=\"status\"` prévient qui écoute, " +
          "le focus déplacé emmène qui navigue au clavier. Sans le focus, l'utilisateur " +
          "resterait sur un bouton « Confirmer » qui n'existe plus.",
      },
    },
  },
};

export const Echec: Story = {
  name: "Échec",
  args: { open: true, status: "failed" },
  parameters: {
    docs: {
      description: {
        story:
          "Le message dit quoi faire, pas seulement que ça a raté. Ce composant ne parle " +
          "à personne : ni serveur ni `fetch`, l'appelant passe un `status` et reçoit un " +
          "`onSubmit`.",
      },
    },
  },
};
