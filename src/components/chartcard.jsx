// src/components/ChartCard.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ChartCard.css';

const ChartCard = ({ data }) => {
  // Transform data for Recharts: { name: "Jan", revenue: 65000 }
    const chartData = [
        { name: 'Jan', revenue: 65000 },
            { name: 'Feb', revenue: 72000 },
                { name: 'Mar', revenue: 68000 },
                    { name: 'Apr', revenue: 85000 },
                        { name: 'May', revenue: 78000 },
                            { name: 'Jun', revenue: 95000 },
                              ];

                                return (
                                    <div className="chart-card">
                                          <ResponsiveContainer width="100%" height={300}>
                                                  <LineChart data={chartData}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                                                                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000)}k`} />
                                                                                          <Tooltip
                                                                                                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                                                                                                                  labelStyle={{ fontWeight: 'bold' }}
                                                                                                                            />
                                                                                                                                      <Line
                                                                                                                                                  type="monotone"
                                                                                                                                                              dataKey="revenue"
                                                                                                                                                                          stroke="#3b82f6"
                                                                                                                                                                                      strokeWidth={2}
                                                                                                                                                                                                  dot={{ r: 4 }}
                                                                                                                                                                                                              activeDot={{ r: 6 }}
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                </LineChart>
                                                                                                                                                                                                                                      </ResponsiveContainer>
                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                            export default ChartCard;
 * Simple placeholder chart — replace with Recharts or Chart.js later
  */
  const ChartCard = ({ data }) => {
    // Mock data for Jan–Jun
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const values = [65000, 72000, 68000, 85000, 78000, 95000];

          return (
              <div className="chart-container">
                    <div className="chart-axis-y">
                            {Array.from({ length: 5 }).map((_, i) => (
                                      <div key={i} className="axis-label">
                                                  {100000 - (i * 25000)}
                                                            </div>
                                                                    ))}
                                                                          </div>
                                                                                <div className="chart-grid">
                                                                                        {months.map((month, i) => (
                                                                                                  <div key={month} className="chart-column">
                                                                                                              <div
                                                                                                                            className="chart-bar"
                                                                                                                                          style={{ height: `${(values[i] / 100000) * 100}%` }}
                                                                                                                                                      ></div>
                                                                                                                                                                  <div className="chart-label">{month}</div>
                                                                                                                                                                            </div>
                                                                                                                                                                                    ))}
                                                                                                                                                                                          </div>
                                                                                                                                                                                              </div>
                                                                                                                                                                                                );
                                                                                                                                                                                                };

                                                                                                                                                                                                export default ChartCard;t