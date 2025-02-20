import React from 'react';
import { api } from '../../lib/api';
import { Session } from '../../lib/types';
import Table from '../../components/shared/Table';

const Sessions: React.FC = () => {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await api.sessions.list();
        setSessions(data.results);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Study Sessions</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <Table
          data={sessions}
          columns={[
            { key: 'group_name', header: 'Group' },
            { key: 'start_time', header: 'Started', render: (value) => new Date(value as string).toLocaleString() },
            { key: 'review_items_count', header: 'Reviews' }
          ]}
        />
      </div>
    </div>
  );
};

export default Sessions; 