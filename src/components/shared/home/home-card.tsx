'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {getImageUrl} from "@/lib/utils";

type CardItem = {
    title: string
    link: { text: string; href: string }
    items: {
        name: string
        items?: string[]
        image: string | null
        href: string
    }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4'>
            {cards.map(card => {
                const items = Array.isArray(card.items) ? card.items : [];
                return (
                    <Card key={card.title} className='rounded-none flex flex-col'>
                        <CardContent className='p-4 flex-1'>
                            <h3 className='text-xl font-bold mb-4'>{card.title}</h3>
                            <div className='grid grid-cols-2 gap-4'>
                                {items.map(item => (
                                    <Link
                                        key={item.name+item.href}
                                        href={item.href}
                                        className='flex flex-col'
                                    >

                                        <Image
                                            onError={
                                                (e) => {
                                                    e.currentTarget.srcset= "/images/imagenotfound.png";
                                                }
                                            }
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className='aspect-square object-scale-down max-w-full h-auto mx-auto'
                                            height={120}
                                            width={120}
                                        />
                                        <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                                            {item.name}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                        {card.link && (
                            <CardFooter>
                                <Link href={card.link.href} className='mt-4 block'>
                                    {card.link.text}
                                </Link>
                            </CardFooter>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}