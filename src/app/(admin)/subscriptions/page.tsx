import { Check, Zap, Shield, Star } from 'lucide-react';
import Button from '@/components/Button';
import styles from './subscriptions.module.css';

const plans = [
  {
    name: 'Basic',
    price: '$29',
    icon: Shield,
    features: ['10 posts / month', '2 platforms', 'Manual scheduling', 'Email support'],
    color: '#94a3b8'
  },
  {
    name: 'Standard',
    price: '$79',
    icon: Zap,
    features: ['30 posts / month', '4 platforms', 'Auto scheduling', 'Basic analytics', 'Priority support'],
    color: '#6366f1',
    popular: true
  },
  {
    name: 'Premium',
    price: '$199',
    icon: Star,
    features: ['Unlimited posts', 'All platforms', 'AI content generation', 'Advanced analytics', 'Dedicated manager'],
    color: '#a855f7'
  }
];

export default function SubscriptionsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Subscription Plans</h1>
        <p className={styles.subtitle}>Choose the right power for your clients' growth.</p>
      </header>

      <div className={styles.plansGrid}>
        {plans.map((plan) => (
          <div key={plan.name} className={`${styles.planCard} glass-card ${plan.popular ? styles.popular : ''}`}>
            {plan.popular && <span className={styles.badge}>Most Popular</span>}
            <div className={styles.planHeader}>
              <div className={styles.iconBox} style={{ backgroundColor: `${plan.color}20`, color: plan.color }}>
                <plan.icon size={24} />
              </div>
              <h3>{plan.name}</h3>
              <div className={styles.price}>
                <span>{plan.price}</span>
                <small>/ month</small>
              </div>
            </div>
            <ul className={styles.features}>
              {plan.features.map(feature => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant={plan.popular ? 'primary' : 'outline'} className={styles.planButton}>
              Assign Plan
            </Button>
          </div>
        ))}
      </div>

      <div className={`${styles.recentPayments} glass-card`}>
        <h3>Recent Subscriptions</h3>
        <div className={styles.paymentTable}>
          {[
            { client: 'Luxe Weddings', plan: 'Premium', status: 'Paid', date: 'May 12, 2026' },
            { client: 'TechFlow Solutions', plan: 'Standard', status: 'Paid', date: 'May 10, 2026' },
            { client: 'Green Garden', plan: 'Basic', status: 'Pending', date: 'May 08, 2026' },
          ].map((item, i) => (
            <div key={i} className={styles.tableRow}>
              <div className={styles.clientInfo}>
                <strong>{item.client}</strong>
                <span>{item.plan}</span>
              </div>
              <div className={styles.statusBox}>
                <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>{item.status}</span>
                <p>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
