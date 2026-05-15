'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeSubs: 0,
    scheduledPosts: 0,
    failedPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [
          { count: clientsCount },
          { count: activeCount },
          { count: scheduledCount },
          { count: failedCount }
        ] = await Promise.all([
          supabase.from('clients').select('*', { count: 'exact', head: true }),
          supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'Scheduled'),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'Failed')
        ]);

        setStats({
          totalClients: clientsCount || 0,
          activeSubs: activeCount || 0,
          scheduledPosts: scheduledCount || 0,
          failedPosts: failedCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className="gradient-text">Welcome back, Admin</h1>
        <p className={styles.subtitle}>Here's what's happening across your clients today.</p>
      </header>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spin} />
          <p>Syncing data from Supabase...</p>
        </div>
      ) : (
        <>
          <section className={styles.statsGrid}>
            <StatCard 
              label="Total Clients" 
              value={stats.totalClients} 
              icon={Users} 
            />
            <StatCard 
              label="Active Subscriptions" 
              value={stats.activeSubs} 
              icon={CreditCard} 
            />
            <StatCard 
              label="Scheduled Posts" 
              value={stats.scheduledPosts} 
              icon={Calendar} 
            />
            <StatCard 
              label="Failed Posts" 
              value={stats.failedPosts} 
              icon={AlertCircle} 
              trend={stats.failedPosts > 0 ? "Check logs" : ""}
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
                <div className={styles.emptyActivity}>
                  <p>Recent activity will appear here as you start posting.</p>
                </div>
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
        </>
      )}
    </div>
  );
}
