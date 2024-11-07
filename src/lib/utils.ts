import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateKey = (pre: string) => {
  return `${pre}_${new Date().getTime()}`;
};

export function RandomIndex(arr: unknown[]) {
  return Math.floor(Math.random() * arr.length);
}
export function RandomItem<T extends unknown[]>(arr: T): T[number] {
  return arr[RandomIndex(arr)];
}
