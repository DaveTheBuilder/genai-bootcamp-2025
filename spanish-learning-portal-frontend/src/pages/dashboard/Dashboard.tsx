import React from 'react';
import Card from '../../components/shared/Card';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Recent Activity">
          <p>Your recent learning activities will appear here.</p>
        </Card>
        <Card title="Progress">
          <p>Your learning progress will be shown here.</p>
        </Card>
        <Card title="Study Streak">
          <p>Your study streak information will be displayed here.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 