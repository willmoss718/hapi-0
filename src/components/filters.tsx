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
    <div className={`flex flex-col ${sectionGap} ${props.className ?? "mt-12"}`}>
      {!props.hideSearchLabel && (
        <div className="flex flex-row gap-2 items-center justify-start text-muted-foreground">
          <SearchIcon className="size-4" />
          <div className="text-xs font-medium whitespace-nowrap">
            Filter by Search Term...
          </div>
        </div>
      )}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <div className={`flex flex-col ${sectionGap}`}>
        <div className="flex flex-row gap-2 items-center justify-start text-muted-foreground">
          <ListFilterIcon className="size-4" />
          <div className="text-xs font-medium whitespace-nowrap">
            Filter by Tag Category...
          </div>
        </div>
        <div className={`flex flex-col ${tagRowsGap}`}>
          {Object.entries(props.availableTags).map(([key, values]) => (
            <div key={key} className="flex flex-row items-center justify-start">
              <Badge
                variant="secondary"
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: getRandomTailwindColor(key),
                }}
              >
                {key}
              </Badge>
              <span className="text-xs mx-1.5">:</span>
              <div
                key={key}
                className="flex flex-row gap-2 items-center justify-start flex-nowrap overflow-x-auto"
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
