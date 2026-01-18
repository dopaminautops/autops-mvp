import { clientApi } from '../services/api';
import React, { useState, useEffect } from 'react';
import './ClientRecordsPage.cos';
import ClientCard from '../components/ClientCard';
import ClientFilter from '../components/ClientFilter';
import CSVUploadModal from '../components/CSVUploadModal';
import { clientApi } from '../services/api';

const ClientRecordsPage = () => {
      const [clients, setClients] = useState([]);
        const [loading, setLoading] = useState(true);
          const [activeFilter, setActiveFilter] = useState('All Clients');
            const [category, setCategory] = useState('');
              const [showUploadModal, setShowUploadModal] = useState(false);
              useEffect(() => {
                    const load = async () => {
                        try {
                              const data = await clientApi.getClients({ category });
                                    setClients(data);
                                        } catch (err) {
                                              console.error(err);
                                                  }
                                                    };
                                                      load();
                                                      }, [category]);
              })

                useEffect(() => {
                        fetchClients();
                }, [activeFilter, category]);

                  const fetchClients = async () => {
                        setLoading(true);
                            try {
                                      const params = {};
                                            if (category) params.category = category;
                                                  const data = await clientApi.getClients(params);
                                                        setClients(data);
                            } catch (err) {
                                      console.error('Failed to fetch clients:', err);
                            } finally {
                                      setLoading(false);
                            }
                  };

                    const handleUploadSuccess = (result) => {
                            alert(`${result.message}`);
                                fetchClients();
                    };

                      return (
                            <div className="client-records-page">
                                  <h1>Client Records</h1>

                                        <div className="search-bar">
                                                <input type="text" placeholder="Search clients..." />
                                                      </div>

                                                            <ClientFilter
                                                                    activeFilter={activeFilter}
                                                                            onFilterChange={setActiveFilter}
                                                                                    category={category}
                                                                                            onCategoryChange={setCategory}
                                                                                                  />

                                                                                                        {loading ? (
                                                                                                                    <div className="loading">Loading clients...</div>
                                                                                                        ) : (
                                                                                                                    <div className="client-list">
                                                                                                                              {clients.map((client) => (
                                                                                                                                            <ClientCard key={client.id} client={client} />
                                                                                                                              ))}
                                                                                                                                      </div>
                                                                                                        )}

                                                                                                              <div className="page-actions">
                                                                                                                      <button onClick={() => setShowUploadModal(true)}>📤 Import CSV</button>
                                                                                                                              <button>📥 Export All</button>
                                                                                                                                      <button>🔄 Update CRM</button>
                                                                                                                                            </div>

                                                                                                                                                  <CSVUploadModal
                                                                                                                                                          isOpen={showUploadModal}
                                                                                                                                                                  onClose={() => setShowUploadModal(false)}
                                                                                                                                                                          onUploadSuccess={handleUploadSuccess}
                                                                                                                                                                                />
                                                                                                                                                                                    </div>
                      );
};

export default ClientRecordsPage;
                                                                                                                              ))}
                                                                                                        )
                                                                                                        )}
                      )
                    }
                            }
                            }
                            }
                  }
                })
}