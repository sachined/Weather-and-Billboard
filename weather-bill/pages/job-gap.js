import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function JobGap() {
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState('TAM');
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const rolesData = {
    TAM: {
      title: 'Technical Account Manager (TAM)',
      fit: 'Natural progression from your Account Manager & Implementation Engineer roles. You handle client relationships while leveraging technical knowledge.',
      skills: ['Stakeholder Management', 'Root Cause Analysis', 'Custom Reporting / SQL', 'API Knowledge'],
      badge: 'High Fit',
      scores: [7, 9, 5, 8],
    },
    CSE: {
      title: 'Customer Success Engineer (CSE)',
      fit: 'Focused on post-sale outcomes. Your experience developing custom reporting tools to prove ROI matches this perfectly.',
      skills: ['AI-driven Insights', 'Trend Identification', 'Client Training', 'Retention Strategy'],
      badge: 'High Fit',
      scores: [6, 9, 8, 6],
    },
    SE: {
      title: 'Sales Engineer / Solutions Consultant',
      fit: 'You understand client needs and can architect solutions. SEs support sales with technical demos and tailored solutions.',
      skills: ['Cross-functional Coordination', 'User Training', 'Technical Demos', 'Solution Architecture'],
      badge: 'Med-High Fit',
      scores: [8, 8, 5, 9],
    },
    DataAnalyst: {
      title: 'Data Analyst (SaaS/Tech)',
      fit: 'Your Python/SQL background makes this a strong play. Domain experience in retention gives you an edge over general analysts.',
      skills: ['Data Interpretation', 'Custom Reporting', 'AI/Automation', 'Pandas/NumPy'],
      badge: 'Technical Fit',
      scores: [9, 4, 10, 3],
    },
  };

  const checklistItems = [
    {
      id: 1,
      title: 'Optimize LinkedIn Headline',
      description:
        'Change to: "Technical Account Manager | Customer Success Engineer | Data-Driven Solutions Consultant"',
    },
    {
      id: 2,
      title: 'Update LinkedIn "About"',
      description:
        'Add paragraph explicitly mentioning recent self-study and full-stack projects.',
    },
    {
      id: 3,
      title: 'Audit Portfolio Project',
      description: 'Ensure weather-and-billboard is live, bug-free, and code is clean on GitHub.',
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

  // Initialize Chart.js on mount
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Technical Depth', 'Client Facing', 'Data Analysis', 'Sales/Growth'],
        datasets: [
          {
            label: 'Tech Account Mgr',
            data: rolesData.TAM.scores,
            fill: true,
            backgroundColor: 'rgba(13, 148, 136, 0.2)',
            borderColor: '#0d9488',
            pointBackgroundColor: '#0d9488',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#0d9488',
          },
          {
            label: 'Data Analyst',
            data: rolesData.DataAnalyst.scores,
            fill: true,
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderColor: '#f59e0b',
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#f59e0b',
            hidden: true,
          },
          {
            label: 'Customer Success Eng',
            data: rolesData.CSE.scores,
            fill: true,
            backgroundColor: 'rgba(75, 85, 99, 0.2)',
            borderColor: '#4b5563',
            pointBackgroundColor: '#4b5563',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4b5563',
            hidden: true,
          },
          {
            label: 'Sales Engineer',
            data: rolesData.SE.scores,
            fill: true,
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            borderColor: '#dc2626',
            pointBackgroundColor: '#dc2626',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#dc2626',
            hidden: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: { display: false },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleChecklistChange = (id) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    const checked = Object.values(updated).filter(Boolean).length;
    setChecklistProgress(Math.round((checked / checklistItems.length) * 100));
  };

  const roleDetail = rolesData[selectedRole];

  return (
    <div className="antialiased min-h-screen flex flex-col bg-stone-50">
      <style>{`
        .chart-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          height: 400px;
          max-height: 400px;
        }
        .card {
          background-color: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e7e5e4;
        }
        .nav-item.active {
          background-color: #0d9488;
          color: white;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-teal-700">🚀 Career Relaunch</span>
            <span className="hidden sm:block text-stone-500 text-sm border-l border-stone-300 pl-3">
              Strategic Plan for S. Nediyanchath
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-stone-500 uppercase font-semibold">Readiness Score</div>
              <div className="font-bold text-teal-600">{checklistProgress}%</div>
            </div>
            <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all"
                style={{ width: `${checklistProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Intro Section */}
        <section className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Strategy: Turning the Gap into Growth
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl">
            The objective is to reframe the 2.5-year period (July 2023 - Present) from "unemployment"
            to "deliberate investment". Use this dashboard to master your narrative, understand your
            target roles, and execute your re-entry plan.
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 pb-1">
          <button
            onClick={() => setActiveTab('roles')}
            className={`nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === 'roles'
                ? 'active bg-teal-600 text-white'
                : 'hover:bg-stone-100 hover:text-teal-700'
            }`}
          >
            Target Roles
          </button>
          <button
            onClick={() => setActiveTab('narrative')}
            className={`nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === 'narrative'
                ? 'active bg-teal-600 text-white'
                : 'hover:bg-stone-100 hover:text-teal-700'
            }`}
          >
            Gap Narrative
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === 'resume'
                ? 'active bg-teal-600 text-white'
                : 'hover:bg-stone-100 hover:text-teal-700'
            }`}
          >
            Resume Strategy
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === 'checklist'
                ? 'active bg-teal-600 text-white'
                : 'hover:bg-stone-100 hover:text-teal-700'
            }`}
          >
            Launchpad Checklist
          </button>
        </div>

        {/* TAB 1: TARGET ROLES */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-1 card p-6 flex flex-col justify-center">
              <h2 className="text-xl font-bold mb-4 text-center">Role Compatibility Matrix</h2>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
              <p className="text-xs text-stone-400 text-center mt-4">
                Click on the chart legend to filter.
              </p>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 card p-6 bg-stone-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-teal-700">{roleDetail.title}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-600">
                  {roleDetail.badge}
                </span>
              </div>
              <p className="text-stone-700 mb-6 text-lg leading-relaxed">{roleDetail.fit}</p>

              <div className="bg-white p-4 rounded-lg border border-stone-200 mb-4">
                <h3 className="font-bold text-stone-900 mb-2 border-b pb-2">🎯 Why You're a Great Fit</h3>
                <p className="text-stone-600">{roleDetail.fit}</p>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h3 className="font-bold text-teal-900 mb-2 border-b border-teal-200 pb-2">
                  ⚡ Actionable Skills to Highlight
                </h3>
                <ul className="list-disc list-inside text-teal-800 space-y-1">
                  {roleDetail.skills.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* Role Selection Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                {Object.entries(rolesData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                      selectedRole === key
                        ? 'bg-teal-600 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {data.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GAP NARRATIVE */}
        {activeTab === 'narrative' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1 space-y-6">
              <div className="card p-6 border-l-4 border-teal-500">
                <h3 className="text-lg font-bold text-teal-700 mb-2">1. Acknowledge</h3>
                <p className="text-stone-600 mb-4 text-sm">
                  Briefly state the timeline. Do not apologize. Be factual.
                </p>
                <div className="bg-stone-100 p-4 rounded italic text-stone-800">
                  "After a successful tenure at eGain that ended in early-2024, I made the strategic
                  decision to take time for professional re-evaluation and focused skill enhancement."
                </div>
              </div>

              <div className="card p-6 border-l-4 border-amber-500">
                <h3 className="text-lg font-bold text-amber-600 mb-2">2. Reframe</h3>
                <p className="text-stone-600 mb-4 text-sm">
                  Shift focus from "not working" to "active upskilling".
                </p>
                <div className="bg-stone-100 p-4 rounded italic text-stone-800">
                  "During this time, I actively pursued advanced specialization in AI-driven data
                  analysis and full-stack development. I mastered React and Node.js to move from
                  product support to solution implementation."
                </div>
              </div>

              <div className="card p-6 border-l-4 border-teal-500">
                <h3 className="text-lg font-bold text-teal-700 mb-2">3. Relate</h3>
                <p className="text-stone-600 mb-4 text-sm">
                  Connect your study to the specific job you are applying for.
                </p>
                <div className="bg-stone-100 p-4 rounded italic text-stone-800">
                  "These initiatives are why I am excited about this [Role Name]. The skills I've
                  gained allow me to step in on day one and drive value by [Specific Duty]."
                </div>
              </div>
            </div>

            <div className="col-span-1 card p-8 flex flex-col items-center justify-center text-center bg-stone-800 text-white">
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold mb-4">Interview Simulator</h2>
              <p className="text-stone-300 mb-6">"Can you explain the gap in your resume since 2023?"</p>
              <button
                onClick={() => setShowFullAnswer(!showFullAnswer)}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
              >
                {showFullAnswer ? 'Hide' : 'Show'} Complete Answer
              </button>
              {showFullAnswer && (
                <div className="mt-6 text-left bg-stone-700 p-4 rounded-lg text-sm leading-relaxed border border-stone-600">
                  <p className="mb-2">
                    <strong className="text-teal-400">You:</strong> "After a successful tenure at
                    eGain that ended in mid-2023, I made the strategic decision to take time for
                    professional re-evaluation and focused skill enhancement."
                  </p>
                  <p className="mb-2">
                    <strong className="text-teal-400">You:</strong> "During this time, I actively
                    pursued advanced specialization in AI-driven data analysis and modern full-stack
                    development. My goal was to move from supporting the product to being a key
                    resource for solution implementation."
                  </p>
                  <p>
                    <strong className="text-teal-400">You:</strong> "These initiatives are why I am
                    so excited about this role. The skills I've gained allow me to step in on day
                    one and drive immediate value."
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RESUME STRATEGY */}
        {activeTab === 'resume' && (
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">The "Growth Initiatives" Section</h2>
            <p className="text-stone-600 mb-6">
              Do not leave the gap blank. Add this section immediately below your "Work Experience"
              or "Skills" section on your resume.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase tracking-wider border-b-2 border-stone-200 bg-stone-100 text-stone-600 font-bold">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Resume Content (Copy This)
                    </th>
                  </tr>
                </thead>
                <tbody className="border-b border-stone-200 bg-white">
                  <tr className="border-b hover:bg-stone-50">
                    <td className="px-6 py-4 font-bold text-teal-700">Skill Validation</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">Advanced Data Science & Web Development Training</div>
                      <div className="text-stone-500 text-xs mt-1">
                        Completed advanced courses in Python (Pandas) and React/Node.js. Built
                        full-stack weather app.
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-stone-50">
                    <td className="px-6 py-4 font-bold text-teal-700">Certification</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">Cloud/IT Certifications (In Progress)</div>
                      <div className="text-stone-500 text-xs mt-1">
                        Pursuing AWS Cloud Practitioner / CompTIA Security+ to solidify technical
                        grounding.
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="px-6 py-4 font-bold text-teal-700">Consulting</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">Freelance Data Analysis</div>
                      <div className="text-stone-500 text-xs mt-1">
                        Provided freelance data visualization services utilizing SQL/Excel for
                        trend analysis.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-teal-100 text-teal-800 p-2 rounded mr-3">📋</span>
                Mandatory Actions
              </h2>
              <div className="space-y-4">
                {checklistItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-stone-50 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={() => handleChecklistChange(item.id)}
                      className="h-5 w-5 text-teal-600 mt-1"
                    />
                    <div>
                      <span className="font-bold text-stone-800">{item.title}</span>
                      <p className="text-xs text-stone-500 mt-1">{item.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-teal-900 text-white flex flex-col justify-center items-center text-center">
              <h2 className="text-3xl font-bold mb-2">{checklistProgress}%</h2>
              <p className="text-teal-200 uppercase tracking-widest text-sm mb-6">Readiness</p>
              <div className="w-full bg-teal-800 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${checklistProgress}%` }}
                ></div>
              </div>
              <p className="mt-6 text-sm text-teal-100 italic">
                "The best time to plant a tree was 20 years ago. The second best time is now."
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-500 text-sm">
          Generated Plan for Sachin Nediyanchath based on Employment Gap Strategy
        </div>
      </footer>
    </div>
  );
}