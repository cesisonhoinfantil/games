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

export function debounce(
  func: () => unknown,
  wait: number,
  immediate?: boolean
) {
  let timeout: NodeJS.Timeout | undefined;
  return function (this: unknown, ...args: []) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    clearTimeout(timeout);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(function () {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
}
