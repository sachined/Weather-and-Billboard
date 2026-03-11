import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import { ROLES_DATA, ROLE_ORDER, CHECKLIST_ITEMS } from '../lib/roles';
import { SITE_NAME } from '../lib/constants';
import RoleSelection from '../components/CareerRoadmap/RoleSelection';
import RoleDetails from '../components/CareerRoadmap/RoleDetails';
import TechnicalNarrative from '../components/CareerRoadmap/TechnicalNarrative';
import ImplementationChecklist from '../components/CareerRoadmap/ImplementationChecklist';
import { useChecklist } from '../hooks/useChecklist';

export default function JobGap() {
  const [isLocal, setIsLocal] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState('AISolutionsEngineer');
  const { checkedItems, progress, toggleItem } = useChecklist(CHECKLIST_ITEMS.length);

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsLocal(true);
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>{`Technical Roadmap & Growth - ${SITE_NAME}`}</title>
      </Head>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.8rem' }}>Technical Roadmap & Growth</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{SITE_NAME} | Technical Strategy</p>
        </header>

        {/* Tab Navigation */}
        <div 
          role="tablist"
          aria-label="Technical Roadmap Sections"
          style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2.5rem', overflowX: 'auto', gap: '1rem' }}
        >
          {[
            { id: 'roles', label: 'Core Expertise' },
            { id: 'analysis', label: 'Technical Journey' },
            ...(isLocal ? [
              { id: 'checklist', label: 'Action Checklist' }
            ] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '1rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div 
          id="panel-roles"
          role="tabpanel"
          aria-labelledby="tab-roles"
          hidden={activeTab !== 'roles'}
        >
          {activeTab === 'roles' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
              gap: '2rem',
              alignItems: 'stretch'
            }}>
              <RoleSelection 
                roles={ROLES_DATA}
                roleOrder={ROLE_ORDER}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
              />
              <RoleDetails 
                role={ROLES_DATA[selectedRole]}
              />
            </div>
          )}
        </div>

        <div 
          id="panel-analysis"
          role="tabpanel"
          aria-labelledby="tab-analysis"
          hidden={activeTab !== 'analysis'}
        >
          {activeTab === 'analysis' && <TechnicalNarrative />}
        </div>

        <div 
          id="panel-checklist"
          role="tabpanel"
          aria-labelledby="tab-checklist"
          hidden={activeTab !== 'checklist'}
        >
          {activeTab === 'checklist' && isLocal && (
            <ImplementationChecklist 
              items={CHECKLIST_ITEMS}
              checkedItems={checkedItems}
              progress={progress}
              onToggle={toggleItem}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
