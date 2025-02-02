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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-white">Bill #{bill.id}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
              {bill.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Bill Date</div>
              <div className="text-white">{bill.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Amount</div>
              <div className="text-white">${bill.amount.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icons.CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white">American Express</span>
                  <span className="text-gray-400">•••• 1008</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Platform fees</span>
              <span className="text-white">$2,000.00</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Usage fees</span>
              <span className="text-white">${(bill.amount - 2000).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-lg font-medium text-white">Total</span>
              <span className="text-lg font-medium text-white">${bill.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-800 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}