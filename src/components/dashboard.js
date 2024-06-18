// Dashboard.js
import React from 'react';
import Header from './parts/header.js';
import Sidebar from './parts/sidebar.js';

const Dashboard = ({ children, title }) => {
  return (
    <div className="dashboard">
      <Header title={title} />
      <div className="dashboard-content">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;
