import { useEffect, useState } from "react";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";
import { Star, StarFill, ArrowUpward } from "@material-symbols-svg/react/rounded";
import { contrast, cssVar } from "./contrast";

/**
 * Page de décisions — cinq arbitrages en attente, rendus côte à côte.
 *
 * Rien ici n'est un composant du design system : les options « B » sont des
 * maquettes de comparaison, écrites uniquement pour rendre le choix visible.
 * Elles vivent dans le playground et n'ont pas vocation à être extraites.
 */

// ─── Cadre commun ─────────────────────────────────────────────────────────────

function Decision({
  n,
  title,
  question,
  children,
  impact,
  reco,
  blocking,
}: {
  n: number;
  title: string;
  question: string;
  children: React.ReactNode;
  impact: React.ReactNode;
  reco: React.ReactNode;
  blocking?: string;
}) {
  return (
    <section className="mb-16 pb-16 border-b border-border last:border-0">
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] text-sm font-bold shrink-0">
          {n}
        </span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {blocking && (
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border border-[var(--destructive-text)] text-[var(--destructive-text)] bg-[color-mix(in_oklch,var(--destructive-text),transparent_94%)]">
            bloquant · {blocking}
          </span>
        )}
      </div>
      <p className="text-base text-foreground mb-6 max-w-2xl">{question}</p>

      <div className="mb-6">{children}</div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-[var(--radius)] bg-muted p-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Ce que ça change
          </h4>
          <div className="text-sm text-foreground">{impact}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-border p-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Ce que je recommande
          </h4>
          <div className="text-sm text-foreground">{reco}</div>
        </div>
      </div>
    </section>
  );
}

function Option({
  tag,
  label,
  source,
  children,
}: {
  tag: "A" | "B";
  label: string;
  source: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[280px] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full border border-border text-xs font-bold text-foreground shrink-0">
          {tag}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{source}</div>
        </div>
      </div>
      <div className="rounded-[var(--radius)] border border-border bg-card p-5 flex-1 flex items-start">
        {children}
      </div>
    </div>
  );
}

const Face = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-6 items-stretch">{children}</div>
);

// ─── 1 · KpiCard ──────────────────────────────────────────────────────────────

/** Maquette de comparaison — reproduit la carte des maquettes Figma. */
function KpiCardMaquette() {
  return (
    <div className="w-full max-w-[260px] flex flex-col gap-2 rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-muted-foreground">Taux de réponse</span>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 border border-[var(--success)] bg-[color-mix(in_oklch,var(--success),transparent_92%)] text-[var(--success)]">
          <ArrowUpward className="w-3 h-3" aria-hidden="true" />
          4,2 pts
        </span>
      </div>
      <div className="text-4xl font-bold tracking-tight text-foreground">87 %</div>
      <div
        className="h-2 w-full rounded-full bg-muted overflow-hidden"
        role="img"
        aria-label="87 % de l'objectif de 90 %"
      >
        <div className="h-full rounded-full bg-[var(--success)]" style={{ width: "87%" }} />
      </div>
      <span className="text-xs text-muted-foreground">Objectif · 90 %</span>
    </div>
  );
}

// ─── 2 · Navigation ───────────────────────────────────────────────────────────

const NAV = ["Marché", "Campagnes", "Hall of Fames", "Paramètres"];

function NavSidebar() {
  return (
    <div className="w-full flex gap-3">
      <div className="w-40 shrink-0 flex flex-col gap-1">
        {NAV.map((n, i) => (
          <div
            key={n}
            className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm ${
              i === 0
                ? "bg-[color-mix(in_oklch,var(--secondary),transparent_88%)] text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-sm shrink-0 ${
                i === 0 ? "bg-[var(--secondary)]" : "bg-muted-foreground/40"
              }`}
            />
            <span className="truncate">{n}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-[var(--radius)] bg-muted min-h-[132px]" />
    </div>
  );
}

function NavTabs() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-1 border-b border-border">
        {NAV.map((n, i) => (
          <div
            key={n}
            className={`px-3 py-2 text-sm -mb-px border-b-2 whitespace-nowrap ${
              i === 0
                ? "border-[var(--secondary)] text-foreground font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {n}
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-[var(--radius)] bg-muted min-h-[96px]" />
    </div>
  );
}

// ─── 3 · Letter-spacing ───────────────────────────────────────────────────────

const NUMBERS = ["1 248", "312", "4 807", "1 111"];

function TypeSample({ longhand }: { longhand: boolean }) {
  // A : shorthand `font` — ce que produit le build aujourd'hui.
  // B : longhand — chaque propriété posée séparément, tracking et tnum survivent.
  const base: React.CSSProperties = longhand
    ? {
        fontFamily: "var(--font-family-body)",
        fontSize: "var(--dimension-font-size-2xs)",
        fontWeight: "var(--font-weight-medium)" as any,
        lineHeight: "var(--line-height-loose)" as any,
        letterSpacing: "var(--letter-spacing-wider)",
      }
    : { font: "var(--role-typography-label-sm)" };

  const numeric: React.CSSProperties = longhand
    ? {
        fontFamily: "var(--font-family-mono)",
        fontSize: "var(--dimension-font-size-xl)",
        fontWeight: "var(--font-weight-medium)" as any,
        lineHeight: "var(--line-height-tight)" as any,
      }
    : { font: "var(--role-typography-metric)" };

  const [read, setRead] = useState<{ ls: string; vn: string } | null>(null);
  const id = `ls-${longhand ? "b" : "a"}`;

  useEffect(() => {
    const a = document.getElementById(id);
    const b = document.getElementById(id + "-num");
    if (!a || !b) return;
    setRead({
      ls: getComputedStyle(a).letterSpacing,
      vn: getComputedStyle(b).fontVariantNumeric,
    });
  }, [longhand]);

  return (
    // `tabular-nums` est posé ici, sur le conteneur : c'est le cas réel — la
    // propriété vient d'un ancêtre, et le shorthand `font` la réinitialise.
    <div
      className="w-full flex flex-col gap-4"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          label-sm · tracking déclaré : wider (0.05em)
        </div>
        <div id={id} style={base} className="text-foreground">
          AVIS TRAITÉS CE MOIS
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          metric · chiffres alignés ?
        </div>
        <div id={id + "-num"} style={numeric} className="text-foreground">
          {NUMBERS.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
      </div>

      {read && (
        <div className="text-[11px] font-mono flex flex-col gap-0.5 pt-2 border-t border-border">
          <span className={read.ls === "normal" ? "text-[var(--destructive-text)]" : "text-[var(--success)]"}>
            letter-spacing : {read.ls}
          </span>
          <span
            className={
              read.vn === "normal" ? "text-[var(--destructive-text)]" : "text-[var(--success)]"
            }
          >
            variant-numeric : {read.vn}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── 4 · Couleur des étoiles ──────────────────────────────────────────────────

function Stars({ color, value = 4 }: { color: string; value?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value} sur 5 étoiles`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <StarFill key={i} className="w-6 h-6" style={{ color }} aria-hidden="true" />
        ) : (
          <Star key={i} className="w-6 h-6 text-muted-foreground/30" aria-hidden="true" />
        )
      )}
    </div>
  );
}

/**
 * Rampe de candidats pour le rôle « notation ».
 * Le seuil qui s'applique est 3:1 (WCAG 1.4.11) : l'étoile porte l'information,
 * ce n'est pas du texte. Mesuré contre --card, dans le thème actif.
 */
const RATING_STEPS = [400, 500, 600, 700];

function RatingRamp({ dark }: { dark: boolean }) {
  const [rows, setRows] = useState<{ step: number; color: string; ratio: number | null }[]>([]);

  useEffect(() => {
    const card = cssVar("--card");
    setRows(
      RATING_STEPS.map((step) => {
        const color = cssVar(`--color-warning-${step}`);
        return { step, color, ratio: color ? contrast(color, card) : null };
      })
    );
  }, [dark]);

  return (
    <div className="w-full flex flex-col gap-3">
      {rows.map(({ step, color, ratio }) => {
        const ok = ratio !== null && ratio >= 3;
        return (
          <div key={step} className="flex items-center gap-3 flex-wrap">
            <span className="w-12 shrink-0 text-[11px] font-mono text-muted-foreground">
              {step}
            </span>
            <Stars color={color} />
            <span
              className={`text-[11px] font-mono ${
                ok ? "text-[var(--success)]" : "text-[var(--destructive-text)]"
              }`}
            >
              {ratio === null ? "—" : `${ratio.toFixed(2)}:1 ${ok ? "OK" : "échec"}`}
            </span>
          </div>
        );
      })}
      <div className="text-[11px] text-muted-foreground pt-2 border-t border-border">
        Seuil 3:1 — WCAG 1.4.11. Bascule le thème : la rampe s'inverse, ce qui passe en
        light échoue en dark et réciproquement.
      </div>
    </div>
  );
}

function StarOption({ color, dark }: { color: string; dark: boolean }) {
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    // `color` peut être une référence var(--x) : le canvas ne sait pas la parser,
    // il faut la résoudre en valeur littérale avant de mesurer.
    const m = color.match(/^var\(\s*(--[^),\s]+)/);
    const resolved = m ? cssVar(m[1]) : color;
    setRatio(contrast(resolved, cssVar("--card")));
  }, [color, dark]);

  const ok = ratio !== null && ratio >= 3;
  return (
    <div className="w-full flex flex-col gap-3">
      <Stars color={color} />
      <div className="text-[11px] font-mono text-muted-foreground break-all">{color}</div>
      <div className="text-[11px] font-mono pt-2 border-t border-border">
        <span className={ok ? "text-[var(--success)]" : "text-[var(--destructive-text)]"}>
          {ratio === null ? "—" : `${ratio.toFixed(2)}:1 vs carte · ${ok ? "OK" : "échec"}`}
        </span>
        <div className="text-muted-foreground mt-1">
          seuil 3:1 — élément non textuel porteur d'information (WCAG 1.4.11)
        </div>
      </div>
    </div>
  );
}

// ─── 5 · VerbatimCard ─────────────────────────────────────────────────────────

function SentimentTag({ kind }: { kind: "positive" | "negative" | "neutral" }) {
  const map = {
    positive: ["var(--success)", "Positif"],
    negative: ["var(--destructive-text)", "Négatif"],
    neutral: ["var(--muted-foreground)", "Neutre"],
  } as const;
  const [color, label] = map[kind];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 border"
      style={{
        color,
        borderColor: color,
        background: `color-mix(in oklch, ${color}, transparent 92%)`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function VerbatimCardMockup() {
  return (
    <div className="w-full max-w-[420px] flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <Stars color="var(--color-warning-500)" value={4} />
          <span className="text-xs text-muted-foreground">
            Google · Allianz Lyon Centre · 12 août 2026
          </span>
        </div>
        <SentimentTag kind="positive" />
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        « Prise en charge rapide après mon sinistre, la conseillère a rappelé le
        lendemain comme promis. Un peu de retard sur l'expertise, mais rien de
        bloquant. »
      </p>
      <div className="flex gap-2 flex-wrap pt-1">
        {["Réactivité", "Expertise"].map((t) => (
          <span
            key={t}
            className="text-[11px] rounded-full px-2 py-0.5 bg-muted text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Decisions({ dark }: { dark: boolean }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-10 max-w-2xl">
        Cinq arbitrages en attente. Les options sont rendues avec les vrais tokens —
        bascule le thème pour vérifier en dark. Les variantes « B » sont des maquettes
        de comparaison, pas des composants : elles servent uniquement à rendre le choix
        visible.
      </p>

      <Decision
        n={1}
        title="KpiCard — quelle carte ?"
        blocking="ScoreStars + DeltaBadge"
        question="Le composant livré et les maquettes ne décrivent pas la même carte. L'un des deux est périmé."
        impact={
          <>
            <code className="font-mono text-xs">ScoreStars</code> et{" "}
            <code className="font-mono text-xs">DeltaBadge</code> sont inlinés dans{" "}
            <code className="font-mono text-xs">kpi-card.tsx</code> : on ne peut pas les
            extraire tant que la carte n'est pas fixée. Choisir B ajoute{" "}
            <code className="font-mono text-xs">ProgressBar</code> en v1 (composant Figma
            existant) et retire les étoiles de la carte — <code className="font-mono text-xs">ScoreStars</code>{" "}
            servirait alors seulement à <code className="font-mono text-xs">VerbatimCard</code>.
          </>
        }
        reco={
          <>
            <strong>B, la maquette.</strong> Les 4 cartes du dashboard portent une barre
            de progression et un objectif ; aucune ne montre d'étoile. Une note sur 5 en
            étoiles n'a de sens que pour un avis, pas pour un taux de réponse ou un délai.
            La sparkline reste utile mais relève d'un variant, pas du défaut.
          </>
        }
      >
        <Face>
          <Option tag="A" label="Version code" source="registry/aikoz/kpi-card — étoiles + sparkline">
            <KpiCard size="md" label="Note moyenne" value={4.2} max={5} trend={12} />
          </Option>
          <Option tag="B" label="Version maquette" source="Figma + dashboard-marche-light.png">
            <KpiCardMaquette />
          </Option>
        </Face>
      </Decision>

      <Decision
        n={2}
        title="Navigation globale — Sidebar ou Tabs ?"
        question="L'inventaire listait Tabs en v1. Les deux maquettes du dashboard utilisent une Sidebar."
        impact={
          <>
            Sidebar → <code className="font-mono text-xs">Sidebar</code> et{" "}
            <code className="font-mono text-xs">NavItem</code> entrent en v1 (les deux
            existent déjà comme composants Figma) et <code className="font-mono text-xs">Tabs</code>{" "}
            rétrograde en bascule locale. Tabs → il faut redessiner la navigation, les
            maquettes ne la couvrent plus.
          </>
        }
        reco={
          <>
            <strong>Sidebar.</strong> C'est ce que montrent les maquettes, les composants
            Figma existent, et 4 entrées avec des libellés longs (« Hall of Fames »)
            tiennent mal en tabs horizontales. Réserve : en white-label embarqué, une
            sidebar consomme de la largeur — à vérifier si le dashboard doit s'insérer
            dans la page d'un client.
          </>
        }
      >
        <Face>
          <Option tag="A" label="Sidebar" source="Figma · organisme Sidebar + molécule NavItem">
            <NavSidebar />
          </Option>
          <Option tag="B" label="Tabs horizontales" source="inventaire v1.0 · non maquetté">
            <NavTabs />
          </Option>
        </Face>
      </Decision>

      <Decision
        n={3}
        title="Typographie — shorthand ou longhand ?"
        question="Le shorthand CSS `font` ne transporte pas le letter-spacing, et efface les chiffres tabulaires."
        impact={
          <>
            Longhand = 5 variables par rôle au lieu d'1 (70 au total), et deux lignes au
            lieu d'une côté composant. En échange, plus aucune propriété perdue
            silencieusement. Coût de migration nul aujourd'hui :{" "}
            <strong>aucun composant ne consomme encore ces variables</strong>.
          </>
        }
        reco={
          <>
            <strong>Longhand.</strong> Regarde la colonne A : le tracking déclaré est
            perdu, et les chiffres ne s'alignent pas — sur le rôle nommé{" "}
            <code className="font-mono text-xs">metric</code>, celui des KPI. Une couche
            de tokens qui jette des données source sans rien dire n'est pas fiable ; le
            letter-spacing n'était que la partie visible.
          </>
        }
      >
        <Face>
          <Option tag="A" label="Shorthand `font`" source="ce que produit le build aujourd'hui">
            <TypeSample longhand={false} />
          </Option>
          <Option tag="B" label="Longhand" source="une propriété CSS par token">
            <TypeSample longhand={true} />
          </Option>
        </Face>
      </Decision>

      <Decision
        n={4}
        title="ScoreStars — quelle couleur ?"
        question="StarRating colore les étoiles en text-amber-400 : la seule couleur hors tokens de tout le code livré."
        impact={
          <>
            Une couleur Tailwind brute ne suit ni le thème, ni le white-label : chez
            Generali, les étoiles resteraient ambre. Il faut un rôle dédié — pas le
            détournement d'un rôle existant, aucun ne porte aujourd'hui la sémantique
            « notation ».
          </>
        }
        reco={
          <>
            <strong>
              Créer <code className="font-mono text-xs">role.color.rating</code>, branché
              sur <code className="font-mono text-xs">warning-600</code>.
            </strong>{" "}
            C'est le seul palier qui passe dans les deux thèmes — 3,25:1 en light et
            5,35:1 en dark. Marge courte en light : si tu veux du confort, un rôle
            thématisé (700 en light à 5,13:1, 500 en dark à 7,97:1) tient mieux, mais le
            700 vire au brun et cesse de se lire comme une étoile. Arbitrage entre marge
            a11y et lisibilité de l'icône.
          </>
        }
      >
        <Face>
          <Option tag="A" label="text-amber-400" source="code actuel · hors tokens">
            <StarOption color="#fbbf24" dark={dark} />
          </Option>
          <Option tag="B" label="role.color.rating" source="quel palier de la rampe warning ?">
            <RatingRamp dark={dark} />
          </Option>
        </Face>
      </Decision>

      <Decision
        n={5}
        title="VerbatimCard — au périmètre v1 ?"
        question="Absente de la liste de Louis et du Figma. Mais le Figma contient un atome Tag avec 3 variantes de sentiment, sans aucun usage maquetté."
        impact={
          <>
            Oui → +1 composant spécifique en v1, et{" "}
            <code className="font-mono text-xs">ScoreStars</code> garde une raison d'être
            même si la décision 1 retire les étoiles du KpiCard. Non → l'atome{" "}
            <code className="font-mono text-xs">Tag</code> du Figma reste orphelin, et le
            dashboard n'affiche que des agrégats.
          </>
        }
        reco={
          <>
            <strong>Oui, mais confirme l'usage produit d'abord.</strong> Un tag de
            sentiment ne se qualifie que sur un avis unitaire — un agrégat a une moyenne,
            pas un sentiment. Quelqu'un a dessiné cet atome pour un écran qui n'a jamais
            été maquetté. La vraie question est produit, pas design : le dashboard v1
            donne-t-il accès aux avis un par un ?
          </>
        }
      >
        <Face>
          <Option tag="A" label="Proposition" source="maquette · réutilise l'atome Tag du Figma">
            <VerbatimCardMockup />
          </Option>
          <Option tag="B" label="Hors périmètre v1" source="agrégats uniquement">
            <div className="w-full flex items-center justify-center min-h-[160px] text-sm text-muted-foreground text-center px-4">
              Le dashboard n'affiche que des moyennes, des classements et des
              répartitions. L'atome <code className="font-mono text-xs">Tag</code> du
              Figma reste inutilisé.
            </div>
          </Option>
        </Face>
      </Decision>
    </div>
  );
}
