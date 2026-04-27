import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import whatsNew from "@/assets/Whats-New.json"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { FILES } from "@/assets/files"

export default function WhatsNew() {
    return (
        <>
            {/* WHATS NEW CAROUSEL */}
            <Carousel className="w-full h-48 rounded-lg border border-gray-200 relative">
                <h4 className="text-2xl font-medium absolute top-6 left-6">
                    Whats New
                </h4>

                <CarouselContent>
                    {whatsNew.updates.map((item) => (
                        <CarouselItem
                            key={item.title}
                            className="w-full h-full px-10 pt-18 flex flex-col gap-4"
                        >
                            <Link href={item.path}>
                                <h5 className="leading-tight hover:underline line-clamp-3">
                                    {item.title}
                                </h5>
                            </Link>
                            <p className="text-sm text-gray-500">
                                {item.date}
                            </p>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="translate-x-6 z-10 bg-white disabled:opacity-100 disabled:invisible" />
                <CarouselNext className="-translate-x-6 z-10 bg-white disabled:opacity-100 disabled:invisible" />
            </Carousel>

            {/* LAST UPDATED + MODULE BUTTONS */}
            <div className="flex flex-row flex-wrap gap-4 mt-2">

                {/* LAST UPDATED (now same width as modules) */}
                <div className="w-40 h-20 rounded-lg border border-gray-200 p-4 flex flex-col justify-center">
                    <span className="text-gray-500 text-sm">
                        {whatsNew.lastUpdated}
                    </span>
                    <span className="text-gray-500 text-sm">
                        Last Updated
                    </span>
                </div>

                {/* MODULE BUTTONS (uniform width) */}
                {FILES.map((item) => (
                    <Link
                        key={item.path}
                        href={`/data/${item.path}`}
                        className="group w-40 h-20 rounded-lg border border-gray-200 hover:border-gray-800 transition-all duration-300 p-4 relative"
                    >
                        <span className="text-black">{item.name}</span>
                        <ArrowRightIcon className="w-4 h-4 text-gray-400 absolute right-4 bottom-4 group-hover:translate-x-1 transition-all duration-300 group-hover:text-gray-800" />
                    </Link>
                ))}

            </div>
        </>
    )
}