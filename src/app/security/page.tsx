import React from 'react';

export default function Security() {
  return (
    <main className='min-h-screen bg-[#0b1222] text-white p-8'>
      <div className="max-w-4xl mx-auto">
        <h1 className='text-3xl font-semibold mb-6'>Security</h1>
        <div className="space-y-8">
          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Data Protection</h2>
            <p className="text-white/70 mb-4">
              BLOX employs enterprise-grade security measures to protect your data and ensure compliance with industry standards.
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• End-to-end encryption for all data in transit and at rest</li>
              <li>• SOC 2 Type II compliance</li>
              <li>• GDPR and CCPA compliant data handling</li>
              <li>• Regular security audits and penetration testing</li>
            </ul>
          </section>
          
          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Access Control</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Multi-factor authentication (MFA)</li>
              <li>• Role-based access control (RBAC)</li>
              <li>• Single sign-on (SSO) integration</li>
              <li>• API key management and rotation</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Infrastructure Security</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• AWS-hosted infrastructure with 99.9% uptime SLA</li>
              <li>• Automated backup and disaster recovery</li>
              <li>• Network isolation and VPC security</li>
              <li>• 24/7 security monitoring and incident response</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
