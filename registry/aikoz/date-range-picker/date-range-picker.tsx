import { useEffect, useId, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRangePreset {
  value: string;
  label: string;
}

export interface DateRange {
  /** Identifiant du préréglage retenu, ou `"custom"` pour une plage saisie. */
  preset: string;
  /** Bornes au format ISO `AAAA-MM-JJ`. Renseignées seulement si `custom`. */
  from?: string;
  to?: string;
}

export interface DateRangePickerProps {
  /**
   * Nom du filtre — **obligatoire**. Un tableau de bord en porte souvent
   * plusieurs (période d'analyse, période de comparaison) ; sans nom distinct
   * ils s'annoncent tous pareil.
   */
  label: string;
  /** Masque le libellé. Le déclencheur garde son nom accessible complet. */
  labelHidden?: boolean;
  presets?: DateRangePreset[];
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  /** Borne haute admise pour la saisie libre. Aujourd'hui par défaut. */
  max?: string;
  /** Borne basse admise. */
  min?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const PRESETS_DEFAUT: DateRangePreset[] = [
  { value: "7j", label: "7 derniers jours" },
  { value: "30j", label: "30 derniers jours" },
  { value: "90j", label: "90 derniers jours" },
  { value: "12m", label: "12 derniers mois" },
];

const PERSONNALISE = "custom";

function aujourdhui() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * `2026-03-12` → `12 mars 2026`. `Intl` fait le gros du travail, à une
 * exception près qu'il ne couvre pas : en français le premier du mois
 * s'écrit **1er**, pas « 1 ». `Intl` rend « 1 janvier », que personne
 * n'écrit ni ne lit à voix haute ainsi — y compris un lecteur d'écran.
 */
function enClair(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  const rendu = d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return d.getDate() === 1 ? rendu.replace(/^1 /, "1er ") : rendu;
}

function enonce(range: DateRange, presets: DateRangePreset[]) {
  if (range.preset !== PERSONNALISE) {
    return presets.find((p) => p.value === range.preset)?.label ?? range.preset;
  }
  if (range.from && range.to) return `Du ${enClair(range.from)} au ${enClair(range.to)}`;
  if (range.from) return `À partir du ${enClair(range.from)}`;
  if (range.to) return `Jusqu'au ${enClair(range.to)}`;
  return "Période personnalisée";
}

// ─── Composant ────────────────────────────────────────────────────────────────

/**
 * Sélecteur de période — transposé de la pastille « 30 derniers jours » de la
 * barre haute des maquettes.
 *
 * **Il n'y a pas de calendrier ici, et c'est délibéré.** Sur un tableau de
 * bord, la quasi-totalité des sélections tombe sur un préréglage ; la plage
 * saisie est le cas rare. Un calendrier en grille ARIA, fait correctement,
 * demande un clavier complet (flèches dans les deux dimensions, PageUp/Down
 * pour les mois, Début/Fin pour la semaine), une gestion de la sélection en
 * deux temps, et une annonce par région live à chaque déplacement — beaucoup
 * de surface pour le cas rare, et beaucoup d'occasions de le rater. Les deux
 * champs de saisie sont **natifs** : ils ouvrent le sélecteur du système sur
 * mobile, connaissent déjà le format local, et sont accessibles sans qu'on
 * écrive une ligne. Si un calendrier visuel devient nécessaire, il viendra
 * comme une variante, pas comme une réécriture.
 *
 * Les préréglages sont de **vrais boutons radio** : c'est un choix unique
 * parmi plusieurs, ce que les flèches parcourent nativement, et ce qu'un
 * lecteur d'écran annonce « 2 sur 5 ». Une liste de boutons ne dirait ni
 * qu'ils s'excluent, ni combien il y en a.
 *
 * **Attention au registre** : le panneau est rendu dans un `Portal`. Il hérite
 * du registre et du thème posés sur `<html>`, pas d'un `data-register` posé
 * sur un sous-arbre.
 */
export function DateRangePicker({
  label,
  labelHidden = false,
  presets = PRESETS_DEFAUT,
  value,
  defaultValue,
  onValueChange,
  max,
  min,
  disabled,
  className,
  wrapperClassName,
}: DateRangePickerProps) {
  const uid = useId();
  const [interne, setInterne] = useState<DateRange>(
    defaultValue ?? { preset: presets[0]?.value ?? PERSONNALISE }
  );
  const courant = value ?? interne;
  const [ouvert, setOuvert] = useState(false);

  // Brouillon de la saisie libre : les bornes ne sont remontées qu'une fois
  // cohérentes. Sans ce tampon, taper « 2026 » dans l'année déclencherait un
  // rechargement à chaque frappe, sur une date de l'an 2 puis 20 puis 202.
  const [depuis, setDepuis] = useState(courant.from ?? "");
  const [jusqua, setJusqua] = useState(courant.to ?? "");

  useEffect(() => {
    if (!ouvert) return;
    setDepuis(courant.from ?? "");
    setJusqua(courant.to ?? "");
    // À l'ouverture seulement : on repart de la valeur en vigueur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert]);

  const borneMax = max ?? aujourdhui();
  const inverse = !!(depuis && jusqua && depuis > jusqua);
  const erreur = inverse
    ? "La date de fin doit être postérieure à la date de début. Inversez les deux bornes."
    : undefined;

  function appliquer(next: DateRange) {
    if (value === undefined) setInterne(next);
    onValueChange?.(next);
  }

  function choisirPreset(v: string) {
    if (v === PERSONNALISE) {
      appliquer({ preset: PERSONNALISE, from: depuis || undefined, to: jusqua || undefined });
      return;
    }
    appliquer({ preset: v });
    setOuvert(false);
  }

  function validerPlage() {
    if (inverse || (!depuis && !jusqua)) return;
    appliquer({ preset: PERSONNALISE, from: depuis || undefined, to: jusqua || undefined });
    setOuvert(false);
  }

  const resume = enonce(courant, presets);

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      <span
        id={`${uid}-label`}
        className={cn("text-sm font-medium text-foreground", labelHidden && "sr-only")}
      >
        {label}
      </span>

      <PopoverPrimitive.Root open={ouvert} onOpenChange={setOuvert}>
        <PopoverPrimitive.Trigger
          disabled={disabled}
          // Le nom du déclencheur porte le libellé ET la valeur : « Période
          // d'analyse, 30 derniers jours ». Sans la valeur, un utilisateur de
          // lecteur d'écran devrait ouvrir le panneau pour savoir ce qui est
          // sélectionné.
          aria-labelledby={`${uid}-label ${uid}-trigger`}
          id={`${uid}-trigger`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full min-h-11 px-4 py-2",
            "border border-[var(--input)] bg-[var(--card)] text-foreground",
            "text-sm font-medium transition-colors text-left",
            "hover:border-[var(--border-strong)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 shrink-0 opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <rect x="2" y="3.5" width="12" height="10" rx="2" />
            <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
          </svg>
          {resume}
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            // Radix apporte ici ce qu'on rate presque toujours à la main :
            // Échap referme, le clic extérieur aussi, le focus entre dans le
            // panneau à l'ouverture et **revient au déclencheur** à la
            // fermeture.
            className={cn(
              "z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[var(--radius)] p-4",
              // Même raison que `Select` : le panneau flotte sans voile, sa
              // surface ne se détache de la page que de 1,09:1.
              "border border-[var(--border-strong)] bg-[var(--popover)]",
              "text-[var(--popover-foreground)] shadow-lg",
              "flex flex-col gap-4"
            )}
          >
            {/* Choix unique parmi plusieurs = boutons radio. Les flèches les
                parcourent nativement, et l'annonce dit « 2 sur 5 ». */}
            <fieldset className="m-0 p-0 border-0 flex flex-col gap-1">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 p-0">
                Périodes courantes
              </legend>
              {[...presets, { value: PERSONNALISE, label: "Période personnalisée" }].map(
                (p) => (
                  <label
                    key={p.value}
                    className={cn(
                      "flex items-center gap-3 min-h-10 px-2 rounded-[calc(var(--radius)-2px)]",
                      "text-sm cursor-pointer",
                      "hover:bg-[var(--surface-hover)]",
                      // Le voile de survol ne donne que 1,19:1 : c'est
                      // l'anneau, posé quand le radio a le focus, qui rend la
                      // ligne courante repérable au clavier (WCAG 2.4.7).
                      "has-[:focus-visible]:shadow-[inset_0_0_0_2px_var(--ring)]"
                    )}
                  >
                    <input
                      type="radio"
                      name={`${uid}-preset`}
                      value={p.value}
                      checked={courant.preset === p.value}
                      onChange={() => choisirPreset(p.value)}
                      className="size-4 shrink-0 accent-[var(--primary)]"
                    />
                    <span>{p.label}</span>
                  </label>
                )
              )}
            </fieldset>

            {courant.preset === PERSONNALISE && (
              <div className="flex flex-col gap-3 pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`${uid}-from`}
                      className="text-xs font-medium text-foreground"
                    >
                      Du
                    </label>
                    <input
                      id={`${uid}-from`}
                      type="date"
                      value={depuis}
                      min={min}
                      max={borneMax}
                      autoComplete="off"
                      aria-invalid={inverse || undefined}
                      aria-describedby={erreur ? `${uid}-err` : undefined}
                      onChange={(e) => setDepuis(e.target.value)}
                      className={cn(
                        "min-h-11 rounded-[var(--radius)] border px-3 py-2 text-sm",
                        "bg-[var(--card)] text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                        inverse
                          ? "border-[var(--destructive-text)]"
                          : "border-[var(--input)]"
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`${uid}-to`}
                      className="text-xs font-medium text-foreground"
                    >
                      Au
                    </label>
                    <input
                      id={`${uid}-to`}
                      type="date"
                      value={jusqua}
                      min={depuis || min}
                      max={borneMax}
                      autoComplete="off"
                      aria-invalid={inverse || undefined}
                      aria-describedby={erreur ? `${uid}-err` : undefined}
                      onChange={(e) => setJusqua(e.target.value)}
                      className={cn(
                        "min-h-11 rounded-[var(--radius)] border px-3 py-2 text-sm",
                        "bg-[var(--card)] text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                        inverse
                          ? "border-[var(--destructive-text)]"
                          : "border-[var(--input)]"
                      )}
                    />
                  </div>
                </div>

                {/* L'erreur nomme le problème ET dit quoi faire. `role="alert"`
                    parce qu'elle apparaît après coup. */}
                {erreur && (
                  <p
                    id={`${uid}-err`}
                    role="alert"
                    className="text-xs text-[var(--destructive-text)] m-0"
                  >
                    {erreur}
                  </p>
                )}

                <button
                  type="button"
                  onClick={validerPlage}
                  disabled={inverse || (!depuis && !jusqua)}
                  className={cn(
                    "self-end inline-flex items-center justify-center min-h-11 px-6 rounded-full",
                    "bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium",
                    "hover:bg-[color-mix(in_oklch,var(--primary),transparent_10%)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--popover)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  )}
                >
                  Appliquer
                </button>
              </div>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {/* La période retenue est annoncée poliment : le changement se fait dans
          un panneau qui se referme, et rien d'autre ne dirait ce qui a pris
          effet. `role="status"` n'interrompt pas la lecture en cours. */}
      <span role="status" aria-live="polite" className="sr-only">
        Période : {resume}
      </span>
    </div>
  );
}

export { enClair as formaterDate, PERSONNALISE };
