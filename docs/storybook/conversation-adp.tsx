/**
 * ConversationADP — ASSEMBLAGE.
 *
 * L'écran de conversation de l'outil « ADP+ · Avis digitaux » : l'assistant
 * rédige une réponse à un avis, l'utilisateur la relit, puis choisit sa
 * sortie.
 *
 * Ce fichier se COPIE, il ne s'installe pas, et il vient avec
 * `adp-commun.tsx` — la barre latérale, le sélecteur de POI et les
 * pictogrammes y vivent, parce que l'accueil les partage. Deux copies de
 * cette barre divergeraient au premier correctif.
 *
 * ── Les écarts assumés avec la maquette ──────────────────────────────────
 *
 * 1. **Le brouillon n'est pas en chasse fixe.** Elle dirait « ceci est du
 *    code, à recopier caractère par caractère ». Ce texte est une lettre
 *    destinée à un voyageur.
 *
 * 2. **Le brouillon porte l'étiquette « IA ».** Une réponse générée qui ne
 *    dit pas qu'elle est générée fait porter à l'utilisateur, au moment de
 *    publier au nom de l'aéroport, une décision dont il ignore la nature.
 *
 * 3. **La conversation courante est titrée.** La maquette ne l'annonce que
 *    par le surlignage d'une entrée de la barre — invisible barre repliée,
 *    et invisible à un lecteur d'écran.
 */

import { Fragment, useId, useState, type ReactNode } from "react";

import { Button } from "@registry/aikoz/button/button";
import { Card } from "@registry/aikoz/card/card";
import { Input } from "@registry/aikoz/input/input";
import { Badge } from "@registry/aikoz/badge/badge";
import { decouperEnParagraphes } from "@registry/aikoz/reply-bubble/reply-bubble";
import { cn } from "@registry/aikoz/lib/utils";

import { CoquilleADP, D, Ico, type POI } from "./adp-commun";

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
            // ── Pourquoi la bulle est plus ronde que tout le reste ────────
            //
            // Elle ne relève ni de la pilule d'identité ni du cercle imposé
            // par la géométrie : sa rondeur PORTE UN SENS. C'est elle qui
            // dit « ceci est de la parole », et une bulle au rayon d'une
            // carte cesse d'être une bulle — sous Aikoz, le bouton en
            // pilule était même plus rond que la parole qu'il commente.
            //
            // Le double du rayon de surface, pas une valeur en dur : la
            // bulle reste solidaire de la marque, elle est seulement d'un
            // cran au-dessus. Même construction que les paliers `md` et
            // `sm` de Tailwind, qui dérivent eux aussi de `--radius`.
            //
            // Locale à l'assemblage, et pas un token : un seul consommateur.
            // Les cinq paliers de rayon retirés le 22/09 l'avaient été pour
            // n'en avoir aucun — on ne recommence pas dans l'autre sens.
            "m-0 rounded-[calc(var(--radius)*2)] px-4 py-3 text-sm leading-relaxed",
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

/**
 * Comment le brouillon se présente sur sa carte.
 *
 * `bloc` — un objet encadré, avec sa barre de titre et son bouton de copie
 * dessus. C'est le vocabulaire universel du « prêt à coller » : clé d'API,
 * extrait de code, modèle d'e-mail. Il dit que le texte a des BORDS, qu'on
 * le prend entier, et qu'il est destiné à partir ailleurs.
 *
 * `pose` — le texte à même la carte, sans cadre. Il dit que le texte est le
 * contenu de l'écran, à lire et à valider sur place.
 *
 * Le choix n'est pas cosmétique : il dit ce qu'on attend de l'utilisateur.
 * Tant que « Répondre sur Google » peut échouer et renvoyer au copier-coller,
 * le brouillon est un objet qui peut partir ailleurs — d'où `bloc` par
 * défaut.
 */
export type PresentationBrouillon = "bloc" | "pose";

export interface BrouillonProps {
  texte: string;
  heure: string;
  presentation?: PresentationBrouillon;
  /**
   * Ce qui distingue CE brouillon des autres, ajouté au nom accessible de sa
   * région. Par défaut l'heure.
   *
   * Un fil contient plusieurs brouillons dès qu'on reformule. Deux régions
   * nommées « Brouillon de réponse » sont indiscernables pour qui navigue de
   * repère en repère — axe le signale en `landmark-unique`, et il a raison :
   * le lecteur d'écran annonce deux fois la même chose devant deux contenus
   * différents.
   */
  precision?: string;
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
  presentation = "bloc",
  precision,
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
          {/* ── Le titre, l'origine, la copie ─────────────────────────────
          
              En `bloc`, ces trois-là forment la BARRE DE TITRE de l'objet :
              ils lui appartiennent, comme l'en-tête d'un extrait de code.
              Le bouton de copie surtout — une affordance de copie se pose sur
              ce qu'elle copie, pas à côté.
          
              En `pose`, il n'y a pas d'objet : ils titrent la carte. */}
          {(() => {
            const barre = (
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2",
                  presentation === "bloc" &&
                    "border-b border-border px-3 py-1.5"
                )}
              >
                <div className="flex items-center gap-2">
                  <h2 id={idTitre} className="m-0 text-sm font-semibold">
                    Brouillon de réponse
                    {/* Lu, pas affiché : l'heure est déjà écrite sous la
                        carte pour qui voit l'écran. */}
                    <span className="sr-only"> — {precision ?? heure}</span>
                  </h2>
                  {/* L'origine est écrite en toutes lettres, jamais portée
                      par une teinte seule. */}
                  <Badge
                    tone="info"
                    size="sm"
                    icon={<Ico d={D.assistant} className="size-3" />}
                  >
                    IA
                  </Badge>
                </div>
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
            );

            const corps = (
              <div
                className={cn(
                  "flex flex-col gap-3",
                  presentation === "bloc" && "p-4"
                )}
              >
                {decouperEnParagraphes(texte).map((para, i) => (
                  <p key={i} className="m-0 text-sm leading-relaxed">
                    {para.map((ligne, j) => (
                      <Fragment key={j}>
                        {j > 0 && <br />}
                        {ligne}
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            );

            /* ── Pourquoi PAS `ReplyBubble` dans les deux cas ─────────────
            
               `ReplyBubble` est une CITATION EN CREUX : fond sourd, liseré
               gauche, pas de bordure propre. Sa documentation le dit — elle
               se compose comme l'enfant d'une carte d'avis, « pour rester
               subordonnée à la carte qui l'accueille ». C'est exact dans le
               Kanban, où la réponse est posée sous le verbatim auquel elle
               répond.
            
               Ici il n'y a pas de verbatim au-dessus. Un liseré privé de ce
               qu'il subordonne n'est plus qu'un trait. Un CADRE COMPLET, lui,
               dit autre chose : cet objet a des bords, on le prend entier.
               C'est ce que dit un bloc prêt à coller, et ce n'est pas ce que
               disait la citation.
            
               Le découpage en paragraphes reste celui de `ReplyBubble` :
               deux appelants, une seule implémentation. */
            return presentation === "bloc" ? (
              <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-[var(--muted)]">
                {barre}
                {corps}
              </div>
            ) : (
              <>
                {barre}
                {corps}
              </>
            );
          })()}

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

export interface ConversationADPProps {
  /** Conversation affichée — c'est le `h1` de la page. */
  titre: string;
  tours: Tour[];
  pois?: POI[];
  poiCourant?: string;
  conversations?: { id: string; titre: string }[];
  conversationCourante?: string;
  avisEnAttente?: number;
  /** Cf. `PresentationBrouillon` — « bloc prêt à coller » par défaut. */
  presentation?: PresentationBrouillon;
  repriseManuelle?: boolean;
  onEnvoyerPourValidation?: () => void;
  onRepondreSurGoogle?: () => void;
}

export function ConversationADP({
  titre,
  tours,
  pois,
  poiCourant,
  conversations,
  conversationCourante = "charmon",
  avisEnAttente,
  presentation = "bloc",
  repriseManuelle = false,
  onEnvoyerPourValidation,
  onRepondreSurGoogle,
}: ConversationADPProps) {
  return (
    <CoquilleADP
      espace="avis"
      titre={titre}
      pois={pois}
      poiCourant={poiCourant}
      conversations={conversations}
      conversationCourante={conversationCourante}
      avisEnAttente={avisEnAttente}
      pied={
        <form
          className="mx-auto flex w-full max-w-4xl items-end gap-2 px-4 py-4"
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
      }
    >
      <div className="px-4 py-8">
        <ol className="m-0 mx-auto flex w-full max-w-4xl list-none flex-col gap-6 p-0">
          {tours.map((t) =>
            t.role === "brouillon" ? (
              <Brouillon
                key={t.id}
                texte={t.texte}
                heure={t.heure}
                presentation={presentation}
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
    </CoquilleADP>
  );
}
