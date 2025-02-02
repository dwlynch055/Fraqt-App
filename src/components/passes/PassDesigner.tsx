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
      points: true
    }
  });

  const [activeTab, setActiveTab] = useState<'items' | 'barcode'>('items');

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Left Panel - Design Controls */}
      <div className="w-80 bg-black border-r border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('items')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'items'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Items
            </button>
            <button
              onClick={() => setActiveTab('barcode')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 ${
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={design.backgroundColor}
                  onChange={(e) =>
                    setDesign({ ...design, backgroundColor: e.target.value })
                  }
                  className="w-full h-10 rounded cursor-pointer bg-gray-900 border border-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logo
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-800 border-dashed rounded-lg cursor-pointer hover:border-white">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icons.Upload className="w-8 h-8 mb-3 text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fields
                </label>
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
                        className="w-4 h-4 text-blue-500 bg-gray-900 border-gray-800 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-300 capitalize">
                        {field}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'barcode' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Show Barcode
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={design.showBarcode}
                    onChange={(e) =>
                      setDesign({ ...design, showBarcode: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-500 bg-gray-900 border-gray-800 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Display barcode on pass
                  </span>
                </label>
              </div>

              {design.showBarcode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className={`p-4 text-center rounded-lg border ${
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Barcode Content
                    </label>
                    <input
                      type="text"
                      value={design.barcodeContent}
                      onChange={(e) =>
                        setDesign({ ...design, barcodeContent: e.target.value })
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
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
      <div className="flex-1 bg-gray-900 p-8 overflow-y-auto">
        <div className="max-w-sm mx-auto">
          {/* Pass Preview */}
          <div
            className="aspect-[1.586/1] rounded-xl shadow-2xl relative overflow-hidden transition-all"
            style={{ backgroundColor: design.backgroundColor }}
          >
            {/* Logo Area */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center">
              {design.logo ? (
                <img src={design.logo} alt="Logo" className="w-8 h-8" />
              ) : (
                <Icons.Image className="w-6 h-6 text-white/40" />
              )}
            </div>

            {/* Fields */}
            <div className="absolute top-20 left-4 right-4 space-y-4">
              {design.fields.name && (
                <div>
                  <div className="text-xs text-white/60">NAME</div>
                  <div className="text-sm text-white font-medium">John Doe</div>
                </div>
              )}
              {design.fields.tier && (
                <div>
                  <div className="text-xs text-white/60">TIER</div>
                  <div className="text-sm text-white font-medium">Gold Member</div>
                </div>
              )}
              {design.fields.points && (
                <div>
                  <div className="text-xs text-white/60">POINTS</div>
                  <div className="text-sm text-white font-medium">2,500</div>
                </div>
              )}
            </div>

            {/* Barcode */}
            {design.showBarcode && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="w-full h-16 bg-white rounded-lg flex items-center justify-center">
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
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Icons.Smartphone className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Icons.RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}