"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [provisioning, setProvisioning] = useState(false);

  useEffect(() => {
    checkFirstLogin();
  }, []);

  const checkFirstLogin = async () => {
    try {
      const response = await fetch('/api/auth/first-login');
      const data = await response.json();
      
      if (!data.needsSetup && data.authenticated) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking first login:', error);
    }
  };

  const handleCreateTenant = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/first-login', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setProvisioning(true);
        setTimeout(() => {
          setStep(2);
          setProvisioning(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to BLOX</h1>
          <p className="text-slate-600">Let's set up your AI-powered organization</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 1: Create Your Organization</h2>
              <p className="text-slate-600 mb-4">
                We'll create your organization and provision your AI agents automatically.
              </p>
            </div>

            {provisioning ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-600">Setting up your organization and AI agents...</p>
              </div>
            ) : (
              <Button 
                onClick={handleCreateTenant}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create My Organization'}
              </Button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 2: Your Organization is Ready!</h2>
              <p className="text-slate-600 mb-4">
                Your organization has been created with the following AI agents:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <span>B.L.O.X CEO - Chief Executive Operations</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                  <span>M.A.R.K. - Marketing, Automation, Research & Knowledge</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                  <span>C.O.R.Y. - Creative Output & Rendering Yield</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  <span>A.L.E.X. - Administrative Logistics Executive</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>F.I.N.T. - Financial Insights & Transactions</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
                  <span>C.Y.R.A. - Cybersecurity Response & Analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  <span>T.O.N.Y. - Technical Operations & Network Yield</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  <span>S.A.G.E. - Social Automation & Growth Engine</span>
                </li>
              </ul>
              <p className="text-sm text-slate-500 mb-6">
                You can configure agent tools and integrations from the dashboard.
              </p>
            </div>

            <Button 
              onClick={handleComplete}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        <div className="mt-8 flex justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-slate-900' : 'bg-slate-300'}`}></div>
          <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-slate-900' : 'bg-slate-300'}`}></div>
        </div>
      </Card>
    </main>
  );
}
