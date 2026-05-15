'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import styles from './approvals.module.css';

interface Post {
  id: string;
  content: string;
  media_urls: string[];
  platforms: string[];
  status: string;
  created_at: string;
}

export default function ApprovalsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  async function fetchPendingPosts() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!client) return;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('client_id', client.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching pending posts:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id: string, newStatus: 'approved' | 'draft') => {
    try {
      setProcessingId(id);
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setPosts(prev => prev.filter(p => p.id !== id));
      alert(`Post ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully.`);
    } catch (err: any) {
      alert('Action failed: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Content Approvals</h1>
          <p className={styles.subtitle}>Review and approve orchestrated content before it goes live.</p>
        </div>
      </header>

      {loading ? (
        <div className={styles.loader}>
          <Loader2 className={styles.spin} />
          <p>Loading pending content...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className={`${styles.emptyState} glass-card`}>
          <CheckCircle2 size={48} className={styles.emptyIcon} />
          <h3>All Clear!</h3>
          <p>You have no pending posts to approve right now.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <div key={post.id} className={`${styles.card} glass-card`}>
              <div className={styles.cardHeader}>
                <div className={styles.platforms}>
                  {post.platforms.map(p => (
                    <span key={p} className={styles.platformBadge}>{p}</span>
                  ))}
                </div>
                <span className={styles.date}>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>

              <div className={styles.cardBody}>
                {post.media_urls?.[0] && (
                  <div className={styles.mediaPreview}>
                    <img src={post.media_urls[0]} alt="Media" />
                    {post.media_urls.length > 1 && (
                      <span className={styles.mediaCount}>+{post.media_urls.length - 1} more</span>
                    )}
                  </div>
                )}
                <p className={styles.content}>{post.content}</p>
              </div>

              <div className={styles.cardFooter}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={styles.rejectBtn}
                  onClick={() => handleAction(post.id, 'draft')}
                  disabled={processingId === post.id}
                >
                  <XCircle size={16} /> Reject
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleAction(post.id, 'approved')}
                  disabled={processingId === post.id}
                >
                  {processingId === post.id ? <Loader2 className={styles.spin} size={16} /> : <CheckCircle2 size={16} />}
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
