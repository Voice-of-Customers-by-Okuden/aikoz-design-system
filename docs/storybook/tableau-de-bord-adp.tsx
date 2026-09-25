/**
 * TableauDeBordADP — ASSEMBLAGE, onglet « Réponses ».
 *
 * La vue de supervision du groupe : 93 POI, 35 988 avis. Quatre onglets,
 * dont un seul est monté — les trois autres le disent.
 *
 * Ce fichier se COPIE et il vient avec `adp-commun.tsx`.
 *
 * ── Les quatre blocs de supervision, et pourquoi ces quatre formes ───────
 *
 * Deux blocs étaient « en attente de données » dans leur maquette. Le choix
 * de leur forme s'est fait contre les deux autres, pas isolément : quatre
 * cartes côte à côte qui emploieraient la même figure ne se distingueraient
 * que par leur titre, et l'œil ne saurait plus où revenir.
 *
 *   1. Taux de réponse   — une COURBE. Une valeur continue dans le temps,
 *                          avec une référence marché en pointillés.
 *   2. Sujets sensibles  — un HISTOGRAMME empilé par mois. Un décompte, pas
 *                          une valeur continue : on veut voir les pics et
 *                          leur composition, pas une tendance lissée. C'est
 *                          la proposition d'Antoine, et elle tient.
 *   3. Hors charte       — une JAUGE horizontale avec son objectif. Une
 *                          part d'un tout, bornée : la seule figure du lot
 *                          qui se lise d'un coup d'œil sans échelle.
 *                          Antoine disait « % » — la jauge est ce % rendu
 *                          comparable à sa cible.
 *   4. Type d'actions    — un ANNEAU. Une composition à quatre parts.
 *
 * Quatre familles, quatre orientations : trait, barres verticales, barre
 * horizontale, cercle. Aucune ne répète l'autre.
 *
 * ── Le titre du bloc et la légende de la figure ──────────────────────────
 *
 * `ChartFrame` rend TOUJOURS son `caption` en `figcaption` visible. Écrit
 * comme un titre, il en fait donc un second, et la carte porte deux titres
 * pour une seule chose — c'est ce que donnait la première version.
 *
 * Le `caption` légende la FIGURE : « douze derniers mois, contre la moyenne
 * marché ». Le titre du bloc nomme l'indicateur. Chacun dit ce que l'autre
 * ne dit pas, et le `caption` reste le nom accessible du tableau
 * équivalent.
 *
 * ── Les chiffres ─────────────────────────────────────────────────────────
 *
 * Ceux des blocs 1 et 4 viennent de leur maquette. Ceux des blocs 2 et 3
 * sont ILLUSTRATIFS : ces deux indicateurs sont « en cours de qualification
 * avec les équipes ADP », et aucune donnée n'existe encore. Ils montrent la
 * forme, pas la mesure.
 */

import { useState } from "react";

import { Badge } from "@registry/aikoz/badge/badge";
import { BarChart } from "@registry/aikoz/bar-chart/bar-chart";
import { Card } from "@registry/aikoz/card/card";
import { DonutChart } from "@registry/aikoz/donut-chart/donut-chart";
import { EmptyState } from "@registry/aikoz/empty-state/empty-state";
import { LineChart } from "@registry/aikoz/line-chart/line-chart";
import { Pagination } from "@registry/aikoz/pagination/pagination";
import { ProgressBar } from "@registry/aikoz/progress-bar/progress-bar";
import { ScoreStars } from "@registry/aikoz/score-stars/score-stars";
import { Select } from "@registry/aikoz/select/select";
import { Table, type TableColumn } from "@registry/aikoz/table/table";
import { ViewTabs } from "@registry/aikoz/view-tabs/view-tabs";

import { CoquilleADP, type Espace } from "./adp-commun";

// ─── Les données ─────────────────────────────────────────────────────────────

/** Bloc 1 — de leur maquette : 79 %, moyenne marché 86 %, −7 pts. */
const TAUX = [
  { mois: "oct. 25", taux: 83, marche: 85 },
  { mois: "nov. 25", taux: 82, marche: 85 },
  { mois: "déc. 25", taux: 86, marche: 85 },
  { mois: "janv. 26", taux: 87, marche: 86 },
  { mois: "févr. 26", taux: 86, marche: 86 },
  { mois: "mars 26", taux: 88, marche: 86 },
  { mois: "avr. 26", taux: 74, marche: 86 },
  { mois: "mai 26", taux: 73, marche: 86 },
  { mois: "juin 26", taux: 76, marche: 86 },
  { mois: "juil. 26", taux: 77, marche: 86 },
  { mois: "août 26", taux: 78, marche: 86 },
  { mois: "sept. 26", taux: 79, marche: 86 },
];

/**
 * Bloc 2 — ILLUSTRATIF. L'indicateur est en cours de qualification.
 *
 * Empilé par famille : le nombre seul dit qu'il se passe quelque chose, la
 * composition dit quoi. Sur un pic, c'est la seule question qui compte.
 */
const SENSIBLES = [
  { mois: "avr.", surete: 12, securite: 7, incidents: 4 },
  { mois: "mai", surete: 14, securite: 6, incidents: 5 },
  { mois: "juin", surete: 11, securite: 9, incidents: 3 },
  { mois: "juil.", surete: 23, securite: 12, incidents: 8 },
  { mois: "août", surete: 19, securite: 10, incidents: 6 },
  { mois: "sept.", surete: 13, securite: 8, incidents: 4 },
];

/** Bloc 4 — de leur maquette : 28 390 réponses publiées. */
const ACTIONS = [
  { key: "ia", label: "Réponse assistée IA (validée)", value: 50 },
  { key: "manuelle", label: "Réponse manuelle", value: 29 },
  { key: "auto", label: "Réponse automatique", value: 17 },
  { key: "escalade", label: "Escalade / traitement POI", value: 4 },
];

export type ModeReponse = "IA" | "AUTO" | "MANUEL" | "ESCALADE";

export interface AvisRepondu {
  id: string;
  date: string;
  note: number;
  avis: string;
  reponse: string;
  mode: ModeReponse;
  poi: string;
}

export const DERNIERS_AVIS: AvisRepondu[] = [
  { id: "1", date: "11/09/2026", note: 5, avis: "Nous nous sommes toujours facilement repérés dans les terminaux.", reponse: "Votre note nous fait plaisir ! Nous sommes ravis de vous compter parmi nos voyageurs.", mode: "IA", poi: "Aéroport de Paris-Orly" },
  { id: "2", date: "11/09/2026", note: 4, avis: "Grand aéroport, mais je pense que le parcours pourrait être mieux signalé.", reponse: "Cher Monsieur Santos, nous vous remercions pour ce retour constructif.", mode: "IA", poi: "Aéroport de Paris-Orly" },
  { id: "3", date: "11/09/2026", note: 5, avis: "Tout va bien", reponse: "Chère Madame Vega, merci pour votre note et à très bientôt.", mode: "AUTO", poi: "Aéroport de Paris-Orly" },
  { id: "4", date: "11/09/2026", note: 2, avis: "Aucun progrès en 25 ans ! Un peu mieux côté propreté, mais c'est tout.", reponse: "Bonjour, nous vous remercions d'avoir pris le temps de nous écrire.", mode: "ESCALADE", poi: "Aéroport de Paris-Orly" },
  { id: "5", date: "10/09/2026", note: 5, avis: "Latchou, grâce à votre gentillesse et à votre sourire, ce voyage a bien commencé.", reponse: "Bonjour Monsieur Choi ! Au nom de toute l'équipe, merci pour ce message.", mode: "IA", poi: "Extime Duty Free Paris | Paris-CDG" },
  { id: "6", date: "10/09/2026", note: 5, avis: "Un service client exceptionnel ! Le vendeur a pris le temps de tout m'expliquer.", reponse: "Bonjour Madame Boggiano, merci pour ce retour qui touche toute l'équipe.", mode: "IA", poi: "Extime Duty Free Paris | Paris-CDG" },
  { id: "7", date: "10/09/2026", note: 5, avis: "Merci Abdul pour votre accueil chaleureux.", reponse: "Cher Christelle Planté, nous sommes ravis que votre passage se soit bien passé.", mode: "AUTO", poi: "Extime Duty Free Paris | Paris-CDG" },
  { id: "8", date: "10/09/2026", note: 5, avis: "Merci Abdul pour cette pause appréciée.", reponse: "Bonjour Aurélie, nous sommes ravis que cette pause vous ait plu.", mode: "AUTO", poi: "Extime Duty Free Paris | Paris-CDG" },
  { id: "9", date: "10/09/2026", note: 5, avis: "Abdul, meilleur service", reponse: "Bonjour Monsieur Taputu, merci pour ce mot qui fera plaisir à Abdul.", mode: "MANUEL", poi: "Extime Duty Free Paris | Paris-CDG" },
  { id: "10", date: "10/09/2026", note: 5, avis: "Abdul", reponse: "Bonjour Monsieur Palanathan, merci pour votre note.", mode: "MANUEL", poi: "Extime Duty Free Paris | Paris-CDG" },
];

// ─── Un bloc de supervision ──────────────────────────────────────────────────

function Bloc({
  titre,
  quoi,
  children,
  aQualifier = false,
}: {
  titre: string;
  quoi: string;
  children: React.ReactNode;
  /** L'indicateur n'est pas encore qualifié : les chiffres montrent la forme. */
  aQualifier?: boolean;
}) {
  return (
    <Card as="section" className="flex min-w-0 flex-col gap-3 p-4">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="m-0 text-sm font-semibold">{titre}</h3>
          {/* L'avertissement est DANS le bloc et non posé en travers comme
              une bannière d'attente : le bloc montre bien quelque chose, et
              ce qu'il faut dire est que le chiffre n'est pas la mesure. */}
          {aQualifier && (
            <Badge tone="neutral" size="sm">
              Chiffres illustratifs
            </Badge>
          )}
        </div>
        <p className="m-0 text-xs text-[var(--muted-foreground)]">{quoi}</p>
      </header>
      {children}
    </Card>
  );
}

// ─── L'onglet « Réponses » ───────────────────────────────────────────────────

function OngletReponses() {
  const [page, setPage] = useState(1);
  const parPage = 5;
  const lignes = DERNIERS_AVIS.slice((page - 1) * parPage, page * parPage);

  const colonnes: TableColumn<AvisRepondu>[] = [
    { key: "date", header: "Date" },
    {
      key: "note",
      header: "Note",
      cell: (r) => (
        <span className="inline-flex items-center gap-1 tabular-nums">
          {r.note}
          <ScoreStars value={r.note} max={5} size="sm" label={null} />
        </span>
      ),
    },
    { key: "avis", header: "Avis" },
    { key: "reponse", header: "Réponse" },
    {
      key: "mode",
      header: "Mode",
      cell: (r) => (
        // Le mode n'est pas un statut : rien n'y va bien ou mal. `neutral`
        // partout sauf l'escalade, qui est la seule à demander quelque chose
        // à quelqu'un.
        <Badge tone={r.mode === "ESCALADE" ? "warning" : "neutral"} size="sm">
          {r.mode}
        </Badge>
      ),
    },
    { key: "poi", header: "POI" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="supervision" className="flex flex-col gap-3">
        <h2 id="supervision" className="m-0 text-sm font-semibold uppercase tracking-wide">
          Supervision des réponses
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* ── 1. Une COURBE ─────────────────────────────────────────── */}
          <Bloc titre="Taux de réponse sur les POI" quoi="Tous POI du périmètre">
            <p className="m-0 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-[var(--primary)]">
                79 %
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                vs moyenne marché 86 % ·{" "}
                <strong className="font-semibold text-[var(--destructive-text)]">
                  −7 pts
                </strong>
              </span>
            </p>
            <LineChart
              caption="Douze derniers mois, contre la moyenne marché"
              data={TAUX}
              xKey="mois"
              series={[{ key: "taux", label: "Taux de réponse" }]}
              reference={{ key: "marche", label: "Moyenne marché" }}
              formatValue={(v) => `${v} %`}
              height={150}
            />
          </Bloc>

          {/* ── 2. Un HISTOGRAMME ─────────────────────────────────────── */}
          <Bloc
            aQualifier
            titre="Nombre de sujets sensibles"
            quoi="Détection des signaux sûreté, sécurité et incidents"
          >
            <p className="m-0 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">25</span>
              <span className="text-xs text-[var(--muted-foreground)]">
                sur septembre ·{" "}
                <strong className="font-semibold">−10</strong> vs août
              </span>
            </p>
            {/* Empilé, et pas côte à côte : la hauteur totale répond à « ça
                monte ? », les segments à « à cause de quoi ? ». Groupées,
                les trois familles se compareraient entre elles — ce qui
                n'est pas la question posée par ce bloc. */}
            <BarChart
              caption="Six derniers mois, par famille de signal"
              data={SENSIBLES}
              xKey="mois"
              layout="stacked"
              series={[
                { key: "surete", label: "Sûreté" },
                { key: "securite", label: "Sécurité" },
                { key: "incidents", label: "Incidents" },
              ]}
              height={150}
            />
          </Bloc>

          {/* ── 3. Une JAUGE ──────────────────────────────────────────── */}
          <Bloc
            aQualifier
            titre="Réponses hors charte ADP"
            quoi="Contrôle de conformité éditoriale des réponses"
          >
            <p className="m-0 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">3,2 %</span>
              <span className="text-xs text-[var(--muted-foreground)]">
                des réponses publiées
              </span>
            </p>
            {/* `level="good"` forcé : ici MOINS est mieux, et la déduction
                automatique de `ProgressBar` lirait 3,2 sur 100 comme un
                échec. Le `marker` pose l'objectif sur la piste — sans lui,
                un pourcentage isolé ne dit pas s'il est bon. */}
            <ProgressBar
              label="Part des réponses hors charte"
              value={3.2}
              max={10}
              marker={5}
              level="good"
              valueText="3,2 % pour un objectif de 5 % maximum"
            />
            <p className="m-0 text-xs text-[var(--muted-foreground)]">
              Objectif : sous 5 %. Premier motif —{" "}
              <strong className="font-semibold text-[var(--foreground)]">
                renvoi vers un tiers
              </strong>
              , 4 réponses sur 10.
            </p>
          </Bloc>

          {/* ── 4. Un ANNEAU ──────────────────────────────────────────── */}
          <Bloc titre="Type d'actions de réponse" quoi="Répartition des réponses publiées">
            <DonutChart
              caption="Part de chaque type d'action"
              parts={ACTIONS}
              centerValue="28 390"
              centerLabel="réponses"
              formatValue={(v) => `${v} %`}
              height={170}
            />
          </Bloc>
        </div>
      </section>

      <section aria-labelledby="visualisation" className="flex flex-col gap-3">
        <h2 id="visualisation" className="m-0 text-sm font-semibold uppercase tracking-wide">
          Visualisation des réponses
        </h2>
        <Card className="flex flex-col gap-4 p-4">
          <header className="flex flex-col gap-1">
            <h3 className="m-0 text-sm font-semibold">Derniers avis répondus</h3>
            <p className="m-0 text-xs text-[var(--muted-foreground)]">
              Vos POI · avis Google les plus récents
            </p>
          </header>
          {/* `layout="fixed"` : sans lui, les deux colonnes de texte libre
              — l'avis et la réponse — se partagent la largeur au prorata de
              leur contenu, et la ligne la plus bavarde décide de la mise en
              page de tout le tableau. */}
          <Table
            caption="Derniers avis répondus sur les POI du périmètre"
            columns={colonnes}
            rows={lignes}
            getRowKey={(r) => r.id}
            rowHeaderKey="avis"
            density="compact"
            layout="fixed"
          />
          <Pagination
            label="Pages des derniers avis répondus"
            page={page}
            pages={Math.ceil(DERNIERS_AVIS.length / parPage)}
            total={DERNIERS_AVIS.length}
            parPage={parPage}
            onPageChange={setPage}
            className="self-end"
          />
        </Card>
      </section>
    </div>
  );
}

// ─── L'écran ─────────────────────────────────────────────────────────────────

function PasEncoreMonte({ nom }: { nom: string }) {
  return (
    <EmptyState
      tone="error"
      title={`« ${nom} » n'est pas encore monté`}
      description="L'onglet existe et y mène déjà : l'écran suivra."
    />
  );
}

export interface TableauDeBordADPProps {
  poiSuivis?: number;
  avisSuivis?: number;
  avisEnAttente?: number;
  ongletInitial?: string;
  onNaviguer?: (espace: Espace) => void;
  onOuvrirConversation?: (id: string) => void;
}

const nombre = new Intl.NumberFormat("fr-FR");

export function TableauDeBordADP({
  poiSuivis = 93,
  avisSuivis = 35988,
  avisEnAttente,
  ongletInitial = "reponses",
  onNaviguer,
  onOuvrirConversation,
}: TableauDeBordADPProps) {
  return (
    <CoquilleADP
      espace="tableau"
      titre="Tableau de bord ADP"
      avisEnAttente={avisEnAttente}
      onNaviguer={onNaviguer}
      onOuvrirConversation={onOuvrirConversation}
    >
      <div className="flex flex-col gap-6 p-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <p className="m-0 text-sm text-[var(--muted-foreground)]">
            <strong className="font-semibold text-[var(--foreground)]">
              {poiSuivis} POI
            </strong>{" "}
            suivis ·{" "}
            <strong className="font-semibold text-[var(--foreground)]">
              {nombre.format(avisSuivis)} avis
            </strong>
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <Select
              label="Source"
              size="sm"
              defaultValue="google"
              options={[{ value: "google", label: "Google" }]}
            />
            <Select
              label="Période"
              size="sm"
              defaultValue="12m"
              options={[
                { value: "12m", label: "12 derniers mois" },
                { value: "6m", label: "6 derniers mois" },
                { value: "3m", label: "3 derniers mois" },
              ]}
            />
          </div>
        </header>

        <ViewTabs
          label="Vues du tableau de bord"
          defaultValue={ongletInitial}
          tabs={[
            { value: "ensemble", label: "Vue d'ensemble", content: <PasEncoreMonte nom="Vue d'ensemble" /> },
            { value: "classement", label: "Classement", content: <PasEncoreMonte nom="Classement" /> },
            { value: "reponses", label: "Réponses", content: <OngletReponses /> },
            { value: "supervision", label: "Supervision", content: <PasEncoreMonte nom="Supervision" /> },
          ]}
        />
      </div>
    </CoquilleADP>
  );
}
