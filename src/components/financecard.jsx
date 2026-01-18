// src/components/FinanceCard.jsx
import React from 'react';
import './FinanceCard.css';

/**
 * FinanceCard — Reusable card for financial metrics (revenue, expenses, profit)
  * @param {string} period - e.g., "2026-Q1"
   * @param {number} revenue - e.g., 150000
    * @param {number} expenses - e.g., 80000
     * @param {number} profit - e.g., 70000
      */
      const FinanceCard = ({ period, revenue, expenses, profit }) => {
        return (
            <div className="finance-card">
                  <h3 className="finance-period">{period}</h3>
                        <div className="finance-metrics">
                                <div className="metric">
                                          <span className="metric-label">Revenue</span>
                                                    <span className="metric-value revenue">${revenue.toLocaleString()}</span>
                                                            </div>
                                                                    <div className="metric">
                                                                              <span className="metric-label">Expenses</span>
                                                                                        <span className="metric-value expenses">${expenses.toLocaleString()}</span>
                                                                                                </div>
                                                                                                        <div className="metric total">
                                                                                                                  <span className="metric-label">Profit</span>
                                                                                                                            <span className={`metric-value profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                                                                                                                                        ${Math.abs(profit).toLocaleString()}
                                                                                                                                                    {profit < 0 && ' loss'}
                                                                                                                                                              </span>
                                                                                                                                                                      </div>
                                                                                                                                                                            </div>
                                                                                                                                                                                </div>
                                                                                                                                                                                  );
                                                                                                                                                                                  };

                                                                                                                                                                                  export default FinanceCard;