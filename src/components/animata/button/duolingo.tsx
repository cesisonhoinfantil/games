import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";

const DuolingoVariants = cva(
  "box-border inline-block w-full h-full transform-gpu cursor-pointer touch-manipulation whitespace-nowrap rounded-lg border-b-4 border-solid border-transparent px-4 py-3 text-center text-sm font-bold uppercase leading-5 tracking-wider outline-none transition-colors duration-100 hover:brightness-110 active:border-b-0  active:bg-none disabled:cursor-auto",
  {
    variants: {
      variants: {
        default: "bg-sky-600 text-white",
        white: "bg-black/25 text-black",
        error: "bg-rose-700 text-white",
        success: "bg-lime-700/75 text-white rounded-2xl",
        outline: "bg-black",
      },
    },
    defaultVariants: {
      variants: "default",
    },
  }
);

const ShadowVariant = cva(
  "absolute inset-0 -z-10 rounded-lg border-b-4 border-solid border-transparent",
  {
    variants: {
      variants: {
        default: "bg-sky-500",
        white: "bg-white",
        error: "bg-red-600",
        success: "bg-lime-500 rounded-2xl",
        outline: "bg-[#74e1ff] border",
      },
    },
    defaultVariants: {
      variants: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof DuolingoVariants> {
  children: ReactNode;
  className?: string;
  affect?: string;
  bg?: string;
}

export default function Button({
  children,
  className,
  bg,
  variants,
  affect,
  ...props
}: ButtonProps) {
  return (
    <div
      className={cn(
        "w-auto h-auto border-transparent active:border-t-4",
        className
      )}
    >
      <button
        className={cn(
          "disabled:opacity-65",
          DuolingoVariants({ variants, className: affect })
        )}
        role="button"
        {...props}
      >
        {children}
        <span className={cn(ShadowVariant({ variants, className: bg }))} />
      </button>
    </div>
  );
}
