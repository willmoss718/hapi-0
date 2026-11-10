"use client"

import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { FILES } from "@/assets/files";
import { usePathname } from "next/navigation";

const analysisLinks = [
    { href: "/trends", label: "Trends" },
    { href: "/ai-healthcare-policy", label: "AI Policy Overview" },
    { href: "/insights", label: "Insights" },
];

export default function Nav() {
    const pathname = usePathname();
    const navLinkClass = "relative rounded-none px-2 py-2.5 text-[0.82rem] font-medium text-foreground/75 transition-colors hover:text-foreground focus:text-foreground xl:px-2.5 xl:text-[0.92rem] after:absolute after:inset-x-2 after:-bottom-px after:h-[2px] after:origin-left after:scale-x-0 after:bg-primary after:transition-transform";
    const activeNavLinkClass = `${navLinkClass} text-foreground after:scale-x-100`;
    const policyNavLinkClass = `${navLinkClass} hover:bg-background/90 focus:bg-background/90`;
    const activePolicyNavLinkClass = `${activeNavLinkClass} hover:bg-background/90 focus:bg-background/90`;
    const isAnalysisActive = analysisLinks.some((link) => pathname.startsWith(link.href));

    const policyModuleList = (
        <div className="rounded-[2px] border border-[#7f9f95] bg-[#edf4f1] px-0.5">
            <ul className="flex h-full list-none flex-row items-stretch justify-end gap-0 whitespace-nowrap">
                {FILES.map((file) => (
                    <li className="flex" key={file.path}>
                        <Link
                            className={`${pathname.startsWith(`/data/${file.path}`) ? activePolicyNavLinkClass : policyNavLinkClass} inline-flex items-center`}
                            href={`/data/${file.path}`}
                        >
                            {file.navName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

    const analysisMenu = (
        <NavigationMenu viewport={false} className="rounded-[2px] border border-[#b3a27a] bg-[#f7f1e4]">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={`${isAnalysisActive ? activeNavLinkClass : navLinkClass} h-auto bg-transparent hover:bg-transparent focus:bg-transparent`}>
                        Analysis
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-50 w-56 rounded-none border-border bg-card shadow-none">
                        <ul className="grid gap-1">
                            {analysisLinks.map((link) => (
                                <li key={link.href}>
                                    <NavigationMenuLink asChild>
                                        <Link className="rounded-none border-b border-border/60 px-3 py-2.5 last:border-0 hover:bg-accent/60" href={link.href}>{link.label}</Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )

    const mobileLinkClass = "w-full border-b border-border py-3 text-base font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

    const mobileList = (
        <div className="flex flex-col items-start px-2">
            {FILES.map((file) => (
                <Link
                    className={mobileLinkClass}
                    href={`/data/${file.path}`}
                    key={file.path}
                >
                    {file.navName}
                </Link>
            ))}
            <Link className={mobileLinkClass} href="/operational-implications">
                Operational Implications
            </Link>
            <details className="group w-full">
                <summary className={`${mobileLinkClass} flex cursor-pointer list-none items-center gap-1 marker:hidden`}>
                    Analysis
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="size-3 transition-transform group-open:rotate-180"
                    />
                </summary>
                <div className="ml-4 flex flex-col border-l border-border pl-4">
                    {analysisLinks.map((link) => (
                        <Link
                            className={mobileLinkClass}
                            href={link.href}
                            key={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </details>
            <Link className={mobileLinkClass} href="/about">
                About/Methodology
            </Link>
        </div>
    )

    return (
        <nav aria-label="Primary navigation">
            <div className="flex flex-row items-center justify-between gap-4 py-2.5 lg:py-3">
                <Link href="/" className="group shrink-0 xl:translate-y-1" aria-label="Health & AI Policy Index home">
                    <span className="font-editorial block text-[1.45rem] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground sm:text-[1.55rem] lg:text-[1.7rem]">
                        Health &amp; AI<br />Policy Index
                    </span>
                </Link>
            <Drawer>
                <DrawerTrigger className="inline-flex size-11 items-center justify-center border border-foreground/30 xl:hidden" aria-label="Open menu">
                    <MenuIcon className="size-5" />
                </DrawerTrigger>
                <DrawerContent className="p-4 min-h-96">
                    <DrawerHeader className="font-editorial flex flex-row items-center justify-start px-2 text-3xl font-semibold">
                        Menu
                    </DrawerHeader>
                    {mobileList}
                </DrawerContent>
            </Drawer>
            <div className="hidden flex-row items-stretch justify-end gap-1.5 xl:flex">
                {policyModuleList}
                <Link
                    className={`${pathname.startsWith("/operational-implications") ? activeNavLinkClass : navLinkClass} inline-flex items-center rounded-[2px] border border-[#879aad] bg-[#eef2f6] hover:bg-transparent focus:bg-transparent`}
                    href="/operational-implications"
                >
                    Operational Implications
                </Link>
                {analysisMenu}
                <Link
                    className={`${pathname.startsWith("/about") ? activeNavLinkClass : navLinkClass} inline-flex items-center rounded-[2px] border border-[#a59b8e] bg-[#f3efea] hover:bg-transparent focus:bg-transparent`}
                    href="/about"
                >
                    About/Methodology
                </Link>
            </div>
            </div>
        </nav>
    )
}
