// Mock certificates API implementation
export async function listCertificates(merchantId: string) {
  return [];
}

export async function uploadCertificate(merchantId: string, file: File) {
  return {
    id: '1',
    filename: file.name,
    url: 'https://example.com/cert.p12',
  };
}

export async function deleteCertificate(merchantId: string) {
  return { success: true };
}

export async function validateCertificate(file: File) {
  return {
    valid: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    teamId: 'TEAM123',
    passTypeId: 'pass.com.example',
  };
}
