import React from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { ProfileSection } from './sections/ProfileSection';
import { APIKeysSection } from './sections/APIKeysSection';
import { SecuritySection } from './sections/SecuritySection';
import { BillingSection } from './sections/BillingSection';
import { WebhooksSection } from './sections/WebhooksSection';
import { CertificatesSection } from './sections/CertificatesSection';
import { MembersSection } from './sections/MembersSection';

export function MerchantSettings() {
  const { activeSettingsSection } = useNavigationStore();

  const renderContent = () => {
    switch (activeSettingsSection) {
      case 'profile':
        return <ProfileSection />;
      case 'api-keys':
        return <APIKeysSection />;
      case 'security':
        return <SecuritySection />;
      case 'billing':
        return <BillingSection />;
      case 'webhooks':
        return <WebhooksSection />;
      case 'certificates':
        return <CertificatesSection />;
      case 'team':
        return <MembersSection />;
      default:
        return <ProfileSection />;
    }
  };

  return <div className="mx-auto max-w-5xl">{renderContent()}</div>;
}
