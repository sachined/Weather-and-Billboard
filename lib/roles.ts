// noinspection SpellCheckingInspection

export interface Skill {
  name: string;
  description: string;
  proficiency: 'Familiar' | 'Working' | 'Advanced' | 'Expert';
}

export interface RoleInfo {
  title: string;
  fit: string;
  skills: Skill[];
  badge: string;
}

export interface RolesData {
  [key: string]: RoleInfo;
}

export const ROLES_DATA: RolesData = {
  TAM: {
    title: 'Technical Account Manager (TAM)',
    fit: 'Natural progression from my Account Manager & Implementation Engineer roles. I handle client relationships while leveraging technical knowledge.',
    badge: '3.5 yrs direct experience',
    skills: [
      {
        name: 'Stakeholder Management',
        proficiency: 'Advanced',
        description: 'Primary technical bridge across 5 concurrent Fortune 500 accounts — zero escalations across the full engagement lifecycle.',
      },
      {
        name: 'Root Cause Analysis',
        proficiency: 'Advanced',
        description: 'Diagnosed and resolved complex integration failures for clients including Worldpay and Fidelity Investments.',
      },
      {
        name: 'SQL / Custom Reporting',
        proficiency: 'Working',
        description: 'Built AI-generated reporting scripts that cut a recurring 60-min weekly process to 15 min — a 75% reduction.',
      },
      {
        name: 'REST APIs',
        proficiency: 'Working',
        description: 'Hands-on API configuration, troubleshooting, and documentation during KM platform onboarding and deployment.',
      },
    ],
  },
  CSE: {
    title: 'Customer Success Engineer (CSE)',
    fit: 'Focused on post-sale outcomes. My experience developing custom reporting tools to prove ROI matches this perfectly.',
    badge: '3.5 yrs direct experience',
    skills: [
      {
        name: 'Usage Analytics',
        proficiency: 'Advanced',
        description: 'Tracked client usage patterns across enterprise accounts to surface churn risk and inform product roadmap decisions.',
      },
      {
        name: 'Client Enablement',
        proficiency: 'Advanced',
        description: 'Delivered targeted training to enterprise end-user teams on AI-powered KM platform features and workflows.',
      },
      {
        name: 'AI-Driven Insights',
        proficiency: 'Advanced',
        description: 'Ran consultative demonstrations using live usage data to recover dormant accounts and drive renewal conversations.',
      },
      {
        name: 'Automation / Scripting',
        proficiency: 'Working',
        description: '75% reduction in recurring reporting overhead using AI-generated Python scripts — presented to VP-level stakeholders.',
      },
    ],
  },
  SE: {
    title: 'Sales Engineer / Solutions Consultant',
    fit: 'I understand client needs and can architect solutions. SEs support sales with technical demos and tailored solutions.',
    badge: 'Built demo environments',
    skills: [
      {
        name: 'Technical Demos',
        proficiency: 'Advanced',
        description: 'Full-cycle solution demonstrations from discovery through architecture, tailored to enterprise prospect requirements.',
      },
      {
        name: 'Solution Architecture',
        proficiency: 'Advanced',
        description: 'Containerized demo environments built with Docker Compose and Caddy — deployable locally and to production.',
      },
      {
        name: 'LLM Integration',
        proficiency: 'Advanced',
        description: 'Multi-provider LLM abstractions across Gemini, Groq, and Perplexity using direct HTTP — no vendor SDK lock-in.',
      },
      {
        name: 'Cross-functional Coordination',
        proficiency: 'Working',
        description: 'Acted as technical SME during sales-to-implementation handoffs, translating requirements across Sales, Engineering, and CS.',
      },
    ],
  },
  DataAnalyst: {
    title: 'Data Analyst (SaaS/Tech)',
    fit: 'My Python/SQL background makes this a strong play. Domain experience in retention gives me an edge over general analysts.',
    badge: 'Python + SQL depth',
    skills: [
      {
        name: 'Python / Pandas',
        proficiency: 'Advanced',
        description: 'Data normalization pipelines and investment sentiment analysis applying Graham/Lynch frameworks to equity datasets.',
      },
      {
        name: 'SQL',
        proficiency: 'Advanced',
        description: 'V-Lookups, Pivot Tables, and KPI dashboards built for executive stakeholder reporting in SaaS environments.',
      },
      {
        name: 'AI / Automation',
        proficiency: 'Advanced',
        description: '75% reduction in reporting tasks; implemented daily token caps and budget management for production AI pipelines.',
      },
      {
        name: 'Data Visualization',
        proficiency: 'Working',
        description: 'Generated professional PDF reports with adaptive pagination and structured layouts for executive review.',
      },
    ],
  },
  AISolutionsEngineer: {
    title: 'AI Solutions Engineer (Enterprise)',
    fit: 'Perfect match for my recent work on Finsurf.net and my 3+ years of experience in conversational AI and knowledge management.',
    badge: 'Target Role',
    skills: [
      {
        name: 'Python / LangGraph',
        proficiency: 'Expert',
        description: 'Architected production LangGraph state-machines with conditional routing, parallel fan-out, and the Send API.',
      },
      {
        name: 'LLM Integration',
        proficiency: 'Expert',
        description: 'Zero-SDK direct HTTP integrations with Gemini, Groq, Perplexity, and OpenAI — built for latency and cost control.',
      },
      {
        name: 'Conversational AI',
        proficiency: 'Expert',
        description: '3+ years designing and deploying LLM-based agents and chatbots for Fortune 500 enterprise environments.',
      },
      {
        name: 'Enterprise Deployment',
        proficiency: 'Advanced',
        description: 'Production-hardened AI platforms with bearer-token auth, Let\'s Encrypt TLS, and /health endpoint monitoring.',
      },
      {
        name: 'Knowledge Management',
        proficiency: 'Advanced',
        description: 'Prompt engineering and knowledge engineering to eliminate hallucinations in high-stakes enterprise conversational AI.',
      },
    ],
  },
};

export const ROLE_ORDER = ['AISolutionsEngineer', 'TAM', 'CSE', 'SE', 'DataAnalyst'];

export const CHECKLIST_ITEMS = [
  {
    id: 1,
    title: 'Optimize LinkedIn Headline',
    description:
      'Change to: "Senior AI Solutions Engineer | Bridging the \"Last Mile\" of Enterprise AI | Ex-Apple, eGain, NeuroLeap | Next.js • Python • SQL"',
  },
  {
    id: 2,
    title: 'Update LinkedIn "About"',
    description:
      'Refine to highlight the "Last Mile" of AI, my pedigree at Apple/eGain, and my hands-on work with Finsurf.net.',
  },
  {
    id: 3,
    title: 'Audit Portfolio Projects',
    description: 'Ensure weather-and-career and Finsurf.net are live, bug-free, and code is clean on GitHub.',
  },
  {
    id: 4,
    title: 'Update Resume Structure',
    description:
      'Insert "Growth Initiatives" section and reorder skills based on target role.',
  },
  {
    id: 5,
    title: 'Networking: 3 Info Interviews',
    description:
      'Reach out to TAMs/CSEs. Ask about their team structure and gap perceptions.',
  },
];