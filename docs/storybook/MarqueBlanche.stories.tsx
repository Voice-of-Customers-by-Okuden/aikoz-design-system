import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useEffect, useState } from "react";
import { Button } from "@registry/aikoz/button/button";
import { Badge } from "@registry/aikoz/badge/badge";
import { KpiCard } from "@registry/aikoz/kpi-card/kpi-card";

const MARQUES = [
  { id: null, nom: "Aikoz", detail: "marque par défaut" },
  { id: "adp", nom: "Groupe ADP", detail: "PANTONE 2748 C · 2144 C · Bright Red C" },
  { id: "generali", nom: "Generali", detail: "marque de démonstration" },
] as const;

/**
 * La marque blanche est un ATTRIBUT, pas un thème.
 *
 * `data-brand` s'ajoute sur `<html>` et n'écrase ni le thème clair/sombre ni
 * le registre produit/marketing — les trois axes se composent. C'est ce qui
 * permet de livrer un « ADP by Aikoz » sombre en registre produit sans
 * dupliquer une seule règle.
 */
function Vitrine({ marque }: { marque: string | null }) {
  useEffect(() => {
    const H = document.documentElement;
    const avant = H.getAttribute("data-brand");
    if (marque) H.setAttribute("data-brand", marque);
    else H.removeAttribute("data-brand");
    return () => {
      avant ? H.setAttribute("data-brand", avant) : H.removeAttribute("data-brand");
    };
  }, [marque]);

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Publier la réponse</Button>
        <Button variant="secondary">Modifier</Button>
        <Button variant="outline">Annuler</Button>
        <Badge tone="info" icon="●">Programmée</Badge>
      </div>
      <KpiCard label="Taux de réponse" value={87} unit="%" variant="target" target={90} />
    </div>
  );
}

function Toutes() {
  const [actif, setActif] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Marque" className="flex flex-wrap gap-2">
        {MARQUES.map((m) => (
          <Button
            key={m.nom}
            size="sm"
            variant={actif === m.id ? "default" : "outline"}
            aria-pressed={actif === m.id}
            onClick={() => setActif(m.id)}
          >
            {m.nom}
          </Button>
        ))}
      </div>
      <p className="m-0 text-sm text-muted-foreground">
        {MARQUES.find((m) => m.id === actif)?.detail}
      </p>
      <Vitrine marque={actif} />
    </div>
  );
}

const meta = {
  title: "Design system/Marque blanche",
  component: Toutes,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Toutes>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TroisMarques: Story = {
  name: "Trois marques, un seul code",
  parameters: {
    docs: {
      description: {
        story:
          "`data-brand` est un **attribut**, pas un thème : il n'écrase ni le clair/sombre " +
          "ni le registre produit/marketing. Les trois axes se composent, ce qui permet de " +
          "livrer un « ADP by Aikoz » sombre en registre produit sans dupliquer une règle.\n\n" +
          "Les couleurs ADP viennent du brand book (Groupe ADP & Paris Aéroport Style " +
          "Guide) : **PANTONE 2748 C** `#031F73`, **2144 C** `#376DB3`, **Bright Red C** " +
          "`#C84118`. Seuls ces trois pas sont officiels ; les autres crans des rampes sont " +
          "dérivés en suivant le profil de clarté de la rampe ultramarine Aikoz.",
      },
    },
  },
};

export const LaMarqueChangeVraimentLesTokens: Story = {
  name: "La marque change vraiment les tokens",
  parameters: {
    docs: {
      description: {
        story:
          "Ce test lit `--color-brand-primary` sur le document après avoir posé " +
          "`data-brand`. Un CSS de marque généré mais **jamais importé** produirait un " +
          "composant inchangé sans la moindre erreur — c'est ce qui est arrivé en " +
          "ajoutant ADP, et un garde-fou de build le vérifie désormais.",
      },
    },
  },
  play: async () => {
    const H = document.documentElement;
    const lire = () =>
      getComputedStyle(H).getPropertyValue("--color-brand-primary").trim();

    const avant = H.getAttribute("data-brand");
    H.removeAttribute("data-brand");
    const aikoz = lire();
    H.setAttribute("data-brand", "adp");
    const adp = lire();
    avant ? H.setAttribute("data-brand", avant) : H.removeAttribute("data-brand");

    await expect(aikoz).toBeTruthy();
    await expect(adp).toBeTruthy();
    await expect(adp).not.toBe(aikoz);
  },
};
