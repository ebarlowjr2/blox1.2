'use client';
import React, { useEffect, useState } from 'react';
import { listTenants, createTenant, provision } from '@/lib/blox';

export default function TenantsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    listTenants()
      .then((d) => setItems(d.items))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Tenants</h1>
      {err && <p style={{ color: 'crimson' }}>Error: {err}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input placeholder="Tenant name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={async () => {
          try {
            const t = await createTenant(name || 'New Tenant');
            setItems([t, ...items]);
            setName('');
          } catch (e:any) { setErr(e.message); }
        }}>Create</button>
      </div>

      <ul style={{ marginTop: 16 }}>
        {items.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            {t.name} — {t.plan}{' '}
            <button onClick={async () => {
              try { await provision(t.id); alert('Provisioning started'); }
              catch (e:any) { setErr(e.message); }
            }}>Provision</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
