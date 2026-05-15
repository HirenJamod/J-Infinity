'use client';

import { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Send, 
  Calendar, 
  Save,
  Check,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import styles from './create-post.module.css';

interface Client {
  id: string;
  name: string;
  plan: string;
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'x', name: 'X / Twitter', icon: '🐦' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
];

export default function CreatePostPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [loadingClients, setLoadingClients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    async function fetchClients() {
      try {
        setLoadingClients(true);
        const { data, error } = await supabase
          .from('clients')
          .select('id, name, plan')
          .eq('status', 'Active');
        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        setLoadingClients(false);
      }
    }
    fetchClients();
  }, []);

  const toggleClient = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    if (selectedClients.length === 0 || selectedPlatforms.length === 0 || !caption) {
      alert('Please select at least one client, one platform, and write a caption.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Create the Post record
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([{ caption, status: 'Published' }])
        .select()
        .single();

      if (postError) throw postError;

      // 2. Create Target records for each client/platform combination
      const targets = selectedClients.flatMap(clientId => 
        selectedPlatforms.map(platform => ({
          post_id: post.id,
          client_id: clientId,
          platform: platform,
          result_status: 'Published' // Mocking immediate success for MVP
        }))
      );

      const { error: targetError } = await supabase
        .from('post_targets')
        .insert(targets);

      if (targetError) throw targetError;

      alert('Post orchestrated successfully!');
      setCaption('');
      setSelectedClients([]);
      setSelectedPlatforms([]);
    } catch (err: any) {
      alert('Failed to publish post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Create New Post</h1>
        <p className={styles.subtitle}>Compose and orchestrate content across multiple channels.</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.editorSection}>
          <div className={`${styles.mediaUpload} glass-card`}>
            <div className={styles.uploadArea}>
              <div className={styles.uploadIcons}>
                <ImageIcon size={40} className={styles.icon} />
                <Video size={40} className={styles.icon} />
              </div>
              <p>Drag and drop media or <strong>browse files</strong></p>
              <span>Supports JPG, PNG, MP4 up to 50MB</span>
            </div>
          </div>

          <div className={`${styles.contentArea} glass-card`}>
            <h3>Post Content</h3>
            <textarea 
              placeholder="Write your caption here..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={styles.textarea}
            />
            <div className={styles.editorToolbar}>
              <button># Hashtags</button>
              <button>😊 Emojis</button>
              <span>{caption.length} / 2200</span>
            </div>
          </div>
        </div>

        <div className={styles.configSection}>
          <div className={`${styles.configCard} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Select Clients</h3>
              <span>{selectedClients.length} selected</span>
            </div>
            <div className={styles.clientList}>
              {loadingClients ? (
                <div className={styles.loaderSmall}>
                  <Loader2 className={styles.spin} size={16} />
                  <span>Loading clients...</span>
                </div>
              ) : clients.length === 0 ? (
                <p className={styles.emptyMsg}>No active clients found.</p>
              ) : (
                clients.map(client => (
                  <div 
                    key={client.id} 
                    className={`${styles.selectableItem} ${selectedClients.includes(client.id) ? styles.selected : ''}`}
                    onClick={() => toggleClient(client.id)}
                  >
                    <div className={styles.checkbox}>
                      {selectedClients.includes(client.id) && <Check size={14} />}
                    </div>
                    <div className={styles.itemInfo}>
                      <p>{client.name}</p>
                      <span>{client.plan}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${styles.configCard} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Platforms</h3>
              <span>{selectedPlatforms.length} selected</span>
            </div>
            <div className={styles.platformGrid}>
              {platforms.map(platform => (
                <div 
                  key={platform.id} 
                  className={`${styles.platformItem} ${selectedPlatforms.includes(platform.id) ? styles.selected : ''}`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <span className={styles.platformIcon}>{platform.icon}</span>
                  <p>{platform.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.summaryCard} glass-panel`}>
            <div className={styles.summaryItem}>
              <Info size={16} />
              <p>Post will be queued for <strong>{selectedClients.length} clients</strong> on <strong>{selectedPlatforms.length} platforms</strong>.</p>
            </div>
            <div className={styles.actions}>
              <Button 
                className={styles.fullWidth} 
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className={styles.spin} size={18} /> : <Send size={18} />}
                {isSubmitting ? 'Publishing...' : 'Publish Now'}
              </Button>
              <div className={styles.secondaryActions}>
                <Button variant="secondary" className={styles.halfWidth} disabled={isSubmitting}>
                  <Calendar size={18} /> Schedule
                </Button>
                <Button variant="outline" className={styles.halfWidth} disabled={isSubmitting}>
                  <Save size={18} /> Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
