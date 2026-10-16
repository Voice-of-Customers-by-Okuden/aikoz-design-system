/**
 * AccueilAgence — ASSEMBLAGE.
 *
 * L'accueil de l'agence, refait à partir de la vision cible d'Arnaud.
 *
 * ── Ce que cet écran corrige ─────────────────────────────────────────────
 *
 * Son prototype était la SPÉCIFICATION, pas le livrable. Il enfreignait cinq
 * règles du design system, et chacune a une raison d'exister :
 *
 *  1. Les compteurs de la navigation étaient ROUGES. Le rouge est le rôle
 *     d'erreur : « Gestion des avis · 6 » en rouge annonce un problème là où
 *     il n'y a qu'un nombre. Ici ils lisent le ton `neutral` de `CountBadge`,
 *     qui existe précisément pour « ce qui attend sans que rien n'aille mal ».
 *  2. « Se déconnecter » était rouge aussi. Se déconnecter n'est pas
 *     destructeur.
 *  3. Les boutons avaient un rayon de 6 px. L'échelle Aikoz va 2 / 4 / 8 /
 *     12 / 16 / 9999 — 6 px n'y est pas. C'est la valeur du Claude Design,
 *     arrivée par copie.
 *  4. « Donner votre voix » était une pilule vert pâle à texte bleu : ni une
 *     variante de bouton, ni une couleur de rôle. C'est un bouton `outline`.
 *  5. Deux encarts portaient une teinte de SUCCÈS pour une action suggérée et
 *     une idée de post. Ni l'une ni l'autre n'est un succès ; ils prennent la
 *     surface neutre, et leur pictogramme dit ce qu'ils sont.
 *
 * ── Ce que cet écran N'EST PAS ───────────────────────────────────────────
 *
 * Il ne porte pas sa barre latérale. La coquille de l'outil est un sujet à
 * part : celle d'ADP s'appelle `CoquilleADP` et porte le nom d'un produit
 * client. En coller une copie ici reviendrait à refaire l'erreur qu'on vient
 * de défaire. L'écran se monte donc dans le gabarit de page de son hôte.
 */

import { type ReactNode } from "react";

import { Card } from "@registry/aikoz/card/card";
import { Badge } from "@registry/aikoz/badge/badge";
import { Button } from "@registry/aikoz/button/button";
import { Checklist } from "@registry/aikoz/checklist/checklist";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";
import { ScoreRing } from "@registry/aikoz/score-ring/score-ring";
import { VerbatimCard } from "@registry/aikoz/verbatim-card/verbatim-card";

// ─── Pictogrammes ─────────────────────────────────────────────────────────
//
// Trait de 2 px, une seule couleur, jamais de remplissage — la règle d'icône
// de la charte. Toujours `aria-hidden` : le sens est dans le texte à côté.
function Ico({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
         strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className={className ?? "h-4 w-4 shrink-0"}>
      {d.split("|").map((p) => <path key={p} d={p} />)}
    </svg>
  );
}
const D = {
  valider: "M20 6 9 17l-5-5",
  crayon: "M4 20h4L20 8l-4-4L4 16v4z|M14 6l4 4",
  bulle: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  jauge: "M12 21a9 9 0 1 0-9-9|M3 12a9 9 0 0 1 18 0|M12 12l4-3",
  graphe: "M3 3v18h18|M8 16V11|M12.5 16V7|M17 16v-3",
  enveloppe: "M3 6h18v12H3z|M3 7l9 6 9-6",
};

// ─── Section ──────────────────────────────────────────────────────────────

function Section({ titre, action, children }: { titre: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-base font-semibold">{titre}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// ─── Les données de démonstration ─────────────────────────────────────────

const THEMES = [
  { id: "accueil", label: "Accueil et amabilité", value: 6 },
  { id: "conseil", label: "Qualité du conseil", value: 6 },
  { id: "sinistres", label: "Gestion des sinistres", value: 5 },
];

const AVIS = [
  { id: "a1", rating: 2, source: "Google", date: "05 octobre 2026",
    text: "Déclaration de sinistre dégât des eaux faite en juillet, toujours aucun expert passé. Trois relances par téléphone, on me répond à chaque fois que le dossier est en cours." },
  { id: "a2", rating: 5, source: "Google", date: "05 octobre 2026",
    text: "Accueil toujours aussi professionnel. Mme Lefèvre a pris le temps de comparer les formules habitation et m'a fait économiser près de 200 € par an. Je recommande." },
  { id: "a3", rating: 5, source: "Google", date: "04 octobre 2026",
    text: "Très bon conseil, rapide et efficace." },
];

const PREMIERS_PAS = [
  { id: "repondre", title: "Répondez à votre dernier avis client", effort: "2 min",
    detail: "Choisissez un avis récent et publiez une réponse personnalisée, rédigée avec l'aide d'Aikoz.",
    action: { label: "Commencer" } },
  { id: "agence", title: "Personnaliser votre agence digitale", effort: "3 min",
    detail: "Complétez les trois sections de votre page publique." },
  { id: "secrets", title: "3 secrets des top-agents", effort: "5 min",
    detail: "Ce que font les agences les mieux notées, et que les autres ignorent." },
  { id: "sms", title: "Solliciter un avis par SMS", effort: "5 min",
    detail: "Un message, un lien, un avis de plus." },
  { id: "post", title: "Publiez votre actualité Agence", effort: "3 min",
    detail: "Une publication visible sur votre fiche." },
];

const SECTIONS_AGENCE = [
  { id: "accueil", title: "Page d'accueil", progress: { done: 0, total: 2 } },
  { id: "offres", title: "Nos offres", progress: { done: 0, total: 1 } },
  { id: "qui", title: "Qui sommes-nous ?", progress: { done: 0, total: 2 } },
];

// ─── Composant ────────────────────────────────────────────────────────────

export function AccueilAgence() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <h1 className="sr-only">Accueil de votre agence</h1>

      {/* ── La story de la semaine ─────────────────────────────────────── */}
      <Card className="flex flex-col gap-4 p-5">
        <header className="flex flex-col gap-1">
          <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
            Votre story de la semaine
          </span>
          <h2 className="m-0 text-lg font-semibold">
            Un sujet revient dans vos avis : « Expert qui tarde à passer »
          </h2>
          <p className="m-0 text-xs text-muted-foreground">
            Générée le lundi 6 octobre · 21 avis sur les 30 derniers jours
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Les thèmes les plus cités
            </h3>
            {/* ── Pourquoi PAS `RankingBars` ────────────────────────
                Il classe des NOTES et leur attribue un niveau — bon,
                moyen, critique — déduit de seuils. Posé sur des
                fréquences, il sort « Gestion des sinistres · 5 avis » en
                rouge, comme si être cité cinq fois était un problème. Il
                ajoute en plus une étoile de note à chaque ligne.

                Un thème cité six fois n'est ni bon ni mauvais : c'est un
                volume. Le système n'a pas de composant pour ça, et en
                détourner un qui porte un jugement serait pire que de s'en
                passer. DETTE OUVERTE : une liste de fréquences mériterait
                son composant le jour où un deuxième écran en demande une. */}
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {THEMES.map((t) => (
                <li key={t.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium">{t.label}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {t.value} avis
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sujet récurrent
            </h3>
            <p className="m-0 text-sm font-semibold">Expert qui tarde à passer</p>
            <p className="m-0 text-xs text-muted-foreground">
              Gestion des sinistres · revient dans 6 avis sur 90 jours
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Point fort
            </h3>
            <p className="m-0 text-sm font-semibold">Accueil chaleureux et souriant</p>
            <p className="m-0 text-xs text-muted-foreground">
              Accueil et amabilité · 4 avis ce mois-ci
            </p>
          </div>
        </div>

        {/* Surface NEUTRE, et non une teinte de succès : une action suggérée
            n'est pas un succès. Le pictogramme dit ce que c'est. */}
        <div className="grid gap-3 md:grid-cols-2">
          <Encart ico={D.valider} titre="Action suggérée"
                  action={<Button size="sm">Voir les avis concernés</Button>}>
            Rappeler cette semaine les clients qui attendent un expert, puis répondre
            publiquement aux avis concernés en donnant une date de passage.
          </Encart>
          <Encart ico={D.crayon} titre="Idée de post"
                  action={<Button size="sm" variant="outline">Préparer le post</Button>}>
            Présenter l'équipe : vos clients saluent l'accueil et la disponibilité de l'agence.
          </Encart>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ico d={D.enveloppe} />
            Envoyée aussi par e-mail chaque lundi à 7 h.
          </span>
          <Button size="sm" variant="ghost">Approfondir avec Aikoz</Button>
        </footer>
      </Card>

      {/* ── Où allez-vous ? ────────────────────────────────────────────── */}
      <Section titre="Où allez-vous ?">
        <div className="grid gap-4 md:grid-cols-3">
          <Porte ico={D.bulle} titre="Gestion des avis"
                 quoi="Répondre aux avis, seul ou avec l'assistant, et suivre ce qui part en validation."
                 chiffre={<Badge tone="neutral" size="sm">6 avis sans réponse</Badge>} />
          <Porte ico={D.jauge} titre="Cockpit Agence"
                 quoi="Note, volume et polarité par thème, pour l'agence sur laquelle vous travaillez."
                 chiffre={<span className="text-sm font-semibold tabular-nums">4,90/5 · 463 avis</span>} />
          <Porte ico={D.graphe} titre="Marché"
                 quoi="Votre agence face aux autres : répartition, évolution et cartes."
                 chiffre={<span className="text-sm font-semibold tabular-nums">4,55/5 · 4ᵉ sur 20</span>} />
        </div>
      </Section>

      {/* ── Les avis ───────────────────────────────────────────────────── */}
      <Section titre="Vos avis clients"
               action={<Button size="sm" variant="ghost">Voir tous mes avis</Button>}>
        <div className="grid gap-4 md:grid-cols-3">
          {AVIS.map((a) => (
            <VerbatimCard key={a.id} text={a.text} rating={a.rating} source={a.source}
                          date={a.date} lines={4} />
          ))}
        </div>
      </Section>

      {/* ── Démarrage et vue d'ensemble ────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section titre="Vos premiers pas">
          <Checklist label="Vos premiers pas" labelHidden tasks={PREMIERS_PAS}
                     defaultOpen="repondre" headingLevel={3} />
        </Section>

        <Section titre="Vue d'ensemble">
          <div className="flex flex-col gap-4">
            <Card className="flex flex-wrap items-center justify-around gap-4 p-5">
              <KpiCard label="Avis · Google" value={463} density="compact" />
              <ScoreRing label="Votre note Google" value={4.9} max={5}
                         description="Votre note · Google"
                         formatValue={(v) => v.toFixed(2).replace(".", ",")} />
            </Card>
            <Checklist label="Personnalisez le contenu de votre agence"
                       unit="sections" tasks={SECTIONS_AGENCE} headingLevel={3} />
          </div>
        </Section>
      </div>
    </main>
  );
}

// ─── Pièces internes ──────────────────────────────────────────────────────
//
// Elles ne sont PAS exportées : une carte qui n'a de sens que sur cet écran
// n'est pas un composant. L'exporter inviterait à la poser ailleurs, où elle
// perdrait son contexte — même raisonnement que l'absence de `RankRow` dans
// `Leaderboard`.

function Encart({ ico, titre, action, children }: {
  ico: string; titre: string; action: ReactNode; children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] bg-[var(--muted)] p-4">
      <span className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Ico d={ico} />
        {titre}
      </span>
      <p className="m-0 flex-1 text-sm">{children}</p>
      <div className="self-start">{action}</div>
    </div>
  );
}

function Porte({ ico, titre, quoi, chiffre }: {
  ico: string; titre: string; quoi: string; chiffre: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Ico d={ico} />
        {titre}
      </span>
      <p className="m-0 flex-1 text-xs text-muted-foreground">{quoi}</p>
      <div className="pt-1">{chiffre}</div>
    </Card>
  );
}
