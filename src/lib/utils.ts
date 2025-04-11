import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {HOST_API} from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const toSlug = (text: string): string =>
    text
        .toLowerCase()
        .replace(/[^\w\s-]+/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-')
export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

export const round2 = (num: number) =>
    Math.round((num + Number.EPSILON) * 100) / 100

export const generateId = () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')

export async function callApiToArray<T>(url:string): Promise<T[]> {
  try {
    const response = await fetch(`${HOST_API}${url}`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.data as T[];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
export async function callApiToObject<T>(url:string): Promise<T|null> {
  try {
    const response = await fetch(`${HOST_API}${url}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.data as T;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}