import { useState, type ReactNode } from "react";
import { Badge } from "@registry/aikoz/badge/badge";
import { Button } from "@registry/aikoz/button/button";
import { DeltaBadge } from "@registry/aikoz/delta-badge/delta-badge";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";
import { ProgressBar } from "@registry/aikoz/progress-bar/progress-bar";
import { ScoreStars } from "@registry/aikoz/score-stars/score-stars";
import { VerbatimCard } from "@registry/aikoz/verbatim-card/verbatim-card";
import { Input } from "@registry/aikoz/input/input";
import { Card } from "@registry/aikoz/card/card";
import { Avatar } from "@registry/aikoz/avatar/avatar";
import { Dialog } from "@registry/aikoz/dialog/dialog";
import { Select } from "@registry/aikoz/select/select";
import { Tooltip } from "@registry/aikoz/tooltip/tooltip";
import { NavItem } from "@registry/aikoz/nav-item/nav-item";
import { SidebarNav } from "@registry/aikoz/sidebar-nav/sidebar-nav";
import { ViewTabs } from "@registry/aikoz/view-tabs/view-tabs";
import { DateRangePicker } from "@registry/aikoz/date-range-picker/date-range-picker";
import { Skeleton, SkeletonText } from "@registry/aikoz/skeleton/skeleton";
import { EmptyState } from "@registry/aikoz/empty-state/empty-state";
import { Table } from "@registry/aikoz/table/table";
import { Breadcrumb } from "@registry/aikoz/breadcrumb/breadcrumb";
import { Accordion } from "@registry/aikoz/accordion/accordion";
import { Stepper } from "@registry/aikoz/stepper/stepper";
import { ChoiceCard } from "@registry/aikoz/choice-card/choice-card";
import { ChoiceGroup } from "@registry/aikoz/choice-group/choice-group";
import { BrandLogo } from "@registry/aikoz/brand-logo/brand-logo";
import { Leaderboard } from "@registry/aikoz/leaderboard/leaderboard";
import { LogoMarquee } from "@registry/aikoz/logo-marquee/logo-marquee";
import { SiteNav } from "@registry/aikoz/site-nav/site-nav";
import { SiteFooter } from "@registry/aikoz/site-footer/site-footer";
import { FeaturePanel } from "@registry/aikoz/feature-panel/feature-panel";
import { SlotPicker } from "@registry/aikoz/slot-picker/slot-picker";
import { BookingFlow, type BookingStatus } from "@registry/aikoz/booking-flow/booking-flow";
import { LineChart } from "@registry/aikoz/line-chart/line-chart";
import { ChartFrame } from "@registry/aikoz/chart-frame/chart-frame";
import { BarChart } from "@registry/aikoz/bar-chart/bar-chart";
import { DonutChart } from "@registry/aikoz/donut-chart/donut-chart";
import { Switch } from "@registry/aikoz/switch/switch";
import { InfoBanner } from "@registry/aikoz/info-banner/info-banner";
import { Textarea } from "@registry/aikoz/textarea/textarea";
import { CountBadge } from "@registry/aikoz/count-badge/count-badge";
import { ReplyBubble } from "@registry/aikoz/reply-bubble/reply-bubble";
import {
  ResponseKanban,
  type AutomatedReplyItem,
  type OffCharterReplyItem,
  type SensitiveReviewItem,
} from "@registry/aikoz/response-kanban/response-kanban";

const delivered = [
  ["01", "Button", "Actions", "4 variantes · 3 tailles"],
  ["02", "ScoreStars", "Data display", "demi-étoiles · 3 tailles"],
  ["03", "Badge", "Data display", "5 tons · 2 tailles"],
  ["04", "DeltaBadge", "Data display", "positif · négatif · neutre"],
  ["05", "ProgressBar", "Data display", "3 niveaux · 2 rôles ARIA"],
  ["06", "Input", "Forms", "4 états · libellé obligatoire"],
  ["07", "Card", "Layout", "3 surfaces · 3 densités"],
  ["08", "Avatar", "Data display", "repli sur initiales · 4 tailles"],
  ["09", "Dialog", "Overlays", "3 placements · piège de focus Radix"],
  ["10", "KpiCard", "Data display", "4 variantes · 3 densités"],
  ["11", "VerbatimCard", "Data display", "2 densités · 2 statuts"],
  ["12", "Select", "Forms", "listbox Radix · groupes"],
  ["13", "Tooltip", "Feedback", "confort, jamais nécessité"],
  ["14", "NavItem", "Navigation", "état courant sur 3 canaux"],
  ["15", "SidebarNav", "Navigation", "groupes · route active"],
  ["16", "ViewTabs", "Navigation", "tabindex tournant · 2 activations"],
  ["17", "DateRangePicker", "Forms", "préréglages en radio · saisie native"],
  ["18", "Skeleton", "Feedback", "muet pour les lecteurs d'écran"],
  ["19", "EmptyState", "Feedback", "nomme le manque · indique la sortie"],
  ["20", "Table", "Data display", "caption · aria-sort · tri"],
  ["21", "Breadcrumb", "Navigation", "dernier élément non cliquable"],
  ["22", "Accordion", "Layout", "single ou multiple · hidden natif"],
  ["23", "Stepper", "Site", "« étape n sur 5 » · 3 états"],
  ["24", "ChoiceCard", "Site", "input sr-only · la coche porte l'état"],
  ["25", "ChoiceGroup", "Site", "remplace BrandPicker + SourceToggle"],
  ["26", "BrandLogo", "Site", "19 assureurs · circle ou plate"],
  ["27", "Leaderboard", "Data display", "bâti sur Table · podium doublé"],
  ["28", "LogoMarquee", "Site", "ne défile pas · WCAG 2.2.2"],
  ["29", "SiteNav", "Site", "lien d'évitement · menu en disclosure"],
  ["30", "SiteFooter", "Site", "repère contentinfo · colonnes nommées"],
  ["31", "FeaturePanel", "Site", "plan déduit · liste de leviers"],
  ["32", "SlotPicker", "Site", "un seul fieldset · créneau complet annoncé"],
  ["33", "BookingFlow", "Site", "status en entrée · onSubmit en sortie"],
  ["34", "LineChart", "Data display", "multi-séries · référence en retrait"],
  ["35", "ChartFrame", "Data display", "coque commune aux 3 graphiques"],
  ["36", "BarChart", "Data display", "empilé ou groupé · vertical ou horizontal"],
  ["37", "DonutChart", "Data display", "pourcentage écrit · chiffre au centre"],
  ["38", "Switch", "Actions", "checkbox natif role=switch · bascule immédiate"],
  ["39", "InfoBanner", "Feedback", "3 tons · role=status, jamais alert"],
  ["40", "Textarea", "Forms", "sibling d'Input · rows + resize natif"],
  ["41", "CountBadge", "Feedback", "compteur ou rang, jamais les deux"],
  ["42", "ReplyBubble", "Data display", "IA ou opérateur, sous une carte d'avis"],
  ["43", "ResponseKanban", "Layout", "3 colonnes par urgence croissante"],
] as const;

const sparkline = [3.7, 3.8, 3.9, 3.8, 4.0, 4.1, 4.0, 4.2];

const JOURS_DEMO = [
  {
    label: "Mardi 14 avril",
    slots: [
      { value: "9h", time: "09:00" },
      { value: "9h30", time: "09:30", full: true },
      { value: "11h", time: "11:00" },
    ],
  },
];

export default function DeliveredComponents() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("Tous");
  const categories = [
    "Tous",
    "Actions",
    "Data display",
    "Navigation",
    "Forms",
    "Feedback",
    "Overlays",
    "Layout",
    "Site",
  ];

  return (
    <div className={`inventory-page ${dark ? "dark" : ""}`}>
      <header className="inventory-header">
        <div className="inventory-brand"><span className="inventory-brand-mark">A</span><span><strong>Aikoz</strong><small>Design system</small></span></div>
        <div className="inventory-header-actions"><span className="inventory-status"><i />43 composants livrés</span><Button variant="outline" size="sm" onClick={() => setDark(!dark)}>{dark ? "Mode clair" : "Mode sombre"}</Button></div>
      </header>

      <main className="inventory-main">
        <section className="inventory-intro">
          <div><p className="inventory-kicker">Registry Aikoz · v1</p><h1>Composants disponibles</h1><p>La bibliothèque réellement livrée et installable aujourd'hui. Cette page ne présente aucun composant en attente de construction.</p></div>
          <div className="inventory-count"><strong>43</strong><span>composants<br />disponibles</span></div>
        </section>

        <div className="inventory-toolbar"><div className="inventory-tabs" role="tablist" aria-label="Filtrer les composants">{categories.map((category) => <button key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)} role="tab" aria-selected={active === category}>{category}</button>)}</div><span className="inventory-note">Données d'exemple uniquement</span></div>

        <section className="inventory-list" aria-label="Composants livrés">
          {(active === "Tous" ? delivered : delivered.filter((item) => item[2] === active)).map(([number, name, category, summary]) => <article className="inventory-section" key={name}>
            <div className="inventory-section-heading"><span className="inventory-number">{number}</span><div><p>{category}</p><h2>{name}</h2><span>{summary}</span></div></div>
            <div className="inventory-preview">{PREVIEWS[name]?.()}</div>
          </article>)}
        </section>
      </main>
    </div>
  );
}

// ─── Actions ────────────────────────────────────────────────────────────────

function ButtonPreview() {
  return <div className="preview-row preview-wrap"><Button size="sm">Primary</Button><Button size="sm" variant="secondary">Secondary</Button><Button size="sm" variant="outline">Outline</Button><Button size="sm" variant="ghost">Ghost</Button><Button size="sm" disabled>Disabled</Button></div>;
}

function SwitchPreview() {
  const [on, setOn] = useState(true);
  return (
    <div className="preview-column">
      <Switch label="Automatisation activée" checked={on} onCheckedChange={setOn} />
      <Switch label="Notifications par e-mail" description="Envoyées chaque lundi matin." />
      <Switch label="Mode démo" disabled />
    </div>
  );
}

// ─── Data display ─────────────────────────────────────────────────────────────

function StarsPreview() {
  return <div className="preview-column"><div className="preview-row"><ScoreStars value={4.5} size="lg" /><strong className="preview-value">4,5 / 5</strong></div><div className="preview-row"><ScoreStars value={3.5} size="md" /><ScoreStars value={2} size="sm" /></div></div>;
}

function BadgePreview() {
  return <div className="preview-row preview-wrap"><Badge tone="success" icon="✓">Répondu</Badge><Badge tone="warning" icon="!">À surveiller</Badge><Badge tone="error" icon="✕">Critique</Badge><Badge tone="info" icon="i">Info</Badge><Badge tone="neutral">Neutre</Badge></div>;
}

function DeltaPreview() {
  return <div className="preview-row preview-wrap"><DeltaBadge value={12} unit=" pts" /><DeltaBadge value={-8} unit=" pts" /><DeltaBadge value={0} unit=" pts" /><DeltaBadge value={-1.2} unit=" j" tone="positive" /></div>;
}

function ProgressPreview() {
  return <div className="preview-progress"><div><span>Good</span><ProgressBar value={88} level="good" /></div><div><span>Warning</span><ProgressBar value={62} level="warning" /></div><div><span>Critical</span><ProgressBar value={31} level="critical" /></div></div>;
}

function AvatarPreview() {
  return <div className="preview-row preview-wrap"><Avatar name="Claire Dubois" size="sm" /><Avatar name="Banque de France" size="md" /><Avatar name="Julien Leroy" size="lg" /><Avatar name="AXA" size="xl" /></div>;
}

function KpiPreview() {
  return <div className="preview-kpis"><KpiCard variant="rating" density="compact" label="Note moyenne" value={4.2} trend={0.1} trendUnit="" /><KpiCard variant="target" density="compact" label="Taux de réponse" value={87} unit=" %" target={90} trend={4.2} trendUnit=" pts" caption="Objectif · 90 %" /><KpiCard variant="trend" density="compact" label="Avis traités" value={312} data={sparkline} trend={18} trendUnit="" caption="30 derniers jours" /></div>;
}

function VerbatimPreview() {
  const [status, setStatus] = useState<"replied" | "unanswered">("replied");
  return <div className="preview-verbatim"><VerbatimCard rating={status === "replied" ? 5 : 2} status={status} source="Google" author="Client vérifié" date="12 août 2026" text={status === "replied" ? "Accueil chaleureux et conseillère vraiment à l'écoute. Dossier traité en quelques jours." : "Délais de traitement beaucoup trop longs, plusieurs relances restées sans retour."} tags={["Réactivité", "Accueil"]} lines={2} /><div className="preview-switch"><Button variant="ghost" size="sm" onClick={() => setStatus(status === "replied" ? "unanswered" : "replied")}>Changer le statut</Button></div></div>;
}

function ReplyBubblePreview() {
  return (
    <div className="preview-wide preview-column">
      <ReplyBubble origin="ai">
        Merci pour votre avis ! Nous transmettons votre retour à l'équipe concernée.
      </ReplyBubble>
      <ReplyBubble origin="operator" operatorName="Claire D.">
        Bonjour, nous revenons vers vous rapidement pour régler ce point.
      </ReplyBubble>
    </div>
  );
}

function TablePreview() {
  const rows = [
    { id: "1", agence: "Lyon Part-Dieu", taux: "94 %" },
    { id: "2", agence: "Marseille Prado", taux: "84 %" },
    { id: "3", agence: "Lille Grand Place", taux: "79 %" },
  ];
  return (
    <div className="preview-wide">
      <Table
        caption="Taux de réponse par agence, 30 derniers jours"
        columns={[
          { key: "agence", header: "Agence" },
          { key: "taux", header: "Taux de réponse", numeric: true },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        rowHeaderKey="agence"
        density="compact"
      />
    </div>
  );
}

function LeaderboardPreview() {
  const entries = [
    { id: "1", rank: 1, name: "Lyon Part-Dieu", organization: "Réseau Sud-Est", brand: "axa", value: "4,8", delta: 0.2, highlighted: true },
    { id: "2", rank: 2, name: "Marseille Prado", organization: "Réseau Sud-Est", brand: "maif", value: "4,6", delta: -0.1 },
    { id: "3", rank: 3, name: "Lille Grand Place", organization: "Réseau Nord", brand: "generali", value: "4,5", delta: 0 },
  ];
  return (
    <div className="preview-wide">
      <Leaderboard caption="Classement des agences par note moyenne" entries={entries} valueLabel="Note" density="compact" />
    </div>
  );
}

function LineChartPreview() {
  const data = [
    { mois: "Janv.", agence: 4.1, marche: 3.9 },
    { mois: "Févr.", agence: 4.2, marche: 3.9 },
    { mois: "Mars", agence: 4.3, marche: 4.0 },
    { mois: "Avr.", agence: 4.2, marche: 4.0 },
  ];
  return (
    <div className="preview-wide">
      <LineChart
        caption="Note moyenne par mois"
        xKey="mois"
        series={[{ key: "agence", label: "Votre agence" }]}
        reference={{ key: "marche", label: "Moyenne marché" }}
        data={data}
        height={170}
      />
    </div>
  );
}

function ChartFramePreview() {
  const data = [
    { periode: "S1", valeur: 42 },
    { periode: "S2", valeur: 51 },
    { periode: "S3", valeur: 47 },
  ];
  return (
    <div className="preview-wide">
      <ChartFrame
        caption="Volume d'avis par semaine"
        summary="Volume d'avis par semaine. 1 série sur 3 points."
        series={[{ key: "valeur", label: "Volume" }]}
        data={data}
        columns={[
          { key: "periode", header: "Semaine" },
          { key: "valeur", header: "Volume", numeric: true },
        ]}
        getRowKey={(row) => row.periode}
        rowHeaderKey="periode"
        height={130}
      >
        {() => (
          <div className="preview-chartframe-shell">
            Coque commune : légende, graphique masqué, tableau réel — partagée par LineChart, BarChart et DonutChart.
          </div>
        )}
      </ChartFrame>
    </div>
  );
}

function BarChartPreview() {
  const data = [
    { source: "Google", repondu: 62, sans: 18 },
    { source: "Trustpilot", repondu: 40, sans: 12 },
  ];
  return (
    <div className="preview-wide">
      <BarChart
        caption="Avis par source, répondus ou non"
        xKey="source"
        series={[
          { key: "repondu", label: "Répondu" },
          { key: "sans", label: "Sans réponse" },
        ]}
        data={data}
        layout="stacked"
        height={170}
      />
    </div>
  );
}

function DonutChartPreview() {
  return (
    <div className="preview-wide">
      <DonutChart
        caption="Répartition des avis par source"
        parts={[
          { key: "google", label: "Google", value: 62 },
          { key: "trustpilot", label: "Trustpilot", value: 24 },
          { key: "facebook", label: "Facebook", value: 14 },
        ]}
        centerValue="100"
        centerLabel="avis"
        height={190}
      />
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function NavItemPreview() {
  return (
    <div className="preview-navlist">
      <NavItem label="Marché" current />
      <NavItem label="Campagnes" count={3} />
      <NavItem label="Paramètres" />
    </div>
  );
}

function SidebarNavPreview() {
  return (
    <div className="preview-sidebarnav">
      <SidebarNav
        label="Navigation principale"
        current="marche"
        entries={[
          { id: "marche", label: "Marché", href: "#marche" },
          { id: "campagnes", label: "Campagnes", href: "#campagnes", count: 2 },
          { id: "parametres", label: "Paramètres", href: "#parametres" },
        ]}
      />
    </div>
  );
}

function ViewTabsPreview() {
  return (
    <div className="preview-wide">
      <ViewTabs
        label="Vues du classement"
        defaultValue="semaine"
        tabs={[
          { value: "semaine", label: "Semaine", content: <p className="preview-value">Vue hebdomadaire.</p> },
          { value: "mois", label: "Mois", content: <p className="preview-value">Vue mensuelle.</p> },
          { value: "annee", label: "Année", content: <p className="preview-value">Vue annuelle.</p> },
        ]}
      />
    </div>
  );
}

function BreadcrumbPreview() {
  return (
    <Breadcrumb
      items={[
        { label: "Tableau de bord", href: "#" },
        { label: "Marché", href: "#" },
        { label: "Lyon Part-Dieu" },
      ]}
    />
  );
}

// ─── Forms ────────────────────────────────────────────────────────────────────

function InputPreview() {
  return (
    <div className="preview-row preview-wrap preview-inputs">
      <Input label="Nom de l'agence" placeholder="Assurup Lyon Centre" />
      <Input label="E-mail" type="email" defaultValue="contact@agence" error="L'adresse doit contenir un domaine." />
      <Input label="Marque rattachée" defaultValue="AXA" readOnly description="Déterminée par la fiche." />
    </div>
  );
}

function SelectPreview() {
  return (
    <div className="preview-row preview-wrap preview-inputs">
      <Select
        label="Source"
        defaultValue="google"
        options={[
          { value: "google", label: "Google" },
          { value: "trustpilot", label: "Trustpilot" },
          { value: "facebook", label: "Facebook" },
        ]}
      />
      <Select
        label="Réseau"
        placeholder="Choisir un réseau…"
        options={[
          { value: "nord", label: "Réseau Nord", group: "France" },
          { value: "sud", label: "Réseau Sud", group: "France" },
        ]}
      />
    </div>
  );
}

function DateRangePickerPreview() {
  return (
    <div className="preview-wide">
      <DateRangePicker label="Période d'analyse" defaultValue={{ preset: "30j" }} />
    </div>
  );
}

function TextareaPreview() {
  return (
    <div className="preview-wide">
      <Textarea
        label="Modifier la réponse"
        defaultValue="Merci pour votre retour, nous sommes ravis d'avoir répondu à vos attentes."
        rows={3}
      />
    </div>
  );
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function TooltipPreview() {
  return (
    <div className="preview-row preview-wrap">
      <Tooltip content="Taux de réponse sur les 30 derniers jours." defaultOpen>
        <Button size="sm" variant="outline">Taux de réponse</Button>
      </Tooltip>
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div className="preview-column" aria-busy="true">
      <div className="preview-row">
        <Skeleton shape="circle" className="size-10" />
        <div style={{ flex: 1, minWidth: 160 }}><SkeletonText lines={2} /></div>
      </div>
    </div>
  );
}

function EmptyStatePreview() {
  return (
    <div className="preview-wide">
      <EmptyState
        density="compact"
        title="Aucun avis sur cette période"
        description="Élargissez la période ou retirez le filtre par source."
        action={<Button size="sm">Réinitialiser les filtres</Button>}
      />
    </div>
  );
}

function InfoBannerPreview() {
  return (
    <div className="preview-wide preview-column">
      <InfoBanner>
        Les réponses affichées ci-dessous tournent aléatoirement parmi les formulations enregistrées.
      </InfoBanner>
      <InfoBanner tone="warning">Cette automatisation ne couvre pas les avis 1-2 étoiles.</InfoBanner>
    </div>
  );
}

function CountBadgePreview() {
  return (
    <div className="preview-row preview-wrap">
      <CountBadge value={7} variant="count" label="avis en attente" />
      <CountBadge value={1} variant="rank" label={null} />
      <CountBadge value={2} variant="rank" label={null} />
      <CountBadge value={12} variant="count" label="alertes" />
    </div>
  );
}

// ─── Overlays ─────────────────────────────────────────────────────────────────

function DialogPreview() {
  return (
    <Dialog
      trigger={<Button size="sm" variant="outline">Ouvrir la fiche avis</Button>}
      title="Avis de Claire Dubois"
      description="Google · 12 août 2026"
    >
      <p className="preview-value" style={{ fontSize: 14 }}>« Accueil chaleureux, conseillère à l'écoute. »</p>
    </Dialog>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function CardPreview() {
  return (
    <div className="preview-row preview-wrap preview-cards">
      <Card surface="raised" density="compact"><strong>Carte raised</strong><span>Ombre légère, bord.</span></Card>
      <Card surface="flat" density="compact"><strong>Carte flat</strong><span>Sans ombre.</span></Card>
      <Card surface="bare" density="compact" as="section"><strong>Carte bare</strong><span>Ni bord ni ombre.</span></Card>
    </div>
  );
}

function AccordionPreview() {
  return (
    <div className="preview-wide">
      <Accordion
        defaultValue={["q1"]}
        items={[
          { value: "q1", title: "Comment sont calculés les taux ?", content: "Sur les avis reçus durant la période sélectionnée." },
          { value: "q2", title: "Puis-je exporter les données ?", content: "Oui, au format CSV depuis chaque tableau." },
        ]}
      />
    </div>
  );
}

function ResponseKanbanPreview() {
  const automated: AutomatedReplyItem[] = [
    {
      id: "a1",
      rating: 5,
      author: "Client vérifié",
      date: "12 août 2026",
      reply: "Merci beaucoup pour votre retour, ravis d'avoir répondu à vos attentes !",
    },
    {
      id: "a2",
      rating: 4,
      author: "Client vérifié",
      date: "11 août 2026",
      reply: "Merci pour votre confiance, à bientôt !",
    },
  ];
  const offCharter: OffCharterReplyItem[] = [
    {
      id: "o1",
      rating: 2,
      author: "Client vérifié",
      date: "9 août 2026",
      text: "Délais de traitement beaucoup trop longs.",
      reply: "Nous vous invitons à contacter directement notre assureur partenaire pour ce type de dossier.",
      reasonLabel: "Réponse déresponsabilisante · renvoi vers un tiers",
    },
  ];
  const sensitive: SensitiveReviewItem[] = [
    {
      id: "s1",
      rating: 1,
      author: "Client vérifié",
      date: "8 août 2026",
      text: "Aucune rampe d'accès, impossible d'entrer avec un fauteuil.",
      categoryLabel: "Accessibilité PMR · sûreté",
    },
  ];
  return (
    <div className="preview-wide">
      <ResponseKanban automated={automated} offCharter={offCharter} sensitive={sensitive} initialVisible={2} />
    </div>
  );
}

// ─── Site ─────────────────────────────────────────────────────────────────────

function StepperPreview() {
  return (
    <div className="preview-wide">
      <Stepper
        current={2}
        steps={[
          { label: "Univers" },
          { label: "Agence" },
          { label: "Marque" },
          { label: "Sources" },
          { label: "Confirmation" },
        ]}
      />
    </div>
  );
}

function ChoiceCardPreview() {
  return (
    <div className="preview-row preview-wrap preview-choicecards">
      <ChoiceCard label="Assurance" name="secteur-demo" value="assurance" defaultChecked />
      <ChoiceCard label="Assistance" name="secteur-demo" value="assistance" />
      <ChoiceCard label="Automobile" name="secteur-demo" value="automobile" description="Bientôt disponible" disabled />
    </div>
  );
}

function ChoiceGroupPreview() {
  return (
    <div className="preview-wide">
      <ChoiceGroup
        legend="Sources à analyser"
        selection="multiple"
        layout="list"
        defaultValue={["google"]}
        options={[
          { value: "google", label: "Google" },
          { value: "trustpilot", label: "Trustpilot" },
        ]}
      />
    </div>
  );
}

function BrandLogoPreview() {
  return (
    <div className="preview-row preview-wrap">
      <BrandLogo brand="axa" size="lg" />
      <BrandLogo brand="maif" size="lg" />
      <BrandLogo brand="generali" shape="plate" size="lg" />
      <BrandLogo brand="allianz" showName />
    </div>
  );
}

function LogoMarqueePreview() {
  return (
    <div className="preview-wide">
      <LogoMarquee label="Assureurs analysés par Aikoz" brands={["axa", "maif", "generali", "macif", "allianz"]} />
    </div>
  );
}

function SiteNavPreview() {
  return (
    <div className="preview-wide preview-sitechrome">
      <SiteNav
        links={[
          { label: "Notre solution", href: "#", current: true },
          { label: "Secteurs", href: "#" },
          { label: "Ressources", href: "#" },
        ]}
        skipTo={null}
        actions={<Button size="sm">Demander une démo</Button>}
      />
    </div>
  );
}

function SiteFooterPreview() {
  return (
    <div className="preview-wide preview-sitechrome">
      <SiteFooter
        tagline="Le pilotage des avis clients pour les réseaux d'assurance et de mobilité."
        groups={[
          { label: "Solution", links: [{ label: "Tableau de bord", href: "#" }, { label: "Alertes", href: "#" }] },
          { label: "Ressources", links: [{ label: "Documentation", href: "#", external: true }] },
        ]}
      />
    </div>
  );
}

function FeaturePanelPreview() {
  return (
    <div className="preview-wide">
      <FeaturePanel
        title="Quatre leviers"
        headingLevel={3}
        columns={2}
        features={[
          { title: "Centraliser", description: "Tous les avis, toutes sources, un seul flux.", metric: "×3" },
          { title: "Comparer", description: "Chaque agence face à son réseau.", metric: "48 h" },
        ]}
      />
    </div>
  );
}

function SlotPickerPreview() {
  const [slot, setSlot] = useState("");
  return (
    <div className="preview-wide">
      <SlotPicker legend="Choisissez un créneau" value={slot} onValueChange={setSlot} days={JOURS_DEMO} />
    </div>
  );
}

function BookingFlowPreview() {
  const [status, setStatus] = useState<BookingStatus>("form");
  return (
    <div className="preview-row preview-wrap">
      <BookingFlow
        trigger={<Button size="sm">Réserver une démo</Button>}
        status={status}
        days={JOURS_DEMO}
        onSubmit={() => setStatus("confirmed")}
      />
      <Button variant="ghost" size="sm" onClick={() => setStatus(status === "form" ? "confirmed" : "form")}>
        Basculer l'état ({status})
      </Button>
    </div>
  );
}

// ─── Registre des previews ─────────────────────────────────────────────────────

const PREVIEWS: Record<string, () => ReactNode> = {
  Button: ButtonPreview,
  ScoreStars: StarsPreview,
  Badge: BadgePreview,
  DeltaBadge: DeltaPreview,
  ProgressBar: ProgressPreview,
  Input: InputPreview,
  Card: CardPreview,
  Avatar: AvatarPreview,
  Dialog: DialogPreview,
  KpiCard: KpiPreview,
  VerbatimCard: VerbatimPreview,
  Select: SelectPreview,
  Tooltip: TooltipPreview,
  NavItem: NavItemPreview,
  SidebarNav: SidebarNavPreview,
  ViewTabs: ViewTabsPreview,
  DateRangePicker: DateRangePickerPreview,
  Skeleton: SkeletonPreview,
  EmptyState: EmptyStatePreview,
  Table: TablePreview,
  Breadcrumb: BreadcrumbPreview,
  Accordion: AccordionPreview,
  Stepper: StepperPreview,
  ChoiceCard: ChoiceCardPreview,
  ChoiceGroup: ChoiceGroupPreview,
  BrandLogo: BrandLogoPreview,
  Leaderboard: LeaderboardPreview,
  LogoMarquee: LogoMarqueePreview,
  SiteNav: SiteNavPreview,
  SiteFooter: SiteFooterPreview,
  FeaturePanel: FeaturePanelPreview,
  SlotPicker: SlotPickerPreview,
  BookingFlow: BookingFlowPreview,
  LineChart: LineChartPreview,
  ChartFrame: ChartFramePreview,
  BarChart: BarChartPreview,
  DonutChart: DonutChartPreview,
  Switch: SwitchPreview,
  InfoBanner: InfoBannerPreview,
  Textarea: TextareaPreview,
  CountBadge: CountBadgePreview,
  ReplyBubble: ReplyBubblePreview,
  ResponseKanban: ResponseKanbanPreview,
};
