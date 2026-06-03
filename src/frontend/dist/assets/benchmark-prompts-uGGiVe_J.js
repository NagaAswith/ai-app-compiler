import { c as createLucideIcon } from "./index-XVEsl6Ym.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
const BENCHMARK_PROMPTS = [
  // ── Normal SaaS (10) ──────────────────────────────────────────────────
  {
    id: 0,
    category: "normal",
    label: "CRM System",
    prompt: "Build a customer relationship management system with contacts, deals pipeline, activity tracking, email integration, and sales forecasting for a B2B sales team of 50 reps"
  },
  {
    id: 1,
    category: "normal",
    label: "Project Management",
    prompt: "Create a project management tool with projects, tasks, sprints, Gantt charts, time tracking, team collaboration, and client reporting for software agencies"
  },
  {
    id: 2,
    category: "normal",
    label: "Learning Management System",
    prompt: "Build a learning management system with courses, lessons, quizzes, student progress tracking, instructor management, certificates, and payment processing for online education"
  },
  {
    id: 3,
    category: "normal",
    label: "HR Management System",
    prompt: "Create a human resource management system with employee profiles, payroll, leave management, performance reviews, recruitment pipeline, and org chart visualization"
  },
  {
    id: 4,
    category: "normal",
    label: "E-commerce Platform",
    prompt: "Build an e-commerce platform with product catalog, inventory, shopping cart, order management, payment processing, shipping integration, and customer reviews"
  },
  {
    id: 5,
    category: "normal",
    label: "Multi-vendor Marketplace",
    prompt: "Create a multi-vendor marketplace with seller onboarding, product listings, buyer/seller messaging, escrow payments, dispute resolution, and commission management"
  },
  {
    id: 6,
    category: "normal",
    label: "Subscription SaaS",
    prompt: "Build a subscription management platform with plans, billing cycles, usage metering, invoicing, dunning management, and customer portal for a B2B SaaS"
  },
  {
    id: 7,
    category: "normal",
    label: "Customer Helpdesk",
    prompt: "Create a customer support helpdesk with ticket management, SLA tracking, knowledge base, live chat, escalation workflows, and CSAT surveys"
  },
  {
    id: 8,
    category: "normal",
    label: "Inventory Management",
    prompt: "Build an inventory management system with warehouses, stock tracking, purchase orders, supplier management, barcode scanning, and reorder automation"
  },
  {
    id: 9,
    category: "normal",
    label: "Appointment Booking",
    prompt: "Create an appointment booking system with service providers, availability calendars, booking management, automated reminders, payments, and review system"
  },
  // ── Edge Cases (10) ───────────────────────────────────────────────────
  {
    id: 10,
    category: "edge",
    label: "Vague Requirements",
    prompt: "Build an app"
  },
  {
    id: 11,
    category: "edge",
    label: "Over-specified",
    prompt: "Create a social network like Facebook but better with everything"
  },
  {
    id: 12,
    category: "edge",
    label: "Contradictory Roles",
    prompt: "Build a system where admins are also users and users can be admins but only sometimes"
  },
  {
    id: 13,
    category: "edge",
    label: "Contradictory Requirements",
    prompt: "Create an app with no users, no login, and no data storage that still tracks user behavior"
  },
  {
    id: 14,
    category: "edge",
    label: "Conflicting Constraints",
    prompt: "Build a real-time collaborative whiteboard that works offline and syncs instantly"
  },
  {
    id: 15,
    category: "edge",
    label: "Ambiguous Roles",
    prompt: "Create a marketplace where buyers and sellers are the same person"
  },
  {
    id: 16,
    category: "edge",
    label: "Recursive Requirements",
    prompt: "Build an AI that builds other AIs recursively"
  },
  {
    id: 17,
    category: "edge",
    label: "Contradictory Compliance",
    prompt: "Create a HIPAA, GDPR, SOC2, PCI-DSS compliant app with no security features"
  },
  {
    id: 18,
    category: "edge",
    label: "Impossible UI",
    prompt: "Build a one-page app with 50 different dashboards all visible at once"
  },
  {
    id: 19,
    category: "edge",
    label: "Impossible Performance",
    prompt: "Create an enterprise app for 1 million concurrent users running on a single server with zero latency"
  }
];
const NORMAL_PROMPTS = BENCHMARK_PROMPTS.filter(
  (p) => p.category === "normal"
);
const EDGE_PROMPTS = BENCHMARK_PROMPTS.filter(
  (p) => p.category === "edge"
);
export {
  BENCHMARK_PROMPTS as B,
  CircleX as C,
  EDGE_PROMPTS as E,
  NORMAL_PROMPTS as N,
  Play as P
};
