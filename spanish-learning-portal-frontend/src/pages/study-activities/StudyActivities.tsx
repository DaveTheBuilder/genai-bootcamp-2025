import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { StudyActivity } from '../../lib/types';
import Card from '../../components/shared/Card';

const StudyActivities: React.FC = () => {
  const [activities, setActivities] = React.useState<StudyActivity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await api.studyActivities.list();
        setActivities(data.results);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load study activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Study Activities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} title={activity.name}>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {activity.description}
            </p>
            <Link
              to={`/study-activities/${activity.id}`}
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
            >
              View Details
            </Link>
          </Card>
        ))}
        <Card title="Timed Activity">
          <Link to="/study-activities/timed" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
            Start Timed Activity
          </Link>
        </Card>
        <Card title="Missing Letters">
          <Link to="/study-activities/missing-letters" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
            Start Missing Letters Game
          </Link>
        </Card>
        <Card title="Hangman">
          <Link to="/study-activities/hangman" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
            Start Hangman Game
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default StudyActivities; 