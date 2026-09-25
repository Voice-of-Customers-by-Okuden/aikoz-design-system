import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Brouillon, FIL_AVIS_POSITIF } from "./conversation-adp";

/**
 * L'arbitrage, rendu côte à côte plutôt que raconté.
 *
 * La question posée par Alice : le brouillon doit-il se présenter comme un
 * BLOC PRÊT À COLLER — ce que faisait la version de Louis — ou comme un
 * texte posé sur sa carte ?
 */
const TEXTE = (FIL_AVIS_POSITIF[2] as { texte: string }).texte;

function Colonne({
  titre,
  dit,
  children,
}: {
  titre: string;
  dit: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <h3 className="m-0 text-sm font-semibold">{titre}</h3>
      <p className="m-0 text-xs text-[var(--muted-foreground)]">{dit}</p>
      <ol className="m-0 flex list-none flex-col p-0">{children}</ol>
    </div>
  );
}

function Comparaison() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
      <Colonne
        titre="Bloc prêt à coller"
        dit="« Ce texte a des bords. On le prend entier, et il peut partir ailleurs. » Le cadre, la barre de titre et le bouton de copie posé dessus forment le vocabulaire universel du prêt-à-coller : clé d'API, extrait de code, modèle d'e-mail."
      >
        <Brouillon
          texte={TEXTE}
          heure="19:49"
          presentation="bloc"
          precision="bloc prêt à coller"
          repriseManuelle
        />
      </Colonne>
      <Colonne
        titre="Posé sur la carte"
        dit="« Ce texte est le contenu de l'écran. » Plus calme, une surface de moins — mais rien ne dit qu'on peut l'emporter, alors que le repli vers Google My Business demande précisément de l'emporter."
      >
        <Brouillon
          texte={TEXTE}
          heure="19:49"
          presentation="pose"
          precision="posé sur la carte"
          repriseManuelle
        />
      </Colonne>
    </div>
  );
}

const meta = {
  title: "Assemblages/Conversation ADP/Présentation du brouillon",
  component: Comparaison,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  globals: { marque: "adp", theme: "clair" },
} satisfies Meta<typeof Comparaison>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CoteACote: Story = {
  name: "Bloc prêt à coller, ou posé sur la carte",
  parameters: {
    docs: {
      description: {
        story:
          "Deux présentations du même brouillon, côte à côte.\n\n" +
          "**Ce qui les sépare n'est pas l'esthétique, c'est ce qu'elles " +
          "promettent.** Un cadre dit que l'objet a des bords et qu'on peut " +
          "l'emporter ; une surface plate dit qu'il se lit et se valide ici. " +
          "Tant que « Répondre sur Google » peut échouer et renvoyer au " +
          "copier-coller, le brouillon est un objet qui peut partir ailleurs.\n\n" +
          "**Ni l'une ni l'autre n'est la citation en creux de `ReplyBubble`.** " +
          "Ce liseré gauche sans bordure dit « je suis subordonné à ce qui est " +
          "au-dessus de moi » — vrai dans le Kanban, où la réponse suit le " +
          "verbatim ; faux ici, où le brouillon est le sujet.\n\n" +
          "**La chasse fixe reste écartée dans les deux cas.** Elle dirait " +
          "« contenu littéral, à recopier caractère par caractère ». C'est une " +
          "lettre signée par l'aéroport, et l'affordance de copie est déjà " +
          "portée par le cadre et par le bouton.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    // ── Le bloc se distingue vraiment de sa carte ─────────────────────────
    //
    // Mesuré sur le rendu, pas déduit des classes : un cadre qui ne se voit
    // pas ne promet rien, et l'arbitrage n'aurait alors qu'une option.
    const blocs = canvasElement.querySelectorAll("section");
    const carteBloc = blocs[0];
    const cadre = carteBloc.querySelector(":scope > div");
    const st = getComputedStyle(cadre as Element);
    const fondCarte = getComputedStyle(carteBloc).backgroundColor;

    await expect(
      st.borderTopWidth,
      "le bloc n'a pas de cadre : rien ne dit qu'il a des bords.",
    ).not.toBe("0px");
    await expect(
      st.backgroundColor,
      `le bloc (${st.backgroundColor}) a le même fond que sa carte : la ` +
        `bordure est le seul canal, et elle ne suffit pas à poser un objet.`,
    ).not.toBe(fondCarte);

    // ── Le bouton de copie est DANS le bloc ───────────────────────────────
    //
    // Une affordance de copie se pose sur ce qu'elle copie. Posée à côté,
    // elle laisse deviner ce qu'elle emporte.
    const copier = c.getAllByRole("button", { name: /Copier/i })[0];
    await expect(
      cadre?.contains(copier),
      "le bouton « Copier » est hors du bloc qu'il copie.",
    ).toBe(true);

    // ── Aucune des deux n'est en chasse fixe ──────────────────────────────
    for (const p of canvasElement.querySelectorAll("p.text-sm")) {
      const f = getComputedStyle(p).fontFamily.toLowerCase();
      await expect(
        f.includes("mono") || f.includes("courier"),
        `un paragraphe du brouillon est en chasse fixe (${f}) : ce texte est ` +
          `une lettre, pas du code à recopier.`,
      ).toBe(false);
    }
  },
};
