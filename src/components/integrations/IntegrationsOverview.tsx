import React from 'react';
import { Icons } from '../icons';
import { IntegrationCard } from './IntegrationCard';
import { ShopifyIntegration } from './providers/ShopifyIntegration';
import { SalesforceIntegration } from './providers/SalesforceIntegration';
import { WindcaveIntegration } from './providers/WindcaveIntegration';

export function IntegrationsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationCard
          name="Shopify"
          description="Connect your Shopify store to automatically issue passes for orders"
          icon={Icons.ShoppingCart}
          status="not_connected"
        >
          <ShopifyIntegration />
        </IntegrationCard>

        <IntegrationCard
          name={
            <div className="flex items-center">
              Salesforce
              <span className="ml-2 px-1.5 py-0.5 text-[9px] font-medium bg-purple-500/40 text-white-400 rounded-full">COMING SOON</span>
            </div>
          }
          description="Sync customer data and automate pass distribution through Salesforce"
          icon={Icons.Building2}
          status="not_connected"
        >
          <SalesforceIntegration />
        </IntegrationCard>

        <IntegrationCard
          name="Windcave"
          description="Process payments securely with Windcave's payment gateway"
          icon={Icons.CreditCard}
          status="not_connected"
        >
          <WindcaveIntegration />
        </IntegrationCard>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icons.AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-blue-300">
              Need help with integrations? Check out our{' '}
              <a href="/docs/integrations" className="text-blue-400 hover:text-blue-300 underline">
                integration guides
              </a>{' '}
              or{' '}
              <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">
                contact our support team
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}