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
  amount: 0.0,
};

const billingHistory: BillingHistory[] = [
  { id: '305577083', date: 'Dec 12, 2024', amount: 2978.69, status: 'paid', type: 'Billing cycle' },
  { id: '294395224', date: 'Nov 12, 2024', amount: 2874.52, status: 'paid', type: 'Billing cycle' },
  { id: '283525816', date: 'Oct 12, 2024', amount: 2887.0, status: 'paid', type: 'Billing cycle' },
  { id: '272716303', date: 'Sep 12, 2024', amount: 3148.47, status: 'paid', type: 'Billing cycle' },
  { id: '262201684', date: 'Aug 12, 2024', amount: 2893.53, status: 'paid', type: 'Billing cycle' },
];

export function BillingSection() {
  const [selectedBill, setSelectedBill] = useState<BillingHistory | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Billing</h2>
        <p className="mt-1 text-sm text-gray-400">
          Manage your billing information and view transaction history
        </p>
      </div>

      {/* Current Billing Cycle */}
      <div className="rounded-lg border border-gray-800 bg-gray-900">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Current billing cycle</h3>
              <p className="mt-1 text-sm text-gray-400">
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

          <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-4">
            <div className="flex items-center space-x-3">
              <Icons.CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white">American Express</span>
                  <span className="text-gray-400">•••• 1008</span>
                </div>
                <span className="text-xs text-gray-500">Primary</span>
              </div>
            </div>
            <button className="text-sm text-blue-400 hover:text-blue-300">Change</button>
          </div>

          <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
            <div className="flex items-start space-x-3">
              <Icons.AlertCircle className="mt-0.5 h-5 w-5 text-blue-400" />
              <p className="text-sm text-blue-300">
                You're $4,000.00 away from reaching your billing threshold of $4,000.00 USD
                (platform fee not included). When reached, you will be billed automatically,
                separate from your regular billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-lg border border-gray-800 bg-gray-900">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Billing history</h3>
            <div className="flex items-center space-x-2">
              <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
                <Icons.Search className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
                <Icons.Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="pb-3 text-sm font-medium text-gray-400">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Bill number</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((bill) => (
                  <tr
                    key={bill.id}
                    className="cursor-pointer border-b border-gray-800 hover:bg-gray-800/50"
                    onClick={() => setSelectedBill(bill)}
                  >
                    <td className="py-4 text-white">{bill.date}</td>
                    <td className="py-4 text-gray-400">#{bill.id}</td>
                    <td className="py-4 text-gray-400">{bill.type}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-green-900/30 px-2 py-1 text-xs font-medium text-green-400">
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-4 text-right text-white">${bill.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBill && (
        <BillDetailsModal bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}
    </div>
  );
}
