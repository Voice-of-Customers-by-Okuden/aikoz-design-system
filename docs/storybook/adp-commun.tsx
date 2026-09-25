/**
 * Le socle commun des écrans ADP+ — pictogrammes, POI, sélecteur de POI et
 * coquille de page.
 *
 * Deux assemblages s'en servent, `conversation-adp` et `accueil-adp`, et ce
 * fichier existe pour ça. Un assemblage se COPIE : celui qui prend l'un des
 * deux écrans prend ce fichier avec, et s'il prend les deux il ne copie pas
 * deux barres latérales qui divergeront au premier correctif.
 *
 * Il ne dépend que de composants publiés du registry.
 */

import {
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { SidebarNav } from "@registry/aikoz/sidebar-nav/sidebar-nav";
import { BrandMark } from "@registry/aikoz/brand-mark/brand-mark";
import { Button } from "@registry/aikoz/button/button";
import { Input } from "@registry/aikoz/input/input";
import { Dialog } from "@registry/aikoz/dialog/dialog";
import { Select } from "@registry/aikoz/select/select";
import { cn } from "@registry/aikoz/lib/utils";


// ─── Pictogrammes ────────────────────────────────────────────────────────────
//
// Filaires, en `currentColor`, décoratifs : le libellé porte le sens, et
// chacun est `aria-hidden`.
//
// `strokeWidth` est en unités du VIEWBOX, pas en pixels. Ces tracés ont un
// viewBox de 24 et s'affichent en 16 px : pour 1,5 px rendus il faut
// 1,5 × 24 / 16 = 2,25. C'est la même valeur que sur le tableau de bord —
// une rangée de pictogrammes d'épaisseurs différentes est le premier défaut
// qu'on voit sur un écran dense.

export function Ico({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d.split("|").map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}

export const D = {
  plus: "M12 5v14|M5 12h14",
  bulle: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  loupe: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.3-4.3",
  maison: "M3 10.5 12 3l9 7.5|M5 9.5V21h14V9.5",
  graphe: "M3 3v18h18|M8 16V11|M12.5 16V7|M17 16v-3",
  jauge: "M12 21a9 9 0 1 0-9-9|M3 12a9 9 0 0 1 18 0|M12 12l4-3",
  // Une roue dentée, pas la clé à molette illisible d'avant : son tracé
  // tenait en deux segments qui, à 16 px, ne formaient plus rien de
  // reconnaissable. Un pictogramme qu'on ne reconnaît pas ne repère rien,
  // et vaut moins que pas de pictogramme du tout.
  reglages:
    "M19.4 13a7.7 7.7 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.7 7.7 0 0 0-1.7-1L15 3H9l-.3 3a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.5L4.6 11a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.7 7.7 0 0 0 1.7 1L9 21h6l.3-3a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5z|M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  sortie: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4|M10 17l5-5-5-5|M15 12H3",
  panneau: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z|M10 4v16",
  chevrons: "M8 9l4-4 4 4|M16 15l-4 4-4-4",
  copie: "M9 9h10v12H9z|M15 9V5H5v12h4",
  refaire: "M3 12a9 9 0 0 1 15.3-6.4L21 8|M21 3v5h-5|M21 12a9 9 0 0 1-15.3 6.4L3 16|M3 21v-5h5",
  crayon: "M4 20h4L20 8l-4-4L4 16v4z|M14 6l4 4",
  envoi: "M4 12 20 4l-8 16-2-6-6-2z",
  valider: "M20 6 9 17l-5-5",
  epingle:
    "M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z|M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  personne: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M5 20a7 7 0 0 1 14 0",
  // L'avatar de l'assistant NE PEUT PAS être le logo de la marque.
  // Mesuré : le fichier ADP fait 300 × 103 px, soit un rapport de 2,91:1.
  // Posé dans une pastille de 28 px, il rend 28 × 9,6 px — la mention
  // « GROUPE ADP » y fait 4 px de haut. Un logo qu'on écrase n'est plus
  // le logo que le client a validé, et la charte de marque l'interdit.
  //
  // Ce glyphe parle la même langue que l'étiquette « IA » de
  // `ReplyBubble` : l'avatar dit qui parle, le badge dit ce qui a écrit.
  assistant: "M12 3v3|M12 18v3|M5.6 5.6l2.1 2.1|M16.3 16.3l2.1 2.1|M3 12h3|M18 12h3|M5.6 18.4l2.1-2.1|M16.3 7.7l2.1-2.1|M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
} as const;

/**
 * Drapeau en emoji, par code pays ISO 3166-1 alpha-2.
 *
 * Les indicatifs régionaux Unicode (U+1F1E6…) : « FR » devient 🇫🇷 sans
 * qu'aucune image n'entre dans le dépôt. Windows ne compose pas ces paires
 * et affiche les deux lettres — un repli acceptable, justement parce que le
 * drapeau ne porte aucune information.
 */
export function Drapeau({ code }: { code: string }) {
  const emoji = [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
  return (
    <span aria-hidden="true" className="text-sm leading-none">
      {emoji}
    </span>
  );
}

// ─── Les données de l'écran ──────────────────────────────────────────────────

/** Un point d'intérêt : un terminal, une boutique, un salon. */
export interface POI {
  id: string;
  nom: string;
  /** Regroupement dans le sélecteur — « Aéroports », « Commerces ». */
  groupe?: string;
}

/**
 * Un tour de parole.
 *
 * `brouillon` n'est pas une variante de `assistant` : un brouillon se relit,
 * se reformule et se publie, il porte donc une barre d'actions que les deux
 * autres n'ont pas. Deux comportements, deux types.
 */
export const POIS: POI[] = [
  { id: "cdg", nom: "Aéroport de Paris-Charles de Gaulle", groupe: "Aéroports" },
  { id: "orly", nom: "Aéroport de Paris-Orly", groupe: "Aéroports" },
  { id: "lbg", nom: "Aéroport de Paris-Le Bourget", groupe: "Aéroports" },
  {
    id: "extime-2b",
    nom: "Extime Duty Free Paris | Paris-CDG - Terminal 2B / 2D",
    groupe: "Commerces",
  },
  {
    id: "extime-2e",
    nom: "Extime Duty Free Paris | Paris-CDG - Terminal 2E Porte K",
    groupe: "Commerces",
  },
  { id: "halles", nom: "Les Halles by Extime Duty Free Paris", groupe: "Commerces" },
  { id: "salon-2e", nom: "Salon Extime — Terminal 2E", groupe: "Salons" },
];

export const CONVERSATIONS = [
  { id: "cdg-positif", titre: "Réponse à avis positif CDG" },
  { id: "parking", titre: "Parking P2 issues" },
  { id: "securite-en", titre: "Reply: Humiliating security check" },
  { id: "securite-fr", titre: "Réponse sécurité CDG agressive" },
  { id: "charmon", titre: "Réponse à Mme Charmon, 1re visite" },
];

/**
 * Le fil de la maquette du 25/09/2026, mot pour mot.
 *
 * C'est le point de cet assemblage : ce n'est pas une démonstration avec des
 * données inventées qui tomberaient juste. Seule la mise en forme change.
 */
// ─── Le sélecteur de POI ─────────────────────────────────────────────────────

export interface SelecteurPOIProps {
  pois: POI[];
  /** `id` du POI sur lequel on travaille. */
  courant: string;
  onChange?: (id: string) => void;
  /**
   * Forme du déclencheur.
   *
   * `carte` — pastille, intitulé « POI » et nom du lieu, pleine largeur.
   * C'est la forme du pied de barre, où rien d'autre ne dit sur quoi on
   * travaille : le déclencheur doit porter l'information ET l'action.
   *
   * `bouton` — « Changer de POI », rien de plus. Pour les écrans qui
   * annoncent déjà le POI à côté. La forme `carte` y écrivait le nom une
   * seconde fois dans la même carte, ce qui n'informe personne et fait
   * hésiter sur lequel des deux est la vérité.
   */
  apparence?: "carte" | "bouton";
  /** Rend le déclencheur pleine largeur, pour le pied de la barre latérale. */
  className?: string;
}

/**
 * Changer de POI.
 *
 * **« Changer de POI », pas « Rechercher un autre POI »** : un libellé nomme
 * le but, jamais le mécanisme. La recherche est à l'INTÉRIEUR — c'est le
 * moyen d'atteindre le but, elle n'a pas à s'afficher sur la porte. Le même
 * raisonnement que « Se connecter » plutôt que « Saisir ses identifiants ».
 *
 * Le POI courant est écrit sur le déclencheur, et repris dans son nom
 * accessible : un bouton qui dirait seulement « Changer de POI » obligerait
 * à chercher ailleurs sur quoi on travaille.
 *
 * Exporté séparément parce que l'accueil en rond-point s'en sert aussi, et
 * que c'est le MÊME contrôle : deux implémentations divergeraient au premier
 * correctif.
 */
export function SelecteurPOI({
  pois,
  courant,
  onChange,
  apparence = "carte",
  className,
}: SelecteurPOIProps) {
  const [ouvert, setOuvert] = useState(false);
  const [filtre, setFiltre] = useState("");
  const nom = pois.find((p) => p.id === courant)?.nom ?? courant;
  const idResultats = useId();

  const resultats = useMemo(() => {
    const q = filtre.trim().toLowerCase();
    return q ? pois.filter((p) => p.nom.toLowerCase().includes(q)) : pois;
  }, [pois, filtre]);

  // Regroupés dans l'ordre d'apparition — 93 POI chez ADP, une liste à plat
  // ne se parcourt pas.
  const groupes = useMemo(() => {
    const m = new Map<string, POI[]>();
    for (const p of resultats) {
      const g = p.groupe ?? "Autres";
      m.set(g, [...(m.get(g) ?? []), p]);
    }
    return [...m.entries()];
  }, [resultats]);

  return (
    <Dialog
      open={ouvert}
      onOpenChange={(o) => {
        setOuvert(o);
        // La recherche repart à zéro à chaque ouverture : rouvrir sur un
        // filtre oublié donne une liste amputée sans qu'on sache pourquoi.
        if (!o) setFiltre("");
      }}
      title="Changer de POI"
      description="Le POI choisi vaut pour tous les espaces : avis, cockpit et tableau de bord."
      trigger={
        apparence === "bouton" ? (
          <Button variant="outline" size="sm" className={className}>
            <Ico d={D.epingle} />
            Changer de POI
            {/* Le nom du lieu reste dans le nom accessible, même quand il
                n'est pas écrit sur le bouton : sans lui, « Changer de POI »
                ne dit pas de quel POI on part. */}
            <span className="sr-only"> — actuellement {nom}</span>
          </Button>
        ) : (
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-md p-2 text-left",
            "border border-transparent",
            "hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-surface)]",
            className
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full",
              "bg-[var(--muted)] text-[var(--muted-foreground)]"
            )}
          >
            <Ico d={D.epingle} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-[var(--nav-on-muted)]">POI</span>
            <span className="block truncate text-sm font-medium text-[var(--nav-on)]">
              {nom}
            </span>
          </span>
          {/* Le nom accessible du bouton, lu en plus du texte visible : sans
              lui, un lecteur d'écran annonce le nom du POI et rien de ce que
              le bouton fait. */}
          <span className="sr-only">— changer de POI</span>
          <Ico d={D.chevrons} className="text-[var(--nav-on-muted)]" />
        </button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Rechercher un POI"
          type="search"
          autoComplete="off"
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          placeholder="Terminal, boutique, salon…"
          leadingIcon={<Ico d={D.loupe} />}
          aria-describedby={idResultats}
        />

        {/* Le décompte est annoncé à chaque frappe : sans lui, filtrer une
            liste de 93 entrées ne produit aucun retour perceptible hors de
            l'écran. `polite` — la frappe ne doit pas être interrompue. */}
        <p id={idResultats} aria-live="polite" className="sr-only">
          {resultats.length} POI sur {pois.length}
        </p>

        {resultats.length === 0 ? (
          <p className="m-0 text-sm text-[var(--muted-foreground)]">
            Aucun POI ne correspond à « {filtre} ». Essayez le nom du terminal
            ou de l'enseigne.
          </p>
        ) : (
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto">
            {groupes.map(([groupe, liste]) => (
              <section key={groupe} aria-label={groupe} className="flex flex-col gap-1">
                <h3 className="m-0 px-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  {groupe}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {liste.map((p) => {
                    const actif = p.id === courant;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          // `aria-current="true"` et non `"page"` : on ne
                          // change pas de page, on change le sujet de toutes
                          // les pages.
                          aria-current={actif || undefined}
                          onClick={() => {
                            onChange?.(p.id);
                            setOuvert(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                            "min-h-11 border border-transparent",
                            "hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                            actif && "bg-[var(--muted)] font-semibold"
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{p.nom}</span>
                          {/* Le POI courant ne tient pas à la seule graisse :
                              la coche le dit, et `aria-current` l'annonce. */}
                          {actif && <Ico d={D.valider} className="text-[var(--primary)]" />}
                          {actif && <span className="sr-only">POI actuel</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}


// ─── La coquille de page ─────────────────────────────────────────────────────

/** Les espaces de l'outil, dans l'ordre de la barre. */
export type Espace = "accueil" | "avis" | "cockpit" | "tableau";

export interface CoquilleADPProps {
  /** Espace affiché — surligne l'entrée correspondante. */
  espace: Espace;
  /** Titre de la page, rendu en `h1` dans la barre du haut. */
  titre: string;
  /** Le contenu défilant de la page. */
  children: ReactNode;
  /** Bloc fixe sous le contenu — la zone de saisie d'une conversation. */
  pied?: ReactNode;
  pois?: POI[];
  poiCourant?: string;
  onPoiChange?: (id: string) => void;
  conversations?: { id: string; titre: string }[];
  conversationCourante?: string;
  /** Avis en attente, porté par l'entrée « Gestion des avis ». */
  avisEnAttente?: number;
}

/**
 * La coquille commune aux écrans ADP+ : barre latérale, barre de titre,
 * zone de contenu défilante.
 *
 * Elle existe parce que deux écrans la partagent. Deux copies de cette barre
 * divergeraient au premier correctif — et il y en a déjà eu quatre : le pied
 * qui passait sous le pli, la recherche qui ne filtrait rien, le groupe vide
 * qui ne disait pas pourquoi, et deux espaces sous le même pictogramme.
 */
export function CoquilleADP({
  espace,
  titre,
  children,
  pied,
  pois = POIS,
  poiCourant = "cdg",
  onPoiChange,
  conversations = CONVERSATIONS,
  conversationCourante,
  avisEnAttente = 4,
}: CoquilleADPProps) {
  const [poiInterne, setPoiInterne] = useState(poiCourant);
  const [barreOuverte, setBarreOuverte] = useState(true);
  const [filtre, setFiltre] = useState("");
  const idBarre = useId();
  const idCompte = useId();

  // Un champ de recherche qui ne filtre rien est un mensonge d'interface :
  // on tape, rien ne bouge, et on conclut qu'il n'y a pas de résultat.
  const trouvees = useMemo(() => {
    const q = filtre.trim().toLowerCase();
    return q
      ? conversations.filter((c) => c.titre.toLowerCase().includes(q))
      : conversations;
  }, [conversations, filtre]);

  const poi = onPoiChange ? poiCourant : poiInterne;
  const changerPoi = onPoiChange ?? setPoiInterne;

  return (
    /* ── L'écran occupe la fenêtre, et rien de plus ────────────────────────
    
       Une hauteur MINIMALE laissait le contenu pousser la page aussi loin
       qu'il voulait, et le pied de la barre descendait avec : mesuré sur une
       fenêtre de 760 px avec cinq conversations, barre de 880 px et bas du
       pied à 868. Une hauteur FIXE force la zone défilante de `SidebarNav` à
       absorber le débordement — un conteneur défilant dans un parent sans
       hauteur ne défile jamais. */
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* La barre se replie par l'attribut `hidden`, pas par un démontage :
          `aria-controls` doit désigner un élément qui EXISTE.

          Le conteneur ne porte aucune classe de `display` : `display:contents`
          ou `flex` l'emporteraient sur la feuille du navigateur, et la barre
          resterait visible bouton replié.

          `max-sm:hidden` : sous 640 px la barre ne s'affiche pas. `SidebarNav`
          le dit dans sa propre documentation — le tiroir mobile dépend du
          gabarit de page et se monte dans un `Dialog`. Limite connue, pas
          oubli. */}
      <div id={idBarre} hidden={!barreOuverte} className="shrink-0 max-sm:hidden">
        <SidebarNav
          label="Espaces ADP+"
          // La conversation ouverte est la PAGE, et l'espace qui la
          // contient est marqué à part. Sans ça, une seule des deux pouvait
          // l'être : ouvrir une conversation faisait disparaître « Gestion
          // des avis » dans la masse, et on ne savait plus dans quel espace
          // on se trouvait.
          current={conversationCourante ?? espace}
          ancestor={conversationCourante ? espace : undefined}
          className="h-full"
          header={
            <div className="flex flex-col gap-3 pb-1">
              <div className="flex items-center gap-2">
                {/* 74 × 66,31 px : la taille exacte de leur plateforme. Le
                    fichier fait 1,1160:1, donc la largeur suit toute seule. */}
                <BrandMark
                  orientation="vertical"
                  className="h-[66.31px] max-w-[74px]"
                />
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-[var(--nav-on)]">
                    ADP+
                  </span>
                  <span className="block text-xs text-[var(--nav-on-muted)]">
                    Avis digitaux
                  </span>
                </span>
              </div>

              <Button size="sm" className="w-full text-nowrap px-3">
                <Ico d={D.plus} />
                Nouvelle conversation
              </Button>
              {/* Sans pictogramme : la bulle sert déjà « Gestion des avis »,
                  et dans 207 px utiles le libellé passait sur deux lignes. */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-nowrap px-3"
              >
                Donner votre voix à ADP+
              </Button>

              <Input
                label="Rechercher dans les conversations"
                labelHidden
                type="search"
                autoComplete="off"
                placeholder="Rechercher"
                value={filtre}
                onChange={(e) => setFiltre(e.target.value)}
                leadingIcon={<Ico d={D.loupe} />}
                aria-describedby={idCompte}
              />
              <p id={idCompte} aria-live="polite" className="sr-only">
                {filtre.trim()
                  ? `${trouvees.length} conversation${trouvees.length > 1 ? "s" : ""} sur ${conversations.length}`
                  : ""}
              </p>
            </div>
          }
          groups={[
            {
              label: "Espaces",
              labelHidden: true,
              entries: [
                // « Accueil » est le ROND-POINT, pas l'ancienne page d'avis :
                // celle-ci s'appelle désormais « Gestion des avis », qui dit
                // ce qu'on y fait au lieu de nommer sa place dans le menu.
                {
                  id: "accueil",
                  label: "Accueil",
                  href: "#",
                  icon: <Ico d={D.maison} />,
                },
                {
                  id: "avis",
                  label: "Gestion des avis",
                  href: "#",
                  icon: <Ico d={D.bulle} />,
                  count: avisEnAttente,
                  countLabel: "en attente",
                },
                {
                  id: "cockpit",
                  label: "Cockpit du POI",
                  href: "#",
                  icon: <Ico d={D.jauge} />,
                },
                {
                  id: "tableau",
                  label: "Tableau de bord ADP",
                  href: "#",
                  icon: <Ico d={D.graphe} />,
                },
              ],
            },
            {
              label: "Conversations",
              // Un historique, pas une barre de sections.
              density: "compact",
              empty: `Aucune conversation ne contient « ${filtre.trim()} ».`,
              entries: trouvees.map((c) => ({
                id: c.id,
                label: c.titre,
                href: "#",
              })),
            },
          ]}
          footer={
            <div className="flex flex-col gap-1">
              <SelecteurPOI pois={pois} courant={poi} onChange={changerPoi} />

              <hr className="m-0 border-0 border-t border-[var(--nav-border)]" />

              <a
                href="#"
                className={cn(
                  "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-[var(--radius)] px-3 text-sm",
                  "text-[var(--nav-on)] hover:bg-[var(--nav-surface-active)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                )}
              >
                <Ico d={D.reglages} />
                Paramètres du compte
              </a>

              {/* Un `<button>`, pas un lien. Se déconnecter n'amène nulle
                  part : ça détruit une session. Un lien promettrait
                  l'ouverture dans un onglet et le retour arrière. */}
              <button
                type="button"
                className={cn(
                  "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-[var(--radius)] px-3 text-left text-sm",
                  "text-[var(--nav-on)] hover:bg-[var(--nav-surface-active)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                )}
              >
                <Ico d={D.sortie} />
                Se déconnecter
              </button>

              {/* Le drapeau est DÉCORATIF : « Français » est écrit à côté. Un
                  drapeau nomme un pays, pas une langue. */}
              <Select
                label="Langue de l'interface"
                labelHidden
                size="sm"
                defaultValue="fr"
                options={[
                  { value: "fr", label: "Français", icon: <Drapeau code="FR" /> },
                  { value: "en", label: "English", icon: <Drapeau code="GB" /> },
                ]}
              />
            </div>
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={barreOuverte}
            aria-controls={idBarre}
            onClick={() => setBarreOuverte((v) => !v)}
          >
            <Ico d={D.panneau} />
            <span className="sr-only">
              {barreOuverte ? "Replier la barre latérale" : "Déplier la barre latérale"}
            </span>
          </Button>
          <h1 className="m-0 truncate text-base font-semibold">{titre}</h1>
        </header>

        {/* ── Un `<main>`, qui manquait ──────────────────────────────────
        
            Une page sans repère principal oblige à traverser la barre
            latérale à chaque arrivée : « aller au contenu » est le premier
            raccourci qu'un lecteur d'écran propose, et il n'avait rien à
            viser.
        
            Il règle un second défaut du même coup. L'en-tête de titre
            ci-dessus est une BANNIÈRE — un `<header>` qui n'est descendant
            ni d'`article`, ni de `section`, ni de `main`, ni de `nav`. Sans
            ce `main`, le bloc d'introduction de l'accueil en devenait une
            deuxième, et axe le signalait : `landmark-no-duplicate-banner`.
            Dans `main`, un `header` n'est plus une bannière. */}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

        {pied && <div className="shrink-0 border-t border-border">{pied}</div>}
      </div>
    </div>
  );
}
