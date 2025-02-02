import React, { useState } from 'react';
import { Icons } from '../../icons';

interface Certificate {
  passTypeId: string;
  teamName: string;
  validTo: string;
}

export function CertificatesSection() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Apple Certificates</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your Apple Wallet certificates for commercial pass distribution
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icons.AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-300">
                You must upload your own certificate to be able to commercially issue passes.
                Apple requires you to have an{' '}
                <a
                  href="https://developer.apple.com/programs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Apple Developer Account
                </a>{' '}
                to create your own Apple Wallet Certificates.
              </p>
              <p className="text-sm text-blue-300/80">
                Certificates need to be renewed yearly. This renewal requires access to the
                Apple Developer account that the certificate originates from.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black rounded-lg border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pass Type ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Team Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Valid To</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8">
                      <div className="text-center">
                        <Icons.Key className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No certificates added yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.passTypeId} className="border-b border-gray-800">
                      <td className="py-4 px-4 text-white">{cert.passTypeId}</td>
                      <td className="py-4 px-4 text-gray-400">{cert.teamName}</td>
                      <td className="py-4 px-4 text-gray-400">{cert.validTo}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                            <Icons.Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black rounded-xl border border-gray-800 w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Upload Certificate</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-400">
                <p>
                  Before you can upload a production certificate, you will need to download our CSR
                  (Certificate Signing Request). You will then need to upload our CSR in the{' '}
                  <a
                    href="https://developer.apple.com/account/resources/certificates/list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Apple Developer Portal
                  </a>{' '}
                  when generating your Pass Type ID Certificate.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Download CSR
                </button>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  I already have a CSR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}