import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Switch } from "./switch";

const meta = {
  title: "Composants/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    labelHidden: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Réponse automatique",
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Par défaut",
  args: { description: "Publie la réponse générée sans validation manuelle." },
};

export const CestUneVraieCaseACocher: Story = {
  name: "C'est une vraie case à cocher",
  args: { defaultChecked: false },
  parameters: {
    docs: {
      description: {
        story:
          "Sous l'habillage il y a un `<input type=\"checkbox\" role=\"switch\">` en " +
          "`sr-only` — jamais `display:none`, qui le sortirait de la tabulation. Tout " +
          "le clavier vient donc du natif : Tab pour l'atteindre, Espace pour basculer. " +
          "Ce test le vérifie au lieu de le supposer, parce que c'est exactement ce " +
          "qu'un `<div onClick>` avec `aria-checked` géré à la main perd en silence.",
      },
    },
  },
  play: async ({ canvas, args, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const inter = canvas.getByRole("switch", { name: /réponse automatique/i });
    await expect(inter).not.toBeChecked();

    // Le clavier seul, sans jamais cliquer : c'est le parcours qu'on veut garantir.
    await u.tab();
    await expect(inter).toHaveFocus();
    await u.keyboard(" ");
    await expect(inter).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);

    await u.keyboard(" ");
    await expect(inter).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
  },
};

export const DeuxCanauxPortentLEtat: Story = {
  name: "Deux canaux portent l'état",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "La position du curseur ET la couleur de la piste changent ensemble. Mesuré " +
          "dans les quatre combinaisons : la piste au repos (`--border-strong`) tient " +
          "4,07 à 7,28:1 contre la page, la piste active (`--primary`) 5,76 à 17,13:1, " +
          "et le curseur (`--background`) 4,07 à 15,71:1 contre sa piste. Le seuil " +
          "applicable est 3:1 (WCAG 1.4.11, élément non textuel) — aucune paire n'en " +
          "approche.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Arrêt" />
      <Switch label="Marche" defaultChecked />
      <Switch label="Arrêt, indisponible" disabled />
      <Switch label="Marche, indisponible" defaultChecked disabled />
    </div>
  ),
};

export const LibelleMasque: Story = {
  name: "Libellé masqué — l'exception, pas la règle",
  args: { labelHidden: true, label: "Activer l'automatisation pour Renault Lyon" },
  parameters: {
    docs: {
      description: {
        story:
          "`labelHidden` ne retire pas le libellé, il le rend `sr-only` : le nom " +
          "accessible reste entier. À réserver aux grilles denses où une colonne voisine " +
          "porte déjà le libellé — contrairement à `Input`, où le champ de recherche en " +
          "fait l'usage courant.",
      },
    },
  },
  play: async ({ canvas }) => {
    // Invisible à l'œil, nommé pour la machine : c'est tout l'intérêt.
    await expect(
      canvas.getByRole("switch", { name: "Activer l'automatisation pour Renault Lyon" })
    ).toBeInTheDocument();
  },
};
