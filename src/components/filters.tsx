"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Badge } from "./ui/badge";

export default function Filters(props: {
    availableTags: string[];
}) {
    const [search, setSearch] = useQueryState('q', parseAsString.withDefault('').withOptions({ shallow: false }));
    const [tags, setTags] = useQueryState('t', parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: false }));

    return (
        <div className="flex flex-col gap-2 mt-12">
            <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
            <div className="flex flex-row gap-2 items-center justify-start flex-wrap">
                {props.availableTags.map((tag) => (
                    tag &&
                    <button key={tag} onClick={() => setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag])} className="cursor-pointer">
                        <Badge variant={tags.includes(tag) ? "default" : "secondary"}>{tag}</Badge>
                    </button>
                ))}
            </div>
        </div>
    );
}