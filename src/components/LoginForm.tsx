'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, Layers } from 'lucide-react';
import Button from './Button';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  type: 'admin' | 'client';
}

export default function LoginForm({ type }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication for MVP
    setTimeout(() => {
      setLoading(false);
      if (type === 'admin') {
        router.push('/');
      } else {
        router.push('/portal');
      }
    }, 1500);
  };

  return (
    <div className={`${styles.card} glass-panel`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Layers className={styles.logoIcon} />
          <span className="gradient-text">J INFINITY</span>
        </div>
        <h2>{type === 'admin' ? 'Admin Access' : 'Client Portal'}</h2>
        <p>Enter your credentials to manage your orchestration.</p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.icon} />
            <input 
              type="email" 
              placeholder="name@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.icon} />
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className={styles.spin} size={18} /> : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </div>
      </form>

      <div className={styles.footer}>
        <p>{type === 'admin' ? 'Need technical support?' : 'Don\'t have an account?'}</p>
        <button className={styles.linkBtn}>
          {type === 'admin' ? 'Contact IT' : 'Request Access'}
        </button>
      </div>
    </div>
  );
}
