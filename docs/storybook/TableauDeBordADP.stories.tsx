import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import source from "./tableau-de-bord-adp.tsx?raw";
import { TableauDeBordADP } from "./tableau-de-bord-adp";

const meta = {
  title: "Assemblages/Tableau de bord ADP",
  component: TableauDeBordADP,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: source, language: "tsx" },
      canvas: { sourceState: "shown" },
    },
  },
  globals: { marque: "adp", theme: "clair" },
} satisfies Meta<typeof TableauDeBordADP>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OngletReponses: Story = {
  name: "Onglet « Réponses »",
  parameters: {
    docs: {
      description: {
        story:
          "**Quatre blocs, quatre familles de figure**, et le choix s'est fait " +
          "contre les trois autres à chaque fois. Quatre cartes côte à côte " +
          "qui emploieraient la même figure ne se distingueraient que par leur " +
          "titre, et l'œil ne saurait plus où revenir.\\n\\n" +
          "| Bloc | Figure | Pourquoi |\\n" +
          "| --- | --- | --- |\\n" +
          "| Taux de réponse | Courbe | Une valeur continue dans le temps, avec sa référence marché |\\n" +
          "| Sujets sensibles | Histogramme empilé | Un décompte : on veut les pics et leur composition, pas une tendance lissée |\\n" +
          "| Hors charte | Jauge horizontale | Une part bornée, la seule qui se lise sans échelle — et le % d'Antoine rendu comparable à sa cible |\\n" +
          "| Type d'actions | Anneau | Une composition à quatre parts |\\n\\n" +
          "Trait, barres verticales, barre horizontale, cercle : aucune ne " +
          "répète l'autre.\\n\\n" +
          "**Les chiffres des deux blocs du milieu sont illustratifs**, et le " +
          "disent. Ces indicateurs sont « en cours de qualification avec les " +
          "équipes ADP » : ils montrent la forme, pas la mesure.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    // ── Les quatre blocs sont là ──────────────────────────────────────────
    for (const titre of [
      /Taux de réponse sur les POI/,
      /Nombre de sujets sensibles/,
      /Réponses hors charte ADP/,
      /Type d'actions de réponse/,
    ]) {
      await expect(c.getByRole("heading", { name: titre })).toBeInTheDocument();
    }

    // ── Quatre figures DIFFÉRENTES ────────────────────────────────────────
    //
    // C'est la contrainte que ce tableau devait tenir, et elle ne se vérifie
    // pas en lisant le code : on compte les FORMES rendues. Une courbe est
    // un `path`, des barres et un anneau des `path` aussi — on les sépare
    // par le composant qui les a produits, via le rôle `figure` que
    // `ChartFrame` pose et le `role="progressbar"` de la jauge.
    const figures = canvasElement.querySelectorAll("figure");
    await expect(
      figures.length,
      `${figures.length} figures graphiques : il en faut trois, plus la jauge.`,
    ).toBe(3);
    // `meter` et non `progressbar` : c'est le rôle par défaut de
    // `ProgressBar`, et c'est le bon — `progressbar` décrit une tâche qui
    // avance, `meter` une mesure dans une échelle connue. Une part de
    // réponses hors charte ne progresse pas, elle se situe.
    await expect(
      canvasElement.querySelectorAll('[role="meter"]').length,
      "la jauge des réponses hors charte n'est pas rendue.",
    ).toBeGreaterThan(0);

    // ── Les chiffres illustratifs le disent ───────────────────────────────
    //
    // Deux indicateurs ne sont pas qualifiés. Les montrer sans le dire ferait
    // prendre une forme pour une mesure.
    await expect(
      c.getAllByText(/Chiffres illustratifs/).length,
      "les indicateurs non qualifiés ne se signalent pas.",
    ).toBe(2);

    // ── Le tableau des derniers avis ──────────────────────────────────────
    await expect(
      c.getByRole("table", { name: /Derniers avis répondus/i }),
    ).toBeInTheDocument();
  },
};

export const LesTroisAutresOngletsLeDisent: Story = {
  name: "Les trois autres onglets disent qu'ils ne sont pas montés",
  parameters: {
    docs: {
      description: {
        story:
          "Un onglet qui bascule sur du vide laisse croire à un écran cassé. " +
          "Il dit ce qu'il est — même raison que les espaces non montés de la " +
          "barre latérale.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    await u.click(c.getByRole("tab", { name: "Classement" }));
    await waitFor(async () => {
      await expect(
        c.getByText(/« Classement » n'est pas encore monté/),
      ).toBeInTheDocument();
    });

    // Et on revient sur un onglet monté sans rien perdre.
    await u.click(c.getByRole("tab", { name: "Réponses" }));
    await waitFor(async () => {
      await expect(
        c.getByRole("heading", { name: /Type d'actions de réponse/ }),
      ).toBeInTheDocument();
    });
  },
};
