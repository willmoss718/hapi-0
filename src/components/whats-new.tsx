import {
    Carousel,
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
        name: "AI Policy Overview",
        path: "/ai-healthcare-policy",
    },
]

type WhatsNewProps = {
    updates: HomepagePolicyUpdate[]
}

export default function WhatsNew({ updates }: WhatsNewProps) {
    return (
        <>
            <Carousel className="w-full h-40 rounded-lg border border-gray-200 relative">
                <h4 className="text-2xl font-medium absolute top-5 left-6">
                    What&apos;s New
                </h4>

                <CarouselContent>
                    {updates.map((item) => (
                        <CarouselItem
                            key={item.title}
                            className="relative w-full h-full px-10 pt-15 pb-4 flex flex-col gap-2"
                        >
                            <p className="absolute right-10 top-6 text-xs font-medium text-gray-500">
                                {[item.date, item.moduleType, item.state].filter(Boolean).join(" · ")}
                            </p>
                            <Link href={item.path}>
                                <h5 className="leading-snug hover:underline line-clamp-2">
                                    {item.title}
                                </h5>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="translate-x-6 z-10 bg-white disabled:opacity-100 disabled:invisible" />
                <CarouselNext className="-translate-x-6 z-10 bg-white disabled:opacity-100 disabled:invisible" />
            </Carousel>

            <section className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                    <h4 className="text-xl font-medium leading-tight">Operational Implications</h4>
                    <p className="mt-1 text-sm leading-5 text-gray-600">
                        Compare detailed operational impacts across U.S. states.
                    </p>
                </div>
                <Link
                    href="/operational-implications"
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-gray-900 bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gray-900"
                >
                    Explore →
                </Link>
            </section>

            <section className="w-full overflow-hidden rounded-lg border border-gray-200">
                <h4 className="px-6 py-5 text-2xl font-medium">Explore HAPI</h4>
                {exploreLinks.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className="group flex min-h-12 items-center justify-between border-t border-gray-100 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-black">{item.name}</span>
                        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-all duration-300 group-hover:text-gray-800" />
                    </Link>
                ))}
            </section>
        </>
    )
}
