import Link from 'next/link';
import { Terminal, Bot } from 'lucide-react';
import styles from '../styles/ProjectLineage.module.css';

export default function ProjectLineage() {
  return (
    <div className={styles.container}>
      <p className={styles.eyebrow}>Project evolution</p>
      <div className={styles.flow}>
        {/* WikiSurf */}
        <a
          href="https://github.com/sachined/WikiSurf-AI_Agent"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.node}
        >
          <div className={styles.iconBox}>
            <Terminal size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className={styles.nodeName}>WikiSurf</p>
            <p className={styles.nodeDesc}>LangChain · ReAct · CLI</p>
          </div>
        </a>

        {/* Arrow */}
        <div className={styles.arrow} aria-hidden="true">
          <div className={styles.arrowLine} />
          <span className={styles.arrowLabel}>evolved into</span>
          <div className={styles.arrowLine} />
          <span className={styles.arrowHead}>→</span>
        </div>

        {/* FinSurf */}
        <Link href="/finsurf" className={styles.node}>
          <div className={`${styles.iconBox} ${styles.iconBoxFeatured}`}>
            <Bot size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className={styles.nodeName}>FinSurf AI</p>
            <p className={styles.nodeDesc}>LangGraph · Multi-agent · Live</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
