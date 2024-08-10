import { ClassValue, clsx } from "clsx";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
 
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export {cn};