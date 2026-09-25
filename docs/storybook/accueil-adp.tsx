/**
 * AccueilADP — ASSEMBLAGE.
 *
 * Le rond-point de l'outil « ADP+ · Avis digitaux » : on y arrive, on
 * confirme sur quel POI on travaille, puis on choisit sa route.
 *
 * Ce fichier se COPIE et il vient avec `adp-commun.tsx`, qu'il partage avec
 * l'écran de conversation.
 *
 * ── Ce que cette page N'EST PAS ──────────────────────────────────────────
 *
 * Ce n'est pas l'ancienne page « Accueil ». Celle-ci s'appelle désormais
 * « Gestion des avis » : elle nommait sa place dans le menu au lieu de dire
 * ce qu'on y fait, et son contenu — les avis à traiter, l'état des réponses —
 * est un espace de travail, pas un point de départ.
 *
 * Ce n'est pas non plus un menu. Un menu répète ce que la barre latérale dit
 * déjà, à quoi bon. Chaque porte porte le CHIFFRE qui dit s'il faut y aller :
 * quatre avis sensibles en attente, 3,7/5 sur ce POI, 93 POI suivis. Sans ce
 * chiffre la page ne fait que ralentir le trajet.
 *
 * ── Pourquoi le POI est au-dessus des portes ─────────────────────────────
 *
 * Un POI est déjà sélectionné à l'entrée, et tout ce qui suit en dépend : le
 * cockpit est celui de ce POI, les avis sont les siens, la conversation
 * répond en son nom. Se tromper de POI et s'en apercevoir trois écrans plus
 * loin est le scénario que cette page existe pour éviter. D'où l'ordre :
 * confirmer d'abord, choisir ensuite.
 */

import { useState, type ReactNode } from "react";

import { Card } from "@registry/aikoz/card/card";
import { Badge } from "@registry/aikoz/badge/badge";
import { Button } from "@registry/aikoz/button/button";
import { cn } from "@registry/aikoz/lib/utils";

import {
  CoquilleADP,
  D,
  Ico,
  POIS,
  SelecteurPOI,
  type Espace,
  type POI,
} from "./adp-commun";

// ─── Une porte ───────────────────────────────────────────────────────────────

export interface PorteProps {
  titre: string;
  /** Ce qu'on y fait, en une phrase. Pas une redite du titre. */
  quoi: string;
  icone: ReactNode;
  /**
   * Le chiffre qui dit s'il faut y aller. Sans lui, la carte n'est qu'une
   * entrée de menu de plus.
   */
  chiffre: ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Une seule porte est principale : celle qui porte du travail en attente. */
  principale?: boolean;
}

/**
 * Une porte du rond-point.
 *
 * **La carte ENTIÈRE est le lien**, pas un « Ouvrir » en bas à droite. Une
 * cible de 300 × 130 px se vise sans réfléchir ; un lien de 60 px posé dans
 * une carte cliquable pose en plus la question de savoir lequel des deux
 * répond. Le titre est le libellé du lien, le reste est dedans.
 *
 * Un `<a>` et pas un `<button>` : on change de route.
 */
export function Porte({
  titre,
  quoi,
  icone,
  chiffre,
  href,
  onClick,
  principale = false,
}: PorteProps) {
  return (
    <li className="min-w-0 flex-1">
      <a
        href={href}
        onClick={onClick}
        className={cn(
          "group flex h-full flex-col gap-3 rounded-[var(--radius)] p-5 no-underline",
          "border bg-[var(--card)] text-[var(--card-foreground)]",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          // La porte principale ne se distingue pas par la SEULE couleur :
          // son liseré est plus appuyé, et son chiffre porte un badge que les
          // autres n'ont pas.
          principale
            ? "border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
            : "border-border hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
        )}
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--muted)] text-[var(--foreground)]"
          >
            {icone}
          </span>
          <span className="min-w-0 text-base font-semibold">{titre}</span>
        </span>

        <span className="text-sm text-[var(--muted-foreground)]">{quoi}</span>

        {/* Poussé en bas : les trois cartes n'ont pas la même longueur de
            phrase, et sans ça leurs chiffres formaient un escalier. */}
        <span className="mt-auto pt-1">{chiffre}</span>
      </a>
    </li>
  );
}

// ─── L'écran ─────────────────────────────────────────────────────────────────

export interface AccueilADPProps {
  pois?: POI[];
  poiCourant?: string;
  onPoiChange?: (id: string) => void;
  /** Avis sensibles en attente sur le POI courant. */
  avisEnAttente?: number;
  /** Note du POI courant, sur 5. */
  notePoi?: number;
  /** Volume d'avis du POI courant. */
  avisPoi?: number;
  /** Nombre de POI suivis par le groupe. */
  poiSuivis?: number;
  /** Volume d'avis du groupe. */
  avisGroupe?: number;
  /** Changement d'espace — depuis une porte ou depuis la barre. */
  onNaviguer?: (espace: Espace) => void;
}

const nombre = new Intl.NumberFormat("fr-FR");

export function AccueilADP({
  pois = POIS,
  poiCourant = "cdg",
  onPoiChange,
  avisEnAttente = 4,
  notePoi = 3.7,
  avisPoi = 17780,
  poiSuivis = 93,
  avisGroupe = 35988,
  onNaviguer,
}: AccueilADPProps) {
  // ── UNE seule source de vérité pour le POI ────────────────────────────
  //
  // La page l'affiche en toutes lettres et la coquille le montre dans son
  // pied : deux endroits, un seul état. Sans ça la coquille gardait le sien,
  // le sélecteur du pied changeait de POI, et le bloc « Vous travaillez
  // sur » continuait d'annoncer l'ancien. Deux contrôles pour le même choix
  // finissent toujours par se contredire.
  const [interne, setInterne] = useState(poiCourant);
  const poi = onPoiChange ? poiCourant : interne;
  const changerPoi = onPoiChange ?? setInterne;
  const nomPoi = pois.find((p) => p.id === poi)?.nom ?? poi;

  return (
    <CoquilleADP
      espace="accueil"
      titre="Accueil"
      pois={pois}
      poiCourant={poi}
      onPoiChange={changerPoi}
      avisEnAttente={avisEnAttente}
      onNaviguer={onNaviguer}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-2">
          <h2 className="m-0 text-2xl font-semibold">
            Pilotez votre e-réputation
          </h2>
          <p className="m-0 text-sm text-[var(--muted-foreground)]">
            ADP+ analyse vos retours clients et vous guide dans la rédaction
            des réponses aux avis.
          </p>
        </header>

        {/* ── Étape 1 : le POI ──────────────────────────────────────────────

            Une carte à part, au-dessus des portes, et non une ligne de plus
            dans l'en-tête. Tout ce qui suit dépend de ce choix : le cockpit
            est celui de ce POI, les avis sont les siens, la conversation
            répond en son nom.

            Le sélecteur est le MÊME composant que celui du pied de la barre —
            `SelecteurPOI`, importé. Deux contrôles pour le même choix
            divergeraient, et l'un des deux finirait par mentir. */}
        <Card
          as="section"
          aria-labelledby="accueil-poi"
          className="flex flex-row flex-wrap items-center justify-between gap-4 p-5"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <h3
              id="accueil-poi"
              className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]"
            >
              Vous travaillez sur
            </h3>
            <p className="m-0 text-lg font-semibold">{nomPoi}</p>
          </div>
          {/* Forme `bouton` : le nom du lieu est déjà écrit à gauche, en
              gros. La forme `carte` du pied de barre l'aurait répété dans la
              même carte — deux fois le même nom, et l'hésitation sur lequel
              des deux fait foi. */}
          <SelecteurPOI
            pois={pois}
            courant={poi}
            onChange={changerPoi}
            apparence="bouton"
            className="shrink-0"
          />
        </Card>

        {/* ── Étape 2 : les routes ──────────────────────────────────────── */}
        <section aria-labelledby="accueil-routes" className="flex flex-col gap-3">
          <h3 id="accueil-routes" className="m-0 text-sm font-semibold">
            Où allez-vous ?
          </h3>
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
            <Porte
              principale
              href="#avis"
              onClick={(e) => {
                e.preventDefault();
                onNaviguer?.("avis");
              }}
              titre="Gestion des avis"
              icone={<Ico d={D.bulle} className="size-5" />}
              quoi="Répondre aux avis, seul ou avec l'assistant, et suivre ce qui part en validation."
              chiffre={
                avisEnAttente > 0 ? (
                  <Badge tone="warning" size="sm">
                    {avisEnAttente} avis sensibles en attente
                  </Badge>
                ) : (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Aucun avis sensible en attente
                  </span>
                )
              }
            />
            <Porte
              href="#cockpit"
              onClick={(e) => {
                e.preventDefault();
                onNaviguer?.("cockpit");
              }}
              titre="Cockpit du POI"
              icone={<Ico d={D.jauge} className="size-5" />}
              quoi="Note, volume et polarité par thème, pour le POI sur lequel vous travaillez."
              chiffre={
                <span className="text-sm text-[var(--muted-foreground)]">
                  <strong className="font-semibold text-[var(--foreground)]">
                    {notePoi.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
                    /5
                  </strong>{" "}
                  · {nombre.format(avisPoi)} avis
                </span>
              }
            />
            <Porte
              href="#tableau"
              onClick={(e) => {
                e.preventDefault();
                onNaviguer?.("tableau");
              }}
              titre="Tableau de bord ADP"
              icone={<Ico d={D.graphe} className="size-5" />}
              quoi="Le groupe entier : classements des POI, taux de réponse, supervision."
              chiffre={
                <span className="text-sm text-[var(--muted-foreground)]">
                  <strong className="font-semibold text-[var(--foreground)]">
                    {poiSuivis} POI
                  </strong>{" "}
                  · {nombre.format(avisGroupe)} avis
                </span>
              }
            />
          </ul>
        </section>

        {/* ── Le raccourci, et pas une quatrième porte ──────────────────────

            Les paramètres ne sont pas une destination de travail : on n'y va
            pas en arrivant, on y passe. Une quatrième carte de même poids
            l'aurait rangé à côté des trois espaces, et aurait fait de la
            rangée un menu — quatre cases équivalentes ne hiérarchisent plus
            rien. Un lien discret en bas dit la même chose sans mentir sur
            son importance. */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="m-0 text-sm text-[var(--muted-foreground)]">
            Besoin de régler votre compte, vos notifications ou votre langue ?
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="#parametres">
              <Ico d={D.reglages} />
              Paramètres du compte
            </a>
          </Button>
        </div>
      </div>
    </CoquilleADP>
  );
}
