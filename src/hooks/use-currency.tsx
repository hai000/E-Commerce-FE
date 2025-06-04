"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

const CurrencyContext = createContext<{
    currency: string
    setCurrency: (c: string) => void
    rates: Record<string, number>
    isReady: boolean
}>({
    currency: "VND",
    setCurrency: () => {},
    rates: { VND: 1 },
    isReady: false,
})

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<string>("VND")
    const [isReady, setIsReady] = useState(false)
    const [rates, setRates] = useState<Record<string, number>>({ VND: 1 })

    // Chỉ chạy 1 lần: đọc currency và fetch tỉ giá
    useEffect(() => {
        const savedCurrency = window.localStorage.getItem("currency") || "VND"
        setCurrencyState(savedCurrency)

        fetch("https://v6.exchangerate-api.com/v6/c9aae375670f70987420ccee/latest/VND")
            .then(res => res.json())
            .then(data => {
                setRates(data.conversion_rates || { VND: 1 })
                setIsReady(true)
            })
            .catch(() => setIsReady(true)) // fallback nếu fetch lỗi vẫn cho render
    }, [])

    const setCurrency = (c: string) => {
        setCurrencyState(c)
        window.localStorage.setItem("currency", c)
    }

    if (!isReady) return null // hoặc <div>Loading...</div>
    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, isReady }}>
            {children}
        </CurrencyContext.Provider>
    )
}