/**
 * Le panneau de comparaison du rayon — séparé de son histoire, parce que
 * DEUX histoires l'utilisent : celle qui le rend seul, et celle qui en
 * embarque deux dans des cadres pour les mettre côte à côte.
 */
import { Button } from "@registry/aikoz/button/button";
import { Badge } from "@registry/aikoz/badge/badge";
import { Card } from "@registry/aikoz/card/card";
import { Avatar } from "@registry/aikoz/avatar/avatar";
import { Switch } from "@registry/aikoz/switch/switch";
import { ProgressBar } from "@registry/aikoz/progress-bar/progress-bar";
import { DeltaBadge } from "@registry/aikoz/delta-badge/delta-badge";

export function PanneauRayon() {
  return (
    <div className="flex flex-col gap-4 bg-[var(--background)] p-5 text-[var(--foreground)]">
      <section className="flex flex-col gap-2">
        <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Pilule par identité — suit la marque
        </h3>
        <Card className="flex flex-wrap items-center gap-2 p-4">
          <Button size="sm">Répondre</Button>
          <Button size="sm" variant="outline">
            Reformuler
          </Button>
          <Badge tone="success" size="sm">
            Publiée
          </Badge>
          <Badge tone="warning" size="sm">
            À valider
          </Badge>
          <DeltaBadge value={12} />
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Cercle par géométrie — rond sous toutes les marques
        </h3>
        <Card className="flex flex-wrap items-center gap-4 p-4">
          <Avatar name="Alice Maréchaud" />
          <Switch label="Notifications" labelHidden defaultChecked />
          <div className="min-w-32 flex-1">
            <ProgressBar label="Taux de réponse" value={78} />
          </div>
        </Card>
      </section>
    </div>
  );
}
