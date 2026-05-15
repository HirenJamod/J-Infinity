'use client';

import { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Send, 
  Calendar, 
  Save,
  Check,
  Plus,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import styles from './create-post.module.css';

interface Client {
  id: string;
  company_name: string;
  subscription_tier: string;
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
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    async function fetchClients() {
      try {
        setLoadingClients(true);
        const { data, error } = await supabase
          .from('clients')
          .select('id, company_name, subscription_tier')
          .eq('status', 'active');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return filtered;
    });
  };

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
    if (selectedClients.length === 0 || selectedPlatforms.length === 0 || !content) {
      alert('Please select at least one client, one platform, and write content.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Upload files to Supabase Storage
      const mediaUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
          
        mediaUrls.push(publicUrl);
      }

      // 2. Create the post entries for each client
      const postEntries = selectedClients.map(clientId => ({
        client_id: clientId,
        content: content,
        media_urls: mediaUrls,
        platforms: selectedPlatforms,
        status: 'pending',
        created_at: new Date().toISOString()
      }));

      const { error: postError } = await supabase
        .from('posts')
        .insert(postEntries);

      if (postError) throw postError;

      alert('Post and media orchestrated! Sent to clients for approval.');
      
      // Reset form
      setContent('');
      setFiles([]);
      setPreviews([]);
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
          <div 
            className={`${styles.mediaUpload} glass-card`}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              type="file" 
              id="fileInput" 
              multiple 
              accept="image/*,video/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            {previews.length > 0 ? (
              <div className={styles.previewGrid}>
                {previews.map((url, i) => (
                  <div key={i} className={styles.previewItem} onClick={(e) => e.stopPropagation()}>
                    <img src={url} alt="Preview" />
                    <button className={styles.removeFile} onClick={() => removeFile(i)}>×</button>
                  </div>
                ))}
                <div className={styles.addMore}>
                  <Plus size={24} />
                  <span>Add More</span>
                </div>
              </div>
            ) : (
              <div className={styles.uploadArea}>
                <div className={styles.uploadIcons}>
                  <ImageIcon size={40} className={styles.icon} />
                  <Video size={40} className={styles.icon} />
                </div>
                <p>Drag and drop media or <strong>browse files</strong></p>
                <span>Supports JPG, PNG, MP4 up to 50MB</span>
              </div>
            )}
          </div>

          <div className={`${styles.contentArea} glass-card`}>
            <h3>Post Content</h3>
            <textarea 
              placeholder="Write your content here..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
            />
            <div className={styles.editorToolbar}>
              <button># Hashtags</button>
              <button>😊 Emojis</button>
              <span>{content.length} / 2200</span>
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
                      <p>{client.company_name}</p>
                      <span>{client.subscription_tier}</span>
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
