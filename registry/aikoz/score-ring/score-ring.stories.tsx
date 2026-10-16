import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ScoreRing } from "./score-ring";

const meta = {
  title: "Données/ScoreRing",
  component: ScoreRing,
  parameters: { layout: "centered" },
  args: { label: "Note Google", value: 4.9, max: 5, description: "Votre note · Google" },
} satisfies Meta<typeof ScoreRing>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Une note sur son anneau",
  tags: ["autodocs"],
  args: { formatValue: (v) => v.toFixed(2).replace(".", ",") },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // ── Le rôle : une MESURE, pas l'avancement d'une tâche ────────────────
    const m = c.getByRole("meter", { name: "Note Google" });
    await expect(m).toHaveAttribute("aria-valuenow", "4.9");
    await expect(m).toHaveAttribute("aria-valuemax", "5");
    // ── L'information ne tient pas à la couleur ───────────────────────────
    //
    // Le nombre est écrit, et `aria-valuetext` le donne en toutes lettres.
    // Retirer l'une des deux rend l'anneau illisible à qui ne distingue pas
    // le vert du rouge — c'est ce que vérifie cette assertion.
    await expect(m).toHaveAttribute("aria-valuetext", "4,90 sur 5");
    await expect(c.getByText("4,90")).toBeVisible();
  },
};

export const LesTroisNiveaux: Story = {
  name: "Les trois niveaux, et la longueur de l'arc les dit",
  render: () => (
    <div className="flex items-end gap-8">
      <ScoreRing label="Bon" value={4.6} description="good" />
      <ScoreRing label="Moyen" value={3.2} description="warning" />
      <ScoreRing label="Critique" value={1.8} description="critical" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // ── Ce que ce test mesure vraiment ────────────────────────────────────
    //
    // Pas la couleur : la LONGUEUR. Si le niveau devenait purement
    // chromatique, `strokeDashoffset` cesserait de varier et les trois
    // anneaux seraient identiques pour qui ne voit pas la teinte.
    const arcs = canvasElement.querySelectorAll("circle[stroke-dasharray]");
    await expect(arcs).toHaveLength(3);
    const offsets = [...arcs].map((a) => parseFloat(a.getAttribute("stroke-dashoffset")!));
    await expect(
      offsets[0] < offsets[1] && offsets[1] < offsets[2],
      `les arcs ne se distinguent pas par leur longueur : ${offsets.join(", ")} — ` +
        `le niveau ne tiendrait plus qu'à la couleur.`,
    ).toBe(true);
    await expect(c.getByRole("meter", { name: "Critique" })).toHaveAttribute("aria-valuenow", "1.8");
  },
};

export const SurCent: Story = {
  name: "La même échelle sert un pourcentage",
  args: { label: "Taux de réponse", value: 84, max: 100, description: "30 derniers jours",
          formatValue: (v) => `${v}%` },
  play: async ({ canvasElement }) => {
    // Les seuils sont des FRACTIONS : 84/100 est « good » comme 4,2/5.
    const c = within(canvasElement);
    await expect(c.getByRole("meter", { name: "Taux de réponse" }))
      .toHaveAttribute("aria-valuetext", "84% sur 100");
  },
};

export const MoinsEstUnProgres: Story = {
  name: "Quand « moins » est une bonne nouvelle, le niveau se force",
  args: { label: "Délai moyen de réponse", value: 3.2, max: 24, level: "good",
          description: "heures · objectif 6 h", formatValue: (v) => `${v} h` },
  play: async ({ canvasElement }) => {
    // Sans `level`, 3,2/24 tomberait en « critical » : la fraction seule
    // conclurait l'inverse de la réalité métier.
    const arc = canvasElement.querySelector("circle[stroke-dasharray]")!;
    await expect(arc.getAttribute("stroke")).toContain("success");
  },
};
