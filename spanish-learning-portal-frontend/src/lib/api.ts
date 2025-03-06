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
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  baseUrl: API_BASE_URL,
  words: {
    list(page = 1, sortBy?: string, order?: 'asc' | 'desc') {
      return fetchJson(`/words/?page=${page}${sortBy ? `&sort=${sortBy}` : ''}${order ? `&order=${order}` : ''}`);
    },
    get(id: string) {
      return fetchJson(`/words/${id}/`);
    },
    getTranslationGame() {
      return fetchJson('/translation-game/');
    },
  },
  studyActivities: {
    list(page = 1) {
      return fetchJson(`/study-activities/?page=${page}`);
    },
    get(id: string) {
      return fetchJson(`/study-activities/${id}/`);
    },
  },
  sessions: {
    list(page = 1) {
      return fetchJson(`/sessions/?page=${page}`);
    },
    get(id: string) {
      return fetchJson(`/sessions/${id}/`);
    },
    review(sessionId: string, data: any) {
      return fetchJson(`/sessions/${sessionId}/review/`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  conversations: {
    generate(inputText: string) {
      return fetchJson('/conversations/generate/', {
        method: 'POST',
        body: JSON.stringify({ input_text: inputText }),
      });
    },
    retrieveSimilar(embedding: string) {
      return fetchJson('/conversations/retrieve-similar/', {
        method: 'POST',
        body: JSON.stringify({ embedding }),
      });
    },
  },
  dashboard: {
    lastStudySession() {
      return fetchJson('/dashboard/last-study-session/');
    },
    studyProgress() {
      return fetchJson('/dashboard/study-progress/');
    },
    quickStats() {
      return fetchJson('/dashboard/quick-stats/');
    },
  },
  questions: {
    save(questionData: any) {
      return fetchJson('/questions/save/', {
        method: 'POST',
        body: JSON.stringify(questionData),
      });
    },
    listSaved() {
      return fetchJson('/questions/list/');
    },
    generateAudio(questionId: string) {
      return fetchJson(`/questions/${questionId}/generate-audio/`, {
        method: 'POST',
      });
    },
  },
  youtube: {
    processVideo(videoUrl: string) {
      return fetchJson('/process-youtube-video/', {
        method: 'POST',
        body: JSON.stringify({ video_url: videoUrl }),
      });
    },
    searchContent(query: string) {
      return fetchJson('/search-similar-content/', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
    },
  },
};
