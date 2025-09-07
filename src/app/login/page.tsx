'use client';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 420, margin: '80px auto' }}>
      <Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />
    </div>
  );
}
