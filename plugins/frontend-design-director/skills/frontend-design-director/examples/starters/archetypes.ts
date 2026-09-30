export type ArchetypeId =
  | "saas-ai"
  | "developer-platform"
  | "fintech-enterprise"
  | "commerce-physical"
  | "research-editorial"
  | "portfolio-experimental";

export type PageSection = {
  id: string;
  eyebrow: string;
  heading: string;
  purpose: string;
  proof: "product" | "code" | "metric" | "customer" | "photography" | "diagram" | "publication" | "work" | "trust" | "action";
  layout: "split" | "stage" | "chapters" | "grid" | "editorial" | "index";
};

export type ArchetypeBlueprint = {
  conceptPrompt: string;
  primaryAction: string;
  sections: PageSection[];
};

export const archetypes: Record<ArchetypeId, ArchetypeBlueprint> = {
  "saas-ai": {
    conceptPrompt: "Make the complete workflow understandable in one minute and desirable in one glance.",
    primaryAction: "Start the workflow",
    sections: [
      { id: "hero", eyebrow: "Outcome", heading: "Name the transformed job, not the AI category.", purpose: "Pair a specific promise with an interactive input or decisive product state.", proof: "product", layout: "split" },
      { id: "philosophy", eyebrow: "Why this model", heading: "Explain the product's point of view in three distinct claims.", purpose: "Give visitors a mental model before feature depth.", proof: "metric", layout: "grid" },
      { id: "workflow", eyebrow: "Product chapters", heading: "Show capture, transformation, and result as one sequence.", purpose: "Demonstrate realistic tasks with legible interface states.", proof: "product", layout: "chapters" },
      { id: "customers", eyebrow: "In practice", heading: "Prove the workflow with one detailed customer outcome.", purpose: "Connect product mechanism to credible business effect.", proof: "customer", layout: "editorial" },
      { id: "close", eyebrow: "Next move", heading: "Repeat one primary action with the adoption question answered.", purpose: "State trial, setup, and sales options plainly.", proof: "action", layout: "stage" },
    ],
  },
  "developer-platform": {
    conceptPrompt: "Make technical capability feel immediately usable and operationally credible.",
    primaryAction: "Run the first request",
    sections: [
      { id: "hero", eyebrow: "Capability", heading: "State the input, operation, and output precisely.", purpose: "Place runnable-looking code or a live result next to the claim.", proof: "code", layout: "split" },
      { id: "primitives", eyebrow: "System map", heading: "Organize primitives by developer job.", purpose: "Show how parts compose without exposing the org chart.", proof: "diagram", layout: "grid" },
      { id: "benchmark", eyebrow: "Evidence", heading: "Benchmark a named task with methodology.", purpose: "Substantiate speed, quality, reliability, or cost.", proof: "metric", layout: "stage" },
      { id: "integration", eyebrow: "Adoption", heading: "Show SDKs, templates, migration, and operations.", purpose: "Reduce integration uncertainty.", proof: "code", layout: "chapters" },
      { id: "close", eyebrow: "First deploy", heading: "Offer self-serve and complex-deployment paths.", purpose: "Keep docs and sales close to the technical decision.", proof: "action", layout: "split" },
    ],
  },
  "fintech-enterprise": {
    conceptPrompt: "Make a consequential switch feel controlled, worthwhile, and human.",
    primaryAction: "Evaluate the switch",
    sections: [
      { id: "hero", eyebrow: "Business outcome", heading: "State the economic or operational change.", purpose: "Show eligibility or implementation expectations immediately.", proof: "metric", layout: "split" },
      { id: "legitimacy", eyebrow: "Trust", heading: "Put legitimacy beside the risky promise.", purpose: "Surface scale, regulation, security, and customer context.", proof: "trust", layout: "grid" },
      { id: "jobs", eyebrow: "Platform", heading: "Organize the product by financial or operational job.", purpose: "Replace internal product taxonomy with recognizable work.", proof: "product", layout: "chapters" },
      { id: "switch", eyebrow: "Implementation", heading: "Explain migration, governance, and support.", purpose: "Resolve the practical blockers to adoption.", proof: "customer", layout: "editorial" },
      { id: "close", eyebrow: "Terms", heading: "Make pricing, conditions, and the next step explicit.", purpose: "End without surprise requirements.", proof: "action", layout: "stage" },
    ],
  },
  "commerce-physical": {
    conceptPrompt: "Create desire for the object while removing every reason to hesitate at purchase.",
    primaryAction: "Choose and buy",
    sections: [
      { id: "hero", eyebrow: "Product", heading: "Lead with the object, price, variant, and use moment.", purpose: "Make the item and purchase action unmistakable.", proof: "photography", layout: "stage" },
      { id: "difference", eyebrow: "Why it exists", heading: "Ground the differentiator in material or outcome.", purpose: "Turn aesthetic desire into a rational preference.", proof: "diagram", layout: "split" },
      { id: "details", eyebrow: "Construction", heading: "Move through scale, detail, use, and variant shots.", purpose: "Let photography answer tactile questions.", proof: "photography", layout: "chapters" },
      { id: "confidence", eyebrow: "Confidence", heading: "Show reviews, testing, fit, shipping, returns, and warranty.", purpose: "Remove purchase uncertainty.", proof: "customer", layout: "grid" },
      { id: "close", eyebrow: "Selection", heading: "Return to the configured product and current availability.", purpose: "Make the final action direct and informed.", proof: "action", layout: "split" },
    ],
  },
  "research-editorial": {
    conceptPrompt: "Turn a complex body of work into a clear question, method, and invitation.",
    primaryAction: "Explore or participate",
    sections: [
      { id: "hero", eyebrow: "Unresolved question", heading: "Make the scientific or cultural gap the protagonist.", purpose: "Establish stakes without flattening the subject.", proof: "diagram", layout: "stage" },
      { id: "limitation", eyebrow: "Why now", heading: "Explain why the current model is insufficient.", purpose: "Create the bridge from significance to method.", proof: "publication", layout: "editorial" },
      { id: "methods", eyebrow: "Methods stack", heading: "Show how the work moves from collection to impact.", purpose: "Make relationships and ownership visible.", proof: "diagram", layout: "chapters" },
      { id: "output", eyebrow: "Open work", heading: "Index publications, tools, data, and research updates.", purpose: "Turn credibility into browsable evidence.", proof: "publication", layout: "index" },
      { id: "people", eyebrow: "Participation", heading: "Connect people, roles, careers, and contact to the mission.", purpose: "Make the organization legible and reachable.", proof: "action", layout: "grid" },
    ],
  },
  "portfolio-experimental": {
    conceptPrompt: "Use one interaction metaphor to make the work memorable without hiding it.",
    primaryAction: "Open a project",
    sections: [
      { id: "index", eyebrow: "Selected work", heading: "Expose the project index immediately.", purpose: "Give the experiment a stable navigational spine.", proof: "work", layout: "index" },
      { id: "signature", eyebrow: "Point of view", heading: "Let one governing metaphor shape type, layout, and motion.", purpose: "Create recognition without unrelated visual tricks.", proof: "work", layout: "stage" },
      { id: "cases", eyebrow: "Case studies", heading: "Show context, role, contribution, result, and artifacts.", purpose: "Keep the work evaluable inside the expressive shell.", proof: "work", layout: "chapters" },
      { id: "lab", eyebrow: "Experiments", heading: "Separate sketches and tools from commissioned work.", purpose: "Show range without confusing status or authorship.", proof: "work", layout: "grid" },
      { id: "contact", eyebrow: "Availability", heading: "Make the current kind of collaboration explicit.", purpose: "Turn attention into a useful next step.", proof: "action", layout: "split" },
    ],
  },
};
