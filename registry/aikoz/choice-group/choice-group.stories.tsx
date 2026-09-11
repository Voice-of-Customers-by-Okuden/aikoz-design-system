import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ChoiceGroup } from "./choice-group";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";

const meta = {
  title: "Formulaires/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [(S) => <div className="w-[30rem]"><S /></div>],
  args: {
    legend: "Sélectionnez votre marque",
    description: "Une seule marque à la fois — le périmètre d'analyse en dépend.",
    layout: "grid",
    columns: 3,
    defaultValue: ["axa"],
    options: [
      { value: "axa", label: "AXA" },
      { value: "generali", label: "Generali" },
      { value: "europ", label: "Europ Assistance" },
      { value: "renault", label: "Renault" },
      { value: "vw", label: "Volkswagen" },
      { value: "cma", label: "CMA CGM" },
    ],
    escape: <Button variant="ghost" size="sm">Je ne trouve pas ma marque</Button>,
  },
} satisfies Meta<typeof ChoiceGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ChoixUnique: Story = { name: "Choix unique" };

export const ChoixMultiple: Story = {
  name: "Choix multiple",
  args: {
    legend: "Sources à analyser",
    description: "Plusieurs sources possibles. Au moins une est requise.",
    selection: "multiple",
    layout: "list",
    defaultValue: ["google", "trustpilot"],
    escape: undefined,
    options: [
      { value: "google", label: "Google", description: "Fiches d'établissement", meta: <Badge tone="neutral" size="sm">1 240</Badge> },
      { value: "trustpilot", label: "Trustpilot", description: "Avis vérifiés", meta: <Badge tone="neutral" size="sm">318</Badge> },
      { value: "pj", label: "Pages Jaunes", description: "Annuaire local", meta: <Badge tone="neutral" size="sm">96</Badge> },
      { value: "tripadvisor", label: "TripAdvisor", description: "Hors périmètre assurance", disabled: true },
    ],
  },
  play: async ({ canvas, userEvent }) => {
    const cases = canvas.getAllByRole("checkbox");
    await expect(cases.filter((c) => (c as HTMLInputElement).checked)).toHaveLength(2);
    await userEvent.click(cases[2]);
    await expect(cases[2]).toBeChecked();
    await expect(cases[0]).toBeChecked();
  },
};

export const LaSortieDeSecoursEstHorsDuGroupe: Story = {
  name: "La sortie de secours est hors du groupe",
  play: async ({ canvas }) => {
    const radios = canvas.getAllByRole("radio");
    // Six marques, pas sept : « Je ne trouve pas ma marque » n'est pas une
    // option du groupe, et la compter fausserait l'annonce « 1 sur 6 ».
    await expect(radios).toHaveLength(6);
    const secours = canvas.getByRole("button", { name: /ne trouve pas/i });
    await expect(secours.closest("fieldset")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ce composant remplace `BrandPicker` et `SourceToggle` de l'inventaire : mis " +
          "côte à côte, les deux ne diffèrent que par l'arité de la sélection et le " +
          "contenu des cartes. Deux props, pas deux composants — leurs contrats " +
          "d'accessibilité sont identiques, ce qui n'était pas le cas de `SidebarNav` et " +
          "`ViewTabs`.",
      },
    },
  },
};
