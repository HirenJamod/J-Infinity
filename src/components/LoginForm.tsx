'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, Layers, AlertCircle } from 'lucide-react';
import Button from './Button';
import { supabase } from '@/lib/supabase';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  type: 'admin' | 'client';
}

export default function LoginForm({ type }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check user role in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      // Validate role access
      if (type === 'admin' && profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Admin access required.');
      }

      if (type === 'client' && profile.role !== 'client') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Please use the Client Portal login.');
      }

      // Success redirection logic
      const redirectedFrom = searchParams.get('redirectedFrom');
      if (redirectedFrom) {
        router.push(redirectedFrom);
      } else if (profile.role === 'admin') {
        router.push('/');
      } else {
        router.push('/portal');
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
      setLoading(false);
    }
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
        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

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
