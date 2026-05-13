export const OPERATIONAL_CATEGORY_NAMES: Record<string, string> = {
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

export const TOTAL_OPERATIONAL_CATEGORIES = Object.keys(OPERATIONAL_CATEGORY_NAMES).length;
