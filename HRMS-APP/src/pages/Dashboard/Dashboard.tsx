import { useState, useEffect } from 'react';
import {
  BriefcaseBusiness,
  CalendarDays,
  Users2,
  Clock3,
  TrendingUp,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import StatCard from '../../Component/common/StatCard';
import UpcomingInterviews from '../../Component/wedges/UpcomingInterviews';
import styles from './Dashboard.module.css';
import { axiosInstance } from '../../services/axiosInstance';

export default function Dashboard() {
  // ---> NEW: Fetch live metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosInstance.get('/analytics/dashboard/');
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const stats = [
    { 
      title: 'Total Employees', 
      value: metrics ? String(metrics.total_employees) : '0', 
      trend: 8, 
      trendText: 'this month', 
      icon: Users2 
    },
    { 
      title: 'Present Today', 
      value: metrics ? String(metrics.present_today) : '0', 
      trend: 6, 
      trendText: 'checked in today', 
      icon: CalendarDays 
    },
    { 
      title: 'Absent Today', 
      value: metrics ? String(metrics.absent_today) : '0', 
      trend: -3, 
      trendText: 'not checked in today', 
      icon: Clock3 
    },
    { 
      title: 'On Leave Today', 
      value: metrics ? String(metrics.on_leave_today) : '0', 
      trend: 9, 
      trendText: 'approved requests', 
      icon: BriefcaseBusiness 
    },
  ];

  const topPerformers = [
    { name: 'Rihan Naseer', role: 'Full Stack Developer', rating: 98, status: 'Exemplary', trend: 4.2, avatar: 'https://i.pravatar.cc/150?u=EMP001' },
    { name: 'Sana', role: 'Sr. Developer', rating: 95, status: 'Excellent', trend: 3.5, avatar: 'https://i.pravatar.cc/150?u=EMP003' },
    { name: 'Justin', role: 'UI/UX Designer', rating: 92, status: 'Excellent', trend: -1.2, avatar: 'https://i.pravatar.cc/150?u=EMP002' },
    { name: 'John Smith', role: 'Finance Lead', rating: 89, status: 'Good', trend: 2.1, avatar: 'https://i.pravatar.cc/150?u=EMP004' },
  ];

  // ---> NEW: Loading State View
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
            Monitor your team's headcount, key shifts, attendance trends, and recent performance indices in real-time.
          </p>
        </div>
        <div className={styles.metaCard}>
          <span className={styles.metaLabel}>CURRENT PAYROLL MONTH</span>
          <strong className={styles.metaValue}>June 2026</strong>
          <span className={styles.metaHint}>Cycle ends in 4 days</span>
        </div>
      </header>

      {/* Top Stat Cards */}
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
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Area Fill */}
              <path
                d="M 0 140 Q 50 120 100 110 Q 150 100 200 135 Q 250 170 300 120 Q 350 70 400 90 Q 450 110 500 60 L 500 200 L 0 200 Z"
                fill="url(#attendance-grad)"
              />
              
              {/* Smooth Line Path */}
              <path
                d="M 0 140 Q 50 120 100 110 Q 150 100 200 135 Q 250 170 300 120 Q 350 70 400 90 Q 450 110 500 60"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              
              {/* Points */}
              <circle cx="100" cy="110" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))' }} />
              <circle cx="200" cy="135" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))' }} />
              <circle cx="300" cy="120" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))' }} />
              <circle cx="400" cy="90" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))' }} />
              <circle cx="500" cy="60" r="6" fill="#10b981" stroke="#fff" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 2px 6px rgba(16,185,129,0.4))' }} />

              {/* Labels */}
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
            <span style={{ fontSize: '12px', color: '#64748b' }}>Total Count: 115</span>
          </div>
          
          <div className={styles.donutContainer}>
            <svg width="160" height="160" viewBox="0 0 160 160" className={styles.donutSvg}>
              {/* Outer track */}
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
              
              {/* Operations Segment (36.5%): length 126.2, offset 0 */}
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#1a3646" strokeWidth="14"
                      strokeDasharray="126.2 345.5" strokeDashoffset="0" strokeLinecap="round" />
                      
              {/* Sales Segment (27%): length 93.3, offset -126.2 */}
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#10b981" strokeWidth="14"
                      strokeDasharray="93.3 345.5" strokeDashoffset="-126.2" strokeLinecap="round" />
                      
              {/* Engineering Segment (24.3%): length 84, offset -219.5 */}
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#3b82f6" strokeWidth="14"
                      strokeDasharray="84 345.5" strokeDashoffset="-219.5" strokeLinecap="round" />
                      
              {/* HR Segment (12.2%): length 42, offset -303.5 */}
              <circle cx="80" cy="80" r="55" fill="transparent" stroke="#f59e0b" strokeWidth="14"
                      strokeDasharray="42 345.5" strokeDashoffset="-303.5" strokeLinecap="round" />
                      
              {/* Text indicator in middle */}
              <text x="80" y="78" textAnchor="middle" dominantBaseline="middle" className={styles.donutTextNum}>115</text>
              <text x="80" y="96" textAnchor="middle" dominantBaseline="middle" className={styles.donutTextLabel}>ACTIVE STAFF</text>
            </svg>

            <div className={styles.donutLegend}>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: '#1a3646' }}></span>
                <span className={styles.legendLabel}>Operations (42)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: '#10b981' }}></span>
                <span className={styles.legendLabel}>Sales (31)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: '#3b82f6' }}></span>
                <span className={styles.legendLabel}>Engineering (28)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: '#f59e0b' }}></span>
                <span className={styles.legendLabel}>HR & Admin (14)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split Grid */}
      <section className={styles.mainContentGrid}>
        
        {/* Left Column (Wider - For Performance Index Table) */}
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
                      <td style={{ color: '#475569', fontWeight: 600 }}>{perf.role.includes('UI/UX') ? 'Design' : perf.role.includes('Finance') ? 'Finance' : 'Engineering'}</td>
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

        {/* Right Column (Narrower - For widgets) */}
        <div className={styles.rightColumn}>
          
          <UpcomingInterviews />

          {/* Department Headcount Snapshot Widget */}
          <article className={styles.panel}>
            <div className={styles.panelHeader} style={{ marginBottom: '14px' }}>
              <h2>Department snapshot</h2>
              <span style={{ fontWeight: '600', color: '#1a3646' }}>Headcount</span>
            </div>
            <div className={styles.departmentList}>
              <div className={styles.deptItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.deptIndicator} style={{ backgroundColor: '#1a3646' }}></span>
                  <strong>Operations</strong>
                </div>
                <span>42 employees</span>
              </div>
              <div className={styles.deptItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.deptIndicator} style={{ backgroundColor: '#10b981' }}></span>
                  <strong>Sales & Marketing</strong>
                </div>
                <span>31 employees</span>
              </div>
              <div className={styles.deptItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.deptIndicator} style={{ backgroundColor: '#3b82f6' }}></span>
                  <strong>Engineering</strong>
                </div>
                <span>28 employees</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.deptIndicator} style={{ backgroundColor: '#f59e0b' }}></span>
                  <strong>HR & Admin</strong>
                </div>
                <span>14 employees</span>
              </div>
            </div>
          </article>

        </div>
      </section>
    </div>
  );
}