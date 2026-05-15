import Link from 'next/link';
import { 
  LayoutDashboard, 
  Share2, 
  FileText, 
  CreditCard, 
  Settings,
  LogOut,
  Layers
} from 'lucide-react';
import styles from './PortalSidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/portal' },
  { icon: Share2, label: 'Social Accounts', href: '/portal/accounts' },
  { icon: FileText, label: 'My Reports', href: '/portal/reports' },
  { icon: CreditCard, label: 'Subscription', href: '/portal/billing' },
  { icon: Settings, label: 'Settings', href: '/portal/settings' },
];

export default function PortalSidebar() {
  return (
    <aside className={`${styles.sidebar} glass-panel`}>
      <div className={styles.logo}>
        <Layers className={styles.logoIcon} />
        <span className="gradient-text">CLIENT HUB</span>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className={styles.navItem}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
