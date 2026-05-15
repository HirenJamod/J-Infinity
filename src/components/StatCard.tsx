import { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="glass-card">
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={24} className={styles.icon} />
        </div>
        {trend && (
          <span className={`${styles.trend} ${trendUp ? styles.up : styles.down}`}>
            {trend}
          </span>
        )}
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>
    </div>
  );
}
