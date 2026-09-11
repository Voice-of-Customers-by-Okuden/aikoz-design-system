import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SlotPicker } from "./slot-picker";

const jours = [
  { label: "Mardi 14 avril", slots: [
    { value: "a1", time: "09:00" }, { value: "a2", time: "09:30", full: true },
    { value: "a3", time: "10:00" }, { value: "a4", time: "11:00", full: true },
    { value: "a5", time: "14:00" },
  ]},
  { label: "Mercredi 15 avril", slots: [
    { value: "b1", time: "09:00" }, { value: "b2", time: "10:30" }, { value: "b3", time: "16:00" },
  ]},
];

const meta = {
  title: "Formulaires/SlotPicker",
  component: SlotPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { legend: "Choisissez un créneau", days: jours },
  decorators: [(S) => <div className="w-[30rem]"><S /></div>],
} satisfies Meta<typeof SlotPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const UnSeulGroupePourTousLesJours: Story = {
  name: "Un seul groupe pour tous les jours",
  play: async ({ canvas }) => {
    const radios = canvas.getAllByRole("radio") as HTMLInputElement[];
    // Un `name` commun fait du tout un seul groupe : c'est ce qui laisse les
    // flèches traverser la grille entière, d'un jour à l'autre.
    await expect(new Set(radios.map((r) => r.name)).size).toBe(1);
    // Un créneau complet reste ANNONCÉ, pas retiré : sinon l'utilisateur
    // croirait que le cabinet n'ouvre pas à cette heure-là.
    await expect(canvas.getByRole("radio", { name: /11:00, complet/ })).toBeDisabled();
  },
};

export const Vide: Story = {
  name: "Aucun créneau",
  args: { days: [{ label: "Mardi 14 avril", slots: [] }] },
};
