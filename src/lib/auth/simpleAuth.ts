// Simple in-memory auth implementation
interface User {
  id: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  users: Map<string, { email: string; password: string }>;
}

const store: AuthStore = {
  user: null,
  users: new Map(),
};

export const simpleAuth = {
  signIn: async (email: string, password: string): Promise<User> => {
    const user = store.users.get(email);

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const authenticatedUser = { id: crypto.randomUUID(), email };
    store.user = authenticatedUser;
    return authenticatedUser;
  },

  signUp: async (email: string, password: string): Promise<User> => {
    if (store.users.has(email)) {
      throw new Error('An account with this email already exists');
    }

    store.users.set(email, { email, password });
    return { id: crypto.randomUUID(), email };
  },

  signOut: async () => {
    store.user = null;
  },

  getCurrentUser: () => store.user,
};
