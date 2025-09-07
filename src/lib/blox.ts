import { getAccessToken } from '@auth0/nextjs-auth0';

const API = '/blox';

async function authHeader() {
  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) throw new Error('Not signed in');
    return { Authorization: `Bearer ${accessToken}` };
  } catch (error) {
    throw new Error('Not signed in');
  }
}

export async function listTenants(limit = 10) {
  const headers = await authHeader();
  const r = await fetch(`${API}/api/tenants?limit=${limit}`, { headers, cache: 'no-store' });
  if (!r.ok) throw new Error(`listTenants: ${r.status}`);
  return r.json();
}

export async function createTenant(name: string, plan = 'pro') {
  const headers = { ...(await authHeader()), 'Content-Type': 'application/json' };
  const r = await fetch(`${API}/api/tenants`, {
    method: 'POST', headers, body: JSON.stringify({ name, plan }),
  });
  if (!r.ok) throw new Error(`createTenant: ${r.status}`);
  return r.json();
}

export async function provision(tenant_id: string) {
  const headers = { ...(await authHeader()), 'Content-Type': 'application/json' };
  const r = await fetch(`${API}/api/provision`, {
    method: 'POST', headers, body: JSON.stringify({ tenant_id }),
  });
  if (!r.ok) throw new Error(`provision: ${r.status}`);
  return r.json();
}
