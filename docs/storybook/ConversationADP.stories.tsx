import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
// `?raw` : la page de doc montre le fichier RÉEL, pas une copie qui
// divergerait. C'est ce que « Copy code » met dans le presse-papier.
import source from "./conversation-adp.tsx?raw";
import {
  ConversationADP,
  FIL_AVIS_POSITIF,
  FIL_AVIS_SENSIBLE,
} from "./conversation-adp";

const meta = {
  title: "Assemblages/Conversation ADP",
  component: ConversationADP,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: source, language: "tsx" },
      // Le code est DÉPLIÉ d'entrée : un assemblage existe POUR être copié,
      // son code est le contenu de la page, pas une option cachée derrière
      // deux clics.
      canvas: { sourceState: "shown" },
    },
  },
  // La marque est un global de barre d'outils. Un décorateur qui poserait
  // `data-brand` sur la racine au montage et le retirerait au démontage
  // laisserait fuir la marque sur l'histoire suivante : le nettoyage arrive
  // après le montage de la suivante.
  globals: { marque: "adp", theme: "clair" },
  args: {
    titre: "Réponse à Mme Charmon, 1re visite",
    tours: FIL_AVIS_POSITIF,
    conversationCourante: "charmon",
    onEnvoyerPourValidation: fn(),
    onRepondreSurGoogle: fn(),
  },
} satisfies Meta<typeof ConversationADP>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AvisPositif: Story = {
  name: "Réponse à un avis positif — marque ADP, thème clair",
  args: { repriseManuelle: true },
  parameters: {
    docs: {
      description: {
        story:
          "L'écran de la maquette du 25/09/2026, rendu par le design system. " +
          "Les deux sorties coexistent : « Répondre sur Google » publie, " +
          "« Envoyer pour validation » passe la main. Aucune n'est masquée " +
          "selon les droits.",
      },
    },
  },
  play: async ({ canvasElement, args, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    // ── Les deux sorties coexistent, et ne pèsent pas pareil ──────────────
    //
    // Deux boutons de même poids côte à côte reposent la question à chaque
    // réponse. On ne mesure donc pas seulement leur présence : on mesure que
    // leurs fonds diffèrent.
    const publier = c.getByRole("button", { name: /Répondre sur Google/i });
    const valider = c.getByRole("button", { name: /Envoyer pour validation/i });

    const fond = (el: Element) => getComputedStyle(el).backgroundColor;
    await expect(
      fond(publier),
      `les deux sorties ont le même fond (${fond(publier)}) : rien ne dit ` +
        `laquelle est l'action principale.`,
    ).not.toBe(fond(valider));

    await u.click(valider);
    await expect(args.onEnvoyerPourValidation).toHaveBeenCalled();
    await u.click(publier);
    await expect(args.onRepondreSurGoogle).toHaveBeenCalled();

    // ── Les paragraphes du brouillon survivent ────────────────────────────
    //
    // Une réponse de service client fait quatre paragraphes — salutation,
    // corps en deux temps, signature. On compte les `<p>` RENDUS : compter
    // les sauts de ligne de la donnée, ou vérifier une classe posée sur le
    // conteneur, ne dirait rien de ce qui s'affiche. C'est précisément
    // l'erreur qu'on vient de corriger — la classe était bien là, la règle
    // CSS n'existait pas, et le texte sortait en un seul bloc.
    const bulle = c.getByText(/Bonjour Madame Charmon/).closest("div");
    const paragraphes = bulle?.querySelectorAll("p") ?? [];
    await expect(
      paragraphes.length,
      `le brouillon sort en ${paragraphes.length} paragraphe(s) : la ` +
        `salutation, le corps et la signature se fondent en un bloc.`,
    ).toBe(4);

    // ── Les actions de la barre tiennent sur une ligne ────────────────────
    //
    // Dans 207 px utiles, « Donner votre voix à ADP+ » demande exactement
    // 183 px : un remplissage de plus et il se replie en pavé de deux
    // lignes, qui ne se lit plus comme un bouton.
    //
    // Le piège est ailleurs que dans la largeur. `whitespace-nowrap` est
    // silencieusement annulé par le `text-balance` de la base de `Button` —
    // même propriété longue, `text-wrap-mode`. Mesuré 60 px de haut avec la
    // classe posée. C'est `text-nowrap` qu'il faut, et ce test mesure la
    // HAUTEUR RENDUE, pas la présence d'une classe.
    for (const libelle of [/Nouvelle conversation/, /Donner votre voix/]) {
      const b = c.getByRole("button", { name: libelle });
      const h = Math.round(b.getBoundingClientRect().height);
      await expect(
        h,
        `« ${b.textContent?.trim()} » fait ${h} px de haut : il passe sur ` +
          `deux lignes.`,
      ).toBeLessThanOrEqual(44);
    }

    // ── Les quatre actions du brouillon tiennent sur une rangée ───────────
    //
    // Sur deux rangées, « Répondre sur Google » tombe seul en dessous et la
    // hiérarchie se lit comme un repentir.
    const rangees = new Set(
      [/Reformuler/, /Modifier la réponse/, /Envoyer pour validation/, /Répondre sur Google/].map(
        (n) => Math.round(c.getByRole("button", { name: n }).getBoundingClientRect().top),
      ),
    );
    await expect(
      rangees.size,
      `les actions du brouillon se répartissent sur ${rangees.size} rangées.`,
    ).toBe(1);

    // L'origine est écrite, pas suggérée par une teinte.
    await expect(c.getByText("IA")).toBeInTheDocument();
  },
};

export const AvisSensible: Story = {
  name: "Réponse à un avis sensible — 1 étoile",
  args: {
    titre: "Vol de contenu valise",
    tours: FIL_AVIS_SENSIBLE,
    conversationCourante: "parking",
    poiCourant: "extime-2b",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Le même écran sur un avis à une étoile, POI Extime. La marque ne " +
          "change pas : Extime reste sous la DA ADP, et c'est le POI qui " +
          "change, pas le `data-brand`.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Le POI courant est écrit sur le déclencheur, pas seulement en mémoire.
    await expect(
      c.getByRole("button", { name: /Extime Duty Free Paris.*changer de POI/i }),
    ).toBeInTheDocument();
  },
};

const TRENTE = Array.from({ length: 30 }, (_, i) => ({
  id: `c${i}`,
  titre:
    i === 3
      ? "Parking P2 issues"
      : `Réponse à l'avis n°${1200 + i} — terminal ${1 + (i % 3)}`,
}));

export const BarreLaterale: Story = {
  name: "La barre latérale — pied atteignable, recherche vivante",
  args: { conversations: TRENTE, conversationCourante: "c3" },
  parameters: {
    docs: {
      description: {
        story:
          "Deux défauts corrigés, tous deux mesurés plutôt que vus.\n\n" +
          "**Le pied passait sous le pli.** Sur une fenêtre de 760 px et avec " +
          "cinq conversations, la barre faisait 880 px et le bas de son pied " +
          "tombait à 868 px : sélecteur de POI, paramètres et déconnexion " +
          "inatteignables. `mt-auto` colle le pied au bas du CONTENU, pas de " +
          "l'écran. Seuls les groupes défilent désormais.\n\n" +
          "**La recherche ne filtrait rien.** On tapait, rien ne bougeait, et " +
          "on concluait qu'il n'y avait pas de résultat.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);
    const nav = c.getByRole("navigation", { name: "Espaces ADP+" });

    // ── Le pied reste dans la barre, liste longue comprise ────────────────
    //
    // Cette histoire porte TRENTE conversations, et c'est la condition du
    // test. Mes deux premières versions mesuraient des invariances : « le
    // pied est-il dans la barre ? » l'est toujours quand la barre grandit
    // avec lui, et « le pied est-il dans la fenêtre ? » l'est toujours quand
    // cinq conversations tiennent dedans. Les deux passaient le correctif
    // retiré.
    //
    // Ce qui distingue vraiment les deux états : le débordement doit être
    // absorbé par la ZONE DES GROUPES, pas par la barre.
    const zone = nav.querySelector("[data-debord]") as HTMLElement;
    await expect(
      zone.scrollHeight,
      `la zone des groupes ne déborde pas (${zone.scrollHeight} px pour ` +
        `${zone.clientHeight} px visibles) : le test ne prouve rien, il faut ` +
        `plus de conversations.`,
    ).toBeGreaterThan(zone.clientHeight);

    const pied = nav.lastElementChild as HTMLElement;
    const basPied = Math.round(pied.getBoundingClientRect().bottom);
    const basBarre = Math.round(nav.getBoundingClientRect().bottom);
    await expect(
      basPied,
      `le pied s'arrête à ${basPied} px alors que la barre s'arrête à ` +
        `${basBarre} px : le sélecteur de POI et la déconnexion sont hors ` +
        `de la barre.`,
    ).toBeLessThanOrEqual(basBarre + 1);

    // Et le sélecteur de POI, qui vit dans ce pied, est bien atteignable.
    await expect(
      pied.contains(c.getByRole("button", { name: /changer de POI/i })),
    ).toBe(true);

    // ── On sait dans quel ESPACE on se trouve ─────────────────────────────
    //
    // Une barre qui liste des sections ET leur contenu ne peut marquer
    // qu'une seule chose avec `current`. Conversation ouverte, « Gestion des
    // avis » redevenait une entrée comme les autres, et plus rien ne disait
    // dans quel espace on était.
    //
    // Deux repères, deux valeurs : `page` pour la conversation, `location`
    // pour l'espace qui la contient. Deux `page` dans une même barre
    // laisseraient l'utilisateur choisir laquelle est vraie.
    const nav2 = within(nav);
    const espace = nav2.getByRole("link", { name: /Gestion des avis/i });
    await expect(
      espace,
      "« Gestion des avis » ne porte aucun repère : rien ne dit dans quel " +
        "espace on se trouve.",
    ).toHaveAttribute("aria-current", "location");

    const page = nav2.getByRole("link", { name: /Parking P2 issues/i });
    await expect(page).toHaveAttribute("aria-current", "page");

    // Et il n'y a QU'UNE page courante.
    const pages = [...nav.querySelectorAll('[aria-current="page"]')];
    await expect(
      pages.length,
      `${pages.length} entrées portent « page » : l'utilisateur ne peut pas ` +
        `savoir laquelle est vraie.`,
    ).toBe(1);

    // Le repère de l'espace ne tient pas à la seule couleur : sa graisse
    // passe au semi-gras, comme l'entrée courante et contrairement aux
    // voisines. Mesuré, pas déduit de la classe.
    const voisine = nav2.getByRole("link", { name: /Cockpit du POI/i });
    await expect(
      getComputedStyle(espace).fontWeight,
      "le repère d'espace ne tient qu'à la couleur.",
    ).not.toBe(getComputedStyle(voisine).fontWeight);

    // ── La liste dit qu'elle continue ─────────────────────────────────────
    //
    // Coupée net par le bord du pied, rien ne distinguait « voilà tout » de
    // « il y en a vingt-cinq de plus ».
    //
    // On mesure le COUPLAGE, pas la présence du fondu : il doit apparaître
    // exactement quand quelque chose est masqué, et disparaître quand il n'y
    // a plus rien dessous. Un fondu permanent promettrait du contenu absent,
    // et on apprendrait à ne plus le croire — ce serait pire que rien.
    await expect(
      zone.dataset.debord,
      `la zone déborde de ${zone.scrollHeight - zone.clientHeight} px et ` +
        `annonce « ${zone.dataset.debord} » : rien ne dit que la liste ` +
        `continue.`,
    ).toBe("bas");
    await expect(getComputedStyle(zone).maskImage).not.toBe("none");

    // Défilé jusqu'en bas, le fondu passe de l'autre côté.
    zone.scrollTop = zone.scrollHeight;
    await waitFor(async () => {
      await expect(
        zone.dataset.debord,
        "arrivé en bas, le fondu du bas promet encore du contenu.",
      ).toBe("haut");
    });
    zone.scrollTop = 0;

    // ── La recherche filtre, et le dit ────────────────────────────────────
    const avant = c.getAllByRole("link").length;
    const champ = c.getByRole("searchbox", { name: /Rechercher dans les conversations/i });
    await u.type(champ, "parking");

    await waitFor(async () => {
      const apres = c.getAllByRole("link").length;
      await expect(
        apres,
        `${avant} liens avant, ${apres} après : la recherche ne filtre rien.`,
      ).toBeLessThan(avant);
    });

    // Filtre sans résultat : le groupe dit POURQUOI il est vide.
    await u.clear(champ);
    await u.type(champ, "zzzz");
    await waitFor(async () => {
      await expect(
        c.getByText(/Aucune conversation ne contient/i),
      ).toBeInTheDocument();
    });
  },
};

export const ChangerDePOI: Story = {
  name: "Changer de POI — la recherche est à l'intérieur",
  parameters: {
    docs: {
      description: {
        story:
          "« Changer de POI », pas « Rechercher un autre POI » : un libellé " +
          "nomme le but, jamais le mécanisme. La recherche sert à atteindre " +
          "le but, elle n'a pas à s'afficher sur la porte.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    await u.click(c.getByRole("button", { name: /changer de POI/i }));

    // Radix monte la boîte de dialogue dans un portail, donc HORS du canevas
    // de l'histoire. La chercher dans `canvasElement` ne trouverait rien et
    // l'assertion mesurerait cette erreur, pas le composant.
    const boite = within(document.body);
    const champ = await boite.findByRole("searchbox", { name: /Rechercher un POI/i });

    const avant = boite.getAllByRole("button", { current: false }).length;
    await u.type(champ, "orly");

    await waitFor(async () => {
      const apres = boite.getAllByRole("button", { current: false }).length;
      await expect(
        apres,
        `la liste n'a pas été filtrée : ${apres} entrées avant comme après.`,
      ).toBeLessThan(avant);
    });

    await u.click(await boite.findByRole("button", { name: /Paris-Orly/i }));

    // Le déclencheur porte le nouveau POI : sinon on a changé quelque chose
    // sans que l'écran le dise.
    await waitFor(async () => {
      await expect(
        c.getByRole("button", { name: /Paris-Orly.*changer de POI/i }),
      ).toBeInTheDocument();
    });
  },
};

export const BarreRepliee: Story = {
  name: "La barre latérale se replie vraiment",
  parameters: {
    docs: {
      description: {
        story:
          "Le bouton de repli porte `aria-expanded` et `aria-controls`. La " +
          "barre est masquée par l'attribut `hidden`, pas démontée : " +
          "`aria-controls` doit désigner un élément qui existe.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    const nav = c.getByRole("navigation", { name: "Espaces ADP+" });
    await expect(nav.getBoundingClientRect().width).toBeGreaterThan(0);

    const bascule = c.getByRole("button", { name: /Replier la barre latérale/i });
    await expect(bascule).toHaveAttribute("aria-expanded", "true");
    await u.click(bascule);

    // On mesure la LARGEUR RENDUE, pas la présence de l'attribut : un
    // conteneur en `display:contents` porte `hidden` sans rien masquer,
    // parce que la classe l'emporte sur la feuille de style du navigateur.
    await waitFor(async () => {
      await expect(
        nav.getBoundingClientRect().width,
        "la barre porte `hidden` mais occupe toujours sa place à l'écran.",
      ).toBe(0);
    });

    await expect(
      c.getByRole("button", { name: /Déplier la barre latérale/i }),
    ).toHaveAttribute("aria-expanded", "false");
  },
};
