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

const analysisLinks = [
    { href: "/trends", label: "Trends" },
    { href: "/ai-healthcare-policy", label: "AI Policy Overview" },
    { href: "/insights", label: "Insights" },
];

export default function Nav() {
    const desktopList = (
        <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex-row justify-end gap-2 items-center whitespace-nowrap">
                {FILES.map((file) => (
                    <NavigationMenuItem key={file.path}>
                        <NavigationMenuLink asChild>
                            <Link href={`/data/${file.path}`}>{file.navName}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
                <NavigationMenuItem
                    aria-hidden="true"
                    className="ml-3 lg:ml-5 flex select-none items-center px-1 text-sm opacity-40"
                >
                    ·
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/operational-implications">Operational Implications</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-auto bg-transparent px-2 py-2">
                        Analysis
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-50 w-56">
                        <ul className="grid gap-1">
                            {analysisLinks.map((link) => (
                                <li key={link.href}>
                                    <NavigationMenuLink asChild>
                                        <Link href={link.href}>{link.label}</Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/about">About/Methodology</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )

    const mobileLinkClass = "rounded-sm p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1";

    const mobileList = (
        <div className="flex flex-col gap-2 items-start px-2">
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
                <div className="ml-3 mt-1 flex flex-col gap-1">
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
        <nav className="flex flex-row justify-between items-center py-4">
            <div className="flex flex-row justify-start items-center">
                <Link href="/" className="text-lg font-semibold whitespace-nowrap">
                    Health & AI Policy Index
                </Link>
            </div>
            <Drawer>
                <DrawerTrigger className="md:hidden" aria-label="Open menu">
                    <MenuIcon />
                </DrawerTrigger>
                <DrawerContent className="p-4 min-h-96">
                    <DrawerHeader className="flex flex-row justify-start items-center px-2 font-bold text-2xl">
                        Menu
                    </DrawerHeader>
                    {mobileList}
                </DrawerContent>
            </Drawer>
            <div className="flex-row justify-end items-center hidden md:flex">
                {desktopList}
            </div>
        </nav>
    )
}
