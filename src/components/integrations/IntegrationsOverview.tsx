import React from 'react';
import { Icons } from '../icons';
import { IntegrationCard } from './IntegrationCard';
import { ShopifyIntegration } from './providers/ShopifyIntegration';
import { SalesforceIntegration } from './providers/SalesforceIntegration';
import { WindcaveIntegration } from './providers/WindcaveIntegration';

export function IntegrationsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <span className="text-white-400 ml-2 rounded-full bg-purple-500/40 px-1.5 py-0.5 text-[9px] font-medium">
                COMING SOON
              </span>
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

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex items-start space-x-3">
          <Icons.AlertCircle className="mt-0.5 h-5 w-5 text-blue-400" />
          <div className="space-y-1">
            <p className="text-sm text-blue-300">
              Need help with integrations? Check out our{' '}
              <a href="/docs/integrations" className="text-blue-400 underline hover:text-blue-300">
                integration guides
              </a>{' '}
              or{' '}
              <a href="/contact" className="text-blue-400 underline hover:text-blue-300">
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
