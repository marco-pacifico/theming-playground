import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-brand)] text-[var(--color-text-brand-foreground)] shadow hover:bg-[var(--color-bg-brand-hover)]",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-[var(--color-border-brand)] shadow-sm text-[var(--color-text-brand)] bg-white hover:bg-[var(--color-bg-brand-surface-1)] hover:text-accent-foreground",
        secondary:
          "bg-[var(--color-bg-brand-surface-1)] text-[var(--color-text-brand)] shadow-sm hover:bg-[var(--color-bg-brand-surface-2)]",
        ghost: "hover:bg-[var(--color-bg-brand-surface-1)] text-[var(--color-text-brand)]",
        link: "text-[var(--color-text-brand)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
Button.displayName = "Button";

export { Button, buttonVariants };
