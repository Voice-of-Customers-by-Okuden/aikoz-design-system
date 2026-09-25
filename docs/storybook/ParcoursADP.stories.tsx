import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import source from "./parcours-adp.tsx?raw";
import { AVIS_SENSIBLES, ParcoursADP } from "./parcours-adp";

const AVIS_UN = AVIS_SENSIBLES[0];

const meta = {
  title: "Assemblages/Parcours ADP",
  component: ParcoursADP,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: source, language: "tsx" },
      canvas: { sourceState: "shown" },
    },
  },
  globals: { marque: "adp", theme: "clair" },
} satisfies Meta<typeof ParcoursADP>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DuTableauALaValidation: Story = {
  name: "Du tableau à la validation, et retour",
  parameters: {
    docs: {
      description: {
        story:
          "Les deux écrans déjà publiés, branchés l'un sur l'autre. **Rien de " +
          "nouveau n'est dessiné** : `ResponseKanban` émettait déjà " +
          "`onDraftReply`, `Brouillon` émettait déjà `onEnvoyerPourValidation`. " +
          "Les deux bouts existaient, personne ne les avait reliés.\\n\\n" +
          "Cliquez « Rédiger une réponse » sur un avis sensible, puis " +
          "« Envoyer pour validation ».\\n\\n" +
          "**L'action avait besoin d'une destination.** Le tableau n'avait que " +
          "trois colonnes : « Envoyer pour validation » n'avait nulle part où " +
          "faire arriver l'avis, et n'avait donc aucune conséquence visible. " +
          "La quatrième colonne est posée juste après les avis sensibles — " +
          "voir l'avis passer d'une colonne à sa voisine EST la conséquence.\\n\\n" +
          "**Le fil s'ouvre sur l'avis entier**, et non sur un résumé d'une " +
          "ligne : on ne juge pas une réponse sans la plainte qu'elle traite. " +
          "Et l'on revient au tableau tout seul, avec un message qui dit à qui " +
          "la réponse est partie et qui propose d'enchaîner.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    // ── Au départ : deux sensibles, rien en validation ────────────────────
    // On compte les CARTES rendues, pas la pastille de compteur.
    //
    // La pastille est un affichage du total ; ce qu'on veut prouver est que
    // l'avis a physiquement changé de colonne. Une pastille juste au-dessus
    // d'une colonne vide serait le défaut le plus dur à voir.
    const compte = (nom: RegExp) =>
      c.getByRole("region", { name: nom }).querySelectorAll("article").length;
    await expect(c.getByRole("region", { name: /Avis sensibles/i })).toBeInTheDocument();
    await expect(
      c.getByRole("region", { name: /En attente de validation/i }),
      "la colonne de destination n'existe pas : « Envoyer pour validation » " +
        "n'a nulle part où faire arriver l'avis.",
    ).toBeInTheDocument();

    const sensiblesAvant = compte(/Avis sensibles/i);
    await expect(sensiblesAvant).toBe(2);
    await expect(compte(/En attente de validation/i)).toBe(0);

    // ── On ouvre la conversation ──────────────────────────────────────────
    await u.click(c.getAllByRole("button", { name: /Rédiger une réponse/i })[0]);

    // L'avis ENTIER ouvre le fil, pas un résumé d'une ligne.
    const fil = await c.findByText(/Contrôle de sûreté humiliant/);
    await expect(
      fil,
      "le fil s'ouvre sans l'avis : on ne peut pas juger la réponse sans la " +
        "plainte qu'elle traite.",
    ).toBeInTheDocument();

    // ── On envoie, et le tableau revient ──────────────────────────────────
    await u.click(await c.findByRole("button", { name: /Envoyer pour validation/i }));

    await waitFor(async () => {
      await expect(
        c.getByRole("region", { name: /En attente de validation/i }),
        "on reste dans la conversation : l'envoi n'a aucune conséquence visible.",
      ).toBeInTheDocument();
    });

    // L'avis a changé de colonne, et les deux compteurs le disent.
    await expect(
      compte(/Avis sensibles/i),
      "l'avis est resté dans « Avis sensibles ».",
    ).toBe(sensiblesAvant - 1);
    await expect(compte(/En attente de validation/i)).toBe(1);

    // Le badge nomme QUI doit valider — « en attente » tout court laisserait
    // chercher à qui réclamer.
    await expect(c.getByText(/Chez Responsable qualité CDG/)).toBeInTheDocument();

    // ── Le message dit où c'est parti, et propose d'enchaîner ─────────────
    // ── Trois commandes, trois poids ──────────────────────────────────────
    //
    // Les trois colonnes proposent chacune une action différente, et elles
    // sont visibles en même temps. « Voir la réponse » était en `ghost` :
    // la colonne signalait un problème sans offrir de chemin apparent pour
    // le régler. Montée à `outline` elle devenait « Relire ma réponse », à
    // `default` elle devenait « Rédiger ».
    //
    // On mesure les FONDS rendus, pas les noms de variantes.
    // `getAllBy…[0]` : la colonne hors charte porte deux avis, donc deux
    // boutons « Voir la réponse ». Ils sont identiques par construction ;
    // c'est le premier de chaque famille qu'on compare.
    const poids = ["Rédiger une réponse", "Relire ma réponse", "Voir la réponse"].map(
      (nom) =>
        getComputedStyle(c.getAllByRole("button", { name: nom })[0]).backgroundColor,
    );
    await expect(
      new Set(poids).size,
      `les trois commandes du tableau se peignent avec ${new Set(poids).size} ` +
        `fond(s) : ${poids.join(" · ")}.`,
    ).toBe(3);

    // Le message est cherché par son BOUTON, puis lu dans son conteneur.
    //
    // `findByText` en trouvait deux : `Toast` écrit son message à l'écran ET
    // dans une région annoncée, et c'est juste — un message seulement
    // affiché ne prévient pas qui ne voit pas l'écran. C'est la mesure qui
    // était ambiguë, pas le composant.
    const suivant = await within(document.body).findByRole("button", {
      name: /Avis suivant/i,
    });
    await expect(
      suivant.closest("[role='status'], [role='alert'], li, div")?.textContent ?? "",
      "le message ne dit pas à qui la réponse est partie.",
    ).toMatch(/Réponse envoyée à Responsable qualité CDG/);
  },
};

export const DernierAvisTraite: Story = {
  name: "Le dernier avis traité — plus rien à enchaîner",
  args: { avis: [AVIS_UN] },
  parameters: {
    docs: {
      description: {
        story:
          "Quand il ne reste rien, le message n'offre pas « Avis suivant » : " +
          "une action qui ne mène nulle part est pire qu'une action absente. " +
          "La colonne des avis sensibles dit alors qu'elle est vide, et " +
          "pourquoi.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);

    await u.click(c.getAllByRole("button", { name: /Rédiger une réponse/i })[0]);
    await u.click(await c.findByRole("button", { name: /Envoyer pour validation/i }));

    await waitFor(async () => {
      await expect(c.getByText(/Aucun avis sensible à traiter/i)).toBeInTheDocument();
    });
    await expect(
      within(document.body).queryByRole("button", { name: /Avis suivant/i }),
      "« Avis suivant » est proposé alors qu'il n'y a plus d'avis.",
    ).not.toBeInTheDocument();
  },
};

export const ToutesLesPagesReliees: Story = {
  name: "Toutes les pages sont reliées",
  args: { espaceInitial: "accueil" },
  parameters: {
    docs: {
      description: {
        story:
          "La barre latérale navigue vraiment, et les portes du rond-point " +
          "aussi. Une entrée de navigation qui ne navigue pas est le même " +
          "mensonge d'interface qu'un champ de recherche qui ne filtre " +
          "rien.\n\n" +
          "Les entrées restent des `<a>` avec une ancre réelle : le clic est " +
          "intercepté faute de routeur, mais clic milieu, « ouvrir dans un " +
          "onglet » et retour arrière continueront de vouloir dire quelque " +
          "chose le jour où l'application en aura un.\n\n" +
          "**Cockpit du POI et Tableau de bord ADP ne sont pas montés.** La " +
          "navigation y mène et l'écran le dit. Un lien vers un écran qui " +
          "s'annonce vide vaut mieux qu'un lien mort : on sait où l'on a " +
          "cliqué, et on sait ce qui manque. Une page inventée qui " +
          "ressemblerait à un cockpit ferait croire à un espace livré.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);
    const nav = () => within(c.getByRole("navigation", { name: "Espaces ADP+" }));

    // On part de l'accueil.
    await expect(c.getByRole("heading", { name: /Où allez-vous/i })).toBeInTheDocument();

    // ── Une porte du rond-point mène vraiment à son espace ────────────────
    const rangee = within(
      c.getByRole("heading", { name: /Où allez-vous/i }).closest("section")!,
    );
    await u.click(rangee.getByRole("link", { name: /Gestion des avis/i }));
    await waitFor(async () => {
      await expect(
        c.getByRole("region", { name: /Avis sensibles/i }),
        "la porte « Gestion des avis » ne mène nulle part.",
      ).toBeInTheDocument();
    });

    // ── Et la barre aussi, dans les deux sens ─────────────────────────────
    await u.click(nav().getByRole("link", { name: /Cockpit du POI/i }));
    await waitFor(async () => {
      await expect(
        c.getByText(/Cockpit du POI n'est pas encore monté/i),
        "l'entrée « Cockpit du POI » ne mène nulle part, ou mène à un écran " +
          "qui ne dit pas ce qu'il est.",
      ).toBeInTheDocument();
    });

    await u.click(nav().getByRole("link", { name: "Accueil" }));
    await waitFor(async () => {
      await expect(c.getByRole("heading", { name: /Où allez-vous/i })).toBeInTheDocument();
    });

    // ── Le même fait porte la même couleur d'un écran à l'autre ───────────
    //
    // « 1 avis sensible en attente » sur l'accueil et le compteur de la
    // colonne « Avis sensibles » disent LA MÊME CHOSE. L'un était jaune et
    // l'autre rouge : on se redemande à chaque écran ce que la couleur veut
    // dire.
    //
    // On ne compare pas les couleurs à l'identique — la porte est une
    // étiquette cernée, le compteur un aplat plein, et c'est normal. On
    // compare leur TEINTE : un rouge et un jaune sont à plus de 40° l'un de
    // l'autre en OKLCH, deux rouges à quelques degrés.
    const teinte = (couleur: string) => {
      const m = couleur.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
      return m ? Number(m[3]) : NaN;
    };

    await u.click(nav().getByRole("link", { name: "Accueil" }));
    const porte = await waitFor(() =>
      c.getByText(/avis sensibles? en attente/i),
    );
    const teintePorte = teinte(getComputedStyle(porte).color);

    await u.click(nav().getByRole("link", { name: /Gestion des avis/i }));
    const colonne = await waitFor(() =>
      c.getByRole("region", { name: /Avis sensibles/i }),
    );
    // Le compteur est le second enfant de l'en-tête de colonne. Le
    // chercher par un texte purement numérique ne marchait pas : `CountBadge`
    // ajoute un énoncé lu en plus du chiffre visible.
    const compteur = colonne.querySelector<HTMLElement>(":scope > div > span");
    await expect(
      compteur,
      "compteur de colonne introuvable : le test ne mesure rien.",
    ).not.toBeNull();
    const teinteCompteur = teinte(getComputedStyle(compteur!).backgroundColor);

    await expect(
      Math.abs(teintePorte - teinteCompteur),
      `la porte de l'accueil est à ${Math.round(teintePorte)}° et le compteur ` +
        `du tableau à ${Math.round(teinteCompteur)}° : le même fait change de ` +
        `couleur d'un écran à l'autre.`,
    ).toBeLessThan(40);

    // ── Il n'y a pas de colonne « Réponses automatisées » ─────────────────
    //
    // ADP n'automatise pas. La colonne existe encore dans le composant pour
    // les produits qui le font — elle n'est simplement pas déclarée ici.
    await u.click(nav().getByRole("link", { name: /Gestion des avis/i }));
    await waitFor(async () => {
      await expect(c.getByRole("region", { name: /Avis sensibles/i })).toBeInTheDocument();
    });
    await expect(
      c.queryByRole("region", { name: /Réponses automatisées/i }),
      "le tableau annonce une colonne d'automatisation qu'ADP n'a pas.",
    ).not.toBeInTheDocument();
  },
};

export const RelireEtReprendre: Story = {
  name: "Relire une réponse envoyée, et la reprendre",
  parameters: {
    docs: {
      description: {
        story:
          "« Relire ma réponse » ouvre la MÊME fiche que la colonne hors " +
          "charte, et pour la même raison : on ne relit pas une réponse sans " +
          "l'avis qu'elle traite.\n\n" +
          "Elle renvoyait auparavant l'identifiant à l'appelant sans rien " +
          "ouvrir. Une commande qui porte un verbe doit pouvoir le tenir — " +
          "et pour ça, `PendingValidationItem` devait porter la réponse, ce " +
          "qui n'était pas le cas.\n\n" +
          "« Modifier la réponse » reprend l'avis au valideur et le ramène en " +
          "rédaction : l'inverse exact de l'envoi.",
      },
    },
  },
  play: async ({ canvasElement, userEvent: ue }) => {
    const u = ue ?? userEvent;
    const c = within(canvasElement);
    const boite = () => within(document.body);

    // On envoie une réponse, pour avoir quelque chose à relire.
    await u.click(c.getAllByRole("button", { name: /Rédiger une réponse/i })[0]);
    await u.click(await c.findByRole("button", { name: /Envoyer pour validation/i }));
    await waitFor(async () => {
      await expect(c.getByText(/Chez Responsable qualité CDG/)).toBeInTheDocument();
    });

    // ── La fiche montre l'avis ET la réponse ──────────────────────────────
    await u.click(c.getByRole("button", { name: /Relire ma réponse/i }));
    const fiche = await boite().findByRole("dialog");
    await expect(
      within(fiche).getByText(/Contrôle de sûreté humiliant/),
      "la fiche ne montre pas l'avis : on ne peut pas juger la réponse sans " +
        "la plainte qu'elle traite.",
    ).toBeInTheDocument();
    await expect(
      within(fiche).getByText(/Madame Meunier/),
      "la fiche ne montre pas la réponse : « Relire ma réponse » n'a rien à " +
        "relire.",
    ).toBeInTheDocument();

    // ── « Modifier » reprend vraiment l'avis ──────────────────────────────
    await u.click(within(fiche).getByRole("button", { name: /Modifier la réponse/i }));

    // On repart en rédaction sur cet avis…
    await waitFor(async () => {
      await expect(c.getByText(/Contrôle de sûreté humiliant/)).toBeInTheDocument();
      await expect(
        c.queryByRole("button", { name: /Relire ma réponse/i }),
        "on est resté sur le tableau : « Modifier » n'a pas rouvert la " +
          "rédaction.",
      ).not.toBeInTheDocument();
    });
    await expect(
      await c.findByRole("button", { name: /Envoyer pour validation/i }),
    ).toBeInTheDocument();
  },
};
