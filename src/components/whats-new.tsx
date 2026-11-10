"use client"

import { useEffect, useState } from "react"
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { FILES } from "@/assets/files"
import type { HomepagePolicyUpdate } from "@/lib/homepage-policies"

const exploreLinks = [
    ...FILES.map((file) => ({
        name: file.name,
        path: `/data/${file.path}`,
    })),
    {
        name: "Analysis",
        path: "/ai-healthcare-policy",
    },
]

type WhatsNewProps = {
    updates: HomepagePolicyUpdate[]
}

const AUTO_ROTATE_INTERVAL_MS = 4000

export default function WhatsNew({ updates }: WhatsNewProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (!api || isPaused || updates.length < 2) return

        const interval = window.setInterval(() => {
            api.scrollNext()
        }, AUTO_ROTATE_INTERVAL_MS)

        return () => window.clearInterval(interval)
    }, [api, isPaused, updates.length])

    return (
        <div className="flex h-full flex-col">
            <Carousel
                className="relative w-full border-y border-foreground/25 py-3"
                opts={{ loop: true }}
                setApi={setApi}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocusCapture={() => setIsPaused(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setIsPaused(false)
                    }
                }}
            >
                <h2 className="font-editorial text-2xl font-semibold">What&apos;s New</h2>

                <CarouselContent className="mt-3">
                    {updates.map((item) => (
                        <CarouselItem
                            key={item.title}
                            className="flex min-h-20 w-full flex-col gap-2 pr-2 pt-1"
                        >
                            <Link href={item.path}>
                                <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground/90 hover:underline">
                                    {item.title}
                                </h3>
                            </Link>
                            <p className="text-label text-muted-foreground">
                                {[item.date, item.moduleType, item.state].filter(Boolean).join(" · ")}
                            </p>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="mt-2 flex gap-2">
                    <CarouselPrevious className="static size-8 translate-y-0 rounded-none border-foreground/30 bg-transparent disabled:invisible" />
                    <CarouselNext className="static size-8 translate-y-0 rounded-none border-foreground/30 bg-transparent disabled:invisible" />
                </div>
            </Carousel>

            <section className="py-2.5">
                <div className="min-w-0">
                    <h2 className="font-editorial text-2xl font-semibold leading-tight">Operational Implications</h2>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        Compare detailed operational impacts across U.S. states.
                    </p>
                </div>
                <Link
                    href="/operational-implications"
                    className="mt-2 inline-flex items-center gap-2 border-b border-primary pb-0.5 text-sm font-semibold text-primary transition-colors hover:text-foreground"
                >
                    Explore →
                </Link>
            </section>

            <section className="flex min-h-0 w-full flex-1 flex-col border-t border-foreground/25 pt-3">
                <h2 className="font-editorial pb-1 text-2xl font-semibold">Explore HAPI</h2>
                {exploreLinks.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className="group flex min-h-9 flex-1 items-center justify-between border-b border-border py-2 text-sm font-semibold transition-colors hover:border-foreground/50 hover:text-primary"
                    >
                        <span>{item.name}</span>
                        <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                ))}
            </section>
        </div>
    )
}
