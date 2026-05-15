import { 
  Users, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './page.module.css';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className="gradient-text">Welcome back, Admin</h1>
        <p className={styles.subtitle}>Here's what's happening across your clients today.</p>
      </header>

      <section className={styles.statsGrid}>
        <StatCard 
          label="Total Clients" 
          value="128" 
          icon={Users} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          label="Active Subscriptions" 
          value="115" 
          icon={CreditCard} 
          trend="+5.2%" 
          trendUp={true} 
        />
        <StatCard 
          label="Scheduled Posts" 
          value="452" 
          icon={Calendar} 
        />
        <StatCard 
          label="Failed Posts" 
          value="3" 
          icon={AlertCircle} 
          trend="-2%" 
          trendUp={false} 
        />
      </section>

      <div className={styles.mainGrid}>
        <div className={`${styles.recentPosts} glass-card`}>
          <div className={styles.cardHeader}>
            <h3>Recent Activity</h3>
            <button className={styles.viewAll}>View all <ArrowRight size={16} /></button>
          </div>
          <div className={styles.activityList}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <TrendingUp size={18} />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Post published for <strong>Client {i}</strong></p>
                  <p className={styles.activityTime}>
                    <Clock size={12} /> 2 hours ago
                  </p>
                </div>
                <span className={styles.statusBadge}>Success</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.quickActions} glass-card`}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.primaryAction}>Create New Post</button>
            <button className={styles.secondaryAction}>Add New Client</button>
            <button className={styles.secondaryAction}>Billing Overview</button>
          </div>
        </div>
      </div>
    </div>
  );
}
