import React from 'react';
import { Icons } from '../../icons';

interface BillDetailsModalProps {
  bill: {
    id: string;
    date: string;
    amount: number;
    status: string;
    type: string;
  };
  onClose: () => void;
}

export function BillDetailsModal({ bill, onClose }: BillDetailsModalProps) {
  const handleDownload = () => {
    // In a real app, this would trigger an API call to get the PDF/invoice
    console.log('Downloading bill:', bill.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-white">Bill #{bill.id}</h3>
            <span className="inline-flex items-center rounded-full bg-green-900/30 px-2 py-1 text-xs font-medium text-green-400">
              {bill.status}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-1 text-sm text-gray-400">Bill Date</div>
              <div className="text-white">{bill.date}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-400">Amount</div>
              <div className="text-white">${bill.amount.toFixed(2)}</div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="flex items-center space-x-3">
              <Icons.CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white">American Express</span>
                  <span className="text-gray-400">•••• 1008</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 py-3">
              <span className="text-gray-400">Platform fees</span>
              <span className="text-white">$2,000.00</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 py-3">
              <span className="text-gray-400">Usage fees</span>
              <span className="text-white">${(bill.amount - 2000).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-lg font-medium text-white">Total</span>
              <span className="text-lg font-medium text-white">${bill.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-800 px-6 py-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white">
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Icons.Download className="mr-2 h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
