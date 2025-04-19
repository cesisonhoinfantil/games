import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function HeaderContainer({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full px-6 py-1 shadow-md bg-[#3BA7C5] border-b-2 border-white text-white font-bold text-2xl flex justify-between items-center",
        className
      )}
    >
      {children}
    </div>
  );
}
