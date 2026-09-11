import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Accordion } from "./accordion";

const items = [
  { value: "q1", title: "Combien d'avis faut-il pour un premier rapport ?", content: "Vingt avis suffisent à dégager des thèmes stables." },
  { value: "q2", title: "Les avis sans texte comptent-ils ?", content: "Ils comptent dans la note, pas dans l'analyse sémantique." },
  { value: "q3", title: "À quelle fréquence les sources sont-elles interrogées ?", content: "Toutes les six heures." },
];

const meta = {
  title: "Navigation/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items, defaultValue: ["q1"] },
  decorators: [(S) => <div className="w-[34rem]"><S /></div>],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const UneSeuleOuverte: Story = {
  name: "Une seule ouverte à la fois",
  play: async ({ canvas, userEvent }) => {
    const boutons = canvas.getAllByRole("button");
    await expect(boutons[0]).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(boutons[1]);
    await expect(boutons[1]).toHaveAttribute("aria-expanded", "true");
    await expect(boutons[0]).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(boutons[1]);
    await expect(boutons[1]).toHaveAttribute("aria-expanded", "false");
  },
};

export const LePanneauFermeSortDeLaTabulation: Story = {
  name: "Le panneau fermé sort de la tabulation",
  play: async ({ canvas }) => {
    const bouton = canvas.getAllByRole("button")[1];
    const panneau = document.getElementById(bouton.getAttribute("aria-controls")!);
    // `hidden` et non une classe : un panneau masqué en `height: 0` reste
    // focusable, et le focus disparaît dans du contenu invisible.
    await expect(panneau).not.toBeVisible();
    await expect(panneau!.querySelectorAll("a,button,input")).toHaveLength(0);
  },
};

export const LeBoutonEstEnveloppe: Story = {
  name: "Le bouton est enveloppé dans un titre",
  play: async ({ canvas }) => {
    const bouton = canvas.getAllByRole("button")[0];
    // Un h3 cliquable n'est pas actionnable au clavier ; un bouton sans titre
    // autour prive la section de son plan. Il faut les deux.
    await expect(bouton.parentElement?.tagName).toBe("H3");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Le niveau est un prop — et ici, contrairement à `Card`, il en faut un : dans " +
          "une carte le titre est du contenu libre, dans un accordéon les intitulés SONT " +
          "la structure de la section.",
      },
    },
  },
};
