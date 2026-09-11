import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Textarea } from "./textarea";

const meta = {
  title: "Composants/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    resize: { control: "inline-radio", options: ["vertical", "none"] },
    labelHidden: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: { label: "Réponse à publier", onChange: fn() },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Par défaut",
  args: { description: "Deux à quatre phrases. Le nom du client n'est jamais repris." },
};

export const LaConsignePrecedeLeChamp: Story = {
  name: "La consigne précède le champ",
  args: {
    description: "Deux à quatre phrases. Le nom du client n'est jamais repris.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "La consigne sert à REMPLIR le champ, pas à le relire : placée dessous, elle " +
          "arrive après que l'utilisateur a commencé à taper. Elle est reliée par " +
          "`aria-describedby`, donc lue à la prise de focus.",
      },
    },
  },
  play: async ({ canvas }) => {
    const champ = canvas.getByRole("textbox", { name: /réponse à publier/i });
    const decrit = champ.getAttribute("aria-describedby");
    await expect(decrit).toBeTruthy();
    const consigne = document.getElementById(decrit!.split(" ")[0]);
    await expect(consigne).toHaveTextContent(/jamais repris/);
    // Ordre dans le document : la consigne AVANT le champ.
    await expect(
      consigne!.compareDocumentPosition(champ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  },
};

export const Erreur: Story = {
  name: "Une erreur bascule le champ en invalide",
  args: { error: "Ce champ ne peut pas être vide.", defaultValue: "" },
  parameters: {
    docs: {
      description: {
        story:
          "La seule présence d'`error` pose `aria-invalid` et relie le message par " +
          "`aria-describedby` — pas deux props à tenir synchronisées. Le message porte " +
          "`role=\"alert\"` : il apparaît après coup, à la sauvegarde, et doit être " +
          "annoncé sans que l'utilisateur retourne le chercher.",
      },
    },
  },
  play: async ({ canvas }) => {
    const champ = canvas.getByRole("textbox");
    await expect(champ).toHaveAttribute("aria-invalid", "true");
    const alerte = canvas.getByRole("alert");
    await expect(alerte).toHaveTextContent("Ce champ ne peut pas être vide.");
    await expect(champ.getAttribute("aria-describedby")).toContain(alerte.id);
  },
};

export const ObligatoireEnToutesLettres: Story = {
  name: "« Obligatoire » est écrit, pas seulement étoilé",
  args: { required: true },
  parameters: {
    docs: {
      description: {
        story:
          "L'astérisque est `aria-hidden`, doublé d'un `sr-only` « (obligatoire) ». Un " +
          "symbole seul suppose une légende que personne ne lit — et il ne se prononce " +
          "pas de la même façon d'un lecteur d'écran à l'autre.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", { name: /réponse à publier.*obligatoire/i })
    ).toBeRequired();
  },
};

export const LectureSeuleResteFocusable: Story = {
  name: "Lecture seule reste atteignable, désactivé non",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`disabled` sort du parcours clavier : le texte devient introuvable pour qui " +
          "navigue au clavier. `readOnly` le garde focusable et sélectionnable, donc " +
          "lisible. Quand le contenu compte encore, c'est `readOnly` qu'il faut — le " +
          "pointillé de la bordure signale la différence à l'œil.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea label="Lecture seule" readOnly defaultValue="Merci pour votre retour, nous revenons vers vous." />
      <Textarea label="Désactivé" disabled defaultValue="Merci pour votre retour, nous revenons vers vous." />
    </div>
  ),
  play: async ({ canvas }) => {
    const lecture = canvas.getByRole("textbox", { name: "Lecture seule" });
    const desactive = canvas.getByRole("textbox", { name: "Désactivé" });
    lecture.focus();
    await expect(lecture).toHaveFocus();
    desactive.focus();
    await expect(desactive).not.toHaveFocus();
  },
};

export const LaSaisieRemonte: Story = {
  name: "La saisie remonte à l'appelant",
  parameters: {
    docs: {
      description: {
        story:
          "Le composant ne valide rien et ne stocke rien : comme `Input`, il remonte " +
          "la frappe et laisse l'appelant décider. Il ne rend pas non plus de boutons " +
          "« Annuler » / « Enregistrer » — c'est l'appelant qui les compose, et qui " +
          "branche Échap sur Annuler via `onKeyDown`.",
      },
    },
  },
  play: async ({ canvas, args, userEvent: ue }) => {
    const champ = canvas.getByRole("textbox");
    await (ue ?? userEvent).type(champ, "Bonjour");
    await expect(args.onChange).toHaveBeenCalled();
    await expect(champ).toHaveValue("Bonjour");
  },
};
