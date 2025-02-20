import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationMenu from './components/layout/NavigationMenu';
import Dashboard from './pages/dashboard/Dashboard';
import StudyActivities from './pages/study-activities/StudyActivities';
import TimedActivity from './pages/study-activities/TimedActivity';
import MissingLetters from './pages/study-activities/MissingLetters';
import Hangman from './pages/study-activities/Hangman';
import Words from './pages/words/Words';
import Groups from './pages/groups/Groups';
import Sessions from './pages/sessions/Sessions';
import Settings from './pages/settings/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <NavigationMenu />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study-activities" element={<StudyActivities />} />
            <Route path="/study-activities/timed" element={<TimedActivity />} />
            <Route path="/study-activities/missing-letters" element={<MissingLetters />} />
            <Route path="/study-activities/hangman" element={<Hangman />} />
            <Route path="/words" element={<Words />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;