import type { Meta, StoryObj } from "@storybook/react-vite";
import Tokens from "../../playground/Tokens";
import { auditerToutesCombinaisons, type EchecContraste } from "../../playground/audit";
import { useState } from "react";
import { Button } from "@registry/aikoz/button/button";
import { Badge } from "@registry/aikoz/badge/badge";

/**
 * La page Tokens ne contient AUCUNE liste en dur : elle lit les custom
 * properties réellement chargées dans le document et résout chaque valeur.
 * Elle reflète donc toujours le dernier `npm run build:tokens`, sans
 * maintenance — une galerie de tokens écrite à la main périme immédiatement.
 *
 * Elle est reprise telle quelle du playground plutôt que réécrite : deux
 * versions du même inventaire divergeraient, et c'est précisément ce qui est
 * arrivé à la config Tailwind tenue à la main à côté du bridge.
 */
function PageTokens() {
  const sombre = document.documentElement.classList.contains("dark");
  const registre = document.documentElement.getAttribute("data-register") ?? "produit";
  return <Tokens dark={sombre} register={registre} />;
}

const meta = {
  title: "Design system/Tokens",
  component: PageTokens,
  parameters: {
    layout: "fullscreen",
    // Les valeurs dépendent de la bascule en barre d'outils : une story qui
    // se fige à un seul thème mentirait la moitié du temps.
    docs: { story: { inline: false, height: "900px" } },
  },
} satisfies Meta<typeof PageTokens>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inventaire: Story = {
  name: "Inventaire",
  render: () => (
    <div className="bg-background p-8 text-foreground">
      <PageTokens />
    </div>
  ),
};

// ─── Audit ────────────────────────────────────────────────────────────────────

function PageAudit() {
  const [resultat, setResultat] = useState<Record<string, EchecContraste[]> | null>(null);
  return (
    <div className="flex flex-col gap-4 bg-background p-8 text-foreground">
      <p className="m-0 max-w-2xl text-sm text-muted-foreground">
        Parcourt chaque texte visible de cette page dans les quatre combinaisons et le
        compare à son fond <strong>composé</strong> — voiles de badge inclus. C'est ce
        composite qu'un audit token-à-token ne voit pas, et c'est lui qui a révélé que{" "}
        <code className="font-mono">warning-text</code> tombait à 4,25:1 en registre
        marketing alors qu'il passait en produit.
      </p>
      <div>
        <Button size="sm" variant="outline" onClick={() => setResultat(auditerToutesCombinaisons())}>
          Lancer l'audit
        </Button>
      </div>
      {resultat && (
        <div className="flex flex-col gap-3">
          {Object.entries(resultat).map(([nom, echecs]) => (
            <div key={nom} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge tone={echecs.length ? "error" : "success"} size="sm" icon={echecs.length ? "✕" : "✓"}>
                  {echecs.length === 0 ? "conforme" : `${echecs.length} échec${echecs.length > 1 ? "s" : ""}`}
                </Badge>
                <span className="text-sm font-medium">{nom}</span>
              </div>
              {echecs.map((e, i) => (
                <p key={i} className="m-0 pl-2 text-xs text-muted-foreground">
                  <span className="font-semibold tabular-nums text-[var(--destructive-text)]">
                    {e.ratio.toFixed(2)}
                  </span>{" "}
                  &lt; {e.seuil} · {e.taillePx}px · « {e.texte} » ·{" "}
                  <code className="font-mono">{e.selecteur}</code>
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Audit: Story = {
  name: "Audit de contraste",
  render: () => <PageAudit />,
  parameters: {
    docs: {
      description: {
        story:
          "L'audit s'exécute sur le RENDU, pas sur les tokens. Il fige les transitions " +
          "avant de basculer — auditer pendant une interpolation de 200 ms avait produit " +
          "95 échecs fantômes.",
      },
    },
  },
};
