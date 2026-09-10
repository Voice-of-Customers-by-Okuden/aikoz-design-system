import { useId, type ReactNode } from "react";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteFooterLink {
  label: string;
  href: string;
  /** Ouvre dans un nouvel onglet. La mention est ajoutée au nom du lien. */
  external?: boolean;
}

export interface SiteFooterGroup {
  /** Intitulé de colonne. Nomme la liste, sans entrer dans le plan du document. */
  label: string;
  links: SiteFooterLink[];
}

export interface SiteFooterProps {
  groups: SiteFooterGroup[];
  /** Marque et pitch, en tête de pied de page. */
  brand?: ReactNode;
  tagline?: string;
  /** Mentions légales, RGPD, cookies — la dernière ligne. */
  legal?: SiteFooterLink[];
  /** Détenteur du copyright. L'année est calculée. */
  copyrightHolder?: string;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Pied de page de site.
 *
 * Un `<footer>` en fin de document est un point de repère `contentinfo` sans
 * qu'on ait à l'écrire — à condition qu'il ne soit imbriqué dans aucun
 * `<article>` ni `<section>`. C'est une des rares balises où le placement
 * change le rôle : posé dans une carte, ce même `<footer>` ne serait plus un
 * repère de page.
 *
 * **Les intitulés de colonne sont des `<span>`, pas des titres.** Ils nomment
 * leur liste par `aria-labelledby` et n'entrent pas dans le plan du document
 * — même raison que dans `SidebarNav` : le niveau dépend de la page, et un
 * pied de page ne devrait pas peupler l'outline de cinq titres qui ne sont
 * pas du contenu.
 *
 * **Un lien qui ouvre un nouvel onglet le dit.** La mention est dans le nom
 * accessible, pas seulement dans une icône : un changement de contexte non
 * annoncé désoriente, et c'est particulièrement vrai en lecture d'écran où
 * rien ne signale qu'on a changé de fenêtre.
 */
export function SiteFooter({
  groups,
  brand = "Aikoz",
  tagline,
  legal,
  copyrightHolder = "Okuden",
  className,
}: SiteFooterProps) {
  const uid = useId();
  const annee = new Date().getFullYear();

  const rendreLien = (l: SiteFooterLink) => (
    <li key={l.href + l.label}>
      <a
        href={l.href}
        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "inline-flex items-center min-h-11 text-sm no-underline",
          "text-[var(--nav-on-muted)] hover:text-[var(--nav-on)] hover:underline underline-offset-4",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-surface)]",
          "rounded-[var(--radius)]"
        )}
      >
        {l.label}
        {l.external && <span className="sr-only"> (nouvel onglet)</span>}
      </a>
    </li>
  );

  return (
    <footer
      className={cn(
        "w-full bg-[var(--nav-surface)] border-t border-[var(--border-strong)]",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-[var(--nav-on)]">{brand}</span>
            {tagline && (
              <p className="m-0 max-w-xs text-sm text-[var(--nav-on-muted)]">{tagline}</p>
            )}
          </div>

          {groups.map((g, i) => (
            <div key={g.label} className="flex flex-col gap-1">
              <span
                id={`${uid}-g${i}`}
                className="text-xs font-semibold uppercase tracking-wider text-[var(--nav-on-muted)] mb-1"
              >
                {g.label}
              </span>
              <ul
                aria-labelledby={`${uid}-g${i}`}
                className="flex flex-col list-none m-0 p-0"
              >
                {g.links.map(rendreLien)}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--nav-border)]">
          <p className="m-0 text-xs text-[var(--nav-on-muted)]">
            © {annee} {copyrightHolder}. Tous droits réservés.
          </p>
          {legal && legal.length > 0 && (
            <nav aria-label="Mentions légales">
              <ul className="flex flex-wrap items-center gap-x-5 list-none m-0 p-0">
                {legal.map(rendreLien)}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
