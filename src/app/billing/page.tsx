'use client';

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { createTenant } from '@/lib/blox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Users, Crown } from 'lucide-react';

const plans = [
  {
    id: 'community',
    name: 'Community',
    price: 'Free',
    description: 'Perfect for getting started with BLOX',
    features: [
      'Basic AI CEO functionality',
      '2 AI agents included',
      'Community support',
      'Basic integrations',
      'Up to 100 tasks/month'
    ],
    icon: Users,
    popular: false,
    priceId: null
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: '$49/month',
    description: 'Full power of BLOX for growing businesses',
    features: [
      'Full AI CEO capabilities',
      'All 8 AI agents included',
      'Priority support',
      'Advanced integrations',
      'Unlimited tasks',
      'Custom workflows',
      'Analytics dashboard'
    ],
    icon: Zap,
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTH_ID
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: '$490/year',
    description: 'Best value - 2 months free!',
    features: [
      'Full AI CEO capabilities',
      'All 8 AI agents included',
      'Priority support',
      'Advanced integrations',
      'Unlimited tasks',
      'Custom workflows',
      'Analytics dashboard',
      '2 months free'
    ],
    icon: Crown,
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEAR_ID
  }
];

export default function BillingPage() {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    if (!user) return;
    
    setLoading(plan.id);
    
    try {
      if (plan.id === 'community') {
        const tenant = await createTenant(user.name || user.email || 'Community User', 'community');
        
        const response = await fetch('/api/billing/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: tenant.id,
            email: user.email
          })
        });

        if (response.ok) {
          window.location.href = '/dashboard';
        } else {
          throw new Error('Failed to activate community plan');
        }
      } else {
        const response = await fetch('/api/checkout/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: plan.priceId,
            tenantId: user.sub,
            userSub: user.sub,
            email: user.email,
            billingInterval: plan.id.includes('yearly') ? 'year' : 'month'
          })
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Failed to create checkout session');
        }
      }
    } catch (error) {
      console.error('Plan selection error:', error);
      alert('Failed to select plan. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your BLOX Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your business automation needs. 
            Start with Community or unlock the full power of BLOX with Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={loading === plan.id}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Select ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Need help choosing? <a href="/contact" className="text-blue-600 hover:underline">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
