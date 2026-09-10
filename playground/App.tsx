import { useState } from "react";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";
import { Button } from "@registry/aikoz/button/button";
import { ScoreStars } from "@registry/aikoz/score-stars/score-stars";
import { DeltaBadge } from "@registry/aikoz/delta-badge/delta-badge";
import { ProgressBar } from "@registry/aikoz/progress-bar/progress-bar";
import Tokens from "./Tokens";
import Decisions from "./Decisions";

type View = "décisions" | "tokens" | "composants";

const DEMO_SPARKLINE = [3.6, 3.7, 3.8, 3.7, 3.9, 4.0, 3.9, 4.1, 4.0, 4.2, 4.2, 4.2];

const BUTTON_VARIANTS = ["default", "secondary", "outline", "ghost"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

function ButtonDemoContent() {
  return (
    <>
      {/* Matrice 4 variants × 3 tailles */}
      <div className="space-y-4">
        {BUTTON_SIZES.map((size) => (
          <div key={size} className="flex items-center gap-4 flex-wrap">
            <span className="w-8 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {size}
            </span>
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
          </div>
        ))}
      </div>

      {/* États du variant default */}
      <h3 className="text-sm font-semibold text-foreground mt-8 mb-3">
        Variant default — états
      </h3>
      <div className="flex flex-wrap items-center gap-4">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button>
          Un intitulé de bouton nettement plus long pour tester l'empilement du texte
        </Button>
      </div>
    </>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>("décisions");

  function toggleDark() {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aikoz Design System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Playground · état d'avancement en temps réel
            </p>
          </div>
          <button
            onClick={toggleDark}
            className="border border-border text-foreground bg-card rounded-[var(--radius)] px-4 py-2 text-sm font-medium hover:bg-muted transition-colors shrink-0"
          >
            {dark ? "☀ Mode clair" : "☾ Mode sombre"}
          </button>
        </div>

        {/* Bascule de vue */}
        <div
          role="tablist"
          aria-label="Vues du playground"
          className="flex gap-1 mb-10 border-b border-border"
        >
          {(["décisions", "tokens", "composants"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-sm font-medium capitalize -mb-px border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-t-[var(--radius)] ${
                view === v
                  ? "border-[var(--secondary)] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {view === "décisions" && <Decisions dark={dark} />}

        {view === "tokens" && <Tokens dark={dark} />}

        {view === "composants" && (
        <>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          KPI Card — sm / md / lg
        </h2>

        {/* Grille des 3 tailles */}
        <div className="flex flex-wrap gap-6 items-start">

          {/* sm : compact, valeur + label */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              size=sm
            </span>
            <KpiCard
              size="sm"
              label="Note moyenne"
              value={4.2}
              max={5}
            />
          </div>

          {/* md : + étoiles + tendance */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              size=md
            </span>
            <KpiCard
              size="md"
              label="Note moyenne"
              value={4.2}
              max={5}
              trend={12}
            />
          </div>

          {/* lg : + sparkline recharts */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              size=lg
            </span>
            <KpiCard
              size="lg"
              label="Note moyenne"
              value={4.2}
              max={5}
              trend={12}
              sparklineData={DEMO_SPARKLINE}
            />
          </div>

        </div>

        {/* Composants extraits de KpiCard */}
        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          ScoreStars — extrait de KpiCard
        </h2>
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
          {([
            ["4,2 · demi-étoile", 4.2, "half"],
            ["4,2 · arrondi entier", 4.2, "full"],
            ["0 · plancher", 0, "half"],
            ["5 · plafond", 5, "half"],
            ["7 sur 5 · borné", 7, "half"],
          ] as const).map(([label, v, r]) => (
            <div key={label} className="flex items-center gap-4 flex-wrap">
              <span className="w-44 shrink-0 text-xs text-muted-foreground">{label}</span>
              <ScoreStars value={v} rounding={r} />
            </div>
          ))}
          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-border">
            <span className="w-44 shrink-0 text-xs text-muted-foreground">tailles sm / md / lg</span>
            <ScoreStars value={3.5} size="sm" />
            <ScoreStars value={3.5} size="md" />
            <ScoreStars value={3.5} size="lg" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          DeltaBadge — extrait de KpiCard, état neutre ajouté
        </h2>
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="flex items-center gap-3 flex-wrap">
            <DeltaBadge value={12} />
            <DeltaBadge value={-8} />
            <DeltaBadge value={0} />
            <DeltaBadge value={4.2} unit=" pts" />
            <DeltaBadge value={0.3} neutralThreshold={0.5} />
          </div>
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              ton forcé — un délai qui baisse est un progrès :
            </span>
            <DeltaBadge value={-15} unit=" min" tone="positive" />
          </div>
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">taille sm</span>
            <DeltaBadge value={12} size="sm" />
            <DeltaBadge value={-8} size="sm" />
            <DeltaBadge value={0} size="sm" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          ProgressBar — transposé du composant Figma
        </h2>
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
          {([
            ["95 / 100 · good (auto)", 95, undefined],
            ["72 / 100 · warning (auto)", 72, undefined],
            ["35 / 100 · critical (auto)", 35, undefined],
            ["0 · plancher", 0, undefined],
            ["130 / 100 · borné", 130, undefined],
          ] as const).map(([label, v]) => (
            <div key={label} className="flex items-center gap-4 flex-wrap">
              <span className="w-52 shrink-0 text-xs text-muted-foreground">{label}</span>
              <div className="w-52"><ProgressBar value={v} /></div>
            </div>
          ))}
          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-border">
            <span className="w-52 shrink-0 text-xs text-muted-foreground">
              ton forcé — un délai bas est bon
            </span>
            <div className="w-52"><ProgressBar value={25} level="good" /></div>
          </div>
          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-border">
            <span className="w-52 shrink-0 text-xs text-muted-foreground">tailles sm / md / lg</span>
            <div className="w-32"><ProgressBar value={70} size="sm" /></div>
            <div className="w-32"><ProgressBar value={70} size="md" /></div>
            <div className="w-32"><ProgressBar value={70} size="lg" /></div>
          </div>
        </div>

        {/* Carte cliquable — test hover + focus clavier */}
        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Carte cliquable (md)
        </h2>
        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              onClick · hover + Tab focus
            </span>
            <KpiCard
              size="md"
              label="Note moyenne"
              value={4.2}
              max={5}
              trend={12}
              onClick={() => alert("KpiCard cliquée — onClick OK")}
            />
          </div>
        </div>

        {/* Bandeau de statut bridge */}
        <div className="mt-12 p-4 rounded-[var(--radius)] bg-muted text-muted-foreground text-sm border border-border">
          Bridge OK · tokens Aikoz → variables shadcn → classes Tailwind · dark mode via classe <code className="font-mono bg-background px-1 rounded">.dark</code> sur &lt;html&gt;
        </div>

        {/* Button — matrice 4 variants × 3 tailles, light + dark côte à côte */}
        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Button — variants × tailles
        </h2>

        {/* Zone fond clair — `light` explicite : sans elle, la zone hérite du
            dark quand le toggle global bascule, et « Zone claire » devient faux. */}
        <div className="light rounded-[var(--radius)] border border-border overflow-hidden mb-6">
          <div className="bg-background text-foreground p-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Zone claire
            </span>
            <div className="mt-4">
              <ButtonDemoContent />
            </div>
          </div>
        </div>

        {/* Zone fond dark — .dark scopée à ce conteneur, indépendante du toggle global */}
        <div className="dark rounded-[var(--radius)] border border-border overflow-hidden mb-6">
          <div className="bg-background text-foreground p-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Zone dark
            </span>
            <div className="mt-4">
              <ButtonDemoContent />
            </div>
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
