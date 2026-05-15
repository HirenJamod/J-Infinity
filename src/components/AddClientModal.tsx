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
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    business_type: '',
    plan: 'Basic',
    status: 'Active'
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
            name: formData.name,
            business_type: formData.business_type,
            contact_email: formData.email,
            // Assuming we might add phone/contact_person to schema later or store in metadata
            // For now, let's keep it to the core schema I provided earlier
            status: formData.status,
            plan: formData.plan
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
            <p>{formData.name} has been successfully registered.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Business Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Luxe Weddings"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Contact Person</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. John Doe"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="admin@client.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Business Type / Niche</label>
                <input 
                  type="text" 
                  placeholder="e.g. Real Estate"
                  value={formData.business_type}
                  onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Initial Plan</label>
                <select 
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
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
