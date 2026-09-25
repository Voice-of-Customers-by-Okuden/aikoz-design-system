import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

  // ── Dire qu'il reste quelque chose à voir ─────────────────────────────
  //
  // Une liste coupée net par le bord du pied ne dit pas qu'elle continue :
  // rien ne distingue « voilà tout » de « il y en a vingt-cinq de plus ».
  //
  // Deux canaux, et aucun n'est permanent : le fondu ET la barre de
  // défilement n'apparaissent que si quelque chose est réellement masqué.
  // Un fondu posé en dur serait pire que rien — il promettrait du contenu
  // absent, et on apprendrait à ne plus le croire.
  const zone = useRef<HTMLDivElement>(null);
  const [debord, setDebord] = useState<"non" | "bas" | "haut" | "deux">("non");

  const mesurer = useCallback(() => {
    const e = zone.current;
    if (!e) return;
    // 1 px de tolérance : les hauteurs de défilement sont fractionnaires, et
    // un `scrollTop` de 0,5 px suffirait sinon à allumer le fondu du haut.
    const haut = e.scrollTop > 1;
    const bas = e.scrollTop + e.clientHeight < e.scrollHeight - 1;
    setDebord(haut && bas ? "deux" : haut ? "haut" : bas ? "bas" : "non");
  }, []);

  useEffect(() => {
    const e = zone.current;
    if (!e) return;
    mesurer();
    e.addEventListener("scroll", mesurer, { passive: true });
    // La hauteur disponible change sans qu'on défile : fenêtre
    // redimensionnée, liste filtrée, groupe ajouté. Sans l'observateur, le
    // fondu resterait allumé sur une liste devenue courte.
    const ro = new ResizeObserver(mesurer);
    ro.observe(e);
    for (const enfant of Array.from(e.children)) ro.observe(enfant);
    return () => {
      e.removeEventListener("scroll", mesurer);
      ro.disconnect();
    };
  }, [mesurer, blocs.length, current]);

  // ── Deux effets, et le second fait le travail ─────────────────────────
  //
  // Le MASQUE estompe l'encre au bord. Il ne suffit pas, et c'est mesurable :
  // il n'agit que là où il y a de l'encre. Quand la liste se coupe sur un
  // blanc — entre deux entrées, sous un intitulé de groupe — il n'y a rien à
  // estomper et le bord reste net. C'est le cas de la capture d'Alice.
  //
  // L'OMBRE, elle, est peinte sur la surface : elle se voit que le bord
  // tombe sur du texte ou sur du vide. C'est elle qui porte le signal ; le
  // masque ne fait plus qu'adoucir la coupure du texte.
  //
  // La barre de défilement ne peut pas tenir ce rôle : mesurée ici, elle est
  // en survol et occupe 0 px — `scrollbar-width: thin` et `scrollbar-color`
  // ne la rendent pas permanente sur cette plateforme. Elle reste un canal
  // d'appoint, pas le canal principal.
  const FONDU = "transparent 0, #000 2rem, #000 calc(100% - 2rem), transparent 100%";
  const masque =
    debord === "deux"
      ? `linear-gradient(to bottom, ${FONDU})`
      : debord === "bas"
        ? "linear-gradient(to bottom, #000 calc(100% - 2rem), transparent 100%)"
        : debord === "haut"
          ? "linear-gradient(to bottom, transparent 0, #000 2rem)"
          : undefined;

  // ── Un DÉGRADÉ DE FOND, et pas une ombre portée ───────────────────────
  //
  // `box-shadow: inset` était la solution évidente et elle avait deux
  // défauts visibles, tous deux relevés par Alice.
  //
  // Elle déborde sur les CÔTÉS : une ombre intérieure se dessine sur les
  // quatre bords, et un flou de 12 px pour un étalement de -10 la fait
  // réapparaître le long des montants. Mesuré :
  // `0px -10px 12px -10px inset` peint aussi à gauche et à droite.
  //
  // Et sa bande DOUBLE le trait du pied : deux séparateurs à quelques pixels
  // l'un de l'autre, là où il n'y a qu'une frontière.
  //
  // Un dégradé de fond n'a pas de côtés — il s'arrête exactement où on le
  // dit — et il se fond dans le trait du pied au lieu de lutter avec lui.
  // Il est peint sur l'enveloppe ; la zone défilante étant transparente, il
  // se voit à travers, y compris là où la liste se coupe sur du blanc. C'est
  // toute la différence avec le masque, qui n'agit que sur l'encre.
  //
  // Fait de l'encre de la barre diluée : `--nav-on` vaut l'encre de marque
  // en clair et le blanc en sombre, donc le dégradé fonce sur fond clair et
  // éclaircit sur fond sombre, sans valeur à maintenir par thème.
  const ENCRE = "color-mix(in oklch, var(--nav-on), transparent 86%)";
  const VERS_HAUT = `linear-gradient(to top, ${ENCRE}, transparent 1.75rem)`;
  const VERS_BAS = `linear-gradient(to bottom, ${ENCRE}, transparent 1.75rem)`;
  const degrade =
    debord === "deux"
      ? `${VERS_BAS}, ${VERS_HAUT}`
      : debord === "bas"
        ? VERS_HAUT
        : debord === "haut"
          ? VERS_BAS
          : undefined;

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
      {/* Deux éléments, et c'est obligatoire.
      
          `mask-image` découpe TOUT le rendu de l'élément, fond compris :
          posés sur le même nœud, le masque effaçait le dégradé exactement là
          où il devait se voir. C'est ce qui rendait l'effet imperceptible, et
          aucune quantité d'opacité n'y aurait changé quoi que ce soit.
      
          Le dégradé va donc sur l'enveloppe, qui n'est pas masquée ; le
          masque reste sur la zone défilante, où il doit être — posé sur le
          contenu, il défilerait avec lui. */}
      <div
        style={degrade ? { backgroundImage: degrade } : undefined}
        className="flex min-h-0 flex-1 flex-col"
      >
      <div
        ref={zone}
        data-debord={debord}
        style={masque ? { maskImage: masque, WebkitMaskImage: masque } : undefined}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto",
          // La barre de défilement, canal d'appoint : fine, dans le trait de
          // la barre. Mesurée sur cette plateforme, elle est en survol et
          // n'occupe aucune largeur — elle ne peut donc pas porter le signal
          // à elle seule.
          "[scrollbar-width:thin] [scrollbar-color:var(--nav-border)_transparent]"
        )}
      >
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
            // Pas de `border-t` : le fond du pied suffit à le délimiter, et
            // un trait sous le dégradé faisait DEUX séparateurs à quelques
            // pixels l'un de l'autre là où il n'y a qu'une frontière.
            "bg-[var(--nav-surface-sunken)]"
          )}
        >
          {footer}
        </div>
      )}
    </nav>
  );
}
