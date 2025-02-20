const API_BASE_URL = 'http://localhost:8000/api';

async function fetchJson(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  words: {
    list: (page = 1, sortBy?: string, order?: 'asc' | 'desc') => {
      const params = new URLSearchParams({ page: String(page) });
      if (sortBy) params.append('sort_by', sortBy);
      if (order) params.append('order', order);
      return fetchJson(`/words?${params}`);
    },
    get: (id: string) => fetchJson(`/words/${id}`),
  },
  groups: {
    list: (page = 1) => fetchJson(`/groups?page=${page}`),
    get: (id: string) => fetchJson(`/groups/${id}`),
  },
  studyActivities: {
    list: (page = 1) => fetchJson(`/study-activities?page=${page}`),
    get: (id: string) => fetchJson(`/study-activities/${id}`),
  },
  sessions: {
    list: (page = 1) => fetchJson(`/study_sessions?page=${page}`),
    get: (id: string) => fetchJson(`/study_sessions/${id}`),
    review: (sessionId: string, data: any) => 
      fetchJson(`/study_sessions/${sessionId}/review`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  dashboard: {
    lastStudySession: () => fetchJson('/dashboard/last_study_session'),
    studyProgress: () => fetchJson('/dashboard/study_progress'),
    quickStats: () => fetchJson('/dashboard/quick-stats'),
  },
  // ... other API endpoints
}; 