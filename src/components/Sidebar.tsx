import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  PlusSquare, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Settings,
  Layers
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clients', href: '/clients' },
  { icon: PlusSquare, label: 'Create Post', href: '/create-post' },
  { icon: Calendar, label: 'Scheduled', href: '/scheduled' },
  { icon: CheckCircle2, label: 'Published', href: '/published' },
  { icon: AlertCircle, label: 'Failed', href: '/failed' },
  { icon: CreditCard, label: 'Subscriptions', href: '/subscriptions' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className={`${styles.sidebar} glass-panel`}>
      <div className={styles.logo}>
        <Layers className={styles.logoIcon} />
        <span className="gradient-text">J INFINITY</span>
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
        <div className={styles.userProfile}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Admin User</p>
            <p className={styles.userRole}>Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
