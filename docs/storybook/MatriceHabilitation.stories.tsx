import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useId, useState } from "react";
import { expect, within } from "storybook/test";
import { Table, type TableColumn } from "@registry/aikoz/table/table";
import { Switch } from "@registry/aikoz/switch/switch";
import { Badge } from "@registry/aikoz/badge/badge";
import { Card } from "@registry/aikoz/card/card";

// ─── Les données de l'écran ──────────────────────────────────────────────────

type Fonctionnalite = { key: string; label: string };
type Role = { key: string; label: string };

const FONCTIONNALITES: Fonctionnalite[] = [
  { key: "avis", label: "Réponse aux avis" },
  { key: "kpi", label: "Tableau de bord" },
  { key: "nap", label: "Gestion des NAP" },
  { key: "gbp", label: "Publications GBP" },
];

// Trois rôles restent à nommer, et dans la maquette DEUX colonnes portaient
// le même intitulé (« RÔLE 6 »).
//
// Ce n'est pas un détail de relecture : dans une matrice, le nom de la
// colonne est la MOITIÉ du nom de chaque case. Deux colonnes homonymes, et
// douze cases deviennent indiscernables — « Réponse aux avis pour Rôle 6 »
// désigne deux droits différents.
const ROLES: Role[] = [
  { key: "poi", label: "Gestionnaire POI" },
  { key: "dir", label: "Directeur" },
  { key: "mkt", label: "Pôle marketing" },
  { key: "r4", label: "Rôle 4" },
  { key: "r5", label: "Rôle 5" },
  { key: "r6", label: "Rôle 6" },
];

const DROITS: Record<string, Record<string, boolean>> = {
  avis: { poi: true, dir: true, mkt: true, r4: true, r5: true, r6: true },
  kpi: { poi: false, dir: true, mkt: false, r4: true, r5: true, r6: true },
  nap: { poi: true, dir: true, mkt: true, r4: false, r5: true, r6: true },
  gbp: { poi: false, dir: true, mkt: true, r4: false, r5: true, r6: true },
};

// ─── L'assemblage ────────────────────────────────────────────────────────────

/**
 * Le nom de chaque case, DÉDUIT de sa ligne et de sa colonne.
 *
 * C'est la seule chose que cet assemblage apporte, et c'est celle qu'on
 * oublie : vingt-quatre interrupteurs sans nom propre, c'est vingt-quatre
 * fois « interrupteur, activé » au lecteur d'écran. Personne n'écrit ces
 * libellés à la main, et personne ne les maintient quand une colonne bouge.
 */
const nommerLaCase = (f: Fonctionnalite, r: Role) =>
  `${f.label} pour ${r.label}`;

function MatriceHabilitation({ modifiable }: { modifiable: boolean }) {
  const [droits, setDroits] = useState(DROITS);
  const titreId = useId();

  const colonnes: TableColumn<Fonctionnalite>[] = [
    { key: "label", header: "Fonctionnalité", width: "16rem" },
    ...ROLES.map((r) => ({
      key: r.key,
      header: r.label,
      cell: (f: Fonctionnalite) => {
        const accorde = droits[f.key][r.key];
        // Centré dans sa colonne. `Table` aligne à gauche par défaut, ce qui
        // convient à du texte de longueur variable — pas à une grille de
        // marqueurs identiques, où l'œil compare des COLONNES et où le
        // moindre décalage se lit comme une différence.
        return (
          <span className="flex justify-center">
            {modifiable ? (
              <Switch
                label={nommerLaCase(f, r)}
                labelHidden
                checked={accorde}
                onCheckedChange={(v) =>
                  setDroits((d) => ({
                    ...d,
                    [f.key]: { ...d[f.key], [r.key]: v },
                  }))
                }
              />
            ) : (
              // En lecture seule, PAS d'interrupteur : il donne envie de cliquer
              // sur ce qui ne se clique pas.
              //
              // Mais pas un `<span>` bricolé non plus, ce que j'avais fait
              // d'abord : `Badge` EXISTE, c'est une pastille, elle porte un ton
              // et son contour tient le 3:1 contre la carte. Réécrire à la main
              // ce que le système fournit, c'est exactement la dérive qu'un
              // design system est censé empêcher.
              <Badge
                tone={accorde ? "success" : "neutral"}
                size="sm"
                label={nommerLaCase(f, r)}
              >
                {accorde ? "Autorisé" : "Non"}
              </Badge>
            )}
          </span>
        );
      },
    })),
  ];

  return (
    // La coque du tableau de bord, pas celle de la maquette : `Card
    // as="section"` + un `h2` en `font-heading`. C'est le motif de ses
    // quinze blocs, et une matrice qui s'en écarterait se lirait comme une
    // pièce rapportée.
    <Card as="section" aria-labelledby={titreId} className="gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={titreId} className="m-0 font-heading text-base font-semibold">
          Matrice d'habilitation
        </h2>
        <p className="m-0 text-sm text-muted-foreground">
          Accès aux fonctionnalités par profil utilisateur
        </p>
      </div>

      <Table
        // Masqué : le `h2` au-dessus dit déjà la même chose, et l'entendre
        // deux fois de suite n'apprend rien.
        caption="Accès aux fonctionnalités par profil utilisateur"
        captionHidden
        columns={colonnes}
        rows={FONCTIONNALITES}
        getRowKey={(f) => f.key}
        rowHeaderKey="label"
        density="compact"
      />

      {/* La légende n'existe QUE pour la version modifiable. Un interrupteur
          ne dit pas de lui-même ce que son état signifie ici ; une pastille
          qui porte le mot « Autorisé » n'a besoin d'aucune légende. */}
      {modifiable && (
        <p className="m-0 text-xs text-muted-foreground">
          Un interrupteur activé ouvre l'accès à la fonctionnalité pour ce
          profil. Les changements s'appliquent à la prochaine connexion.
        </p>
      )}
    </Card>
  );
}

// ─── Storybook ───────────────────────────────────────────────────────────────

/** Pose la marque sur la RACINE : une marque ne s'applique nulle part ailleurs. */
const surMarque = (marque: string) => (S: () => React.ReactElement) => {
  const Deco = () => {
    useEffect(() => {
      document.documentElement.setAttribute("data-brand", marque);
      return () => document.documentElement.removeAttribute("data-brand");
    }, []);
    return (
      <div className="min-w-0 max-w-5xl p-4">
        <S />
      </div>
    );
  };
  return <Deco />;
};

const meta = {
  title: "Assemblages/Matrice d'habilitation",
  component: MatriceHabilitation,
  parameters: { layout: "fullscreen" },
  args: { modifiable: true },
  decorators: [surMarque("adp")],
} satisfies Meta<typeof MatriceHabilitation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Modifiable: Story = {
  name: "Modifiable — marque ADP, thème clair",
  globals: { theme: "clair" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Chaque case porte SON nom, déduit de sa ligne et de sa colonne.
    await expect(
      c.getByRole("switch", { name: "Réponse aux avis pour Directeur" }),
    ).toBeInTheDocument();
    // Et il y en a bien vingt-quatre, tous distincts.
    //
    // On lit le nom par l'étiquette ASSOCIÉE, pas par `aria-label` : `Switch`
    // rend un vrai `<label for>`, et `getAttribute("aria-label")` rendait
    // `null` vingt-quatre fois — soit un seul nom distinct, et une assertion
    // qui mesurait mon erreur au lieu du composant.
    const noms = c
      .getAllByRole("switch")
      .map(
        (s) => (s as HTMLInputElement).labels?.[0]?.textContent?.trim() ?? "",
      );
    await expect(noms).toHaveLength(24);
    await expect(new Set(noms).size).toBe(24);
  },
};

export const LectureSeule: Story = {
  name: "Consultable — marque ADP, thème clair",
  args: { modifiable: false },
  globals: { theme: "clair" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Aucun interrupteur : ce qui ne se change pas ne se présente pas comme
    // un contrôle.
    await expect(c.queryAllByRole("switch")).toHaveLength(0);
    await expect(
      c.getByText("Réponse aux avis pour Directeur"),
    ).toBeInTheDocument();
  },
};
