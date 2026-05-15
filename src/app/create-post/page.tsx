'use client';

import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Send, 
  Calendar, 
  Save,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import Button from '@/components/Button';
import styles from './create-post.module.css';

const clients = [
  { id: 1, name: 'Luxe Weddings', plan: 'Premium' },
  { id: 2, name: 'TechFlow Solutions', plan: 'Standard' },
  { id: 3, name: 'Green Garden', plan: 'Basic' },
  { id: 4, name: 'FitLife Gym', plan: 'Premium' },
];

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'x', name: 'X / Twitter', icon: '🐦' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
];

export default function CreatePostPage() {
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  
  const toggleClient = (id: number) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
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
              {clients.map(client => (
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
              ))}
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
              <Button className={styles.fullWidth}>
                <Send size={18} /> Publish Now
              </Button>
              <div className={styles.secondaryActions}>
                <Button variant="secondary" className={styles.halfWidth}>
                  <Calendar size={18} /> Schedule
                </Button>
                <Button variant="outline" className={styles.halfWidth}>
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
