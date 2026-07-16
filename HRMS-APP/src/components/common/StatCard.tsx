import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number;
  trendText: string;
  icon: React.ElementType; // Type for passing Lucide icons
}

export default function StatCard({ title, value, trend, trendText, icon: Icon }: StatCardProps) {
  const isPositive = trend >= 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.iconWrapper}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className={styles.value}>{value}</div>
      
      <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{trend > 0 ? `+${trend}` : trend}% {trendText}</span>
      </div>
    </div>
  );
}