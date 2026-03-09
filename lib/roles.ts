export interface RoleInfo {
  title: string;
  fit: string;
  skills: string[];
  badge: string;
  scores: number[];
  chartDescription: string;
}

export interface RolesData {
  [key: string]: RoleInfo;
}

export const ROLES_DATA: RolesData = {
  TAM: {
    title: 'Technical Account Manager (TAM)',
    fit: 'Natural progression from your Account Manager & Implementation Engineer roles. You handle client relationships while leveraging technical knowledge.',
    skills: ['Stakeholder Management', 'Root Cause Analysis', 'Custom Reporting / SQL', 'API Knowledge'],
    badge: 'High Fit',
    scores: [8, 9, 6, 7], // Tech, Stakeholder, Analytical, Operational
    chartDescription: 'Highlights the high balance between stakeholder strategy and technical proficiency needed to manage complex client accounts.',
  },
  CSE: {
    title: 'Customer Success Engineer (CSE)',
    fit: 'Focused on post-sale outcomes. Your experience developing custom reporting tools to prove ROI matches this perfectly.',
    skills: ['AI-driven Insights', 'Trend Identification', 'Client Training', 'Retention Strategy'],
    badge: 'High Fit',
    scores: [7, 9, 8, 6],
    chartDescription: 'Emphasizes analytical impact and stakeholder strategy, focusing on driving retention through data-driven technical insights.',
  },
  SE: {
    title: 'Sales Engineer / Solutions Consultant',
    fit: 'You understand client needs and can architect solutions. SEs support sales with technical demos and tailored solutions.',
    skills: ['Cross-functional Coordination', 'User Training', 'Technical Demos', 'Solution Architecture'],
    badge: 'Med-High Fit',
    scores: [8, 8, 5, 9],
    chartDescription: 'Peaked in operational excellence and technical proficiency, reflecting the ability to architect and demonstrate custom solutions.',
  },
  DataAnalyst: {
    title: 'Data Analyst (SaaS/Tech)',
    fit: 'Your Python/SQL background makes this a strong play. Domain experience in retention gives you an edge over general analysts.',
    skills: ['Data Interpretation', 'Custom Reporting', 'AI/Automation', 'Pandas/NumPy'],
    badge: 'Technical Fit',
    scores: [9, 5, 10, 4],
    chartDescription: 'Maximized for analytical impact and technical proficiency, focusing on deep data interpretation and automation workflows.',
  },
  AISolutionsEngineer: {
    title: 'AI Solutions Engineer (Enterprise)',
    fit: 'Perfect match for your recent work on Finsurf.net and your 3+ years of experience in conversational AI and knowledge management.',
    skills: ['Conversational AI', 'Enterprise Implementation', 'API Integration', 'Knowledge Management', 'Python'],
    badge: 'Best Fit',
    scores: [10, 8, 9, 9],
    chartDescription: 'Reflects deep technical proficiency in AI and high operational excellence in enterprise deployments.',
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
