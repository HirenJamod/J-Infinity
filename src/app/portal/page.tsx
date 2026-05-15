export const dynamic = 'force-dynamic';

import { 
  BarChart3, 
  Share2, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { supabase } from '@/lib/supabase';
import styles from './portal.module.css';

export default async function ClientDashboard() {
  let user = null;
  let client = null;
  let totalPosts = 0;
  let recentPosts: any[] = [];
  let scheduledPosts: any[] = [];

  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getUser();
    user = sessionData.user;

    if (user) {
      // Fetch client details
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .single();
      client = clientData;

      if (client) {
        // Fetch posts summary
        const { count } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)
          .eq('status', 'published');
        totalPosts = count || 0;

        const { data: recent } = await supabase
          .from('posts')
          .select('*')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false })
          .limit(3);
        recentPosts = recent || [];

        const { data: scheduled } = await supabase
          .from('posts')
          .select('scheduled_at')
          .eq('client_id', client.id)
          .eq('status', 'scheduled')
          .order('scheduled_at', { ascending: true })
          .limit(1);
        scheduledPosts = scheduled || [];
      }
    }
  } catch (error) {
    console.error('Build-time or runtime data fetch error:', error);
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--accent)" style={{ marginBottom: '20px' }} />
          <h3>Session Expired</h3>
          <p>Please log in again to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const nextPostText = scheduledPosts?.[0] 
    ? `On ${new Date(scheduledPosts[0].scheduled_at).toLocaleDateString()}` 
    : 'None scheduled';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Welcome, {client?.company_name || 'Valued Client'}</h1>
        <p className={styles.subtitle}>Here is your social media performance overview.</p>
      </header>

      <section className={styles.statsGrid}>
        <StatCard 
          label="Total Posts" 
          value={totalPosts || 0} 
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
          value={nextPostText} 
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
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className={styles.historyItem}>
                  <div className={styles.postThumb}>
                    {post.media_urls?.[0] && <img src={post.media_urls[0]} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div className={styles.postInfo}>
                    <p>{post.content?.substring(0, 30) || 'Untitled Post'}...</p>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No recent posts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
