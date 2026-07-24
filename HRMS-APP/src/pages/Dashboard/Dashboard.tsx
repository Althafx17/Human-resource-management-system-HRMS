import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Users2,
  ClipboardList,
  Building2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  UserPlus,
  Wallet,
  FileBarChart,
  Cake,
  Award,
  CircleDot
} from 'lucide-react';
import UpcomingInterviews from '../../components/widgets/UpcomingInterviews';
import styles from './Dashboard.module.css';
import { axiosInstance } from '../../apis/config/axiosInstance';

export default function Dashboard() {
  // ---> UNCHANGED: existing live metrics fetch, logic preserved exactly
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosInstance.get('/monthly-summary/');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // ---> UNCHANGED: department data, still hardcoded pending a real /departments/ hookup
  const departmentList = [
    { name: 'Operations', count: 42, color: '#1a3646' },
    { name: 'Sales & Marketing', count: 31, color: '#10b981' },
    { name: 'Engineering', count: 28, color: '#3b82f6' },
    { name: 'HR & Admin', count: 14, color: '#f59e0b' }
  ];

  // ---> UNCHANGED: performance table data
  const topPerformers = [
    { name: 'Rihan Naseer', role: 'Full Stack Developer', dept: 'Engineering', rating: 98, status: 'Exemplary', trend: 4.2, avatar: '' },
    { name: 'Sana', role: 'Sr. Developer', dept: 'Engineering', rating: 95, status: 'Excellent', trend: 3.5, avatar: '' },
    { name: 'Justin', role: 'UI/UX Designer', dept: 'Design', rating: 92, status: 'Excellent', trend: -1.2, avatar: '' },
    { name: 'John Smith', role: 'Finance Lead', dept: 'Finance', rating: 89, status: 'Good', trend: 2.1, avatar: '' }
  ];

  // Flagged gap: no /leave-approvals/pending-count/ endpoint exists yet per project docs.
  // Do not replace null with a hardcoded number just to "fill" the card.
  const pendingApprovals: number | null = null;

  const kpis = [
    {
      title: 'Total Employees',
      value: metrics ? String(metrics.total_employees) : '—',
      trend: 8,
      trendText: 'vs last month',
      icon: Users2,
      accentClass: styles.kpiAccentBlue
    },
    {
      title: 'On Leave Today',
      value: metrics ? String(metrics.on_leave_today) : '—',
      trend: 9,
      trendText: 'approved requests',
      icon: CalendarDays,
      accentClass: styles.kpiAccentAmber
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals === null ? 'N/A' : String(pendingApprovals),
      trend: null,
      trendText: 'not yet connected',
      icon: ClipboardList,
      accentClass: styles.kpiAccentRose
    },
    {
      title: 'Total Departments',
      value: String(departmentList.length),
      trend: null,
      trendText: 'active units',
      icon: Building2,
      accentClass: styles.kpiAccentIndigo
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading workspace analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* Welcome Hero Header */}
      <header className={styles.hero}>
        <div>
          <span className={styles.kicker}>SYSTEM REPORT</span>
          <h1 className={styles.title}>Workspace Analytics</h1>
          <p className={styles.description}>
            Monitor headcount, attendance, approvals, and performance indicators across your organization.
          </p>
        </div>
        <div className={styles.metaCard}>
          <span className={styles.metaLabel}>CURRENT PAYROLL MONTH</span>
          <strong className={styles.metaValue}>June 2026</strong>
          <span className={styles.metaHint}>Cycle ends in 4 days</span>
        </div>
      </header>

      {/* KPI Grid */}
      <section className={styles.statsGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.title} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <div className={`${styles.kpiIconWrap} ${kpi.accentClass}`}>
                <kpi.icon size={20} />
              </div>
              {kpi.trend !== null && (
                <span className={`${styles.kpiTrend} ${kpi.trend >= 0 ? styles.trendUp : styles.trendDown}`}>
                  {kpi.trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {kpi.trend >= 0 ? `+${kpi.trend}%` : `${kpi.trend}%`}
                </span>
              )}
            </div>
            <p className={styles.kpiLabel}>{kpi.title}</p>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiHint}>{kpi.trendText}</p>
          </div>
        ))}
      </section>

      {/* Visual Analytics Charts Section */}
      <section className={styles.chartsGrid}>
        {/* Attendance Area Chart */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Attendance Rate</h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Average 94.6% past 6 months</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={styles.statusDotActive}></span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>+1.8% Increase</span>
            </div>
          </div>

          <div style={{ marginTop: '16px', position: 'relative' }}>
            <svg viewBox="0 0 500 200" width="100%" height="200" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="attendance-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />

              <path
                d="M 0 140 Q 50 120 100 110 Q 150 100 200 135 Q 250 170 300 120 Q 350 70 400 90 Q 450 110 500 60 L 500 200 L 0 200 Z"
                fill="url(#attendance-grad)"
              />
              <path
                d="M 0 140 Q 50 120 100 110 Q 150 100 200 135 Q 250 170 300 120 Q 350 70 400 90 Q 450 110 500 60"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <circle cx="100" cy="110" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="200" cy="135" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="300" cy="120" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="400" cy="90" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="500" cy="60" r="6" fill="#10b981" stroke="#fff" strokeWidth="2.5" />

              <text x="0" y="195" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Jan</text>
              <text x="100" y="195" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Feb</text>
              <text x="200" y="195" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Mar</text>
              <text x="300" y="195" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Apr</text>
              <text x="400" y="195" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">May</text>
              <text x="500" y="195" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Jun</text>
            </svg>
          </div>
        </div>

        {/* Headcount Segmentation Donut */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Department Weight</h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Total Count: {departmentList.reduce((sum, d) => sum + d.count, 0)}
            </span>
          </div>

          <div className={styles.donutContainer}>
            <svg width="160" height="160" viewBox="0 0 160 160" className={styles.donutSvg}>
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#1a3646" strokeWidth="14"
                      strokeDasharray="126.2 345.5" strokeDashoffset="0" strokeLinecap="round" />
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#10b981" strokeWidth="14"
                      strokeDasharray="93.3 345.5" strokeDashoffset="-126.2" strokeLinecap="round" />
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#3b82f6" strokeWidth="14"
                      strokeDasharray="84 345.5" strokeDashoffset="-219.5" strokeLinecap="round" />
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#f59e0b" strokeWidth="14"
                      strokeDasharray="42 345.5" strokeDashoffset="-303.5" strokeLinecap="round" />
              <text x="80" y="78" textAnchor="middle" dominantBaseline="middle" className={styles.donutTextNum}>
                {departmentList.reduce((sum, d) => sum + d.count, 0)}
              </text>
              <text x="80" y="96" textAnchor="middle" dominantBaseline="middle" className={styles.donutTextLabel}>ACTIVE STAFF</text>
            </svg>

            <div className={styles.donutLegend}>
              {departmentList.map((d) => (
                <div key={d.name} className={styles.legendItem}>
                  <span className={styles.dot} style={{ backgroundColor: d.color }}></span>
                  <span className={styles.legendLabel}>{d.name} ({d.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split Grid */}
      <section className={styles.mainContentGrid}>

        {/* Left Column: Performance Table */}
        <div className={styles.leftColumn}>
          <div className={styles.panel} style={{ paddingBottom: '16px' }}>
            <div className={styles.panelHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2>Top Employee Performance</h2>
                <span className={styles.badgePremium}><Sparkles size={12} /> Live Index</span>
              </div>
              <button className={styles.viewAllBtn}>Details</button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>DEPARTMENT</th>
                    <th>PERFORMANCE RATING</th>
                    <th>TREND</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((perf) => (
                    <tr key={perf.name}>
                      <td>
                        <div className={styles.perfCell}>
                          <img src={perf.avatar} alt={perf.name} className={styles.perfAvatar} />
                          <div>
                            <strong className={styles.perfName}>{perf.name}</strong>
                            <span className={styles.perfRole}>{perf.role}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#475569', fontWeight: 600 }}>{perf.dept}</td>
                      <td>
                        <div className={styles.ratingContainer}>
                          <span className={styles.ratingVal}>{perf.rating}%</span>
                          <div className={styles.barOuter}>
                            <div
                              className={styles.barProgress}
                              style={{
                                width: `${perf.rating}%`,
                                backgroundColor: perf.rating >= 95 ? '#10b981' : perf.rating >= 90 ? '#3b82f6' : '#f59e0b'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`${styles.trendWrapper} ${perf.trend >= 0 ? styles.trendUp : styles.trendDown}`}>
                          {perf.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span>{perf.trend >= 0 ? `+${perf.trend}` : perf.trend}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          perf.status === 'Exemplary' ? styles.statusExemplary :
                          perf.status === 'Excellent' ? styles.statusExcellent : styles.statusGood
                        }`}>
                          {perf.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className={styles.rightColumn}>

          {/* Quick Actions */}
          <div className={styles.panel}>
            <div className={styles.panelHeader} style={{ marginBottom: '14px' }}>
              <h2>Quick Actions</h2>
            </div>
            <div className={styles.quickActionsList}>
              <button className={styles.quickActionBtn}>
                <UserPlus size={17} /> Add Employee
              </button>
              <button className={styles.quickActionBtn}>
                <Wallet size={17} /> Run Payroll
              </button>
              <button className={styles.quickActionBtn}>
                <FileBarChart size={17} /> Generate Report
              </button>
            </div>
          </div>

          <UpcomingInterviews />

          {/* Birthdays/Anniversaries — no real endpoint exists yet per project docs.
              Honest empty state instead of fabricated names. */}
          <div className={styles.panel}>
            <div className={styles.panelHeader} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cake size={17} color="#e11d48" />
                <h2>Birthdays &amp; Anniversaries</h2>
              </div>
            </div>
            <div className={styles.widgetEmptyState}>
              <CircleDot size={20} color="#cbd5e1" />
              <p className={styles.widgetEmptyTitle}>No data source connected yet.</p>
              <p className={styles.widgetEmptyHint}>Wire this to an employee DOB / joining-date endpoint.</p>
            </div>
          </div>

          {/* Department Snapshot */}
          <div className={styles.panel}>
            <div className={styles.panelHeader} style={{ marginBottom: '14px' }}>
              <h2>Department snapshot</h2>
              <Award size={16} color="#94a3b8" />
            </div>
            <div className={styles.departmentList}>
              {departmentList.map((d) => (
                <div key={d.name} className={styles.deptItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.deptIndicator} style={{ backgroundColor: d.color }}></span>
                    <strong>{d.name}</strong>
                  </div>
                  <span>{d.count} employees</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}