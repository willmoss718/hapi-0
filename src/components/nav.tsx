"use client"

import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { MenuIcon } from "lucide-react";
import { FILES } from "@/assets/files";

export default function Nav() {
    const list = (
        <NavigationMenu>
            <NavigationMenuList className="flex flex-col md:flex-row md:justify-end gap-2 items-start md:items-center">
                {FILES.map((file) => (
                    <NavigationMenuItem key={file.path}>
                        <NavigationMenuLink asChild>
                            <Link href={`/data/${file.path}`}>{file.navName}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/ai-healthcare-policy">AI Policy Overview</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/trends">Trends</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/about">About / Methodology</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )

    return (
        <nav className="flex flex-row justify-between items-center py-4">
            <div className="flex flex-row justify-start items-center">
                <Link href="/" className="text-lg font-semibold whitespace-nowrap">
                    Health & AI Policy Index
                </Link>
            </div>
            <Drawer>
                <DrawerTrigger className="md:hidden">
                    <MenuIcon />
                </DrawerTrigger>
                <DrawerContent className="p-4 min-h-96">
                    <DrawerHeader className="flex flex-row justify-start items-center px-2 font-bold text-2xl">
                        Menu
                    </DrawerHeader>
                    {list}
                </DrawerContent>
            </Drawer>
            <div className="flex-row justify-end items-center hidden md:flex">
                {list}
            </div>
        </nav>
    )
}
