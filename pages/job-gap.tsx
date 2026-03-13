import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { ROLES_DATA, ROLE_ORDER, CHECKLIST_ITEMS } from '@/lib/roles';
import { SITE_NAME } from '@/lib/constants';
import RoleSelection from '@/components/CareerRoadmap/RoleSelection';
import RoleDetails from '@/components/CareerRoadmap/RoleDetails';
import TechnicalNarrative from '@/components/CareerRoadmap/TechnicalNarrative';
import ImplementationChecklist from '@/components/CareerRoadmap/ImplementationChecklist';
import { useChecklist } from '@/hooks/useChecklist';
import styles from '@/styles/JobGap.module.css';

export default function JobGap() {
  const [isLocal, setIsLocal] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState('AISolutionsEngineer');
  const detailsRef = useRef<HTMLDivElement>(null);

  const { checkedItems, progress, toggleItem } = useChecklist(CHECKLIST_ITEMS.length);

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsLocal(true);
    }
  }, []);

  const handleRoleSelect = (key: string) => {
    setSelectedRole(key);
    if (window.innerWidth < 1024 && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Layout>
      <Head>
        <title>{`Technical Roadmap & Growth - ${SITE_NAME}`}</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Technical Roadmap & Growth</h1>
          <p className={styles.pageSubtitle}>{SITE_NAME} | Technical Strategy</p>
        </header>

        {/* Tab Navigation */}
        <div 
          role="tablist"
          aria-label="Technical Roadmap Sections"
          className={styles.tabList}
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
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
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
            <div className={styles.grid}>
              <RoleSelection 
                roles={ROLES_DATA}
                roleOrder={ROLE_ORDER}
                selectedRole={selectedRole}
                onSelectRole={handleRoleSelect}
              />
              <div ref={detailsRef}>
                <RoleDetails 
                  role={ROLES_DATA[selectedRole]}
                />
              </div>
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
