import { User, Bell, Lock, Globe, Database, Share2 } from 'lucide-react';
import Button from '@/components/Button';
import styles from './settings.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Settings</h1>
        <p className={styles.subtitle}>Manage your profile, security, and global platform configurations.</p>
      </header>

      <div className={styles.layout}>
        <aside className={`${styles.nav} glass-panel`}>
          <button className={styles.active}><User size={18} /> General</button>
          <button><Lock size={18} /> Security</button>
          <button><Bell size={18} /> Notifications</button>
          <button><Globe size={18} /> API Connections</button>
          <button><Database size={18} /> Database</button>
          <button><Share2 size={18} /> White-label</button>
        </aside>

        <div className={styles.content}>
          <div className={`${styles.section} glass-card`}>
            <h3>Admin Profile</h3>
            <div className={styles.formGroup}>
              <label>Display Name</label>
              <input type="text" defaultValue="Super Admin" />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" defaultValue="admin@jinfinity.ai" />
            </div>
            <Button className={styles.saveBtn}>Save Changes</Button>
          </div>

          <div className={`${styles.section} glass-card`}>
            <h3>Platform Configuration</h3>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleInfo}>
                <p>Auto-retry failed posts</p>
                <span>Automatically retry posting if an API error occurs.</span>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className={styles.toggleGroup}>
              <div className={styles.toggleInfo}>
                <p>Email notifications for admins</p>
                <span>Send alerts for failed posts or expired subscriptions.</span>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          <div className={`${styles.section} glass-card ${styles.dangerZone}`}>
            <h3>Danger Zone</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
