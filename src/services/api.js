// pwa-app/src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const clientApi = {
  // Fetch clients from backend
    getClients: async (params = {}) => {
        const url = new URL('/clients', API_BASE);
            Object.keys(params).forEach(key => {
                  if (params[key] != null) {
                          url.searchParams.append(key, params[key]);
                                }
                                    });

                                        const res = await fetch(url);
                                            if (!res.ok) {
                                                  const error = await res.json().catch(() => ({}));
                                                        throw new Error(error.detail || `Failed to load clients (${res.status})`);
                                                            }
                                                                return res.json();
                                                                  },

                                                                    // Upload CSV file
                                                                      uploadClientsCSV: async (file) => {
                                                                          const formData = new FormData();
                                                                              formData.append('file', file);

                                                                                  const res = await fetch(`${API_BASE}/clients/upload-csv`, {
                                                                                        method: 'POST',
                                                                                              body: formData,
                                                                                                  });

                                                                                                      if (!res.ok) {
                                                                                                            const error = await res.json().catch(() => ({}));
                                                                                                                  throw new Error(error.detail || `Upload failed (${res.status})`);
                                                                                                                      }
                                                                                                                          return res.json();
                                                                                                                            },
                                                                                                                            };