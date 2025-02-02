// Mock storage implementation
export async function uploadFile(file: File, bucket: string, path: string) {
  return {
    path: `${path}/${file.name}`,
    url: `https://example.com/storage/${bucket}/${path}/${file.name}`
  };
}

export async function deleteFile(bucket: string, path: string) {
  return { success: true };
}

export async function listFiles(bucket: string, path: string) {
  return [];
}

export function getPublicUrl(bucket: string, path: string) {
  return `https://example.com/storage/${bucket}/${path}`;
}