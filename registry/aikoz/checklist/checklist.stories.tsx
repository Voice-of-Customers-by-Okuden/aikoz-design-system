import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checklist } from "./checklist";

const PREMIERS_PAS = [
  { id: "repondre", title: "Répondez à votre dernier avis client", effort: "2 min",
    detail: "Choisissez un avis récent et publiez une réponse personnalisée, rédigée avec l'aide d'Aikoz.",
    action: { label: "Commencer" } },
  { id: "agence", title: "Personnaliser votre agence digitale", effort: "3 min",
    detail: "Complétez les trois sections de votre page publique." },
  { id: "secrets", title: "3 secrets des top-agents", effort: "5 min",
    detail: "Ce que font les agences les mieux notées, et que les autres ignorent." },
  { id: "sms", title: "Solliciter un avis par SMS", effort: "5 min",
    detail: "Un message, un lien, un avis de plus." },
  { id: "post", title: "Publiez votre actualité Agence", effort: "3 min",
    detail: "Une publication visible sur votre fiche." },
];

const meta = {
  title: "Données/Checklist",
  component: Checklist,
  parameters: { layout: "padded" },
  args: { label: "Vos premiers pas", tasks: PREMIERS_PAS },
} satisfies Meta<typeof Checklist>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  name: "Une liste de démarrage",
  tags: ["autodocs"],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    // ── L'avancement est écrit ET mesurable ──────────────────────────────
    //
    // Les deux, parce qu'ils ne s'adressent pas aux mêmes yeux : la fraction
    // se lit d'un coup d'œil, le `meter` se lit au lecteur d'écran. Retirer
    // l'un des deux laisse quelqu'un sans information.
    await expect(c.getByText("0 / 5 complétées")).toBeVisible();
    await expect(
      c.getByRole("meter", { name: /avancement/ }),
    ).toHaveAttribute("aria-valuetext", "0 sur 5 complétées");

    // ── Les intitulés forment le plan de la section ──────────────────────
    await expect(c.getAllByRole("heading", { level: 3 })).toHaveLength(5);

    // ── Le dépliement se dit, il ne se devine pas ────────────────────────
    const premier = c.getByRole("button", { name: "Répondez à votre dernier avis client" });
    await expect(premier).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(premier);
    await expect(premier).toHaveAttribute("aria-expanded", "true");
    await expect(c.getByRole("button", { name: "Commencer" })).toBeVisible();
  },
};

export const LEtatNeTientPasALaCouleur: Story = {
  name: "L'état d'une tâche ne tient pas à la couleur",
  args: {
    tasks: PREMIERS_PAS.map((t, i) => ({ ...t, done: i < 2 })),
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Deux faites, trois à faire — et on le sait SANS voir la couleur :
    // chaque pastille porte son mot. Si quelqu'un remplace le texte masqué
    // par un simple changement de teinte, ces assertions tombent.
    await expect(c.getAllByText("terminée")).toHaveLength(2);
    await expect(c.getAllByText("à faire")).toHaveLength(3);
    await expect(c.getByText("2 / 5 complétées")).toBeVisible();
  },
};

export const SansDetail: Story = {
  name: "Une tâche sans détail ne se déplie pas",
  args: {
    label: "Personnalisez le contenu de votre agence",
    unit: "sections",
    tasks: [
      { id: "accueil", title: "Page d'accueil", progress: { done: 0, total: 2 } },
      { id: "offres", title: "Nos offres", progress: { done: 0, total: 1 } },
      { id: "qui", title: "Qui sommes-nous ?", progress: { done: 0, total: 2 } },
    ],
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // ── Ce que ce test protège ───────────────────────────────────────────
    //
    // Un bouton qui n'ouvre rien est un mensonge d'interface : on clique,
    // rien ne bouge, et on conclut que c'est cassé. Sans `detail` ni
    // `action`, l'intitulé reste du texte.
    await expect(c.queryAllByRole("button")).toHaveLength(0);
    // « 0/2 » apparaît deux fois — on compte, on ne cherche pas.
    await expect(c.getAllByText("0/2")).toHaveLength(2);
    await expect(c.getByText("0/1")).toBeVisible();
    await expect(c.getByText("0 / 3 sections")).toBeVisible();
  },
};
