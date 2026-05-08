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

export default function WhatsNew() {
    return (
        <>
            <Carousel className="w-full h-48 rounded-lg border border-gray-200 relative">
                <h4 className="text-2xl font-medium absolute top-6 left-6">
                    Latest Policy Updates
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

            <section className="w-full rounded-lg border border-gray-200 p-6">
                <h4 className="text-2xl font-medium">HAPI Weekly</h4>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                    Get weekly updates on healthcare AI laws, regulations, standards, and emerging trends.
                </p>
                <div className="mt-5 w-full overflow-hidden rounded-md bg-white">
                    <iframe
                        src="https://healthaipolicy.substack.com/embed"
                        title="Subscribe to HAPI Weekly"
                        width="100%"
                        height="220"
                        className="block h-[220px] w-full"
                        style={{ border: "1px solid #EEE", background: "white" }}
                        frameBorder="0"
                        scrolling="no"
                    />
                </div>
                <Link
                    href="https://healthaipolicy.substack.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-gray-500 hover:underline"
                >
                    Open HAPI Weekly on Substack →
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
