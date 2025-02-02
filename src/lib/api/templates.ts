// Mock templates API implementation
export async function listTemplates() {
  return [];
}

export async function getTemplate(id: string) {
  return null;
}

export async function createTemplate(template: any) {
  return { id: '1', ...template };
}

export async function updateTemplate(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteTemplate(id: string) {
  return { success: true };
}

// Custom Fields
export async function listCustomFields(templateId: string) {
  return [];
}

export async function getCustomField(id: string) {
  return null;
}

export async function createCustomField(field: any) {
  return { id: '1', ...field };
}

export async function updateCustomField(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteCustomField(id: string) {
  return { success: true };
}