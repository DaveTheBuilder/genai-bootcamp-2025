import React from 'react';
import { api } from '../../lib/api';
import { Group } from '../../lib/types';
import Card from '../../components/shared/Card';

const Groups: React.FC = () => {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await api.groups.list();
        setGroups(data.results);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Word Groups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} title={group.name}>
            <p className="text-gray-600 dark:text-gray-300">
              {group.words_count} words
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Groups; 