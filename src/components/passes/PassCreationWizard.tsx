import React, { useState } from 'react';
import { Icons } from '../icons';
import type { PassTemplate } from '../../types/database';
import { PassDesigner } from './PassDesigner';

interface PassCreationWizardProps {
  onClose: () => void;
  onComplete: (template: Omit<PassTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
}

type Step = 'type' | 'design' | 'settings' | 'review';

const passTypes = [
  {
    id: 'loyalty',
    icon: Icons.CreditCard,
    title: 'Loyalty Card',
    description: 'Create a digital loyalty card for your rewards program',
  },
  {
    id: 'coupon',
    icon: Icons.Gift,
    title: 'Coupon',
    description: 'Offer digital coupons and promotions',
  },
  {
    id: 'ticket',
    icon: Icons.Ticket,
    title: 'Event Ticket',
    description: 'Digital tickets for events and venues',
  },
];

export function PassCreationWizard({ onClose, onComplete }: PassCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [formData, setFormData] = useState<Partial<PassTemplate>>({
    name: '',
    description: '',
    style: {
      backgroundColor: '#1e40af',
      foregroundColor: '#ffffff',
      labelColor: '#93c5fd',
    },
    nfcEnabled: true,
  });
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.description || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onComplete(formData as PassTemplate);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create pass';
      console.error('Error in PassCreationWizard:', err);
      setError(errorMessage);
    }
  };
  
  const steps = {
    type: {
      title: 'Choose Pass Type',
      subtitle: 'Select the type of pass you want to create',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {passTypes.map(({ id, icon: Icon, title, description }) => (
            <button
              key={id}
              onClick={() => {
                setFormData({ ...formData, type: id });
                setCurrentStep('design');
              }}
              className="flex flex-col items-center p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Icon className="w-12 h-12 mb-4 text-white" />
              <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 text-center">{description}</p>
            </button>
          ))}
        </div>
      ),
    },
    design: {
      title: 'Design Your Pass',
      subtitle: 'Customize the appearance of your pass',
      content: <PassDesigner />,
    },
    settings: {
      title: 'Pass Settings',
      subtitle: 'Configure pass functionality and features',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center mb-4">
                <Icons.Nfc className="w-6 h-6 text-white mr-3" />
                <h3 className="text-lg font-medium text-white">NFC Capabilities</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.nfcEnabled}
                    onChange={(e) => setFormData({ ...formData, nfcEnabled: e.target.checked })}
                    className="w-4 h-4 text-white bg-gray-900 border-gray-800 rounded focus:ring-white focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-300">Enable NFC</span>
                </label>
                <p className="text-sm text-gray-400">
                  Allow customers to tap their phone to interact with your pass at supported terminals
                </p>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center mb-4">
                <Icons.Smartphone className="w-6 h-6 text-white mr-3" />
                <h3 className="text-lg font-medium text-white">Mobile Settings</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    className="w-4 h-4 text-white bg-gray-900 border-gray-800 rounded focus:ring-white focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-300">Enable Push Notifications</span>
                </label>
                <p className="text-sm text-gray-400">
                  Send updates and promotions directly to your customers' phones
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setCurrentStep('design')}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep('review')}
              className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
            >
              Next Step
              <Icons.ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      ),
    },
    review: {
      title: 'Review & Create',
      subtitle: 'Review your pass details before creating',
      content: (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Pass Preview</h3>
              <div
                className="w-full h-48 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: formData.style?.backgroundColor }}
              >
                <div className="text-center">
                  <h4
                    className="text-xl font-bold mb-2"
                    style={{ color: formData.style?.foregroundColor }}
                  >
                    {formData.name || 'Pass Name'}
                  </h4>
                  <p style={{ color: formData.style?.labelColor }}>
                    {formData.description || 'Pass Description'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-400 mb-1">Pass Type</span>
                  <span className="text-white">{formData.type}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">NFC Enabled</span>
                  <span className="text-white">{formData.nfcEnabled ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setCurrentStep('settings')}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Back
            </button>
            <button
              onClick={() => onComplete(formData as PassTemplate)}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
            >
              Create Pass
            </button>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black rounded-xl w-full max-w-4xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
          <h2 className="text-xl font-semibold text-white">{steps[currentStep].title}</h2>
          <p className="mt-1 text-sm text-gray-400">{steps[currentStep].subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{steps[currentStep].content}</div>
      </div>
    </div>
  );
}