// frontend/src/pages/template page/TeamManagementPage.jsx

import React, { useEffect, useState } from 'react';
import './TeamManagementPage.css';

const TeamManagementPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Helper: Get member name by ID
  const getMemberName = (id) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        setTeamMembers(data);
      } catch (err) {
        console.error("Failed to load team:", err);
      }
    };
    fetchTeam();
  }, []);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || member.department.toLowerCase().includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="team-management-page">
      <header className="page-header">
        <h1>Team Management</h1>
      </header>

      <div className="search-actions">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <button className="add-btn">+ Add New Member</button>
          <button className="invite-btn">✉️ Invite</button>
        </div>
      </div>

      <div className="department-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Departments
        </button>
        <button
          className={`filter-btn ${filter === 'marketing' ? 'active' : ''}`}
          onClick={() => setFilter('marketing')}
        >
          Marketing
        </button>
        <button
          className={`filter-btn ${filter === 'developer' ? 'active' : ''}`}
          onClick={() => setFilter('developer')}
        >
          Developer
        </button>
      </div>

      <div className="team-list">
        {filteredMembers.map((member) => (
          <div key={member.id} className="team-member-card">
            <img
              src={member.avatar || "https://ui-avatars.com/api/?name=John+Doe&background=random"}
              alt={member.name}
              className="avatar"
            />
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="email">{member.email}</p>
              
              {/* Role & Status */}
              <div className="tags">
                <span className={`role ${member.role.toLowerCase()}`}>{member.role}</span>
                <span className={`status ${member.status.toLowerCase()}`}>
                  <span className="dot"></span> {member.status}
                </span>
              </div>

              {/* PERMISSIONS */}
              <div className="permissions-section">
                <strong>Permissions:</strong>
                <div className="permissions-list">
                  {member.permissions.map((perm, idx) => (
                    <span key={idx} className="permission-badge">
                      {perm.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* DELEGATION */}
              <div className="delegation-section">
                {member.delegates.length > 0 && (
                  <div className="delegation-item">
                    <strong>Can act for:</strong> {member.delegates.map(getMemberName).join(', ')}
                  </div>
                )}
                {member.can_delegate_to.length > 0 && (
                  <div className="delegation-item">
                    <strong>Acted for by:</strong> {member.can_delegate_to.map(getMemberName).join(', ')}
                  </div>
                )}
                {(member.delegates.length === 0 && member.can_delegate_to.length === 0) && (
                  <div className="delegation-item none">
                    No delegation assigned
                  </div>
                )}
              </div>
            </div>
            <div className="actions">
              <button className="edit-btn">✏️</button>
              <button className="delete-btn">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagementPage;