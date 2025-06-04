'use client'
import { ChevronDownIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {currencyConfig} from "@/config/currency-config";
import {useCurrency} from "@/hooks/use-currency";

export default function CurrencySwitcher() {
    const { currencies } = currencyConfig
    const { currency, setCurrency } = useCurrency()

    return (
        <div className='w-[88px] flex items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full header-button'>
                    <div className='w-full flex justify-between items-center'>
            <span className='text-xs'>
              {currencies.find((c) => c.code === currency)?.name}
            </span>
                        <ChevronDownIcon />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>Currency</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                        {currencies.map((c) => (
                            <DropdownMenuRadioItem key={c.code} value={c.code}>
                                <span className='text-xs'>{c.icon} | {c.name}</span>
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}