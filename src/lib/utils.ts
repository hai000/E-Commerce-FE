import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {GET_METHOD, HOST_API} from "@/lib/constants";
import {ILogin} from "@/lib/response/login";
import type {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
export const generateHeaderAccessToken = (request:ILogin) =>{
  return {
    'Authorization': `Bearer ${request.accessToken}`,
  };
}
export const getILogin = (cook:ReadonlyRequestCookies) =>{
  return {
    accessToken: cook.get('accessToken')?.value,
    refreshToken: cook.get('refreshToken')?.value
  }

}
export async function callApiToArray<T>({ url, method, data, headers }: ApiCallOptions): Promise<T[] | string> {
  try {
    const options: RequestInit = {
      method: method || GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${HOST_API}${url}`,options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error:', response.status, errorText);
      return []
    }
    const result = await response.json();
    return result.data as T[] | string;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
export interface ApiCallOptions {
  url: string;
  method?: string;
  data?: any;
  headers?: Record<string, string>; // Hoặc kiểu khác nếu cần
}
export async function callApiGetStatus({url, method, data, headers}: ApiCallOptions): Promise<boolean> {
  try {
    const options: RequestInit = {
      method: method || GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
        ...(headers ? headers : {})
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${HOST_API}${url}`,options);
    const result = await response.json();
    // console.log(result)
    return result.success;
  } catch (error) {
    return false;
  }
}
export async function callApiToObject<T>({ url, method, data, headers }: ApiCallOptions): Promise<T|string> {
  try {
    const options: RequestInit = {
      method: method || GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
        ...(headers ? headers : {})
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`${HOST_API}${url}`,options);
    const result = await response.json();
    return result.data as T | string;
  } catch (error) {
    return error as string;
  }
}