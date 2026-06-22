import { Calendar, Clock } from 'lucide-react';
import styles from '../EmployeeDetails.module.css';

export default function OverviewTab() {
  return (
    <div className={styles.contentGrid}>
      <div className={styles.leftColumn}>
        <div className={styles.topRowStats}>
          <div className={`${styles.card} ${styles.flexCard}`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBox} ${styles.blueBox}`}><Calendar size={20}/></div>
              <span className={styles.cardTitle}>ATTENDANCE & LEAVE</span>
            </div>
            <div className={styles.statSplit}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>RATE</span>
                <span className={styles.statValue}>96%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>BALANCE</span>
                <span className={styles.statValue}>14d</span>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.flexCard}`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBox} ${styles.yellowBox}`}><Clock size={20}/></div>
              <span className={styles.cardTitle}>OT SUMMARY</span>
            </div>
            <div className={styles.statSplit}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>HOURS</span>
                <span className={styles.statValue}>12.5h</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>STATUS</span>
                <span className={styles.statTextGreen}>PAID</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> PRIMARY INFO
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoGroup}><label>DATE OF BIRTH</label><span>1990-05-15</span></div>
            <div className={styles.infoGroup}><label>PHONE</label><span>+1 234 567 890</span></div>
            <div className={styles.infoGroup}><label>ADDRESS</label><span>123 Tech Street, CA</span></div>
            <div className={styles.infoGroup}><label>JOINING DATE</label><span>2022-01-10</span></div>
          </div>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.redLine}></div> EMERGENCY
          </div>
          <div className={styles.emergencyBox}>
            <h4>Jane Doe</h4><p>(+1 234 567 891)</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <div className={styles.blueLine}></div> SKILLS
          </div>
          <div className={styles.skillsContainer}>
            <span className={styles.skillBadge}>REACT</span>
            <span className={styles.skillBadge}>TYPESCRIPT</span>
          </div>
        </div>
      </div>
    </div>
  );
}