import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import whatsNew from "@/assets/Whats-New.json"
import Link from "next/link"

export default function WhatsNew() {
    return (
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
    )
}