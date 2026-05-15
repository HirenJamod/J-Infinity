'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, MoreHorizontal, ExternalLink, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import AddClientModal from '@/components/AddClientModal';
import { supabase } from '@/lib/supabase';
import styles from './clients.module.css';

interface Client {
  id: string;
  company_name: string;
  status: string;
  subscription_tier: string;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error('Error fetching clients:', err.message);
      setError('Failed to load clients. Please check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Clients Management</h1>
          <p className={styles.subtitle}>Manage your clients and their social media connections.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Client
        </Button>
      </header>

      <AddClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClients} 
      />

      <div className={`${styles.toolbar} glass-panel`}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search clients..." />
        </div>
        <div className={styles.filters}>
          <select>
            <option>All Tiers</option>
            <option>Premium</option>
            <option>Standard</option>
            <option>Basic</option>
          </select>
          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Onboarding</option>
          </select>
        </div>
      </div>

      <div className={`${styles.tableWrapper} glass-card`}>
        {loading ? (
          <div className={styles.loader}>
            <Loader2 className={styles.spin} />
            <p>Fetching clients from Supabase...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <Button variant="outline" onClick={fetchClients} size="sm">Retry</Button>
          </div>
        ) : clients.length === 0 ? (
          <div className={styles.empty}>
            <p>No clients found. Add your first client to get started!</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Status</th>
                <th>Tier</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className={styles.clientName}>
                      <div className={styles.avatar}>{client.company_name[0]}</div>
                      <span>{client.company_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[client.status.toLowerCase()]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>{client.subscription_tier}</td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
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
        )}
      </div>
    </div>
  );
}
