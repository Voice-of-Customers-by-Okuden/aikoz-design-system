import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@registry/aikoz/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-full font-medium whitespace-nowrap",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--primary)] text-[var(--primary-foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--primary),transparent_10%)] active:bg-[color-mix(in_oklch,var(--primary),transparent_20%)]",
        ],
        secondary: [
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--secondary),transparent_10%)] active:bg-[color-mix(in_oklch,var(--secondary),transparent_20%)]",
        ],
        outline: [
          "border border-[var(--border)] bg-transparent text-[var(--foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--accent),transparent_88%)] active:bg-[color-mix(in_oklch,var(--accent),transparent_80%)]",
        ],
        ghost: [
          "bg-transparent text-[var(--foreground)]",
          "hover:bg-[color-mix(in_oklch,var(--accent),transparent_88%)] active:bg-[color-mix(in_oklch,var(--accent),transparent_80%)]",
        ],
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
