"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Badge } from "./ui/badge";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { getRandomTailwindColor } from "@/lib/utils";

export default function Filters(props: {
  availableTags: Record<string, string[]>;
  className?: string;
  compact?: boolean;
  editorial?: boolean;
  hideSearchLabel?: boolean;
}) {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );
  const [tags, setTags] = useQueryState(
    "t",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  const sectionGap = props.compact ? "gap-3" : "gap-4";
  const tagRowsGap = props.compact ? "gap-1.5" : "gap-2";

  return (
    <div className={`flex flex-col ${sectionGap} ${props.editorial ? "border-y border-border bg-[#f4f0e8]/55 px-4 py-5 md:px-5" : ""} ${props.className ?? "mt-12"}`}>
      {!props.hideSearchLabel && (
        <div className="flex flex-row gap-2 items-center justify-start text-muted-foreground">
          <SearchIcon className="size-4" />
          <div className="text-xs font-medium whitespace-nowrap">
            Filter by Search Term...
          </div>
        </div>
      )}
      <Input
        className={props.editorial ? "h-11 rounded-[2px] border-border bg-background px-4 shadow-none focus-visible:ring-2" : undefined}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <div className={`flex flex-col ${sectionGap}`}>
        <div className={`flex flex-row gap-2 items-center justify-start text-muted-foreground ${props.editorial ? "text-label" : ""}`}>
          <ListFilterIcon className="size-4" />
          <div className="text-xs font-medium whitespace-nowrap">
            Filter by Tag Category...
          </div>
        </div>
        <div className={`flex flex-col ${tagRowsGap}`}>
          {Object.entries(props.availableTags).map(([key, values]) => (
            <div key={key} className={props.editorial ? "grid grid-cols-1 items-start gap-2 border-t border-border/60 pt-3 first:border-0 first:pt-0 md:grid-cols-[9.5rem_minmax(0,1fr)]" : "flex flex-row items-center justify-start"}>
              <Badge
                variant="secondary"
                className={props.editorial ? "rounded-[2px] border border-foreground/10 text-[0.68rem] font-semibold tracking-[0.04em] text-foreground" : "text-xs font-medium whitespace-nowrap"}
                style={{ backgroundColor: getRandomTailwindColor(key) }}
              >
                {key}
              </Badge>
              {!props.editorial && <span className="text-xs mx-1.5">:</span>}
              <div
                key={key}
                className={`flex flex-row items-center justify-start overflow-x-auto ${props.editorial ? "flex-wrap gap-1.5" : "flex-nowrap gap-2"}`}
              >
                {values.map(
                  (tag) =>
                    tag && (
                      <button
                        key={tag}
                        onClick={() =>
                          setTags(
                            tags.includes(tag)
                              ? tags.filter((t) => t !== tag)
                              : [...tags, tag],
                          )
                        }
                        className="cursor-pointer"
                      >
                        <Badge
                          variant={tags.includes(tag) ? "default" : "secondary"}
                          className={props.editorial ? `rounded-[2px] border px-2.5 py-1 ${tags.includes(tag) ? "border-primary bg-primary text-primary-foreground" : "border-foreground/10 text-foreground/80"}` : undefined}
                          style={props.editorial && !tags.includes(tag) ? { backgroundColor: getRandomTailwindColor(key) } : undefined}
                        >
                          {tag}
                        </Badge>
                      </button>
                    ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
