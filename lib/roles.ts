// noinspection SpellCheckingInspection

export interface Skill {
  name: string;
  description: string;
}

export interface RoleInfo {
  title: string;
  fit: string;
  skills: Skill[];
  badge: string;
  scores: number[];
  chartDescription: string;
  legendDetails: {
    technical: string;
    stakeholder: string;
    analytical: string;
    operational: string;
  };
}

export interface RolesData {
  [key: string]: RoleInfo;
}

export const ROLES_DATA: RolesData = {
  TAM: {
    title: 'Technical Account Manager (TAM)',
    fit: 'Natural progression from your Account Manager & Implementation Engineer roles. You handle client relationships while leveraging technical knowledge.',
    skills: [
        { name: 'Stakeholder Management', description: 'Managing client expectations and relationships.' },
        { name: 'Root Cause Analysis', description: 'Identifying and resolving complex issues.' },
        { name: 'Custom Reporting / SQL', description: 'Creating custom reports and using SQL for data analysis.' },
        { name: 'API Knowledge', description: 'Understanding and utilizing APIs for integration and automation.' }
      ],
    badge: 'High Fit',
    scores: [8, 9, 7, 7], // Tech, Stakeholder, Analytical, Operational
    chartDescription: 'Highlights the high balance between stakeholder strategy and technical proficiency needed to manage complex client accounts.',
    legendDetails: {
      technical: 'Implementation and onboarding for AI-powered Knowledge Management (KM) platforms.',
      stakeholder: 'Served as the primary technical bridge between Clients, Internal Engineering, and Sales',
      analytical: 'Monitored account health to maintain zero client escalations. Identified efficiency improvements',
      operational: 'Managed five concurrent enterprise accounts throughout the full deployment lifecycle.'
    }
  },
  CSE: {
    title: 'Customer Success Engineer (CSE)',
    fit: 'Focused on post-sale outcomes. Your experience developing custom reporting tools to prove ROI matches this perfectly.',
    skills: [
        { name: 'AI-driven Insights', description: 'Provided insights to clients on how to improve their business operations.' },
        { name: 'Trend Identification', description: 'Identifying trends in client usage patterns to inform product development.' },
        { name: 'Client Training', description: 'Provided targeted training to client teams.' },
        { name: 'Retention Strategy', description: 'Developed and implemented retention strategies to increase client satisfaction and loyalty.' }
      ],
    badge: 'High Fit',
    scores: [7, 9, 8, 6],
    chartDescription: 'Emphasizes analytical impact and stakeholder strategy, focusing on driving retention through data-driven technical insights.',
    legendDetails: {
      technical: 'Production deployment of AI-powered KM platform.',
      stakeholder: 'Providing consultative demonstrations to recover dormant accounts.',
      analytical: 'Evaluating client usage patterns to drive ongoing optimization of platforms.',
      operational: 'Reducing recurring reporting tasks by 75% using AI-generated scripts.'
    }
  },
  SE: {
    title: 'Sales Engineer / Solutions Consultant',
    fit: 'You understand client needs and can architect solutions. SEs support sales with technical demos and tailored solutions.',
    skills: [
        { name: 'Cross-functional Coordination', description: '' },
        { name: 'User Training', description: 'Provided targeted training to client teams' },
        { name: 'Technical Demos', description: 'Provided demos to potential clients and a plan to address issues.' },
        { name: 'Solution Architecture', description: 'Architecting and demonstrating custom solutions for clients.' }
      ],
    badge: 'Med-High Fit',
    scores: [8, 8, 5, 9],
    chartDescription: 'Peaked in operational excellence and technical proficiency, reflecting the ability to architect and demonstrate custom solutions.',
    legendDetails: {
      technical: 'Rapid protortyping of full-stack AI tools using React 19m TypeScript, and Python. Architecting multi-LLM provider abstractions (Gemini, Groq, Perplexity)',
      stakeholder: 'Acted as a technical subject matter expert during sales-to-implementation handoff.',
      analytical: 'Engineered web-grounded research agents to provide real-time market intelligence.',
      operational: 'Built containerized demo envs with Docker Compose and Caddy for local and production deployment.'
    }
  },
  DataAnalyst: {
    title: 'Data Analyst (SaaS/Tech)',
    fit: 'Your Python/SQL background makes this a strong play. Domain experience in retention gives you an edge over general analysts.',
    skills: [
      { name: 'Data Interpretation', description: 'Data handling and advanced Excel functions' },
      { name: 'Custom Reporting', description: 'Creating custom reports for stakeholders' },
      { name: 'AI/Automation', description: 'Automating repetitive tasks and data processing workflows' },
      { name: 'Pandas/NumPy', description: 'Data manipulation and analysis using Pandas and NumPy libraries' }
    ],
    badge: 'Technical Fit',
    scores: [9, 5, 10, 4],
    chartDescription: 'Maximized for analytical impact and technical proficiency, focusing on deep data interpretation and automation workflows.',
    legendDetails: {
      technical: 'Dataset normalization and utilizing functions including V-Lookups, Pivot Tables, and KPI Dashboards.',
      stakeholder: 'Generated professional PDF reports with adaptive pagination for executive review',
      analytical: 'Applying foundational investment analysis (Graham/Lynch) to develop stock sentiment and dividend analysis nodes.',
      operational: 'Developing daily budget ceilings and token caps to manage data processing costs.'
    }
  },
  AISolutionsEngineer: {
    title: 'AI Solutions Engineer (Enterprise)',
    fit: 'Perfect match for your recent work on Finsurf.net and your 3+ years of experience in conversational AI and knowledge management.',
    skills: [
        { name: 'Conversational AI', description: 'Designing and deploying LLM-based agents and chatbots.' },
        { name: 'Enterprise Implementation', description: 'Managing the integration of AI tools into existing corporate workflows' },
        { name: 'API Integration', description: 'Building zero-SDK direct HTTP integrations with leading LLM providers.' },
        { name: 'Knowledge Management', description: 'Knowledge Engineering and Prompt Engineering to eliminate hallucinations in enterprise conversational AI.' },
        { name: 'Python', description: 'Architected a Research Agent that was instrumental in later projects involving prompt engineering and knowledge management.' }
      ],
    badge: 'Best Fit',
    scores: [10, 8, 9, 9],
    chartDescription: 'Reflects deep technical proficiency in AI and high operational excellence in enterprise deployments.',
    legendDetails: {
      technical: 'Architected LangGraph state-machines w/ conditional routing & parallel fan-out (Send API).',
      stakeholder: 'Continous improvement of prompt engineering and knowledge management practices.',
      analytical: 'Optimizing token spend and reducing wall-clock time through intelligent agent orchestration.',
      operational: "Securing AI platforms with bearer-token auth, Let's Encrypt TLS, and /health endpoint monitoring."
    }
  }
};

export const ROLE_ORDER = ['AISolutionsEngineer', 'TAM', 'CSE', 'SE', 'DataAnalyst'];

export const CHART_LABELS = [['Technical', 'Proficiency'], ['Stakeholder', 'Strategy'], ['Analytical', 'Impact'], ['Operational', 'Excellence']];

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
      'Refine to highlight the "Last Mile" of AI, your pedigree at Apple/eGain, and your hands-on work with Finsurf.net.',
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
