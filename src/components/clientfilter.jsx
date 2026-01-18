import React from 'react';
import './ClientFilter.cos';

const ClientFilter = ({ activeFilter, onFilterChange, category, onCategoryChange }) => {
  return (
      <div className="client-filter">
            <div className="filter-buttons">
                    {['All Clients', 'Recent', 'Top Clients', 'Active'].map((filter) => (
                              <button
                                          key={filter}
                                                      className={activeFilter === filter ? 'active' : ''}
                                                                  onClick={() => onFilterChange(filter)}
                                                                            >
                                                                                        {filter}
                                                                                                  </button>
                                                                                                          ))}
                                                                                                                </div>
                                                                                                                      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
                                                                                                                              <option value="">Category</option>
                                                                                                                                      <option value="VIP">VIP</option>
                                                                                                                                              <option value="Premium">Premium</option>
                                                                                                                                                      <option value="New">New</option>
                                                                                                                                                              <option value="Active">Active</option>
                                                                                                                                                                    </select>
                                                                                                                                                                        </div>
                                                                                                                                                                          );
                                                                                                                                                                          };

                                                                                                                                                                          export default ClientFilter;