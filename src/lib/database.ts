// Simple in-memory database implementation
interface DatabaseStore {
  merchants: Map<string, any>;
  passes: Map<string, any>;
  templates: Map<string, any>;
}

const store: DatabaseStore = {
  merchants: new Map(),
  passes: new Map(),
  templates: new Map()
};

export const database = {
  merchants: {
    create: async (data: any) => {
      const id = crypto.randomUUID();
      store.merchants.set(id, { id, ...data });
      return { id, ...data };
    },
    get: async (id: string) => store.merchants.get(id),
    update: async (id: string, data: any) => {
      const merchant = store.merchants.get(id);
      if (!merchant) return null;
      const updated = { ...merchant, ...data };
      store.merchants.set(id, updated);
      return updated;
    }
  },
  passes: {
    create: async (data: any) => {
      const id = crypto.randomUUID();
      store.passes.set(id, { id, ...data });
      return { id, ...data };
    },
    list: async () => Array.from(store.passes.values()),
    get: async (id: string) => store.passes.get(id)
  },
  templates: {
    create: async (data: any) => {
      const id = crypto.randomUUID();
      store.templates.set(id, { id, ...data });
      return { id, ...data };
    },
    list: async () => Array.from(store.templates.values()),
    get: async (id: string) => store.templates.get(id)
  }
};