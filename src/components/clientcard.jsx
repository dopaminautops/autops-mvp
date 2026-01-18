import React from 'react';
import './ClientCard.cos';
import { Link } from 'react-router-dom';

const ClientCard = ({ client }) => {
  const formatPhone = (p) => p ? `+1 ${p.slice(0,3)}-${p.slice(3,6)}-${p.slice(6)}` : '';

    return (
        <div className="client-card">
              <div className="client-avatar">{client.name.charAt(0)}</div>
                    <div className="client-info">
                            <h3>{client.name}</h3>
                                    <p className="contact"><span>📞</span> {formatPhone(client.phone)}</p>
                                            <p className="contact"><span>✉️</span> {client.email}</p>
                                                    <div className="stats">
                                                              <span>Last: {new Date(client.last_booking).toLocaleDateString()}</span>
                                                                        <span>Total: {client.total_bookings}</span>
                                                                                </div>
                                                                                        <div className="tags">
                                                                                                  {client.is_vip && <span className="tag vip">VIP</span>}
                                                                                                            {client.is_frequent && <span className="tag frequent">Frequent</span>}
                                                                                                                      {client.category && <span className="tag category">{client.category}</span>}
                                                                                                                              </div>
                                                                                                                                      <div className="actions">
                                                                                                                                                <Link to={`/client/${client.id}`} className="btn primary">View Profile<
                                                                                                                                                <Link to={`/client/${client.id}`} className="view-profile-btn">
                                                                                                                                                  View Profile
                                                                                                                                                  </Link>>
                                                                                                                                                          <button className="btn secondary">Export</button>
                                                                                                                                                                  </div>
                                                                                                                                                                        </div>
                                                                                                                                                                            </div>
                                                                                                                                                                              );
                                                                                                                                                                              };

                                                                                                                                                                              export default ClientCard;