import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

const StatusVariants = cva(
  "absolute w-full p-4 pb-24 bottom-0 after:absolute after:left-0 after:h-[140%] after: after:w-full",
  {
    variants: {
      variant: {
        success: "bg-lime-300 after:bg-lime-300 text-lime-700",
        error: "bg-rose-300 after:bg-rose-300 text-red-600",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof StatusVariants> {
  children?: ReactNode;
}

export function Status({
  // children = "Parabéns você acertou!",
  variant,
  className,
  ...props
}: StatusProps) {
  return (
    <div className={cn(StatusVariants({ variant, className }))} {...props}>
      <h1 className="text-2xl tracking-tight font-bold">
        {variant == "success"
          ? "Parabéns você acertou!"
          : "Tenha mais atenção..."}
      </h1>
    </div>
  );
}
