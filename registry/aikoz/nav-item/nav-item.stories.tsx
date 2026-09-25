import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { NavItem } from "./nav-item";

const meta = {
  title: "Navigation/NavItem",
  component: NavItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Campagnes", href: "#campagnes" },
  decorators: [(S) => <div className="w-56 rounded-lg bg-[var(--nav-surface)] p-2"><S /></div>],
} satisfies Meta<typeof NavItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = { name: "Par défaut" };

export const Courant: Story = { name: "Entrée courante", args: { current: true, label: "Marché" } };

export const AvecCompteur: Story = {
  name: "Avec compteur",
  args: { count: 3 },
  play: async ({ canvas }) => {
    // Le compte est dans le NOM du lien, en une seule chaîne : un `sr-only`
    // séparé donnait « Campagnes , 3 en attente » — l'algorithme de nom
    // accessible joint les éléments par une espace.
    await expect(canvas.getByRole("link")).toHaveAccessibleName("Campagnes, 3 en attente");
  },
  parameters: {
    docs: {
      description: {
        story:
          "La pastille est muette pour les lecteurs d'écran : sans le compte dans le nom, " +
          "le nombre n'est qu'une tache colorée que rien n'annonce.",
      },
    },
  },
};

export const UnLienJamaisUnBouton: Story = {
  name: "Un `<a>`, jamais un `<button>`",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link")).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cette entrée CHANGE DE ROUTE. Un bouton s'annonce comme une action dans la " +
          "page, ce qui trompe sur ce qui va se passer, et prive l'utilisateur de tout ce " +
          "qu'un lien lui doit : ouvrir dans un onglet, copier l'adresse, revenir en " +
          "arrière.",
      },
    },
  },
};

function Barre({
  page,
  conversation,
}: {
  page: "accueil" | "avis";
  conversation?: boolean;
}) {
  return (
    <nav
      aria-label={page === "accueil" ? "Sur l'accueil" : "Sur une conversation"}
      className="w-64 bg-[var(--nav-surface)] p-3"
    >
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        <li>
          <NavItem label="Accueil" href="#" current={page === "accueil"} />
        </li>
        <li>
          <NavItem
            label="Gestion des avis"
            href="#"
            count={4}
            current={page === "avis" && !conversation}
            ancestor={page === "avis" && conversation}
          />
        </li>
        <li>
          <NavItem label="Cockpit du POI" href="#" />
        </li>
      </ul>
      {conversation && (
        <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
          <li>
            <NavItem
              label="Réponse à Mme Charmon"
              href="#"
              current
              density="compact"
            />
          </li>
          <li>
            <NavItem label="Parking P2 issues" href="#" density="compact" />
          </li>
        </ul>
      )}
    </nav>
  );
}

export const PageEtSection: Story = {
  name: "Le repère d'espace ne change pas d'une page à l'autre",
  render: () => (
    <div className="flex flex-wrap gap-6">
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">
          sur l'accueil — « Accueil » est la page
        </figcaption>
        <Barre page="accueil" />
      </figure>
      <figure className="m-0 flex flex-col gap-2">
        <figcaption className="text-xs text-muted-foreground">
          sur une conversation — « Gestion des avis » la contient
        </figcaption>
        <Barre page="avis" conversation />
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Une barre qui liste des SECTIONS et leur CONTENU doit marquer les " +
          "deux. La conversation ouverte est la page — `aria-current=\"page\"` " +
          "— et l'espace qui la contient reçoit `aria-current=\"location\"`, la " +
          "valeur prévue pour « la position courante dans un environnement ». " +
          "Deux `page` dans une même barre laisseraient l'utilisateur choisir " +
          "laquelle est vraie.\n\n" +
          "**Visuellement, c'est le même état.** Une première version rendait " +
          "la section plus faible — trait court, pas de fond — pour ne pas " +
          "« prétendre être la page ». Le repère de l'espace changeait alors " +
          "d'apparence d'une page à l'autre : plein sur l'accueil, pâle sur " +
          "une conversation. La question « dans quel espace suis-je » recevait " +
          "deux réponses selon la page, ce qu'un design system existe " +
          "précisément pour éviter.\n\n" +
          "Ce qui distingue les deux pour qui voit l'écran n'est pas leur " +
          "force, c'est leur **groupe**.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const [gauche, droite] = [...canvasElement.querySelectorAll("nav")].map((n) =>
      within(n),
    );

    const surAccueil = gauche.getByRole("link", { name: "Accueil" });
    const surConversation = droite.getByRole("link", { name: /Gestion des avis/i });
    const inactif = droite.getByRole("link", { name: "Cockpit du POI" });
    const laPage = droite.getByRole("link", { name: /Mme Charmon/i });

    await expect(surAccueil).toHaveAttribute("aria-current", "page");
    await expect(surConversation).toHaveAttribute("aria-current", "location");
    await expect(laPage).toHaveAttribute("aria-current", "page");
    await expect(inactif).not.toHaveAttribute("aria-current");

    // ── Le repère d'espace est IDENTIQUE d'une page à l'autre ─────────────
    //
    // C'est la comparaison exacte qu'Alice a envoyée : deux captures, deux
    // apparences pour la même question. Mesuré sur le rendu — fond, graisse,
    // hauteur du trait. Un seul des trois qui diffère et l'on ne reconnaît
    // plus le même repère.
    //
    // La comparaison se fait à densité ÉGALE. Une première version mettait
    // en regard l'espace (44 px) et la conversation (36 px, compacte) : elle
    // mesurait la densité, pas l'état, et accusait un écart qui n'en est pas
    // un.
    const etat = (el: Element) => {
      const st = getComputedStyle(el);
      const trait = el.querySelector("span[aria-hidden]");
      return {
        fond: st.backgroundColor,
        graisse: st.fontWeight,
        encre: st.color,
        trait: trait ? Math.round(trait.getBoundingClientRect().height) : 0,
      };
    };

    const a = etat(surAccueil);
    const b = etat(surConversation);
    for (const clef of ["fond", "graisse", "encre", "trait"] as const) {
      await expect(
        b[clef],
        `« ${clef} » vaut ${String(a[clef])} sur l'accueil et ` +
          `${String(b[clef])} sur une conversation : le repère d'espace ` +
          `change d'apparence selon la page affichée.`,
      ).toBe(a[clef]);
    }

    // Et l'état actif se distingue d'une entrée ordinaire sur au moins deux
    // canaux : la couleur seule ne suffit jamais (WCAG 1.4.1).
    const n = etat(inactif);
    await expect(b.fond).not.toBe(n.fond);
    await expect(b.graisse).not.toBe(n.graisse);
    await expect(n.trait).toBe(0);
  },
};
