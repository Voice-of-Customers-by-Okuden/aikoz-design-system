import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table";
import { EmptyState } from "../empty-state/empty-state";

type Ligne = { agence: string; avis: number; taux: string };
const lignes: Ligne[] = [
  { agence: "Lyon Part-Dieu", avis: 312, taux: "94 %" },
  { agence: "Paris Opéra", avis: 287, taux: "88 %" },
  { agence: "Marseille Prado", avis: 154, taux: "71 %" },
];
const colonnes = [
  { key: "agence", header: "Agence" },
  { key: "avis", header: "Avis", numeric: true },
  { key: "taux", header: "Taux de réponse", numeric: true },
];

const meta = {
  title: "Données/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    caption: "Taux de réponse par agence, 30 derniers jours",
    columns: colonnes,
    rows: lignes,
    getRowKey: (r: Ligne) => r.agence,
    rowHeaderKey: "agence",
  },
} satisfies Meta<typeof Table<Ligne>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const UnVraiTable: Story = {
  name: "Un vrai `<table>`, pas une grille de div",
  parameters: {
    docs: {
      description: {
        story:
          "Les balises de tableau portent des RELATIONS que rien ne remplace. En mode " +
          "tableau, un lecteur d'écran annonce « Lyon Part-Dieu, taux de réponse, 94 % » " +
          "à chaque déplacement ; une grille de div donne « 94 % » et l'utilisateur doit " +
          "compter les colonnes. `<caption>` plutôt qu'`aria-label` : visible, liée " +
          "nativement, impossible à désynchroniser d'un titre voisin.",
      },
    },
  },
};

export const Chargement: Story = {
  name: "Chargement",
  args: { loading: true, rows: [], loadingRows: 3 },
  parameters: {
    docs: {
      description: {
        story:
          "`aria-busy` est porté UNE fois par le conteneur, pas par chacun des squelettes : " +
          "c'est le tableau qui charge, pas quatorze rectangles.",
      },
    },
  },
};

export const Vide: Story = {
  name: "Vide",
  args: {
    rows: [],
    empty: (
      <EmptyState
        title="Aucun avis sur cette période"
        description="Élargissez la période d'analyse ou retirez le filtre par source."
      />
    ),
  },
};
