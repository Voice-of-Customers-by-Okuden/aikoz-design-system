import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./tooltip";
import { Button } from "../button/button";

const meta = {
  title: "Composants/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    content: "Nombre d'avis reçus sur la période, toutes sources confondues.",
    children: <Button variant="outline" size="sm">Avis traités</Button>,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const JamaisUneInformationNecessaire: Story = {
  name: "Jamais une information nécessaire",
  parameters: {
    docs: {
      description: {
        story:
          "La règle qui prime sur toutes les autres. Une infobulle n'existe ni au tactile, " +
          "ni à l'impression, ni en zoom fort. Elle sert une précision de CONFORT : " +
          "l'intitulé complet d'une colonne abrégée, la date exacte derrière « il y a 3 j ». " +
          "Deux pièges qu'elle ne rattrape pas : un déclencheur `disabled` n'ouvrira jamais " +
          "rien, et Radix relie par `aria-describedby` — un bouton en icône seule a besoin " +
          "de son propre `aria-label` en plus.",
      },
    },
  },
};
