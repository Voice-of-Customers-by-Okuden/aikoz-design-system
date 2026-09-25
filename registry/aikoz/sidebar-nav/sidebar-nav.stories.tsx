import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { SidebarNav } from "./sidebar-nav";

const meta = {
  title: "Navigation/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Navigation principale",
    current: "marche",
    groups: [
      { label: "Pilotage", entries: [
        { id: "marche", label: "Marché", href: "#marche" },
        { id: "campagnes", label: "Campagnes", href: "#campagnes", count: 3 },
        { id: "hall", label: "Hall of Fames", href: "#hall" },
      ]},
      { label: "Configuration", entries: [{ id: "params", label: "Paramètres", href: "#params" }] },
    ],
  },
  decorators: [(S) => <div className="flex w-[36rem] overflow-hidden rounded-lg border border-border"><S /><div className="flex-1 bg-background p-5 text-sm text-muted-foreground">Zone de contenu</div></div>],
} satisfies Meta<typeof SidebarNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const TroisCanauxPourLEtatCourant: Story = {
  name: "L'état courant tient sur trois canaux",
  play: async ({ canvas }) => {
    const courant = canvas.getByRole("link", { name: /Marché/ });
    await expect(courant).toHaveAttribute("aria-current", "page");
    // Le compteur est intégré au nom du lien : sans ça, le nombre n'est
    // qu'une tache colorée que rien n'annonce.
    await expect(canvas.getByRole("link", { name: /Campagnes, 3 en attente/ })).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "`aria-current=\"page\"`, un trait vertical en `--nav-accent` (5,77:1 clair, " +
          "15,08:1 sombre) et la graisse. Le voile de fond ne compte pas dans le lot : " +
          "1,19:1 en clair, 1,07 en sombre — même piège que le survol des boutons.",
      },
    },
  },
};

export const PasLeMemeContratQueViewTabs: Story = {
  name: "Pas le même contrat que ViewTabs",
  parameters: {
    docs: {
      description: {
        story:
          "Cette barre navigue entre SECTIONS : elle change la route, donc des liens dans " +
          "un `<nav>`, `aria-current=\"page\"`, tabulation lien après lien. `ViewTabs` " +
          "échange un panneau dans la page : `role=\"tablist\"`, `aria-selected`, flèches. " +
          "Ils partagent les tokens, pas le code — mutualiser ferait fuiter la mauvaise " +
          "sémantique. Ce composant ne gère ni repli en icônes ni tiroir mobile : cela " +
          "dépend du gabarit de page, pas de la barre.",
      },
    },
  },
};

const COURTE = ["Accueil", "Avis", "Équipes"].map((l, i) => ({
  id: `c${i}`,
  label: l,
  href: "#",
}));
const LONGUE = Array.from({ length: 24 }, (_, i) => ({
  id: `l${i}`,
  label: `Conversation n°${100 + i}`,
  href: "#",
}));

export const LaListeDitQuElleContinue: Story = {
  name: "La liste dit qu'elle continue",
  render: () => (
    <div className="flex flex-wrap gap-6">
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">
          tout tient — aucun fondu
        </figcaption>
        <div className="h-80">
          <SidebarNav
            label="Liste courte"
            current="c0"
            className="h-full"
            groups={[{ label: "Sections", entries: COURTE }]}
            footer={<p className="m-0 p-2 text-xs">Pied</p>}
          />
        </div>
      </figure>
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">
          il en reste dessous — fondu en bas
        </figcaption>
        <div className="h-80">
          <SidebarNav
            label="Liste longue"
            current="l0"
            className="h-full"
            groups={[{ label: "Conversations", entries: LONGUE, density: "compact" }]}
            footer={<p className="m-0 p-2 text-xs">Pied</p>}
          />
        </div>
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Une liste coupée net par le bord du pied ne dit pas qu'elle " +
          "continue : rien ne distingue « voilà tout » de « il y en a vingt " +
          "de plus ».\\n\\n" +
          "Deux canaux, et **aucun n'est permanent**. Le fondu et la barre de " +
          "défilement n'apparaissent que si quelque chose est réellement " +
          "masqué, et le fondu change de bord une fois qu'on est arrivé en " +
          "bas. Un fondu posé en dur serait pire que rien : il promettrait du " +
          "contenu absent, et on apprendrait à ne plus le croire.\\n\\n" +
          "C'est un **masque**, pas un aplat posé par-dessus. Un aplat " +
          "suppose qu'on connaisse la couleur du fond ; le masque efface " +
          "l'encre quelle que soit la surface, et suit donc la marque et le " +
          "thème sans avoir à les connaître.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Sélection par `[data-debord]`, pas par position : la zone défilante a
    // gagné une enveloppe le jour où l'ombre a dû sortir du masque, et deux
    // tests sont tombés parce qu'ils comptaient les enfants.
    const [courte, longue] = [...canvasElement.querySelectorAll("nav")].map(
      (n) => n.querySelector("[data-debord]") as HTMLElement,
    );

    // ── Rien de masqué, rien de promis ────────────────────────────────────
    //
    // C'est l'assertion qui compte le plus. Un fondu qui s'allume toujours
    // est une décoration, pas une affordance.
    await expect(
      courte.scrollHeight - courte.clientHeight,
      "la liste courte déborde : le cas « tout tient » n'est pas testé.",
    ).toBeLessThanOrEqual(1);
    await expect(
      courte.dataset.debord,
      "la liste courte annonce un débordement qu'elle n'a pas.",
    ).toBe("non");
    await expect(getComputedStyle(courte).maskImage).toBe("none");
    await expect(getComputedStyle(courte.parentElement!).boxShadow).toBe("none");

    // ── Du contenu dessous, le fondu en bas ───────────────────────────────
    await expect(
      longue.scrollHeight - longue.clientHeight,
      "la liste longue ne déborde pas : le test ne prouve rien.",
    ).toBeGreaterThan(50);
    await expect(longue.dataset.debord).toBe("bas");
    await expect(getComputedStyle(longue).maskImage).not.toBe("none");

    // ── L'ombre n'est PAS sur l'élément masqué ────────────────────────────
    //
    // `mask-image` découpe tout le rendu de son élément, ombre portée
    // comprise. Posés ensemble, le masque effaçait l'ombre exactement là où
    // elle devait se voir — l'effet était imperceptible et aucune opacité
    // n'y aurait rien changé. C'est le défaut qu'Alice a signalé par « on ne
    // voit pas trop ».
    await expect(
      getComputedStyle(longue).boxShadow,
      "l'ombre est posée sur l'élément masqué : le masque l'efface.",
    ).toBe("none");
    const enveloppe = longue.parentElement!;
    await expect(
      getComputedStyle(enveloppe).boxShadow,
      "l'enveloppe ne porte pas d'ombre : le bord ne se voit que là où il y " +
        "a de l'encre à estomper.",
    ).not.toBe("none");
    await expect(getComputedStyle(enveloppe).maskImage).toBe("none");

    // ── Au milieu, des deux côtés ; en bas, plus rien dessous ─────────────
    longue.scrollTop = 40;
    await waitFor(async () => {
      await expect(longue.dataset.debord).toBe("deux");
    });

    longue.scrollTop = longue.scrollHeight;
    await waitFor(async () => {
      await expect(
        longue.dataset.debord,
        "arrivé en bas, le fondu promet encore du contenu.",
      ).toBe("haut");
    });

    longue.scrollTop = 0;
    await waitFor(async () => {
      await expect(longue.dataset.debord).toBe("bas");
    });
  },
};
