import { Plus, Instagram, Facebook, Twitter, Video, Linkedin, Link as LinkIcon, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import styles from './accounts.module.css';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C', connected: true, handle: '@luxe_weddings' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', connected: true, handle: 'Luxe Weddings FB' },
  { id: 'x', name: 'X / Twitter', icon: Twitter, color: '#000000', connected: false },
  { id: 'youtube', name: 'YouTube', icon: Video, color: '#FF0000', connected: true, handle: 'Luxe Weddings TV' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', connected: false },
];

export default function AccountsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Connected Accounts</h1>
          <p className={styles.subtitle}>Link your social media profiles to start orchestrating content.</p>
        </div>
      </header>

      <div className={styles.grid}>
        {platforms.map((platform) => (
          <div key={platform.id} className={`${styles.card} glass-card`}>
            <div className={styles.cardTop}>
              <div className={styles.iconBox} style={{ backgroundColor: `${platform.color}15`, color: platform.color }}>
                <platform.icon size={24} />
              </div>
              <div className={styles.statusBadge}>
                <span className={platform.connected ? styles.connected : styles.disconnected}>
                  {platform.connected ? 'Connected' : 'Not Linked'}
                </span>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <h3>{platform.name}</h3>
              {platform.connected ? (
                <p className={styles.handle}>{platform.handle}</p>
              ) : (
                <p className={styles.desc}>Connect your {platform.name} account to enable posting.</p>
              )}
            </div>

            <div className={styles.cardFooter}>
              {platform.connected ? (
                <div className={styles.connectedActions}>
                  <button className={styles.refreshBtn}><RefreshCw size={16} /> Sync</button>
                  <Button variant="outline" size="sm" className={styles.actionBtn}>Disconnect</Button>
                </div>
              ) : (
                <Button size="sm" className={styles.actionBtn}>
                  <LinkIcon size={16} /> Connect Account
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
