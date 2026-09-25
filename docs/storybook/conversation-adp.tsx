/**
 * ConversationADP — ASSEMBLAGE.
 *
 * L'écran de conversation de l'outil « ADP+ · Avis digitaux » : l'assistant
 * rédige une réponse à un avis, l'utilisateur la relit, puis choisit sa
 * sortie. C'est la v2 du tableau de bord que nous livrons, donc un écran
 * ADP — mais bâti sur les tokens de marque, pas sur du bleu ADP écrit en
 * dur : `data-brand="generali"` et le même fichier rend l'écran Generali.
 *
 * Ce fichier se COPIE, il ne s'installe pas. Un assemblage est un écran, pas
 * une brique : la prochaine personne qui en a besoin en a besoin comme point
 * de départ, avec ses espaces à elle et ses actions à elle. Il ne dépend que
 * de composants publiés du registry : `shadcn add` les installe, puis on
 * colle ce fichier à côté.
 *
 * ── Les trois écarts assumés avec la maquette ────────────────────────────
 *
 * 1. **Le brouillon n'est pas en chasse fixe.** La maquette le rend en
 *    monospace ; dans notre système, la chasse fixe veut dire « ceci est du
 *    code, à recopier caractère par caractère ». Or ce texte est une lettre
 *    destinée à un voyageur. Il prend donc la typographie de corps, comme
 *    tout le reste du produit.
 *
 * 2. **Le brouillon porte l'étiquette « IA ».** Absente de la maquette. Une
 *    réponse générée qui ne dit pas qu'elle est générée fait porter à
 *    l'utilisateur, au moment de publier au nom de l'aéroport, une décision
 *    dont il ignore la nature. `ReplyBubble` le dit en toutes lettres, pas
 *    par une teinte.
 *
 * 3. **La conversation courante est titrée.** La maquette ne l'annonce que
 *    par le surlignage d'une entrée de la barre latérale — invisible à un
 *    lecteur d'écran arrivé directement sur la page, et invisible tout court
 *    barre repliée. Le titre est le `h1` de la page.
 */

import { useId, useMemo, useState, type ReactNode } from "react";

import { SidebarNav } from "@registry/aikoz/sidebar-nav/sidebar-nav";
import { BrandMark } from "@registry/aikoz/brand-mark/brand-mark";
import { Button } from "@registry/aikoz/button/button";
import { Input } from "@registry/aikoz/input/input";
import { Card } from "@registry/aikoz/card/card";
import { Dialog } from "@registry/aikoz/dialog/dialog";
import { Select } from "@registry/aikoz/select/select";
import { ReplyBubble } from "@registry/aikoz/reply-bubble/reply-bubble";
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

function Ico({ d, className }: { d: string; className?: string }) {
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

const D = {
  plus: "M12 5v14|M5 12h14",
  bulle: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  loupe: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.3-4.3",
  maison: "M3 10.5 12 3l9 7.5|M5 9.5V21h14V9.5",
  graphe: "M3 3v18h18|M8 16V11|M12.5 16V7|M17 16v-3",
  jauge: "M12 21a9 9 0 1 0-9-9|M3 12a9 9 0 0 1 18 0|M12 12l4-3",
  clef: "M15.5 3a5.5 5.5 0 1 0-4.9 8L9 12.6V15H6.5l-2 2 1.5 1.5L3 21h4l1.5-1.5|M17 7.5h.01",
  sortie: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4|M10 17l5-5-5-5|M15 12H3",
  panneau: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z|M10 4v16",
  chevrons: "M8 9l4-4 4 4|M16 15l-4 4-4-4",
  copie: "M9 9h10v12H9z|M15 9V5H5v12h4",
  refaire: "M3 12a9 9 0 0 1 15.3-6.4L21 8|M21 3v5h-5|M21 12a9 9 0 0 1-15.3 6.4L3 16|M3 21v-5h5",
  crayon: "M4 20h4L20 8l-4-4L4 16v4z|M14 6l4 4",
  envoi: "M4 12 20 4l-8 16-2-6-6-2z",
  valider: "M20 6 9 17l-5-5",
  avion: "M3 12 21 4l-4 8 4 8-18-8z",
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
export type Tour =
  | { id: string; role: "assistant" | "utilisateur"; texte: string; heure: string }
  | { id: string; role: "brouillon"; texte: string; heure: string };

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
export const FIL_AVIS_POSITIF: Tour[] = [
  {
    id: "t1",
    role: "assistant",
    texte: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
    heure: "19:48",
  },
  {
    id: "t2",
    role: "utilisateur",
    texte:
      "Rédiger une réponse — Bonjour pour la 1re fois que je passe l'aéroport " +
      "Charles-de-Gaulle, ça s'est bien passé (5/5)",
    heure: "19:48",
  },
  {
    id: "t3",
    role: "brouillon",
    texte: `Bonjour Madame Charmon,

Nous vous remercions sincèrement d'avoir pris le temps de partager votre expérience positive suite à votre premier passage à l'aéroport Paris-Charles de Gaulle. Nous sommes ravis d'apprendre que tout s'est bien passé pour vous.

Votre satisfaction est notre priorité et nous mettons tout en œuvre pour offrir un service de qualité à l'ensemble de nos voyageurs.

L'équipe de l'Aéroport de Paris-Charles de Gaulle`,
    heure: "19:49",
  },
];

export const FIL_AVIS_SENSIBLE: Tour[] = [
  {
    id: "s1",
    role: "assistant",
    texte: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
    heure: "10:40",
  },
  {
    id: "s2",
    role: "utilisateur",
    texte:
      "Rédiger une réponse — Vol de contenu dans ma valise entre l'enregistrement " +
      "et la livraison bagages. Plainte déposée. (1/5)",
    heure: "10:40",
  },
  {
    id: "s3",
    role: "brouillon",
    texte: `Cher voyageur,

Nous prenons connaissance de votre situation et regrettons vivement le désagrément que vous avez subi suite au vol de contenu dans votre valise. Nous comprenons votre mécontentement face à cette expérience.

Nous vous confirmons que votre plainte est en cours de traitement par les services compétents. Nous vous invitons à poursuivre vos démarches par les canaux appropriés.

Cordialement,
Extime Duty Free Paris | Paris-CDG – Terminal 2B / 2D`,
    heure: "10:40",
  },
];

// ─── Le sélecteur de POI ─────────────────────────────────────────────────────

export interface SelecteurPOIProps {
  pois: POI[];
  /** `id` du POI sur lequel on travaille. */
  courant: string;
  onChange?: (id: string) => void;
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
export function SelecteurPOI({ pois, courant, onChange, className }: SelecteurPOIProps) {
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
            <Ico d={D.avion} />
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

// ─── Les tours de parole ─────────────────────────────────────────────────────

/**
 * Une bulle de conversation.
 *
 * Locale à l'assemblage, volontairement : trois usages dans un seul écran ne
 * font pas un composant du registry. Si un deuxième produit en a besoin, elle
 * monte — c'est la question de la section 1 de « Créer un composant », et la
 * réponse dépend du deuxième appelant, pas du premier.
 */
function Bulle({
  role,
  heure,
  children,
}: {
  role: "assistant" | "utilisateur";
  heure: string;
  children: ReactNode;
}) {
  const moi = role === "utilisateur";
  return (
    <li className={cn("flex flex-col gap-1", moi ? "items-end" : "items-start")}>
      <div className={cn("flex max-w-[44rem] items-start gap-3", moi && "flex-row-reverse")}>
        <span
          aria-hidden="true"
          className={cn(
            "mt-1 grid size-8 shrink-0 place-items-center rounded-full",
            moi
              ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
              : "bg-[var(--primary)] text-[var(--primary-foreground)]"
          )}
        >
          {moi ? <Ico d={D.personne} /> : <Ico d={D.assistant} />}
        </span>
        <p
          className={cn(
            "m-0 rounded-lg px-4 py-3 text-sm leading-relaxed",
            moi
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border border-border bg-[var(--card)] text-[var(--card-foreground)]"
          )}
        >
          {/* Qui parle est écrit, pas seulement dessiné. Sans ça, un lecteur
              d'écran enchaîne les tours sans distinguer la question de la
              réponse : la couleur et le côté ne lui parviennent pas. */}
          <span className="sr-only">{moi ? "Vous : " : "Assistant : "}</span>
          {children}
        </p>
      </div>
      <time className={cn("text-xs text-[var(--muted-foreground)]", moi ? "mr-11" : "ml-11")}>
        {heure}
      </time>
    </li>
  );
}

export interface BrouillonProps {
  texte: string;
  heure: string;
  /**
   * Le repli de la maquette : quand la publication directe échoue à
   * répétition, on propose le copier-coller vers Google My Business.
   */
  repriseManuelle?: boolean;
  onReformuler?: () => void;
  onModifier?: () => void;
  onEnvoyerPourValidation?: () => void;
  onRepondreSurGoogle?: () => void;
}

/**
 * Le brouillon de réponse, et ses quatre actions.
 *
 * **Les deux sorties coexistent toujours** — « Répondre sur Google » publie,
 * « Envoyer pour validation » passe la main. Décision d'Alice du 25/09/2026 :
 * on n'en masque aucune selon les droits.
 *
 * Elles ne pèsent pas pareil pour autant. Deux boutons de même poids côte à
 * côte, c'est une question posée à l'utilisateur à chaque réponse ; la
 * hiérarchie répond à sa place quand il n'a pas d'avis. « Répondre sur
 * Google » est l'action primaire, « Envoyer pour validation » la secondaire.
 * Les deux outils de réécriture restent en `outline` : ils ne sortent pas de
 * l'écran, ils y ramènent.
 */
export function Brouillon({
  texte,
  heure,
  repriseManuelle = false,
  onReformuler,
  onModifier,
  onEnvoyerPourValidation,
  onRepondreSurGoogle,
}: BrouillonProps) {
  const [copie, setCopie] = useState(false);
  const idTitre = useId();

  return (
    <li className="flex flex-col items-start gap-1">
      <div className="flex w-full items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          <Ico d={D.assistant} />
        </span>

        <Card
          as="section"
          aria-labelledby={idTitre}
          className="flex min-w-0 flex-1 flex-col gap-3 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id={idTitre} className="m-0 text-sm font-semibold">
              Brouillon de réponse
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(texte);
                setCopie(true);
              }}
            >
              <Ico d={D.copie} />
              Copier
            </Button>
          </div>

          {/* Les paragraphes sont découpés par `ReplyBubble` lui-même : une
              réponse à un avis en fait toujours trois — salutation, corps,
              signature. L'assemblage passe le texte brut, avec ses lignes
              vides. */}
          <ReplyBubble origin="ai">{texte}</ReplyBubble>

          {/* La confirmation de copie est annoncée, pas seulement affichée. */}
          <p aria-live="polite" className="sr-only">
            {copie ? "Réponse copiée dans le presse-papier." : ""}
          </p>

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onReformuler}>
              <Ico d={D.refaire} />
              Reformuler
            </Button>
            <Button variant="outline" size="sm" onClick={onModifier}>
              <Ico d={D.crayon} />
              Modifier la réponse
            </Button>
            <Button variant="secondary" size="sm" onClick={onEnvoyerPourValidation}>
              <Ico d={D.valider} />
              Envoyer pour validation
            </Button>
            <Button size="sm" onClick={onRepondreSurGoogle}>
              <Ico d={D.envoi} />
              Répondre sur Google
            </Button>
          </div>

          {repriseManuelle && (
            /* Le repli de la maquette, refait en cible atteignable.
            
               Leur version est un lien posé au milieu d'une phrase : mesuré
               387 × 15 px, sous le plancher de 24 px du critère WCAG 2.2 AA
               2.5.8. L'exception « lien en ligne » du critère le couvrirait
               sans doute — mais s'en prévaloir pour une action de repli, celle
               qu'on atteint justement quand tout le reste a échoué, c'est
               choisir le pire moment pour viser juste.
            
               Le lien devient donc un bouton, et la phrase redevient une
               phrase. Le copier-coller lui-même n'est pas dupliqué : le bouton
               « Copier » de l'en-tête fait déjà ce travail, et deux chemins
               pour la même action en laissent toujours un des deux périmer. */
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <p className="m-0 text-xs text-[var(--muted-foreground)]">
                La publication directe échoue ? Copiez la réponse, puis
                publiez-la depuis Google My Business.
              </p>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir Google My Business
                  {/* Une ouverture dans un nouvel onglet s'annonce : sinon le
                      retour arrière ne ramène pas où l'on croit. */}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </Button>
            </div>
          )}
        </Card>
      </div>
      <time className="ml-11 text-xs text-[var(--muted-foreground)]">{heure}</time>
    </li>
  );
}

// ─── L'écran ─────────────────────────────────────────────────────────────────

export type Espace = "avis" | "cockpit" | "tableau";

export interface ConversationADPProps {
  /** Conversation affichée — c'est le `h1` de la page. */
  titre: string;
  tours: Tour[];
  pois?: POI[];
  poiCourant?: string;
  conversations?: { id: string; titre: string }[];
  conversationCourante?: string;
  repriseManuelle?: boolean;
  onEnvoyerPourValidation?: () => void;
  onRepondreSurGoogle?: () => void;
}

export function ConversationADP({
  titre,
  tours,
  pois = POIS,
  poiCourant = "cdg",
  conversations = CONVERSATIONS,
  conversationCourante = "charmon",
  repriseManuelle = false,
  onEnvoyerPourValidation,
  onRepondreSurGoogle,
}: ConversationADPProps) {
  const [poi, setPoi] = useState(poiCourant);
  const [barreOuverte, setBarreOuverte] = useState(true);
  const idBarre = useId();

  return (
    <div className="flex min-h-[48rem] w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* La barre se replie par l'attribut `hidden`, pas par un démontage :
          `aria-controls` doit désigner un élément qui EXISTE, sinon il ne
          désigne rien — c'est le défaut qu'on vient de corriger sur
          `ViewTabs`.
          
          Le conteneur ne porte aucune classe de `display` : `display:contents`
          ou `flex` l'emporteraient sur la feuille de style du navigateur, et
          la barre resterait visible bouton replié.
          
          `max-sm:hidden` : sous 640 px la barre ne s'affiche pas du tout.
          `SidebarNav` le dit dans sa propre documentation — le tiroir mobile
          dépend du gabarit de page, pas de la barre, et se monte dans un
          `Dialog`. C'est une limite connue de cet assemblage, pas un oubli. */}
      <div id={idBarre} hidden={!barreOuverte} className="shrink-0 max-sm:hidden">
        <SidebarNav
          label="Espaces ADP+"
          current={conversationCourante}
          className="h-full"
          header={
            <div className="flex flex-col gap-3 pb-1">
              <div className="flex items-center gap-2">
                <BrandMark className="h-8 max-w-[6rem]" />
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
                leadingIcon={<Ico d={D.loupe} />}
              />
            </div>
          }
          groups={[
            {
              label: "Espaces",
              labelHidden: true,
              entries: [
                // « Accueil » devient « Gestion des avis » : l'entrée nommait
                // sa position dans le menu, pas ce qu'on y fait. « Accueil »
                // est désormais le rond-point, et c'est un autre écran.
                {
                  id: "avis",
                  label: "Gestion des avis",
                  href: "#",
                  icon: <Ico d={D.bulle} />,
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
              entries: conversations.map((c) => ({
                id: c.id,
                label: c.titre,
                href: "#",
              })),
            },
          ]}
          footer={
            <div className="flex flex-col gap-1">
              <SelecteurPOI pois={pois} courant={poi} onChange={setPoi} />

              <hr className="m-0 border-0 border-t border-[var(--nav-border)]" />

              <a
                href="#"
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm",
                  "text-[var(--nav-on)] hover:bg-[var(--surface-hover)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                )}
              >
                <Ico d={D.clef} />
                Paramètres du compte
              </a>

              {/* Un `<button>`, pas un lien. Se déconnecter n'amène nulle
                  part : ça détruit une session. Un lien promettrait l'ouverture
                  dans un onglet et le retour arrière — ni l'un ni l'autre
                  n'existent ici. */}
              <button
                type="button"
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm",
                  "text-[var(--nav-on)] hover:bg-[var(--surface-hover)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                )}
              >
                <Ico d={D.sortie} />
                Se déconnecter
              </button>

              <Select
                label="Langue de l'interface"
                labelHidden
                size="sm"
                defaultValue="fr"
                options={[
                  { value: "fr", label: "Français" },
                  { value: "en", label: "English" },
                ]}
              />
            </div>
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
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
          {/* Le titre de la conversation, et non « ADP+ » : le nom du produit
              est déjà dans la barre, et un `h1` doit dire où l'on est. */}
          <h1 className="m-0 truncate text-base font-semibold">{titre}</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8">
          <ol className="m-0 mx-auto flex w-full max-w-4xl list-none flex-col gap-6 p-0">
            {tours.map((t) =>
              t.role === "brouillon" ? (
                <Brouillon
                  key={t.id}
                  texte={t.texte}
                  heure={t.heure}
                  repriseManuelle={repriseManuelle}
                  onEnvoyerPourValidation={onEnvoyerPourValidation}
                  onRepondreSurGoogle={onRepondreSurGoogle}
                />
              ) : (
                <Bulle key={t.id} role={t.role} heure={t.heure}>
                  {t.texte}
                </Bulle>
              )
            )}
          </ol>
        </div>

        <div className="border-t border-border px-4 py-4">
          <form
            className="mx-auto flex w-full max-w-4xl items-end gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              label="Votre question"
              labelHidden
              wrapperClassName="flex-1"
              placeholder="Posez des questions et je ferai de mon mieux pour y répondre…"
            />
            <Button type="submit" aria-label="Envoyer la question">
              <Ico d={D.envoi} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
