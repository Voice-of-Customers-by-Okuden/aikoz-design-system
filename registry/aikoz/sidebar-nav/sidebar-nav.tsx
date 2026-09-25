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
  /**
   * Ce qui s'affiche quand `entries` est vide — typiquement après un filtre
   * qui ne trouve rien.
   *
   * Sans lui, un groupe filtré à zéro rend un `<ul>` vide : l'intitulé reste,
   * et rien en dessous. Qui voit l'écran conclut à un bug d'affichage ; qui
   * ne le voit pas n'entend « liste de 0 éléments » que s'il entre dans la
   * liste. Un groupe vide doit dire pourquoi il est vide.
   */
  empty?: ReactNode;
  /**
   * `compact` pour un groupe d'historique — cf. `NavItem`. La navigation
   * principale reste en `default` : c'est ce qui fait la hiérarchie.
   */
  density?: "default" | "compact";
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
  /**
   * `id` de l'entrée qui CONTIENT la page affichée — la section, quand la
   * barre liste aussi son contenu. Cf. `NavItem.ancestor`.
   */
  ancestor?: string;
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
  ancestor,
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
        // `min-h-0` : sans lui, un conteneur flex refuse de descendre sous la
        // taille de son contenu, et la zone défilante ci-dessous ne défile
        // jamais. C'est la moitié de la règle que tout le monde oublie.
        "min-h-0",
        "bg-[var(--nav-surface)] p-3",
        // `--border`, et non `--border-strong`.
        //
        // Le choix précédent reposait sur une MAUVAISE MÉTRIQUE — la même que
        // celle déjà corrigée sur la palette des graphiques. Il disait : « la
        // surface de la barre ne se détache de la page que de 1,09:1, c'est
        // donc ce trait qui délimite la région ». Mais 1,09 est un ratio WCAG,
        // fait pour poser du texte sur un fond, pas pour comparer deux
        // surfaces voisines — près du noir il s'écrase quelle que soit la
        // différence réelle.
        //
        // Mesurée à la bonne échelle, l'écart perceptuel entre la barre et la
        // page vaut ΔE 0,030 en clair et 0,082 en sombre : la surface fait
        // déjà une partie du travail. Et le trait fort pesait ΔE 0,43 contre
        // la barre — trois fois et demie la bordure standard. D'où l'effet de
        // trait posé par-dessus le dessin.
        //
        // `--border` donne ΔE 0,12, encore six fois le seuil où deux tons se
        // distinguent. Le séparateur de région n'est ni un composant
        // d'interface ni un objet graphique nécessaire à la compréhension :
        // WCAG 1.4.11 ne lui impose pas 3:1, c'est le landmark `nav` et ses
        // liens qui identifient la région.
        "border-r border-border",
        className
      )}
    >
      {header && <div className="shrink-0 px-1">{header}</div>}

      {/* ── Seuls les GROUPES défilent ────────────────────────────────────
      
          L'en-tête et le pied restent en place. Mesuré avant correction, sur
          une fenêtre de 760 px et avec cinq conversations seulement : la
          barre faisait 880 px et le bas de son pied tombait à 868 px, soit
          108 px sous le pli. Le sélecteur de POI, les paramètres et la
          déconnexion devenaient inatteignables — et comme la zone de
          contenu a son propre défilement, la page n'en avait pas pour les
          rattraper.
      
          `mt-auto` sur le pied ne suffisait pas : il colle le pied au bas du
          CONTENU, pas au bas de l'écran, et un contenu plus grand que
          l'écran pousse simplement le pied plus bas.
      
          Sans hauteur imposée par l'appelant, ce conteneur ne fait rien :
          `flex-1` n'a rien à partager et `overflow-y-auto` rien à couper. */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
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
            {bloc.entries.length === 0 && bloc.empty ? (
              <div className="px-4 py-2 text-sm text-[var(--nav-on-muted)]">
                {bloc.empty}
              </div>
            ) : (
              <ul
                aria-labelledby={`${uid}-groupe-${i}`}
                className="flex flex-col gap-0.5 list-none m-0 p-0"
              >
                {bloc.entries.map((e) => {
                  const { id, ...reste } = e;
                  return (
                    <li key={id}>
                      <NavItem
                        {...reste}
                        density={reste.density ?? bloc.density}
                        current={id === current}
                        ancestor={id !== current && id === ancestor}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Fragment>
      ))}
      </div>

      {/* ── Le pied est une RÉGION, pas la suite de la liste ───────────────
      
          Il porte le compte, le POI et la langue — pas de la navigation. Sur
          le même fond que la barre, il se lisait comme trois entrées de menu
          de plus, collées en bas.
      
          Un rôle dédié, `--nav-surface-sunken`, et pas `--muted` :
          celui-ci vaut EXACTEMENT `--nav-surface-active` en clair, c'est-à-
          dire le fond de l'entrée courante. Le pied aurait porté la couleur
          qui veut dire « vous êtes ici », et quatre éléments de la barre se
          seraient annoncés actifs en même temps.
      
          Il se place de l'autre côté de la barre que l'état actif : en clair
          blanc / gris de page / gris soutenu, en sombre l'actif s'éclaircit
          et le pied s'assombrit. L'actif reste le plus marqué des trois.
      
          `-mx-3 -mb-3 px-4 pb-3` : la région va d'un bord à l'autre de la
          barre. Un fond qui s'arrête au rembourrage fait un bloc flottant, et
          un bloc flottant dans une barre ressemble à une carte qu'on aurait
          oublié de finir. */}
      {footer && (
        <div
          className={cn(
            "mt-auto shrink-0",
            "-mx-3 -mb-3 px-4 pb-3 pt-3",
            "border-t border-[var(--nav-border)] bg-[var(--nav-surface-sunken)]"
          )}
        >
          {footer}
        </div>
      )}
    </nav>
  );
}
