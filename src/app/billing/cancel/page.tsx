'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function BillingCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Subscription Cancelled
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 mb-6">
              No worries! Your subscription setup was cancelled. You can try again anytime or start with our free Community plan.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/billing'}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
