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
