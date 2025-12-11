<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Career Relaunch Strategy | S. Nediyanchath</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

    <!-- Custom Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        stone: {
                            50: '#fafaf9',
                            100: '#f5f5f4',
                            800: '#292524',
                            900: '#1c1917',
                        },
                        teal: {
                            600: '#0d9488',
                            700: '#0f766e',
                        },
                        amber: {
                            500: '#f59e0b',
                        }
                    }
                }
            }
        }
    </script>

    <style>
        /* Chart Container Styling - Mandatory Requirement */
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px; /* Constraint */
            margin-left: auto;
            margin-right: auto;
            height: 400px;
            max-height: 400px;
        }

        body {
            background-color: #fafaf9; /* Warm neutral background */
            color: #292524;
        }

        .card {
            background-color: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e7e5e4;
        }

        .nav-item.active {
            background-color: #0d9488; /* teal-600 */
            color: white;
        }
        
        /* Smooth transitions */
        .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
        }
    </style>

    <!-- Chosen Palette: Warm Neutrals (Stone) with Teal Accents for Professionalism and Calm -->
    <!-- Application Structure Plan: 
         1. Dashboard Header: Introduction and Progress Overview.
         2. Tabbed/Sectioned Layout:
            - "The Narrative": Interactive guide to explaining the gap (The Three Rs).
            - "Target Roles": Radar chart visualizing skill fit for recommended jobs.
            - "Resume Fix": Visual example of the new resume section.
            - "Launch Checklist": Interactive todo list for mandatory steps.
         3. Logic: Vanilla JS to handle chart interactions, tab switching, and checklist state.
    -->
    <!-- Visualization & Content Choices:
         - Radar Chart: Chosen to compare the 4 target roles across 4 key skill dimensions (Tech, Client, Data, Sales). 
           Justification: Shows multidimensional fit better than a bar chart.
         - Interactive Cards: Used for the "Three Rs" to allow users to focus on one part of the answer at a time.
         - Progress Bar: Visual feedback for the checklist to encourage action.
         - CONFIRMATION: NO SVG graphics used. NO Mermaid JS used.
    -->
</head>
<body class="antialiased min-h-screen flex flex-col">

    <!-- Header -->
    <header class="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <span class="text-2xl font-bold text-teal-700">🚀 Career Relaunch</span>
                <span class="hidden sm:block text-stone-500 text-sm border-l border-stone-300 pl-3">Strategic Plan for S. Nediyanchath</span>
            </div>
            <div class="flex items-center space-x-4">
                <div class="text-right hidden sm:block">
                    <div class="text-xs text-stone-500 uppercase font-semibold">Readiness Score</div>
                    <div class="font-bold text-teal-600" id="readiness-score">0%</div>
                </div>
                <div class="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div id="header-progress" class="h-full bg-teal-600 transition-all w-0"></div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Grid -->
    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <!-- Intro Section -->
        <section class="mb-8 text-center sm:text-left">
            <h1 class="text-3xl font-bold text-stone-900 mb-2">Strategy: Turning the Gap into Growth</h1>
            <p class="text-lg text-stone-600 max-w-3xl">
                The objective is to reframe the 2.5-year period (July 2023 - Present) from "unemployment" to "deliberate investment." 
                Use this dashboard to master your narrative, understand your target roles, and execute your re-entry plan.
            </p>
        </section>

        <!-- Navigation Tabs -->
        <div class="flex flex-wrap gap-2 mb-8 border-b border-stone-200 pb-1">
            <button onclick="switchTab('roles')" id="tab-roles" class="nav-item active px-6 py-2 rounded-t-lg font-medium text-sm transition-colors hover:bg-stone-100 hover:text-teal-700">Target Roles</button>
            <button onclick="switchTab('narrative')" id="tab-narrative" class="nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors hover:bg-stone-100 hover:text-teal-700">Gap Narrative</button>
            <button onclick="switchTab('resume')" id="tab-resume" class="nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors hover:bg-stone-100 hover:text-teal-700">Resume Strategy</button>
            <button onclick="switchTab('checklist')" id="tab-checklist" class="nav-item px-6 py-2 rounded-t-lg font-medium text-sm transition-colors hover:bg-stone-100 hover:text-teal-700">Launchpad Checklist</button>
        </div>

        <!-- TAB 1: TARGET ROLES (Radar Chart) -->
        <div id="view-roles" class="view-section grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Chart Column -->
            <div class="lg:col-span-1 card p-6 flex flex-col justify-center">
                <h2 class="text-xl font-bold mb-4 text-center">Role Compatibility Matrix</h2>
                <div class="chart-container">
                    <canvas id="roleRadarChart"></canvas>
                </div>
                <p class="text-xs text-stone-400 text-center mt-4">Click on the chart points or legend to filter.</p>
            </div>

            <!-- Details Column -->
            <div class="lg:col-span-2 card p-6 bg-stone-50">
                <div id="role-detail-container">
                    <div class="flex items-center justify-between mb-4">
                        <h2 id="role-title" class="text-2xl font-bold text-teal-700">Select a Role</h2>
                        <span id="role-badge" class="px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-600">Explore</span>
                    </div>
                    <p id="role-rationale" class="text-stone-700 mb-6 text-lg leading-relaxed">
                        Click on the chart to see why these roles are the best fit for your mix of Technical Support, Account Management, and Data Analysis skills.
                    </p>
                    
                    <div class="bg-white p-4 rounded-lg border border-stone-200 mb-4">
                        <h3 class="font-bold text-stone-900 mb-2 border-b pb-2">🎯 Why You're a Great Fit</h3>
                        <p id="role-fit" class="text-stone-600">Select a role to see the rationale.</p>
                    </div>

                    <div class="bg-teal-50 p-4 rounded-lg border border-teal-100">
                        <h3 class="font-bold text-teal-900 mb-2 border-b border-teal-200 pb-2">⚡ Actionable Skills to Highlight</h3>
                        <ul id="role-skills" class="list-disc list-inside text-teal-800 space-y-1">
                            <li>Select a role...</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 2: GAP NARRATIVE (The Three Rs) -->
        <div id="view-narrative" class="view-section hidden grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="col-span-1 space-y-6">
                <div class="card p-6 border-l-4 border-teal-500">
                    <h3 class="text-lg font-bold text-teal-700 mb-2">1. Acknowledge</h3>
                    <p class="text-stone-600 mb-4 text-sm">Briefly state the timeline. Do not apologize. Be factual.</p>
                    <div class="bg-stone-100 p-4 rounded italic text-stone-800">
                        "After a successful tenure at eGain that ended in early-2024, I made the strategic decision to take time for professional re-evaluation and focused skill enhancement."
                    </div>
                </div>

                <div class="card p-6 border-l-4 border-amber-500">
                    <h3 class="text-lg font-bold text-amber-600 mb-2">2. Reframe</h3>
                    <p class="text-stone-600 mb-4 text-sm">Shift focus from "not working" to "active upskilling".</p>
                    <div class="bg-stone-100 p-4 rounded italic text-stone-800">
                        "During this time, I actively pursued advanced specialization in AI-driven data analysis and full-stack development. I mastered React and Node.js to move from product support to solution implementation."
                    </div>
                </div>

                <div class="card p-6 border-l-4 border-teal-500">
                    <h3 class="text-lg font-bold text-teal-700 mb-2">3. Relate</h3>
                    <p class="text-stone-600 mb-4 text-sm">Connect your study to the specific job you are applying for.</p>
                    <div class="bg-stone-100 p-4 rounded italic text-stone-800">
                        "These initiatives are why I am excited about this [Role Name]. The skills I’ve gained allow me to step in on day one and drive value by [Specific Duty]."
                    </div>
                </div>
            </div>

            <div class="col-span-1 card p-8 flex flex-col items-center justify-center text-center bg-stone-800 text-white">
                <div class="text-6xl mb-4">🎤</div>
                <h2 class="text-2xl font-bold mb-4">Interview Simulator</h2>
                <p class="text-stone-300 mb-6">"Can you explain the gap in your resume since 2023?"</p>
                <button onclick="simulateInterview()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                    Show Complete Answer
                </button>
                <div id="full-answer" class="mt-6 text-left bg-stone-700 p-4 rounded-lg hidden text-sm leading-relaxed border border-stone-600">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>

        <!-- TAB 3: RESUME STRATEGY -->
        <div id="view-resume" class="view-section hidden">
            <div class="card p-8 mb-8">
                <h2 class="text-2xl font-bold mb-4">The "Growth Initiatives" Section</h2>
                <p class="text-stone-600 mb-6">
                    Do not leave the gap blank. Add this section immediately below your "Work Experience" or "Skills" section on your resume.
                </p>

                <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm whitespace-nowrap">
                        <thead class="uppercase tracking-wider border-b-2 border-stone-200 bg-stone-100 text-stone-600 font-bold">
                            <tr>
                                <th scope="col" class="px-6 py-4">Category</th>
                                <th scope="col" class="px-6 py-4">Resume Content (Copy This)</th>
                            </tr>
                        </thead>
                        <tbody class="border-b border-stone-200 bg-white">
                            <tr class="border-b hover:bg-stone-50">
                                <td class="px-6 py-4 font-bold text-teal-700">Skill Validation</td>
                                <td class="px-6 py-4">
                                    <div class="font-bold">Advanced Data Science & Web Development Training</div>
                                    <div class="text-stone-500 text-xs mt-1">Completed advanced courses in Python (Pandas) and React/Node.js. Built full-stack weather app.</div>
                                </td>
                            </tr>
                            <tr class="border-b hover:bg-stone-50">
                                <td class="px-6 py-4 font-bold text-teal-700">Certification</td>
                                <td class="px-6 py-4">
                                    <div class="font-bold">Cloud/IT Certifications (In Progress)</div>
                                    <div class="text-stone-500 text-xs mt-1">Pursuing AWS Cloud Practitioner / CompTIA Security+ to solidify technical grounding.</div>
                                </td>
                            </tr>
                            <tr class="hover:bg-stone-50">
                                <td class="px-6 py-4 font-bold text-teal-700">Consulting</td>
                                <td class="px-6 py-4">
                                    <div class="font-bold">Freelance Data Analysis</div>
                                    <div class="text-stone-500 text-xs mt-1">Provided freelance data visualization services utilizing SQL/Excel for trend analysis.</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- TAB 4: CHECKLIST -->
        <div id="view-checklist" class="view-section hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="card p-6">
                    <h2 class="text-xl font-bold mb-4 flex items-center">
                        <span class="bg-teal-100 text-teal-800 p-2 rounded mr-3">📋</span> 
                        Mandatory Actions
                    </h2>
                    <div class="space-y-4" id="checklist-container">
                        <!-- Checklist Item 1 -->
                        <label class="flex items-start space-x-3 cursor-pointer p-3 hover:bg-stone-50 rounded transition-colors">
                            <input type="checkbox" onchange="updateProgress()" class="form-checkbox h-5 w-5 text-teal-600 mt-1">
                            <div>
                                <span class="font-bold text-stone-800">Optimize LinkedIn Headline</span>
                                <p class="text-xs text-stone-500 mt-1">Change to: "Technical Account Manager | Customer Success Engineer | Data-Driven Solutions Consultant"</p>
                            </div>
                        </label>
                         <!-- Checklist Item 2 -->
                         <label class="flex items-start space-x-3 cursor-pointer p-3 hover:bg-stone-50 rounded transition-colors">
                            <input type="checkbox" onchange="updateProgress()" class="form-checkbox h-5 w-5 text-teal-600 mt-1">
                            <div>
                                <span class="font-bold text-stone-800">Update LinkedIn "About"</span>
                                <p class="text-xs text-stone-500 mt-1">Add paragraph explicitly mentioning recent self-study and full-stack projects.</p>
                            </div>
                        </label>
                         <!-- Checklist Item 3 -->
                         <label class="flex items-start space-x-3 cursor-pointer p-3 hover:bg-stone-50 rounded transition-colors">
                            <input type="checkbox" onchange="updateProgress()" class="form-checkbox h-5 w-5 text-teal-600 mt-1">
                            <div>
                                <span class="font-bold text-stone-800">Audit Portfolio Project</span>
                                <p class="text-xs text-stone-500 mt-1">Ensure <code>weather-and-billboard</code> is live, bug-free, and code is clean on GitHub.</p>
                            </div>
                        </label>
                         <!-- Checklist Item 4 -->
                         <label class="flex items-start space-x-3 cursor-pointer p-3 hover:bg-stone-50 rounded transition-colors">
                            <input type="checkbox" onchange="updateProgress()" class="form-checkbox h-5 w-5 text-teal-600 mt-1">
                            <div>
                                <span class="font-bold text-stone-800">Update Resume Structure</span>
                                <p class="text-xs text-stone-500 mt-1">Insert "Growth Initiatives" section and reorder skills based on target role.</p>
                            </div>
                        </label>
                         <!-- Checklist Item 5 -->
                         <label class="flex items-start space-x-3 cursor-pointer p-3 hover:bg-stone-50 rounded transition-colors">
                            <input type="checkbox" onchange="updateProgress()" class="form-checkbox h-5 w-5 text-teal-600 mt-1">
                            <div>
                                <span class="font-bold text-stone-800">Networking: 3 Info Interviews</span>
                                <p class="text-xs text-stone-500 mt-1">Reach out to TAMs/CSEs. Ask about their team structure and gap perceptions.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="card p-6 bg-teal-900 text-white flex flex-col justify-center items-center text-center">
                    <h2 class="text-3xl font-bold mb-2" id="card-progress-text">0%</h2>
                    <p class="text-teal-200 uppercase tracking-widest text-sm mb-6">Readiness</p>
                    <div class="w-full bg-teal-800 rounded-full h-4 overflow-hidden">
                        <div id="card-progress-bar" class="bg-amber-500 h-full w-0 transition-all"></div>
                    </div>
                    <p class="mt-6 text-sm text-teal-100 italic">
                        "The best time to plant a tree was 20 years ago. The second best time is now."
                    </p>
                </div>
            </div>
        </div>

    </main>

    <footer class="bg-white border-t border-stone-200 mt-auto py-6">
        <div class="max-w-7xl mx-auto px-4 text-center text-stone-500 text-sm">
            Generated Plan for Sachin Nediyanchath based on Employment Gap Strategy
        </div>
    </footer>

    <!-- Logic -->
    <script>
        // Data derived from the Source Report and Resume Analysis
        const rolesData = {
            "TAM": {
                title: "Technical Account Manager (TAM)",
                fit: "Natural progression from your Account Manager & Implementation Engineer roles. You handle client relationships while leveraging technical knowledge.",
                skills: ["Stakeholder Management", "Root Cause Analysis", "Custom Reporting / SQL", "API Knowledge"],
                badge: "High Fit",
                scores: [7, 9, 5, 8] // Tech, Client, Data, Sales
            },
            "CSE": {
                title: "Customer Success Engineer (CSE)",
                fit: "Focused on post-sale outcomes. Your experience developing custom reporting tools to prove ROI matches this perfectly.",
                skills: ["AI-driven Insights", "Trend Identification", "Client Training", "Retention Strategy"],
                badge: "High Fit",
                scores: [6, 9, 8, 6]
            },
            "SE": {
                title: "Sales Engineer / Solutions Consultant",
                fit: "You understand client needs and can architect solutions. SEs support sales with technical demos and tailored solutions.",
                skills: ["Cross-functional Coordination", "User Training", "Technical Demos", "Solution Architecture"],
                badge: "Med-High Fit",
                scores: [8, 8, 5, 9]
            },
            "DataAnalyst": {
                title: "Data Analyst (SaaS/Tech)",
                fit: "Your Python/SQL background makes this a strong play. Domain experience in retention gives you an edge over general analysts.",
                skills: ["Data Interpretation", "Custom Reporting", "AI/Automation", "Pandas/NumPy"],
                badge: "Technical Fit",
                scores: [9, 4, 10, 3]
            }
        };

        // --- CHART CONFIGURATION ---
        // Visualizing the "Fit" across 4 dimensions
        const ctx = document.getElementById('roleRadarChart').getContext('2d');
        const radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Technical Depth', 'Client Facing', 'Data Analysis', 'Sales/Growth'],
                datasets: [
                    {
                        label: 'Tech Account Mgr',
                        data: rolesData['TAM'].scores,
                        fill: true,
                        backgroundColor: 'rgba(13, 148, 136, 0.2)', // Teal-600
                        borderColor: '#0d9488',
                        pointBackgroundColor: '#0d9488',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#0d9488'
                    },
                    {
                        label: 'Data Analyst',
                        data: rolesData['DataAnalyst'].scores,
                        fill: true,
                        backgroundColor: 'rgba(245, 158, 11, 0.2)', // Amber-500
                        borderColor: '#f59e0b',
                        pointBackgroundColor: '#f59e0b',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#f59e0b',
                        hidden: true // Hide initially to reduce clutter
                    },
                    {
                        label: 'Customer Success Eng',
                        data: rolesData['CSE'].scores,
                        fill: true,
                        backgroundColor: 'rgba(75, 85, 99, 0.2)', // Gray
                        borderColor: '#4b5563',
                        pointBackgroundColor: '#4b5563',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4b5563',
                        hidden: true
                    },
                    {
                        label: 'Sales Engineer',
                        data: rolesData['SE'].scores,
                        fill: true,
                        backgroundColor: 'rgba(220, 38, 38, 0.2)', // Red
                        borderColor: '#dc2626',
                        pointBackgroundColor: '#dc2626',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#dc2626',
                        hidden: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: { display: false } // Cleaner look
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                onClick: (e, activeEls) => {
                    // Logic to update details on click
                    if (activeEls.length > 0) {
                        const datasetIndex = activeEls[0].datasetIndex;
                        const label = radarChart.data.datasets[datasetIndex].label;
                        
                        // Map label back to key
                        let key = 'TAM';
                        if (label.includes('Data')) key = 'DataAnalyst';
                        else if (label.includes('Success')) key = 'CSE';
                        else if (label.includes('Sales')) key = 'SE';
                        
                        updateRoleDetail(key);
                    }
                }
            }
        });

        // --- UI LOGIC ---

        function updateRoleDetail(roleKey) {
            const data = rolesData[roleKey];
            document.getElementById('role-title').innerText = data.title;
            document.getElementById('role-rationale').innerText = data.fit;
            document.getElementById('role-fit').innerText = data.fit;
            document.getElementById('role-badge').innerText = data.badge;
            
            // Skills list
            const skillsList = document.getElementById('role-skills');
            skillsList.innerHTML = '';
            data.skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerText = skill;
                skillsList.appendChild(li);
            });
        }

        function switchTab(tabId) {
            // Hide all sections
            document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
            // Show selected
            document.getElementById(`view-${tabId}`).classList.remove('hidden');
            
            // Update Tab Styles
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active', 'bg-teal-600', 'text-white'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.add('hover:bg-stone-100'));
            
            const activeTab = document.getElementById(`tab-${tabId}`);
            activeTab.classList.add('active');
            activeTab.classList.remove('hover:bg-stone-100');
        }

        function simulateInterview() {
            const answerDiv = document.getElementById('full-answer');
            answerDiv.classList.remove('hidden');
            answerDiv.innerHTML = `
                <p class="mb-2"><strong class="text-teal-400">You:</strong> "After a successful tenure at eGain that ended in mid-2023, I made the strategic decision to take time for professional re-evaluation and focused skill enhancement."</p>
                <p class="mb-2"><strong class="text-teal-400">You:</strong> "During this time, I actively pursued advanced specialization in AI-driven data analysis and modern full-stack development. My goal was to move from supporting the product to being a key resource for solution implementation."</p>
                <p><strong class="text-teal-400">You:</strong> "These initiatives are why I am so excited about this role. The skills I’ve gained allow me to step in on day one and drive immediate value."</p>
            `;
        }

        function updateProgress() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const total = checkboxes.length;
            let checked = 0;
            checkboxes.forEach(box => {
                if (box.checked) checked++;
            });

            const percent = Math.round((checked / total) * 100);
            
            // Update Header Bar
            document.getElementById('header-progress').style.width = `${percent}%`;
            document.getElementById('readiness-score').innerText = `${percent}%`;

            // Update Card Bar
            document.getElementById('card-progress-text').innerText = `${percent}%`;
            document.getElementById('card-progress-bar').style.width = `${percent}%`;
        }

        // Initialize with TAM details
        updateRoleDetail('TAM');

    </script>
</body>
</html>
