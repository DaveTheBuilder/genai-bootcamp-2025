import React from 'react';
import { api } from '../../lib/api';
import { Word } from '../../lib/types';
import Table from '../../components/shared/Table';
import Pagination from '../../components/shared/Pagination';

const Words: React.FC = () => {
  const [words, setWords] = React.useState<Word[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [sortKey, setSortKey] = React.useState<keyof Word>('spanish');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const data = await api.words.list(currentPage, sortKey, sortDirection);
        setWords(data.results);
        setTotalPages(Math.ceil(data.count / 50));
      } catch (err) {
        console.error('Error fetching words:', err);
        setError('Failed to load words');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [currentPage, sortKey, sortDirection]);

  const handleSort = (key: keyof Word) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const columns = [
    { key: 'spanish', header: 'Spanish' },
    { key: 'english', header: 'English' },
    { 
      key: 'parts',
      header: 'Type',
      render: (value: any) => value.type
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Words</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <Table
          data={words}
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Words; 