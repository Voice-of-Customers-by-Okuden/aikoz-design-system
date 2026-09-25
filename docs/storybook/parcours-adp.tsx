/**
 * ParcoursADP — ASSEMBLAGE.
 *
 * Les deux écrans déjà publiés, branchés l'un sur l'autre : on part du
 * tableau « Gestion des avis », on écrit dans « Conversation ADP », et
 * l'avis revient se ranger dans la bonne colonne.
 *
 * Rien de nouveau n'est dessiné ici. `ResponseKanban` émettait déjà
 * `onDraftReply`, `Brouillon` émettait déjà `onEnvoyerPourValidation` : les
 * deux bouts existaient, personne ne les avait reliés. Ce fichier est le fil.
 *
 * ── Les trois défauts du parcours, et ce qui les corrige ─────────────────
 *
 * 1. **L'action n'avait pas de destination.** « Envoyer pour validation »
 *    n'avait nulle part où faire arriver l'avis : le tableau n'a longtemps
 *    eu que trois colonnes. `ResponseKanban` en prend une quatrième,
 *    « En attente de validation », posée juste après les avis sensibles —
 *    voir l'avis passer d'une colonne à sa voisine EST la conséquence.
 *
 * 2. **On perdait l'avis en cours de route.** La page de conversation ne
 *    montrait nulle part la plainte à laquelle on répond. On ne juge pas une
 *    réponse sans la plainte : le fil s'ouvre désormais sur le verbatim
 *    intégral, et non sur un résumé d'une ligne.
 *
 * 3. **On revenait à la main.** Après l'envoi, le tableau réapparaît de
 *    lui-même, un message dit à qui la réponse est partie, et il propose
 *    d'enchaîner sur l'avis suivant — avec quatre avis sensibles, faire
 *    re-chercher le suivant est le vrai frottement.
 */

import { useMemo, useState } from "react";

import {
  ResponseKanban,
  type PendingValidationItem,
  type SensitiveReviewItem,
} from "@registry/aikoz/response-kanban/response-kanban";
import { ToastProvider, useToast } from "@registry/aikoz/toast/toast";

import { CoquilleADP } from "./adp-commun";
import { ConversationADP, type Tour } from "./conversation-adp";

// ─── Les données de l'écran ──────────────────────────────────────────────────

/** Un avis sensible, avec ce qu'il faut pour en écrire la réponse. */
export interface AvisSensible extends SensitiveReviewItem {
  /** Qui doit donner son feu vert une fois la réponse envoyée. */
  validatorLabel: string;
  /** Le brouillon proposé par l'assistant. */
  brouillon: string;
}

export const AVIS_SENSIBLES: AvisSensible[] = [
  {
    id: "pmr",
    rating: 1,
    author: "C. Meunier",
    date: "25 septembre 2026",
    text:
      "Contrôle de sûreté humiliant pour ma mère en fauteuil, aucun " +
      "accompagnement PMR malgré la demande faite en amont.",
    categoryLabel: "Accessibilité PMR · sûreté",
    validatorLabel: "Responsable qualité CDG",
    brouillon: `Madame Meunier,

Nous sommes sincèrement désolés de la situation vécue par votre mère lors de son passage au contrôle de sûreté. L'accompagnement PMR demandé aurait dû être assuré, et il ne l'a pas été.

Nous transmettons votre signalement au responsable du service accessibilité, qui reviendra vers vous sous 72 heures.

L'équipe de l'Aéroport de Paris-Charles de Gaulle`,
  },
  {
    id: "valise",
    rating: 1,
    author: "Voyageur anonyme",
    date: "24 septembre 2026",
    text:
      "Vol de contenu dans ma valise entre l'enregistrement et la livraison " +
      "bagages. Plainte déposée.",
    categoryLabel: "Sécurité · vol signalé",
    validatorLabel: "Responsable sûreté CDG",
    brouillon: `Cher voyageur,

Nous prenons connaissance de votre situation et regrettons vivement le désagrément que vous avez subi. Votre plainte est en cours de traitement par les services compétents.

Nous vous invitons à poursuivre vos démarches par les canaux appropriés.

L'équipe de l'Aéroport de Paris-Charles de Gaulle`,
  },
];

export const HORS_CHARTE = [
  {
    id: "attente",
    rating: 2,
    author: "M. Berthier",
    date: "23 septembre 2026",
    text: "File d'attente interminable au contrôle, personne pour informer les passagers.",
    reply:
      "Les délais d'attente dépendent des effectifs de la police aux frontières, sur lesquels nous n'avons pas la main.",
    reasonLabel: "Réponse déresponsabilisante · renvoi vers un tiers",
  },
  {
    id: "bagage",
    rating: 1,
    author: "S. Nguyen",
    date: "22 septembre 2026",
    text: "Bagage endommagé à l'arrivée, aucun interlocuteur au comptoir.",
    reply: "Merci de votre retour, nous en prenons note.",
    reasonLabel: "Absence d'excuse · pas de solution proposée",
  },
];

export const AUTOMATISEES = [
  {
    id: "auto-1",
    rating: 5,
    author: "Voyageur Google",
    date: "25 septembre 2026",
    reply:
      "Merci beaucoup pour votre note ! Toute l'équipe est ravie de vous compter parmi ses voyageurs. À très bientôt.",
    scheduleLabel: "Programmée J+1",
  },
  {
    id: "auto-2",
    rating: 4,
    author: "Voyageur Google",
    date: "25 septembre 2026",
    reply: "Un grand merci pour ce retour ! C'est toujours un plaisir de vous accueillir.",
    scheduleLabel: "Programmée J+1",
  },
];

/**
 * Le fil d'une réponse, construit à partir de l'avis.
 *
 * L'avis est le PREMIER tour de parole, en entier. La maquette n'en donnait
 * qu'un résumé d'une ligne — « Rédiger une réponse — Vol de contenu… » —, et
 * on ne juge pas une réponse sans la plainte qu'elle traite.
 */
function filPour(a: AvisSensible): Tour[] {
  return [
    {
      id: `${a.id}-avis`,
      role: "utilisateur",
      texte: `${a.author ?? "Voyageur"} · ${a.date} · ${a.rating}/5\n\n${a.text}`,
      heure: "10:40",
    },
    {
      id: `${a.id}-lu`,
      role: "assistant",
      texte:
        "J'ai lu l'avis et rédigé une proposition. Relisez-la avant de l'envoyer.",
      heure: "10:40",
    },
    { id: `${a.id}-brouillon`, role: "brouillon", texte: a.brouillon, heure: "10:41" },
  ];
}

// ─── L'écran ─────────────────────────────────────────────────────────────────

export interface ParcoursADPProps {
  avis?: AvisSensible[];
  /** Ouvre directement la conversation sur cet avis, pour les histoires. */
  ouvertSur?: string;
}

function Parcours({ avis = AVIS_SENSIBLES, ouvertSur }: ParcoursADPProps) {
  const toast = useToast();
  const [sensibles, setSensibles] = useState(avis);
  const [enValidation, setEnValidation] = useState<PendingValidationItem[]>([]);
  const [encours, setEncours] = useState<string | null>(ouvertSur ?? null);

  const avisCourant = useMemo(
    () => sensibles.find((a) => a.id === encours) ?? null,
    [sensibles, encours],
  );

  function envoyer(a: AvisSensible) {
    const restants = sensibles.filter((x) => x.id !== a.id);
    setSensibles(restants);
    setEnValidation((v) => [
      {
        id: a.id,
        rating: a.rating,
        author: a.author,
        date: a.date,
        text: a.text,
        validatorLabel: a.validatorLabel,
      },
      ...v,
    ]);
    // On revient au tableau : c'est là que la conséquence se voit.
    setEncours(null);

    const suivant = restants[0];
    toast({
      message: `Réponse envoyée à ${a.validatorLabel}.`,
      tone: "success",
      // Enchaîner est le vrai besoin : avec quatre avis sensibles, faire
      // re-chercher le suivant est ce qui coûte le plus cher.
      action: suivant
        ? { label: "Avis suivant", onClick: () => setEncours(suivant.id) }
        : undefined,
    });
  }

  if (avisCourant) {
    return (
      <ConversationADP
        titre={`Réponse à ${avisCourant.author ?? "un avis"}`}
        tours={filPour(avisCourant)}
        conversationCourante={avisCourant.id}
        conversations={sensibles.map((a) => ({
          id: a.id,
          titre: `Réponse à ${a.author ?? "un avis"}`,
        }))}
        avisEnAttente={sensibles.length}
        onEnvoyerPourValidation={() => envoyer(avisCourant)}
      />
    );
  }

  return (
    <CoquilleADP
      espace="avis"
      titre="Gestion des avis"
      avisEnAttente={sensibles.length}
      conversations={sensibles.map((a) => ({
        id: a.id,
        titre: `Réponse à ${a.author ?? "un avis"}`,
      }))}
    >
      <div className="p-6">
        {/* Le tableau EST le contenu de cette page : ses colonnes sont ses
            sections de premier rang, donc des `h2` sous le `h1` de la
            coquille. Laissées en `h3`, elles sautaient un niveau — axe le
            signale en `heading-order`, et un lecteur d'écran qui navigue de
            titre en titre y entend un trou. */}
        <ResponseKanban
          titleLevel="h2"
          automated={AUTOMATISEES}
          offCharter={HORS_CHARTE}
          sensitive={sensibles}
          pendingValidation={enValidation}
          onDraftReply={(id) => setEncours(id)}
          onReviewPending={(id) => {
            const a = enValidation.find((x) => x.id === id);
            toast({
              message: `La réponse est chez ${a?.validatorLabel}. La relecture arrive dans un prochain lot.`,
              tone: "info",
            });
          }}
        />
      </div>
    </CoquilleADP>
  );
}

/**
 * `ToastProvider` est monté ICI et pas dans la coquille : le message doit
 * survivre au changement d'écran. Monté à l'intérieur de la conversation, il
 * serait démonté au moment même où l'on revient au tableau — c'est-à-dire
 * juste avant de s'afficher.
 */
export function ParcoursADP(props: ParcoursADPProps) {
  return (
    <ToastProvider>
      <Parcours {...props} />
    </ToastProvider>
  );
}
