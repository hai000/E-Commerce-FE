import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {GET_METHOD, HOST_API} from "@/lib/constants";
import qs from 'query-string'
import {getProductsByTag} from "@/lib/api/product";
import {getLocale} from "next-intl/server";
import {Session} from "@/types/next-auth";

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


export async function getCardItemFromTagToArray(tag_name: string): Promise<{
    name: string;
    image: string;
    href: string;
}[]> {
    const products = await getProductsByTag(tag_name);
    if (!products || typeof products === 'string') {
        return [];
    }
    return products.data.slice(0, 4).map((product) => ({
        name: product.name,
        image: product.images[0]?.imagePath,
        href: `/product/${product.id}`,
    }));
}

export function getImageUrl(imagePath: string | null): string {
    return imagePath ? `${HOST_API}${imagePath}` : '/images/imagenotfound.png'
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function formatNumber(number: number) {
    return NUMBER_FORMATTER.format(number)
}

export const round2 = (num: number) =>
    Math.round((num + Number.EPSILON) * 100) / 100

export const generateId = () =>
    Array.from({length: 24}, () => Math.floor(Math.random() * 10)).join('')
export const generateHeaderAccessToken = (session: Session) => {

    return {
        'Authorization': `Bearer ${session.accessToken}`,
    };
}
export const generateHeaderAccessTokenString = (accessToken: string) => {
    return {
        'Authorization': `Bearer ${accessToken}`,
    };
}

export async function callApiToArrayWithPage<T>({
                                                    url,
                                                    method,
                                                    data,
                                                    headers
                                                }: ApiCallOptions): Promise<ArrayWithPage<T>> {
    try {
        const local = await getLocale();
        const options: RequestInit = {
            method: method || GET_METHOD,
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': local,
                ...(headers ? headers : {})
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${HOST_API}${url}`, options);
        if (!response.ok) {
            return {
                page: 0,
                size: 0,
                totalItem: 0,
                data: [] as T[]
            } as ArrayWithPage<T>;
        }
        const result = await response.json();
        return result.data as ArrayWithPage<T>;
    } catch (error) {
        console.error('Error:', error);
        return {
            page: 0,
            size: 0,
            totalItem: 0,
            data: [] as T[]
        } as ArrayWithPage<T>;
    }
}

export async function callApiToArray<T>({url, method, data, headers}: ApiCallOptions): Promise<T[] | string> {
    try {
        const local = await getLocale();
        const options: RequestInit = {
            method: method || GET_METHOD,
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': local,
                ...(headers ? headers : {})
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${HOST_API}${url}`, options);
        if (!response.ok) {
            // const errorText = await response.text();
            // console.error('HTTP Error:', response.status, errorText);
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
    data?: unknown;
    headers?: Record<string, string>; // Hoặc kiểu khác nếu cần
}

export async function callApiGetStatus({url, method, data, headers}: ApiCallOptions): Promise<boolean> {
    try {
        const local = await getLocale();
        const options: RequestInit = {
            method: method || GET_METHOD,
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': local,
                ...(headers ? headers : {})
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${HOST_API}${url}`, options);
        const result = await response.json();
        // console.log(result)
        return result.success;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export async function callApiToAll<T>({url, method, data, headers}: ApiCallOptions) {
    try {
        const local = await getLocale();
        const options: RequestInit = {
            method: method || GET_METHOD,
            headers: {
                'Accept-Language': local,
                ...(headers ? headers : {})
            },
        };
        if (data instanceof FormData) {
            options.body = data;
        } else {
            // JSON object
            options.headers = {
                ...options.headers,
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${HOST_API}${url}`, options);
        const result = await response.json();
        return result as ResponseData<T>;
    } catch (error) {
        return {
            code: 500,
            success: false,
            data: error as T
        };
    }
}

export async function callApiToObject<T>({url, method, data, headers}: ApiCallOptions): Promise<T | string> {
    try {
        const local = await getLocale();
        const options: RequestInit = {
            method: method || GET_METHOD,
            headers: {
                'Accept-Language': local,
                'Content-Type': 'application/json',
                ...(headers ? headers : {})
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${HOST_API}${url}`, options);
        const result = await response.json();
        return result.data as T | string;
    } catch (error) {
        return error as string;
    }
}

export function isValidHexColor(code: string): boolean {
    return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(code);
}

export function formatId(id: string) {
    return `..${id.substring(id.length - 6)}`
}

export function calculateFutureDate(days: string | null) {
    const currentDate = new Date()
    if (typeof days === 'string') {
        const match = /\d+/.exec(days)
        if (match) {
            currentDate.setDate(currentDate.getDate() + (parseInt(match[0]) / 24))
            return currentDate
        }
    }
    return null

}

export function getMonthName(yearAndMonth: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [year, monthNumber] = yearAndMonth.split('-')
    const date = new Date()
    date.setMonth(parseInt(monthNumber) - 1)
    return new Date().getMonth() === parseInt(monthNumber) - 1
        ? `${date.toLocaleString('default', {month: 'long'})} (ongoing)`
        : date.toLocaleString('default', {month: 'long'})
}

export function calculatePastDate(days: number) {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - days)
    return currentDate
}

export function timeUntilMidnight(): { hours: number; minutes: number } {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0) // Set to 12:00 AM (next day)

    const diff = midnight.getTime() - now.getTime() // Difference in milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return {hours, minutes}
}

export const formatDateTime = (dateString: Date | null, local: string) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // abbreviated month name (e.g., 'Oct')
        day: 'numeric', // numeric day of the month (e.g., '25')
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    }
    const dateOptions: Intl.DateTimeFormatOptions = {
        // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // numeric year (e.g., '2023')
        day: 'numeric', // numeric day of the month (e.g., '25')
    }
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    }
    const formattedDateTime: string = dateString ? new Date(dateString).toLocaleString(
        local,
        dateTimeOptions
    ) : "Can't load date"
    const formattedDate: string = dateString ? new Date(dateString).toLocaleString(
        local,
        dateOptions
    ) : "Can't load date"
    const formattedTime: string = dateString ? new Date(dateString).toLocaleString(
        local,
        timeOptions
    ) : "Can't load date"
    return {
        dateTime: formattedDateTime,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
    }
}

export function formUrlQuery({
                                 params,
                                 key,
                                 value,
                             }: {
    params: string
    key: string
    value: string | null
}) {
    const currentUrl = qs.parse(params)

    currentUrl[key] = value

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        {skipNull: true}
    )
}

export const getFilterUrl = (filterUrl: FilterUrl) => {
    const newParams = {...filterUrl.params}
    if (filterUrl.category) newParams.category = filterUrl.category
    if (filterUrl.tag) newParams.tag = filterUrl.tag
    if (filterUrl.price) newParams.price = filterUrl.price
    if (filterUrl.rating) newParams.rating = filterUrl.rating
    if (filterUrl.page) newParams.page = filterUrl.page
    if (filterUrl.sort) newParams.sort = filterUrl.sort
    if (filterUrl.category_name) newParams.category_name = filterUrl.category_name
    return `/search?${new URLSearchParams(newParams).toString()}`
}

export interface FilterParams {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
    category_name?: string
}

export interface FilterUrl {
    params: FilterParams
    tag?: string
    category?: string
    sort?: string
    price?: string
    rating?: string
    page?: string
    category_name?: string
}

export interface ArrayWithPage<T> {
    page: number,
    size: number,
    totalItem: number,
    data: T[]

}

export interface ResponseData<T> {
    code: number;
    success: boolean;
    data: T;
}