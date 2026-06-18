import {
  BriefcaseBusiness,
  CalendarDays,
  Users2,
  Clock3,
} from 'lucide-react';
import StatCard from '../../Component/Common/StatCard';
import UpcomingInterviews from '../../Component/wedges/UpcomingInterviews';
import styles from './Dashboard.module.css';

const stats = [
  { title: 'Total Employees', value: '128', trend: 8, trendText: 'this month', icon: Users2 },
  { title: 'Active Requests', value: '24', trend: 6, trendText: 'pending approval', icon: CalendarDays },
  { title: 'Open Positions', value: '09', trend: 9, trendText: 'hiring this week', icon: BriefcaseBusiness },
  { title: 'Late Check-ins', value: '03', trend: -3, trendText: 'today so far', icon: Clock3 },
];

export default function Dashboard() {
  return (
    <div className={styles.page}>
      
      {/* 1. Top Stat Cards */}
      <section className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendText={stat.trendText}
          />
        ))}
      </section>

      {/* 2. Main Content Split Grid */}
      <section className={styles.mainContentGrid}>
        
        {/* Left Column (Wider - For data tables) */}
        <div className={styles.leftColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Employee Performance</h2>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
            <div className={styles.placeholderTable}>
              <p>Employee Performance Table goes here...</p>
            </div>
          </div>
        </div>

        {/* Right Column (Narrower - For widgets) */}
        <div className={styles.rightColumn}>
          
          <UpcomingInterviews />

          {/* Department Snapshot Widget */}
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Department snapshot</h2>
              <span>Headcount</span>
            </div>
            <div className={styles.departmentList}>
              <div className={styles.deptItem}>
                <strong>Operations</strong>
                <span>42 employees</span>
              </div>
              <div className={styles.deptItem}>
                <strong>Sales</strong>
                <span>31 employees</span>
              </div>
              <div className={styles.deptItem}>
                <strong>Engineering</strong>
                <span>28 employees</span>
              </div>
              <div className={styles.deptItem}>
                <strong>HR & Admin</strong>
                <span>14 employees</span>
              </div>
            </div>
          </article>

        </div>
      </section>
    </div>
  );
}