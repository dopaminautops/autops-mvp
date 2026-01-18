import React, { useState } from 'react';
import './CSVUploadModal.cos';
import { clientApi } from '../services/api';

const CSVUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
      const [file, setFile] = useState(null);
        const [loading, setLoading] = useState(false);
          const [error, setError] = useState('');

            if (!isOpen) return null;

              const handleFileChange = (e) => {
                    setFile(e.target.files[0]);
                        setError('');
              };

                const handleUpload = async () => {
                        if (!file) {
                                  setError('Please select a CSV file');
                                        return;
                        }

                            setLoading(true);
                                setError('');

                                    try {
                                              const result = await clientApi.uploadClientsCSV(file);
                                                    onUploadSuccess(result);
                                                          onClose();
                                    } catch (err) {
                                              setError(err.response?.data?.detail || 'Upload failed. Check file format.');
                                    } finally {
                                              setLoading(false);
                                    }
                };

                  return (
                        <div className="modal-overlay">
                              <div className="modal-content">
                                      <h2>Upload Clients via CSV</h2>
                                              <p>Columns: name, phone, email, address, category, nps_score, satisfaction_score, is_vip, is_frequent</p>
                                                      <input type="file" accept=".csv" onChange={handleFileChange} />
                                                              {error && <p className="error">{error}</p>}
                                                                      <div className="modal-actions">
                                                                                <button onClick={onClose}>Cancel</button>
                                                                                          <button onClick={handleUpload} disabled={loading}>
                                                                                                      {loading ? 'Uploading...' : 'Upload'}
                                                                                                                </button>
                                                                                                                        </div>
                                                                                                                              </div>
                                                                                                                                  </div>
                  );
};

export default CSVUploadModal;
                  )
                                    }
                                    }
                                    }
                        }
                }
              }
}