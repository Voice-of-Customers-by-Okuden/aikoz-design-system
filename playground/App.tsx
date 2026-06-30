import { useState } from "react";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";

const DEMO_SPARKLINE = [3.6, 3.7, 3.8, 3.7, 3.9, 4.0, 3.9, 4.1, 4.0, 4.2, 4.2, 4.2];

export default function App() {
  const [dark, setDark] = useState(false);

  function toggleDark() {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-foreground">KPI Card — sm / md / lg</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Aikoz Design System · Registry PoC
            </p>
          </div>
          <button
            onClick={toggleDark}
            className="border border-border text-foreground bg-card rounded-[var(--radius)] px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {dark ? "☀ Mode clair" : "☾ Mode sombre"}
          </button>
        </div>

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

        {/* Bandeau de statut bridge */}
        <div className="mt-12 p-4 rounded-[var(--radius)] bg-muted text-muted-foreground text-sm border border-border">
          Bridge OK · tokens Aikoz → variables shadcn → classes Tailwind · dark mode via classe <code className="font-mono bg-background px-1 rounded">.dark</code> sur &lt;html&gt;
        </div>

      </div>
    </div>
  );
}
