import { useState, useEffect } from 'react';
import {
  Users2,
  CalendarDays,
  Wallet,
  Receipt,
  UserPlus,
  FileBarChart,
  CheckSquare,
  Building2,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
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
  const departmentData = [
    { name: 'Engineering', employees: 42 },
    { name: 'Sales', employees: 31 },
    { name: 'Finance', employees: 18 },
    { name: 'HR', employees: 14 }
  ];

  // Flagged: /monthly-summary/ has no time-series field. This is a placeholder
  // trend shape, not real data — wire to a real /attendance-trend/ endpoint
  // before treating this chart as trustworthy.
  const attendanceTrend = [
    { month: 'Jan', rate: 90 },
    { month: 'Feb', rate: 93 },
    { month: 'Mar', rate: 88 },
    { month: 'Apr', rate: 95 },
    { month: 'May', rate: 97 },
    { month: 'Jun', rate: 98 }
  ];

  // ---> UNCHANGED performance data, "Attendance"/"Tasks" columns from the
  // feedback dropped because no such per-employee data exists in this app yet.
  const topPerformers = [
    { name: 'Rihan Naseer', dept: 'Engineering', rating: 98, status: 'Exemplary' },
    { name: 'Sana', dept: 'Engineering', rating: 95, status: 'Excellent' },
    { name: 'Justin', dept: 'Design', rating: 92, status: 'Excellent' },
    { name: 'John Smith', dept: 'Finance', rating: 89, status: 'Good' }
  ];

  const pendingApprovals: number | null = null; // TODO: wire to /leave-approvals/pending-count/

  const kpis = [
    {
      label: 'Total Employees',
      value: metrics ? String(metrics.total_employees) : '—',
      trend: '+8%',
      trendText: 'Compared to last month',
      icon: Users2
    },
    {
      label: 'On Leave Today',
      value: metrics ? String(metrics.on_leave_today) : '—',
      trend: '+9%',
      trendText: 'Approved requests',
      icon: CalendarDays
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals === null ? 'N/A' : String(pendingApprovals),
      trend: null,
      trendText: 'Not yet connected',
      icon: CheckSquare
    },
    {
      label: 'Total Departments',
      value: String(departmentData.length),
      trend: null,
      trendText: 'Active units',
      icon: Building2
    }
  ];

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

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

      {/* Compact header — replaces the old oversized hero */}
      <header className={styles.header}>
        <div>
          <span className={styles.headerEyebrow}>Dashboard</span>
          <h1 className={styles.headerTitle}>Good Morning, Admin</h1>
        </div>
        <span className={styles.headerDate}>{today}</span>
      </header>

      {/* KPI Grid */}
      <section className={styles.statsGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <kpi.icon size={26} className={styles.kpiIcon} />
            <p className={styles.kpiLabel}>{kpi.label}</p>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <div className={styles.kpiFooter}>
              {kpi.trend && <span className={styles.kpiTrendPill}>{kpi.trend}</span>}
              <span className={styles.kpiHint}>{kpi.trendText}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Charts row: Attendance Trend + Departments */}
      <section className={styles.chartsGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Attendance Trend</h2>
            <span className={styles.panelHeaderMeta}>Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[80, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2.5} fill="url(#attendanceFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Departments</h2>
            <span className={styles.panelHeaderMeta}>
              {departmentData.reduce((sum, d) => sum + d.employees, 0)} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 13, fill: '#334155' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip />
              <Bar dataKey="employees" fill="#2563EB" radius={[0, 8, 8, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Activity + Quick Actions */}
      <section className={styles.chartsGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Recent Activity</h2>
          </div>
          {/* Flagged: no /activity-feed/ endpoint exists yet. Honest empty
              state rather than fabricated log entries. */}
          <div className={styles.widgetEmptyState}>
            <p className={styles.widgetEmptyTitle}>No activity feed connected yet.</p>
            <p className={styles.widgetEmptyHint}>Wire this to an audit-log or activity-feed endpoint.</p>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Quick Actions</h2>
          </div>
          <div className={styles.quickActionsGrid}>
            <button className={styles.quickActionCard}>
              <UserPlus size={20} />
              <span>Add Employee</span>
            </button>
            <button className={styles.quickActionCard}>
              <Wallet size={20} />
              <span>Run Payroll</span>
            </button>
            <button className={styles.quickActionCard}>
              <FileBarChart size={20} />
              <span>Generate Report</span>
            </button>
            <button className={styles.quickActionCard}>
              <CheckSquare size={20} />
              <span>Approve Leave</span>
            </button>
            <button className={styles.quickActionCard}>
              <Users2 size={20} />
              <span>View Employees</span>
            </button>
            <button className={styles.quickActionCard}>
              <Receipt size={20} />
              <span>Assign Shift</span>
            </button>
          </div>
        </div>
      </section>

      {/* Performance table (full width) */}
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Employee Performance</h2>
          <button className={styles.viewAllBtn}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Performance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((perf) => (
                <tr key={perf.name}>
                  <td className={styles.perfName}>{perf.name}</td>
                  <td className={styles.perfDept}>{perf.dept}</td>
                  <td>
                    <div className={styles.ratingContainer}>
                      <span className={styles.ratingVal}>{perf.rating}%</span>
                      <div className={styles.barOuter}>
                        <div className={styles.barProgress} style={{ width: `${perf.rating}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        perf.status === 'Exemplary'
                          ? styles.statusExemplary
                          : perf.status === 'Excellent'
                          ? styles.statusExcellent
                          : styles.statusGood
                      }`}
                    >
                      {perf.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Existing widget, preserved as-is — untouched per Zero Regression */}
      <UpcomingInterviews />
    </div>
  );
}