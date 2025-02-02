import React from 'react';
import { Icons } from '../../icons';
import { useState } from 'react';
import { BillDetailsModal } from './BillDetailsModal';

interface BillingCycle {
  startDate: string;
  endDate: string;
  amount: number;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  type: string;
}

const currentCycle: BillingCycle = {
  startDate: 'Dec 12, 2024',
  endDate: 'Jan 12, 2025',
  amount: 0.00
};

const billingHistory: BillingHistory[] = [
  { id: '305577083', date: 'Dec 12, 2024', amount: 2978.69, status: 'paid', type: 'Billing cycle' },
  { id: '294395224', date: 'Nov 12, 2024', amount: 2874.52, status: 'paid', type: 'Billing cycle' },
  { id: '283525816', date: 'Oct 12, 2024', amount: 2887.00, status: 'paid', type: 'Billing cycle' },
  { id: '272716303', date: 'Sep 12, 2024', amount: 3148.47, status: 'paid', type: 'Billing cycle' },
  { id: '262201684', date: 'Aug 12, 2024', amount: 2893.53, status: 'paid', type: 'Billing cycle' }
];

export function BillingSection() {
  const [selectedBill, setSelectedBill] = useState<BillingHistory | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Billing</h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage your billing information and view transaction history
        </p>
      </div>

      {/* Current Billing Cycle */}
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Current billing cycle</h3>
              <p className="text-sm text-gray-400 mt-1">
                {currentCycle.startDate} - {currentCycle.endDate}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Running total</div>
              <div className="text-2xl font-semibold text-white">
                ${currentCycle.amount.toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icons.CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white">American Express</span>
                  <span className="text-gray-400">•••• 1008</span>
                </div>
                <span className="text-xs text-gray-500">Primary</span>
              </div>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              Change
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icons.AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-300">
                You're $4,000.00 away from reaching your billing threshold of $4,000.00 USD (platform fee not included). 
                When reached, you will be billed automatically, separate from your regular billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Billing history</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                <Icons.Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                <Icons.Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-sm font-medium text-gray-400">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Bill number</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((bill) => (
                  <tr 
                    key={bill.id} 
                    className="border-b border-gray-800 cursor-pointer hover:bg-gray-800/50"
                    onClick={() => setSelectedBill(bill)}
                  >
                    <td className="py-4 text-white">{bill.date}</td>
                    <td className="py-4 text-gray-400">#{bill.id}</td>
                    <td className="py-4 text-gray-400">{bill.type}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-4 text-right text-white">
                      ${bill.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {selectedBill && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
}