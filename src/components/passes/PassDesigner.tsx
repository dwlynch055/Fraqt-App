import React, { useState } from 'react';
import { Icons } from '../../components/icons';

interface PassDesignState {
  backgroundColor: string;
  logo?: string;
  showBarcode: boolean;
  barcodeType: 'qr' | 'pdf417' | 'aztec' | 'code128';
  barcodeContent: string;
  fields: {
    name: boolean;
    tier: boolean;
    points: boolean;
  };
}

export function PassDesigner() {
  const [design, setDesign] = useState<PassDesignState>({
    backgroundColor: '#FFD700',
    showBarcode: true,
    barcodeType: 'pdf417',
    barcodeContent: '${pid}',
    fields: {
      name: true,
      tier: true,
      points: true,
    },
  });

  const [activeTab, setActiveTab] = useState<'items' | 'barcode'>('items');

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Left Panel - Design Controls */}
      <div className="w-80 overflow-y-auto border-r border-gray-800 bg-black">
        <div className="space-y-6 p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('items')}
              className={`border-b-2 px-4 pb-3 text-sm font-medium ${
                activeTab === 'items'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Items
            </button>
            <button
              onClick={() => setActiveTab('barcode')}
              className={`border-b-2 px-4 pb-3 text-sm font-medium ${
                activeTab === 'barcode'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Barcode
            </button>
          </div>

          {activeTab === 'items' && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Background Color
                </label>
                <input
                  type="color"
                  value={design.backgroundColor}
                  onChange={(e) => setDesign({ ...design, backgroundColor: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded border border-gray-800 bg-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Logo</label>
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800 hover:border-white">
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <Icons.Upload className="mb-3 h-8 w-8 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">SVG, PNG or JPG (MAX. 800x800px)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Fields</label>
                <div className="space-y-3">
                  {Object.entries(design.fields).map(([field, enabled]) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) =>
                          setDesign({
                            ...design,
                            fields: {
                              ...design.fields,
                              [field]: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4 rounded border-gray-800 bg-gray-900 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm capitalize text-gray-300">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'barcode' && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Show Barcode</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={design.showBarcode}
                    onChange={(e) => setDesign({ ...design, showBarcode: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-800 bg-gray-900 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Display barcode on pass</span>
                </label>
              </div>

              {design.showBarcode && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Barcode Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['qr', 'pdf417', 'aztec', 'code128'].map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            setDesign({
                              ...design,
                              barcodeType: type as PassDesignState['barcodeType'],
                            })
                          }
                          className={`rounded-lg border p-4 text-center ${
                            design.barcodeType === type
                              ? 'border-blue-500 bg-blue-500/10 text-white'
                              : 'border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          <span className="text-sm uppercase">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Barcode Content
                    </label>
                    <input
                      type="text"
                      value={design.barcodeContent}
                      onChange={(e) => setDesign({ ...design, barcodeContent: e.target.value })}
                      className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter barcode content"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Use ${'{pid}'} to include the pass ID
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Pass Preview */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-8">
        <div className="mx-auto max-w-sm">
          {/* Pass Preview */}
          <div
            className="relative aspect-[1.586/1] overflow-hidden rounded-xl shadow-2xl transition-all"
            style={{ backgroundColor: design.backgroundColor }}
          >
            {/* Logo Area */}
            <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black/20">
              {design.logo ? (
                <img src={design.logo} alt="Logo" className="h-8 w-8" />
              ) : (
                <Icons.Image className="h-6 w-6 text-white/40" />
              )}
            </div>

            {/* Fields */}
            <div className="absolute left-4 right-4 top-20 space-y-4">
              {design.fields.name && (
                <div>
                  <div className="text-xs text-white/60">NAME</div>
                  <div className="text-sm font-medium text-white">John Doe</div>
                </div>
              )}
              {design.fields.tier && (
                <div>
                  <div className="text-xs text-white/60">TIER</div>
                  <div className="text-sm font-medium text-white">Gold Member</div>
                </div>
              )}
              {design.fields.points && (
                <div>
                  <div className="text-xs text-white/60">POINTS</div>
                  <div className="text-sm font-medium text-white">2,500</div>
                </div>
              )}
            </div>

            {/* Barcode */}
            {design.showBarcode && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex h-16 w-full items-center justify-center rounded-lg bg-white">
                  {/* Placeholder for actual barcode rendering */}
                  <div className="text-xs text-gray-400">
                    {design.barcodeType.toUpperCase()} BARCODE
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Controls */}
          <div className="mt-8 flex justify-center space-x-4">
            <button className="rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700">
              <Icons.Smartphone className="h-4 w-4" />
            </button>
            <button className="rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700">
              <Icons.RotateCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
