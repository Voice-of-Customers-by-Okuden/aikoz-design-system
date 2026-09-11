import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./dialog";
import { Button } from "../button/button";

const meta = {
  title: "Composants/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  args: {
    title: "Supprimer cette campagne ?",
    description: "Les avis déjà collectés sont conservés.",
    trigger: <Button variant="outline">Ouvrir</Button>,
    children: <p className="m-0 text-sm text-muted-foreground">Cette action est définitive.</p>,
    footer: <><Button variant="ghost">Annuler</Button><Button>Supprimer</Button></>,
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Placements: Story = {
  name: "Trois placements",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-3">
      {(["center", "right", "bottom"] as const).map((p) => (
        <Dialog key={p} placement={p} title={`Placement ${p}`} trigger={<Button variant="outline" size="sm">{p}</Button>}>
          <p className="m-0 text-sm text-muted-foreground">Échap referme et rend le focus au déclencheur.</p>
        </Dialog>
      ))}
    </div>
  ),
};

export const LeTitreEstUnProp: Story = {
  name: "Le titre est un prop, pas un enfant",
  parameters: {
    docs: {
      description: {
        story:
          "C'est la seule façon de garantir que la modale a un nom accessible : une modale " +
          "sans nom s'annonce « dialogue », sans dire lequel. Radix apporte le reste — " +
          "piège de focus, retour du focus au déclencheur, Échap, verrouillage du " +
          "défilement, `aria-modal`. Pas d'animation : les classes `animate-in` venaient " +
          "d'un plugin non installé et ne produisaient rien.",
      },
    },
  },
};
