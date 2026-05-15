import { Plus, Search, MoreHorizontal, ExternalLink } from 'lucide-react';
import Button from '@/components/Button';
import styles from './clients.module.css';

const clients = [
  { id: 1, name: 'Luxe Weddings', business: 'Event Planning', status: 'Active', plan: 'Premium', posts: 42, platforms: ['Instagram', 'Facebook'] },
  { id: 2, name: 'TechFlow Solutions', business: 'SaaS', status: 'Active', plan: 'Standard', posts: 15, platforms: ['LinkedIn', 'X'] },
  { id: 3, name: 'Green Garden', business: 'E-commerce', status: 'Inactive', plan: 'Basic', posts: 0, platforms: ['Instagram'] },
  { id: 4, name: 'FitLife Gym', business: 'Fitness', status: 'Active', plan: 'Premium', posts: 89, platforms: ['YouTube', 'Instagram', 'Facebook'] },
];

export default function ClientsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Clients Management</h1>
          <p className={styles.subtitle}>Manage your clients and their social media connections.</p>
        </div>
        <Button>
          <Plus size={18} /> Add New Client
        </Button>
      </header>

      <div className={`${styles.toolbar} glass-panel`}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search clients..." />
        </div>
        <div className={styles.filters}>
          <select>
            <option>All Plans</option>
            <option>Premium</option>
            <option>Standard</option>
            <option>Basic</option>
          </select>
          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className={`${styles.tableWrapper} glass-card`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Business Type</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Total Posts</th>
              <th>Platforms</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div className={styles.clientName}>
                    <div className={styles.avatar}>{client.name[0]}</div>
                    <span>{client.name}</span>
                  </div>
                </td>
                <td>{client.business}</td>
                <td>
                  <span className={`${styles.status} ${styles[client.status.toLowerCase()]}`}>
                    {client.status}
                  </span>
                </td>
                <td>{client.plan}</td>
                <td>{client.posts}</td>
                <td>
                  <div className={styles.platforms}>
                    {client.platforms.map(p => (
                      <span key={p} className={styles.platformBadge}>{p}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconButton}><ExternalLink size={16} /></button>
                    <button className={styles.iconButton}><MoreHorizontal size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
