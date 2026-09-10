import { Fragment, useId, type ReactNode } from "react";
import { cn } from "@registry/aikoz/lib/utils";
import { NavItem, type NavItemProps } from "@registry/aikoz/nav-item/nav-item";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarNavEntry extends Omit<NavItemProps, "current"> {
  /** Identifiant de l'entrée, comparé à `current`. */
  id: string;
}

export interface SidebarNavGroup {
  /**
   * Intitulé du groupe. Il NOMME la liste par `aria-labelledby`, il n'ouvre
   * pas une section : un groupe sans nom n'est qu'un trait horizontal, et un
   * lecteur d'écran ne perçoit pas le trait.
   */
  label: string;
  labelHidden?: boolean;
  entries: SidebarNavEntry[];
}

export interface SidebarNavProps {
  /**
   * Nom de la barre — **obligatoire**. Une page comporte plusieurs `<nav>`
   * (barre latérale, fil d'Ariane, pied de page) ; sans nom distinct, un
   * lecteur d'écran les annonce toutes « navigation » et l'utilisateur ne
   * sait pas dans laquelle il vient d'atterrir.
   */
  label: string;
  /** Entrées à plat. Ignoré si `groups` est fourni. */
  entries?: SidebarNavEntry[];
  /** Entrées groupées sous des intitulés. */
  groups?: SidebarNavGroup[];
  /** `id` de l'entrée correspondant à la page affichée. */
  current?: string;
  /** En-tête de la barre : logo, sélecteur de compte. */
  header?: ReactNode;
  /** Pied de la barre : profil, déconnexion. */
  footer?: ReactNode;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Barre de navigation latérale — transposée du composant Figma `Sidebar`,
 * retenue par la décision 2 de l'inventaire.
 *
 * **Ce n'est pas un cousin de `ViewTabs`, et les deux ne se mutualisent pas.**
 * Cette barre navigue entre SECTIONS : elle change la route, donc elle rend
 * des liens dans un `<nav>`, avec `aria-current="page"` et une tabulation
 * lien après lien. `ViewTabs` échange un panneau à l'intérieur d'une page :
 * `role="tablist"`, `aria-selected`, flèches. Implémenter l'un avec la
 * sémantique de l'autre annonce à un lecteur d'écran un panneau qui va
 * s'échanger alors que la page entière est remplacée — c'est l'un des défauts
 * d'accessibilité les plus répandus. Ils partagent les tokens, pas le code.
 *
 * **Ce que ce composant ne fait pas, volontairement** : il ne gère ni le repli
 * en icônes, ni le passage en tiroir sur mobile. Les deux dépendent du gabarit
 * de page — de la largeur disponible, de ce qui occupe le reste de l'écran —
 * et non de la barre. Sur petit écran, l'appelant la monte dans un `Dialog`
 * en placement `right`, qui apporte déjà le piège de focus et le retour du
 * focus au déclencheur.
 */
export function SidebarNav({
  label,
  entries,
  groups,
  current,
  header,
  footer,
  className,
}: SidebarNavProps) {
  const uid = useId();
  const blocs: SidebarNavGroup[] =
    groups ?? (entries ? [{ label, labelHidden: true, entries }] : []);

  return (
    <nav
      aria-label={label}
      className={cn(
        "flex flex-col gap-4 w-full sm:w-60 shrink-0",
        "bg-[var(--nav-surface)] p-3",
        // `--border-strong` et non `--nav-border` : la surface de la barre ne
        // se détache de la page que de 1,09:1, c'est donc ce trait, et lui
        // seul, qui délimite la région. `--nav-border` reste réservé aux
        // séparations INTERNES, où la discrétion est voulue.
        "border-r border-[var(--border-strong)]",
        className
      )}
    >
      {header && <div className="px-1">{header}</div>}

      {blocs.map((bloc, i) => (
        <Fragment key={bloc.label}>
          {/* Le trait entre deux groupes est décoratif — il double l'intitulé,
              il ne le remplace pas. D'où `--nav-border`, discret et assumé. */}
          {i > 0 && <hr className="border-0 border-t border-[var(--nav-border)] m-0" />}
          <div className="flex flex-col gap-1">
            {/* Un `<span>`, pas un `<h2>` — même raison que l'absence de
                `CardTitle` dans `Card` : le niveau de titre dépend du plan de
                la PAGE, pas du composant. Un `h2` figé ici s'insérerait dans
                l'outline du document au même rang que les sections de
                contenu, et casserait la hiérarchie dès qu'une page en décide
                autrement. `aria-labelledby` donne au groupe son nom sans
                toucher au plan. */}
            <span
              id={`${uid}-groupe-${i}`}
              className={cn(
                "px-4 text-xs font-semibold uppercase tracking-wider text-[var(--nav-on-muted)]",
                bloc.labelHidden && "sr-only"
              )}
            >
              {bloc.label}
            </span>
            {/* `<ul>` : le nombre d'entrées est annoncé à l'entrée de la liste
                (« liste de 4 éléments »), ce qu'une suite de `<a>` ne dit pas. */}
            <ul
              aria-labelledby={`${uid}-groupe-${i}`}
              className="flex flex-col gap-0.5 list-none m-0 p-0"
            >
              {bloc.entries.map((e) => {
                const { id, ...reste } = e;
                return (
                  <li key={id}>
                    <NavItem {...reste} current={id === current} />
                  </li>
                );
              })}
            </ul>
          </div>
        </Fragment>
      ))}

      {footer && <div className="mt-auto px-1">{footer}</div>}
    </nav>
  );
}
