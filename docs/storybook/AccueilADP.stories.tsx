import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import source from "./accueil-adp.tsx?raw";
import { AccueilADP } from "./accueil-adp";

const meta = {
  title: "Assemblages/Accueil ADP",
  component: AccueilADP,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: source, language: "tsx" },
      canvas: { sourceState: "shown" },
    },
  },
  globals: { marque: "adp", theme: "clair" },
} satisfies Meta<typeof AccueilADP>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RondPoint: Story = {
  name: "Le rond-point — marque ADP, thème clair",
  parameters: {
    docs: {
      description: {
        story:
          "On arrive, on confirme sur quel POI on travaille, puis on choisit " +
          "sa route.\\n\\n" +
          "**Le POI est au-dessus des portes** parce que tout ce qui suit en " +
          "dépend : le cockpit est celui de ce POI, les avis sont les siens, " +
          "la conversation répond en son nom. Se tromper de POI et s'en " +
          "apercevoir trois écrans plus loin est le scénario que cette page " +
          "existe pour éviter.\\n\\n" +
          "**Ce n'est pas un menu.** Un menu répéterait ce que la barre " +
          "latérale dit déjà. Chaque porte porte le chiffre qui dit s'il faut " +
          "y aller — quatre avis sensibles en attente, 3,7/5 sur ce POI, " +
          "93 POI suivis.\\n\\n" +
          "**Les paramètres ne sont pas une quatrième porte.** On n'y va pas " +
          "en arrivant, on y passe. Une quatrième carte de même poids aurait " +
          "fait de la rangée un menu : quatre cases équivalentes ne " +
          "hiérarchisent plus rien.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    // ── Le POI vient AVANT les portes ─────────────────────────────────────
    //
    // Mesuré en position à l'écran, pas déduit de l'ordre du JSX : une
    // grille ou un `order` suffirait à inverser les deux sans toucher au
    // code source.
    const poi = c.getByRole("heading", { name: /Vous travaillez sur/i });
    const routes = c.getByRole("heading", { name: /Où allez-vous/i });
    const hautPoi = Math.round(poi.getBoundingClientRect().top);
    const hautRoutes = Math.round(routes.getBoundingClientRect().top);
    await expect(
      hautPoi,
      `le bloc POI est à ${hautPoi} px et les routes à ${hautRoutes} px : on ` +
        `choisit sa route avant de savoir sur quel POI on travaille.`,
    ).toBeLessThan(hautRoutes);

    // Le POI courant est écrit dans la PAGE, pas seulement sur un
    // déclencheur.
    //
    // Portée sur le bloc titre + nom, et pas sur la section : celle-ci
    // contient AUSSI le sélecteur, dont le déclencheur affiche le même nom.
    // La première version cherchait dans la section et trouvait deux
    // éléments — ce qui prouvait le contraire de ce que je voulais montrer,
    // puisque l'un des deux était le bouton.
    await expect(
      within(poi.parentElement!).getByText("Aéroport de Paris-Charles de Gaulle"),
    ).toBeInTheDocument();

    // ── Et il n'est écrit QU'UNE FOIS dans cette carte ────────────────────
    //
    // Le déclencheur du pied de barre porte le nom du lieu, parce que rien
    // d'autre ne le dit là-bas. Dans cette carte le nom est déjà la
    // manchette : le répéter sur le bouton n'informait personne et faisait
    // hésiter sur lequel des deux fait foi. D'où la forme `bouton`.
    // On compte le VISIBLE, sr-only retiré : le bouton porte bien le nom du
    // lieu dans son nom accessible — « Changer de POI — actuellement
    // Aéroport de Paris-Charles de Gaulle » — et c'est voulu, sinon il ne
    // dirait pas de quel POI on part. Ma première version comptait
    // `textContent`, donc le sr-only, et accusait un doublon qui n'existe
    // pas à l'écran.
    const carte = poi.closest("section")!.cloneNode(true) as HTMLElement;
    carte.querySelectorAll(".sr-only").forEach((e) => e.remove());
    const fois = (carte.textContent?.match(/Aéroport de Paris-Charles de Gaulle/g) ?? [])
      .length;
    await expect(
      fois,
      `le nom du POI est écrit ${fois} fois À L'ÉCRAN dans la carte ` +
        `« Vous travaillez sur ».`,
    ).toBe(1);

    // Les portes se cherchent DANS leur section.
    //
    // `getAllByRole("link", { name: /Gestion des avis/i })` en trouvait deux :
    // l'entrée de la barre latérale porte le même nom, et c'est elle qui
    // arrivait en premier. Le test mesurait alors la hauteur d'un lien de
    // menu — 44 px — et concluait que la carte n'était pas cliquable.
    const rangee = within(routes.closest("section")!);

    // ── Le nom et son bouton se répondent, ils ne s'empilent pas ──────────
    //
    // La base de `Card` pose `flex-col`, et `tailwind-merge` ne le retire que
    // si on lui donne une classe du même groupe. `flex-wrap items-center`
    // n'en est pas une : le nom du POI et le bouton s'empilaient au centre.
    // On mesure leur position, pas les classes.
    const bouton = within(poi.closest("section")!).getByRole("button", {
      name: /changer de POI/i,
    });
    const gauche = Math.round(poi.getBoundingClientRect().left);
    const droite = Math.round(bouton.getBoundingClientRect().left);
    await expect(
      droite,
      `le bouton « Changer de POI » commence à ${droite} px et le titre à ` +
        `${gauche} px : ils sont empilés au lieu de se répondre.`,
    ).toBeGreaterThan(gauche + 200);

    // ── La carte entière est le lien ──────────────────────────────────────
    //
    // Un « Ouvrir » de 60 px dans une carte de 300 × 130 pose la question de
    // savoir lequel des deux répond au clic. On mesure la CIBLE.
    const portes = ["Gestion des avis", "Cockpit du POI", "Tableau de bord ADP"];
    for (const nom of portes) {
      const lien = rangee.getByRole("link", { name: new RegExp(nom, "i") });
      const b = lien.getBoundingClientRect();
      await expect(
        Math.round(b.height),
        `la porte « ${nom} » fait ${Math.round(b.width)} × ${Math.round(b.height)} px : ` +
          `ce n'est pas la carte qui est cliquable.`,
      ).toBeGreaterThan(100);
    }

    // ── Chaque porte porte son chiffre ────────────────────────────────────
    //
    // Sans chiffre, la page ne fait que ralentir le trajet. Le test lit le
    // TEXTE rendu de chaque carte : une carte qui aurait perdu sa donnée
    // resterait jolie et inutile.
    for (const [nom, motif] of [
      ["Gestion des avis", /\d+\s+avis sensibles en attente|Aucun avis sensible/],
      ["Cockpit du POI", /\d+,\d\/5/],
      ["Tableau de bord ADP", /\d+\s+POI/],
    ] as const) {
      const lien = rangee.getByRole("link", { name: new RegExp(nom, "i") });
      await expect(
        lien.textContent ?? "",
        `la porte « ${nom} » n'affiche aucun chiffre : elle ne dit pas s'il ` +
          `faut y aller.`,
      ).toMatch(motif);
    }

    // ── Une seule porte est principale ────────────────────────────────────
    //
    // Deux portes appuyées ne hiérarchisent plus rien. On compte les liserés
    // RENDUS, pas les props.
    const liseres = portes.map((nom) =>
      getComputedStyle(rangee.getByRole("link", { name: new RegExp(nom, "i") }))
        .borderTopColor,
    );
    await expect(
      new Set(liseres).size,
      `les trois portes ont ${new Set(liseres).size} liseré(s) distinct(s) : ` +
        `il en faut exactement deux — une principale, deux ordinaires.`,
    ).toBe(2);
  },
};

export const AucunAvisEnAttente: Story = {
  name: "Rien en attente — la porte le dit",
  args: { avisEnAttente: 0 },
  parameters: {
    docs: {
      description: {
        story:
          "Un compteur à zéro ne se masque pas : « Aucun avis sensible en " +
          "attente » est une information, l'absence de badge n'en est pas une. " +
          "Sans elle, on ouvre la porte pour vérifier — exactement ce que le " +
          "rond-point doit éviter.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText(/Aucun avis sensible en attente/i)).toBeInTheDocument();

    // La barre latérale, elle, se TAIT — pas de pastille « 0 ».
    //
    // Deux règles opposées, et c'est voulu. Sur une carte dont le rôle est
    // de dire s'il faut s'y rendre, le silence est ambigu : a-t-elle chargé ?
    // Dans une barre permanente, une pastille « 0 » occupe la place, attire
    // l'œil et fait annoncer « Gestion des avis, 0 en attente » là où le
    // libellé suffisait.
    const nav = within(c.getByRole("navigation", { name: "Espaces ADP+" }));
    const entree = nav.getByRole("link", { name: /Gestion des avis/i });
    await expect(
      entree.textContent,
      "l'entrée de barre affiche un compteur à zéro.",
    ).toBe("Gestion des avis");
    await expect(entree).toHaveAccessibleName("Gestion des avis");
  },
};

export const ChangerDePOIDepuisLAccueil: Story = {
  name: "Changer de POI, option n°1",
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    // Deux déclencheurs — le pied de la barre et le bloc de l'accueil — mais
    // UN SEUL composant. Deux contrôles pour le même choix divergeraient, et
    // l'un des deux finirait par mentir.
    const declencheurs = c.getAllByRole("button", { name: /changer de POI/i });
    await expect(
      declencheurs,
      "il doit y en avoir deux — le pied de la barre et le bloc de l'accueil " +
        "— et ce doit être le même composant.",
    ).toHaveLength(2);

    // Celui de la PAGE, pas celui du pied : c'est l'option n°1 du rond-point.
    const titre = c.getByRole("heading", { name: /Vous travaillez sur/i });
    const dansLaPage = within(titre.closest("section")!).getByRole("button", {
      name: /changer de POI/i,
    });
    await u.click(dansLaPage);
    const boite = within(document.body);
    const champ = await boite.findByRole("searchbox", { name: /Rechercher un POI/i });
    await u.type(champ, "orly");
    await u.click(await boite.findByRole("button", { name: /Paris-Orly/i }));

    // Le POI courant est repris DANS LA PAGE, pas seulement sur le
    // déclencheur : c'est le bloc « Vous travaillez sur » qui le dit.
    await waitFor(async () => {
      const t = c.getByRole("heading", { name: /Vous travaillez sur/i });
      await expect(
        within(t.parentElement!).getByText("Aéroport de Paris-Orly"),
        "le pied de barre a changé de POI, le bloc « Vous travaillez sur » " +
          "annonce encore l'ancien : deux sources de vérité.",
      ).toBeInTheDocument();
    });
  },
};
