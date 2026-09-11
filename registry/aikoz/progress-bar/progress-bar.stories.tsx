import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Composants/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  args: { value: 87 },
  decorators: [(S) => <div className="w-64"><S /></div>],
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Niveaux: Story = {
  name: "Les trois niveaux",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <ProgressBar value={95} />
      <ProgressBar value={72} />
      <ProgressBar value={35} />
    </div>
  ),
};

export const LeContourPorteLaLimite: Story = {
  name: "Le contour porte la limite, pas l'aplat",
  args: { value: 72 },
  parameters: {
    docs: {
      description: {
        story:
          "L'or du thème sombre ne tient que 1,40:1 sur une piste claire, et le palier qui " +
          "passait 3:1 seul rendait la barre BRUNE — une couleur qu'aucun autre thème " +
          "n'emploie. Le liseré intérieur d'1 px règle le faux dilemme : l'aplat porte " +
          "l'identité, le contour porte WCAG 1.4.11. Un seul or par thème, 12 paires sur " +
          "12 au-dessus de 3:1.",
      },
    },
  },
};

export const MeterPasProgressbar: Story = {
  name: "`meter`, pas `progressbar`",
  args: { value: 87, valueText: "87 %, objectif 90 %" },
  parameters: {
    docs: {
      description: {
        story:
          "`meter` désigne une MESURE dans une échelle connue ; `progressbar` l'avancement " +
          "d'une TÂCHE. Les lecteurs d'écran ne les annoncent pas pareil. Le défaut est " +
          "`meter` : ici la barre sert des indicateurs, pas des traitements en cours.",
      },
    },
  },
};
