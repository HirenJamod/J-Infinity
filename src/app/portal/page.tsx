import { 
  BarChart3, 
  Share2, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './portal.module.css';

export default function ClientDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Welcome, Luxe Weddings</h1>
        <p className={styles.subtitle}>Here is your social media performance overview.</p>
      </header>

      <section className={styles.statsGrid}>
        <StatCard 
          label="Total Posts" 
          value="12" 
          icon={CheckCircle2} 
        />
        <StatCard 
          label="Avg. Engagement" 
          value="4.8%" 
          icon={TrendingUp} 
          trend="+0.5%" 
          trendUp={true} 
        />
        <StatCard 
          label="Connected Platforms" 
          value="3" 
          icon={Share2} 
        />
        <StatCard 
          label="Next Post" 
          value="In 2h" 
          icon={Clock} 
        />
      </section>

      <div className={styles.mainGrid}>
        <div className={`${styles.chartCard} glass-card`}>
          <div className={styles.cardHeader}>
            <h3>Engagement Growth</h3>
            <span className={styles.badge}>Last 30 days</span>
          </div>
          <div className={styles.mockChart}>
            <div className={styles.chartBar} style={{ height: '40%' }}></div>
            <div className={styles.chartBar} style={{ height: '60%' }}></div>
            <div className={styles.chartBar} style={{ height: '50%' }}></div>
            <div className={styles.chartBar} style={{ height: '80%' }}></div>
            <div className={styles.chartBar} style={{ height: '70%' }}></div>
            <div className={styles.chartBar} style={{ height: '90%' }}></div>
            <div className={styles.chartBar} style={{ height: '100%' }}></div>
          </div>
        </div>

        <div className={`${styles.historyCard} glass-card`}>
          <div className={styles.cardHeader}>
            <h3>Recent Posts</h3>
            <button className={styles.linkBtn}>View Reports <ArrowUpRight size={16} /></button>
          </div>
          <div className={styles.historyList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.historyItem}>
                <div className={styles.postThumb}></div>
                <div className={styles.postInfo}>
                  <p>Instagram Post #{i}</p>
                  <span>Published May {15-i}, 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
