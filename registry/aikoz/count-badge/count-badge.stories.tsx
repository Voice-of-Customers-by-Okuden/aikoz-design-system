import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CountBadge } from "./count-badge";

const meta = {
  title: "Composants/CountBadge",
  component: CountBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["count", "rank"] },
    tone: { control: "inline-radio", options: ["primary", "info", "warning", "error"] },
  },
  args: { value: 7 },
} satisfies Meta<typeof CountBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const DeuxFormes: Story = {
  name: "Deux formes, pour ne pas les confondre",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`count` est un cercle plein — un compte à traiter, il doit attirer l'œil. " +
          "`rank` est un carré à coins arrondis, contour fin — un rang dans une liste, " +
          "pas une alerte. La forme diffère en plus du remplissage, pour qu'on ne les " +
          "confonde jamais au premier coup d'œil. `tone` est ignoré sur `rank` : un " +
          "marqueur de rang reste sobre dans tous les cas.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {(["primary", "info", "warning", "error"] as const).map((t) => (
          <CountBadge key={t} value={7} tone={t} label={`en ${t}`} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((n) => (
          <CountBadge key={n} value={n} variant="rank" label={`rang ${n}`} />
        ))}
      </div>
    </div>
  ),
};

export const LesTonsSontMesures: Story = {
  name: "Les tons sont mesurés, pas choisis à l'œil",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Le texte fait 11px en gras : c'est du petit texte, donc 4,5:1 sans " +
          "exemption. Mesuré au rendu dans les quatre combinaisons — `primary` 5,76 à " +
          "18,69:1, `warning` 5,13 à 11,23, `info` 5,87 à 6,64, `error` 4,80 à 5,72. " +
          "Le point bas est `error` à 4,80, qui passe avec peu de marge : c'est la " +
          "paire à re-mesurer si les tokens `--destructive` bougent.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3">
      {(["primary", "info", "warning", "error"] as const).map((t) => (
        <CountBadge key={t} value={99} tone={t} label={`avis ${t}`} />
      ))}
    </div>
  ),
};

export const UnNombreLongSAllonge: Story = {
  name: "Un nombre long s'allonge au lieu d'être coupé",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`min-w` + `px`, jamais une largeur fixe : un « 9 » reste un cercle, un « 128 » " +
          "devient une pilule. Avec une largeur fixe le troisième chiffre se ferait " +
          "rogner par les bords arrondis, et on lirait « 12 » là où il y en a 128.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3">
      {[3, 12, 128].map((n) => (
        <CountBadge key={n} value={n} label="avis en attente" />
      ))}
    </div>
  ),
};

export const DecoratifQuandLeParentParle: Story = {
  name: "Décoratif quand le parent parle déjà",
  parameters: {
    docs: {
      description: {
        story:
          "`label={null}` masque la pastille aux technologies d'assistance. C'est le bon " +
          "choix quand l'en-tête ou la ligne énonce déjà « 7 avis en attente » : sans ça " +
          "le nombre serait lu deux fois. Même convention que `Badge`, `ScoreStars` et " +
          "`DeltaBadge`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="m-0 flex items-center gap-2 text-sm">
        <span>7 avis en attente</span>
        <CountBadge value={7} label={null} />
      </p>
      <p className="m-0 flex items-center gap-2 text-sm">
        <span>Colonne isolée</span>
        <CountBadge value={7} label="avis en attente" />
      </p>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const pastilles = canvasElement.querySelectorAll("span[class*='min-w-5']");
    await expect(pastilles[0]).toHaveAttribute("aria-hidden", "true");
    await expect(pastilles[1]).not.toHaveAttribute("aria-hidden");
    // La version nommée porte sa précision, la décorative n'expose rien :
    // sans `aria-hidden`, « 7 » serait annoncé deux fois de suite.
    await expect(pastilles[1]).toHaveTextContent("7 avis en attente");
    await expect(pastilles[0].querySelector(".sr-only")).toBeNull();
  },
};
