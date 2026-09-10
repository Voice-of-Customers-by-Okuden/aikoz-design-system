import { useState } from "react";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";
import { Button } from "@registry/aikoz/button/button";
import { ScoreStars } from "@registry/aikoz/score-stars/score-stars";
import { DeltaBadge } from "@registry/aikoz/delta-badge/delta-badge";
import { ProgressBar } from "@registry/aikoz/progress-bar/progress-bar";
import { Badge } from "@registry/aikoz/badge/badge";
import { VerbatimCard } from "@registry/aikoz/verbatim-card/verbatim-card";
import { Input } from "@registry/aikoz/input/input";
import { Card } from "@registry/aikoz/card/card";
import { Avatar } from "@registry/aikoz/avatar/avatar";
import { Dialog } from "@registry/aikoz/dialog/dialog";
import { Select } from "@registry/aikoz/select/select";
import { Tooltip } from "@registry/aikoz/tooltip/tooltip";
import { SidebarNav } from "@registry/aikoz/sidebar-nav/sidebar-nav";
import { ViewTabs } from "@registry/aikoz/view-tabs/view-tabs";
import { DateRangePicker } from "@registry/aikoz/date-range-picker/date-range-picker";
import { Table, type TableSort } from "@registry/aikoz/table/table";
import { Skeleton, SkeletonText } from "@registry/aikoz/skeleton/skeleton";
import { EmptyState } from "@registry/aikoz/empty-state/empty-state";
import { Breadcrumb } from "@registry/aikoz/breadcrumb/breadcrumb";
import { Accordion } from "@registry/aikoz/accordion/accordion";
import { Stepper } from "@registry/aikoz/stepper/stepper";
import { ChoiceGroup } from "@registry/aikoz/choice-group/choice-group";
import { BrandLogo } from "@registry/aikoz/brand-logo/brand-logo";
import { BRANDS } from "@registry/aikoz/brand-logo/brands";
import { Leaderboard } from "@registry/aikoz/leaderboard/leaderboard";
import { LogoMarquee } from "@registry/aikoz/logo-marquee/logo-marquee";
import { SiteNav } from "@registry/aikoz/site-nav/site-nav";
import { SiteFooter } from "@registry/aikoz/site-footer/site-footer";
import { FeaturePanel } from "@registry/aikoz/feature-panel/feature-panel";
import { BookingFlow, type BookingStatus } from "@registry/aikoz/booking-flow/booking-flow";
import { SlotPicker } from "@registry/aikoz/slot-picker/slot-picker";
import { LineChart } from "@registry/aikoz/line-chart/line-chart";
import { BarChart } from "@registry/aikoz/bar-chart/bar-chart";
import { DonutChart } from "@registry/aikoz/donut-chart/donut-chart";
import Tokens from "./Tokens";
import Decisions from "./Decisions";
import { auditerToutesCombinaisons, type EchecContraste } from "./audit";

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

const JOURS = [
  {
    label: "Mardi 14 avril",
    slots: [
      { value: "2026-04-14T09:00", time: "09:00" },
      { value: "2026-04-14T09:30", time: "09:30", full: true },
      { value: "2026-04-14T10:00", time: "10:00" },
      { value: "2026-04-14T11:00", time: "11:00", full: true },
      { value: "2026-04-14T14:00", time: "14:00" },
    ],
  },
  {
    label: "Mercredi 15 avril",
    slots: [
      { value: "2026-04-15T09:00", time: "09:00" },
      { value: "2026-04-15T10:30", time: "10:30" },
      { value: "2026-04-15T16:00", time: "16:00" },
    ],
  },
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>("décisions");
  const [register, setRegister] = useState<"produit" | "marketing">("produit");
  const [tri, setTri] = useState<TableSort>({ key: "taux", direction: "desc" });
  const [rdv, setRdv] = useState<BookingStatus>("form");
  const [creneau, setCreneau] = useState("");
  const [audit, setAudit] = useState<Record<string, EchecContraste[]> | null>(null);

  // Le registre marketing s'applique par attribut, comme data-brand : additif,
  // il n'écrase ni light ni dark et s'imbrique dans une page produit.
  function toggleRegister() {
    const next = register === "produit" ? "marketing" : "produit";
    if (next === "marketing") document.documentElement.setAttribute("data-register", "marketing");
    else document.documentElement.removeAttribute("data-register");
    setRegister(next);
  }

  function toggleDark() {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        {/* Bascules registre × thème — FIXES.
            Elles pilotent les deux axes du design system, et on veut pouvoir
            les actionner devant n'importe quel composant, pas seulement en
            haut de page : c'est en basculant sous les yeux d'un composant
            qu'on voit ce qui bouge. Placées en tête du DOM, elles sont aussi
            le premier arrêt de tabulation — ce qui convient à un réglage
            global. `--border-strong` comme pour les surfaces flottantes :
            la barre passe au-dessus du contenu, son trait doit la délimiter
            (1,32:1 avec `--border`, 4,07:1 ici).
            En bas à droite plutôt qu'en haut : jamais de collision avec le
            titre en écran étroit, et à portée de pouce sur mobile. */}
        <div
          role="group"
          aria-label="Registre et thème"
          className="fixed bottom-4 right-4 z-50 flex gap-2 flex-wrap justify-end max-w-[calc(100vw-2rem)] rounded-full border border-[var(--border-strong)] bg-[var(--card)] p-1.5 shadow-lg"
        >
          <button
            onClick={toggleRegister}
            className={`border rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
              register === "marketing"
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border-border bg-card text-foreground hover:bg-[var(--surface-hover)]"
            }`}
            aria-pressed={register === "marketing"}
          >
            {register === "marketing" ? "◐ Registre marketing" : "◑ Registre produit"}
          </button>
          <button
            onClick={toggleDark}
            className="border border-border text-foreground bg-card rounded-full px-4 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
            aria-pressed={dark}
          >
            {dark ? "☀ Mode clair" : "☾ Mode sombre"}
          </button>
        </div>

      <div className="max-w-4xl mx-auto p-8 pb-28">

        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aikoz Design System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Playground · état d'avancement en temps réel
            </p>
          </div>
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

        {view === "tokens" && <Tokens dark={dark} register={register} />}

        {view === "composants" && (
        <>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          KpiCard — variant × density, deux axes indépendants
        </h2>

        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          L'axe <code className="font-mono text-xs">variant</code> dit ce que la donnée est,
          l'axe <code className="font-mono text-xs">density</code> la place qu'on lui accorde.
          Les deux se combinent librement — l'ancienne API imposait la sparkline dès qu'on
          voulait une grande carte.
        </p>

        <div className="flex flex-wrap gap-6 items-start mb-10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              variant=rating
            </span>
            <KpiCard variant="rating" label="Note moyenne" value={4.2} trend={0.1} trendUnit="" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              variant=target
            </span>
            <KpiCard
              variant="target"
              label="Taux de réponse"
              value={87}
              unit=" %"
              target={90}
              trend={4.2}
              trendUnit=" pts"
              caption="Objectif · 90 %"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              variant=trend
            </span>
            <KpiCard
              variant="trend"
              label="Avis traités"
              value={312}
              data={DEMO_SPARKLINE}
              trend={18}
              trendUnit=""
              caption="30 derniers jours"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              variant=raw
            </span>
            <KpiCard variant="raw" label="Délai de réponse" value={6} unit=" h" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-3">
          Les deux axes se croisent — rating en trois densités
        </h3>
        <div className="flex flex-wrap gap-6 items-start mb-10">
          {(["compact", "default", "large"] as const).map((d) => (
            <div key={d} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                density={d}
              </span>
              <KpiCard variant="rating" density={d} label="Note moyenne" value={4.2} trend={0.1} trendUnit="" />
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-3">
          Ton forcé — un délai qui baisse est un progrès
        </h3>
        <div className="flex flex-wrap gap-6 items-start mb-10">
          <KpiCard
            variant="target"
            label="Délai de réponse"
            value={6}
            max={24}
            unit=" h"
            level="good"
            trend={-1}
            trendUnit=" h"
            trendTone="positive"
            caption="Objectif · 8 h — moins est mieux"
          />
          <KpiCard
            variant="rating"
            label="Note moyenne"
            value={4.2}
            onClick={() => alert("KpiCard cliquée — onClick OK")}
            trend={0.1}
            trendUnit=""
            caption="cliquable · hover + Tab"
          />
        </div>

        {/* Le registre marketing, avec de VRAIS composants — la preuve que le
            même code se réhabille sans être réécrit. */}
        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Registre marketing — mêmes composants, autre habillage
        </h2>
        <div
          data-register="marketing"
          className="rounded-[var(--radius)] border border-border overflow-hidden mb-6"
        >
          <div className="bg-background text-foreground p-6 flex flex-col gap-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              data-register="marketing" · suit le thème de la page
            </span>
            <div className="flex flex-wrap gap-4 items-start">
              <KpiCard variant="rating" label="Note moyenne" value={4.2} trend={0.1} trendUnit="" />
              <div className="flex flex-col gap-3 justify-center">
                <ScoreStars value={4.2} size="lg" />
                <div className="flex gap-2 flex-wrap">
                  <DeltaBadge value={12} />
                  <DeltaBadge value={-8} />
                  <DeltaBadge value={0} />
                </div>
                <div className="w-52"><ProgressBar value={87} /></div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <Button>Demander une démo</Button>
              <Button variant="secondary">Notre solution</Button>
              <Button variant="outline">FAQ</Button>
              <Button variant="ghost">Contact</Button>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Le texte discret est <strong>bleuté</strong> et non gris : c'est la différence de
              registre la plus visible. L'aquamarine ne peint qu'une chose — le bouton d'action.
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Badge — 5 tons, transposé du Figma
        </h2>
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="flex gap-3 flex-wrap items-center">
            <Badge tone="success" icon="✓">Actif</Badge>
            <Badge tone="warning" icon="!">À surveiller</Badge>
            <Badge tone="error" icon="✕">Critique</Badge>
            <Badge tone="info" icon="i">Info</Badge>
            <Badge tone="neutral">Neutre</Badge>
          </div>
          <div className="flex gap-3 flex-wrap items-center pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">taille sm</span>
            <Badge tone="success" size="sm" icon="✓">Répondu</Badge>
            <Badge tone="error" size="sm" icon="✕">Sans réponse</Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl pt-2 border-t border-border">
            Le contour porte le contraste, le fond à 8 % est décoratif — sans lui la pastille
            flotterait sur la carte à 1,05:1. Écart assumé au Figma, qui les dessine sans contour.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          VerbatimCard — « Vos 3 derniers avis Google » du tunnel
        </h2>
        <div className="flex flex-col gap-3 max-w-xl">
          <VerbatimCard
            rating={5}
            status="replied"
            source="Google"
            author="Allianz Lyon Centre"
            date="12 août 2026"
            text="Accueil chaleureux et conseillère vraiment à l'écoute, dossier traité en quelques jours. Je recommande sans réserve."
            tags={["Réactivité", "Accueil"]}
          />
          <VerbatimCard
            rating={2}
            status="unanswered"
            source="Google"
            date="9 août 2026"
            text="Délais de traitement beaucoup trop longs, plusieurs relances restées sans retour. J'ai fini par passer par le siège pour obtenir une réponse, ce qui n'aurait pas dû être nécessaire."
            lines={2}
          />
          <VerbatimCard
            density="compact"
            rating={4}
            status="replied"
            source="Trustpilot"
            date="4 août 2026"
            text="Bon accompagnement sur mon contrat habitation."
            onClick={() => alert("VerbatimCard cliquée")}
          />
        </div>
        <p className="text-xs text-muted-foreground max-w-xl mt-3 mb-10">
          La deuxième est tronquée à 2 lignes — en CSS, le texte complet reste dans le DOM.
          La troisième est cliquable : elle porte alors l'énoncé complet et ses briques se taisent.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Registre × thème — quatre combinaisons, deux axes indépendants
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Le registre dit <em>quel public</em>, le thème dit <em>clair ou sombre</em>. Les deux se
          croisent : un site marketing peut être clair, un dashboard peut être sombre. La première
          version confondait « marketing » et « sombre ».
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {([
            ["Produit clair", "light", false],
            ["Produit sombre", "dark", false],
            ["Marketing clair", "light", true],
            ["Marketing sombre", "dark", true],
          ] as const).map(([titre, theme, mk]) => (
            <div key={titre} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {titre}
              </span>
              <div
                className={`${theme} rounded-[var(--radius)] border border-border overflow-hidden`}
                {...(mk ? { "data-register": "marketing" } : {})}
              >
                <div className="bg-background text-foreground p-4 flex flex-col gap-3">
                  <KpiCard
                    density="compact"
                    variant="rating"
                    label="Note moyenne"
                    value={4.2}
                    trend={0.1}
                    trendUnit=""
                  />
                  <div className="flex gap-2 flex-wrap items-center">
                    <Button size="sm">Action</Button>
                    <Badge tone="success" size="sm" icon="✓">Répondu</Badge>
                  </div>
                  <div className="w-full"><ProgressBar value={87} max={100} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Input — 4 états du Figma
        </h2>
        <div className="flex flex-col gap-5 rounded-[var(--radius)] border border-border bg-card p-5 max-w-md">
          <Input
            label="Le nom de votre agence"
            description="Tel qu'il apparaît sur votre fiche Google."
            placeholder="Allianz Lyon Centre"
            autoComplete="organization"
            required
          />
          <Input
            label="Rechercher"
            labelHidden
            type="search"
            placeholder="Rechercher une agence, une marque…"
            autoComplete="off"
            leadingIcon={<span aria-hidden="true">⌕</span>}
          />
          <Input
            label="Adresse e-mail"
            type="email"
            autoComplete="email"
            defaultValue="camille.brun@"
            error="L'adresse doit contenir un domaine, par exemple camille.brun@neoassur.fr"
            required
          />
          <Input
            label="Marque rattachée"
            defaultValue="Allianz"
            readOnly
            description="Déterminée par votre fiche — readOnly, donc focusable et soumise."
          />
          <Input label="Champ désactivé" defaultValue="Indisponible" disabled />
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Card · Avatar · Dialog
        </h2>
        <div className="flex flex-wrap gap-4 items-start mb-4">
          {(["raised", "flat", "bare"] as const).map((s) => (
            <Card key={s} surface={s} className="w-52">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                surface={s}
              </span>
              <p className="text-sm text-foreground m-0">
                Le niveau de titre n'est pas figé par la carte.
              </p>
            </Card>
          ))}
        </div>

        <Card as="article" surface="flat" className="mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <Avatar key={s} size={s} name="Allianz Lyon Centre" />
            ))}
            <Avatar name="AXA Part-Dieu" />
            <Avatar name="Banque de France" />
            <Avatar name="Generali" />
            <span className="text-xs text-muted-foreground">
              initiales calculées, particules ignorées — « Banque de France » → BF
            </span>
          </div>
        </Card>

        <div className="flex gap-3 flex-wrap mb-10">
          {(["center", "right", "bottom"] as const).map((p) => (
            <Dialog
              key={p}
              placement={p}
              trigger={<Button variant="outline">Modale {p}</Button>}
              title="Demandez votre démo"
              description="30 minutes, en visio, avec un de nos consultants."
              footer={
                <>
                  <Button variant="ghost">Annuler</Button>
                  <Button>Confirmer</Button>
                </>
              }
            >
              <Input label="Adresse e-mail" type="email" autoComplete="email" required />
            </Dialog>
          ))}
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

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Select — filtres de tableau de bord
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 rounded-[var(--radius)] border border-border bg-card p-5">
          <Select
            label="Période"
            defaultValue="30j"
            options={[
              { value: "7j", label: "7 derniers jours" },
              { value: "30j", label: "30 derniers jours" },
              { value: "90j", label: "90 derniers jours" },
              { value: "12m", label: "12 derniers mois" },
            ]}
          />
          <Select
            label="Source"
            description="Plateforme d'origine des avis"
            placeholder="Toutes les sources"
            options={[
              { value: "google", label: "Google", group: "Généralistes" },
              { value: "trustpilot", label: "Trustpilot", group: "Généralistes" },
              { value: "avis-verifies", label: "Avis Vérifiés", group: "Certifiés" },
              { value: "opinion", label: "Opinion System", group: "Certifiés", disabled: true },
            ]}
          />
          <Select
            label="Agence"
            required
            error="Sélectionnez une agence pour filtrer le classement."
            options={[
              { value: "lyon", label: "Lyon Part-Dieu" },
              { value: "paris", label: "Paris Opéra" },
            ]}
          />
          <Select
            label="Vue"
            labelHidden
            size="sm"
            defaultValue="synthese"
            options={[
              { value: "synthese", label: "Synthèse" },
              { value: "detail", label: "Détail" },
            ]}
          />
          <Select
            label="Désactivé"
            disabled
            defaultValue="x"
            options={[{ value: "x", label: "Indisponible" }]}
          />
          <Select
            label="Taille lg"
            size="lg"
            defaultValue="a"
            options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]}
          />
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Tooltip — confort, jamais nécessité
        </h2>
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="flex items-center gap-3 flex-wrap">
            <Tooltip content="Nombre d'avis reçus sur la période, toutes sources confondues.">
              <Button variant="outline" size="sm">Avis traités</Button>
            </Tooltip>
            <Tooltip side="right" content="12 mars 2026 à 14:07">
              <Button variant="ghost" size="sm">il y a 3 j</Button>
            </Tooltip>
            <Tooltip side="bottom" content="Le libellé complet de la colonne, abrégé faute de place dans l'en-tête du tableau.">
              <Button variant="ghost" size="sm">Tx. rép.</Button>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground m-0 pt-2 border-t border-border">
            Le déclencheur garde son propre nom accessible : Radix relie l'infobulle par
            <code className="font-mono px-1">aria-describedby</code>, pas par
            <code className="font-mono px-1">aria-label</code>. Un bouton en icône seule aurait
            besoin des deux.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          SidebarNav — navigue entre sections, change la route
        </h2>
        <div className="rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="flex gap-0 rounded-[var(--radius)] overflow-hidden border border-border">
            <SidebarNav
              label="Navigation principale"
              current="marche"
              groups={[
                {
                  label: "Pilotage",
                  entries: [
                    { id: "marche", label: "Marché", href: "#marche" },
                    { id: "campagnes", label: "Campagnes", href: "#campagnes", count: 3 },
                    { id: "hall", label: "Hall of Fames", href: "#hall" },
                  ],
                },
                {
                  label: "Configuration",
                  entries: [{ id: "params", label: "Paramètres", href: "#params" }],
                },
              ]}
            />
            <div className="flex-1 p-5 bg-background text-sm text-muted-foreground">
              Zone de contenu. La limite de la barre est portée par
              <code className="font-mono px-1">--border-strong</code> : sa surface ne se
              détache de la page que de 1,09:1.
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 mb-0">
            L'entrée courante se signale par trois canaux :
            <code className="font-mono px-1">aria-current="page"</code>, le trait vertical
            et la graisse. Le voile de fond ne compte pas — 1,19:1 en clair.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          ViewTabs — échange un panneau, même route
        </h2>
        <div className="flex flex-col gap-6 rounded-[var(--radius)] border border-border bg-card p-5">
          <ViewTabs
            label="Vues du classement"
            tabs={[
              { value: "synthese", label: "Synthèse", content: <p className="text-sm text-muted-foreground m-0">Panneau « Synthèse ». Flèches ← → pour changer de vue : le focus et la sélection avancent ensemble.</p> },
              { value: "detail", label: "Détail", content: <p className="text-sm text-muted-foreground m-0">Panneau « Détail ».</p> },
              { value: "export", label: "Export", content: <p className="text-sm text-muted-foreground m-0">Panneau « Export ».</p> },
              { value: "archive", label: "Archive", disabled: true, content: <p className="text-sm text-muted-foreground m-0">Inatteignable.</p> },
            ]}
          />
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mt-0 mb-3">
              Activation <strong>manuelle</strong> — la flèche déplace le focus, Entrée valide.
              À réserver aux panneaux qui déclenchent un chargement.
            </p>
            <ViewTabs
              label="Vues à chargement différé"
              activation="manual"
              tabs={[
                { value: "a", label: "Requête A", content: <p className="text-sm text-muted-foreground m-0">Chargé seulement après validation.</p> },
                { value: "b", label: "Requête B", content: <p className="text-sm text-muted-foreground m-0">Panneau B.</p> },
                { value: "c", label: "Requête C", content: <p className="text-sm text-muted-foreground m-0">Panneau C.</p> },
              ]}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          DateRangePicker — préréglages en radio, saisie libre en natif
        </h2>
        <div className="flex flex-wrap items-start gap-6 rounded-[var(--radius)] border border-border bg-card p-5">
          <DateRangePicker label="Période d'analyse" defaultValue={{ preset: "30j" }} />
          <DateRangePicker
            label="Période de comparaison"
            defaultValue={{ preset: "custom", from: "2026-01-01", to: "2026-03-31" }}
          />
          <DateRangePicker label="Filtre masqué" labelHidden defaultValue={{ preset: "7j" }} />
          <DateRangePicker label="Désactivé" disabled defaultValue={{ preset: "12m" }} />
          <p className="basis-full text-xs text-muted-foreground m-0 pt-2 border-t border-border">
            Pas de calendrier en grille : le cas fréquent est le préréglage, et les deux champs
            de saisie sont natifs — sélecteur du système sur mobile, format local connu,
            clavier acquis. La borne « Au » ne peut pas précéder la borne « Du ».
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Table — un vrai &lt;table&gt;, pas une grille de div
        </h2>
        <div className="flex flex-col gap-6">
          <Table
            caption="Taux de réponse par agence, 30 derniers jours"
            rowHeaderKey="agence"
            sort={tri}
            onSortChange={setTri}
            getRowKey={(r) => r.agence}
            columns={[
              { key: "agence", header: "Agence", sortable: true },
              { key: "avis", header: "Avis", numeric: true, sortable: true },
              { key: "taux", header: "Taux de réponse", numeric: true, sortable: true },
              { key: "note", header: "Note", numeric: true },
            ]}
            rows={[...[
              { agence: "Lyon Part-Dieu", avis: 312, taux: "94 %", note: "4,6" },
              { agence: "Paris Opéra", avis: 287, taux: "88 %", note: "4,2" },
              { agence: "Marseille Prado", avis: 154, taux: "71 %", note: "3,9" },
              { agence: "Lille Grand Place", avis: 98, taux: "62 %", note: "4,1" },
            ]].sort((a, b) => {
              const k = tri.key as keyof typeof a;
              const cmp = String(a[k]).localeCompare(String(b[k]), "fr", { numeric: true });
              return tri.direction === "asc" ? cmp : -cmp;
            })}
          />

          <Table
            caption="Chargement en cours"
            captionHidden
            loading
            loadingRows={3}
            getRowKey={(_, i) => String(i)}
            columns={[
              { key: "agence", header: "Agence" },
              { key: "avis", header: "Avis", numeric: true },
              { key: "taux", header: "Taux de réponse", numeric: true },
            ]}
            rows={[]}
          />

          <Table
            caption="Aucun résultat"
            captionHidden
            getRowKey={(_, i) => String(i)}
            columns={[
              { key: "agence", header: "Agence" },
              { key: "avis", header: "Avis", numeric: true },
            ]}
            rows={[]}
            empty={
              <EmptyState
                title="Aucun avis sur cette période"
                description="Élargissez la période d'analyse ou retirez le filtre par source."
                action={<Button size="sm" variant="outline">Élargir à 90 jours</Button>}
              />
            }
          />
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          EmptyState — il nomme ce qui manque, et indique la sortie
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <EmptyState
            title="Aucune campagne active"
            description="Lancez une campagne de sollicitation pour commencer à collecter des avis."
            action={<Button size="sm">Créer une campagne</Button>}
          />
          <EmptyState
            tone="error"
            title="Le chargement a échoué"
            description="La source Google n'a pas répondu. Réessayez dans un instant."
            action={<Button size="sm" variant="outline">Réessayer</Button>}
          />
          <EmptyState density="compact" title="Aucun thème détecté" description="Il faut au moins 20 avis pour dégager des thèmes." />
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Skeleton — muet pour les lecteurs d'écran, par choix
        </h2>
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Skeleton shape="circle" className="size-10" />
            <div className="flex-1"><SkeletonText lines={2} /></div>
          </div>
          <Skeleton className="h-24 w-full" />
          <p className="text-xs text-muted-foreground m-0 pt-2 border-t border-border">
            Aucun de ces blocs n'est annoncé. C'est au conteneur de porter
            <code className="font-mono px-1">aria-busy</code> une fois — comme le fait le
            tableau en chargement ci-dessus.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Breadcrumb, Accordion, Stepper
        </h2>
        <div className="flex flex-col gap-6">
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <Breadcrumb
              items={[
                { label: "Tableau de bord", href: "#tb" },
                { label: "Hall of Fames", href: "#hof" },
                { label: "Lyon Part-Dieu" },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              Le dernier élément n'est pas un lien — il porte
              <code className="font-mono px-1">aria-current="page"</code>. Les liens sont
              soulignés au repos : dans un fil d'Ariane, rien d'autre ne les distingue.
            </p>
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <Stepper
              current={2}
              steps={[
                { label: "Établissement", href: "#s1" },
                { label: "Sources", href: "#s2" },
                { label: "Périmètre" },
                { label: "Coordonnées" },
                { label: "Confirmation" },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              Le nav s'annonce « Progression — étape 3 sur 5 ». Les deux étapes faites sont
              cliquables, les deux à venir ne le sont pas : un tunnel se remonte, il ne se
              saute pas.
            </p>
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <Accordion
              defaultValue={["q1"]}
              items={[
                { value: "q1", title: "Combien d'avis faut-il pour un premier rapport ?", content: "Vingt avis suffisent à dégager des thèmes stables. En dessous, une seule expérience atypique déplace la moyenne." },
                { value: "q2", title: "Les avis sans texte comptent-ils ?", content: "Ils comptent dans la note, pas dans l'analyse sémantique." },
                { value: "q3", title: "À quelle fréquence les sources sont-elles interrogées ?", content: "Toutes les six heures, avec un rattrapage complet chaque nuit." },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              Une seule ouverte à la fois. Le panneau fermé porte
              <code className="font-mono px-1">hidden</code> : il sort de la tabulation, pas
              seulement de la vue.
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          ChoiceGroup — un composant à la place de BrandPicker + SourceToggle
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <ChoiceGroup
              legend="Sélectionnez votre marque"
              description="Une seule marque à la fois — le périmètre d'analyse en dépend."
              layout="grid"
              columns={3}
              defaultValue={["axa"]}
              options={[
                { value: "axa", label: "AXA" },
                { value: "generali", label: "Generali" },
                { value: "europ", label: "Europ Assistance" },
                { value: "renault", label: "Renault" },
                { value: "vw", label: "Volkswagen" },
                { value: "cma", label: "CMA CGM" },
              ]}
              escape={
                <Button variant="ghost" size="sm">Je ne trouve pas ma marque</Button>
              }
            />
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <ChoiceGroup
              legend="Sources à analyser"
              description="Plusieurs sources possibles. Au moins une est requise."
              selection="multiple"
              layout="list"
              defaultValue={["google", "trustpilot"]}
              options={[
                { value: "google", label: "Google", description: "Fiches d'établissement", meta: <Badge tone="neutral" size="sm">1 240</Badge> },
                { value: "trustpilot", label: "Trustpilot", description: "Avis vérifiés", meta: <Badge tone="neutral" size="sm">318</Badge> },
                { value: "pj", label: "Pages Jaunes", description: "Annuaire local", meta: <Badge tone="neutral" size="sm">96</Badge> },
                { value: "tripadvisor", label: "TripAdvisor", description: "Hors périmètre assurance", disabled: true },
              ]}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          BrandLogo — 19 assureurs du marché
        </h2>
        <div className="flex flex-col gap-5 rounded-[var(--radius)] border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground m-0">
            shape=circle — initiales
          </p>
          <div className="flex flex-wrap gap-3">
            {BRANDS.map((b) => (
              <BrandLogo key={b.id} brand={b.id} size="lg" />
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground m-0 pt-3 border-t border-border">
            shape=plate — le logo, monochrome ou en couleur selon le fichier
          </p>
          <div className="flex flex-wrap gap-3">
            {BRANDS.map((b) => (
              <BrandLogo key={b.id} brand={b.id} shape="plate" size="lg" />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <BrandLogo key={s} brand="generali" size={s} />
            ))}
            <span className="text-xs text-muted-foreground">tailles sm → xl</span>
          </div>
          <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
            <BrandLogo brand="axa" showName />
            <BrandLogo brand="mma" showName />
            <BrandLogo brand="swisslife" showName />
            <BrandLogo brand="inconnue" showName />
          </div>
          <p className="text-xs text-muted-foreground m-0 pt-3 border-t border-border">
            Les 19 marques ont un logo — plus aucune initiale. Une seule surface pour
            toutes les plaques : 12 logos monochromes <strong>encrés</strong> à la teinte de
            marque, 7 en couleur d'origine parce qu'un logo bâti sur une forme pleine
            n'existe que par ses couleurs internes. L'encre retombe sur du sombre quand la
            teinte ne tient pas 3:1 sur la plaque — le jaune d'Abeille y donne 1,42.
            Tout est <strong>mesuré</strong>, jamais choisi marque par marque.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          Leaderboard — bâti sur Table, podium doublé par le chiffre
        </h2>
        <Leaderboard
          caption="Taux de réponse aux avis, 30 derniers jours"
          valueLabel="Taux de réponse"
          entries={[
            { id: "1", rank: 1, name: "Lyon Part-Dieu", code: "LYO-PDX", organization: "Réseau Sud-Est", brand: "axa", value: "94 %", delta: 2 },
            { id: "2", rank: 2, name: "Paris Opéra", code: "PAR-OPE", organization: "Réseau Île-de-France", brand: "generali", value: "91 %", delta: 5 },
            { id: "3", rank: 3, name: "Bordeaux Chartrons", code: "BDX-CHA", organization: "Réseau Sud-Ouest", brand: "maif", value: "88 %", delta: -1 },
            { id: "4", rank: 4, name: "Marseille Prado", code: "MRS-PRA", organization: "Réseau Sud-Est", brand: "macif", value: "84 %", delta: 0, highlighted: true },
            { id: "5", rank: 5, name: "Lille Grand Place", code: "LIL-GPL", organization: "Réseau Nord", brand: "matmut", value: "79 %", delta: -3 },
          ]}
        />

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          LogoMarquee — il ne défile pas, et c'est une décision
        </h2>
        <div className="rounded-[var(--radius)] border border-border bg-card p-5">
          <LogoMarquee
            label="Assureurs analysés par Aikoz"
            showLabel
            brands={BRANDS.map((b) => b.id)}
          />
          <p className="text-xs text-muted-foreground mt-4 mb-0">
            WCAG 2.2.2 impose un moyen de pause pour tout mouvement de plus de 5 secondes —
            donc un bouton, un état, un arrêt de tabulation de plus, pour une décoration. La
            preuve, ce sont les marques, pas leur déplacement.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          SiteNav, FeaturePanel, SiteFooter — la coque du site
        </h2>
        <div className="flex flex-col gap-8">
          <div className="rounded-[var(--radius)] border border-border overflow-hidden">
            <SiteNav
              links={[
                { label: "Notre solution", href: "#solution", current: true },
                { label: "Secteurs", href: "#secteurs" },
                { label: "Ressources", href: "#ressources" },
              ]}
              actions={<Button size="sm">Demander une démo</Button>}
              skipTo="#demo-contenu"
            />
            <div id="demo-contenu" className="p-4 text-xs text-muted-foreground bg-background">
              Le lien d'évitement est le premier élément focusable de l'en-tête : tabule
              depuis le haut de la page pour le voir apparaître. Sous 768 px, la navigation
              se replie en menu.
            </div>
          </div>

          <FeaturePanel
            title="Quatre leviers"
            intro="Ce que le pilotage des avis change vraiment, une fois branché sur vos données."
            features={[
              { metric: "×3", title: "Taux de réponse", description: "Les agences pilotées répondent trois fois plus vite qu'avant la mise en place." },
              { metric: "48 h", title: "Détection des signaux", description: "Un décrochage local est remonté avant qu'il ne devienne une tendance." },
              { metric: "12", title: "Sources unifiées", description: "Google, Trustpilot, annuaires : une seule note, un seul verbatim de référence." },
              { metric: "0", title: "Ressaisie", description: "Les tableaux de bord se branchent sur l'existant, sans double saisie." },
            ]}
          />

          <div className="rounded-[var(--radius)] border border-border overflow-hidden">
            <SiteFooter
              tagline="Le pilotage des avis clients pour les réseaux d'assurance, d'assistance et de mobilité."
              groups={[
                { label: "Solution", links: [{ label: "Tableau de bord", href: "#tb" }, { label: "Hall of Fames", href: "#hof" }, { label: "Alertes", href: "#al" }] },
                { label: "Secteurs", links: [{ label: "Assurance", href: "#as" }, { label: "Mobilité", href: "#mo" }, { label: "Santé", href: "#sa" }] },
                { label: "Ressources", links: [{ label: "Études", href: "#et" }, { label: "Documentation", href: "#doc", external: true }] },
              ]}
              legal={[{ label: "Mentions légales", href: "#ml" }, { label: "Confidentialité", href: "#cf" }, { label: "Cookies", href: "#ck" }]}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          SlotPicker et BookingFlow
        </h2>
        <div className="flex flex-col gap-6">
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <SlotPicker
              legend="Choisissez un créneau"
              value={creneau}
              onValueChange={setCreneau}
              days={JOURS}
            />
            <p className="text-xs text-muted-foreground mt-4 mb-0">
              Un seul <code className="font-mono px-1">fieldset</code> pour les deux jours :
              les flèches traversent toute la grille. Les créneaux complets restent annoncés
              — « 11:00, complet » — au lieu d'être retirés.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-5">
            <BookingFlow
              days={JOURS}
              status={rdv}
              onSubmit={() => setRdv("confirmed")}
              trigger={<Button>Réserver une démonstration</Button>}
              onOpenChange={(o) => { if (!o) setRdv("form"); }}
            />
            <span className="text-xs text-muted-foreground">état&nbsp;:</span>
            {(["form", "confirmed", "failed"] as const).map((e) => (
              <Button key={e} size="sm" variant={rdv === e ? "secondary" : "outline"} onClick={() => setRdv(e)}>
                {e}
              </Button>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          LineChart — premier chart, à valider avant les cinq autres
        </h2>
        <div className="rounded-[var(--radius)] border border-border bg-card p-5">
          <LineChart
            caption="Taux de réponse aux avis, par réseau"
            xKey="mois"
            xLabel="Mois"
            formatValue={(v) => `${v} %`}
            series={[
              { key: "sudest", label: "Sud-Est" },
              { key: "idf", label: "Île-de-France" },
              { key: "nord", label: "Nord" },
              { key: "ouest", label: "Ouest" },
            ]}
            data={[
              { mois: "Janv.", sudest: 71, idf: 64, nord: 58, ouest: 66 },
              { mois: "Févr.", sudest: 74, idf: 66, nord: 57, ouest: 68 },
              { mois: "Mars", sudest: 79, idf: 71, nord: 61, ouest: 70 },
              { mois: "Avr.", sudest: 83, idf: 74, nord: 66, ouest: 69 },
              { mois: "Mai", sudest: 88, idf: 78, nord: 70, ouest: 73 },
              { mois: "Juin", sudest: 91, idf: 83, nord: 72, ouest: 77 },
            ]}
          />
          <div className="pt-6 mt-6 border-t border-border">
            <LineChart
              caption="Taux de réponse Sud-Est, comparé à l'année précédente"
              xKey="mois"
              formatValue={(v) => `${v} %`}
              series={[{ key: "sudest", label: "2026" }]}
              reference={{ key: "n1", label: "2025" }}
              data={[
                { mois: "Janv.", sudest: 71, n1: 63 },
                { mois: "Févr.", sudest: 74, n1: 65 },
                { mois: "Mars", sudest: 79, n1: 69 },
                { mois: "Avr.", sudest: 83, n1: 74 },
                { mois: "Mai", sudest: 88, n1: 76 },
                { mois: "Juin", sudest: 91, n1: 80 },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              Pas de <code className="font-mono px-1">ComparisonLineChart</code> : une série de
              référence en retrait, et l'écart <strong>calculé et énoncé</strong> dans le résumé —
              sinon la comparaison n'existe que pour qui voit les deux courbes.
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4 mb-0">
            La couleur ne distingue pas les séries : mesuré, la meilleure séparation
            atteignable entre six séries de cette palette est de <strong>1,17:1</strong> — elles
            se confondent en niveaux de gris. Ce sont le <strong>pointillé</strong> et la
            <strong> forme du marqueur</strong> qui portent la distinction. Et pour qui ne voit
            rien de tout ça, le graphique est masqué et c'est le <strong>tableau</strong> qui est
            le contenu.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-12 mb-4">
          BarChart et DonutChart
        </h2>
        <div className="flex flex-col gap-8">
          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <BarChart
              caption="Avis reçus par source et par trimestre"
              xKey="trim"
              xLabel="Trimestre"
              series={[
                { key: "google", label: "Google" },
                { key: "trustpilot", label: "Trustpilot" },
                { key: "pj", label: "Pages Jaunes" },
              ]}
              data={[
                { trim: "T1", google: 820, trustpilot: 210, pj: 64 },
                { trim: "T2", google: 940, trustpilot: 268, pj: 71 },
                { trim: "T3", google: 1120, trustpilot: 302, pj: 58 },
                { trim: "T4", google: 1240, trustpilot: 318, pj: 96 },
              ]}
            />
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-card p-5">
            <BarChart
              caption="Classement des agences par taux de réponse"
              xKey="agence"
              xLabel="Agence"
              orientation="horizontal"
              layout="grouped"
              formatValue={(v) => `${v} %`}
              series={[{ key: "taux", label: "Taux de réponse" }]}
              data={[
                { agence: "Lyon Part-Dieu", taux: 94 },
                { agence: "Paris Opéra", taux: 91 },
                { agence: "Bordeaux Chartrons", taux: 88 },
                { agence: "Marseille Prado", taux: 84 },
                { agence: "Lille Grand Place", taux: 79 },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              Pas de <code className="font-mono px-1">RankedBarChart</code> : c'est
              <code className="font-mono px-1">BarChart</code> horizontal, trié, à une série.
              Deux props, pas un composant de plus.
            </p>
          </div>

          <div className="rounded-[var(--radius)] border border-border bg-card p-5 max-w-md">
            <DonutChart
              caption="Répartition des avis par source"
              centerValue="1 654"
              centerLabel="avis"
              parts={[
                { key: "google", label: "Google", value: 1240 },
                { key: "trustpilot", label: "Trustpilot", value: 318 },
                { key: "pj", label: "Pages Jaunes", value: 96 },
              ]}
            />
            <p className="text-xs text-muted-foreground mt-3 mb-0">
              Chaque part porte <strong>son pourcentage écrit</strong> dans la légende : au-delà
              de quatre parts, ou dès que deux sont proches, l'œil ne compare pas des angles.
            </p>
          </div>
        </div>

        {/* Audit de contraste sur le rendu */}
        <div className="mt-12 rounded-[var(--radius)] border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mt-0 mb-2">
            Audit de contraste — sur le rendu, pas sur les tokens
          </h2>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
            Parcourt chaque texte visible de cette page dans les quatre combinaisons, et le
            compare à son fond <strong>composé</strong> — voiles de badge inclus. C'est ce
            composite qu'un audit token-à-token ne voit pas.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAudit(auditerToutesCombinaisons())}
          >
            Lancer l'audit
          </Button>
          {audit && (
            <div className="mt-4 flex flex-col gap-3">
              {Object.entries(audit).map(([nom, echecs]) => (
                <div key={nom} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={echecs.length ? "error" : "success"} size="sm" icon={echecs.length ? "✕" : "✓"}>
                      {echecs.length === 0 ? "conforme" : `${echecs.length} échec${echecs.length > 1 ? "s" : ""}`}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{nom}</span>
                  </div>
                  {echecs.map((e, i) => (
                    <p key={i} className="m-0 pl-2 text-xs text-muted-foreground">
                      <span className="tabular-nums font-semibold text-[var(--destructive-text)]">
                        {e.ratio.toFixed(2)}
                      </span>{" "}
                      &lt; {e.seuil} · {e.taillePx}px · « {e.texte} » · <code className="font-mono">{e.selecteur}</code>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
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
