'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { supabase } from '@/lib/supabase';
import styles from './AddClientModal.module.css';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    status: 'onboarding',
    subscription_tier: 'Standard'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('clients')
        .insert([
          {
            company_name: formData.company_name,
            status: formData.status,
            subscription_tier: formData.subscription_tier
          }
        ]);

      if (error) throw error;

      setCompleted(true);
      setTimeout(() => {
        setCompleted(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      alert('Error adding client: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass-panel`}>
        <div className={styles.header}>
          <h3>Add New Client</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        {completed ? (
          <div className={styles.successState}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h4>Client Added!</h4>
            <p>{formData.company_name} has been successfully registered.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Company Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Luxe Weddings"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="onboarding">Onboarding</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Subscription Tier</label>
                <select 
                  value={formData.subscription_tier}
                  onChange={(e) => setFormData({...formData, subscription_tier: e.target.value})}
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className={styles.footer}>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className={styles.spin} size={18} /> : 'Create Client'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
