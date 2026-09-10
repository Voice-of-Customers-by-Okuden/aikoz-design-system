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
  const [register, setRegister] = useState<"produit" | "marketing">("produit");

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
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aikoz Design System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Playground · état d'avancement en temps réel
            </p>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <button
              onClick={toggleRegister}
              className={`border rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition-colors ${
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
              className="border border-border text-foreground bg-card rounded-[var(--radius)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors"
            >
              {dark ? "☀ Mode clair" : "☾ Mode sombre"}
            </button>
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
