'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to BLOX Pro!
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 mb-6">
              Your subscription has been activated successfully. You now have access to all Pro features including all 8 AI agents and unlimited tasks.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/app/tenants'}
                className="w-full"
              >
                Manage Tenants
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Session ID: {sessionId}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
