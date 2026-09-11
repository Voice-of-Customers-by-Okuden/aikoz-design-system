import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

/**
 * Bouton Aikoz — 4 variantes × 3 tailles.
 *
 * Ce fichier sert de référence aux 36 autres. Trois conventions y sont
 * posées, et elles valent pour toutes les stories du système :
 *
 * 1. **La documentation vit dans le composant, pas ici.** Le bloc de
 *    commentaire au-dessus de `Button` est repris automatiquement par
 *    Storybook. Le dupliquer dans la story créerait deux textes à maintenir,
 *    qui divergeraient.
 * 2. **Une story par DÉCISION, pas une par combinaison.** `Matrice` montre
 *    les douze combinaisons d'un coup ; les autres montrent chacune un point
 *    qui a demandé un arbitrage, et l'expliquent.
 * 3. **Pas de story par thème.** Le thème et le registre sont dans la barre
 *    d'outils, et s'appliquent à toutes les stories. Les dupliquer en
 *    « Button clair » / « Button sombre » quadruplerait le catalogue.
 */
const meta = {
  title: "Composants/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "outline", "ghost"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  args: { children: "Demander une démonstration" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Matrice: Story = {
  name: "Matrice — 4 variantes × 3 tailles",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Les tailles sont des hauteurs MINIMALES (`min-h`), pas des hauteurs fixes : " +
          "un bouton dont le libellé passe à la ligne s'allonge au lieu de le rogner.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <span className="w-8 text-xs uppercase tracking-wider text-muted-foreground">
            {size}
          </span>
          {(["default", "secondary", "outline", "ghost"] as const).map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const SurvolPorteParLaBordure: Story = {
  name: "Le survol est porté par la bordure",
  args: { variant: "outline", children: "Survolez-moi" },
  parameters: {
    docs: {
      description: {
        story:
          "Les variantes `outline` et `ghost` signalent le survol par leur BORDURE, pas " +
          "par une teinte. Mesuré : un voile d'accent aquamarine donne 1,025:1 sur fond " +
          "clair, et monter l'opacité n'y change rien (1,073 à 40 %) — l'aquamarine a " +
          "presque la même clarté que le fond, on déplace la teinte sans déplacer la " +
          "luminance. La bordure forte, elle, tient 4,07 à 4,58:1 selon le thème.",
      },
    },
  },
};

export const LibelleLong: Story = {
  name: "Un libellé long passe à la ligne",
  args: {
    children: "Un intitulé nettement plus long que prévu pour tester l'empilement du texte",
    className: "max-w-xs",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Il n'y a délibérément pas de `whitespace-nowrap`. Avec lui, un libellé long " +
          "sortait du conteneur et se faisait rogner — sur mobile le texte disparaissait " +
          "purement. Le repli gracieux est le retour à la ligne : la pastille s'allonge, " +
          "ce qui signale au passage qu'il faut raccourcir l'intitulé.",
      },
    },
  },
};

export const Desactive: Story = {
  name: "Désactivé",
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          "`disabled` retire le bouton du parcours clavier ET de la soumission. Quand " +
          "l'action doit rester découvrable — pour expliquer POURQUOI elle est " +
          "indisponible, par exemple — utiliser `aria-disabled` et un gestionnaire qui " +
          "ne fait rien : le bouton reste focusable, donc trouvable.",
      },
    },
  },
};
