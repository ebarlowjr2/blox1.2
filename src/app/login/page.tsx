'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      setSupabase(client);
    }
  }, []);

  if (!supabase) {
    return (
      <div style={{ maxWidth: 420, margin: '80px auto', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto' }}>
      <Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />
    </div>
  );
}
