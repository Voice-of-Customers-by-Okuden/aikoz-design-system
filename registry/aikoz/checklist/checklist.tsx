import { useId, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@registry/aikoz/lib/utils";
import { ProgressBar } from "@registry/aikoz/progress-bar/progress-bar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChecklistTask {
  id: string;
  /** Ce qu'il y a à faire. Devient un titre du document. */
  title: string;
  done?: boolean;
  /** Effort annoncé — « 3 min ». Une promesse, donc elle engage. */
  effort?: string;
  /**
   * Avancement PROPRE à la tâche — « 0/2 sections ». Distinct de
   * l'avancement de la liste, qui compte les tâches terminées.
   */
  progress?: { done: number; total: number };
  /**
   * Détail révélé au dépliement. **Son absence n'est pas un oubli** : une
   * tâche sans détail ne se déplie pas, et son intitulé devient alors la
   * totalité de ce qu'il y a à savoir. C'est le cas de la moitié des usages.
   */
  detail?: ReactNode;
  action?: { label: string; onClick?: () => void };
}

export interface ChecklistProps {
  /** Nom de la liste. Porté par la région, et affiché si `labelHidden` est faux. */
  label: string;
  labelHidden?: boolean;
  tasks: ChecklistTask[];
  /**
   * Niveau de titre des intitulés — même raison que dans `Accordion` : ils
   * forment le plan de la section et un lecteur d'écran saute de l'un à
   * l'autre. Le bon niveau est un cran sous le titre qui précède la liste.
   */
  headingLevel?: 2 | 3 | 4 | 5;
  /** Tâche dépliée au montage. */
  defaultOpen?: string;
  /** Mot qui qualifie l'avancement — « complétées », « sections ». */
  unit?: string;
  className?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Une liste de choses à accomplir, et ce qu'il en reste.
 *
 * **Pourquoi pas `Accordion`.** L'accordéon prend un intitulé qui est une
 * CHAÎNE, parce que son intitulé est du texte. Ici il porte un état, une
 * durée et parfois un compteur — et surtout, la moitié des usages ne déplient
 * rien du tout. Réutiliser l'accordéon aurait obligé à faire passer tout ça
 * dans son titre, c'est-à-dire à défaire ce qui fait sa qualité.
 *
 * **L'avancement n'est pas décoratif.** Il est écrit en toutes lettres
 * (« 2 / 5 complétées ») ET rendu par `ProgressBar`, qui porte le rôle
 * `meter`. Les deux disent la même chose : la barre seule ne se lit pas au
 * lecteur d'écran avec sa fraction, le texte seul ne se voit pas d'un coup
 * d'œil.
 *
 * **L'état d'une tâche ne tient pas à la couleur.** La pastille terminée
 * porte une coche, et un texte masqué dit « terminée » — un anneau vert et un
 * anneau gris ne se distinguent pas pour tout le monde.
 */
export function Checklist({
  label,
  labelHidden = false,
  tasks,
  headingLevel = 3,
  defaultOpen,
  unit = "complétées",
  className,
}: ChecklistProps) {
  const base = useId();
  const [ouverte, setOuverte] = useState<string | undefined>(defaultOpen);
  const Titre = `h${headingLevel}` as ElementType;

  const faites = tasks.filter((t) => t.done).length;
  const idLabel = `${base}-label`;

  return (
    <section
      aria-labelledby={idLabel}
      className={cn(
        "flex flex-col rounded-[var(--radius)] border border-border bg-card",
        className,
      )}
    >
      <header className="flex flex-col gap-2 border-b border-border p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span
            id={idLabel}
            className={cn("text-sm font-semibold", labelHidden && "sr-only")}
          >
            {label}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {faites} / {tasks.length} {unit}
          </span>
        </div>
        {/* `label` de `ProgressBar` est un nom ACCESSIBLE, pas un libellé
            visible : la fraction est déjà écrite au-dessus, la barre n'a
            donc rien à répéter à l'écran — seulement à l'oreille. */}
        <ProgressBar
          label={`${label} — avancement`}
          value={faites}
          max={tasks.length}
          valueText={`${faites} sur ${tasks.length} ${unit}`}
        />
      </header>

      <ul className="m-0 flex list-none flex-col p-0">
        {tasks.map((t) => {
          const idPanneau = `${base}-${t.id}`;
          const depliable = Boolean(t.detail || t.action);
          const ouvert = ouverte === t.id;
          return (
            <li key={t.id} className="border-b border-border last:border-b-0">
              <div className="flex items-center gap-3 px-4 py-3">
                <Pastille done={t.done} />
                <Titre className="m-0 min-w-0 flex-1 text-sm font-medium">
                  {depliable ? (
                    <button
                      type="button"
                      aria-expanded={ouvert}
                      aria-controls={idPanneau}
                      onClick={() => setOuverte(ouvert ? undefined : t.id)}
                      // `min-h-6` : 24 px, le plancher du critère WCAG 2.2
                      // AA 2.5.8. Sans lui le bouton épouse sa ligne de texte
                      // et tombe à 21 px — mesuré, et refusé par le garde-fou
                      // de cibles du design system.
                      className="flex min-h-6 w-full items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      {t.title}
                    </button>
                  ) : (
                    t.title
                  )}
                </Titre>
                {t.effort && (
                  <span className="shrink-0 text-xs text-muted-foreground">{t.effort}</span>
                )}
                {t.progress && (
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {t.progress.done}/{t.progress.total}
                  </span>
                )}
              </div>
              {depliable && (
                <div id={idPanneau} hidden={!ouvert} className="flex flex-col gap-3 px-4 pb-4 pl-12">
                  {t.detail && (
                    <div className="text-sm text-muted-foreground">{t.detail}</div>
                  )}
                  {t.action && (
                    <button
                      type="button"
                      onClick={t.action.onClick}
                      className={cn(
                        "self-start rounded-[var(--radius-pill)] bg-[var(--primary)] px-4 py-2",
                        "text-sm font-semibold text-[var(--primary-foreground)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                      )}
                    >
                      {t.action.label}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * L'état d'une tâche. La coche porte le sens, la couleur ne fait que le
 * répéter — et le texte masqué le dit pour qui n'a ni l'une ni l'autre.
 */
function Pastille({ done }: { done?: boolean }) {
  return (
    <span className="shrink-0">
      <span
        className={cn(
          "grid h-5 w-5 place-items-center rounded-full border",
          done
            ? "border-[var(--success-fill-edge)] bg-[var(--success-fill)]"
            : "border-[var(--border-strong)] bg-transparent",
        )}
      >
        {done && (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3"
               fill="none" stroke="var(--on-inverse)" strokeWidth={3}
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className="sr-only">{done ? "terminée" : "à faire"}</span>
    </span>
  );
}
