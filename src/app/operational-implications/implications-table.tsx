"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table2,
  Map as MapIcon,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import React from "react";
import Link from "next/link";

const GROUP_NAMES: Record<string, string> = {
  D: "Identity and Disclosure of AI",
  H: "Human Oversight in Decision-Making",
  U: "Coverage, Claims, and Utilization Decisions",
  E: "Equity and Non-Discrimination",
  I: "Data Handling and Infrastructure",
  S: "Safety and Crisis Response",
  PR: "Individual Rights Regarding AI",
  P: "Required AI Governance Procedures",
  G: "Legislative Governance Actions",
};

export type PolicyMatch = {
  name: string;
  link: string;
  specificImplication: string | null;
};

// Interpolates from white at 0% to green-200 (#bbf7d0) at 100%
function pctToColor(fraction: number): string {
  const from = [255, 255, 255];
  const to   = [187, 247, 208];
  const r = Math.round(from[0] + (to[0] - from[0]) * fraction);
  const g = Math.round(from[1] + (to[1] - from[1]) * fraction);
  const b = Math.round(from[2] + (to[2] - from[2]) * fraction);
  return `rgb(${r},${g},${b})`;
}

function getRulePrefix(rule: string): string {
  const code = rule.split(":")[0].trim();
  const match = code.match(/^([A-Z]+)/);
  return match ? match[1] : "";
}

type ColSort = { kind: "rule" | "group"; key: string } | null;
type SelectedCell = { rule: string; state: string } | null;

interface Props {
  rules: string[];
  matrix: Record<string, string[]>;
  states: string[];
  policyDetails: Record<string, Record<string, PolicyMatch[]>>;
  initialRuleCode?: string;
}

export default function ImplicationsTable({ rules, matrix, states, policyDetails, initialRuleCode }: Props) {
  const initialRule = initialRuleCode
    ? rules.find((r) => r.split(":")[0].trim() === initialRuleCode) ?? null
    : null;
  const initialGroup = initialRule ? getRulePrefix(initialRule) : null;

  const [view, setView] = useState<"table" | "map">("table");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    initialGroup ? new Set([initialGroup]) : new Set()
  );
  const [sortByState, setSortByState] = useState<string | null>(null);
  const [colSort, setColSort] = useState<ColSort>(
    initialRule ? { kind: "rule", key: initialRule } : null
  );
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const grouped = new Map<string, string[]>();
  for (const rule of rules) {
    const prefix = getRulePrefix(rule);
    if (!grouped.has(prefix)) grouped.set(prefix, []);
    grouped.get(prefix)!.push(rule);
  }

  const baseGroups = [...grouped.keys()];

  const groupPct = (prefix: string) => {
    const statesInGroup = new Set(
      (grouped.get(prefix) ?? []).flatMap((r) => matrix[r] ?? [])
    );
    return states.filter((s) => statesInGroup.has(s)).length / states.length;
  };

  const rulePct = (rule: string) => (matrix[rule] ?? []).length / states.length;

  const orderedGroups = [...baseGroups].sort((a, b) => {
    if (sortByState) {
      const aHas = (grouped.get(a) ?? []).some((r) => (matrix[r] ?? []).includes(sortByState));
      const bHas = (grouped.get(b) ?? []).some((r) => (matrix[r] ?? []).includes(sortByState));
      if (aHas !== bHas) return aHas ? -1 : 1;
    }
    return groupPct(b) - groupPct(a);
  });

  const getRulesForGroup = (prefix: string) => {
    const groupRules = grouped.get(prefix) ?? [];
    return [...groupRules].sort((a, b) => {
      if (sortByState) {
        const aHas = (matrix[a] ?? []).includes(sortByState);
        const bHas = (matrix[b] ?? []).includes(sortByState);
        if (aHas !== bHas) return aHas ? -1 : 1;
      }
      return rulePct(b) - rulePct(a);
    });
  };

  const sortedStates = colSort
    ? [...states].sort((a, b) => {
        const aHas =
          colSort.kind === "rule"
            ? (matrix[colSort.key] ?? []).includes(a)
            : (grouped.get(colSort.key) ?? []).some((r) => (matrix[r] ?? []).includes(a));
        const bHas =
          colSort.kind === "rule"
            ? (matrix[colSort.key] ?? []).includes(b)
            : (grouped.get(colSort.key) ?? []).some((r) => (matrix[r] ?? []).includes(b));
        return aHas === bHas ? 0 : aHas ? -1 : 1;
      })
    : states;

  const allExpanded = baseGroups.length > 0 && baseGroups.every((g) => expandedGroups.has(g));

  const toggleGroup = (prefix: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(prefix)) next.delete(prefix);
      else next.add(prefix);
      return next;
    });
  };

  const toggleAll = () => {
    setExpandedGroups(allExpanded ? new Set() : new Set(orderedGroups));
  };

  const toggleColSort = (kind: "rule" | "group", key: string) => {
    setColSort((prev) => (prev?.kind === kind && prev.key === key ? null : { kind, key }));
  };

  const modalPolicies =
    selectedCell ? (policyDetails[selectedCell.rule]?.[selectedCell.state] ?? []) : [];
  const [modalRuleCode, ...modalDescParts] = (selectedCell?.rule ?? "").split(":");
  const modalRuleDesc = modalDescParts.join(":").trim();

  return (
    <div>
      <div className="flex gap-2 mb-6 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("table")}
          >
            <Table2 className="w-4 h-4 mr-2" />
            Table
          </Button>
          <Button
            variant={view === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("map")}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>
        {view === "table" && (
          <Button variant="outline" size="sm" onClick={toggleAll}>
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
        )}
      </div>

      {view === "table" && (
        <p className="text-sm text-muted-foreground mb-4">
          Expand each category to view detailed rules, then click on a cell with a checkmark to read more about how that state implements the general rule in their policy.
        </p>
      )}

      {view === "table" ? (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="text-sm border-collapse min-w-max w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="sticky left-0 z-10 bg-gray-100 text-left px-4 py-3 font-medium w-96 border-r">
                  Category
                </th>
                <th className="px-3 py-3 font-medium text-center text-xs w-16 border-r">
                  % States
                </th>
                {sortedStates.map((state) => (
                  <th
                    key={state}
                    className={`px-1 py-3 font-medium text-center text-xs w-10 cursor-pointer select-none transition-colors hover:bg-gray-200 ${sortByState === state ? "bg-gray-200" : ""}`}
                    onClick={() => setSortByState(sortByState === state ? null : state)}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{state}</span>
                      {sortByState === state && (
                        <ArrowUpDown className="w-2.5 h-2.5 text-muted-foreground" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedGroups.map((prefix) => {
                const groupRules = getRulesForGroup(prefix);
                const isExpanded = expandedGroups.has(prefix);
                const isGroupColSorted = colSort?.kind === "group" && colSort.key === prefix;

                const statesInGroup = new Set<string>();
                for (const rule of groupRules) {
                  for (const state of matrix[rule] ?? []) statesInGroup.add(state);
                }
                const gCount = states.filter((s) => statesInGroup.has(s)).length;
                const gPct = Math.round((gCount / states.length) * 100);

                return (
                  <React.Fragment key={prefix}>
                    <tr className="border-y">
                      {/* Name — expands/collapses */}
                      <td
                        className="sticky left-0 z-10 bg-white px-4 py-3 border-r font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleGroup(prefix)}
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="font-semibold">{prefix}</span>
                          <span className="text-muted-foreground font-normal">
                            — {GROUP_NAMES[prefix]}
                          </span>
                        </div>
                      </td>
                      {/* % — color scaled, sorts state columns by this group */}
                      <td
                        className="px-3 py-3 text-center font-semibold border-r text-sm cursor-pointer select-none transition-colors"
                        style={{ backgroundColor: pctToColor(gCount / states.length) }}
                        onClick={() => toggleColSort("group", prefix)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {gPct}%
                          {isGroupColSorted && (
                            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      {sortedStates.map((state) => {
                        const hasCheck = statesInGroup.has(state);
                        const bg = sortByState === state ? "#e5e7eb" : hasCheck ? "#dcfce7" : "#ffffff";
                        return (
                          <td
                            key={state}
                            className="px-1 py-3 text-center"
                            style={{ backgroundColor: bg }}
                          >
                            {hasCheck ? (
                              <Check className="w-3.5 h-3.5 text-green-600 mx-auto" strokeWidth={2.5} />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-300 mx-auto" strokeWidth={2} />
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {isExpanded &&
                      groupRules.map((rule, i) => {
                        const statesWithRule = new Set(matrix[rule]);
                        const count = states.filter((s) => statesWithRule.has(s)).length;
                        const pct = Math.round((count / states.length) * 100);
                        const isRuleColSorted = colSort?.kind === "rule" && colSort.key === rule;
                        const labelBg = isRuleColSorted ? "bg-blue-50" : "bg-white";
                        const [ruleCode, ...descParts] = rule.split(":");
                        const ruleDesc = descParts.join(":").trim();

                        return (
                          <tr key={rule}>
                            {/* Name — sorts state columns by this rule */}
                            <td
                              className={`sticky left-0 z-10 ${labelBg} px-4 py-3 border-r leading-snug cursor-pointer hover:brightness-95 transition-all`}
                              onClick={() => toggleColSort("rule", rule)}
                            >
                              <div className="flex items-baseline gap-2 ml-6">
                                <span className="font-semibold shrink-0">{ruleCode.trim()}</span>
                                <span className="text-muted-foreground">— {ruleDesc}</span>
                                {isRuleColSorted && (
                                  <ArrowUpDown className="w-3 h-3 text-muted-foreground shrink-0 self-center" />
                                )}
                              </div>
                            </td>
                            {/* % — color scaled, also sorts state columns by this rule */}
                            <td
                              className="px-3 py-3 text-center font-medium border-r text-muted-foreground text-xs cursor-pointer select-none hover:brightness-95 transition-all"
                              style={{ backgroundColor: pctToColor(count / states.length) }}
                              onClick={() => toggleColSort("rule", rule)}
                            >
                              {pct}%
                            </td>
                            {/* Checkmark cells — show policy details on click */}
                            {sortedStates.map((state) => {
                              const hasRule = statesWithRule.has(state);
                              const bg = sortByState === state ? "#e5e7eb" : hasRule ? "#dcfce7" : "#ffffff";
                              return (
                                <td
                                  key={state}
                                  className={`px-1 py-3 text-center transition-colors ${hasRule ? "cursor-pointer hover:brightness-95" : ""}`}
                                  style={{ backgroundColor: bg }}
                                  onClick={() => hasRule && setSelectedCell({ rule, state })}
                                >
                                  {hasRule ? (
                                    <Check className="w-3.5 h-3.5 text-green-600 mx-auto" strokeWidth={2.5} />
                                  ) : (
                                    <X className="w-3.5 h-3.5 text-red-300 mx-auto" strokeWidth={2} />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 border rounded-lg text-muted-foreground">
          Map view coming soon
        </div>
      )}

      {/* Policy detail modal */}
      {selectedCell && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedCell(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    {selectedCell.state}
                  </p>
                  <h2 className="font-semibold text-base leading-snug">
                    <span className="mr-1">{modalRuleCode.trim()}</span>
                    <span className="text-muted-foreground font-normal">— {modalRuleDesc}</span>
                  </h2>
                </div>
                <button
                  className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                  onClick={() => setSelectedCell(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-4 space-y-6">
              {modalPolicies.map((policy, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-start gap-2">
                    {policy.link ? (
                      <Link
                        href={`/policies/${encodeURIComponent(policy.name)}`}
                        className="font-medium text-sm underline underline-offset-2 hover:text-muted-foreground leading-snug"
                        onClick={() => setSelectedCell(null)}
                      >
                        {policy.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-sm leading-snug">{policy.name}</span>
                    )}
                    {policy.link && (
                      <a
                        href={policy.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {policy.specificImplication && (
                    <p className="text-sm text-gray-700">{policy.specificImplication}</p>
                  )}
                  {i < modalPolicies.length - 1 && <hr className="mt-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
